import { Router } from "express";
import Joi from "joi";
import { login as authLogin } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";

const router = Router();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
});

router.post("/login", validate(loginSchema), authLogin);

export default router;
