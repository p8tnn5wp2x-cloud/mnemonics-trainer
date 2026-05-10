import { Router } from "express";
import { db } from "@workspace/db";
import { sessionsTable } from "@workspace/db";
import { desc, gte, sql } from "drizzle-orm";

const router = Router();

router.get("/stats/dashboard", async (_req, res) => {
  const allSessions = await db
    .select()
    .from(sessionsTable)
    .orderBy(desc(sessionsTable.completedAt));

  if (allSessions.length === 0) {
    res.json({
      totalSessions: 0,
      totalItemsPracticed: 0,
      averageAccuracy: 0,
      currentStreak: 0,
      bestAccuracy: 0,
      exerciseBreakdown: [],
      recentSessions: [],
    });
    return;
  }

  const totalSessions = allSessions.length;
  const totalItemsPracticed = allSessions.reduce((s, r) => s + r.itemsCorrect, 0);
  const averageAccuracy =
    allSessions.reduce((s, r) => s + r.accuracy, 0) / totalSessions;
  const bestAccuracy = Math.max(...allSessions.map((r) => r.accuracy));

  // Current streak: count consecutive days with sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const uniqueDays = new Set(
    allSessions.map((r) => {
      const d = new Date(r.completedAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }),
  );
  let streak = 0;
  const dayMs = 86400000;
  for (let d = today.getTime(); uniqueDays.has(d); d -= dayMs) {
    streak++;
  }

  // Exercise breakdown
  const byType = new Map<string, { title: string; count: number; totalAccuracy: number }>();
  for (const s of allSessions) {
    const entry = byType.get(s.exerciseType) ?? {
      title: s.exerciseTitle,
      count: 0,
      totalAccuracy: 0,
    };
    entry.count++;
    entry.totalAccuracy += s.accuracy;
    byType.set(s.exerciseType, entry);
  }
  const exerciseBreakdown = Array.from(byType.entries()).map(([type, v]) => ({
    exerciseType: type,
    exerciseTitle: v.title,
    sessionCount: v.count,
    averageAccuracy: v.totalAccuracy / v.count,
  }));

  const recentSessions = allSessions.slice(0, 10).map((r) => ({
    ...r,
    completedAt: r.completedAt.toISOString(),
  }));

  res.json({
    totalSessions,
    totalItemsPracticed,
    averageAccuracy,
    currentStreak: streak,
    bestAccuracy,
    exerciseBreakdown,
    recentSessions,
  });
});

router.get("/stats/progress", async (req, res) => {
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
  const cutoff = new Date(Date.now() - days * 86400000);

  const rows = await db
    .select()
    .from(sessionsTable)
    .where(gte(sessionsTable.completedAt, cutoff))
    .orderBy(sessionsTable.completedAt);

  const points = rows.map((r) => ({
    date: r.completedAt.toISOString().split("T")[0],
    exerciseType: r.exerciseType,
    accuracy: r.accuracy,
    itemsCorrect: r.itemsCorrect,
  }));

  res.json(points);
});

export default router;
