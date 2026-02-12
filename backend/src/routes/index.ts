import { Router } from "express";
import authRoutes from "./auth.routes";
import { get as healthGet } from "../controllers/health.controller";
import {
  list as projectsList,
  getById as projectsGetById,
  create as projectsCreate,
} from "../controllers/projects.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/health", healthGet);

router.get("/projects", requireAuth, projectsList);
router.get("/projects/:id", requireAuth, projectsGetById);
router.post("/projects", requireAuth, projectsCreate);

router.use("/auth", authRoutes);

export default router;
