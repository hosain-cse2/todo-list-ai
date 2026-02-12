import { Router } from "express";
import Joi from "joi";
import authRoutes from "./auth.routes";
import { get as healthGet } from "../controllers/health.controller";
import {
  list as projectsList,
  getById as projectsGetById,
  create as projectsCreate,
} from "../controllers/projects.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

const createProjectSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().allow("").default(""),
});

router.get("/health", healthGet);

router.get("/projects", requireAuth, projectsList);
router.get("/projects/:id", requireAuth, projectsGetById);
router.post("/projects", requireAuth, validate(createProjectSchema), projectsCreate);

router.use("/auth", authRoutes);

export default router;
