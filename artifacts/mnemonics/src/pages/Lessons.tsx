import { Link } from "wouter";
import { useGetLessons } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Lessons() {
  const { data: lessons, isLoading, error } = useGetLessons();

  if (isLoading) return <LessonsSkeleton />;
  if (error || !lessons) return <div className="text-destructive p-8 text-center bg-destructive/10 rounded-xl">Не удалось загрузить уроки.</div>;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Учебный план</h1>
        <p className="text-muted-foreground text-lg">Последовательное изучение системы мнемотехники.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={lesson.id}
          >
            <Card className="h-full flex flex-col border-none shadow-md hover:shadow-lg transition-all group overflow-hidden bg-card/50 backdrop-blur">
              <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-semibold text-sm">Урок {lesson.number}</span>
                </div>
                <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">{lesson.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <div className="flex flex-wrap gap-2">
                  {lesson.topics.slice(0, 3).map(topic => (
                    <Badge key={topic} variant="secondary" className="bg-secondary/50 hover:bg-secondary/80">{topic}</Badge>
                  ))}
                  {lesson.topics.length > 3 && (
                    <Badge variant="outline">+{lesson.topics.length - 3}</Badge>
                  )}
                </div>
                <div className="mt-6 flex items-center text-sm text-muted-foreground">
                  Упражнений: <span className="ml-1 font-semibold text-foreground">{lesson.totalExercises}</span>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 mt-auto">
                <Link href={`/lessons/${lesson.id}`} className="w-full">
                  <Button className="w-full h-14 text-base font-semibold gap-2 rounded-xl group-hover:bg-primary/90">
                    Перейти к уроку <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LessonsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[320px] w-full rounded-xl" />)}
      </div>
    </div>
  );
}
