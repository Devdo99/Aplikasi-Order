
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { Table, Users, Clock, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function TableManagement() {
  const { tables, updateTableStatus, orders } = useApp();
  const [selectedTable, setSelectedTable] = useState<string>('');

  const handleStatusChange = (tableId: string, newStatus: 'available' | 'occupied' | 'reserved') => {
    updateTableStatus(tableId, newStatus);
    toast({
      title: 'Status Meja Diperbarui',
      description: `Status meja berhasil diubah ke ${newStatus}`,
    });
  };

  const getTableOrder = (tableNumber: string) => {
    return orders.find(order => 
      order.tableNumber === tableNumber && order.status === 'pending'
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'occupied':
        return <Users className="h-4 w-4" />;
      case 'reserved':
        return <Clock className="h-4 w-4" />;
      default:
        return <Table className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold">Management Meja</h2>
        <p className="text-gray-600 text-sm lg:text-base">Kelola status dan reservasi meja</p>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tables.map((table) => {
          const tableOrder = getTableOrder(table.number);
          
          return (
            <Card key={table.id} className={`transition-all hover:shadow-md ${getStatusColor(table.status)} border-2`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Table Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(table.status)}
                      <span className="font-semibold text-sm">{table.number}</span>
                    </div>
                    <span className="text-xs font-medium capitalize">
                      {table.status === 'available' ? 'Tersedia' :
                       table.status === 'occupied' ? 'Terisi' : 'Reservasi'}
                    </span>
                  </div>

                  {/* Table Info */}
                  <div className="text-xs text-gray-600">
                    <div>Kapasitas: {table.capacity} orang</div>
                    {tableOrder && (
                      <div className="mt-1">
                        <div>Order: {tableOrder.orderNumber}</div>
                        <div>Items: {tableOrder.totalItems}</div>
                      </div>
                    )}
                  </div>

                  {/* Status Control */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Ubah Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Ubah Status {table.number}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Status Meja</Label>
                          <Select
                            value={table.status}
                            onValueChange={(value: 'available' | 'occupied' | 'reserved') => 
                              handleStatusChange(table.id, value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Tersedia</SelectItem>
                              <SelectItem value="occupied">Terisi</SelectItem>
                              <SelectItem value="reserved">Reservasi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Meja Tersedia</p>
                <p className="text-xl font-bold">{tables.filter(t => t.status === 'available').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Meja Terisi</p>
                <p className="text-xl font-bold">{tables.filter(t => t.status === 'occupied').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reservasi</p>
                <p className="text-xl font-bold">{tables.filter(t => t.status === 'reserved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
