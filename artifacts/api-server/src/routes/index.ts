import { Router, type IRouter } from "express";
import healthRouter from "./health";
import lessonsRouter from "./lessons";
import exercisesRouter from "./exercises";
import sessionsRouter from "./sessions";
import statsRouter from "./stats";
import flashcardsRouter from "./flashcards";

const router: IRouter = Router();

router.use(healthRouter);
router.use(lessonsRouter);
router.use(exercisesRouter);
router.use(sessionsRouter);
router.use(statsRouter);
router.use(flashcardsRouter);

export default router;
