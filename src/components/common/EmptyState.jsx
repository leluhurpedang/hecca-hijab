import React from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = PackageOpen,
  title = 'Tidak Ada Data',
  description = 'Belum ada produk atau data yang dapat ditampilkan.',
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center text-mocha-500 mb-4 shadow-inner">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-2xl text-espresso-900 mb-2 font-bold">
        {title}
      </h3>
      <p className="text-sm text-stone-500 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button variant="primary" size="md">
            {actionLabel}
          </Button>
        </Link>
      )}
      {actionLabel && !actionTo && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
