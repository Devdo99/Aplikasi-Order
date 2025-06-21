
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { ShoppingCart, Package, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { stocks, orders } = useApp();

  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    return order.createdAt.toDateString() === today;
  });

  const lowStockItems = stocks.filter(stock => stock.currentStock <= stock.minStock);

  const stats = [
    {
      title: 'Pesanan Hari Ini',
      value: todayOrders.length,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/orders'
    },
    {
      title: 'Total Item Stok',
      value: stocks.length,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/stock'
    },
    {
      title: 'Stok Menipis',
      value: lowStockItems.length,
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      link: '/stock'
    },
    {
      title: 'Total Pesanan',
      value: orders.length,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/reports'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Selamat Datang di Food Manager!</h1>
        <p className="text-orange-100">Kelola pesanan dan stok makanan dengan mudah dan efisien</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link} className="block">
            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              Pesanan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {order.totalItems} item • {order.createdAt.toLocaleTimeString('id-ID')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status === 'completed' ? 'Selesai' :
                       order.status === 'pending' ? 'Menunggu' : 'Dibatalkan'}
                    </span>
                  </div>
                ))}
                <Link 
                  to="/orders" 
                  className="block text-center text-orange-600 hover:text-orange-700 font-medium"
                >
                  Lihat Semua Pesanan →
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Belum ada pesanan</p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-500" />
              Peringatan Stok
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockItems.length > 0 ? (
              <div className="space-y-3">
                {lowStockItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-red-800">{item.name}</p>
                      <p className="text-sm text-red-600">
                        Sisa: {item.currentStock} {item.unit}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      Stok Menipis
                    </span>
                  </div>
                ))}
                <Link 
                  to="/stock" 
                  className="block text-center text-red-600 hover:text-red-700 font-medium"
                >
                  Kelola Stok →
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-green-600 font-medium">Semua stok aman!</p>
                <p className="text-gray-500 text-sm">Tidak ada item dengan stok menipis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
