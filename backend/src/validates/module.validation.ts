import Joi from "joi";

export const changeMultiBodySchema = Joi.object({
  listId: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  option: Joi.string().trim().min(1).required(),
}).required();

export const deleteCodeBodySchema = Joi.object({
  deleteCode: Joi.string().trim().min(1).required(),
}).required();

export const cartRenderBodySchema = Joi.object({
  cart: Joi.array()
    .items(
      Joi.object({
        tourId: Joi.string().hex().length(24).required(),
        locationFrom: Joi.string().hex().length(24).required(),
        departureDate: Joi.alternatives().try(Joi.date(), Joi.string()).required(),
      }).unknown(true),
    )
    .required(),
}).required();

export const revenueChartBodySchema = Joi.object({
  currentMonth: Joi.number().integer().min(1).max(12).required(),
  currentYear: Joi.number().integer().min(1970).required(),
  previousMonth: Joi.number().integer().min(1).max(12).required(),
  previousYear: Joi.number().integer().min(1970).required(),
  arrayDay: Joi.array().items(Joi.number().integer().min(1).max(31)).min(1).required(),
}).required();
