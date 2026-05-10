import { Router } from "express";
import { getExerciseContent } from "../data/exerciseContent";

const FLASHCARD_TYPES: Record<string, { title: string; description: string }> = {
  "as100-flashcards": {
    title: "Образные коды АС-100",
    description: "Двузначные числа от 00 до 30 с образными кодами по системе АС-100.",
  },
  "weekdays-flashcards": {
    title: "Коды дней недели",
    description: "Образные коды дней недели для запоминания расписаний.",
  },
  months: {
    title: "Коды месяцев",
    description: "Образные коды месяцев для запоминания точных дат.",
  },
  "bpc-trainer": {
    title: "Буквенно-цифровой код (БЦК)",
    description: "Тренажёр на перевод двузначных чисел в буквенный код.",
  },
  "foreign-words": {
    title: "Иностранные слова",
    description: "Английские слова с фонетическими образными кодами.",
  },
};

const router = Router();

router.get("/flashcards/:type", (req, res) => {
  const { type } = req.params;
  const meta = FLASHCARD_TYPES[type];
  if (!meta) {
    res.status(404).json({ error: "Flashcard set not found" });
    return;
  }

  const content = getExerciseContent(type);
  if (!content) {
    res.status(404).json({ error: "Flashcard content not found" });
    return;
  }

  const cards = (content.pairs ?? []).map((p) => ({
    front: p.front,
    back: p.back,
    hint: p.hint ?? null,
    imageCode: null,
  }));

  res.json({
    type,
    title: meta.title,
    description: meta.description,
    cards,
  });
});

export default router;
