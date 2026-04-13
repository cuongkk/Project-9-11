import { Router } from "express";
import multer from "multer";
import { storage } from "../../utils/cloudinary.helper";
import * as tourController from "./tour.controller";
import { validate } from "../../middlewares/validate.middleware";
import { objectIdParamSchema } from "../../validates/common.validation";
import { changeMultiBodySchema } from "../../validates/module.validation";

const router = Router();

const upload = multer({ storage: storage });

router.get("/list", tourController.list);

router.get("/create", tourController.create);

router.post(
  "/create",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  tourController.createPost,
);

router.get("/edit/:id", validate({ params: objectIdParamSchema }), tourController.edit);

router.patch(
  "/edit/:id",
  validate({ params: objectIdParamSchema }),
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  tourController.editPatch,
);

router.patch("/delete/:id", validate({ params: objectIdParamSchema }), tourController.deletePatch);

router.patch("/undo/:id", validate({ params: objectIdParamSchema }), tourController.undoPatch);

router.delete("/destroy/:id", validate({ params: objectIdParamSchema }), tourController.destroyDel);

router.get("/trash", tourController.trash);

router.patch("/change-multi", validate({ body: changeMultiBodySchema }), tourController.changeMultiPatch);

export default router;
