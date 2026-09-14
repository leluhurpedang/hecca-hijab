import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ShoppingBag } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummaryCard } from '../components/checkout/OrderSummaryCard';
import { WhatsAppOrderSuccessModal } from '../components/checkout/WhatsAppOrderSuccessModal';
import { EmptyState } from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useCMS } from '../context/CMSContext';
import { generateWhatsAppOrderUrl, validateIndonesianPhone } from '../utils/whatsapp';

export function CheckoutPage() {
  const { items, subtotal, shippingFee, discount, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const { cms } = useCMS();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'bca',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalData, setSuccessModalData] = useState(null);

  const validate = () => {
    const errs = {};

    if (!formData.customerName.trim()) {
      errs.customerName = 'Nama lengkap penerima wajib diisi.';
    } else if (formData.customerName.trim().length < 2) {
      errs.customerName = 'Nama minimal 2 karakter.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Nomor WhatsApp wajib diisi.';
    } else if (!validateIndonesianPhone(formData.phone.trim())) {
      errs.phone = 'Format nomor tidak valid (Gunakan format 08... atau 628...).';
    }

    if (!formData.address.trim()) {
      errs.address = 'Alamat pengiriman lengkap wajib diisi.';
    } else if (formData.address.trim().length < 10) {
      errs.address = 'Mohon masukkan alamat lengkap beserta nama jalan & nomor rumah.';
    }

    if (!formData.city.trim()) {
      errs.city = 'Kota atau kabupaten tujuan pengiriman wajib diisi.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) {
      showToast('Mohon lengkapi semua kolom bertanda bintang (*)', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Keranjang belanja Anda kosong.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentLabels = {
        bca: 'Transfer Bank BCA',
        mandiri: 'Transfer Bank Mandiri',
        bsi: 'Bank Syariah Indonesia (BSI)',
        qris: 'QRIS / E-Wallet',
        cod: 'Cash on Delivery (COD)'
      };

      const orderPayload = {
        ...formData,
        paymentMethod: paymentLabels[formData.paymentMethod] || formData.paymentMethod,
        items,
        subtotal,
        shippingFee,
        discount,
        totalPrice,
      };

      const adminPhone =
        cms?.whatsapp?.recipientNumber ||
        cms?.whatsappSettings?.recipientNumber ||
        cms?.store?.whatsappNumber ||
        cms?.storeSettings?.whatsappNumber;
      const customGreeting =
        cms?.whatsapp?.greetingTemplate ||
        cms?.whatsappSettings?.greetingTemplate ||
        '';
      const additionalNote =
        cms?.whatsapp?.defaultAdditionalNote ||
        cms?.whatsappSettings?.orderNotes ||
        '';

      const whatsappUrl = generateWhatsAppOrderUrl(
        orderPayload,
        adminPhone,
        customGreeting,
        additionalNote
      );
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      clearCart();

      setSuccessModalData({
        url: whatsappUrl,
        name: formData.customerName,
      });

      showToast('Pesanan berhasil dibuat! Membuka WhatsApp...', 'success');
    } catch (e) {
      console.error('Failed to generate WhatsApp order', e);
      showToast('Terjadi kendala saat memproses pesanan. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !successModalData) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center p-4">
        <SEO title="Checkout - Keranjang Kosong | Haecca Hijab" noindex={true} />
        <EmptyState
          icon={ShoppingBag}
          title="Keranjang Anda Kosong"
          description="Silakan pilih produk terlebih dahulu sebelum melanjutkan ke halaman checkout."
          actionLabel="Kembali ke Katalog"
          actionTo="/shop"
        />
      </main>
    );
  }

  return (
    <>
      <SEO
        title="Checkout Pemesanan via WhatsApp | Haecca Hijab"
        description="Lengkapi data pengiriman Anda untuk menyelesaikan pemesanan hijab berstandar butik Haecca Hijab."
        noindex={true}
      />

      <main className="min-h-screen bg-cream-100/50 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 text-left">
          <Breadcrumb
            items={[
              { label: 'Keranjang', to: '/cart' },
              { label: 'Informasi Pengiriman & Checkout' },
            ]}
          />

          <div className="py-6 border-b border-sand-200/80 mb-8">
            <span className="text-xs font-semibold tracking-wider uppercase text-mocha-600">
              Langkah Terakhir
            </span>
            <h1 className="text-3xl sm:text-4xl text-espresso-950 font-bold tracking-tight">
              Penyelesaian Pesanan
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <CheckoutForm
                formData={formData}
                errors={errors}
                onChange={setFormData}
                onPaymentChange={(val) => setFormData((prev) => ({ ...prev, paymentMethod: val }))}
              />
            </div>

            <div className="lg:col-span-5">
              <OrderSummaryCard
                items={items}
                subtotal={subtotal}
                shippingFee={shippingFee}
                discount={discount}
                totalPrice={totalPrice}
                onPlaceOrder={handlePlaceOrder}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>

        {successModalData && (
          <WhatsAppOrderSuccessModal
            isOpen={true}
            whatsappUrl={successModalData.url}
            customerName={successModalData.name}
            onClose={() => {
              setSuccessModalData(null);
              navigate('/');
            }}
          />
        )}
      </main>
    </>
  );
}
