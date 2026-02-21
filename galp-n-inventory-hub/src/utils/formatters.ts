export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatCurrency = (num: number): string => {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${formatNumber(num)}`;
  return `$${num}`;
};

export const formatCurrencyFull = (num: number): string => {
  return `$${formatNumber(num)}`;
};

export const getStockStatus = (stock: number, stockMin: number) => {
  if (stock <= stockMin * 0.3) return { status: 'critical' as const, label: 'Crítico' };
  if (stock <= stockMin) return { status: 'low' as const, label: 'Bajo' };
  return { status: 'normal' as const, label: 'Normal' };
};

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export const getCategoryEmoji = (cat: string): string => {
  const emojis: Record<string, string> = {
    alimentos: '🐕', medicamentos: '💊', suplementos: '💪', insumos: '🌾', accesorios: '🎀'
  };
  return emojis[cat] || '📦';
};
