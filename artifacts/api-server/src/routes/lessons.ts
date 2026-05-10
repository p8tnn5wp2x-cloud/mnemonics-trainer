import { Router } from "express";
import { lessons, getAllExercises, getExercisesByLesson } from "../data/lessons";

const router = Router();

router.get("/lessons", (req, res) => {
  const result = lessons.map(({ theory: _theory, exercises: _exercises, ...l }) => ({
    ...l,
    totalExercises: _exercises.length,
  }));
  res.json(result);
});

router.get("/lessons/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  res.json(lesson);
});

router.get("/exercises", (req, res) => {
  const lessonId = req.query.lessonId ? parseInt(req.query.lessonId as string, 10) : undefined;
  const exercises = lessonId !== undefined ? getExercisesByLesson(lessonId) : getAllExercises();
  res.json(exercises);
});

export default router;
