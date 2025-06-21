import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StockItem, Order, OrderItem, AppSettings, Table } from '@/types';

interface BluetoothPrinter {
  id: string;
  name: string;
  device: BluetoothDevice;
  characteristic: BluetoothRemoteGATTCharacteristic;
}

interface AppContextType {
  // Stock Management
  stocks: StockItem[];
  addStock: (stock: Omit<StockItem, 'id' | 'lastUpdated'>) => void;
  bulkImportStocks: (stocksData: Omit<StockItem, 'id' | 'lastUpdated'>[]) => void;
  updateStock: (id: string, updates: Partial<StockItem>) => void;
  deleteStock: (id: string) => void;
  updateStockQuantity: (id: string, quantity: number) => void;
  
  // Order Management  
  orders: Order[];
  addOrder: (items: OrderItem[], customer?: string, tableNumber?: string, staffName?: string, orderNotes?: string, orderType?: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Table Management
  tables: Table[];
  updateTableStatus: (tableId: string, status: Table['status']) => void;
  assignOrderToTable: (tableId: string, orderId: string) => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // Staff Management
  staffList: string[];
  addStaff: (name: string) => void;
  removeStaff: (name: string) => void;
  
  // Multiple Bluetooth Printers
  bluetoothDevices: BluetoothPrinter[];
  activePrinters: BluetoothPrinter[];
  connectBluetoothPrinter: () => Promise<boolean>;
  disconnectPrinter: (printerId: string) => void;
  printReceipt: (order: Order, printerId?: string) => Promise<boolean>;
  
  // Legacy support
  bluetoothDevice: BluetoothDevice | null;
  bluetoothCharacteristic: BluetoothRemoteGATTCharacteristic | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  restaurantName: 'Restoran Saya',
  address: 'Jl. Contoh No. 123, Jakarta',
  phone: '021-12345678',
  currency: 'Rp',
  receiptFooter: 'Terima kasih atas kunjungan Anda!',
  bluetoothPrinter: '',
  autoBackup: true,
  theme: 'light',
  defaultStaffName: 'Staff',
  paperSize: '80mm',
  numberOfTables: 10,
  orderTypes: ['Dine In', 'Take Away', 'Delivery'],
  enableCheckboxReceipt: false,
  enablePackageMenu: true,
  packageCategories: ['Paket Hemat', 'Paket Spesial', 'Menu Tanpa Nasi']
};

const defaultStaffs = ['Staff 1', 'Staff 2', 'Manager'];

const defaultStocks: StockItem[] = [
  {
    id: '1',
    name: 'Nasi Putih',
    category: 'Makanan Pokok',
    currentStock: 50,
    minStock: 10,
    unit: 'porsi',
    lastUpdated: new Date(),
    cost: 5000
  },
  {
    id: '2', 
    name: 'Ayam Goreng',
    category: 'Protein',
    currentStock: 25,
    minStock: 5,
    unit: 'potong',
    lastUpdated: new Date(),
    cost: 15000
  },
  {
    id: '3',
    name: 'Sayur Sop',
    category: 'Sayuran',
    currentStock: 30,
    minStock: 8,
    unit: 'porsi',
    lastUpdated: new Date(),
    cost: 8000
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [stocks, setStocks] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('foodapp-stocks');
    return saved ? JSON.parse(saved) : defaultStocks;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('foodapp-orders');
    return saved ? JSON.parse(saved).map((o: any) => ({
      ...o,
      createdAt: new Date(o.createdAt)
    })) : [];
  });
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('foodapp-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [staffList, setStaffList] = useState<string[]>(() => {
    const saved = localStorage.getItem('foodapp-staffs');
    return saved ? JSON.parse(saved) : defaultStaffs;
  });

  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('foodapp-tables');
    if (saved) {
      return JSON.parse(saved);
    }
    // Generate default tables based on settings
    const numberOfTables = settings.numberOfTables || 10;
    return Array.from({ length: numberOfTables }, (_, i) => ({
      id: (i + 1).toString(),
      number: `Meja ${i + 1}`,
      status: 'available' as const,
      capacity: 4
    }));
  });

  const [bluetoothDevices, setBluetoothDevices] = useState<BluetoothPrinter[]>([]);
  const [activePrinters, setActivePrinters] = useState<BluetoothPrinter[]>([]);

  // Legacy support
  const bluetoothDevice = activePrinters.length > 0 ? activePrinters[0].device : null;
  const bluetoothCharacteristic = activePrinters.length > 0 ? activePrinters[0].characteristic : null;

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('foodapp-stocks', JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem('foodapp-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('foodapp-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('foodapp-staffs', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('foodapp-tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    const currentTableCount = tables.length;
    const newTableCount = settings.numberOfTables;
    
    if (newTableCount !== currentTableCount) {
      if (newTableCount > currentTableCount) {
        // Add new tables
        const newTables = Array.from({ length: newTableCount - currentTableCount }, (_, i) => ({
          id: (currentTableCount + i + 1).toString(),
          number: `Meja ${currentTableCount + i + 1}`,
          status: 'available' as const,
          capacity: 4
        }));
        setTables(prev => [...prev, ...newTables]);
      } else {
        // Remove excess tables (only if they're available)
        setTables(prev => prev.slice(0, newTableCount));
      }
    }
  }, [settings.numberOfTables, tables.length]);

  const generateESCPOSCommands = (order: Order): string => {
    const paperWidth = settings.paperSize === '58mm' ? 32 : 48;
    let receipt = '';
    
    // Initialize printer with better settings for long receipts
    receipt += '\x1B\x40'; // Initialize
    receipt += '\x1B\x21\x00'; // Normal font
    
    // Header - Center align
    receipt += '\x1B\x61\x01';
    const restaurantName = settings.restaurantName;
    if (restaurantName.length > paperWidth) {
      // Split long restaurant name
      const lines = restaurantName.match(new RegExp(`.{1,${paperWidth}}`, 'g')) || [restaurantName];
      lines.forEach(line => receipt += line.trim() + '\n');
    } else {
      receipt += restaurantName + '\n';
    }
    
    const address = settings.address;
    if (address.length > paperWidth) {
      const lines = address.match(new RegExp(`.{1,${paperWidth}}`, 'g')) || [address];
      lines.forEach(line => receipt += line.trim() + '\n');
    } else {
      receipt += address + '\n';
    }
    
    receipt += `Tel: ${settings.phone}\n`;
    receipt += '='.repeat(paperWidth) + '\n';
    
    // Order details - Left align
    receipt += '\x1B\x61\x00';
    receipt += `Order: ${order.orderNumber}\n`;
    receipt += `Staff: ${order.staffName || 'N/A'}\n`;
    if (order.tableNumber) receipt += `Meja: ${order.tableNumber}\n`;
    if (order.customer) {
      const customerName = order.customer;
      if (customerName.length > paperWidth) {
        const lines = customerName.match(new RegExp(`.{1,${paperWidth}}`, 'g')) || [customerName];
        lines.forEach(line => receipt += `Pelanggan: ${line.trim()}\n`);
      } else {
        receipt += `Pelanggan: ${customerName}\n`;
      }
    }
    receipt += `Waktu: ${order.createdAt.toLocaleString('id-ID')}\n`;
    
    if (order.notes) {
      receipt += '-'.repeat(paperWidth) + '\n';
      receipt += 'CATATAN PESANAN:\n';
      if (order.notes.length > paperWidth) {
        const lines = order.notes.match(new RegExp(`.{1,${paperWidth}}`, 'g')) || [order.notes];
        lines.forEach(line => receipt += `${line.trim()}\n`);
      } else {
        receipt += `${order.notes}\n`;
      }
    }
    
    receipt += '='.repeat(paperWidth) + '\n';
    
    // Items with better handling for long names and notes
    order.items.forEach((item, index) => {
      const itemName = item.stockName;
      if (itemName.length > paperWidth) {
        // Split long item names across multiple lines
        const lines = itemName.match(new RegExp(`.{1,${paperWidth}}`, 'g')) || [itemName];
        lines.forEach((line, lineIndex) => {
          if (lineIndex === 0) {
            receipt += `${line.trim()}\n`;
          } else {
            receipt += `  ${line.trim()}\n`;
          }
        });
      } else {
        receipt += `${itemName}\n`;
      }
      receipt += `${item.quantity} ${item.unit}\n`;
      
      if (item.notes) {
        receipt += `Catatan: ${item.notes}\n`;
      }
      
      if (index < order.items.length - 1) {
        receipt += '-'.repeat(Math.min(paperWidth, 20)) + '\n';
      }
    });
    
    // Footer
    receipt += '='.repeat(paperWidth) + '\n';
    receipt += `Total Item: ${order.totalItems}\n`;
    receipt += '\x1B\x61\x01'; // Center align
    
    const footer = settings.receiptFooter;
    if (footer.length > paperWidth) {
      const lines = footer.match(new RegExp(`.{1,${paperWidth}}`, 'g')) || [footer];
      lines.forEach(line => receipt += line.trim() + '\n');
    } else {
      receipt += footer + '\n';
    }
    
    receipt += '\x1B\x64\x04'; // Feed 4 lines (more space)
    receipt += '\x1D\x56\x41'; // Cut paper
    
    return receipt;
  };

  const connectBluetoothPrinter = async (): Promise<boolean> => {
    try {
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth tidak didukung');
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['000018f0-0000-1000-8000-00805f9b34fb'] },
          { namePrefix: 'POS' },
          { namePrefix: 'Printer' },
          { namePrefix: 'TP' },
          { namePrefix: 'RPP' },
          { namePrefix: 'BT' }
        ],
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb',
          '49535343-fe7d-4ae5-8fa9-9fafd205e455'
        ]
      });

      const server = await device.gatt?.connect();
      let service;
      let characteristic;

      try {
        service = await server?.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
        characteristic = await service?.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
      } catch (error) {
        service = await server?.getPrimaryService('49535343-fe7d-4ae5-8fa9-9fafd205e455');
        characteristic = await service?.getCharacteristic('49535343-1e4d-4bd9-ba61-23c647249616');
      }

      if (characteristic && device.name) {
        const printerId = `${device.name}-${Date.now()}`;
        const newPrinter: BluetoothPrinter = {
          id: printerId,
          name: device.name,
          device,
          characteristic
        };

        // Check if device already exists
        const existingPrinter = activePrinters.find(p => p.device.id === device.id);
        if (!existingPrinter) {
          setBluetoothDevices(prev => [...prev, newPrinter]);
          setActivePrinters(prev => [...prev, newPrinter]);
          
          updateSettings({ bluetoothPrinter: device.name });
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Bluetooth connection error:', error);
      return false;
    }
  };

  const disconnectPrinter = (printerId: string) => {
    setActivePrinters(prev => prev.filter(p => p.id !== printerId));
    setBluetoothDevices(prev => prev.filter(p => p.id !== printerId));
  };

  const printReceipt = async (order: Order, printerId?: string): Promise<boolean> => {
    try {
      let targetPrinter: BluetoothPrinter | undefined;

      if (printerId) {
        targetPrinter = activePrinters.find(p => p.id === printerId);
      } else if (activePrinters.length > 0) {
        targetPrinter = activePrinters[0];
      }

      if (!targetPrinter) {
        const connected = await connectBluetoothPrinter();
        if (!connected || activePrinters.length === 0) return false;
        targetPrinter = activePrinters[0];
      }

      const escpos = generateESCPOSCommands(order);
      const encoder = new TextEncoder();
      const data = encoder.encode(escpos);

      await targetPrinter.characteristic.writeValue(data);
      return true;
    } catch (error) {
      console.error('Print error:', error);
      
      // Try to reconnect once
      try {
        const reconnected = await connectBluetoothPrinter();
        if (reconnected && activePrinters.length > 0) {
          const escpos = generateESCPOSCommands(order);
          const encoder = new TextEncoder();
          const data = encoder.encode(escpos);
          await activePrinters[0].characteristic.writeValue(data);
          return true;
        }
      } catch (retryError) {
        console.error('Retry print error:', retryError);
      }
      return false;
    }
  };

  const addStock = (stockData: Omit<StockItem, 'id' | 'lastUpdated'>) => {
    const newStock: StockItem = {
      ...stockData,
      id: Date.now().toString(),
      lastUpdated: new Date()
    };
    setStocks(prev => [...prev, newStock]);
  };

  const bulkImportStocks = (stocksData: Omit<StockItem, 'id' | 'lastUpdated'>[]) => {
    const newStocks = stocksData.map(stockData => ({
      ...stockData,
      id: Date.now().toString() + Math.random().toString(),
      lastUpdated: new Date()
    }));
    setStocks(prev => [...prev, ...newStocks]);
  };

  const updateStock = (id: string, updates: Partial<StockItem>) => {
    setStocks(prev => prev.map(stock => 
      stock.id === id 
        ? { ...stock, ...updates, lastUpdated: new Date() }
        : stock
    ));
  };

  const deleteStock = (id: string) => {
    setStocks(prev => prev.filter(stock => stock.id !== id));
  };

  const updateStockQuantity = (id: string, quantity: number) => {
    setStocks(prev => prev.map(stock =>
      stock.id === id
        ? { ...stock, currentStock: quantity, lastUpdated: new Date() }
        : stock
    ));
  };

  const addStaff = (name: string) => {
    if (name.trim() && !staffList.includes(name.trim())) {
      setStaffList(prev => [...prev, name.trim()]);
    }
  };

  const removeStaff = (name: string) => {
    setStaffList(prev => prev.filter(staff => staff !== name));
  };

  const updateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(table =>
      table.id === tableId ? { ...table, status } : table
    ));
  };

  const assignOrderToTable = (tableId: string, orderId: string) => {
    setTables(prev => prev.map(table =>
      table.id === tableId 
        ? { ...table, currentOrder: orderId, status: 'occupied' }
        : table
    ));
  };

  const addOrder = async (items: OrderItem[], customer?: string, tableNumber?: string, staffName?: string, orderNotes?: string, orderType?: string) => {
    const orderNumber = `ORD-${Date.now()}`;
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber,
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: new Date(),
      status: 'pending',
      customer,
      tableNumber,
      staffName: staffName || settings.defaultStaffName,
      notes: orderNotes,
      orderType
    };
    
    setOrders(prev => [newOrder, ...prev]);
    
    // Update stock quantities
    items.forEach(item => {
      setStocks(prev => prev.map(stock =>
        stock.id === item.stockId
          ? { ...stock, currentStock: stock.currentStock - item.quantity, lastUpdated: new Date() }
          : stock
      ));
    });

    // Update table status if tableNumber is provided
    if (tableNumber) {
      const tableToUpdate = tables.find(table => table.number === tableNumber);
      if (tableToUpdate) {
        assignOrderToTable(tableToUpdate.id, newOrder.id);
      }
    }

    // Auto print if enabled and printer connected
    if (settings.autoBackup && activePrinters.length > 0) {
      try {
        await printReceipt(newOrder);
      } catch (error) {
        console.error('Auto print failed:', error);
      }
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status }
        : order
    ));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const value: AppContextType = {
    stocks,
    addStock,
    bulkImportStocks,
    updateStock,
    deleteStock,
    updateStockQuantity,
    orders,
    addOrder,
    updateOrderStatus,
    tables,
    updateTableStatus,
    assignOrderToTable,
    settings,
    updateSettings,
    staffList,
    addStaff,
    removeStaff,
    bluetoothDevices,
    activePrinters,
    connectBluetoothPrinter,
    disconnectPrinter,
    printReceipt,
    bluetoothDevice,
    bluetoothCharacteristic
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
