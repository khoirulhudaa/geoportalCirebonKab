import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useState } from 'react';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import convertArrayOfObjectsToArray from '../Helpers/arrayTwoDimention';
import { popUpProps } from '../Models/componentInterface';

const Subdistrict: React.FC<popUpProps> = ({
    dataSubdistrict,
}) => {

  const [searchSubdistrict, setSearchSubdistrict] = useState<string>('')

  const exportToExcel = () => {
    
    dataSubdistrict.sort((a: any, b: any) => {
        const kecamatanA = a.name_subdistrict.toUpperCase(); // Konversi kecamatam menjadi huruf besar untuk memastikan urutan yang konsisten
        const kecamatanB = b.name_subdistrict.toUpperCase();
      
        if (kecamatanA < kecamatanB) {
          return -1;
        }
        if (kecamatanA > kecamatanB) {
          return 1;
        }
      
        // Jika kedua kecamatan sama, tidak perlu melakukan perubahan pada urutan
        return 0;
    });

    const filteredArray = dataSubdistrict && dataSubdistrict?.map((obj: any, index: number) => ({
        No: (index + 1).toString(),
        Kecamatan: obj?.name_subdistrict,
        Latitude: obj?.lat,
        Longitude: obj?.long,
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
      XLSX.writeFile(wb, 'data-kecamatan.xlsx');
    };
  }

  const exportToPDF = () => {
    const doc = new jsPDF() as any;
    dataSubdistrict.sort((a: any, b: any) => {
        const kecamatanA = a.name_subdistrict.toUpperCase(); // Konversi kecamatam menjadi huruf besar untuk memastikan urutan yang konsisten
        const kecamatanB = b.name_subdistrict.toUpperCase();
      
        if (kecamatanA < kecamatanB) {
          return -1;
        }
        if (kecamatanA > kecamatanB) {
          return 1;
        }
      
        // Jika kedua kecamatan sama, tidak perlu melakukan perubahan pada urutan
        return 0;
    });
  
    const filteredArray = dataSubdistrict && dataSubdistrict?.map((obj: any, index: number) => ({
        No: index + 1,
        Kecamatan: obj?.name_subdistrict,
        Latitude: obj?.lat,
        Longitude: obj?.long,
    }));


    // Tambahkan judul
    const titleText = "Data kecamatan";
    const fontSize = 16;
    const pageWidth = doc.internal.pageSize.getWidth();
    const { w } = doc.getTextDimensions(titleText, { fontSize }); // Menggunakan properti 'w' bukan 'width'
    const textX = (pageWidth - w) / 2;
    doc.text(titleText, textX, 10);

    // Get table data
    const tableData = convertArrayOfObjectsToArray(filteredArray);

    // Add table headers
    const headers = Object.keys(tableData[0]);
    const data = tableData.map(obj => headers.map(key => obj[key])).slice(1);
  
    // Add table to PDF
    doc.autoTable({
      head: [tableData[0]],
      body: data,
      startY: 20
    });
    
    // Save PDF file
    doc.save('data-kecamatan.pdf');
  }

  return (
    <div className='w-full'>
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 dark:bg-gray-900">
            <div className="relative">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="text" name='searchSubdistrict' value={searchSubdistrict} onChange={(e: any) => setSearchSubdistrict(e.target.value)} id="search" className="block px-2 py-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500" placeholder="Cari kecamatan...." />
            </div>
            <div className='w-max flex items-center'>
                <button onClick={() => exportToExcel()} className='mr-6 order-0 outline-0 rounded-[10px] flex items-center active:scale-[0.98] hover:brightness-[90%] bg-green-600 cursor-pointer text-white px-12 py-3'>Excel <FaFileExcel className='ml-3' /></button>
                <button onClick={() => exportToPDF()} className='border-0 outline-0 active:scale-[0.98] hover:brightness-[90%] rounded-[10px] flex items-center bg-red-600 cursor-pointer text-white px-12 py-3'>PDF <FaFilePdf className='ml-3' /></button>
            </div>
        </div>
        <div className="relative mt-2 border-[1px] border-black overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-6">
                            Lokasi
                        </th>
                        <th scope="col" className="px-6 py-6">
                            Latitude
                        </th>
                        <th scope="col" className="px-6 py-6">
                            Longitude
                        </th>
                        <th scope="col" className="px-6 py-6">
                            Link Peta
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dataSubdistrict && dataSubdistrict.length > 0 ? (
                            dataSubdistrict
                            .filter((sub: any) => {
                                // Jika pencarian tidak kosong, filter data berdasarkan label yang cocok dengan pencarian
                                if (searchSubdistrict && searchSubdistrict !== '') {
                                  return sub.name_subdistrict.toLowerCase().includes(searchSubdistrict.toLowerCase());
                                }
                                // Jika pencarian kosong, tampilkan semua data
                                return true;
                            })
                            .map((data: any, index: number) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <div className="relative w-[200px] overflow-hidden pl-6 py-4">
                                        <div className='w-full overflow-hidden'>
                                            <div className="text-base font-semibold overflow-hidden overflow-ellipsis max-w-[95%] whitespace-nowrap">{data?.name_subdistrict}</div>
                                            <div className="font-normal text-gray-500 overflow-hidden overflow-ellipsis max-w-[95%] whitespace-nowrap">Kabupaten cirebon</div>
                                        </div>  
                                    </div>
                                    <td className="w-[30%] px-6 py-4">
                                        {parseFloat(data.lat)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {parseFloat(data.long)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {parseFloat(data.long)}
                                    </td>
                                </tr>
                            ))
                        ):
                            null
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Subdistrict
