import { Router } from "express";
import * as dashboardController from "./dashboard.controller";
import { validate } from "../../middlewares/validate.middleware";
import { revenueChartBodySchema } from "../../validates/module.validation";

const router = Router();

router.get("/", dashboardController.dashboard);

router.post("/revenue-chart", validate({ body: revenueChartBodySchema }), dashboardController.revenueChartPost);

router.get("/info", dashboardController.info);
export default router;
