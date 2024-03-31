import copy from "copy-to-clipboard";
import jsPDF from 'jspdf';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaBezierCurve, FaBuilding, FaCalendarAlt, FaChevronDown, FaClock, FaCopy, FaDotCircle, FaDrawPolygon, FaEye, FaEyeSlash, FaFileExcel, FaFilePdf, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { Map, Subdistrict } from '../Components';
import FormGroup from "../Components/FormGroup";
import SweetAlert from '../Components/SweetAlert';
import Navbar from '../Components/navbar';
import convertArrayOfObjectsToArray from '../Helpers/arrayTwoDimention';
import API from '../Services/service';
import { APIImage, Diskominfo, Square, Square2 } from '../assets';
import '../index.css';
import Grafik from './grafikBar';
import GrafikPie from './grafikPie';

const Homepage: React.FC = () => {
  
    const [listGeoData, setListGeoData] = useState<any[]>([])
    const [selectTitle, setSelectTitle] = useState<string>('')
    const [line] = useState<boolean>(false)
    const [status, setStatus] = useState<boolean>(false)
    const [activeHeight, setActiveHeight] = useState<boolean>(false)
    const [showAll, setShowAll] = useState<boolean>(false)
    const [showMap, setShowMap] = useState<boolean>(true)
    const [activePage, setActivePage] = useState<string>('')
    const [dinasID, setDinasID] = useState<string>('')
    const [titleID, setTitleID] = useState<string>('')
    const [activeData, setActiveData] = useState<string>('geospasial')
    const [search, setSearch] = useState<string>('')
    const [totalPage, setTotalPage] = useState<number>(10)
    const [custom, setCustom] = useState<any[]>([])
    const [allSubdistrict, setAllSubdistrict] = useState<any[]>([])
    const [allDinas, setAllDinas] = useState<any[]>([])
    const [allTitle, setAllTitle] = useState<any[]>([])
    const [selectTypeChart, setSelectTypeChart] = useState<string>('pie')
    const [activeAPI, setActiveAPI] = useState<boolean>(false)
    const [selectAPI, setSelectAPI] = useState<string>('')
    const [searchLocation, setSearchLocation] = useState<string>('')
    const [checkedDinas, setCheckedDinas] = useState<any>({});
    const [searchDinas, setSearchDinas] = useState<string>('');
    const [activeListDinas, setActiveListDinas] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState(0);

    const filteredData = listGeoData?.filter((data: any) => {
        if (search && search !== '') {
            return data?.title.toLowerCase().includes(search.toLowerCase());
        }
        return true;
    });

    const totalPages = Math.ceil(filteredData.length / (totalPage ?? 10));

    const handleClickNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleClickPrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {

        if(titleID !== '') {
        (async () => {
            const response = await API.getCustomCoordinate(titleID)
            setCustom(response?.data?.data)
        })()
        }
        
        setStatus(false)
        const handleResize = () => {
        };

        window.addEventListener("resize", handleResize);

        return () => {
        window.removeEventListener("resize", handleResize);
        };
    }, [status, titleID, dinasID]);

    useEffect(() => {
        (async () => {
            const resultSubdistrict = await API.getAllSubdistrict()
            const resultDinas = await API.getAllDinas()
            const resultTitle = await API.getAllTitle()
            setAllSubdistrict(resultSubdistrict.data.data)
            setAllTitle(resultTitle.data.data)
            setAllDinas(resultDinas.data.data)
            setStatus(false)
        })()
    }, [status, dinasID])

    const handleCheckboxChange = (event: any) => {
        const { name, checked } = event.target;
        setCheckedDinas((prevState: any) => ({ ...prevState, [name]: checked }));
    };

    const mapRef: RefObject<any> = useRef<any>(null); // Make sure it's initialized properly

    const exportToExcel = () => {

        const getCoordinate = () => {
            let coordinateList: any = [];
            coordinateList = allTitle?.filter((data: any) => data?.title_id === titleID)?.flatMap(entry => entry.coordinate)
            return coordinateList;
        }
    
        const listCoordinate = getCoordinate();

        listCoordinate.sort((a: any, b: any) => {
            const kecamatanA = a.name_location.toUpperCase(); 
            const kecamatanB = b.name_location.toUpperCase();
        
            if (kecamatanA < kecamatanB) {
            return -1;
            }
            if (kecamatanA > kecamatanB) {
            return 1;
            }
        
            return 0;
        });
    
        const filteredArray = listCoordinate && listCoordinate?.map((obj: any, index: number) => ({
            No: (index + 1).toString(),
            Nama_lokasi: obj?.name_location,
            Latitude: obj?.lat,
            Longitude: obj?.long,
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
        };
    }

    const exportToPDF = () => {

        console.log('all titie pdf:', allTitle)

        const doc = new jsPDF() as any;
        const getCoordinate = () => {
            let coordinateList: any = [];
            coordinateList = allTitle?.filter((data: any) => data?.title_id === titleID)?.flatMap(entry => entry.coordinate)
            return coordinateList;
        }
    
        const listCoordinate = getCoordinate();

        console.log('list cpprd:', listCoordinate)
        listCoordinate.sort((a: any, b: any) => {
            const kecamatanA = a.name_location.toUpperCase(); // Konversi kecamatam menjadi huruf besar untuk memastikan urutan yang konsisten
            const kecamatanB = b.name_location.toUpperCase();
        
            if (kecamatanA < kecamatanB) {
            return -1;
            }
            if (kecamatanA > kecamatanB) {
            return 1;
            }
        
            // Jika kedua kecamatan sama, tidak perlu melakukan perubahan pada urutan
            return 0;
        });

        const filteredArray = listCoordinate && listCoordinate?.map((obj: any, index: number) => ({
            No: index + 1,
            Nama_lokasi: obj?.name_location,
            Latitude: obj?.lat,
            Longitude: obj?.long,
            Kecamatan: obj?.subdistrict
        }));

        // Tambahkan judul
        const titleText = "Data geospasial";
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
        doc.save('geospasial.pdf');
    }

    useEffect(() => {
        (async () => {
            const response = await API.getAllTitleUser()
            setListGeoData(response?.data?.data)
        })()
    }, [])

    const handleClear = () => {
        setActivePage('')
        setDinasID('')
        setTitleID('')
    }

    const yourJsonObjectDinas = {
        "status": 200,
        "message": "Berhasil dapatkan dinas!",
        "data": [
            {
                "_id": "65c8e0aa49c92e0dc3863013",
                "dinas_id": "5237bdac81",
                "name_dinas": "Dinas Kesehatan",
                "abbreviation": "Dinkes",
                "created_at": "2024-02-11T14:32:55.792Z",
                "__v": 0
            },
            {
                "_id": "65d931807b2dc0b76d589005",
                "dinas_id": "8d77de707c",
                "name_dinas": "Dinas Lingkungan Hidup",
                "abbreviation": "DLHK CIREBON",
                "created_at": "2024-02-23T23:56:56.394Z",
                "__v": 0
            },
            {
                "_id": "65f2709fbd4557326707bf56",
                "dinas_id": "463959c675",
                "name_dinas": "Dinas Pendidikan ",
                "abbreviation": "DISDIK",
                "created_at": "2024-03-14T03:28:22.095Z",
                "__v": 0
            }
        ]
    }

    const yourJsonObject = {
        "_id": "65ff7f36103d6bdf1b0044a0",
        "title_id": "77b70600ce",
        "dinas_id": "463959c675",
        "name_dinas": "Dinas Pendidikan ",
        "title": "Sebaran sd",
        "year": "2024",
        "description": "Sebaran Data Sekolah Dasar",
        "status": "Tetap",
        "type": "public",
        "coordinate": [
            {
                "coordinate_id": "a6812ae6a0",
                "name_location": "-6.7173665191128515,",
                "title_id": "77b70600ce",
                "subdistrict": "Kedawung",
                "lat": -6.7173665191128515,
                "long": 108.53463651807232,
                "link": "",
                "thumbnail": "",
                "condition": [
                    {
                        "label": "SPBU",
                        "icon": "⛽"
                    },
                    {
                        "label": "Kantor polisi",
                        "icon": "🚓"
                    },
                    {
                        "label": "Masjid",
                        "icon": "🕌"
                    }
                ]
            }
        ],
        "created_at": "2024-03-24T00:54:31.455Z",
        "__v": 1
    }

    const yourJsonObjectKecamatan = {
        "status": 200,
        "message": "Berhasil dapatkan kecamatan!",
        "data": [
            {
                "_id": "65c79c7de41906d0de072bf3",
                "subdistrict_id": "9a1e533ee1",
                "name_subdistrict": "Arjawinangun",
                "lat": "-6.64371827737905",
                "long": "108.40339895082745",
                "created_at": "2024-02-10T15:47:56.971Z",
                "__v": 0
            },
            {
                "_id": "65c79ccde41906d0de072bfc",
                "subdistrict_id": "eb2a61e110",
                "name_subdistrict": "Astanajapura",
                "lat": "-6.803439222015026",
                "long": "108.61491809521407",
                "created_at": "2024-02-10T15:47:56.971Z",
                "__v": 0
            },
            {
                "_id": "65c79d39e41906d0de072c05",
                "subdistrict_id": "4645936546",
                "name_subdistrict": "Babakan",
                "lat": "-6.87112499592155",
                "long": "108.72172809475984",
                "created_at": "2024-02-10T15:47:56.971Z",
                "__v": 0
            },
        ]
    }

    const textRefMain: any = useRef();
    const textRef: any = useRef();
    const textRef2: any = useRef();
    const textRef3: any = useRef();

    //Function to add text to clipboard
    const copyToClipboardMain = () => {
      // Text from the html element
      let copyText = textRefMain?.current?.value;
      // Adding text value to clipboard using copy function
      let isCopy = copy(copyText);
  
      //Dispalying notification
      if (isCopy) {
        SweetAlert({
            title: 'Berhasil di Salin!',
            confirmButtonText: 'Tutup',
            icon: 'success',
            showCancelButton: false,
        })
      }
    };

    const copyToClipboard = () => {
      // Text from the html element
      let copyText = textRef?.current?.value;
      // Adding text value to clipboard using copy function
      let isCopy = copy(copyText);
  
      //Dispalying notification
      if (isCopy) {
        SweetAlert({
            title: 'Berhasil di Salin!',
            confirmButtonText: 'Tutup',
            icon: 'success',
            showCancelButton: false,
        })
      }
    };

    const copyToClipboard2 = () => {
      // Text from the html element
      let copyText = textRef?.current?.value;
      // Adding text value to clipboard using copy function
      let isCopy = copy(copyText);
  
      //Dispalying notification
      if (isCopy) {
        SweetAlert({
            title: 'Berhasil di Salin!',
            confirmButtonText: 'Tutup',
            icon: 'success',
            showCancelButton: false
        })
      }
    };

    const copyToClipboard3 = () => {
      // Text from the html element
      let copyText = textRef3?.current?.value;
      // Adding text value to clipboard using copy function
      let isCopy = copy(copyText);
  
      //Dispalying notification
      if (isCopy) {
        SweetAlert({
            title: 'Berhasil di Salin!',
            confirmButtonText: 'Tutup',
            icon: 'success',
            showCancelButton: false
        })
      }
    };

    return (
    <div className='w-screen h-max'>
        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.1671931379157!2d108.5281263152966!3d-6.709586995200332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6ee218c1dc5149%3A0xa56ae9c210a9cffb!2sUPTD%20Puskesmas%20Kedawung!5e0!3m2!1sen!2sid!4v1648622108774!5m2!1sen!2sid" width="600" height="450" allowfullscreen="" loading="lazy"></iframe> */}
        <input value="https://be-geospasial.vercel.app/v2/api" className='absolute opacity-0' disabled type="text" ref={textRefMain} />
        <input value="https://be-geospasial.vercel.app/v2/api/dinas" className='absolute opacity-0' disabled type="text" ref={textRef} />
        <input value="https://be-geospasial.vercel.app/v2/api/title" className='absolute opacity-0' disabled type="text" ref={textRef2} />
        <input value="https://be-geospasial.vercel.app/v2/api/kecamatan" className='absolute opacity-0' disabled type="text" ref={textRef3} />
        <Navbar handleClear={() => handleClear()}  />
        <div className='w-screen h-max pb-0 bg-[#f1f2ff]'>
            {
                dinasID !== '' && titleID !== '' ? (
                    <div className={`w-[90%] mx-auto ${activeHeight ? 'mt-[-120px] opacity-0' : 'mt-0 opacity-1'} flex duration-200 ease py-8 items-center justify-between`}>
                        <div className='w-[40%] flex items-center'>
                            <div onClick={() => handleClear()} className="w-[50px] h-[40px] bg-blue-600 text-white text-[20px] font-normal rounded-[10px] flex items-center justify-center cursor-pointer hover:brightness-[90%] active:scale-[0.98] mr-3">
                                <FaArrowLeft />
                            </div>
                            <h2 className='w-full overflow-hidden overflow-ellipsis whitespace-nowrap items-center text-[21px]' title={selectTitle !== '' ? selectTitle : 'Data Geospasial Kabupaten Cirebon 🗺️'}>{selectTitle !== '' ? selectTitle : 'Data Geospasial Kabupaten Cirebon 🗺️'}</h2>
                        </div>
                        <div className='w-[60%] flex items-center justify-end'>
                            <button title='Lihat pea' onClick={() => titleID === '' ? null : setActivePage('')} className={`w-[28%] text-center mr-6 border py-3 border-black justify-center ${titleID === '' ? ' bg-slate-200 text-slate-400' : 'hover:brightness-[90%] active:scale-[0.99] duration-100'} duration-100 h-max ${(activePage === '' || activePage === 'peta') && titleID !== '' ? 'flex bg-blue-700 text-white border-blue-500 border' : 'bg-white text-black border-slate-400'} items-center rounded-[10px] text-[16px]`}>
                                <p>
                                Peta
                                </p>
                            </button>
                            <button title='LIhat daftar kecamatan' onClick={() => activePage === 'subdistrict' ? setActivePage('') : setActivePage('subdistrict')} className={`w-[28%] text-center mr-6 py-3 justify-center ${activePage === 'subdistrict' ? 'flex bg-blue-700 text-white border-blue-500 border' : 'bg-white text-black border-slate-400'} border border-black hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center rounded-[10px] text-[16px]`}>
                                <p>
                                Kecamatan
                                </p>
                            </button>
                            <button title='LIhat daftar kecamatan' onClick={() => titleID === '' ? null : (activePage === 'grafik' ? setActivePage('') : setActivePage('grafik'))} className={`w-[28%] text-center py-3 justify-center ${activePage === 'grafik' ? 'flex bg-blue-700 text-white border-blue-500 border' : 'bg-white text-black border-slate-400'} ${titleID === '' ? ' bg-slate-200 text-slate-400' : 'hover:brightness-[90%] active:scale-[0.99] duration-100'} border border-black h-max flex items-center rounded-[10px] text-[16px]`}>
                                <p>
                                Grafik data
                                </p>
                            </button>
                        </div>
                    </div>
                ):
                    null
            }
            <hr className='border border-slate-300 w-[90%] mx-auto' />
            {
                dinasID && titleID !== '' ? (
                    activePage === '' || activePage === 'peta' ? (
                        <div className='w-[90%] mx-auto mb-14 h-max'>

                            <div className="mt-5 flex items-center justify-between md:justify-between space-y-4 md:space-y-0 dark:bg-gray-900">
                                <div className="relative w-full flex items-center justify-between">
                                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                    <input type="text" name='searchSubdistrict' value={searchLocation} onChange={(e: any) => setSearchLocation(e.target.value)} id="search" className="outline-0 block px-2 py-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-[40%] bg-white focus:ring-blue-500 focus:border-blue-500" placeholder="Cari kecamatan...." />
                                </div>
                                <div className='w-max flex items-center'>
                                    <button onClick={() => setShowMap(!showMap)} className='border-0 outline-0 active:scale-[0.98] hover:brightness-[90%] rounded-[10px] flex w-[170px] text-center justify-center items-center bg-white cursor-pointer text-black px-6 py-3'>{showMap ? 'Tutup Peta' : 'Lihat Peta' } {showMap ? <FaEyeSlash className="ml-3" /> : <FaEye className="ml-3" />}</button>
                                </div>
                            </div>

                            <div className={`w-full mt-8 duration-200 ${showMap ? 'h-max' : 'h-[0px]'} border-[1px] border-black ease duration-200 rounded-[16px] overflow-hidden mx-auto overflow-hidden`}>
                                <Map showMap={showMap} searchLocation={searchLocation ?? ''} customData={custom} dataSubdistrict={allSubdistrict} handleShowAll={() => setShowAll(!showAll)} showAll={showAll} search={search} height={activeHeight} handleHeight={() => setActiveHeight(!activeHeight)} ref={mapRef} data={!showAll ? allTitle?.filter((data: any) => data?.title_id === titleID) : allTitle?.filter((data: any) => data?.dinas_id === dinasID) ?? []} line={line} />
                            </div>

                            <div className="flex items-center justify-between flex-column mt-12 flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 dark:bg-gray-900">
                                <div className="relative">
                                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                    <input type="text" name='search' value={search} onChange={(e:any) => setSearch(e.target.value)} id="table-search-users" className="block px-2 ps-10 py-3 text-sm text-gray-900 border border-slate-700 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-700 dark:placeholder-slate-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users" />
                                </div>
                                <div className='w-max flex items-end'>
                                    <button onClick={() => exportToExcel()} className='border-0 outline-0 rounded-full flex items-center active:scale-[0.98] hover:brightness-[90%] bg-green-500 text-white px-6 py-2'>Excel <FaFileExcel className='ml-3' /></button>
                                    <button onClick={() => exportToPDF()} className='border-0 outline-0 active:scale-[0.98] hover:brightness-[90%] rounded-full flex ml-4 items-center bg-red-500 text-white px-6 py-2'>PDF <FaFilePdf className='ml-3' /></button>
                                </div>
                            </div>

                            <div className="relative w-full mt-2 border-[1px] border-black overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="w-[40%] pl-6 py-6">
                                                Lokasi
                                            </th>
                                            <th scope="col" className="py-6">
                                                Latitude
                                            </th>
                                            <th scope="col" className="py-6">
                                                Longitude
                                            </th>
                                            <th scope="col" className="py-6">
                                                Kecamatan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        allTitle && allTitle.length > 0 ? (
                                        allTitle
                                        .filter((data: any) => data?.title_id === titleID)
                                        .map((data: any) => (
                                            data.coordinate
                                            .filter((sub: any) => {
                                            // Jika pencarian tidak kosong, filter data berdasarkan label yang cocok dengan pencarian
                                            if (search && search !== '') {
                                                return sub.name_location.toLowerCase().includes(search.toLowerCase());
                                            }
                                            // Jika pencarian kosong, tampilkan semua data
                                            return true;
                                            })
                                            .map((data: any, index: number) => (
                                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <div className="relative w-[350px] overflow-hidden pl-6 py-4">
                                                    <div className='w-full overflow-hidden'>
                                                        <div className={`text-base font-semibold overflow-hidden overflow-ellipsis max-w-[95%] whitespace-nowrap`}>{data?.name_location}</div>
                                                        <div className="font-normal text-gray-500 overflow-hidden overflow-ellipsis max-w-[95%] whitespace-nowrap">Kabupaten cirebon</div>
                                                    </div>  
                                                </div>
                                                <td className="py-4">
                                                    {parseFloat(data.lat).toFixed(8)}
                                                </td>
                                                <td className="py-4">
                                                    {parseFloat(data.long).toFixed(6)}
                                                </td>
                                                <td className="py-4">
                                                    {data.subdistrict}
                                                </td>
                                            </tr>
                                            ))
                                        ))    
                                        ):
                                        null
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ): activePage === 'subdistrict' ? (
                        <div className='w-[90%] mx-auto mt-8'>
                            <Subdistrict 
                                dataSubdistrict={allSubdistrict && allSubdistrict.length > 0 ? allSubdistrict : []} 
                            />
                        </div>
                    ):
                    <>
                        <div className='w-[90%] flex mx-auto items-center mt-8 justify-between'>
                            <div className='w-[80%] mx-auto flex items-center'>
                                <div className='md:w-[50%] h-[50px] rounded-[8px] bg-white border border-blue-600 outline-0 p-2 shadow-md text-black'>
                                    <select name='selectTypeChart' value={selectTypeChart} onChange={(e: any) => setSelectTypeChart(e.target.value)} className='w-full bg-white h-full border-0 outline-0 text-black'>
                                        <option className='text-black' value="Pilih Tampilan Chart" disabled={true}>Pilih Tampilan Chart</option>   
                                        <option className='text-black' value="pie">PIE Chart</option>   
                                        <option className='text-black' value="bar">BAR Chart</option>   
                                    </select>
                                </div>
                            </div>
                            <div className='w-[20%] flex justify-end mr-1 items-center'>
                                <p>
                                    Jumlah data : <b>{allTitle?.filter((data: any) => data?.title_id === titleID)?.flatMap((entry: any) => entry?.coordinate)?.length}</b>
                                </p>
                            </div>
                        </div>    
                        <div className="pb-14">
                            {
                                selectTypeChart === 'pie' ? (
                                    <GrafikPie titleID={titleID ?? ''} />
                                ):  
                                    <Grafik data={allTitle ?? []} titleID={titleID ?? ''} />
                            }
                        </div>
                    </>
                ):
                <>
                    <div className='w-screen md:flex hidden text-center h-[50px] bg-[#e1f3fc] items-center justify-center text-blue-600 text-[10px] md:text-[14px]'>
                        <p>Cirebon merupakan salah satu simpul Jaringan Informasi Geospasial Nasional <b title='Jaringan Informasi Geospasial Nasional (JIGN) adalah suatu sistem penyelenggaraan pengelolaan data geospasial secara bersama, tertib, terukur, terintegrasi dan berkesinambungan serta berdayaguna.' className='text-blue-600 cursor-pointer hover:text-blue-900 ml-1' onClick={() => null}>(JIGN)</b>.</p>
                    </div>
                    {/* Hero Component */}

                    <section id="home" className='relative w-full border-b-[3px] border-t-[3px] border border-blue-300 h-max md:h-[96vh] overflow-hidden flex justify-center items-center bg-blue-800 p-12'>
                        <img src={Square} alt="square" loading="lazy" className='absolute opacity-[1] w-[40%] left-0 top-0' />
                        <img src={Square} alt="square" loading="lazy" className='absolute opacity-[1] w-[40%] left-[30%] top-0' />
                        <img src={Square} alt="square" loading="lazy" className='absolute opacity-[1] w-[40%] left-[45%] bottom-[-80px]' />
                        <img src={Square} alt="square" loading="lazy" className='absolute opacity-[1] w-[40%] right-[-20%] top-0' />
                        <img src={Square} alt="square" loading="lazy" className='absolute opacity-[1] w-[40%] right-[5%] bottom-[-80px]' />
                        <div className='w-screen md:w-full text-center z-[3] relative hmax md:h-full flex flex-col justify-center text-white'>
                            <h2 className='text-[30px] md:text-[68px] md:mt-[-30px] md:mb-4 w-screen md:w-[90%] mx-auto font-normal'>Web Geoportal : Peta Koordinat Daerah Cirebon</h2>
                            <p className='text-[13px] md:text-[18px] md:flex hidden leading-loose mt-6 w-[90vw] md:w-[80%] mx-auto x-[555]'>"Di Geoportal Cirebon, Anda dapat menemukan berbagai informasi geospasial yang berguna, seperti batas administratif, lokasi penting, dan data lingkungan."</p>
                            <a href="#daftar">
                                <div id='btn-hero' className='relative overflow-hidden mx-auto brightness-[90%] px-6 py-4 text-[14px] md:text-[17px] mt-12 md:mb-0 mb-3 bg-white rounded-[10px] shadow-lg text-blue-600 w-max flex items-center justify-center cursor-pointer hover:brightness-[90%] active:scale-[0.99] z-[9999]'>
                                    Cek Geospasial Sekarang
                                </div>
                            </a>
                        </div>
                        <div className='absolute w-[350px] h-[650px] border-[4px] border-blue-300 left-[20px] border-opacity-[0.3] border-dashed'>
                        </div>
                        <div className='absolute w-screen h-[5px] border-[4px] border-blue-300 left-[20px] mb-24 border-opacity-[0.2] border-dashed'>
                        </div>
                        <div className='absolute h-[650px] w-[5px] border-[4px] border-blue-300 left-[50%] border-opacity-[0.2] border-dashed'>
                        </div>
                        <div className='absolute w-[350px] h-[650px] border-[4px] border-blue-300 right-[20px] border-opacity-[0.3] border-dashed'>
                        </div>
                    </section>

                    <section id='daftar' className='relative overflow-hidden text-center w-screen bg-[#fbffff] h-max pt-8 md:pt-14 md:pb-14 pb-0 md:px-16'>
                        <img src={Square2} alt="square" loading="lazy" className='absolute opacity-[0.7] w-[40%] right-[-140px] rotate-[90deg] z-[1] top-[0px]' />
                        
                        <h2 className='text-[26px] w-full md:text-[36px] font-normal'>Daftar Data Geospasial 🗺️</h2>
                        <p className='md:block hidden text-slate-500 mt-2 mb-10'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam, perferendis.</p>

                        <div className='relative mx-auto overflow-x-auto w-max flex justify-center items-center z-[44] md:mt-0 mt-6'>
                            <div onClick={() => setActiveData('geospasial')} className={`w-[43%] md:w-max h-max border ${activeData === 'geospasial' ? 'bg-blue-700 text-white' : 'bg-white hover:bg-blue-100 hover:text-blue-600 hover:border-blue-500'} border-slate-400 rounded-[10px] shadow-lg py-[10px] md:mb-0 mb-4 mr-2 md:mx-4 px-6 py-2 flex items-center justify-center cursor-pointer active:scale-[0.99]`}>
                                <p className="w-max flex">
                                    <span className="md:flex hidden mr-2">Data</span> Geospasial
                                </p>
                            </div>
                            <div onClick={() => setActiveData('subdistrict')} className={`w-[43%] md:w-max h-max border ${activeData === 'subdistrict' ? 'bg-blue-700 text-white' : 'bg-white hover:bg-blue-100 hover:text-blue-600 hover:border-blue-500'} border-slate-400 rounded-[10px] shadow-lg py-[10px] md:mb-0 mb-4 md:ml-0 ml-2 md:mr-4 px-6 py-2 flex items-center justify-center cursor-pointer active:scale-[0.99]`}>
                                <p className="w-max flex">
                                    <span className="md:flex hidden mr-2">Data</span> Kecamatan
                                </p>
                            </div>
                            <div onClick={() => {window.location.href = 'https://www.google.com/maps', setActiveData('map')}} className={`w-max h-max border hidden md:flex ${activeData === 'map' ? 'bg-blue-700 text-white' : 'bg-white hover:bg-blue-100 hover:text-blue-600 hover:border-blue-500'} border-slate-400 rounded-[10px] shadow-lg py-[10px] md:mb-0 mb-4 mr-4 px-6 py-2 flex items-center justify-center cursor-pointer active:scale-[0.99]`}>
                                <p className="w-max">
                                    Google Map
                                </p>
                            </div>
                            <div onClick={() => {window.location.href = 'https://opendata.cirebonkab.go.id/', setActiveData('openData')}} className={`w-max h-max border hidden md:flex ${activeData === 'openData' ? 'bg-blue-700 text-white' : 'bg-white hover:bg-blue-100 hover:text-blue-600 hover:border-blue-500'} border-slate-400 rounded-[10px] shadow-lg py-[10px] md:mb-0 mb-4 mr-4 px-6 py-2 flex items-center justify-center cursor-pointer active:scale-[0.99]`}>
                                <p className="w-max">
                                    Web Open Data
                                </p>
                            </div>
                            <a href="#masukan">
                                <div className={`w-max h-max border hidden md:flex bg-white border-slate-400 rounded-[10px] shadow-lg py-[10px] md:mb-0 mb-4 mr-4 px-6 py-2 flex items-center justify-center cursor-pointer hover:bg-blue-100 hover:text-blue-600 hover:border-blue-500 active:scale-[0.99]`}>
                                    Tanggapan
                                </div>
                            </a>
                        </div>

                        <div className={`w-full my-6 ${activeData === 'subdistrict' ? 'hidden' : 'flex'}`}>
                            <input type="text" name='search' onChange={(e: any) => setSearch(e.target.value)} placeholder='Cari judul geospasial...' className='bg-white rounded-[10px] w-[90vw] mx-auto md:w-[60%] px-3 py-3 outline-0 border border-blue-700' />
                        </div>
                        
                        {
                            activeData === 'subdistrict' ? (
                                <div className="mt-9">
                                    <Subdistrict 
                                        dataSubdistrict={allSubdistrict && allSubdistrict.length > 0 ? allSubdistrict : []} 
                                    />
                                </div>
                            ):
                                <div className='w-full flex h-max'>
                                    <div className={`relative mt-3 w-[30%] pt-[24px] hidden md:block pb-1 px-7 ${activeListDinas ? 'min-h-full duration-200' : 'h-[80px] duration-200'} overflow-y-hidden rounded-[10px] text-left bg-white border border-blue-500 border-dashed`}>
                                        <div className="w-full flex items-center pb-4 justify-between">
                                            <h2 className='font-[500] text-[18px]'>Daftar Dinas</h2>
                                            <FaChevronDown onClick={() => setActiveListDinas(!activeListDinas)} className="text-slate-400 cursor-pointer active:scale-[0.98]" />
                                        </div>
                                        <hr className={`${activeListDinas ? 'mb-3 block' : 'hidden'}`} />
                                        <div className="w-[102%] ml-[-4px] mb-4">
                                            <input name="searchDinas" value={searchDinas} onChange={(e: any) => setSearchDinas(e.target.value)} type="text" className="w-full rounded-[10px] bg-white my-2 px-3 py-3 text-slate-600 outline-0 border border-slate-300 text-[13px]" placeholder="Cari nama dinas..." />
                                        </div>
                                        <div className='flex flex-col my-2 w-full'>
                                            {
                                            allDinas && allDinas.length > 0 ? (
                                                (() => {
                                                    // Lakukan filter terlebih dahulu
                                                    const filteredDinas = allDinas?.filter((data: any) => {
                                                        if (searchDinas !== '') {
                                                            return data?.name_dinas.toLowerCase().includes(searchDinas.toLowerCase());
                                                        }
                                                        return true;
                                                    });

                                                    // Periksa apakah hasil filter tidak mengandung data
                                                    if (filteredDinas.length > 0) {
                                                        return filteredDinas.map((data: any, index: number) => (
                                                            <div key={index} className="w-full inline-flex items-center mb-6">
                                                                <div className='w-[10%]'>
                                                                    <input type="checkbox" name={data?.name_dinas} checked={checkedDinas[data?.name_dinas as keyof typeof checkedDinas] || false} onChange={handleCheckboxChange} value={data?.name_dinas} className="scale-[1.6] outline-0 p-1 rounded-[20px] overflow-hidden mr-3 rounded-lg"/>
                                                                </div>
                                                                <div className='w-[90%]'>
                                                                    <p>{data?.name_dinas}</p>
                                                                </div>
                                                            </div>
                                                        ));
                                                    } else {
                                                        return (
                                                            <div className="w-full h-max flex items-center justify-center py-6 border border-dashed border-blue-500 rounded-[10px] mb-4">
                                                                <p>Dinas Tidak Tersedia</p>
                                                            </div>
                                                        )
                                                    }
                                                })()
                                            ) : (
                                                <p>Dinas Tidak Tersedia</p>
                                            )
                                        }
                                        </div>
                                    </div>
                                    <div className='w-[94vw] md:w-[70%] mx-auto md:mx-0 md:px-4'>
                                        <div className='relative mb-5 z-[44] w-full h-max flex flex-col'>
                                        {
                                            listGeoData && listGeoData.length > 0 ? (
                                                (() => {
                                                    const filteredData = listGeoData.filter((data: any) => {
                                                        // Filter logic here
                                                        if (search && search !== '') {
                                                            return data?.title.toLowerCase().includes(search.toLowerCase());
                                                        }
                                                        if (Object.values(checkedDinas).every((val: any) => !val)) {
                                                            return true;
                                                        }
                                                        const matchesCheckedDinas = Object.keys(checkedDinas).some((key) => checkedDinas[key as keyof typeof checkedDinas] && data?.name_dinas === key);
                                                        return matchesCheckedDinas;
                                                    });

                                                    if (filteredData.length === 0 && (search !== '' || checkedDinas)) {
                                                        return (
                                                            <div className="w-full h-[500px] flex items-center justify-center bg-white rounded-[10px] mt-3 border border-dashed border-blue-700">
                                                                <p>Data Tidak Tersedia</p>
                                                            </div>
                                                        );
                                                    }

                                                    return (search !== '' || checkedDinas ? filteredData : listGeoData)
                                                        .slice(currentPage * totalPage, (currentPage + 1) * totalPage)
                                                        .sort((a: any, b: any) => {
                                                            // Pastikan a.created_at dan b.created_at adalah tanggal yang valid sebelum membandingkannya
                                                            const dateA: any = new Date(a?.created_at);
                                                            const dateB: any = new Date(b?.created_at);
                                                        
                                                            // Periksa apakah dateA dan dateB adalah tanggal yang valid
                                                            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                                                                // Tanggal tidak valid, kembalikan 0 (tidak ada perubahan urutan)
                                                                return 0;
                                                            }
                                                        
                                                            // Urutkan berdasarkan tanggal pembuatan terbaru
                                                            return dateB - dateA;
                                                        })
                                                        .map((data: any, index: number) => (
                                                            <div key={index} className='w-full min-h-[180px] my-3 shadow-lg border border-blue-500 border-dashed rounded-[12px] bg-white show-lg p-5'>
                                                                <div className='w-full h-[50%] flex items-center justify-between overflow-hidden text-left rounded-[8px]'>
                                                                    <h3 onClick={() => {setDinasID(data?.dinas_id), setTitleID(data?.title_id), setSelectTitle(data?.title), window.scrollTo(0, 0)}} className='text-[18px] cursor-pointer hover:text-blue-600 active:scale-[0.99] underline font-[500]'>
                                                                        {data?.title}
                                                                    </h3>
                                                                    <div className='rounded-[10px] text-[12px] w-max h-max px-4 py-2 hidden md:flex items-center justify-center bg-green-600 text-white mr-4'>
                                                                        {data?.type ?? 'Public'}
                                                                    </div>
                                                                </div>
                                                                <div className='w-full flex flex-wrap mt-3 items-center'>
                                                                    <div className='rounded-full md:mb-0 mb-3 w-max h-max px-4 py-2 flex items-center justify-center bg-slate-200 text-slate-500 mr-3'>
                                                                        <FaCalendarAlt className='mr-2' /> {data?.year ?? new Date().getFullYear()}
                                                                    </div>
                                                                    <div className={`rounded-full md:mb-0 mb-3 w-max h-max px-4 py-2 flex items-center justify-center ${data?.status === 'Sementara' ? 'bg-green-200' : 'bg-green-500 text-white'} text-green-600 mr-4`}>
                                                                        <FaClock className='mr-2' /> {data?.status ?? 'Tidak ber-status'}
                                                                    </div>
                                                                    <div className='rounded-full md:mb-0 mb-3 max-w-[56%] h-max px-4 py-2 flex items-center justify-center bg-blue-200 text-blue-600 mr-4'>
                                                                        <FaBuilding className='mr-2' /> 
                                                                        <p className='max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap'>
                                                                            {data?.name_dinas ?? 'Tidak ada dinas'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <hr className='mt-4' />
                                                                <p className='text-[14px] w-full md:w-[96%] overflow-hidden leading-[1.6em] text-slate-600 mt-4 text-left'>
                                                                    {data?.description ?? 'Deskripsi belum tersedia.'}
                                                                </p>
                                                                <div className="w-full flex items-center">
                                                                    <div className='rounded-full w-max h-max px-4 py-2 flex items-center justify-center mt-5 bg-red-200 text-red-600 text-[12px]'>
                                                                        <FaMapMarkerAlt className='mr-2' /> {data?.coordinate?.length ?? 0} <span className="md:flex hidden ml-1">Lokasi/koordinat</span>
                                                                    </div>
                                                                    <div className='rounded-full w-max h-max px-4 py-2 flex items-center ml-3 justify-center mt-5 bg-yellow-200 text-yellow-600 text-[12px]'>
                                                                        {data?.category === 'Koordinat' ? <FaDotCircle className='mr-2' /> : data?.category === 'Polygon' ? <FaDrawPolygon className='mr-2' /> : <FaBezierCurve className='mr-2' />} {data?.category ?? '-'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    })()
                                                ) : (
                                                    <div className="w-full h-[500px] flex items-center justify-center bg-white rounded-[10px] mt-3 border border-dashed border-blue-700">
                                                        <p>Data Tidak Tersedia</p>
                                                    </div>
                                                )
                                            }
                                            <div className="flex items-center w-full justify-between mt-8 md:mt-6 md:mb-0 mb-16">
                                                <div className="flex items-center w-max h-max">
                                                    <div className="flex w-max rounded-[10px] bg-white justify-start px-6 py-2 border border-dashed border-blue-700">
                                                        <select name="totalPage" value={totalPage} className="bg-white outline-0" onChange={(e: any) => setTotalPage(e.target.value)} id="totalPage">
                                                            <option value="5">5</option>
                                                            <option value="10">10</option>
                                                            <option value="20">20</option>
                                                            <option value="30">30</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex w-full justify-end">
                                                    <button
                                                        className={`${currentPage === 0 ? 'bg-slate-400 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-600 cursor-pointer'} flex items-center font-bold py-4 px-4 rounded-[8px]`}
                                                        onClick={() => handleClickPrev()}
                                                        disabled={currentPage === 0}
                                                    >
                                                        <FaArrowLeft className='cursor-pointer' />
                                                    </button>
                                                    <span className="text-slate-700 font-normal mx-4 flex items-center md:px-4">
                                                        <p className='md:inline hidden'>Page</p> 
                                                            {currentPage + 1} of {totalPages}
                                                    </span>
                                                    <button
                                                        className={`${currentPage === totalPages - 1 ? 'bg-slate-400 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-600 cursor-pointer'}flex items-center font-bold py-4 px-4 rounded-[8px]`}
                                                        onClick={() => handleClickNext()}
                                                        disabled={currentPage === totalPages - 1}
                                                    >
                                                        <FaArrowRight className='cursor-pointer' />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }

                    </section>

                    <div className='border-t border-t-[2px] border-dashed border-blue-700 w-screen mx-auto relative'></div>

                    <section id='API' className='relative overflow-hidden w-screen bg-blue-700 h-max pt-14 md:pt-20 pb-16 md:pb-28 px-6 md:px-16'>
                        <img src={Square} alt="square" loading="lazy" className='absolute opacity-[1] w-[40%] left-0 top-[-260px]' />
                        <img src={Square} alt="square" loading="lazy" className='absolute opacity-[1] w-[40%] left-[30%] top-[-260px]' />
                        <img src={Square} alt="square" loading="lazy" className='absolute opacity-[1] w-[40%] left-[45%] bottom-[-100px]' />
                        <img src={Square} alt="square" loading="lazy" className='absolute opacity-[1] w-[40%] right-[-20%] top-[-260px]' />
                        <img src={Square} alt="square" loading="lazy" className='absolute opacity-[1] w-[40%] right-[5%] bottom-[-100x]' />
                        <h2 className='text-[26px] mb-8 md:mb-0 md:text-[36px] text-white font-normal text-center'>API Geospasial 💻</h2>
                        <p className='text-slate-200 md:block hidden mt-4 mb-10 text-center'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam, perferendis.</p>    
                        <div className='relative w-ful z-[444] px-4 md:px-12 pt-6 md:pt-14 pb-6 md:pb-20 flex mx-auto rounded-[16px] bg-white border-[2px] min-h-[680px] border-blue-500 border-dashed'>
                            <div className='w-full md:w-1/2 h-[500px] flex justify-between flex-col'>
                                <label htmlFor="api-dinas" className='font-[500] flex items-center'>&#123;&#123; BASE_URL &#125;&#125;</label>
                                <div className='relative rounded-[10px] bg-blue-200 text-blue-700 w-[100%] p-4 flex items-center my-6'>
                                    <code className="w-[86%] overflow-hidden overflow-ellipsis whitespace-nowrap">https://be-geospasial.vercel.app/v2/api</code>
                                    <div onClick={() => copyToClipboardMain()} className='absolute right-1 z-[444] scale-[0.9] z-[999] rounded-[10px] shadow-lg w-[50px] h-[50px] bg-blue-500 flex items-center justify-center cursor-pointer hover:brightness-[90%] active:p-2 duration-200 text-white'>
                                        <FaCopy />
                                    </div>
                                </div>
                                <label htmlFor="api-dinas" className='font-[500] md:flex items-center'>
                                    API Data Kecamatan  
                                    <div className="w-max mt-3 md:mt-0 md:ml-auto flex items-center">
                                        <div className='w-max bg-green-400 mr-4 px-3 py-2 w-max h-max text-[10px] rounded-md text-white'>
                                            (GET)
                                        </div>
                                        <p onClick={() => {setSelectAPI('Kecamatan'), setActiveAPI(true)}} className='text-blue-600 md:hidden cursor-pointer active:scale-[0.98] hover:text-blue-800'>
                                            Lihat Respon
                                        </p>    
                                    </div>
                                    <p onClick={() => {setSelectAPI('Kecamatan'), setActiveAPI(true)}} className='text-blue-600 cursor-pointer md:flex hidden active:scale-[0.98] hover:text-blue-800'>
                                        Lihat Respon
                                    </p>
                                </label>
                                <div className='relative rounded-[10px] bg-blue-200 text-blue-700 w-[100%] p-4 flex items-center my-6'>
                                    <code className="w-[86%] overflow-hidden overflow-ellipsis whitespace-nowrap">&#123;&#123;BASE_URL&#125;&#125;/v2/api/kecamatan</code>
                                    <div onClick={() => copyToClipboard3()} className='absolute right-1 z-[444] scale-[0.9] z-[999] rounded-[10px] shadow-lg w-[50px] h-[50px] bg-blue-500 flex items-center justify-center cursor-pointer hover:brightness-[90%] active:p-2 duration-200 text-white'>
                                        <FaCopy />
                                    </div>
                                </div>
                                <label htmlFor="api-dinas" className='font-[500] md:flex items-center'>
                                    API Data Dinas  
                                    <div className="w-max mt-3 md:mt-0 md:ml-auto flex items-center">
                                        <div className='w-max bg-green-400 mr-4 px-3 py-2 w-max h-max text-[10px] rounded-md text-white'>
                                            (GET)
                                        </div>
                                        <p onClick={() => {setSelectAPI('Dinas'), setActiveAPI(true)}} className='text-blue-600 md:hidden cursor-pointer active:scale-[0.98] hover:text-blue-800'>
                                            Lihat Respon
                                        </p>    
                                    </div>
                                    <p onClick={() => {setSelectAPI('Dinas'), setActiveAPI(true)}} className='text-blue-600 cursor-pointer md:flex hidden active:scale-[0.98] hover:text-blue-800'>
                                        Lihat Respon
                                    </p>
                                </label>
                                <div className='relative rounded-[10px] bg-blue-200 text-blue-700 w-[100%] p-4 flex items-center my-6'>
                                    <code className='w-[86%] overflow-hidden overflow-ellipsis whitespace-nowrap'>
                                        &#123;&#123;BASE_URL&#125;&#125;/v2/api/dinas
                                    </code>
                                    <div onClick={() => copyToClipboard()} className='absolute right-1 z-[444] scale-[0.9] z-[999] rounded-[10px] shadow-lg w-[50px] h-[50px] bg-blue-500 flex items-center justify-center cursor-pointer hover:brightness-[90%] active:p-2 duration-200 text-white'>
                                        <FaCopy />
                                    </div>
                                </div>
                                <label htmlFor="api-dinas" className='font-[500] md:flex items-center'>
                                    API Data Judul  
                                    <div className="w-max mt-3 md:mt-0 md:ml-auto flex items-center">
                                        <div className='w-max bg-green-400 mr-4 px-3 py-2 w-max h-max text-[10px] rounded-md text-white'>
                                            (GET)
                                        </div>
                                        <p onClick={() => {setSelectAPI('Title'), setActiveAPI(true)}} className='text-blue-600 md:hidden cursor-pointer active:scale-[0.98] hover:text-blue-800'>
                                            Lihat Respon
                                        </p>    
                                    </div>
                                    <p onClick={() => {setSelectAPI('Title'), setActiveAPI(true)}} className='text-blue-600 cursor-pointer md:flex hidden active:scale-[0.98] hover:text-blue-800'>
                                        Lihat Respon
                                    </p>
                                </label>
                                <div className='relative rounded-[10px] bg-blue-200 text-blue-700 w-[100%] p-4 flex items-center my-6'>
                                    <code className='w-[86%] overflow-hidden overflow-ellipsis whitespace-nowrap'>
                                        &#123;&#123;BASE_URL&#125;&#125;/v2/api/title
                                    </code>
                                    <div onClick={() => copyToClipboard2()} className='absolute right-1 z-[444] scale-[0.9] z-[999] rounded-[10px] shadow-lg w-[50px] h-[50px] bg-blue-500 flex items-center justify-center cursor-pointer hover:brightness-[90%] active:p-2 duration-200 text-white'>
                                        <FaCopy />
                                    </div>
                                </div>
                                <div className={`fixed top-0 ${activeAPI ? 'left-[0%]' : 'left-[-100%] duration-300'} ease-in-out duration-300 w-max rounded-tr-[20px] shadow-lg h-screen z-[99999999] bg-white text-blue-700 flex items-center justify-center`}>
                                <div className='relative w-full h-screen overflow-y-auto pb-10 rounded-[12px]'>
                                    <code>
                                        <div className='relative mx-auto mt-8 w-[88%] flex items-center'>
                                            <div className='w-max bg-slate-400 px-5 py-2 w-max h-max ml-2 text-[14px] rounded-lg text-white'>{selectAPI ?? ''}</div>
                                            <div className='w-max bg-blue-500 px-5 py-2 w-max h-max ml-2 text-[14px] rounded-lg text-white'>Response</div>
                                            <div className='w-max bg-green-500 px-5 py-2 w-max h-max ml-2 text-[14px] rounded-lg text-white'>200</div>
                                            <div onClick={() => setActiveAPI(false)} className='ml-auto bg-red-500 flex items-center justify-center cursor-pointer hover:brightness-[90%] active:scale-[0.98] w-[40px] h-[40px] ml-2 text-[14px] rounded-lg text-white'><FaTimes /></div>
                                        </div>
                                        <div className='w-[42vw] mx-auto pt-10'>
                                            <pre className='w-max mx-auto p-6 rounded-[20px] border border-blue-200 h-max'>
                                                {
                                                    selectAPI === 'Dinas' ? (
                                                        JSON.stringify(yourJsonObjectDinas, null, 2)
                                                    ): selectAPI === 'Kecamatan' ? (
                                                        JSON.stringify(yourJsonObjectKecamatan, null, 2)
                                                    ):
                                                        JSON.stringify(yourJsonObject, null, 2)
                                                }
                                            </pre>
                                        </div>
                                    </code>
                                </div>
                                </div>
                            </div>
                            <div className='relative w-1/2 h-[500px] hidden md:flex flex-col justify-center items-center overflow-hidden'>
                                <img src={APIImage} alt="ilustration developer" title='Image by freepik' className='w-[100%] right-[-30px] top-2 relative' />
                            </div>
                        </div>
                    </section>
                    
                    <section id="masukan" className='w-screen h-max bg-[#fbffff] flex flex-col items-center pt-10 md:pt-20 md:px-16 pb-6'>
                        <div className='w-full text-center h-max py-2 md:mb-0 mb-8'>
                            <h2 className='text-[26px] md:text-[36px] font-normal'>Masukan Untuk Kami 📮</h2>
                            <p className='text-slate-500 w-full md:w-[70%] mx-auto md:flex hidden leading-loose mt-2 mb-10'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex saepe atque perferendis voluptate accusamus possimus? Atque aperiam aut provident iusto, similique iste fugit nisi qui..</p>
                        </div>
                        
                        <div className="w-[90vw]">
                            <FormGroup type="response" />
                        </div>
                        
                    </section>

                    <footer id="footer" className='relative overflow-hidden w-screen mx-auto pb-12 p-6 md:p-12 mt-12 h-max bg-blue-800 border-y-[3px] border-dashed border-blue-300'>
                        <img src={Square} alt="square" loading="lazy" className='absolute opacity-[1] w-[40%] right-[5%] bottom-[0px]' />
                        <div className='w-full h-full md:flex items-center'>
                            <div className='text-white h-full w-full md:w-[50%]'>
                                <div className='bg-white rounded-[10px] w-[80%] md:w-max'>
                                    <img src={Diskominfo} alt="diskominfo-logo" className='w-[55%] my-6' />
                                </div>
                                <p className='text-[14px] w-full md:w-[70%] leading-loose'>Jl. Sunan Drajat No.15, Sumber, Kec. Sumber, Kabupaten Cirebon, Jawa Barat 45611</p>
                            </div>
                            <ul className='text-white w-full md:w-[25%] h-full md:border-0 md:pt-0 pt-6 border-t border-t-white flex md:mt-0 mt-12 flex-col justify-between'>
                                <li className='mb-4 md:mb-12 cursor-pointer active:scale-[0.99] relative rounded-full w-max hover:px-3 py-2 cursor-pointer hover:bg-blue-300 hover:text-blue-700 duration-200'>Geoportal</li>
                                <li className='mb-4 md:mb-12 cursor-pointer active:scale-[0.99] relative rounded-full w-max hover:px-3 py-2 cursor-pointer hover:bg-blue-300 hover:text-blue-700 duration-200'>Open Data</li>
                                <li className='mb-4 md:mb-0 cursor-pointer active:scale-[0.99] relative rounded-full w-max hover:px-3 py-2 cursor-pointer hover:bg-blue-300 hover:text-blue-700 duration-200'>Satu Data</li>
                            </ul>
                            <ul className='text-white w-full md:w-[25%] h-full flex md:mt-0 mt-4 flex-col justify-between'>
                                <li className='mb-4 md:mb-12 cursor-pointer active:scale-[0.99] relative rounded-full w-max hover:px-3 py-2 cursor-pointer hover:bg-blue-300 hover:text-blue-700 duration-200'>Diskominfo Cirebon</li>
                                <li className='mb-4 md:mb-12 cursor-pointer active:scale-[0.99] relative rounded-full w-max hover:px-3 py-2 cursor-pointer hover:bg-blue-300 hover:text-blue-700 duration-200'>Berita Cirebon</li>
                                <li className='mb-4 md:mb-0 cursor-pointer active:scale-[0.99] relative rounded-full w-max hover:px-3 py-2 cursor-pointer hover:bg-blue-300 hover:text-blue-700 duration-200'>Google Map</li>
                            </ul>
                        </div>
                    </footer>
                </>
            }
        </div>

    </div>
  )
}

export default Homepage