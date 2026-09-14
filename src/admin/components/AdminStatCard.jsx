import React from 'react';

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default', // 'default' | 'warning' | 'success' | 'gold'
}) {
  const variants = {
    default: {
      bg: 'bg-white',
      border: 'border-sand-200/80',
      iconBg: 'bg-sand-100 text-mocha-600',
    },
    warning: {
      bg: 'bg-amber-50/50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    success: {
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    gold: {
      bg: 'bg-gold-50/50',
      border: 'border-gold-200',
      iconBg: 'bg-gold-100 text-gold-700',
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <div className={`${style.bg} ${style.border} border rounded-2xl p-5 sm:p-6 shadow-soft text-left flex items-start justify-between gap-4 transition-all hover:shadow-card`}>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-espresso-950">
          {value}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-stone-500 pt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
