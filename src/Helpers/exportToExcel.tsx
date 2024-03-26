import * as XLSX from 'xlsx';
import convertArrayOfObjectsToArray from "./arrayTwoDimention";

const exportToExcelData = (dataExcel: any[]) => {
    const getCoordinate = () => {
      let coordinateList: any = [];
      dataExcel && dataExcel.forEach((data) => {
        coordinateList.push(data.coordinate);
      });
      return coordinateList;
    }
  
    const listCoordinate = getCoordinate();
    const filteredArray = listCoordinate[0] && listCoordinate[0]?.map((obj: any) => ({
      Nama_lokasi: obj?.name_location,
      Latitude: parseFloat(obj?.lat),
      Longitude: parseFloat(obj?.long),
      Kecamatan: obj?.subdistrict
    }));
  
    if (filteredArray) {
      const newTableData = convertArrayOfObjectsToArray(filteredArray);
  
      const wb = XLSX.utils.book_new();

      // Add data to a new worksheet
      const ws = XLSX.utils.aoa_to_sheet(newTableData);
  
      // Auto-adjust column widths based on content
      const range = XLSX.utils.decode_range(ws['!ref'] as any);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let max_width = 0;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })];
          if (!cell) continue;
          const cell_width = cell.v.toString().length;
          if (cell_width > max_width) max_width = cell_width;
        }
        ws['!cols'] = ws['!cols'] || [];
        ws['!cols'][C] = { width: max_width + 2 }; // Tambahkan margin untuk keamanan
      }
  
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      // Save the workbook
      XLSX.writeFile(wb, 'geospasial.xlsx');
    }
}

export default exportToExcelData;
