
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { ShoppingCart, Car, Package, Users } from 'lucide-react';
import TableCard from './TableCard';
import FullScreenOrderDialog from './FullScreenOrderDialog';

interface OrderTypeSelectionProps {
  onSelectOrderType: (orderType: string) => void;
}

export default function OrderTypeSelection({ onSelectOrderType }: OrderTypeSelectionProps) {
  const { settings, tables } = useApp();
  const [selectedOrderType, setSelectedOrderType] = useState<string>('');
  const [showTableSelection, setShowTableSelection] = useState(false);

  const orderTypes = [
    {
      id: 'dine-in',
      title: 'Dine In',
      description: 'Makan di tempat',
      icon: Users,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700'
    },
    {
      id: 'take-away',
      title: 'Take Away',
      description: 'Bawa pulang',
      icon: Car,
      color: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700'
    }
  ];

  // Add package categories if enabled
  if (settings.enablePackageMenu && settings.packageCategories) {
    settings.packageCategories.forEach((category, index) => {
      orderTypes.push({
        id: `package-${index}`,
        title: category,
        description: 'Paket makanan',
        icon: Package,
        color: 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700'
      });
    });
  }

  const handleOrderTypeSelect = (orderType: any) => {
    if (orderType.id === 'dine-in') {
      setSelectedOrderType('Dine In');
      setShowTableSelection(true);
    } else {
      onSelectOrderType(orderType.title);
    }
  };

  if (showTableSelection) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowTableSelection(false)}
            className="mb-4"
          >
            ← Kembali ke Pilihan Order
          </Button>
          <h2 className="text-2xl font-bold mb-2">Pilih Meja</h2>
          <p className="text-gray-600">Pilih meja untuk order Dine In</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4">
          {tables.map((table) => (
            <TableCard key={table.id} table={table} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Pilih Jenis Pesanan</h2>
        <p className="text-gray-600">Tentukan jenis pesanan untuk melanjutkan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {orderTypes.map((orderType) => (
          <Card
            key={orderType.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${orderType.color}`}
            onClick={() => handleOrderTypeSelect(orderType)}
          >
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-white/50 rounded-full flex items-center justify-center">
                  <orderType.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{orderType.title}</h3>
                  <p className="text-sm opacity-80">{orderType.description}</p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-center gap-1 text-sm font-medium">
                    <ShoppingCart className="h-4 w-4" />
                    Pilih
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orderTypes.length > 3 && (
        <FullScreenOrderDialog>
          <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700 max-w-sm mx-auto">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-white/50 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Order Umum</h3>
                  <p className="text-sm opacity-80">Buat pesanan tanpa meja</p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-center gap-1 text-sm font-medium">
                    <ShoppingCart className="h-4 w-4" />
                    Pilih
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FullScreenOrderDialog>
      )}
    </div>
  );
}
