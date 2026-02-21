import { ReactNode } from 'react';

interface MobileTableColumn<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface MobileTableProps<T> {
  data: T[];
  columns: MobileTableColumn<T>[];
  keyExtractor: (item: T) => string | number;
  onItemClick?: (item: T) => void;
  emptyMessage?: string;
}

/**
 * Componente para mostrar datos en formato de cards en móvil
 * Usar junto con tablas normales para mejor experiencia responsive
 */
export function MobileTable<T>({
  data,
  columns,
  keyExtractor,
  onItemClick,
  emptyMessage = 'No hay datos para mostrar'
}: MobileTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="md:hidden text-center py-12 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-3">
      {data.map(item => (
        <div
          key={keyExtractor(item)}
          onClick={() => onItemClick?.(item)}
          className={`bg-card rounded-lg border border-border p-4 ${
            onItemClick ? 'cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors' : ''
          }`}
        >
          <div className="space-y-2">
            {columns.map(col => (
              <div key={col.key} className="flex justify-between items-center gap-3">
                <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
                  {col.label}:
                </span>
                <span className={`text-sm text-foreground flex-1 text-right ${col.className || ''}`}>
                  {col.render(item)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MobileTable;

