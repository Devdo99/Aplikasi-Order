
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { Order } from '@/types';
import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ReceiptPreview from '@/components/ReceiptPreview';

export default function OrderList() {
  const { orders, updateOrderStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: 'Status Order Diperbarui',
      description: `Status order berhasil diubah ke ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Order Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label>Filter Status:</Label>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{order.orderNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status === 'pending' ? 'Pending' :
                         order.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                      </span>
                      {order.orderType && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {order.orderType}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Staff: {order.staffName}</div>
                      {order.tableNumber && <div>Meja: {order.tableNumber}</div>}
                      {order.customer && <div>Pelanggan: {order.customer}</div>}
                      <div>Waktu: {order.createdAt.toLocaleString('id-ID')}</div>
                      <div>Total Item: {order.totalItems}</div>
                      {order.notes && (
                        <div className="text-blue-600 font-medium">Catatan: {order.notes}</div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <div className="text-sm font-medium">Items:</div>
                      <div className="text-sm text-gray-600">
                        {order.items.map((item, index) => (
                          <div key={item.id} className="mt-1">
                            <span>{item.stockName} ({item.quantity})</span>
                            {item.notes && (
                              <span className="text-blue-600 ml-2">- {item.notes}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {order.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                          className="w-full sm:w-auto"
                        >
                          Selesai
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          className="w-full sm:w-auto"
                        >
                          Batal
                        </Button>
                      </>
                    )}
                    <ReceiptPreview order={order} />
                  </div>
                </div>
              </div>
            ))}
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {statusFilter !== 'all' 
                  ? `Tidak ada order dengan status ${statusFilter}`
                  : 'Belum ada order'
                }
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
