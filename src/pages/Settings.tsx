import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { Settings as SettingsIcon, Save, Bluetooth, Printer, Plus, Trash2, Users, Wifi, Table, Receipt } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateStockTemplate } from '@/utils/exportUtils';

export default function Settings() {
  const { 
    settings, 
    updateSettings, 
    connectBluetoothPrinter, 
    disconnectPrinter,
    activePrinters,
    bluetoothDevices,
    bluetoothDevice,
    staffList, 
    addStaff, 
    removeStaff 
  } = useApp();
  
  const [formData, setFormData] = useState(settings);
  const [isConnecting, setIsConnecting] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newOrderType, setNewOrderType] = useState('');

  // Ensure orderTypes is always an array
  const currentOrderTypes = formData.orderTypes || ['Dine In', 'Take Away', 'Delivery'];

  const handleSave = () => {
    updateSettings(formData);
    toast({
      title: 'Pengaturan Berhasil Disimpan',
      description: 'Perubahan telah diterapkan',
    });
  };

  const handleReset = () => {
    setFormData(settings);
    toast({
      title: 'Pengaturan Direset',
      description: 'Perubahan dibatalkan',
    });
  };

  const handleBluetoothConnect = async () => {
    setIsConnecting(true);
    try {
      const success = await connectBluetoothPrinter();
      if (success) {
        toast({
          title: 'Koneksi Bluetooth Berhasil',
          description: `Printer baru berhasil ditambahkan`,
        });
      } else {
        toast({
          title: 'Gagal Menghubungkan',
          description: 'Pastikan Bluetooth aktif dan printer dalam mode pairing',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      if (error.message.includes('User cancelled')) {
        toast({
          title: 'Koneksi Dibatalkan',
          description: 'Pemilihan printer dibatalkan',
        });
      } else {
        toast({
          title: 'Gagal Menghubungkan',
          description: 'Pastikan Bluetooth aktif dan printer dalam mode pairing',
          variant: 'destructive'
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectPrinter = (printerId: string) => {
    const printer = activePrinters.find(p => p.id === printerId);
    disconnectPrinter(printerId);
    toast({
      title: 'Printer Terputus',
      description: `${printer?.name} telah diputus koneksinya`,
    });
  };

  const handleAddStaff = () => {
    if (newStaffName.trim()) {
      addStaff(newStaffName);
      setNewStaffName('');
      toast({
        title: 'Staff Ditambahkan',
        description: `${newStaffName} berhasil ditambahkan ke daftar staff`,
      });
    }
  };

  const handleRemoveStaff = (staffName: string) => {
    removeStaff(staffName);
    toast({
      title: 'Staff Dihapus',
      description: `${staffName} dihapus dari daftar staff`,
    });
  };

  const handleDownloadTemplate = () => {
    generateStockTemplate();
    toast({
      title: 'Template Berhasil Diunduh',
      description: 'File template CSV telah disimpan',
    });
  };

  const handleAddOrderType = () => {
    if (newOrderType.trim() && !currentOrderTypes.includes(newOrderType)) {
      setFormData(prev => ({
        ...prev,
        orderTypes: [...currentOrderTypes, newOrderType]
      }));
      setNewOrderType('');
      toast({
        title: 'Jenis Pesanan Ditambahkan',
        description: `${newOrderType} berhasil ditambahkan`,
      });
    }
  };

  const handleRemoveOrderType = (orderType: string) => {
    if (currentOrderTypes.length > 1) {
      setFormData(prev => ({
        ...prev,
        orderTypes: currentOrderTypes.filter(type => type !== orderType)
      }));
      toast({
        title: 'Jenis Pesanan Dihapus',
        description: `${orderType} dihapus dari daftar`,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          Pengaturan Aplikasi
        </h1>
        <p className="text-gray-600">Konfigurasi sistem dan preferensi aplikasi</p>
      </div>

      {/* Restaurant Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Restoran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="restaurantName">Nama Restoran</Label>
            <Input
              id="restaurantName"
              value={formData.restaurantName}
              onChange={(e) => setFormData(prev => ({ ...prev, restaurantName: e.target.value }))}
              placeholder="Masukkan nama restoran"
            />
          </div>
          
          <div>
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Masukkan alamat lengkap restoran"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Contoh: 021-12345678"
            />
          </div>

          <div>
            <Label htmlFor="defaultStaffName">Staff Default</Label>
            <Select 
              value={formData.defaultStaffName} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, defaultStaffName: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih staff default" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map(staff => (
                  <SelectItem key={staff} value={staff}>
                    {staff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="numberOfTables">Jumlah Meja</Label>
            <Input
              id="numberOfTables"
              type="number"
              min="1"
              max="100"
              value={formData.numberOfTables}
              onChange={(e) => setFormData(prev => ({ ...prev, numberOfTables: parseInt(e.target.value) || 1 }))}
              placeholder="Masukkan jumlah meja"
            />
            <p className="text-sm text-gray-500 mt-1">
              Pengaturan ini akan mengatur berapa banyak meja yang tersedia di sistem
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Order Types Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Jenis Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newOrderType}
              onChange={(e) => setNewOrderType(e.target.value)}
              placeholder="Jenis pesanan baru (contoh: Delivery)"
              onKeyPress={(e) => e.key === 'Enter' && handleAddOrderType()}
            />
            <Button onClick={handleAddOrderType} disabled={!newOrderType.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah
            </Button>
          </div>
          
          <div className="space-y-2">
            {currentOrderTypes.map(orderType => (
              <div key={orderType} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{orderType}</span>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleRemoveOrderType(orderType)}
                  disabled={currentOrderTypes.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Multiple Bluetooth Printers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Multiple Bluetooth Printers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connected Printers List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Printer Terhubung ({activePrinters.length})</Label>
              <Button onClick={handleBluetoothConnect} disabled={isConnecting} size="sm">
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Menghubungkan...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Printer
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {activePrinters.length === 0 ? (
                <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <Bluetooth className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Tidak ada printer terhubung</p>
                </div>
              ) : (
                activePrinters.map(printer => (
                  <div key={printer.id} className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{printer.name}</span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Aktif</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDisconnectPrinter(printer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Print Settings */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Pengaturan Cetak</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label>Auto Print Setelah Order</Label>
                  <p className="text-sm text-gray-500">Cetak otomatis setelah menyimpan pesanan</p>
                </div>
                <Switch
                  checked={formData.autoBackup}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoBackup: checked }))}
                />
              </div>
              
              <div className="p-3 border rounded-lg">
                <Label className="text-sm">Ukuran Kertas Thermal</Label>
                <Select 
                  value={formData.paperSize || '80mm'} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paperSize: value as '58mm' | '80mm' }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58mm">58mm (Mini Portable)</SelectItem>
                    <SelectItem value="80mm">80mm (Standard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-3 border rounded-lg">
                <Label className="text-sm">Jumlah Copy Per Print</Label>
                <Select 
                  value={formData.printCopies?.toString() || '1'} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, printCopies: parseInt(value) }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Copy</SelectItem>
                    <SelectItem value="2">2 Copy</SelectItem>
                    <SelectItem value="3">3 Copy</SelectItem>
                    <SelectItem value="4">4 Copy</SelectItem>
                    <SelectItem value="5">5 Copy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manajemen Staff
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              placeholder="Nama staff baru"
              onKeyPress={(e) => e.key === 'Enter' && handleAddStaff()}
            />
            <Button onClick={handleAddStaff} disabled={!newStaffName.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah
            </Button>
          </div>
          
          <div className="space-y-2">
            {staffList.map(staff => (
              <div key={staff} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{staff}</span>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleRemoveStaff(staff)}
                  disabled={staffList.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Import Template */}
      <Card>
        <CardHeader>
          <CardTitle>Template Import Stok</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Unduh template CSV untuk import stok dalam jumlah besar
            </p>
            <Button onClick={handleDownloadTemplate} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Unduh Template CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Struk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currency">Mata Uang</Label>
            <Input
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              placeholder="Contoh: Rp"
            />
          </div>
          
          <div>
            <Label htmlFor="receiptFooter">Footer Struk</Label>
            <Textarea
              id="receiptFooter"
              value={formData.receiptFooter}
              onChange={(e) => setFormData(prev => ({ ...prev, receiptFooter: e.target.value }))}
              placeholder="Pesan yang akan ditampilkan di bagian bawah struk"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label>Checkbox di Struk</Label>
              <p className="text-sm text-gray-500">Tampilkan kotak centang untuk setiap item di struk</p>
            </div>
            <Switch
              checked={formData.enableCheckboxReceipt}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableCheckboxReceipt: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legacy Bluetooth Printer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Pengaturan Printer Thermal Bluetooth (Legacy)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bluetooth className="h-4 w-4 text-blue-600" />
              <Label className="text-base font-medium">Printer Thermal Legacy</Label>
              {bluetoothDevice && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Terhubung: {bluetoothDevice.name}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <Input
                  value={bluetoothDevice?.name || formData.bluetoothPrinter}
                  placeholder="Nama printer thermal Bluetooth"
                  readOnly
                />
              </div>
              <Button 
                onClick={handleBluetoothConnect}
                disabled={isConnecting}
                variant="outline"
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Menghubungkan...
                  </>
                ) : bluetoothDevice ? (
                  <>
                    <Bluetooth className="mr-2 h-4 w-4" />
                    Tersambung
                  </>
                ) : (
                  <>
                    <Bluetooth className="mr-2 h-4 w-4" />
                    Sambungkan
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Tips untuk Chrome Android:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Pastikan Chrome versi terbaru untuk dukungan Web Bluetooth</li>
                <li>• Aktifkan flag chrome://flags/#enable-web-bluetooth</li>
                <li>• Berikan permission lokasi untuk scanning Bluetooth</li>
                <li>• Gunakan HTTPS untuk koneksi yang aman</li>
                <li>• Test print pada mode landscape untuk hasil terbaik</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Versi Aplikasi</p>
              <p className="font-medium">2.1.0</p>
            </div>
            <div>
              <p className="text-gray-600">Browser</p>
              <p className="font-medium">{navigator.userAgent.split(' ')[0]}</p>
            </div>
            <div>
              <p className="text-gray-600">Platform</p>
              <p className="font-medium">{navigator.platform}</p>
            </div>
            <div>
              <p className="text-gray-600">Web Bluetooth</p>
              <p className="font-medium">
                {navigator.bluetooth ? 
                  <span className="text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Didukung
                  </span> : 
                  <span className="text-red-600">Tidak Didukung</span>
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSave} className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          Simpan Pengaturan
        </Button>
        <Button variant="outline" onClick={handleReset} className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  );
}
