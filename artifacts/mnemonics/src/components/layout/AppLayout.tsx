import { Link, useLocation } from "wouter";
import { Brain, BookOpen, BarChart3, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/", label: "Обзор", icon: Brain },
  { href: "/lessons", label: "Уроки", icon: BookOpen },
  { href: "/stats", label: "Статистика", icon: BarChart3 },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} className="block">
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 text-base h-11"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Brain className="h-6 w-6" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">Мнемоника</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavLinks />
        </nav>
      </aside>

      {/* Mobile Topbar & Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-serif font-bold text-lg">Мнемоника</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <Brain className="h-6 w-6" />
                </div>
                <span className="font-serif font-bold text-xl tracking-tight">Мнемоника</span>
              </div>
              <nav className="px-4 space-y-2">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-8 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
