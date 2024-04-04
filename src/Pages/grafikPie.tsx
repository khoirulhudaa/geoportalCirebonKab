import React, { useEffect, useState } from 'react'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import API from '../Services/service';

const GrafikPie: React.FC<{titleID: string}> = ({titleID}) => {

    const [dataChart, setDataChart] = useState<any[]>([])

    useEffect(() => {
        (async () => {
            const resultTitle = await API.getAllTitle()
            console.log('data all title:', resultTitle?.data?.data)
            const filter = await resultTitle?.data?.data?.filter((data: any) => data?.title_id === titleID)
            console.log('reult filter', filter[0]?.coordinate)
            const countCoordinateBySubdistrict = filter[0]?.coordinate?.reduce((acc: any, curr: any) => {
                acc[curr.subdistrict] = (acc[curr.subdistrict] || 0) + 1;
                return acc;
            }, {});
            const data = countCoordinateBySubdistrict
                ? Object.keys(countCoordinateBySubdistrict).map((subdistrict) => ({
                      value: countCoordinateBySubdistrict[subdistrict],
                      label: subdistrict,
                  }))
                : [];
            setDataChart(data);
        })()
    }, [])

  return (
     <div className='w-[90%] mx-auto bg-white border-[2px] border-blue-500 border-dashed rounded-[20px] mt-8 h-max md:flex'>
        <div className='relative overflow-hidden w-full h-max md:w-[60%] flex justify-center items-center h-max left-[-20px]'>
            {
                dataChart && dataChart?.length > 0 ? (
                    <PieChart
                        series={[
                            {
                                arcLabel: (item) => `${item.value}`,
                                arcLabelMinAngle: 25,
                                data: dataChart ?? [],
                                innerRadius: 25,
                                outerRadius: 200,
                                paddingAngle: 5,
                                cornerRadius: 5,
                                startAngle: -180,
                                endAngle: 180,
                            },
                        ]}
                        slotProps={{
                            legend: {
                                direction: 'column',
                                position: { 
                                    vertical: 'middle', // 'top', 'middle', atau 'bottom' untuk posisi vertikal
                                    horizontal: 'right' // 'left', 'middle', atau 'right' untuk posisi horizontal
                                },
                                padding: {
                                    top: 40
                                },
                            },
                        }}
                        height={500}
                        width={650}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fill: 'white',
                                fontWeight: 'bold',
                            }
                        }}
                    />
                ):  
                    <p className='text-slate-500 text-center mt-48'>Data Belum tersedia</p>
            }
        </div>
        <div className='w-full md:w-[40%] p-3 md:p-8 min-h-[400px] border-l-[2px] md:block hidden border-l-slate-300'>
            <table className="w-full  rounded-[10px] overflow-hidden text-center text-sm rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:text-gray-400">
                    <tr className='rounded-[20px]'>
                        <th scope="col" className="py-6">
                            Kecamatan
                        </th>
                        <th scope="col" className="py-6">
                            JUmlah
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                    dataChart && dataChart.length > 0 ? (
                        dataChart?.map((data: any, index: number) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="py-4">
                                {data?.label}
                            </td>
                            <td className="py-4">
                                {data?.value}
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

export default GrafikPie
