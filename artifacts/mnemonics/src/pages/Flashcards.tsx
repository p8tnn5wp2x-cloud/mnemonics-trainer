import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "wouter";
import { getGetFlashcardsQueryKey, useGetFlashcards } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ArrowRight, ArrowLeft, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Flashcards() {
  const { type } = useParams<{ type: string }>();
  const flashcardType = type || "";

  const { data: flashcardSet, isLoading, error } = useGetFlashcards(flashcardType, {
    query: { enabled: !!flashcardType, queryKey: getGetFlashcardsQueryKey(flashcardType) }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  const nextCard = useCallback(() => {
    if (flashcardSet && currentIndex < flashcardSet.cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(i => i + 1), 150);
    }
  }, [currentIndex, flashcardSet]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(i => i - 1), 150);
    }
  }, [currentIndex]);

  const flipCard = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        flipCard();
      } else if (e.code === "ArrowRight") {
        nextCard();
      } else if (e.code === "ArrowLeft") {
        prevCard();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipCard, nextCard, prevCard]);

  if (isLoading) return <FlashcardsSkeleton />;
  if (error || !flashcardSet) return <div className="text-destructive p-8 text-center">Карточки не найдены.</div>;

  const currentCard = flashcardSet.cards[currentIndex];
  const progress = ((currentIndex + 1) / flashcardSet.cards.length) * 100;

  return (
    <div className="space-y-8 pb-16 max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full flex items-center justify-between">
        <Link href="/lessons">
          <Button variant="ghost" className="gap-2 -ml-4 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Назад
          </Button>
        </Link>
        <div className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {flashcardSet.cards.length}
        </div>
      </div>

      <div className="w-full space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight font-serif">{flashcardSet.title}</h1>
        <p className="text-muted-foreground">{flashcardSet.description}</p>
        <Progress value={progress} className="h-2 w-full mt-4" />
      </div>

      <div className="relative w-full aspect-[4/3] max-h-[400px] perspective-1000 mt-8">
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
          onClick={flipCard}
        >
          {/* Front */}
          <Card className="absolute inset-0 backface-hidden border-none shadow-lg bg-card flex flex-col">
            <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <span className="text-muted-foreground text-sm uppercase tracking-wider mb-8 font-semibold">Вопрос</span>
              <h2 className="text-5xl md:text-7xl font-bold font-serif">{currentCard.front}</h2>
              {currentCard.hint && (
                <p className="mt-8 text-muted-foreground text-sm italic">{currentCard.hint}</p>
              )}
            </CardContent>
            <div className="p-4 text-center text-xs text-muted-foreground border-t bg-muted/10">
              Нажмите пробел или кликните, чтобы перевернуть
            </div>
          </Card>

          {/* Back */}
          <Card className="absolute inset-0 backface-hidden border-none shadow-lg bg-primary text-primary-foreground flex flex-col [transform:rotateY(180deg)]">
            <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <span className="text-primary-foreground/70 text-sm uppercase tracking-wider mb-8 font-semibold">Ответ</span>
              <h2 className="text-4xl md:text-6xl font-bold font-serif">{currentCard.back}</h2>
              {currentCard.imageCode && (
                <div className="mt-8 px-6 py-3 bg-primary-foreground/10 rounded-xl font-mono text-xl backdrop-blur-sm border border-primary-foreground/20">
                  {currentCard.imageCode}
                </div>
              )}
            </CardContent>
            <div className="p-4 text-center text-xs text-primary-foreground/70 border-t border-primary-foreground/20 bg-black/10">
              Используйте стрелки ← → для навигации
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 rounded-full" 
          onClick={prevCard}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="secondary" 
          className="h-12 px-8 rounded-full gap-2 shadow-sm"
          onClick={flipCard}
        >
          <RotateCw className="h-4 w-4" /> Перевернуть
        </Button>
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-sm" 
          onClick={nextCard}
          disabled={currentIndex === flashcardSet.cards.length - 1}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

function FlashcardsSkeleton() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full flex items-center justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="w-full space-y-2 text-center flex flex-col items-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-2 w-full mt-4" />
      </div>
      <Skeleton className="w-full aspect-[4/3] max-h-[400px] mt-8 rounded-xl" />
      <div className="flex gap-6 mt-8">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-12 w-32 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  );
}
