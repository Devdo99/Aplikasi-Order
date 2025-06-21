
export interface StockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  lastUpdated: Date;
  cost?: number;
  isPackage?: boolean;
  withoutRice?: boolean;
}

export interface OrderItem {
  id: string;
  stockId: string;
  stockName: string;
  quantity: number;
  unit: string;
  notes?: string;
  orderType?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalItems: number;
  createdAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
  customer?: string;
  tableNumber?: string;
  staffName?: string;
  notes?: string;
  orderType?: string;
}

export interface ReportData {
  date: string;
  totalOrders: number;
  totalItems: number;
  popularItems: { name: string; quantity: number }[];
}

export interface Table {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved';
  capacity: number;
  currentOrder?: string;
}

export interface AppSettings {
  restaurantName: string;
  address: string;
  phone: string;
  currency: string;
  receiptFooter: string;
  bluetoothPrinter: string;
  autoBackup: boolean;
  theme: 'light' | 'dark';
  defaultStaffName: string;
  paperSize?: '58mm' | '80mm';
  printCopies?: number;
  numberOfTables: number;
  orderTypes: string[];
  enableCheckboxReceipt: boolean;
  enablePackageMenu: boolean;
  packageCategories: string[];
}
