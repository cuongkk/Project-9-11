import { Router } from "express";
import * as categoryController from "./category.controller";
import { validate } from "../../middlewares/validate.middleware";
import { objectIdParamSchema } from "../../validates/common.validation";
import { changeMultiBodySchema, deleteCodeBodySchema } from "../../validates/module.validation";

const router = Router();

router.get("/list", categoryController.list);

router.get("/create", categoryController.create);

router.post("/create", categoryController.createPost);

router.get("/edit/:id", validate({ params: objectIdParamSchema }), categoryController.edit);

router.patch("/edit/:id", validate({ params: objectIdParamSchema }), categoryController.editPatch);

router.patch("/delete/:id", validate({ params: objectIdParamSchema, body: deleteCodeBodySchema }), categoryController.deletePatch);

router.patch("/change-multi", validate({ body: changeMultiBodySchema }), categoryController.changeMultiPatch);

export default router;
