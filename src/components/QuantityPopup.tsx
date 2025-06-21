
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { StockItem } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface QuantityPopupProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockItem | null;
  onAddToCart: (quantity: number, itemNotes?: string, itemOrderType?: string) => void;
  defaultOrderType?: string;
}

export default function QuantityPopup({ isOpen, onClose, stock, onAddToCart, defaultOrderType }: QuantityPopupProps) {
  const { settings } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [itemNotes, setItemNotes] = useState('');
  const [itemOrderType, setItemOrderType] = useState(defaultOrderType || '');

  const orderTypesOptions = settings.orderTypes && settings.orderTypes.length > 0 ? settings.orderTypes : ['Dine In', 'Take Away', 'Delivery'];

  if (!stock) return null;

  const handleSubmit = () => {
    onAddToCart(quantity, itemNotes || undefined, itemOrderType || undefined);
    setQuantity(1);
    setItemNotes('');
    setItemOrderType(defaultOrderType || '');
    onClose();
  };

  const handleClose = () => {
    setQuantity(1);
    setItemNotes('');
    setItemOrderType(defaultOrderType || '');
    onClose();
  };

  const isOutOfStock = stock.currentStock === 0;
  const maxQuantity = stock.currentStock;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] max-h-[95vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-7 w-7" />
            Tambah ke Keranjang
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-md mx-auto space-y-6">
            {/* Product Info */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold">{stock.name}</h3>
              <p className="text-gray-500">{stock.category}</p>
              <p className="text-gray-600 mt-2">
                Stok tersedia: {stock.currentStock} {stock.unit}
              </p>
            </div>

            {isOutOfStock ? (
              <div className="text-center py-8">
                <p className="text-red-600 font-medium text-lg">Stok habis</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Order Type for Item */}
                <div>
                  <Label htmlFor="itemOrderType">Jenis Order untuk Item Ini</Label>
                  <Select value={itemOrderType} onValueChange={setItemOrderType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis order (opsional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sama dengan order umum</SelectItem>
                      {orderTypesOptions.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Kosongkan jika sama dengan jenis order umum
                  </p>
                </div>

                {/* Quantity Input */}
                <div>
                  <Label>Jumlah Pesanan</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-12 w-12 p-0"
                    >
                      <Minus className="h-5 w-5" />
                    </Button>

                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(maxQuantity, Math.max(1, val)));
                      }}
                      className="text-center text-xl h-12 flex-1"
                      min={1}
                      max={maxQuantity}
                    />

                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity}
                      className="h-12 w-12 p-0"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Maksimal: {maxQuantity} {stock.unit}
                  </p>
                </div>

                {/* Item Notes */}
                <div>
                  <Label htmlFor="itemNotes">Catatan untuk Item Ini</Label>
                  <Textarea
                    id="itemNotes"
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    placeholder="Tambahkan catatan khusus untuk item ini..."
                    className="min-h-[80px]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={handleClose} className="flex-1 h-12">
                    Batal
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1 h-12 text-lg">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Tambah ({quantity})
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
