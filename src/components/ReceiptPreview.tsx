import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Order } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Eye, Printer, Settings, Copy, Square } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReceiptPreviewProps {
  order: Order;
}

export default function ReceiptPreview({ order }: ReceiptPreviewProps) {
  const { settings, updateSettings, printReceipt, bluetoothDevices, activePrinters } = useApp();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const [printCopies, setPrintCopies] = useState(1);
  const [selectedPrinters, setSelectedPrinters] = useState<string[]>([]);

  const handlePrint = async () => {
    try {
      if (selectedPrinters.length === 0 && activePrinters.length > 0) {
        setSelectedPrinters([activePrinters[0].id]);
      }

      const printersToUse = selectedPrinters.length > 0 ? selectedPrinters : activePrinters.map(p => p.id);
      
      if (printersToUse.length === 0) {
        toast({
          title: 'Tidak Ada Printer',
          description: 'Sambungkan setidaknya satu printer Bluetooth',
          variant: 'destructive'
        });
        return;
      }

      let successCount = 0;
      for (const printerId of printersToUse) {
        for (let i = 0; i < printCopies; i++) {
          const success = await printReceipt(order, printerId);
          if (success) successCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: 'Struk Berhasil Dicetak',
          description: `${successCount} struk berhasil dicetak`,
        });
      } else {
        toast({
          title: 'Gagal Mencetak',
          description: 'Pastikan printer Bluetooth tersambung',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error Printing',
        description: 'Terjadi kesalahan saat mencetak',
        variant: 'destructive'
      });
    }
  };

  const saveSettings = () => {
    updateSettings(tempSettings);
    setIsSettingsOpen(false);
    toast({
      title: 'Pengaturan Struk Disimpan',
      description: 'Pengaturan tampilan struk berhasil diperbarui',
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Preview Button */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle>Preview Struk</DialogTitle>
          </DialogHeader>
          
          {/* Receipt Preview - Scrollable */}
          <div className="flex-1 overflow-y-auto px-1">
            <div className="modern-receipt bg-white border rounded-lg p-4 mx-auto" 
                 style={{ maxWidth: '300px', fontSize: '14px', lineHeight: '1.4' }}>
              <div className="receipt-header text-center border-b pb-3 mb-3">
                <h2 className="text-lg font-bold break-words">{settings.restaurantName}</h2>
                <p className="text-sm opacity-90 break-words">{settings.address}</p>
                <p className="text-sm opacity-90">Tel: {settings.phone}</p>
              </div>
              
              <div className="receipt-content space-y-2">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Order:</span>
                    <span className="font-medium break-all text-xs">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff:</span>
                    <span className="break-words text-xs">{order.staffName}</span>
                  </div>
                  {order.orderType && (
                    <div className="flex justify-between">
                      <span>Jenis:</span>
                      <span className="text-xs">{order.orderType}</span>
                    </div>
                  )}
                  {order.tableNumber && (
                    <div className="flex justify-between">
                      <span>Meja:</span>
                      <span className="text-xs">{order.tableNumber}</span>
                    </div>
                  )}
                  {order.customer && (
                    <div className="flex justify-between">
                      <span>Pelanggan:</span>
                      <span className="break-words text-xs">{order.customer}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Waktu:</span>
                    <span className="text-xs">{order.createdAt.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 my-3"></div>
                
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="flex items-start gap-2">
                        {settings.enableCheckboxReceipt && (
                          <Square className="h-3 w-3 mt-0.5 text-gray-400" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium break-words text-sm">{item.stockName}</div>
                          <div className="text-xs text-gray-600 flex justify-between">
                            <span>{item.quantity} {item.unit}</span>
                          </div>
                          {item.notes && (
                            <div className="text-xs text-blue-600 mt-1 italic">Note: {item.notes}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 my-3"></div>
                
                <div className="text-center">
                  <div className="font-bold">Total Item: {order.totalItems}</div>
                  {order.notes && (
                    <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded border">
                      <strong>Catatan Pesanan:</strong><br/>
                      {order.notes}
                    </div>
                  )}
                  <div className="text-xs text-gray-600 mt-2 break-words">{settings.receiptFooter}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Print Controls - Fixed at bottom */}
          <div className="border-t pt-4 mt-4 space-y-3 bg-white">
            {/* Print Copies Setting */}
            <div className="flex items-center gap-2">
              <Label className="text-sm whitespace-nowrap">Jumlah Salinan:</Label>
              <Select value={printCopies.toString()} onValueChange={(value) => setPrintCopies(parseInt(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Printer Selection */}
            {activePrinters.length > 1 && (
              <div>
                <Label className="text-sm mb-2 block">Pilih Printer:</Label>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {activePrinters.map(printer => (
                    <div key={printer.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={printer.id}
                        checked={selectedPrinters.includes(printer.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPrinters([...selectedPrinters, printer.id]);
                          } else {
                            setSelectedPrinters(selectedPrinters.filter(id => id !== printer.id));
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={printer.id} className="text-sm truncate">
                        {printer.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handlePrint} className="w-full">
              <Printer className="h-4 w-4 mr-2" />
              Print ({printCopies}x)
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Button */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
            <Settings className="h-4 w-4 mr-1" />
            Atur
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pengaturan Struk</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="restaurantName">Nama Restoran</Label>
              <Input
                id="restaurantName"
                value={tempSettings.restaurantName}
                onChange={(e) => setTempSettings(prev => ({ ...prev, restaurantName: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={tempSettings.address}
                onChange={(e) => setTempSettings(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                value={tempSettings.phone}
                onChange={(e) => setTempSettings(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="paperSize">Ukuran Kertas</Label>
              <Select
                value={tempSettings.paperSize}
                onValueChange={(value: '58mm' | '80mm') => setTempSettings(prev => ({ ...prev, paperSize: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="58mm">58mm</SelectItem>
                  <SelectItem value="80mm">80mm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="receiptFooter">Footer Struk</Label>
              <Textarea
                id="receiptFooter"
                value={tempSettings.receiptFooter}
                onChange={(e) => setTempSettings(prev => ({ ...prev, receiptFooter: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Batal
            </Button>
            <Button onClick={saveSettings}>
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
