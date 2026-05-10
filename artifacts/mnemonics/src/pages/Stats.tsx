import { useGetProgressStats, useGetSessions } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function Stats() {
  const { data: progressStats, isLoading: isProgressLoading } = useGetProgressStats();
  const { data: sessions, isLoading: isSessionsLoading } = useGetSessions({ limit: 20 });

  const isLoading = isProgressLoading || isSessionsLoading;

  if (isLoading) return <StatsSkeleton />;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Статистика тренировок</h1>
        <p className="text-muted-foreground text-lg">Анализ ваших результатов и прогресса.</p>
      </div>

      <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle>Динамика точности</CardTitle>
          <CardDescription>Изменение процента правильных ответов по дням</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            {!progressStats || progressStats.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                Недостаточно данных для графика
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressStats}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'd MMM', { locale: ru })}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis 
                    domain={[0, 1]} 
                    tickFormatter={(val) => `${Math.round(val * 100)}%`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickMargin={10}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Точность']}
                    labelFormatter={(label) => format(new Date(label), 'd MMMM yyyy', { locale: ru })}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle>История сессий</CardTitle>
          <CardDescription>Подробный лог ваших недавних тренировок</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!sessions || sessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">История пуста</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Дата и время</th>
                    <th className="px-6 py-3 font-medium">Упражнение</th>
                    <th className="px-6 py-3 font-medium text-right">Точность</th>
                    <th className="px-6 py-3 font-medium text-right">Элементы</th>
                    <th className="px-6 py-3 font-medium text-right">Время</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(session.completedAt), "d MMM yyyy, HH:mm", { locale: ru })}
                      </td>
                      <td className="px-6 py-4 font-medium">{session.exerciseTitle}</td>
                      <td className="px-6 py-4 text-right font-bold text-primary">
                        {Math.round(session.accuracy * 100)}%
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {session.itemsCorrect} / {session.itemsTotal}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground font-mono">
                        {Math.floor(session.durationSeconds / 60)}:{(session.durationSeconds % 60).toString().padStart(2, '0')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </div>
  );
}
