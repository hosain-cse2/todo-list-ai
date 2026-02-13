import { Router } from "express";
import Joi from "joi";
import authRoutes from "./auth.routes";
import { get as healthGet } from "../controllers/health.controller";
import {
  list as projectsList,
  getById as projectsGetById,
  create as projectsCreate,
  update as projectsUpdate,
  createTodo as projectsCreateTodo,
  deleteTodo as projectsDeleteTodo,
  remove as projectsRemove,
} from "../controllers/projects.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

const createProjectSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().allow("").default(""),
});

const createTodoSchema = Joi.object({
  text: Joi.string().trim().min(1).required(),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(1),
  description: Joi.string().allow(""),
}).min(1);

router.get("/health", healthGet);

router.get("/projects", requireAuth, projectsList);
router.get("/projects/:id", requireAuth, projectsGetById);
router.post("/projects", requireAuth, validate(createProjectSchema), projectsCreate);
router.patch("/projects/:id", requireAuth, validate(updateProjectSchema), projectsUpdate);
router.delete("/projects/:id", requireAuth, projectsRemove);
router.post("/projects/:id/todos", requireAuth, validate(createTodoSchema), projectsCreateTodo);
router.delete("/projects/:id/todos/:todoId", requireAuth, projectsDeleteTodo);

router.use("/auth", authRoutes);

export default router;
