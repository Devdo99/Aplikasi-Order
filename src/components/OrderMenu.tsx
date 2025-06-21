import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import { OrderItem, StockItem } from '@/types';
import OrderSummary from './OrderSummary';
import { X } from 'lucide-react';

interface OrderMenuProps {
  preselectedTable?: string;
  onOrderComplete?: () => void;
  isFullScreen?: boolean;
}

export default function OrderMenu({ preselectedTable, onOrderComplete }: OrderMenuProps) {
  const { stocks, staffList = [], settings = {} } = useApp();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // State untuk form pelanggan
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState(preselectedTable || '');
  const [selectedStaff, setSelectedStaff] = useState(staffList[0] || '');

  // Filter kategori
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const categories = ['Semua', ...Array.from(new Set(stocks.map(s => s.category || 'Lainnya')))];

  const filteredStocks = selectedCategory === 'Semua'
    ? stocks
    : stocks.filter(s => (s.category || 'Lainnya') === selectedCategory);

  // State untuk preview struk & printer
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [printCount, setPrintCount] = useState(1);
  const [connectedPrinters] = useState(2); // Ganti sesuai deteksi printer asli

  // Handler submit form pelanggan
  const handleCustomerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCustomerForm(false);
  };

  // Handler tambah ke keranjang
  const handleAddToCart = (stock: StockItem) => {
    if (stock.currentStock === 0) {
      toast({
        title: 'Stok Habis',
        description: `${stock.name} tidak tersedia`,
        variant: 'destructive',
      });
      return;
    }
    setCart((prev) => {
      const exist = prev.find((item) => item.stockId === stock.id);
      if (exist) {
        return prev.map((item) =>
          item.stockId === stock.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: stock.id,
          stockId: stock.id,
          stockName: stock.name,
          unit: stock.unit,
          quantity: 1,
        },
      ];
    });
  };

  // Handler hapus dari keranjang
  const handleRemoveFromCart = (stockId: string) => {
    setCart(prev => prev.filter(item => item.stockId !== stockId));
  };

  const handleUpdateQuantity = (stockId: string, newQty: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.stockId === stockId
          ? { ...item, quantity: Math.max(1, newQty) }
          : item
      )
    );
  };

  const handleUpdateItemNotes = (stockId: string, notes: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.stockId === stockId
          ? { ...item, notes }
          : item
      )
    );
  };

  // Handler submit order: tampilkan preview struk, jangan langsung kosongkan cart
  const handleSubmitOrder = (
    customer?: string,
    tableNumber?: string,
    staff?: string,
    orderNotes?: string,
    orderType?: string
  ) => {
    setIsSummaryOpen(false);
    setShowReceiptPreview(true); // Tampilkan popup preview struk
    if (onOrderComplete) onOrderComplete();
  };

  // FORMULIR FULL SCREEN
  if (showCustomerForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 animate-fade-in">
        <form
          onSubmit={handleCustomerFormSubmit}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up border-4 border-blue-200"
          style={{ minHeight: 420 }}
        >
          <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 tracking-wide drop-shadow">Data Pelanggan</h2>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-blue-700">Nama Pelanggan</label>
            <input
              type="text"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              required
              placeholder="Masukkan nama pelanggan"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-blue-700">Nomor Meja</label>
            <input
              type="text"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              required
              placeholder="Masukkan nomor meja"
            />
          </div>
          <div className="mb-10">
            <label className="block text-sm font-semibold mb-2 text-blue-700">Staff</label>
            <select
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white"
              value={selectedStaff}
              onChange={e => setSelectedStaff(e.target.value)}
              required
            >
              <option value="" disabled>Pilih staff</option>
              {staffList.map((staff) => (
                <option key={staff} value={staff}>{staff}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-lg font-bold text-lg shadow hover:from-blue-700 hover:to-blue-500 transition"
          >
            Lanjutkan
          </button>
        </form>
        <style>{`
          .animate-fade-in { animation: fadeIn .3s ease; }
          .animate-slide-up { animation: slideUp .4s cubic-bezier(.4,2,.6,1); }
          @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
          @keyframes slideUp { from { transform:translateY(40px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        `}</style>
      </div>
    );
  }

  // MENU FULL SCREEN
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 z-40 overflow-auto">
        <div className="max-w-6xl mx-auto py-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center drop-shadow">Pilih Menu Makanan & Minuman</h2>
          
          {/* Filter kategori */}
          <div className="flex justify-center mb-8">
            <select
              className="border-2 border-blue-300 rounded-lg px-4 py-2 text-blue-700 font-semibold bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2">
            {filteredStocks.map((stock) => {
              const cartItem = cart.find(item => item.stockId === stock.id);
              return (
                <div
                  key={stock.id}
                  className={`relative border-2 rounded-xl p-5 shadow-lg flex flex-col items-center bg-white transition-all duration-200 hover:shadow-2xl hover:scale-105 ${
                    stock.currentStock === 0 ? 'opacity-60' : ''
                  }`}
                >
                  <div className="font-bold text-lg mb-2 text-blue-800">{stock.name}</div>
                  <div className="text-gray-500 mb-2">{stock.unit}</div>
                  <div className="text-xs text-blue-400 mb-3">{stock.category}</div>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition"
                    onClick={() => handleAddToCart(stock)}
                    disabled={stock.currentStock === 0}
                  >
                    {stock.currentStock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                  </button>
                  {/* Tombol hapus pilihan jika sudah dipilih */}
                  {cartItem && (
                    <button
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition"
                      title="Hapus pilihan"
                      onClick={() => handleRemoveFromCart(stock.id)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {/* Badge jumlah jika sudah dipilih */}
                  {cartItem && (
                    <span className="absolute top-2 left-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {cartItem.quantity}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tombol buka ringkasan pesanan */}
        <button
          onClick={() => setIsSummaryOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:from-blue-700 hover:to-blue-500 transition"
          disabled={cart.length === 0}
        >
          Lihat Keranjang ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </button>

        {/* Popup ringkasan pesanan */}
        {isSummaryOpen && (
          <OrderSummary
            cart={cart}
            staffList={staffList}
            defaultStaffName={(settings as any).defaultStaffName || (staffList[0] ?? '')}
            preselectedTable={tableNumber}
            onSubmitOrder={handleSubmitOrder}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdateItemNotes={handleUpdateItemNotes}
            onRemoveItem={handleRemoveFromCart}
          />
        )}

        {/* Popup preview struk */}
        {showReceiptPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up border-4 border-blue-200">
              <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Preview Struk</h2>
              <div className="mb-4 text-sm text-gray-700">
                <div className="font-bold mb-2">Pelanggan: {customerName}</div>
                <div className="mb-2">Meja: {tableNumber}</div>
                <div className="mb-2">Staff: {selectedStaff}</div>
                <ul className="mb-2">
                  {cart.map(item => (
                    <li key={item.stockId}>
                      {item.stockName} x {item.quantity}
                    </li>
                  ))}
                </ul>
                <div className="mt-2">Total item: {cart.reduce((sum, item) => sum + item.quantity, 0)}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 text-blue-700">Jumlah Cetak</label>
                <input
                  type="number"
                  min={1}
                  max={connectedPrinters}
                  value={printCount}
                  onChange={e => setPrintCount(Number(e.target.value))}
                  className="w-20 border-2 border-blue-200 rounded-lg px-3 py-2 text-lg"
                />
                <span className="ml-2 text-xs text-gray-500">/ {connectedPrinters} printer terhubung</span>
              </div>
              <div className="flex gap-4">
                <button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-lg font-bold text-lg shadow hover:from-blue-700 hover:to-blue-500 transition"
                  onClick={() => {
                    // TODO: Implementasi cetak ke printer
                    setShowReceiptPreview(false);
                    setCart([]);
                  }}
                >
                  Cetak Struk
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 rounded-lg font-bold text-lg shadow hover:from-orange-600 hover:to-orange-500 transition"
                  onClick={() => {
                    setShowReceiptPreview(false);
                    setCart([]);
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
            <style>{`
              .animate-slide-up { animation: slideUp .4s cubic-bezier(.4,2,.6,1); }
              @keyframes slideUp { from { transform:translateY(40px); opacity:0 } to { transform:translateY(0); opacity:1 } }
            `}</style>
          </div>
        )}
      </div>
    </>
  );
}