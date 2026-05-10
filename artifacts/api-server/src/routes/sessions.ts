import { Router } from "express";
import { db, sessionsTable, insertSessionSchema } from "@workspace/db";
import { CreateSessionBody } from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";

const router = Router();

router.get("/sessions", async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  const exerciseType = req.query.exerciseType as string | undefined;

  const rows = exerciseType
    ? await db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.exerciseType, exerciseType))
        .orderBy(desc(sessionsTable.completedAt))
        .limit(limit)
    : await db
        .select()
        .from(sessionsTable)
        .orderBy(desc(sessionsTable.completedAt))
        .limit(limit);

  res.json(
    rows.map((r) => ({
      ...r,
      completedAt: r.completedAt.toISOString(),
    })),
  );
});

router.post("/sessions", async (req, res) => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error });
    return;
  }

  const { exerciseType, exerciseTitle, itemsTotal, itemsCorrect, durationSeconds } = parsed.data;
  const accuracy = itemsTotal > 0 ? itemsCorrect / itemsTotal : 0;

  const [created] = await db
    .insert(sessionsTable)
    .values(
      insertSessionSchema.parse({
        exerciseType,
        exerciseTitle,
        itemsTotal,
        itemsCorrect,
        accuracy,
        durationSeconds,
      }),
    )
    .returning();

  res.status(201).json({
    ...created,
    completedAt: created.completedAt.toISOString(),
  });
});

export default router;
