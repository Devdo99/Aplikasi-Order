
import { StockItem } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  stocks: StockItem[];
  getQuantityForStock: (stockId: string) => number;
  onQuantityChange: (stockId: string, quantity: number) => void;
  onProductClick: (stock: StockItem) => void;
}

export default function ProductGrid({
  stocks,
  getQuantityForStock,
  onQuantityChange,
  onProductClick
}: ProductGridProps) {
  return (
    <div className="h-[calc(100vh-300px)] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
        {stocks.map(stock => (
          <ProductCard
            key={stock.id}
            stock={stock}
            quantity={getQuantityForStock(stock.id)}
            onQuantityChange={(quantity) => onQuantityChange(stock.id, quantity)}
            onCardClick={() => onProductClick(stock)}
          />
        ))}
      </div>
      {stocks.length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">Tidak ada produk ditemukan</p>
            <p className="text-sm">Coba ubah filter pencarian</p>
          </div>
        </div>
      )}
    </div>
  );
}
