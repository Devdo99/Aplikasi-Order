
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateStockTemplate } from '@/utils/exportUtils';
import { StockItem } from '@/types';

export default function BulkStockImport() {
  const { bulkImportStocks } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [csvData, setCsvData] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvData(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: 'Format File Salah',
        description: 'Silakan pilih file CSV',
        variant: 'destructive',
      });
    }
  };

  const parseCSV = (csvText: string): Omit<StockItem, 'id' | 'lastUpdated'>[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const item: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        switch (header.toLowerCase()) {
          case 'name':
            item.name = value;
            break;
          case 'category':
            item.category = value;
            break;
          case 'currentstock':
            item.currentStock = parseInt(value) || 0;
            break;
          case 'minstock':
            item.minStock = parseInt(value) || 0;
            break;
          case 'unit':
            item.unit = value;
            break;
          case 'cost':
            item.cost = parseFloat(value) || 0;
            break;
        }
      });
      
      return item;
    }).filter(item => item.name && item.category);
  };

  const handleImport = () => {
    try {
      if (!csvData.trim()) {
        toast({
          title: 'Data CSV Kosong',
          description: 'Silakan upload file CSV terlebih dahulu',
          variant: 'destructive',
        });
        return;
      }

      const stocksData = parseCSV(csvData);
      
      if (stocksData.length === 0) {
        toast({
          title: 'Data Tidak Valid',
          description: 'Pastikan format CSV sesuai template',
          variant: 'destructive',
        });
        return;
      }

      bulkImportStocks(stocksData);
      
      toast({
        title: 'Import Berhasil',
        description: `${stocksData.length} item stok berhasil ditambahkan`,
      });
      
      setIsOpen(false);
      setCsvData('');
    } catch (error) {
      toast({
        title: 'Import Gagal',
        description: 'Terjadi kesalahan saat memproses file CSV',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadTemplate = () => {
    generateStockTemplate();
    toast({
      title: 'Template Berhasil Diunduh',
      description: 'File template CSV telah disimpan',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import Bulk
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Stok Massal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Langkah Import:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Unduh template CSV</li>
              <li>2. Isi data stok sesuai format</li>
              <li>3. Upload file CSV yang sudah diisi</li>
              <li>4. Klik tombol Import</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Button onClick={handleDownloadTemplate} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Unduh Template CSV
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csvFile">Upload File CSV</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </div>

          {csvData && (
            <div className="bg-gray-50 p-3 rounded">
              <Label className="text-sm font-medium">Preview Data:</Label>
              <pre className="text-xs mt-1 max-h-32 overflow-y-auto">
                {csvData.split('\n').slice(0, 5).join('\n')}
                {csvData.split('\n').length > 5 && '\n...'}
              </pre>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleImport} disabled={!csvData} className="flex-1">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Import Data
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
