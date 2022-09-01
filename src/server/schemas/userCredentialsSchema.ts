import { Joi } from "express-validation";

export const userCredentialsSchema = {
  body: Joi.object({
    userName: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
  }),
};

export const validationUserCredentialsSchema = {
  body: Joi.object({
    userName: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
  }),
};
