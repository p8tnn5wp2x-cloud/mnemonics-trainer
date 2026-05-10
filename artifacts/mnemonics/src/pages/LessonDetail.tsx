import { Link, useParams } from "wouter";
import { getGetLessonQueryKey, useGetLesson } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { ChevronLeft, Play, Dumbbell, BookOpen, Layers } from "lucide-react";

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id || "0", 10);
  
  const { data: lesson, isLoading, error } = useGetLesson(lessonId, {
    query: { enabled: !!lessonId, queryKey: getGetLessonQueryKey(lessonId) }
  });

  if (isLoading) return <LessonDetailSkeleton />;
  if (error || !lesson) return <div className="text-destructive p-8 text-center">Урок не найден.</div>;

  return (
    <div className="space-y-8 pb-16">
      <Link href="/lessons">
        <Button variant="ghost" className="mb-4 gap-2 -ml-4 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> К списку уроков
        </Button>
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow">
          Урок {lesson.number}
        </div>
        <h1 className="text-4xl font-bold tracking-tight font-serif">{lesson.title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">{lesson.description}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {lesson.topics.map(topic => (
            <Badge key={topic} variant="secondary">{topic}</Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="theory" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 mb-8 space-x-6">
          <TabsTrigger 
            value="theory" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 font-medium"
          >
            <BookOpen className="mr-2 h-4 w-4" /> Теория
          </TabsTrigger>
          <TabsTrigger 
            value="exercises"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 font-medium"
          >
            <Dumbbell className="mr-2 h-4 w-4" /> Упражнения ({lesson.exercises.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theory" className="mt-0">
          <Card className="border-none shadow-md bg-card/50">
            <CardContent className="p-6 md:p-10">
              <MarkdownContent content={lesson.theory} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            {lesson.exercises.map(exercise => (
              <Card key={exercise.id} className="border-none shadow-md hover:shadow-lg transition-all flex flex-col overflow-hidden">
                <CardHeader className="bg-muted/20 border-b">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{exercise.title}</CardTitle>
                    <Badge variant={exercise.difficulty === 'hard' ? 'destructive' : exercise.difficulty === 'medium' ? 'default' : 'secondary'}>
                      {exercise.difficulty === 'easy' ? 'Легко' : exercise.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                    </Badge>
                  </div>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardFooter className="p-6 pt-6 mt-auto flex gap-4">
                  {exercise.type.includes('flashcard') ? (
                     <Link href={`/flashcards/${exercise.type}`} className="flex-1">
                      <Button className="w-full gap-2" variant="outline">
                        <Layers className="h-4 w-4" /> Карточки
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/exercises/${exercise.type}`} className="flex-1">
                      <Button className="w-full gap-2">
                        <Play className="h-4 w-4" /> Тренировка
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LessonDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-32 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="space-x-4 flex">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-32" />
      </div>
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </div>
  );
}
