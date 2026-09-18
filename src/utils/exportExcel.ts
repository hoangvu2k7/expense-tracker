import * as XLSX from 'xlsx';
import { Transaction, Category, Wallet } from '../types';
import { formatDate } from './formatters';

interface ExportOptions {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
  type: 'xlsx' | 'csv';
}

export function exportTransactionsReport({
  transactions,
  categories,
  wallets,
  type
}: ExportOptions) {
  const getCatName = (catId?: string) => {
    if (!catId) return 'Chuyển tiền nội bộ';
    return categories.find((c) => c.id === catId)?.name || 'Chưa phân loại';
  };

  const getWalletName = (wId: string) => {
    return wallets.find((w) => w.id === wId)?.name || wId;
  };

  const getTypeName = (tType: string) => {
    switch (tType) {
      case 'expense':
        return 'Chi tiêu (-)';
      case 'income':
        return 'Thu nhập (+)';
      case 'transfer':
        return 'Chuyển khoản';
      default:
        return tType;
    }
  };

  // Build rows data
  const rows = transactions.map((t, idx) => ({
    'STT': idx + 1,
    'Ngày giao dịch': formatDate(t.date),
    'Loại giao dịch': getTypeName(t.type),
    'Danh mục': getCatName(t.categoryId),
    'Số tiền (VNĐ)': t.amount,
    'Ví nguồn': getWalletName(t.walletId),
    'Ví nhận': t.toWalletId ? getWalletName(t.toWalletId) : '-',
    'Ghi chú': t.note || ''
  }));

  const nowStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  if (type === 'xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 6 },  // STT
      { wch: 15 }, // Ngày giao dịch
      { wch: 16 }, // Loại giao dịch
      { wch: 22 }, // Danh mục
      { wch: 18 }, // Số tiền
      { wch: 22 }, // Ví nguồn
      { wch: 22 }, // Ví nhận
      { wch: 35 }  // Ghi chú
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lịch Sử Giao Dịch');

    XLSX.writeFile(workbook, `Bao_Cao_Chi_Tieu_${nowStr}.xlsx`);
  } else {
    // CSV with UTF-8 BOM
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao_Cao_Chi_Tieu_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
