import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { StockItem } from '@/types';
import { Plus, Package, Settings, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import BulkStockImport from '@/components/BulkStockImport';

export default function Stock() {
  const { stocks, addStock, updateStock, deleteStock, updateStockQuantity } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(stocks.map(s => s.category)))];

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || stock.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    currentStock: 0,
    minStock: 0,
    unit: '',
    cost: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      currentStock: 0,
      minStock: 0,
      unit: '',
      cost: 0
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.unit) {
      toast({
        title: 'Data Tidak Lengkap',
        description: 'Mohon lengkapi semua field yang wajib diisi',
        variant: 'destructive'
      });
      return;
    }

    if (editingStock) {
      updateStock(editingStock.id, formData);
      toast({
        title: 'Stok Berhasil Diperbarui',
        description: `${formData.name} telah diperbarui`,
      });
      setEditingStock(null);
    } else {
      addStock(formData);
      toast({
        title: 'Stok Berhasil Ditambahkan',
        description: `${formData.name} telah ditambahkan ke stok`,
      });
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (stock: StockItem) => {
    setFormData({
      name: stock.name,
      category: stock.category,
      currentStock: stock.currentStock,
      minStock: stock.minStock,
      unit: stock.unit,
      cost: stock.cost || 0
    });
    setEditingStock(stock);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      deleteStock(id);
      toast({
        title: 'Stok Berhasil Dihapus',
        description: 'Item telah dihapus dari stok',
      });
    }
  };

  const handleStockUpdate = (id: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) return;
    
    updateStockQuantity(id, quantity);
    toast({
      title: 'Stok Berhasil Diperbarui',
      description: 'Jumlah stok telah diperbarui',
    });
  };

  const lowStockCount = stocks.filter(s => s.currentStock <= s.minStock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Management Stok</h1>
          <p className="text-gray-600">Kelola inventori makanan dan bahan</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <BulkStockImport />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingStock(null); resetForm(); }} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Stok
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingStock ? 'Edit Stok' : 'Tambah Stok Baru'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Item *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Nasi Putih"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Kategori *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Contoh: Makanan Pokok"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentStock">Stok Saat Ini</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={formData.currentStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minStock">Stok Minimum</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unit">Satuan *</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="porsi, kg, liter"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">Harga Modal (Rp)</Label>
                    <Input
                      id="cost"
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSubmit} className="flex-1">
                    {editingStock ? 'Perbarui' : 'Tambah'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setIsAddDialogOpen(false); resetForm(); setEditingStock(null); }}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Item</p>
                <p className="text-2xl font-bold">{stocks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Settings className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Stok Menipis</p>
                <p className="text-2xl font-bold">{lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kategori</p>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari nama item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.slice(1).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Stok</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Nama Item</th>
                  <th className="text-left p-3">Kategori</th>
                  <th className="text-left p-3">Stok Saat Ini</th>
                  <th className="text-left p-3">Min Stok</th>
                  <th className="text-left p-3">Satuan</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => (
                  <tr key={stock.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{stock.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {stock.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={stock.currentStock}
                        onChange={(e) => handleStockUpdate(stock.id, e.target.value)}
                        className="w-20"
                      />
                    </td>
                    <td className="p-3">{stock.minStock}</td>
                    <td className="p-3">{stock.unit}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stock.currentStock <= stock.minStock 
                          ? 'bg-red-100 text-red-800' 
                          : stock.currentStock <= stock.minStock * 2
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {stock.currentStock <= stock.minStock 
                          ? 'Menipis' 
                          : stock.currentStock <= stock.minStock * 2
                          ? 'Perhatian'
                          : 'Aman'
                        }
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(stock)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(stock.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Tidak ada item yang sesuai dengan filter'
                : 'Belum ada data stok'
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
