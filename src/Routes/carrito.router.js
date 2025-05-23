import { Router } from "express";
import { agregarProductoCarrito, crearNewCarrito, getCarrito } from "../Controllers/carrito.controller.js";
const router = Router();
router.get("/:cid", getCarrito);
router.post("/", crearNewCarrito);
router.post("/:cid/productos/:pid", agregarProductoCarrito);
export default router;