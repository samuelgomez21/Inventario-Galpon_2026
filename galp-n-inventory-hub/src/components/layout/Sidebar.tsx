import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/utils/formatters';
import {
  LayoutDashboard, Package, PlusCircle, Tags, AlertTriangle,
  Wallet, BarChart3, Truck, FileText, Users, Settings, LogOut,
  Warehouse, X, MoreVertical
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = user?.rol === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
        : 'text-sidebar-foreground hover:bg-sidebar-accent'
    }`;

  const badgeClass = "ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-sidebar-primary text-sidebar-primary-foreground";

  const sections = [
    {
      label: 'PRINCIPAL',
      items: [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      ]
    },
    {
      label: 'INVENTARIO',
      items: [
        { to: '/productos', icon: Package, label: 'Productos', badge: '1,247' },
        ...(isAdmin ? [{ to: '/productos/nuevo', icon: PlusCircle, label: 'Agregar Producto' }] : []),
        { to: '/categorias', icon: Tags, label: 'Categorías' },
        { to: '/stock-bajo', icon: AlertTriangle, label: 'Stock Bajo', badge: '12' },
      ]
    },
    {
      label: 'FINANZAS',
      items: [
        { to: '/presupuesto', icon: Wallet, label: 'Presupuesto' },
        { to: '/reportes', icon: BarChart3, label: 'Reportes' },
        { to: '/proveedores', icon: Truck, label: 'Proveedores', badge: '6' },
      ]
    },
    {
      label: 'COMPRAS',
      items: [
        { to: '/cotizaciones', icon: FileText, label: 'Cotizaciones', badge: '3' },
      ]
    },
    // Solo mostrar sección de administración para admins
    ...(isAdmin ? [{
      label: 'ADMINISTRACIÓN',
      items: [
        { to: '/usuarios', icon: Users, label: 'Usuarios' },
        { to: '/configuracion', icon: Settings, label: 'Configuración' },
      ]
    }] : []),
  ];

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-sidebar z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Warehouse className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-primary-foreground">El Galpón</span>
          <button onClick={onClose} className="ml-auto lg:hidden text-sidebar-foreground"><X className="w-5 h-5" /></button>
        </div>

        {/* User */}
        {user && (
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {getInitials(user.nombre)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-primary-foreground truncate">{user.nombre}</p>
              <p className="text-xs text-sidebar-primary capitalize">{user.rol === 'admin' ? 'Administrador' : 'Empleado'}</p>
            </div>
            <button className="text-sidebar-muted hover:text-sidebar-foreground"><MoreVertical className="w-4 h-4" /></button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          {sections.map(section => (
            <div key={section.label}>
              <p className="px-4 mb-1.5 text-[11px] font-semibold tracking-wider text-sidebar-section uppercase">{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass} onClick={onClose}>
                    <item.icon className="w-4.5 h-4.5 shrink-0" />
                    <span>{item.label}</span>
                    {item.badge && <span className={badgeClass}>{item.badge}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sidebar-primary/20 text-sidebar-primary font-medium text-sm hover:bg-sidebar-primary/30 transition-colors">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
