import { Menu, Search, Bell, Moon, Calendar } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header = ({ title, onMenuClick }: HeaderProps) => {
  const today = new Date().toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-4 shrink-0">
      <button onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground">
        <Menu className="w-5 h-5" />
      </button>
      <span className="text-sm font-medium text-foreground">{title}</span>

      <div className="flex-1 flex justify-center max-w-lg mx-auto">
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Buscar productos, categorías..."
            className="w-full pl-9 pr-16 py-1.5 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] text-muted-foreground font-mono">Ctrl+K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-3 text-muted-foreground">
        <button className="relative hover:text-foreground">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive" />
        </button>
        <button className="hover:text-foreground"><Moon className="w-4.5 h-4.5" /></button>
        <span className="hidden md:flex items-center gap-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5" /> {today}
        </span>
      </div>
    </header>
  );
};

export default Header;
