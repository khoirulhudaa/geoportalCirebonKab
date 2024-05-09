import domtoimage from 'dom-to-image'; // Jika menggunakan dom-to-image
import { saveAs } from 'file-saver';
import L, { icon } from 'leaflet';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from 'react-dom/server';
import { FaArrowRight, FaBuilding, FaCamera, FaCameraRetro, FaChevronDown, FaCompress, FaExpand, FaEye, FaEyeSlash, FaFileExport, FaGoogle, FaGripLines, FaIcons, FaLayerGroup, FaMapMarkerAlt, FaPlus, FaRulerCombined, FaTextHeight, FaTimes, FaTrashAlt, FaVectorSquare } from 'react-icons/fa';
import { GeoJSON, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, Tooltip, useMapEvent } from "react-leaflet";
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import geoJsonKecamatan from '../GeoJson/desa.json';
import geoJsonDataPantai from '../GeoJson/garisPantai.json';
import geoJsonData from '../GeoJson/kecamatan.json';
import geoJsonDataSungai from '../GeoJson/sungai.json';
import { mapProps } from '../Models/componentInterface';
import { getCoordinate } from '../Store/coordinateSlice';
import kabupatenCirebonBoundary from '../file/cirebon';
import PopupUploadFile from './PopupUploadFile';

const Map: React.FC<mapProps> = ({
  data, 
  handleHeight, 
  height, 
  handleShowAll,
  showAll,
  dataSubdistrict,
  color,
  customData,
  searchLocation,
  listGeoData
}) => {

  const dispatch = useDispatch()
  
  const [searchData, setSearchData] = useState<string>('')
  const [activeDesa, setActiveDesa] = useState<boolean>(false)
  const [activePantai, setActivePantai] = useState<boolean>(false)
  const [activeSungai, setActiveSungai] = useState<boolean>(false)
  const [activeMenuBatas, setActiveMenuBatas] = useState<boolean>(false)
  const [lines, setLines] = useState<any>([]);
  const [excelData, setExcelData] = useState<any>([]);
  const [nameFile, setNameFile] = useState<string>('')
  const [activeLineSub, setActiveLineSub] = useState<boolean>(false)
  const [activeLineMarker, setActiveLineMarker] = useState<boolean>(false)
  const [activeArea, setActiveArea] = useState<boolean>(false)
  const [activeUploadExcel, setActiveUploadExcel] = useState<boolean>(false)
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [lineMarkers, setLineMarkers] = useState<any>(null);
  const [center] = useState<any>([-6.7320, 108.5525]);
  const [zoom] = useState(12);
  const [selectIcon, setSelectIcon] = useState<string>('')
  const [activeMenuIcon, setActieMenuIcon] = useState<boolean>(false)
  const [subdistrictDots, setSubdistrictDots] = useState<boolean>(false)
  const [coordinates, setCoordinates] = useState<any[]>([])
  const [activeClick] = useState<boolean>(false)
  const [activeClick2, setActiveClick2] = useState<any>(null)
  const [selectColor, setSelectColor] = useState<any>(null)
  const [status, setStatus] = useState<boolean>(false)
  const [activeLayer, setActiveLayer] = useState<boolean>(false)
  const [activeKecamatan, setActiveKecamatan] = useState<boolean>(false)
  const [activeRange, setActiveRange] = useState<boolean>(false);
  const [listLayer, setListLayer] = useState<any>([])
  const [listID, setListID] = useState<any[]>([])
  const [startPoint, setStartPoint] = useState<any>(null);
  const [endPoint, setEndPoint] = useState<any>(null);
  const [startPointPoly, setStartPointPoly] = useState<any>(null);
  const [endPointPoly, setEndPointPoly] = useState<any>(null);
  const [unit, setUnit] = useState<string>('kilometer');
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [activeRangeCustomIcon, setActiveRangeCustomIcon] = useState<boolean>(false);
  const [selectCoordinateID, setSelectCoordinateID] = useState<any>(null);
  const [activeDetailMarker, setActiveDetailMarker] = useState<boolean>(false);

  const coorNew = useSelector((state: any) => state.Coordinate?.coordinate)
  
  const onEachFeature = (feature: any, layer: any) => {
    console.log('feature', feature)
    if (feature?.properties && (feature?.properties?.NAMOBJ || feature?.properties?.namobj)) {
      layer.bindTooltip(feature?.properties?.NAMOBJ ?? feature?.properties?.namobj);
    }
  };

  const geoJsonStyle = {
    color: '#87A922',
  };

  const geoJsonStylePantai = {
    color: '#008DDA',
  };

  const geoJsonStyleSungai = {
    color: '#41C9E2',
  };

  const geoJsonStyleKecamatan = {
    color: '#FBC740',
  };

  const geoJsonData1: any = geoJsonData;
  const geoJsonData2: any = geoJsonDataPantai;
  const geoJsonData3: any = geoJsonDataSungai;
  const geoJsonData4: any = geoJsonKecamatan;

  useEffect(() => {
    setCoordinates(coorNew)
    if(activeClick) {
      changeColor(color)
    }
    setStatus(false)
  }, [coordinates.length, coorNew.length, status, color, selectColor])

  const changeColor = (newColor: any) => {
    setSelectColor(newColor);
    setActiveClick2(false)
    setTimeout(() => {
      setActiveClick2(true)
    }, 100)
  };

  const circleCoordinates = (centerLat: number, centerLong: number, radiusInKm: number) => {
    const numPoints =  100; // Number of points along the circle
    const radiusInRadians = radiusInKm /  6371; // Earth's average radius in km
    let angleStep =  2 * Math.PI / numPoints;
    let coordinates = [];
  
    for (let i =  0; i <= numPoints; i++) {
      let angle = i * angleStep;
      let dx = radiusInRadians * Math.cos(angle);
      let dy = radiusInRadians * Math.sin(angle);
      let newLong = centerLong + (dx * (180 / Math.PI));
      let newLat = centerLat + (dy * (180 / Math.PI));
      coordinates.push([newLat, newLong]);
    }
  
    return coordinates;
  };

  // Blok area koordinat (bgcolor dan border)
  const areas = (excelData.length > 0 ? excelData : (subdistrictDots && dataSubdistrict.length > 0 ? dataSubdistrict : data?.[0]?.coordinate)).map((marker: any) => {
    const lat = parseFloat(marker.lat);
    const long = parseFloat(marker.long);
    return {
      name: marker.name_location,
      condition: marker.condition ?? '',
      coordinates: circleCoordinates(lat, long, 0.3)
    };
  });

  useEffect(() => {
    const linesData = [...kabupatenCirebonBoundary.map((marker: any) => [marker[0], marker[1]]), [kabupatenCirebonBoundary[0][0], kabupatenCirebonBoundary[0][1]]];
    setLines(linesData);
    const linesDataMarker = [
    
      ...(excelData.length > 0 ? excelData : 
        (subdistrictDots ? dataSubdistrict : 
        data?.[0]?.coordinate)).map((marker: any) => 
        [parseFloat(marker.lat), parseFloat(marker.long)]), 
        [excelData.length > 0 ? excelData?.[0]?.lat : (subdistrictDots ? parseFloat(dataSubdistrict[0]?.lat) : parseFloat(data?.[0]?.coordinate[0]?.lat)), 
        excelData.length > 0 ? excelData?.[0]?.long : (subdistrictDots ? parseFloat(dataSubdistrict[0]?.long) : parseFloat(data?.[0]?.coordinate[0]?.long))
    ]];

    setLineMarkers(linesDataMarker);
    setStatus(false)

  }, [kabupatenCirebonBoundary?.length, status, data?.[0]?.coordinate.length, excelData?.length, nameFile, subdistrictDots]);

  const MapEventsHandler = () => {
    if(activeClick) {
      useMapEvent('click', (value: any) => {
        const data = [
          value?.latlng?.lat,
          value?.latlng?.lng
        ]
        dispatch(getCoordinate(data))
        setCoordinates((prev: any) => [...prev, data])
      })
    }
    useMapEvent('moveend', (event: any) => {
      const map = event.target;
      const center = map.getCenter(); 
      setCurrentPosition([center.lat, center.lng]); 
    });

    return null;
  }

  const exportToGeoJSON = () => {
    const geoJSON = {
      type: 'FeatureCollection',
      features: (excelData.length > 0 ? excelData : data?.[0]?.coordinate).map((point: any, index: number) => ({
        type: 'Feature',
        properties: { id: index + 1 },
        geometry: {
          type: 'Point',
          coordinates: [point.long, point.lat]
        }
    }))
  };

    // Ubah objek GeoJSON menjadi string
  const geoJSONString = JSON.stringify(geoJSON, null, 2);

    // Buat blob dari string GeoJSON
    const geoJSONBlob = new Blob([geoJSONString], { type: 'application/json' });

    // Simpan sebagai file GeoJSON menggunakan FileSaver.js
    saveAs(geoJSONBlob, 'geospasial.geojson');
  };

  const CustomIcon = ({number}: {number: number}) => (
    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
      <span className="text-white">{number}</span>
    </div>
  );

  const createCustomIcon = (index: number) => {
    return L.divIcon({
      html: ReactDOMServer.renderToString(<CustomIcon number={index} />),
      iconSize: [30,  30], 
      className: '', 
    });
  };

  const myIcon = L.divIcon({
    className: 'my-div-icon',
    html: `<p style="font-size:  26px;">${subdistrictDots ? '🏤' : selectIcon}</p>`, 
    iconAnchor: [10,  25],
  });

  const defaultIcon = icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
  });

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    setNameFile(file.name)
    const reader = new FileReader();
    
    reader.onload = (event: any) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const data: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const findFieldIndex = (fieldOptions: string[]) => {
        for (let i = 0; i < data?.[0].length; i++) {
          const field = data?.[0][i].toLowerCase();
          if (fieldOptions.some(option => field.includes(option.toLowerCase()))) {
            return i;
          }
        }
        return -1; 
      };
      
      // Mengonversi data Excel menjadi array of objects dengan property name_location, lat, dan long
      const nameIndex = findFieldIndex(["Nama lokasi", "nama lokasi", "lokasi", "Daftar data", 'daftar data", "nama", "Daftar Data", "Nama data', "Data", "Nama lokasi", "nama lokasi", "DAFTAR DATA", "NAMA DATA", "Daftar_data", "Nama _lokasi"]);
      const latIndex = findFieldIndex(["Latitude", "latitude", "lat", "Lat", "LAT", "LATITUDE"]);
      const longIndex = findFieldIndex(["Longitude", "longitude", "long", "Long", "lng", "LONG", "LONGITUDE", "Longitudinal", "LONGITUDINAL"]);

      // Mengambil data sesuai dengan indeks yang telah ditemukan
      const convertedData: any = data.slice(1).map((row: any) => ({
        name_location: nameIndex !== -1 ? row[nameIndex] : '',
        lat: latIndex !== -1 ? row[latIndex] : '',
        long: longIndex !== -1 ? row[longIndex] : ''
      })).filter((obj: any) => obj.name_location !== '' && obj.lat !== '' && obj.long !== '' && obj.name_location !== undefined && obj.lat !== undefined && obj.long !== undefined);

      // Menyimpan data yang sudah dikonversi
      setExcelData(convertedData);
      setActiveUploadExcel(!activeUploadExcel)
    };

    reader.readAsBinaryString(file);
  };

  const captureRef = useRef<any>(null);
  const downloadImage = () => {
    const node = captureRef.current;
    if (node) {
      domtoimage.toPng(node)
        .then((dataUrl: any) => {
          const link = document.createElement('a');
          link.download = 'map.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Oops, something went wrong!', error);
        });
    }
  };

  const filteredData = excelData.length > 0 ? excelData : (showAll ? data?.flatMap(entry => entry.coordinate) : ((data && data.length > 0) ? data[0]?.coordinate : []));

  const checkForDisaster = (conditions: any[]) => {
    for (let i = 0; i < conditions?.length; i++) {
      if (conditions[i].label === "Rawan bencana") {
        return true;
      }
    }
    return false; 
  }

  const randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

  const handleAddLayer = (e: any) => {
    const { title_id, coordinate } = e;
    const newList = coordinate.map((item: any) => ({
      ...item,
      color: randomColor // Gunakan warna acak yang disimpan
    }));
    setListLayer((prevState: any) => ({
      ...prevState,
      coordinate: Array.isArray(prevState.coordinate) ? [...prevState.coordinate, ...newList] : [...newList]
    }));
    setListID((prevIDs: any) => [...prevIDs, title_id]);
  };

  const handleDeleteByTitleId = (titleIdToDelete: string) => {
    setListLayer((prevState: any) => ({
      ...prevState,
      coordinate: prevState.coordinate.filter((coord: any) => coord.title_id !== titleIdToDelete)
    }));
  };

  const formatDistance = (distance: any) => {
    if (unit === 'kilometer') {
      return (distance / 1000).toFixed(2);
    } else {
      return (Math.round(distance));
    }
  };

  useEffect(() => {
    if (startPoint !== null && endPoint !== null) {
      setActiveRangeCustomIcon(true);
      setStartPointPoly([filteredData[startPoint].lat, filteredData[startPoint].long]);
      setEndPointPoly([filteredData[endPoint].lat, filteredData[endPoint].long]);

      console.log('startPOintPOly', [filteredData[startPoint].lat, filteredData[startPoint].long])
      console.log('endPOintPOly', [filteredData[endPoint].lat, filteredData[endPoint].long])
    }
  }, [startPoint, endPoint]);

  const calculateDistance = () => {
    if (startPoint && endPoint && unit) {
      let point1 = L.latLng([filteredData[startPoint].lat, filteredData[startPoint].long]);
      let point2 = L.latLng([filteredData[endPoint].lat, filteredData[endPoint].long]);
      
      let distance = point1.distanceTo(point2);
      
      return formatDistance(distance);
    }
  };

  return (
    <>
      <div className='relative w-full h-full'>

      {
        activeDetailMarker ? (
          <div className='fixed left-0 top-0 flex w-[100vw] h-screen overflow-y-auto bg-white shadow-lg p-6 z-[99999999999]'>
            <div className='w-[30%] pr-6 bg-white h-full'>
              <h2 className='font-bold text-[24px]'>Gambar Lokasi</h2>
              <p className='border-b text-[12px] border-b-slate-300 pb-[26px] w-full'>Referensi dari google map</p>
              {
                selectCoordinateID?.thumbnail ? (
                  <div className='w-full mt-[20.8px] h-[240px] rounded-[10px] p-2 border border-slate-300 overflow-hidden'>
                    <img src={selectCoordinateID?.thumbnail} alt={selectCoordinateID?.name_location} className='object-cover rounded-[10px] cursor-pointer duration-500 w-full h-full' />
                  </div>
                ):
                  <div className='w-full flex flex-col text-center items-center justify-center mt-[20.8px] h-[240px] rounded-[10px] p-2 border border-slate-300 overflow-hidden'>
                    <FaCamera className='text-[70px] mb-3 text-slate-300' />
                    <small className='text-slate-400'>Tidak ada gambar</small>
                  </div>
              }
              <a href={selectCoordinateID?.link} target='__blank'>
                <p className='text-blue-600 mt-4 flex items-center cursor-pointer underline'>Lihat di google map <FaArrowRight className='ml-2' /></p>
              </a>
            </div>
            <div className='w-[70%] border-l border-l-slate-300 px-6 h-max'>
              <div onClick={() => setActiveDetailMarker(false)} className='absolute right-6 w-[50px] h-[50px] bg-red-500 text-white cursor-pointer hover:brightness-[90%] active:scale-[0.98] p-2 flex items-center justify-center shadow-md ml-auto rounded-[6px]'>
                <FaTimes />
              </div>
              <h2 className='font-bold text-[24px]'>Detail Data</h2>
              <small>Menampilkan sumber data yang terperinci</small>
              <div className='w-[100%] pb-5 border-b border-b-slate-300'></div>
              <div className='w-full flex flex-wrap justify-between h-max'>
                <p className='mb-4 h-max w-[50%] pb-2 pt-4 border-b border-b-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>NAMOBJ <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Nama lokasi)</span></div> 
                  <br />
                  {!selectCoordinateID?.name_location || selectCoordinateID?.name_location === '-' ? '-' : selectCoordinateID?.name_location}
                </p>
                <p className='mb-4 h-max w-[50%] pb-2 pt-4 border-l border-l-slate-300 pl-4 border-b border-b-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>FCODE <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Kode Unsur - KUGI)</span></div> 
                  <br />
                  {!selectCoordinateID?.code || selectCoordinateID?.code === '-' ? '-' : selectCoordinateID?.code}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>LAT <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Latitude)</span></div> 
                  <br />
                  {!selectCoordinateID?.lat || selectCoordinateID?.lat === '-' ? '-' : selectCoordinateID?.lat}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-l border-l-slate-300 pl-4 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>LONG <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Longitude)</span></div> 
                  <br />
                  {!selectCoordinateID?.long || selectCoordinateID?.long === '-' ? '-' : selectCoordinateID?.long}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>WADMKC <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Nama Kecamatan)</span></div> 
                  <br />
                  {!selectCoordinateID?.subdistrict || selectCoordinateID?.subdistrict === '-' ? '-' : selectCoordinateID?.subdistrict}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-l border-l-slate-300 pl-4 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>REMARK <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Tanda)</span></div> 
                  <br />
                  {!selectCoordinateID?.remark || selectCoordinateID?.remark === '-' ? '-' : selectCoordinateID?.remark}
                </p>
                <div className='mb-4 h-max w-[50%] py-2 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>SRS_ID <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Skala)</span></div> 
                  <br />
                  {!selectCoordinateID?.scale || selectCoordinateID?.scale === '-' ? '-' : selectCoordinateID?.scale}
                </div>
                <p className='mb-4 h-max w-[50%] py-2 border-l border-l-slate-300 pl-4 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>ADMIN <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Kode PUM)</span></div> 
                  <br />
                  {!selectCoordinateID?.pum || selectCoordinateID?.pum === '-' ? '-' : selectCoordinateID?.pum}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>WADMPR <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Nama Provinsi)</span></div> 
                  <br />
                  {!selectCoordinateID?.province || selectCoordinateID?.province === '-' ? '-' : selectCoordinateID?.province}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-l border-l-slate-300 pl-4 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>WIADPR <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Kode Provinsi)</span></div> 
                  <br />
                  {!selectCoordinateID?.provinceCode || selectCoordinateID?.provinceCode === '-' ? '-' : selectCoordinateID?.provinceCode}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>WADMKK <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Jenis Wilayah)</span></div> 
                  <br />
                  {!selectCoordinateID?.typeArea || selectCoordinateID?.typeArea === '-' ? '-' : selectCoordinateID?.typeArea}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-l border-l-slate-300 pl-4 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>WADMKD <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Nama Desa)</span></div> 
                  <br />
                  {!selectCoordinateID?.ward || selectCoordinateID?.ward === '-' ? '-' : selectCoordinateID?.ward}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>WIADKK <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Kode Kabupaten)</span></div> 
                  <br />
                  {!selectCoordinateID?.typeAreCode || selectCoordinateID?.typeAreCode === '-' ? '-' : selectCoordinateID?.typeAreCode}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-l border-l-slate-300 pl-4 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>WIADKC <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Kode Kecamatan)</span></div> 
                  <br />
                  {!selectCoordinateID?.subdstrictCode || selectCoordinateID?.subdstrictCode === '-' ? '-' : selectCoordinateID?.subdstrictCode}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>WIADKD <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Kode Desa)</span></div> 
                  <br />
                  {!selectCoordinateID?.wardCode || selectCoordinateID?.wardCode === '-' ? '-' : selectCoordinateID?.wardCode}
                </p>
                <p className='mb-4 h-max w-[50%] py-2 border-l border-l-slate-300 pl-4 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>LUAS <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Luas Wilayah)</span></div> 
                  <br />
                  {!selectCoordinateID?.wide || selectCoordinateID?.wide === '-' ? '-' : selectCoordinateID?.wide}
                </p>
                <p className='mb-4 h-max w-full py-2 border-y border-y-slate-300 pb-4'>
                  <div className='font-bold flex items-center w-full'>METADATA <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Sumber Data)</span></div> 
                  <br />
                  {!selectCoordinateID?.source || selectCoordinateID?.source === '-' ? '-' : selectCoordinateID?.source}
                </p>
                <p className='h-max w-full pb-4'>
                  <div className='font-bold flex items-center w-full'>ADDRESS <span className='ml-2 text-[12px] text-slate-500 font-normal'>(Alamat)</span></div> 
                  <br />
                  {!selectCoordinateID?.address || selectCoordinateID?.address === '-' ? '-' : selectCoordinateID?.address}
                </p>
              </div>
            </div>
          </div>
        ):
          null
      }
      
      {
        activeUploadExcel ? (
          <PopupUploadFile onChange={(e: any) => handleFileUpload(e)} />
        ):
          null
      }

      <div className={`absolute z-[3333] w-full md:w-[42vw] h-screen ${activeLayer ? 'left-[0%]' : 'left-[-100%] duration-300'} top-[0px] bg-white shadow-lg rounded-[12px] p-2 md:p-4 duration-200`}>
        <div className='w-full px-3 flex items-center justify-between'>
          <input name="searchData" value={searchData} onChange={(e: any) => setSearchData(e.target.value)} type="text" className="w-[85%] rounded-[10px] bg-white my-2 px-3 py-3 text-slate-600 outline-0 border border-slate-300 text-[13px]" placeholder="Cari judul data..." />
          <div onClick={() => setActiveLayer(false)} className='rounded-full md:rounded-[8px] md:text-[16px] text-[12px] md:p-0 p-2 md:w-[46px] md:h-[46px] bg-red-500 ml-2 flex items-center justify-center text-white cursor-pointer hover:brightness-[90%] active:scale-[0.98]'>
            <FaTimes />
          </div>
        </div>

          <div className='w-full h-full pb-12 pt-3 overflow-y-auto'>
            {
              listGeoData && listGeoData?.length > 0 ? (
                listGeoData
                ?.filter((data: any) => {
                  if(searchData !== '') {
                    return (data?.title.toLowerCase()).includes(searchData.toLowerCase())
                  }
                  return true
                })
                ?.map((data: any, index: number) => {
                const isAdded = listID.includes(data?.title_id);
                return (
                  <div key={index} className='w-full flex items-center justify-between px-3 mb-4 py-2'>
                    <div className='w-[80%] h-[30px] rounded-full flex items-center p-2'>
                      <FaMapMarkerAlt />
                      <p className='ml-3 overflow-hidden w-full md:w-[90%] overflow-ellipsis whitespace-nowrap'>{data?.title}</p>
                    </div>
                    <div onClick={() => {
                      if(isAdded) {
                        setListID((prevIDs: any) => prevIDs.filter((id: string) => id !== data?.title_id));
                        handleDeleteByTitleId(data?.title_id)
                      } else {
                        handleAddLayer(data)
                      }
                    }} 
                    className={`w-[10%] rounded-[4px] ${isAdded ? 'bg-red-500' : 'bg-blue-500'} flex justify-center text-white px-2 py-2 text-[12px] cursor-pointer active:scale-[0.98] hover:brightness-[90%]`}>
                      {
                        isAdded ? (
                          <FaTrashAlt />
                        ):
                          <FaPlus />
                      }
                    </div>
                  </div>
                )})
              ):
                null
            }
          </div>
      </div>
     
      <div className={`absolute z-[3333] w-[31vw] h-screen ${activeRange ? 'left-[0%]' : 'left-[-100%] duration-300'} top-[0px] bg-white shadow-lg rounded-[12px] p-4 duration-200`}>
        <div className='w-full px-3 flex items-center justify-between'>
          <h2 className='text-[16px] relative top-1'>Jarak Antar Titik</h2>
          <div onClick={() => {setActiveRange(false), setActiveRangeCustomIcon(false)}} className='rounded-[8px] w-[46px] h-[46px] bg-red-500 ml-2 flex items-center justify-center text-white cursor-pointer hover:brightness-[90%] active:scale-[0.98]'>
            <FaTimes />
          </div>
        </div>

        <hr className='mt-5 w-[92%] mx-auto' />

          <div className='w-full h-full pb-12 pt-6 px-2 overflow-y-auto'>
            <div className='w-full h-max bg-white border pr-3 border-slate--200 rounded-[12px]'>
              <select name="startPoint" onChange={(e: any) => setStartPoint(e.target.value)} id="startPoint" className='w-full outline-0 border-0 p-4 bg-transparent rounded-[12px]'>
                <option value="">Pilih Koordinat Awal</option>
                {
                  filteredData && filteredData?.length > 0 ? (
                    filteredData?.map((data: any, index: number) => (
                      <option key={index} value={index}>{data?.name_location}</option>
                    ))
                  ):
                    <option value="">Data tidak ada!</option>
                }
              </select>
            </div>

            <div className='w-full h-max bg-white border  mt-5 pr-3 border-slate--200 rounded-[12px]'>
              <select name="endPoint" onChange={(e: any) => setEndPoint(e.target.value)} id="endPoint" className='w-full outline-0 border-0 p-4 bg-transparent rounded-[12px]'>
              <option value="">Pilih Koordinat Akhir</option>
              {
                  filteredData && filteredData?.length > 0 ? (
                    filteredData?.map((data: any, index: number) => (
                      <option key={index} value={index}>{data?.name_location}</option>
                    ))
                  ):
                    <option value="">Data tidak ada!</option>
                }
              </select>
            </div>

            <div className='w-full h-max bg-white border  mt-5 pr-3 border-slate--200 rounded-[12px]'>
              <select name="unit" onChange={(e: any) => setUnit(e.target.value)} id="unit" className='w-full outline-0 border-0 p-4 bg-transparent rounded-[12px]'>
                <option key={1} value="">Pilih Satuan Jarak</option>
                <option key={3} value='kilometer'>kilometer</option>
                <option key={2} value='meter'>meter</option>
              </select>
            </div>

            <div className='w-full bg-white flex justify-center items-center h-max border mt-7 p-5 border-[2px] border-dashed border-blue-500 text-blue-600 text-center border-slate--200 rounded-[12px]'>
              <p>{calculateDistance() ?? 0}</p><p className='ml-2'><b>{unit}</b></p>             
            </div>
          </div>
      </div>

        {/* Tombol tambah koordinat dan pengaturan */}
        <div className="w-max z-[444] flex items-center h-[68px] py-[14px] pl-4 rounded-bl-[32px] absolute top-0 right-2">
          <div className={`w-max ${activeClick ? 'hidden' : 'flex'} items-center top-4 mr-3`}>
            <div title='FullScreen' onClick={() => setFullScreen(!fullScreen)} className={`${fullScreen ? 'bg-green-200 fixed bottom-6 right-4' : 'bg-white bottom-36 w-[40px] h-[40px]'} mr-4 cursor-pointer hover:bg-green-200 z-[22222223] md:px-2 md:py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700`}>{fullScreen ? <FaCompress /> : <FaExpand />}
            </div>
            <div title='Jarak' onClick={() => setActiveRange(!activeRange)} className={`${activeRange ? 'bg-green-200' : 'bg-white'} mr-4 cursor-pointer hover:bg-green-200 z-[22222] w-max h-max px-4 py-2 hidden md:flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 right-0 top-36`}>Jarak <FaRulerCombined className='ml-3' />
            </div>
            <div title='Multi layar' onClick={() => setActiveLayer(!activeLayer)} className={`${activeLayer ? 'bg-green-200' : 'bg-white'} mr-4 cursor-pointer hover:bg-green-200 z-[22222] w-[45px] h-[45px] md:w-max md:h-max md:px-4 md:py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 right-0 top-36`}><span className='hidden md:flex mr-2'>Layer</span> <FaLayerGroup />
            </div>
            <div title='Kotak area koordinat' onClick={() => subdistrictDots ? null : setActiveArea(!activeArea)} className={`${activeArea ? 'bg-green-200' : 'bg-white'} ${subdistrictDots ? 'cursor-not-allowed bg-red-400 before:absolute before:h-[50px] before:w-[3px] before:rotate-[40deg] before:bg-red-400 text-slate-400' : 'cursor-pointer active:scale-[0.98] hover:bg-green-200'} z-[22222] w-max h-max px-4 py-2 hidden md:flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4 right-4`}>Area titik <FaVectorSquare className="ml-3" /></div>
            <div onClick={() => exportToGeoJSON()} className={`bg-white hover:bg-green-200 cursor-pointer active:scale-[0.98] z-[22222] w-max h-max px-4 ml-4 py-2 hidden md:flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}>GeoJSON <FaFileExport className="ml-3" /></div>
            <div title='Bukan google map' className="hidden md:flex items-center top-4 mr-3">
              <div title='Lihat garis antar koordinat' onClick={() => setActiveLineMarker(!activeLineMarker)} className={`${activeLineMarker ? 'bg-green-200' : 'bg-white'} ml-4 cursor-pointer active:scale-[0.98] hover:bg-green-200 z-[22222] w-[45px] h-[45px] px-2 py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 right-0 top-36`}><FaGripLines /></div>
              <div title='Layar tinggi penuh' onClick={() => handleHeight()} className={`${height ? 'bg-green-200' : 'bg-white'} ml-4 cursor-pointer active:scale-[0.98] hover:bg-green-200 z-[22222] w-[45px] h-[45px] px-2 py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 right-0 top-36`}><FaTextHeight /></div>
            </div>
            <div title='Area perbatasan kabupaten' onClick={() => setActiveMenuBatas(!activeMenuBatas)} className={`${activeMenuBatas ? 'bg-green-200' : 'bg-white'} hover:bg-green-200 cursor-pointer z-[22222] w-max h-max px-4 py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}>Perbatasan <FaChevronDown className={`${activeMenuBatas ? 'rotate-[-180deg]' : 'rotate-[0deg]'} duration-300 text-[14px] ml-3`} />
              <div className={`absolute h-max w-max mr-10 justify-between z-[33] flex flex-col ${activeMenuBatas ? 'bottom-[-230px] opacity-[1] block' : 'bottom-[-160px] hidden opacity-[0]'} duration-100 text-left rounded-[14px] bg-white p-4 shadow-lg`}>
                <div className='w-flex items-center mb-3 h-[30px]'>
                  <input type="checkbox" name='kabupaten' onClick={() => setActiveLineSub(!activeLineSub)} className='mr-2 scale-[1.3] rounded-[10px]' /> Batas Kabupaten
                </div>
                <div className='w-flex items-center mb-3 h-[30px]'>
                  <input type="checkbox" name='kecamatan' onClick={() => setActiveKecamatan(!activeKecamatan)} className='mr-2 scale-[1.3] rounded-[10px]' /> Batas Kecamatan
                </div>
                <div className='w-flex items-center mb-3 h-[30px]'>
                  <input type="checkbox" name='kabupaten' onClick={() => setActiveDesa(!activeDesa)} className='mr-2 scale-[1.3] rounded-[10px]' /> Batas Desa
                </div>
                <div className='w-flex items-center mb-3 h-[30px]'>
                  <input type="checkbox" name='kabupaten' onClick={() => setActivePantai(!activePantai)} className='mr-2 scale-[1.3] rounded-[10px]' /> Garis Pantai
                </div>
                <div className='w-flex items-center h-[30px]'>
                  <input type="checkbox" name='kabupaten' onClick={() => setActiveSungai(!activeSungai)} className='mr-2 scale-[1.3] rounded-[10px]' /> Jalur Sungai
                </div>
              </div>
            </div>

            <div title='Ganti ikon marker' onClick={() => subdistrictDots ? null : setActieMenuIcon(!activeMenuIcon)} className={`overflow-hidden ${activeMenuIcon && !subdistrictDots ? 'bg-green-200' : 'bg-white'} ${subdistrictDots ? 'cursor-not-allowed bg-red-400 before:absolute before:h-[42px] before:w-[3px] before:rotate-[40deg] before:bg-red-400 text-slate-400' : 'cursor-pointer active:scale-[0.98] hover:bg-green-200'} ml-4 z-[22222] w-[45px] h-[45px] px-2 py-2 hidden md:flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 right-0 top-52`}><FaIcons /></div>
            <div className={`w-[45px] absolute top-20 duration-200 ease ${activeMenuIcon && !subdistrictDots ? 'right-3' : 'right-[-55px]'} bg-white  overflow-hidden flex-col h-max border border-slate-700 rounded-full flex lfex-col items-center justify-center`}>
              <div onClick={() => setSelectIcon('🏢')} className='text-center flex justify-center items-center cursor-pointer active:scale-[0.98] hover:bg-green-200 border-b w-full py-5 min-h-[50px] border-slate-700 text-black'>
                <p>🏢</p>
              </div>
              <div onClick={() => setSelectIcon('🏫')} className='text-center flex justify-center items-center cursor-pointer active:scale-[0.98] hover:bg-green-200 border-b w-full py-5 min-h-[50px] border-slate-700 text-black'>
                <p>🏫</p>
              </div>
              <div onClick={() => setSelectIcon('🏭')} className='text-center flex justify-center items-center cursor-pointer active:scale-[0.98] hover:bg-green-200 border-b w-full py-5 min-h-[50px] border-slate-700 text-black'>
                <p>🏭</p>
              </div>
              <div onClick={() => setSelectIcon('')} className='text-center flex justify-center items-center cursor-pointer active:scale-[0.98] hover:bg-green-200 border-b w-full py-5 min-h-[50px] border-slate-700 text-black'>
                <p>📍</p>
              </div>
            </div>

          </div>
        </div>
        <div title='Area perbatasan kabupaten' onClick={() => setActiveLineSub(!activeLineSub)} className={`absolute ${activeLineSub ? 'bg-green-200' : 'bg-white'} hover:bg-green-200 cursor-pointer active:scale-[0.98] z-[22222] w-max h-max px-4 py-2 ${activeClick ? 'flex' : 'hidden'} items-center justify-center text-center rounded-full text-[16px] border border-slate-700 right-4 top-[13px]`}>Batas kabupaten <FaVectorSquare className="ml-3" /></div>
        
        <div className='absolute right-2 pl-5 md:pl-7 bottom-4 w-full flex items-center justify-between'>
          <div className='w-max flex items-center'>
            <div className={`z-[552] ml-0 w-max h-max px-4 py-2 flex items-center justify-center text-center bg-white rounded-full text-[16px] border border-slate-700 bottom-4`}>{ currentPosition?.[0].toFixed(6) + `  |  ` + currentPosition?.[1].toFixed(6) ?? 0 }</div>
          </div>
          <div title='FullScreen' onClick={() => setFullScreen(!fullScreen)} className={`${fullScreen ? 'bg-green-200 fixed bottom-6 right-4 w-[50px] h-[50px]' : 'bg-white bottom-36 w-[40px] h-[40px]'} mr-4 cursor-pointer hover:bg-green-200 z-[22222223] md:px-2 md:py-2 flex md:hidden items-center justify-center text-center rounded-full text-[16px] border border-slate-700 ml-4`}>{fullScreen ? <FaCompress /> : <FaExpand />}
          </div>
          <div className={`w-max ${activeClick ? 'hidden' : 'hidden md:flex'} items-center`}>
            <div title='FullScreen' onClick={() => setFullScreen(!fullScreen)} className={`${fullScreen ? 'bg-white fixed top-3 right-0' : 'hidden'} mr-4 cursor-pointer hover:bg-green-200 z-[22222223] w-[50px] h-[50px] text-[22px] flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700`}>{fullScreen ? <FaCompress /> : <FaExpand />}
            </div>
            <div title='Kantor kecataman' onClick={() => setSubdistrictDots(!subdistrictDots)} className={`${subdistrictDots ? 'bg-green-200' : 'bg-white'} mr-3 hover:bg-green-200 cursor-pointer active:scale-[0.98] z-[22222] w-[40px] h-[40px] py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}><FaBuilding /></div>
            <div title='Lihat semua koordinat' onClick={() => handleShowAll()} className={`${showAll ? 'bg-green-200' : 'bg-white'} mr-3 hover:bg-green-200 cursor-pointer active:scale-[0.98] z-[22222] w-[40px] h-[40px] py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}>{showAll ? <FaEyeSlash /> : <FaEye />}</div>
            <div title='Ambil gambar peta' onClick={() => window.location.href = 'https://www.google.com/maps/place/Cirebon,+Kota+Cirebon,+Jawa+Barat/@-6.7428609,108.5128389,13z/data=!3m1!4b1!4m15!1m8!3m7!1s0x2e6f1d0f69dbc5d5:0x301e8f1fc28ba20!2sKabupaten+Cirebon,+Jawa+Barat!3b1!8m2!3d-6.6898876!4d108.4750846!16zL20vMGdjN3h6!3m5!1s0x2e6ee2649e6e5bbb:0x70a07638a7fe12fe!8m2!3d-6.7320229!4d108.5523164!16s%2Fg%2F11bc5j9s76?entry=ttu'} className={`z-[33333] active:bg-green-200 bg-white mr-3 hover:brightness-[90%] cursor-pointer active:scale-[0.98] z-[22222] w-[40px] h-[40px] py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}><FaGoogle /></div>
            <div title='Ambil gambar peta' onClick={() => downloadImage()} className={`z-[33333] active:bg-green-200 bg-white mr-3 hover:brightness-[90%] cursor-pointer active:scale-[0.98] z-[22222] w-[40px] h-[40px] py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}><FaCameraRetro /></div>
          </div>
        </div>
        <div className={`${fullScreen ? 'fixed top-0 left-0 w-screen h-screen z-[2222222] overflow-hidden' : 'md:h-max h-[440px] w-full'}`} ref={captureRef}>
          <MapContainer 
            className="w-full" 
            center={center} 
            zoom={zoom} 
            scrollWheelZoom={true}  
            attributionControl={true}
            zoomControl={true}
            doubleClickZoom={true}
            dragging={true}
            easeLinearity={0.35}
          >
          <MapEventsHandler />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

          {
            activeDesa ? (
              <GeoJSON data={geoJsonData1} style={geoJsonStyle} onEachFeature={onEachFeature} />
            ):
              null
          }
          {
            activePantai ? (
              <GeoJSON data={geoJsonData2} style={geoJsonStylePantai} onEachFeature={onEachFeature} />
            ):
              null
          }
          {
            activeSungai ? (
              <GeoJSON data={geoJsonData3} style={geoJsonStyleSungai} onEachFeature={onEachFeature} />
            ):
              null
          }
          {
            activeKecamatan ? (
              <GeoJSON data={geoJsonData4} style={geoJsonStyleKecamatan} onEachFeature={onEachFeature} />
            ):
              null
          }

          {
            (subdistrictDots ? dataSubdistrict : filteredData)
            .filter((con: any) => {
              if (searchLocation && searchLocation !== '') {
                return (con.name_location.toLowerCase()).includes(searchLocation.toLowerCase());
              }
              return true;
            })
            .map((marker: any, index: number) => (
                <Marker 
                  key={index} 
                  position={[marker.lat, marker.long]} 
                  icon={selectIcon !== '' ? myIcon : subdistrictDots ? myIcon : defaultIcon}
                  >
                    {
                      subdistrictDots ? (
                        null
                      ):
                      <Popup>
                        <div className='flex flex-col'>
                          <div className='relative overflow-hidden mb-2 rounded-[12px] w-full h-[160px]'>
                            <img src={marker?.thumbnail} onClick={() => {window.location.href = marker?.thumbnail as string, '__blank' }} alt="thumbnail" className='cursor-pointer hover:scale-[1.2] duration-300 hover:brightness-[70%]' />
                          </div>
                          <small className='text-[12px] rounded-[8px] hover:brightness-[90%] duration-200 py-3 mb-4 mt-2 bg-blue-700 text-white text-center' onClick={() => {window.location.href = marker?.link as string, '__blank' }}>Lihat di google map</small>
                          <small className='text-[12px] rounded-[8px] hover:brightness-[90%] duration-200 py-3 mb-4 bg-white border border-slate-400 text-slate-800 text-center' onClick={() => {setActiveDetailMarker(!activeDetailMarker), setSelectCoordinateID(marker)}}>Cek Detail</small>
                          <div className='w-[300px] flex flex-wrap items-center'>
                            {
                              marker.condition && marker.condition.slice(0, 3)
                              .map((con: any, index: number) => (
                                <div className='w-max rounded-full bg-white border border-slate-300 h-[35px] mb-2 px-3 flex items-center'>
                                  <p key={index}>{con.label} {con.icon}</p>
                                  <div className='w-[6px] h-1'></div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        <p className='text-left relative left-[1.6px] mt-[-10px]'>
                          {marker?.name_location}
                        </p>
                        {/* <hr />
                        <p className='text-center mt-[-10px]'>
                          {marker?.address ?? 'Alamat tidak tersedia'}
                        </p> */}
                      </Popup>
                    }
                  <Tooltip sticky>{(subdistrictDots ? marker.name_subdistrict : marker.name_location)}</Tooltip> {/* Label hanya muncul saat hover */}
                </Marker>
            ))
          }

          {
            listLayer && setListID.length > 0 ? (
              listLayer?.coordinate?.filter((con: any) => {
                if (searchLocation && searchLocation !== '') {
                  return (con.name_location.toLowerCase()).includes(searchLocation.toLowerCase());
                }
                return true;
              })
              ?.map((marker: any, index: number) => (
                  <Marker key={index} position={[marker.lat, marker.long]} icon={L.divIcon({ 
                    html: `
                      <div class="w-6 h-6 rounded-full flex justify-center items-center" style="background-color: ${marker.color};">
                      </div>
                    ` 
                  })}>
                      {
                        subdistrictDots ? (
                          null
                        ):
                        <Popup>
                          <div className='flex flex-col'>
                            <div className='relative overflow-hidden mb-2 rounded-[12px] w-full h-[160px]'>
                              <img src={marker?.thumbnail} onClick={() => {window.location.href = marker?.thumbnail as string, '__blank' }} alt="thumbnail" className='cursor-pointer hover:scale-[1.2] duration-300 hover:brightness-[70%]' />
                            </div>
                            <small className='text-[12px] rounded-[8px] hover:brightness-[90%] duration-200 py-3 mb-4 mt-2 bg-blue-700 text-white text-center' onClick={() => {window.location.href = marker?.link as string, '__blank' }}>Lihat di google map</small>
                            <div className='w-[300px] flex flex-wrap items-center'>
                              {
                                marker.condition && marker.condition.slice(0, 3)
                                .map((con: any, index: number) => (
                                  <div className='w-max rounded-full bg-white border border-slate-300 h-[35px] mb-2 px-3 flex items-center'>
                                    <p key={index}>{con.label} {con.icon}</p>
                                    <div className='w-[6px] h-1'></div>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                          <p className='text-center mt-[-10px]'>
                            {marker.name_location}
                          </p>
                          <hr />
                          <p className='text-center mt-[-10px]'>
                            {marker?.address ?? 'Alamat tidak tersedia'}
                          </p>
                        </Popup>
                      }
                    <Tooltip sticky>{(subdistrictDots ? marker.name_subdistrict : marker.name_location)}</Tooltip> {/* Label hanya muncul saat hover */}
                  </Marker>
              ))
            ):
              null
          }

          {
            activeClick ? (
              coordinates?.filter((data: any) => {
                if(searchLocation !== '') {
                  return (data?.name_location.toLowerCase()).includes(searchLocation?.toLowerCase())
                }
                  return true
                })
                .map((data: any, index: number) => (
                <Marker 
                  key={index} 
                  position={[data?.[0], data[1]]} 
                  icon={createCustomIcon(index + 1)}
                  >
                </Marker>
              ))
            ):
              null
          }

            {/* Garis kabupaten perbatasan */}
          {activeLineSub && lines && lines?.length > 1 && (
            <Polygon positions={lines} color="#008ada" />
          )}

          {
            activeClick && activeClick2 && coordinates && coordinates.length > 1 && (
              <Polygon positions={coordinates} color={`${selectColor ? selectColor : '#00eada'}`} />
            )
          }

          {
            customData && customData.length > 0 ? (
              customData?.map((data: any, index: number) => (
                <Polygon key={index} positions={data?.coordinates} color={`${data?.color}`}>
                  <Popup>
                      <div className='flex mb-3 border-b border-slate-300 pb-2 items-center'>
                      <b className='mr-2'>Nama :</b> {data?.name}
                      </div>
                      <div className='flex mb-3 border-b border-slate-300 pb-2 items-center'>
                        <b className='mr-2'>Luas area :</b> {data?.wide ?? 0} {data?.typeWide ?? null}
                      </div>
                      <div className='flex mb-3 border-b border-slate-300 pb-2 items-center'>
                        <b className='mr-2'>Tipe area :</b> {data?.type_area ?? '-'}
                      </div>
                      <div className='flex mb-3 border-b border-slate-300 pb-2 items-center'>
                        <b className='mr-2'>Tipe kerawanan :</b> {data?.type_danger ?? '-'}
                      </div>
                      <div className='flex mb-3 border-b border-slate-300 pb-2 items-center'>
                        <b className='mr-2'>Deskripsi :</b> {data?.description ?? ''} 
                      </div>
                    </Popup>
                </Polygon>
              ))
            ):
              null
          }
            
          {/* Blok area koordinat */}
          {activeArea && areas.map((area: any, index: number) => (
            <Polygon key={index} positions={area.coordinates} color={checkForDisaster(area?.condition) ? "red" : "blue"} fillColor={checkForDisaster(area?.condition) ? "red" : "green"} fillOpacity={0.4}>
              <Tooltip>{area.name}</Tooltip>
            </Polygon>
          ))}

          {/* Garis antar marker */}
          {
            activeLineMarker ? (
              <Polyline positions={lineMarkers} color="#008ada" />
            ):
              null
          }
          {
            activeRangeCustomIcon ? (
              <Polyline positions={[startPointPoly, endPointPoly]} color="black">
                <Tooltip>{calculateDistance()} {unit}</Tooltip>
              </Polyline>
            ):
              null
          }

          </MapContainer>
        </div>

      </div>
    </>
  );
};


export default Map