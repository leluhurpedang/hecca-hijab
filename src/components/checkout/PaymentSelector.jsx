import React from 'react';
import { CreditCard, QrCode, Building2, Truck } from 'lucide-react';

export const PAYMENT_METHODS = [
  {
    id: 'bca',
    name: 'Transfer Bank BCA',
    desc: 'Konfirmasi bukti transfer manual via WhatsApp',
    icon: Building2,
    badge: 'Paling Populer'
  },
  {
    id: 'mandiri',
    name: 'Transfer Bank Mandiri',
    desc: 'Konfirmasi bukti transfer manual via WhatsApp',
    icon: Building2
  },
  {
    id: 'bsi',
    name: 'Bank Syariah Indonesia (BSI)',
    desc: 'Pilihan transaksi perbankan syariah amanah',
    icon: Building2
  },
  {
    id: 'qris',
    name: 'QRIS & E-Wallet',
    desc: 'Scan QRIS GoPay, OVO, ShopeePay, DANA',
    icon: QrCode
  },
  {
    id: 'cod',
    name: 'Bayar di Tempat (COD)',
    desc: 'Khusus area Jabodetabek & konfirmasi admin',
    icon: Truck
  }
];

export function PaymentSelector({ selectedMethod = 'bca', onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider">
          Metode Pembayaran
        </label>
        <span className="text-[11px] text-stone-400">Instruksi akan dikirim via WhatsApp</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          const Icon = method.icon;

          return (
            <label
              key={method.id}
              className={`flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-mocha-500 bg-mocha-500/5 ring-1 ring-mocha-500 shadow-sm'
                  : 'border-sand-200 bg-white hover:border-sand-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={isSelected}
                onChange={() => onChange(method.id)}
                className="w-4 h-4 text-mocha-600 focus:ring-mocha-400 border-sand-300"
              />

              <div className="p-2 rounded-lg bg-sand-100 text-mocha-600 shrink-0">
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-espresso-900">
                    {method.name}
                  </span>
                  {method.badge && (
                    <span className="px-2 py-0.2 bg-gold-400/20 text-gold-600 text-[10px] font-bold rounded-full">
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">{method.desc}</p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
