import React from 'react';
import { OrderItem } from '@/types';

interface OrderSummaryProps {
  cart: OrderItem[];
  staffList: string[];
  defaultStaffName: string;
  preselectedTable?: string;
  onSubmitOrder: (
    customer?: string,
    tableNumber?: string,
    staff?: string,
    orderNotes?: string,
    orderType?: string
  ) => void;
  onUpdateQuantity: (stockId: string, newQty: number) => void;
  onUpdateItemNotes: (stockId: string, notes: string) => void;
  onRemoveItem: (stockId: string) => void; // <-- Tambahkan baris ini
}

export default function OrderSummary({
  cart,
  staffList,
  defaultStaffName,
  preselectedTable,
  onSubmitOrder,
  onUpdateQuantity,
  onUpdateItemNotes,
  onRemoveItem, // <-- Terima props baru ini
}: OrderSummaryProps) {
  // Contoh tampilan sederhana
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
        <ul className="mb-4">
          {cart.map((item) => (
            <li key={item.stockId} className="flex justify-between items-center py-2 border-b">
              <span>{item.stockName} x {item.quantity}</span>
              <div className="flex items-center">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => onUpdateQuantity(item.stockId, Number(e.target.value))}
                  className="w-16 border rounded px-2 py-1"
                />
                <button
                  onClick={() => onRemoveItem(item.stockId)} // <-- Panggil onRemoveItem saat tombol diklik
                  className="ml-2 text-red-600"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
        {/* Form pelanggan, staff, catatan, dsb bisa ditambahkan di sini */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded font-bold"
          onClick={() => onSubmitOrder()}
        >
          Simpan Pesanan
        </button>
      </div>
    </div>
  );
}