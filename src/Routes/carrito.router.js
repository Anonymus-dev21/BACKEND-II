import { Router } from "express";
import { authMiddleware, authMiddlewareAdmin } from "../middlewares/auth.middleware.js";
import { agregarProductoCarrito, crearNewCarrito, getCarrito, finalizarCompra } from "../Controllers/carrito.controller.js";
const router = Router();
router.get("/:cid", getCarrito);
router.post("/", crearNewCarrito);
router.post("/:cid/productos/:pid", authMiddleware, agregarProductoCarrito);
router.put("/purchase/:cid", authMiddleware, finalizarCompra)
export default router;