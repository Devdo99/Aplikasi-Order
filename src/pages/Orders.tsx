
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';
import OrderTypeSelection from '@/components/OrderTypeSelection';
import FullScreenOrderDialog from '@/components/FullScreenOrderDialog';

export default function Orders() {
  const { orders } = useApp();
  const [selectedOrderType, setSelectedOrderType] = useState<string>('');

  const handleOrderTypeSelect = (orderType: string) => {
    setSelectedOrderType(orderType);
  };

  if (!selectedOrderType) {
    return (
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Management Order</h1>
          <p className="text-gray-600 text-sm lg:text-base">Buat pesanan baru</p>
        </div>

        <OrderTypeSelection onSelectOrderType={handleOrderTypeSelect} />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Management Order - {selectedOrderType}</h1>
          <p className="text-gray-600 text-sm lg:text-base">Buat pesanan baru</p>
        </div>
        <button
          onClick={() => setSelectedOrderType('')}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Ubah Jenis Order
        </button>
      </div>

      {/* Direct to menu for non-dine-in orders */}
      <div className="flex justify-center">
        <FullScreenOrderDialog>
          <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 bg-blue-50 border-blue-200 hover:bg-blue-100 max-w-md">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-700">Pilih Menu</h3>
                  <p className="text-sm text-blue-600">Mulai memilih menu untuk {selectedOrderType}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FullScreenOrderDialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-gray-600">Total Order</p>
                <p className="text-lg lg:text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-gray-600">Pending</p>
                <p className="text-lg lg:text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-gray-600">Selesai</p>
                <p className="text-lg lg:text-2xl font-bold">{orders.filter(o => o.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-4 w-4 lg:h-5 lg:w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs lg:text-sm text-gray-600">Dibatalkan</p>
                <p className="text-lg lg:text-2xl font-bold">{orders.filter(o => o.status === 'cancelled').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
