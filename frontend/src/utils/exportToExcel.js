import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename) => {
  // Crear hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Crear libro de trabajo
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  
  // Descargar archivo
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToCSV = (data, filename) => {
  // Crear hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Convertir a CSV
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  // Crear blob y descargar
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};