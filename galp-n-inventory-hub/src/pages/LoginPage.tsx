import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { MapPin, CheckCircle2, ArrowRight, Mail, KeyRound, Warehouse, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [step, setStep] = useState<'email' | 'codigo'>('email');

  const { solicitarCodigo, verificarCodigo, isLoading, pendingEmail, setPendingEmail } = useAuthStore();
  const navigate = useNavigate();

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await solicitarCodigo(email);
    if (result.success) {
      toast.success(result.message);
      setStep('codigo');
    } else {
      toast.error(result.message);
    }
  };

  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await verificarCodigo(pendingEmail || email, codigo);
    if (result.success) {
      toast.success('¡Bienvenido al sistema!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  const handleVolver = () => {
    setStep('email');
    setCodigo('');
    setPendingEmail(null);
  };

  const features = [
    'Control total de inventario',
    'Reportes en tiempo real',
    'Gestión de usuarios y permisos',
    'Alertas de stock automáticas',
  ];

  const badges = [
    { emoji: '🐕', label: 'Mascotas' },
    { emoji: '🐄', label: 'Ganadería' },
    { emoji: '🌾', label: 'Agricultura' },
    { emoji: '💊', label: 'Veterinaria' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar to-primary/20" />
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6">
            <Warehouse className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-sidebar-primary-foreground mb-1">El Galpón</h1>
          <p className="text-sidebar-muted text-lg mb-8">Sistema de Gestión de Inventario</p>

          <div className="flex items-center gap-2 text-sidebar-foreground mb-6">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">Calle 5 #4-33 - Alcalá, Valle del Cauca, Colombia</span>
          </div>

          <div className="space-y-3 mb-8">
            {features.map(f => (
              <div key={f} className="flex items-center gap-3 text-sidebar-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {badges.map(b => (
              <span key={b.label} className="px-3 py-1.5 rounded-full bg-sidebar-accent text-sidebar-foreground text-sm">
                {b.emoji} {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-card">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <Warehouse className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {step === 'email' ? 'Iniciar Sesión' : 'Verificar Código'}
            </h2>
            <p className="text-primary mt-1">
              {step === 'email'
                ? 'Ingresa tu correo electrónico para recibir el código de acceso'
                : `Ingresa el código enviado a ${pendingEmail || email}`
              }
            </p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleSolicitarCodigo} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <Mail className="w-4 h-4" /> Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando código...
                  </>
                ) : (
                  <>
                    Solicitar Código <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerificarCodigo} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <KeyRound className="w-4 h-4" /> Código de Verificación
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  El código expira en 10 minutos
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || codigo.length !== 6}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    Ingresar al Sistema <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleVolver}
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg border border-input text-foreground font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Cambiar correo
              </button>
            </form>
          )}

          <div className="mt-6 p-4 rounded-lg bg-muted text-center">
            <p className="text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="text-info">ℹ</span> Sistema de acceso seguro
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Solo usuarios autorizados pueden acceder al sistema.
              <br />
              Contacta al administrador si necesitas una cuenta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
