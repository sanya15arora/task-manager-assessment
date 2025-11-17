import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { TaskController } from "./taskController";

const router = Router();

router.use(authMiddleware);

router.get("/", TaskController.list);
router.post("/", TaskController.create);

router.get("/:id", TaskController.get);
router.patch("/:id", TaskController.update);
router.delete("/:id", TaskController.remove);

router.patch("/:id/toggle", TaskController.toggle);

export default router;
