import 'jspdf-autotable';
import React from 'react';
import { popUpProps } from '../Models/componentInterface';

const Subdistrict: React.FC<popUpProps> = ({
    dataSubdistrict,
    searchSubdistrict
}) => {

  return (
    <div className='relative w-full z-[999999]'>
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
                            Kabupaten
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
                                        Cirebon
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
