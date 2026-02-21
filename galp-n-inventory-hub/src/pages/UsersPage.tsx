import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/utils/formatters';
import { Pencil, Trash2, UserPlus, X, Loader2, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'empleado';
  activo: boolean;
}

const UsersPage = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [deletingUser, setDeletingUser] = useState<Usuario | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'empleado' as 'admin' | 'empleado',
  });

  const { user: currentUser } = useAuthStore();

  // Cargar usuarios desde el backend
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar que haya token
      const token = localStorage.getItem('auth_token');
      console.log('🔍 Verificando token:', token ? 'Existe ✅' : 'NO existe ❌');

      if (!token) {
        setError('No estás autenticado. Por favor, inicia sesión de nuevo.');
        setIsLoading(false);
        return;
      }

      console.log('📡 Cargando usuarios desde /usuarios...');
      const response = await api.get('/usuarios');
      console.log('✅ Respuesta recibida:', response.data);

      // Laravel devuelve datos paginados en response.data.data.data
      // O puede ser response.data.data si es un array directo
      let data = response.data?.data?.data || response.data?.data || response.data || [];

      // Si data es un objeto con propiedades numéricas, convertirlo a array
      if (!Array.isArray(data) && typeof data === 'object') {
        data = Object.values(data);
      }

      console.log('👥 Usuarios parseados:', data);
      console.log('📊 Cantidad de usuarios:', Array.isArray(data) ? data.length : 'No es array');

      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('❌ Error cargando usuarios:', err);
      console.error('📋 Detalles del error:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data
      });

      if (err.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      } else if (err.response?.status === 403) {
        setError('No tienes permisos para ver los usuarios. Solo los administradores pueden acceder.');
      } else {
        setError(err.response?.data?.message || 'Error al cargar usuarios. Verifica que el backend esté corriendo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenNewModal = () => {
    setEditingUser(null);
    setFormData({ nombre: '', email: '', rol: 'empleado' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: Usuario) => {
    setEditingUser(user);
    setFormData({ nombre: user.nombre, email: user.email, rol: user.rol });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (user: Usuario) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ nombre: '', email: '', rol: 'empleado' });
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  // Crear o editar usuario en el backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingUser) {
        // Editar usuario existente
        console.log('✏️ Editando usuario:', editingUser.id);
        await api.put(`/usuarios/${editingUser.id}`, {
          nombre: formData.nombre,
          rol: formData.rol,
        });
        toast.success('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        console.log('➕ Creando nuevo usuario');
        await api.post('/usuarios', formData);
        toast.success('Usuario creado correctamente. Se enviará un email de bienvenida.');
      }
      handleCloseModal();
      await loadUsers(); // Recargar la lista
      console.log('✅ Usuarios recargados después de guardar');
    } catch (err: any) {
      console.error('❌ Error guardando usuario:', err);
      toast.error(err.response?.data?.message || 'Error al guardar usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar usuario en el backend
  const handleDelete = async () => {
    if (!deletingUser) return;

    if (deletingUser.id === currentUser?.id) {
      toast.error('No puedes eliminar tu propia cuenta');
      handleCloseDeleteModal();
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('🗑️ Eliminando usuario:', deletingUser.id);
      await api.delete(`/usuarios/${deletingUser.id}`);
      toast.success('Usuario eliminado correctamente');
      handleCloseDeleteModal();
      await loadUsers(); // Recargar la lista DESPUÉS de cerrar el modal
      console.log('✅ Usuarios recargados después de eliminar');
    } catch (err: any) {
      console.error('❌ Error eliminando usuario:', err);
      toast.error(err.response?.data?.message || 'Error al eliminar usuario');
      handleCloseDeleteModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Activar/Desactivar usuario en el backend
  const handleToggleActivo = async (user: Usuario) => {
    if (user.id === currentUser?.id) {
      toast.error('No puedes desactivar tu propia cuenta');
      return;
    }
    try {
      console.log('🔄 Cambiando estado de usuario:', user.id);
      await api.patch(`/usuarios/${user.id}/toggle-activo`);
      toast.success(user.activo ? 'Usuario desactivado' : 'Usuario activado');
      await loadUsers(); // Recargar la lista
      console.log('✅ Usuarios recargados después de cambiar estado');
    } catch (err: any) {
      console.error('❌ Error cambiando estado:', err);
      toast.error(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-sm text-muted-foreground">
            Administra los usuarios del sistema ({users.length} usuarios)
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="p-2 rounded-lg border border-input hover:bg-muted disabled:opacity-50"
            title="Recargar"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenNewModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <UserPlus className="w-4 h-4" />
            Agregar Usuario
          </button>
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
          <p className="font-semibold mb-2">{error}</p>
          {error.includes('sesión') || error.includes('autenticado') ? (
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90"
            >
              Ir a Login
            </button>
          ) : (
            <button onClick={loadUsers} className="underline hover:no-underline">
              Reintentar
            </button>
          )}
        </div>
      )}

      {/* Lista de usuarios */}
      {!isLoading && !error && (
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map(u => (
              <div key={u.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground font-bold ${u.activo ? 'bg-primary' : 'bg-muted-foreground'}`}>
                  {getInitials(u.nombre)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    {u.nombre}
                    {u.id === currentUser?.id && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Tú</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.rol === 'admin' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'}`}>
                  {u.rol === 'admin' ? '👑 Administrador' : '👤 Empleado'}
                </span>
                <span className={`flex items-center gap-1.5 text-xs ${u.activo ? 'text-success' : 'text-muted-foreground'}`}>
                  <span className={`w-2 h-2 rounded-full ${u.activo ? 'bg-success' : 'bg-destructive'}`} />
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>

                <div className="flex gap-1">
                  <button onClick={() => handleOpenEditModal(u)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" title="Editar">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleToggleActivo(u)} className={`p-2 rounded-lg hover:bg-muted disabled:opacity-50 ${u.activo ? 'text-warning' : 'text-success'}`} title={u.activo ? 'Desactivar' : 'Activar'} disabled={u.id === currentUser?.id}>
                    {u.activo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleOpenDeleteModal(u)} className="p-2 rounded-lg hover:bg-muted text-destructive disabled:opacity-50" title="Eliminar" disabled={u.id === currentUser?.id}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No hay usuarios registrados
              <p className="mt-2">
                <button onClick={handleOpenNewModal} className="text-primary underline">
                  Crear el primer usuario
                </button>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal para crear/editar usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button onClick={handleCloseModal} className="p-1 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  placeholder="correo@ejemplo.com"
                  required
                  disabled={!!editingUser}
                />
                {editingUser && (
                  <p className="text-xs text-muted-foreground mt-1">El correo no se puede modificar</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Rol</label>
                <select
                  value={formData.rol}
                  onChange={e => setFormData({ ...formData, rol: e.target.value as 'admin' | 'empleado' })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="empleado">👤 Empleado</option>
                  <option value="admin">👑 Administrador</option>
                </select>
              </div>

              {!editingUser && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    ℹ️ Al crear el usuario, se enviará un correo de bienvenida con instrucciones para iniciar sesión.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && deletingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md mx-4">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Eliminar Usuario</h2>
              <p className="text-sm text-muted-foreground mt-2">
                ¿Estás seguro de que deseas eliminar a <strong>{deletingUser.nombre}</strong>?
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={handleCloseDeleteModal} className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted">
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
