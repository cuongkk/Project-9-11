import { Router } from "express";
import { CartController } from "./cart.controller";
import { validate } from "../../middlewares/validate.middleware";
import { cartRenderBodySchema } from "../../validates/module.validation";

const cartRouter = Router();

cartRouter.get("/", CartController.cart);
cartRouter.post("/render", validate({ body: cartRenderBodySchema }), CartController.render);

export default cartRouter;
