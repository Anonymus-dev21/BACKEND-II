import Carrito from "../Models/cart.model.js";
import { isValidObjectId } from "mongoose";
import Producto from "../Models/products.model.js";
import { TicketService } from "../Service/ticket.service.js";
import {TicketDto} from "../dtos/ticket.dto.js"
import { TicketRepository } from "../Repository/ticket.repository.js";
import { UserService } from "../Service/user.service.js";
import { MailService } from "../Service/email.service.js";
const userService = new UserService();
const ticketService = new TicketService();
const emailService = new MailService();
export const getCarrito = async (req, res) => {
    try{
    const cid = req.params.cid;
    if (!cid) {
      res.status(400).json({error: "Falta el id del carrito"});
      return;
    } else if ( !isValidObjectId(cid)) {
      res.status(400).json({error: "El id del carrito no es valido"});
      return;
    }
  
    const cart = await Carrito.findOne({ _id: cid }).populate("products.product");
  
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado", cart: [] });
      }
  
      
      const total = cart.products.reduce((sum, item) => {
        return sum + (item.product.precio * item.quantity);
      }, 0);
  
     
      res.status(200).json({ ...cart.toObject(), total });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el carrito" });
    }
  }
  export const crearNewCarrito = async (req, res) => {
    try {
      const newCart = new Carrito(req.body);
      await newCart.save();
      res.status(201).json({ message: "Carrito creado", cart: newCart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el carrito" });
    }
  }

  export const agregarProductoCarrito = async (req, res) => {
   
    const user_id = req.user._id;
    if (!user_id) {
      res.status(400).json({error: "Falta el id del usuario"});
      return;
    }
    const {cid, pid} = req.params;

    if (!cid) {
      res.status(400).json({error: "Falta el id del carrito"});
      return;
    } else if (!isValidObjectId(cid)) {
      res.status(400).json({error: "El id del carrito no es valido"});
      return;
    } else if (!pid) {
      res.status(400).json({error: "Falta el id del producto"});
      return;
    } else if (!isValidObjectId(pid)) {
      res.status(400).json({error: "El id del producto no es valido"});
      return;
    }
    let quantity = parseInt(req.body.quantity);
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Elige una cantidad válida para agregar" });
    }
    
    const product = await Producto.findById(pid);
    if(!product){
      res.status(404).json({error: "Producto no encontrado"});
      return;
    }
  
    if (product.stock < quantity) {
      return res.status(400).json({ error: "No hay suficiente stock" });
    }
    const cart = await Carrito.findOne({user: user_id,});
    if (!cart) {
        const newCart = new Carrito({ user: user_id, products: [] });
        await newCart.save();
        cart = newCart;
    }
    
    const existingIndex = cart.products.findIndex(p => p.product.equals(pid));
    if (existingIndex !== -1) {
      if(product.stock < cart.products[existingIndex].quantity + quantity){
        quantity = product.stock;
      } else {
        quantity = cart.products[existingIndex].quantity + quantity;
      }
      cart.products[existingIndex].quantity = quantity;
      
    } else {
      
      cart.products.push({product: pid, quantity: quantity});
    }
   
    await product.save();
    await cart.save();
    res.status(201).json({ message: "Producto agregado al carrito" });
  }
  
  export const finalizarCompra = async (req, res) => {
    const cid = req.params.cid;
    
    try{
        const user_id = req.user._id;
        const user = await userService.getCurrentUser(user_id);
        if(!user){
          return res.status(404).json({ error: "Hubo un error en la compra intentalo mas tarde" });
        }
        const existCart = await Carrito.findOne({ _id: cid });
        if (!existCart) {
          return res.status(404).json({ error: "Hubo un error en la compra intentalo mas tarde" });
        }
        const cart = await Carrito.findById(cid).populate("products.product");
        if(cart.products.length === 0){
          return res.status(404).json({ error: "El carrito esta vacio" });
        }
        for (const item of cart.products) {
          const prod = item.product;
          const qty = item.quantity;
    
          // Caso 1: stock 0 → cancelar y eliminar ese item
          if (prod.stock === 0) {
            // Guardamos los cambios al carrito (sin este producto)
            cart.products = cart.products.filter(p => !p.product._id.equals(prod._id));
            await cart.save();
    
            return res.status(400).json({
              status: "error",
              error: `Compra cancelada: "${prod.title}" no tiene stock. Se eliminó del carrito.`
            });
          }
          // Caso 2: stock insuficiente → ajustar cantidad y cancelar
          if (prod.stock < qty) {
            item.quantity = prod.stock;
            await cart.save();
            return res.status(400).json({
              status: "error",
              error: `Compra cancelada: stock insuficiente para "${prod.title}". Cantidad ajustada a ${prod.stock}. Por favor, revisa tu carrito e intenta de nuevo.`
            });
          }
        }
        
        for (const item of cart.products) {
          const prod = item.product;
          const qty = item.quantity;
          prod.stock -= qty;
          await prod.save();
        }
        const total = cart.products.reduce((sum, item) => {
          return sum + (item.product.precio * item.quantity);
        }, 0);

        cart.products = [];
        await cart.save();

        const ticket = await ticketService.issueTicket({ amount: total, purchaser: user.email });
        await MailService.sendPurchaseReceipt(  user.email, ticket.code, total, ticket.purchase_datetime);
        return res.status(200).json({ status: "success", payload: TicketDto.fromModel( ticket) });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al finalizar la compra" });
    }
    
  }