import Chart from 'chart.js/auto';
import React, { useEffect, useRef, useState } from 'react';
import API from '../Services/service';

interface GrafikProps {
    data?: any[];
    dinasID?: string;
    titleID?: string;
}

const Grafik: React.FC<GrafikProps> = ({ data, dinasID, titleID }) => {
    const chartRef2 = useRef<any>(null);
    const contentRef = useRef<any>(null);
    
    const [dataTitle, setDataTitle] = useState<string[]>([]);
    const [dataCoordinate, setDataCoordinate] = useState<number[]>([]);
    const [dataChart, setDataChart] = useState<any[]>([]);
    
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

    const countSubdistrictData = (data: any) => {
        const subdistrictCounts: any = {};
        data.forEach((item: any) => {
            const subdistrict = item.subdistrict;
            if (subdistrictCounts[subdistrict]) {
                subdistrictCounts[subdistrict]++;
            } else {
                subdistrictCounts[subdistrict] = 1;
            }
        });
    
        const subdistrictNames = Object.keys(subdistrictCounts);
        const subdistrictValues = Object.values(subdistrictCounts);
        
        return [subdistrictNames, subdistrictValues];
    };
    
    const [subdistrictNames, subdistrictValues] = countSubdistrictData(data?.flatMap(entry => entry.coordinate));

    useEffect(() => {
        if (data) {
            setDataTitle(
                data
                .filter((item:any) => item.dinas_id === dinasID)
                .map((item: any) => item.title)
            );
            setDataCoordinate(data.map((item: any) => item.coordinate.length));
        }
    }, [data, dinasID]);
    
    // Chart Data koordinat per-kecamatan
    useEffect(() => {
        if (dataTitle.length > 0 && dataCoordinate.length > 0) {
            const ctx = chartRef2.current.getContext('2d');
            if (ctx) {
                // Hancurkan chart yang ada jika sudah ada
                if (chartRef2.current.chart) {
                    chartRef2.current.chart.destroy();
                }

                // Buat chart baru
                chartRef2.current.chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: subdistrictNames,
                        datasets: [{
                            data: subdistrictValues,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                beginAtZero: true,
                                ticks: {
                                    precision: 0
                                },
                            },
                        },
                        indexAxis: 'y',
                        elements: {
                          bar: {
                            borderWidth: 2,
                          }
                        },
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false
                        },
                        }
                    },
                });
            }
        }
    }, [subdistrictNames, subdistrictValues]);
  
    return (
        <div className='w-[90%] mx-auto bg-white rounded-[20px] mt-8 h-max flex justify-center'>
            <div className='relative overflow-hidden w-[60%] flex py-7 justify-center items-center h-max'>
                <div className='flex mx-auto items-center flex-col h-max w-full' ref={contentRef}>
                    <div className='flex flex-col w-[90%] items-center mx-auto h-max'>
                        <canvas ref={chartRef2}></canvas>
                    </div>
                </div>
            </div>
            <div className='w-[40%] p-8 min-h-[400px] border-l-[2px] border-l-slate-300'>
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
                        dataChart && dataChart?.length > 0 ? (
                            dataChart?.map((d: any, index: number) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="py-4">
                                    {d?.label}
                                </td>
                                <td className="py-4">
                                    {d?.value}
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
    );
}

export default Grafik;
