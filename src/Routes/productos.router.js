import {Router} from "express";

import { authMiddleware, authMiddlewareAdmin } from "../middlewares/auth.middleware.js";
import { getProducts, pedirDetalleProducto, crearProducto, actualizarProducto, eliminarProducto } from "../Controllers/productos.controller.js";
const router = Router();
router.get("/", authMiddleware, getProducts); 
router.get("/:pid", authMiddleware, pedirDetalleProducto);
router.post("/",  authMiddlewareAdmin, crearProducto); 
router.put("/:pid", authMiddlewareAdmin,actualizarProducto);
router.delete("/:pid", authMiddlewareAdmin, eliminarProducto);



export default router;