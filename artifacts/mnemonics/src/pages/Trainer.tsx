import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation, Link } from "wouter";
import { getGetExerciseContentQueryKey, useGetExerciseContent, useCreateSession } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Timer, Brain, CheckCircle2, XCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TrainerState = "idle" | "memorize" | "recall" | "result";

// Exercise types that use the sliding 2-word view
const SLIDING_WINDOW_TYPES = ["chain", "matryoshka"];

export default function Trainer() {
  const { type } = useParams<{ type: string }>();
  const exerciseType = type || "";
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: content, isLoading, error } = useGetExerciseContent(exerciseType, {
    query: { enabled: !!exerciseType, queryKey: getGetExerciseContentQueryKey(exerciseType) }
  });

  const createSession = useCreateSession();

  const [state, setState] = useState<TrainerState>("idle");
  const [timer, setTimer] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [pairIndex, setPairIndex] = useState(0);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");
  const intervalRef = useRef<number | null>(null);

  const useSlidingWindow = SLIDING_WINDOW_TYPES.includes(exerciseType) && !!content?.wordList;

  const wordList = content?.wordList ?? [];
  const maxPairIndex = Math.max(0, wordList.length - 2);
  const isLastPair = pairIndex >= maxPairIndex;

  const goNext = useCallback(() => {
    if (pairIndex < maxPairIndex) {
      setSlideDir("right");
      setPairIndex(i => i + 1);
    }
  }, [pairIndex, maxPairIndex]);

  const goPrev = useCallback(() => {
    if (pairIndex > 0) {
      setSlideDir("left");
      setPairIndex(i => i - 1);
    }
  }, [pairIndex]);

  useEffect(() => {
    if (state !== "memorize" || !useSlidingWindow) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "ArrowRight") { e.preventDefault(); goNext(); }
      if (e.code === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state, useSlidingWindow, goNext, goPrev]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startMemorizing = () => {
    setState("memorize");
    setPairIndex(0);
    setTimer(0);
    intervalRef.current = window.setInterval(() => setTimer(t => t + 1), 1000);
  };

  const startRecall = () => {
    setState("recall");
    if (content?.wordList) {
      setAnswers(new Array(content.wordList.length).fill(""));
    } else if (content?.numberList) {
      setAnswers(new Array(content.numberList.length).fill(""));
    } else if (content?.pairs) {
      setAnswers(new Array(content.pairs.length).fill(""));
    }
  };

  const finishRecall = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let correctCount = 0;
    let totalCount = 0;

    if (content?.wordList) {
      totalCount = content.wordList.length;
      correctCount = answers.reduce(
        (acc, ans, i) => acc + (ans.trim().toLowerCase() === content.wordList![i].toLowerCase() ? 1 : 0),
        0,
      );
    } else if (content?.numberList) {
      totalCount = content.numberList.length;
      correctCount = answers.reduce(
        (acc, ans, i) => acc + (ans.trim() === content.numberList![i].toString() ? 1 : 0),
        0,
      );
    } else if (content?.pairs) {
      totalCount = content.pairs.length;
      correctCount = answers.reduce(
        (acc, ans, i) => acc + (ans.trim().toLowerCase() === content.pairs![i].back.toLowerCase() ? 1 : 0),
        0,
      );
    }

    setScore({ correct: correctCount, total: totalCount });
    setState("result");

    createSession.mutate({
      data: {
        exerciseType,
        exerciseTitle: content?.title || "Тренировка",
        itemsTotal: totalCount,
        itemsCorrect: correctCount,
        durationSeconds: timer,
      },
    });
  };

  if (isLoading) return <TrainerSkeleton />;
  if (error || !content) return <div className="text-destructive p-8 text-center">Контент не найден.</div>;

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      <Link href="/lessons">
        <Button variant="ghost" className="mb-4 gap-2 -ml-4 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Назад
        </Button>
      </Link>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight font-serif">{content.title}</h1>
          <p className="text-muted-foreground">{content.instructions}</p>
        </div>
        {(state === "memorize" || state === "recall") && (
          <div className="flex items-center gap-2 text-xl font-mono bg-card px-4 py-2 rounded-lg border shadow-sm shrink-0 ml-4">
            <Timer className="h-5 w-5 text-primary" />
            {formatTime(timer)}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-none shadow-md bg-card/50">
              <CardContent className="p-12 text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Brain className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-serif">Готовы начать?</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {useSlidingWindow
                    ? "Слова будут показываться по два. Связывайте каждую пару в яркий зрительный образ. Листайте стрелками или кнопками."
                    : "Сначала вы увидите элементы для запоминания. Постарайтесь запомнить их как можно быстрее."}
                </p>
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 mt-4" onClick={startMemorizing}>
                  Начать запоминание
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state === "memorize" && (
          <motion.div key="memorize" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {useSlidingWindow ? (
              /* ── Sliding 2-word view ── */
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-muted/20 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Запоминание</CardTitle>
                    <CardDescription>Свяжите пару слов в один яркий зрительный образ.</CardDescription>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground shrink-0">
                    {pairIndex + 1} – {Math.min(pairIndex + 2, wordList.length)} / {wordList.length}
                  </span>
                </CardHeader>

                {/* Progress bar */}
                <div className="px-6 pt-3">
                  <Progress value={((pairIndex + 2) / wordList.length) * 100} className="h-1.5" />
                </div>

                <CardContent className="p-8 flex flex-col items-center gap-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={pairIndex}
                      initial={{ opacity: 0, x: slideDir === "right" ? 60 : -60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: slideDir === "right" ? -60 : 60 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="w-full flex gap-4 justify-center"
                    >
                      {/* Word A */}
                      <div className="flex-1 flex flex-col items-center gap-3 bg-muted/30 rounded-xl border p-6 min-w-0">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {pairIndex + 1}
                        </span>
                        <span className="text-3xl font-bold font-serif text-center leading-tight">
                          {wordList[pairIndex]}
                        </span>
                      </div>

                      {/* Arrow between words */}
                      <div className="flex items-center text-muted-foreground/40 shrink-0 pt-2">
                        <ChevronRight className="h-8 w-8" />
                      </div>

                      {/* Word B */}
                      <div className="flex-1 flex flex-col items-center gap-3 bg-primary/5 border-primary/20 rounded-xl border p-6 min-w-0">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {pairIndex + 2}
                        </span>
                        <span className="text-3xl font-bold font-serif text-center leading-tight">
                          {wordList[pairIndex + 1]}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <p className="text-sm text-muted-foreground">
                    Используйте стрелки ← → или кнопки ниже
                  </p>
                </CardContent>

                <CardFooter className="p-6 bg-muted/10 border-t flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-full"
                    onClick={goPrev}
                    disabled={pairIndex === 0}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  {isLastPair ? (
                    <Button size="lg" className="flex-1" onClick={startRecall}>
                      Я запомнил — перейти к вводу
                    </Button>
                  ) : (
                    <Button size="lg" variant="secondary" className="flex-1" onClick={goNext}>
                      Далее <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-full"
                    onClick={goNext}
                    disabled={isLastPair}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              /* ── Default full-list view ── */
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-muted/20">
                  <CardTitle>Запоминание</CardTitle>
                  <CardDescription>Используйте методы мнемотехники для связывания образов.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {content.numberList?.map((num, i) => (
                      <div key={i} className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
                        <span className="text-muted-foreground font-mono w-6">{i + 1}.</span>
                        <span className="font-mono text-xl font-bold">{String(num).padStart(2, "0")}</span>
                      </div>
                    ))}
                    {content.pairs?.map((pair, i) => (
                      <div key={i} className="flex flex-col gap-1 bg-muted/30 p-4 rounded-lg border text-center">
                        <span className="font-medium">{pair.front}</span>
                        <span className="text-muted-foreground text-sm">→</span>
                        <span className="font-bold text-primary">{pair.back}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 bg-muted/10 border-t justify-end">
                  <Button size="lg" onClick={startRecall}>Я запомнил, перейти к вводу</Button>
                </CardFooter>
              </Card>
            )}
          </motion.div>
        )}

        {state === "recall" && (
          <motion.div key="recall" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="text-primary">Проверка памяти</CardTitle>
                <CardDescription>Введите запомненные элементы в правильном порядке.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {(content.wordList || content.numberList)?.map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-muted-foreground font-mono w-6 text-right">{i + 1}.</span>
                      <Input
                        value={answers[i] ?? ""}
                        onChange={(e) => {
                          const newAns = [...answers];
                          newAns[i] = e.target.value;
                          setAnswers(newAns);
                        }}
                        className="font-medium text-lg"
                        placeholder="..."
                        autoFocus={i === 0}
                      />
                    </div>
                  ))}
                  {content.pairs?.map((pair, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="font-medium w-24 text-right truncate" title={pair.front}>{pair.front}</span>
                      <span className="text-muted-foreground">→</span>
                      <Input
                        value={answers[i] ?? ""}
                        onChange={(e) => {
                          const newAns = [...answers];
                          newAns[i] = e.target.value;
                          setAnswers(newAns);
                        }}
                        className="font-medium text-lg flex-1"
                        placeholder="Ответ"
                        autoFocus={i === 0}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-muted/10 border-t justify-end gap-4">
                <Button variant="outline" onClick={() => { setPairIndex(0); setState("memorize"); }}>Подсмотреть</Button>
                <Button size="lg" onClick={finishRecall}>Проверить результаты</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {state === "result" && (
          <motion.div key="result" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Card className="border-none shadow-xl overflow-hidden">
              <CardHeader className={`border-b text-center py-8 ${score.correct === score.total ? "bg-green-500/10" : "bg-primary/5"}`}>
                <div className="mx-auto w-20 h-20 bg-background rounded-full shadow-sm flex items-center justify-center mb-4 text-3xl font-bold">
                  {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                </div>
                <CardTitle className="text-2xl font-serif">
                  {score.correct === score.total ? "Превосходно!" : "Хорошая работа"}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Вы вспомнили {score.correct} из {score.total} элементов за {formatTime(timer)}.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {(content.wordList || content.numberList)?.map((correctStr, i) => {
                    const ans = answers[i]?.trim() ?? "";
                    const expected = correctStr.toString();
                    const isCorrect = ans.toLowerCase() === expected.toLowerCase();
                    return (
                      <div key={i} className={`flex items-center gap-4 p-4 ${isCorrect ? "bg-green-500/5" : "bg-destructive/5"}`}>
                        <span className="text-muted-foreground font-mono w-6 text-right">{i + 1}.</span>
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                            <span className="font-medium flex-1">{ans}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-destructive shrink-0" />
                            <div className="flex flex-col flex-1">
                              <span className="font-medium text-destructive line-through decoration-destructive/50">{ans || "(пусто)"}</span>
                              <span className="text-sm text-green-600 font-medium">Правильно: {expected}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                  {content.pairs?.map((pair, i) => {
                    const ans = answers[i]?.trim() ?? "";
                    const expected = pair.back;
                    const isCorrect = ans.toLowerCase() === expected.toLowerCase();
                    return (
                      <div key={i} className={`flex items-center gap-4 p-4 ${isCorrect ? "bg-green-500/5" : "bg-destructive/5"}`}>
                        <span className="font-medium w-24 text-right truncate" title={pair.front}>{pair.front}</span>
                        <span className="text-muted-foreground">→</span>
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                            <span className="font-medium flex-1">{ans}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-destructive shrink-0" />
                            <div className="flex flex-col flex-1">
                              <span className="font-medium text-destructive line-through decoration-destructive/50">{ans || "(пусто)"}</span>
                              <span className="text-sm text-green-600 font-medium">Правильно: {expected}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-muted/20 justify-center gap-4">
                <Button variant="outline" onClick={() => setLocation("/lessons")}>К списку уроков</Button>
                <Button onClick={() => {
                  setState("idle");
                  setTimer(0);
                  setAnswers([]);
                  setPairIndex(0);
                }}>Повторить</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TrainerSkeleton() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Skeleton className="h-10 w-32 mb-4" />
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-12 w-24 rounded-lg" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
