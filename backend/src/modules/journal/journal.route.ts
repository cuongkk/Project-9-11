import { Router } from "express";
import * as journalController from "./journal.controller";
import { validate } from "../../middlewares/validate.middleware";
import { objectIdParamSchema } from "../../validates/common.validation";

const router = Router();

router.get("/list", journalController.list);
router.post("/create", journalController.createPost);
router.get("/edit/:id", validate({ params: objectIdParamSchema }), journalController.edit);
router.patch("/edit/:id", validate({ params: objectIdParamSchema }), journalController.editPatch);

export default router;
