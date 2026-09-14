import React from 'react';
import { Input, Textarea } from '../common/Input';
import { PaymentSelector } from './PaymentSelector';
import { validateIndonesianPhone } from '../../utils/whatsapp';

export const CITIES_LIST = [
  'Jakarta Selatan',
  'Jakarta Pusat',
  'Jakarta Barat',
  'Jakarta Timur',
  'Jakarta Utara',
  'Tangerang',
  'Tangerang Selatan',
  'Bekasi',
  'Bogor',
  'Depok',
  'Bandung',
  'Semarang',
  'Yogyakarta',
  'Solo / Surakarta',
  'Surabaya',
  'Malang',
  'Medan',
  'Palembang',
  'Makassar',
  'Denpasar',
];

export function CheckoutForm({
  formData,
  errors = {},
  onChange,
  onPaymentChange,
}) {
  const handleChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sand-200/80 shadow-soft text-left space-y-4">
        <h3 className="text-lg font-bold text-espresso-950 pb-3 border-b border-sand-200">
          1. Data Pemesan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Lengkap Penerima"
            name="customerName"
            required
            placeholder="Contoh: Sarah Nabila"
            value={formData.customerName || ''}
            error={errors.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
          />

          <Input
            label="Nomor WhatsApp Aktif"
            name="phone"
            type="tel"
            required
            placeholder="081234567890"
            helperText="Digunakan untuk konfirmasi & update resi"
            value={formData.phone || ''}
            error={errors.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sand-200/80 shadow-soft text-left space-y-4">
        <h3 className="text-lg font-bold text-espresso-950 pb-3 border-b border-sand-200">
          2. Alamat Pengiriman
        </h3>

        <div className="space-y-4">
          <Textarea
            label="Alamat Lengkap (Jalan, RT/RW, No. Rumah, Patokan)"
            name="address"
            required
            rows={3}
            placeholder="Jl. Senopati No. 42, RT 02/05, Kebayoran Baru (Pagar Hitam)"
            value={formData.address || ''}
            error={errors.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1.5">
                Kota / Kabupaten <span className="text-rose-500">*</span>
              </label>
              <input
                list="city-options"
                name="city"
                required
                placeholder="Pilih atau ketik kota tujuan..."
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-espresso-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-mocha-400/40 focus:border-mocha-500 transition-colors ${
                  errors.city ? 'border-rose-400 focus:border-rose-500' : 'border-sand-200'
                }`}
              />
              <datalist id="city-options">
                {CITIES_LIST.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
              {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city}</p>}
            </div>

            <Input
              label="Kode Pos"
              name="postalCode"
              placeholder="12190"
              value={formData.postalCode || ''}
              error={errors.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
            />
          </div>

          <Textarea
            label="Catatan Pengiriman (Opsional)"
            name="notes"
            rows={2}
            placeholder="Tuliskan jika ada request kartu ucapan kado atau instruksi kurir..."
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>
      </div>

      {/* Payment Selection */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sand-200/80 shadow-soft text-left">
        <h3 className="text-lg font-bold text-espresso-950 pb-3 border-b border-sand-200 mb-4">
          3. Pembayaran
        </h3>
        <PaymentSelector
          selectedMethod={formData.paymentMethod}
          onChange={onPaymentChange}
        />
      </div>
    </div>
  );
}
