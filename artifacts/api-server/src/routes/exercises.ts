import { Router } from "express";
import { getExerciseContent } from "../data/exerciseContent";

const router = Router();

router.get("/exercises/:type/content", (req, res) => {
  const content = getExerciseContent(req.params.type);
  if (!content) {
    res.status(404).json({ error: "Exercise content not found" });
    return;
  }
  res.json(content);
});

export default router;
