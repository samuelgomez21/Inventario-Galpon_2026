import { Settings, Store, Bell, Database, Palette } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Configuración</h1>
        <p className="text-sm text-muted-foreground">Ajustes del sistema</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Store className="w-4 h-4" /> Información del Negocio</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><label className="block text-muted-foreground mb-1">Nombre</label><input defaultValue="El Galpón" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground" /></div>
          <div><label className="block text-muted-foreground mb-1">Teléfono</label><input defaultValue="602-555-1234" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground" /></div>
          <div><label className="block text-muted-foreground mb-1">Dirección</label><input defaultValue="Calle 5 #4-33" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground" /></div>
          <div><label className="block text-muted-foreground mb-1">Municipio</label><input defaultValue="Alcalá, Valle del Cauca" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground" /></div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Bell className="w-4 h-4" /> Notificaciones</h3>
        {['Alerta de stock bajo', 'Notificaciones por email', 'Resumen diario'].map(n => (
          <div key={n} className="flex items-center justify-between text-sm">
            <span className="text-foreground">{n}</span>
            <button className="w-10 h-5 rounded-full bg-primary relative"><span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-primary-foreground" /></button>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Database className="w-4 h-4" /> Datos y Respaldos</h3>
        <p className="text-sm text-muted-foreground">Último respaldo: 12 feb 2026 - 08:00 AM</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">Exportar Datos</button>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Respaldar Ahora</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
