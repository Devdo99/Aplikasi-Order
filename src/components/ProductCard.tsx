import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StockItem } from '@/types';
import { Package, Plus, Minus, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  stock: StockItem;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onCardClick: () => void;
}

export default function ProductCard({ stock, quantity, onQuantityChange, onCardClick }: ProductCardProps) {
  const isOutOfStock = stock.currentStock === 0;
  const isLowStock = stock.currentStock <= stock.minStock && stock.currentStock > 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Jangan trigger popup jika klik pada tombol quantity
    if ((e.target as HTMLElement).closest('.quantity-controls')) {
      return;
    }
    onCardClick();
  };

  return (
    <Card 
      className={`group transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer ${
        isOutOfStock ? 'opacity-60' : ''
      } ${quantity > 0 ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          {/* Product Image Placeholder */}
          <div className="relative w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-colors">
            <Package className="h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
            
            {/* Add to Cart Overlay */}
            {!isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            )}

            {/* Quantity Badge */}
            {quantity > 0 && (
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {quantity}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-700 transition-colors">
              {stock.name}
            </h3>
            <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
              {stock.category}
            </p>
            
            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">
                Stok: <span className="font-medium">{stock.currentStock}</span>
              </span>
              {isLowStock && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                  Menipis
                </span>
              )}
              {isOutOfStock && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                  Habis
                </span>
              )}
            </div>
          </div>

          {/* Quantity Controls */}
          {!isOutOfStock && quantity > 0 && (
            <div
              className="quantity-controls flex items-center justify-between mt-3 pt-3 border-t"
              onClick={e => e.stopPropagation()} // <-- cegah bubbling ke kartu
            >
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={e => {
                    e.stopPropagation();
                    onQuantityChange(Math.max(0, quantity - 1));
                  }}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-bold text-blue-600">
                  {quantity}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={e => {
                    e.stopPropagation();
                    onQuantityChange(Math.min(stock.currentStock, quantity + 1));
                  }}
                  disabled={quantity >= stock.currentStock}
                  className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-300"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">
                {stock.unit}
              </span>
            </div>
          )}

          {/* Add to Cart Hint */}
          {!isOutOfStock && quantity === 0 && (
            <div className="mt-3 text-center">
              <div className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors flex items-center justify-center gap-1">
                <ShoppingCart className="h-3 w-3" />
                Klik untuk tambah
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}