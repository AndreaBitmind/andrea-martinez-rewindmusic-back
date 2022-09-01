import { Joi } from "express-validation";

const userCredentialsSchema = {
  body: Joi.object({
    userName: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
  }),
};

export default userCredentialsSchema;
