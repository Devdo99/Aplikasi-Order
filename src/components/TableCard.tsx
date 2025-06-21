
import { Card, CardContent } from '@/components/ui/card';
import { Table } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Users, Clock, CheckCircle, Plus } from 'lucide-react';
import FullScreenOrderDialog from './FullScreenOrderDialog';

interface TableCardProps {
  table: Table;
}

export default function TableCard({ table }: TableCardProps) {
  const { orders } = useApp();

  // Find active order for this table
  const tableOrder = orders.find(order => 
    order.tableNumber === table.number && order.status === 'pending'
  );

  // Table is available (green) if no active pending order
  const actualStatus = tableOrder ? 'occupied' : 'available';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'occupied':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'reserved':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'occupied':
        return <Users className="h-4 w-4 text-red-600" />;
      case 'reserved':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Kosong';
      case 'occupied':
        return 'Terisi';
      case 'reserved':
        return 'Reservasi';
      default:
        return 'Tidak Diketahui';
    }
  };

  return (
    <FullScreenOrderDialog tableNumber={table.number}>
      <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${getStatusColor(actualStatus)}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Table Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(actualStatus)}
                <span className="font-bold text-lg">{table.number}</span>
              </div>
              <span className="text-xs font-medium capitalize px-2 py-1 rounded-full bg-white/50">
                {getStatusText(actualStatus)}
              </span>
            </div>

            {/* Table Info */}
            <div className="text-sm text-gray-600">
              <div>Kapasitas: {table.capacity} orang</div>
              {tableOrder && (
                <div className="mt-2 p-2 bg-white/70 rounded">
                  <div className="font-medium text-blue-700">Order Aktif:</div>
                  <div className="text-xs">{tableOrder.orderNumber}</div>
                  <div className="text-xs">{tableOrder.totalItems} items</div>
                  <div className="text-xs">Staff: {tableOrder.staffName}</div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-2 border-t border-white/50">
              <div className="flex items-center justify-center gap-1 text-sm font-medium text-blue-600">
                <Plus className="h-4 w-4" />
                {tableOrder ? 'Lihat Pesanan' : 'Buat Pesanan'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </FullScreenOrderDialog>
  );
}
