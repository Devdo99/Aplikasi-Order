
import { Order } from '@/types';

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle dates and objects
        if (value instanceof Date) {
          return `"${value.toLocaleString('id-ID')}"`;
        }
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value)}"`;
        }
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value || '');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToExcel = (data: any[], filename: string) => {
  // Simple Excel-compatible format using HTML table
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const htmlContent = `
    <table>
      <thead>
        <tr>
          ${headers.map(header => `<th>${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(row => 
          `<tr>
            ${headers.map(header => {
              const value = row[header];
              if (value instanceof Date) {
                return `<td>${value.toLocaleString('id-ID')}</td>`;
              }
              if (typeof value === 'object' && value !== null) {
                return `<td>${JSON.stringify(value)}</td>`;
              }
              return `<td>${value || ''}</td>`;
            }).join('')}
          </tr>`
        ).join('')}
      </tbody>
    </table>
  `;

  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  link.click();
  URL.revokeObjectURL(url);
};

export const generateStockTemplate = () => {
  const templateData = [
    {
      name: 'Contoh Nasi Putih',
      category: 'Makanan Pokok',
      currentStock: 50,
      minStock: 10,
      unit: 'porsi',
      cost: 5000
    },
    {
      name: 'Contoh Ayam Goreng',
      category: 'Protein',
      currentStock: 25,
      minStock: 5,
      unit: 'potong',
      cost: 15000
    }
  ];

  exportToCSV(templateData, 'template_import_stok');
};
