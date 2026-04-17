import { Router } from "express";
import * as dashboardController from "./dashboard.controller";
import { validate } from "../../middlewares/validate.middleware";
import { revenueChartBodySchema } from "../../validates/module.validation";

const publicRouter = Router();
const adminRouter = Router();

adminRouter.get("/", dashboardController.dashboard);
adminRouter.post("/revenue-chart", validate({ body: revenueChartBodySchema }), dashboardController.revenueChartPost);

publicRouter.get("/info", dashboardController.info);
publicRouter.get("/tours", dashboardController.tours);
publicRouter.get("/tours/:slug", dashboardController.tourDetail);
publicRouter.get("/gears", dashboardController.gears);
publicRouter.get("/journals", dashboardController.journals);

export { adminRouter as dashboardAdminRouter, publicRouter as dashboardPublicRouter };
