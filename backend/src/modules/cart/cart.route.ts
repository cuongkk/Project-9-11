import { Router } from "express";
import { CartController } from "./cart.controller";
import { validate } from "../../middlewares/validate.middleware";
import { cartAddItemBodySchema, cartRenderBodySchema, cartTourIdParamSchema, cartUpdateQuantityBodySchema } from "../../validates/module.validation";

const cartRouter = Router();

cartRouter.get("/", CartController.cart);
cartRouter.post("/items", validate({ body: cartAddItemBodySchema }), CartController.addItem);
cartRouter.patch("/items/:tourId", validate({ params: cartTourIdParamSchema, body: cartUpdateQuantityBodySchema }), CartController.updateItemQuantity);
cartRouter.delete("/items/:tourId", validate({ params: cartTourIdParamSchema }), CartController.removeItem);
cartRouter.post("/render", validate({ body: cartRenderBodySchema }), CartController.render);

export default cartRouter;
