import { Link } from "wouter";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Target, Flame, Activity, ArrowRight, Play } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: stats, isLoading, error } = useGetDashboardStats();

  if (isLoading) return <DashboardSkeleton />;
  if (error || !stats) return <div className="text-destructive p-8 text-center bg-destructive/10 rounded-xl border border-destructive/20">Не удалось загрузить статистику.</div>;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Обзор прогресса</h1>
        <p className="text-muted-foreground text-lg">Ваша ежедневная тренировка памяти.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Сессий" value={stats.totalSessions} icon={Brain} />
        <StatCard title="Элементов" value={stats.totalItemsPracticed} icon={Activity} />
        <StatCard title="Точность" value={`${Math.round(stats.averageAccuracy * 100)}%`} icon={Target} />
        <StatCard title="Серия" value={`${stats.currentStreak} дн.`} icon={Flame} color="text-orange-500" />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle>Типы упражнений</CardTitle>
            <CardDescription>Ваша средняя точность по типам</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {stats.exerciseBreakdown.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Нет данных для отображения</div>
            ) : (
              stats.exerciseBreakdown.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.exerciseType} 
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.exerciseTitle}</span>
                    <span className="text-muted-foreground">{Math.round(item.averageAccuracy * 100)}%</span>
                  </div>
                  <Progress value={item.averageAccuracy * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">{item.sessionCount} сессий</p>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Недавние тренировки</CardTitle>
                <CardDescription>Последние пройденные сессии</CardDescription>
              </div>
              <Link href="/stats" className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">
                Все <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {stats.recentSessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Вы еще не провели ни одной тренировки</div>
            ) : (
              <div className="divide-y">
                {stats.recentSessions.slice(0, 5).map((session, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={session.id} 
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{session.exerciseTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.completedAt), "d MMM yyyy, HH:mm", { locale: ru })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{Math.round(session.accuracy * 100)}%</p>
                      <p className="text-xs text-muted-foreground">{session.itemsCorrect}/{session.itemsTotal}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color?: string }) {
  return (
    <Card className="border-none shadow-md overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="h-24 w-24" />
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 text-muted-foreground ${color || ''}`} />
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="h-96 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}
