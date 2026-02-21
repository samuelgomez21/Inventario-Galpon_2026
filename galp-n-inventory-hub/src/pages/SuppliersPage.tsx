import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { formatCurrencyFull, getInitials } from '@/utils/formatters';
import { Search, Plus, RefreshCw, Eye, Pencil, Phone, DollarSign, Truck, CheckCircle, AlertTriangle, X, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Proveedor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string | null;
  contacto: string | null;
  notas: string | null;
  deuda: number;
  calificacion: number | null;
  activo: boolean;
}

const provColors = ['bg-cat-accesorios', 'bg-cat-alimentos', 'bg-primary', 'bg-cat-medicamentos', 'bg-cat-insumos', 'bg-cat-suplementos'];

const SuppliersPage = () => {
  const isAdmin = useAuthStore(s => s.user?.rol === 'admin');
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [deletingProveedor, setDeletingProveedor] = useState<Proveedor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    contacto: '',
    notas: '',
  });

  // Cargar proveedores desde el backend
  const loadProveedores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/proveedores');

      console.log('📦 Respuesta completa proveedores:', response.data);

      // Backend devuelve: { success: true, data: [...] } o { success: true, data: { data: [...], ... } }
      let data;
      if (response.data?.success) {
        // Si data.data es un array, usarlo directamente
        if (Array.isArray(response.data.data)) {
          data = response.data.data;
        }
        // Si data.data es un objeto con data (paginado), extraer data.data.data
        else if (response.data.data?.data && Array.isArray(response.data.data.data)) {
          data = response.data.data.data;
        }
        // Fallback
        else {
          data = [];
        }
      } else {
        data = [];
      }

      console.log('👥 Proveedores procesados:', data.length, data);
      setProveedores(data);
    } catch (err: any) {
      console.error('❌ Error cargando proveedores:', err);
      setError(err.response?.data?.message || 'Error al cargar proveedores');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProveedores();
  }, []);

  const filtered = proveedores.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                       p.email.toLowerCase().includes(search.toLowerCase()) ||
                       p.telefono?.includes(search);
    const matchEstado = !estado || (estado === 'deuda' ? p.deuda > 0 : p.deuda === 0);
    return matchSearch && matchEstado;
  });

  const totalDeuda = proveedores.reduce((s, p) => s + (p.deuda || 0), 0);
  const alDia = proveedores.filter(p => p.deuda === 0).length;
  const conDeuda = proveedores.filter(p => p.deuda > 0).length;

  const handleOpenNewModal = () => {
    setEditingProveedor(null);
    setFormData({ nombre: '', email: '', telefono: '', direccion: '', contacto: '', notas: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prov: Proveedor) => {
    setEditingProveedor(prov);
    setFormData({
      nombre: prov.nombre,
      email: prov.email,
      telefono: prov.telefono || '',
      direccion: prov.direccion || '',
      contacto: prov.contacto || '',
      notas: prov.notas || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (prov: Proveedor) => {
    setDeletingProveedor(prov);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProveedor(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingProveedor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProveedor) {
        await api.put(`/proveedores/${editingProveedor.id}`, formData);
        toast.success('Proveedor actualizado correctamente');
      } else {
        await api.post('/proveedores', formData);
        toast.success('Proveedor creado correctamente');
      }
      handleCloseModal();
      loadProveedores();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar proveedor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProveedor) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/proveedores/${deletingProveedor.id}`);
      toast.success('Proveedor eliminado correctamente');
      loadProveedores();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar proveedor');
    } finally {
      setIsSubmitting(false);
      handleCloseDeleteModal();
    }
  };

  const resetFilters = () => {
    setSearch('');
    setEstado('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Gestión de Proveedores</h1>
          <p className="text-sm text-muted-foreground">Administra tus proveedores, compras y relaciones comerciales</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadProveedores}
            disabled={isLoading}
            className="p-2 rounded-lg border border-input hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {isAdmin && (
            <button
              onClick={handleOpenNewModal}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90"
            >
              <Plus className="w-4 h-4" /> Nuevo Proveedor
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /><span className="text-foreground font-semibold">{proveedores.length}</span><span className="text-muted-foreground">Proveedores</span></div>
        <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /><span className="text-foreground font-semibold">{alDia}</span><span className="text-muted-foreground">Al Día</span></div>
        <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" /><span className="text-foreground font-semibold">{conDeuda}</span><span className="text-muted-foreground">Con Deuda</span></div>
        <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-destructive" /><span className="text-foreground font-semibold">{formatCurrencyFull(totalDeuda)}</span><span className="text-muted-foreground">Deuda Total</span></div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar proveedor..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={estado} onChange={e => setEstado(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground">
          <option value="">Todos los Estados</option>
          <option value="aldia">Al Día</option>
          <option value="deuda">Con Deuda</option>
        </select>
        <button onClick={resetFilters} className="px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground flex items-center gap-1.5 hover:bg-muted">
          <RefreshCw className="w-3.5 h-3.5" /> Reiniciar
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
          {error}
          <button onClick={loadProveedores} className="ml-4 underline">Reintentar</button>
        </div>
      )}

      {/* Cards */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((p, i) => (
            <div key={p.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${provColors[i % provColors.length]} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                  {getInitials(p.nombre)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{p.nombre}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.deuda === 0 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'} flex items-center gap-1`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${p.deuda === 0 ? 'bg-success' : 'bg-warning'}`} />
                  {p.deuda === 0 ? 'Al día' : 'Deuda'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <div><p className="text-xs text-muted-foreground">{p.telefono || 'Sin teléfono'}</p></div>
                <div className="text-right"><p className={`text-lg font-bold ${p.deuda > 0 ? 'text-destructive' : 'text-foreground'}`}>{formatCurrencyFull(p.deuda || 0)}</p><p className="text-xs text-muted-foreground">Deuda</p></div>
              </div>
              <div className="flex items-center gap-1 border-t border-border pt-3">
                <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="Ver detalles"><Eye className="w-4 h-4" /></button>
                {isAdmin && (
                  <>
                    <button onClick={() => handleOpenEditModal(p)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="Editar"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleOpenDeleteModal(p)} className="p-2 rounded-lg hover:bg-muted text-destructive" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                  </>
                )}
                {p.telefono && <a href={`tel:${p.telefono}`} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="Llamar"><Phone className="w-4 h-4" /></a>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No se encontraron proveedores
            </div>
          )}
        </div>
      )}

      {/* Modal crear/editar proveedor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">
                {editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h2>
              <button onClick={handleCloseModal} className="p-1 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-input bg-background" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-input bg-background" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono *</label>
                <input type="text" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-input bg-background" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dirección</label>
                <input type="text" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contacto</label>
                <input type="text" value={formData.contacto} onChange={e => setFormData({...formData, contacto: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notas</label>
                <textarea value={formData.notas} onChange={e => setFormData({...formData, notas: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-input bg-background" rows={2} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingProveedor ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {isDeleteModalOpen && deletingProveedor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md mx-4">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-lg font-bold">Eliminar Proveedor</h2>
              <p className="text-sm text-muted-foreground mt-2">
                ¿Eliminar a <strong>{deletingProveedor.nombre}</strong>?
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCloseDeleteModal} className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted">Cancelar</button>
              <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;
