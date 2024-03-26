const convertArrayOfObjectsToArray = (tableData: any) => {
    // Ambil kunci atau nama kolom dari objek pertama untuk header tabel
    const headers = Object.keys(tableData[0]);
  
    // Ubah setiap objek menjadi array nilai
    const rows = tableData.map((obj: any) => Object.values(obj));
  
    // Gabungkan header dengan array nilai
    const result = [headers, ...rows];
  
    return result;
  }
  
export default convertArrayOfObjectsToArray