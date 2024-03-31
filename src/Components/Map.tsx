import domtoimage from 'dom-to-image'; // Jika menggunakan dom-to-image
import { saveAs } from 'file-saver';
import L, { icon } from 'leaflet';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from 'react-dom/server';
import { FaBuilding, FaCameraRetro, FaEye, FaEyeSlash, FaFileExport, FaGoogle, FaGripLines, FaIcons, FaTextHeight, FaVectorSquare } from 'react-icons/fa';
import { MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, Tooltip, useMapEvent } from "react-leaflet";
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
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
}) => {

  const dispatch = useDispatch()
  
  const [lines, setLines] = useState<any>([]);
  const [excelData, setExcelData] = useState<any>([]);
  const [nameFile, setNameFile] = useState<string>('')
  // const [searchLocation, setSearchLocation] = useState<string>('')
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

  const coorNew = useSelector((state: any) => state.Coordinate?.coordinate)
  
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
      console.log('new data from excel:', convertedData)
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
        console.log(i) 
        return true;
      }
    }
    return false; 
  }

  return (
    <>
      <div className='relative w-full h-full'>
        
        {
          activeUploadExcel ? (
            <PopupUploadFile onChange={(e: any) => handleFileUpload(e)} />
          ):
            null
        }

        {/* Tombol tambah koordinat dan pengaturan */}
        <div className="w-max z-[444] flex items-center h-[68px] py-[14px] pl-4 rounded-bl-[32px] absolute top-0 right-2">
          <div className={`w-max ${activeClick ? 'hidden' : 'flex'} items-center top-4 mr-3`}>
            {/* <input type="text" name='searchLocation' value={searchLocation} onChange={(e: any) => setSearchLocation(e.target.value)} className='outline-0 border border-black rounded-full h-[42px] px-4 text-[14px] text-black mr-4' placeholder='Cari nama lokasi' /> */}
            <div title='Kotak area koordinat' onClick={() => subdistrictDots ? null : setActiveArea(!activeArea)} className={`${activeArea ? 'bg-green-200' : 'bg-white'} ${subdistrictDots ? 'cursor-not-allowed bg-red-400 before:absolute before:h-[50px] before:w-[3px] before:rotate-[40deg] before:bg-red-400 text-slate-400' : 'cursor-pointer active:scale-[0.98] hover:bg-green-200'} z-[22222] w-max h-max px-4 py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4 right-4`}>Area titik <FaVectorSquare className="ml-3" /></div>
            <div onClick={() => exportToGeoJSON()} className={`bg-white hover:bg-green-200 cursor-pointer active:scale-[0.98] z-[22222] w-max h-max px-4 ml-4 py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}>GeoJSON <FaFileExport className="ml-3" /></div>
            <div title='Bukan google map' className="flex items-center top-4 mr-3">
              <div title='Lihat garis antar koordinat' onClick={() => setActiveLineMarker(!activeLineMarker)} className={`${activeLineMarker ? 'bg-green-200' : 'bg-white'} ml-4 cursor-pointer active:scale-[0.98] hover:bg-green-200 z-[22222] w-[45px] h-[45px] px-2 py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 right-0 top-36`}><FaGripLines /></div>
              <div title='Layar tinggi penuh' onClick={() => handleHeight()} className={`${height ? 'bg-green-200' : 'bg-white'} ml-4 cursor-pointer active:scale-[0.98] hover:bg-green-200 z-[22222] w-[45px] h-[45px] px-2 py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 right-0 top-36`}><FaTextHeight /></div>
            </div>
            <div title='Area perbatasan kabupaten' onClick={() => setActiveLineSub(!activeLineSub)} className={`${activeLineSub ? 'bg-green-200' : 'bg-white'} hover:bg-green-200 cursor-pointer active:scale-[0.98] z-[22222] w-max h-max px-4 py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}>Batas kabupaten <FaVectorSquare className="ml-3" /></div>
            <div title='Ganti ikon marker' onClick={() => subdistrictDots ? null : setActieMenuIcon(!activeMenuIcon)} className={`overflow-hidden ${activeMenuIcon && !subdistrictDots ? 'bg-green-200' : 'bg-white'} ${subdistrictDots ? 'cursor-not-allowed bg-red-400 before:absolute before:h-[42px] before:w-[3px] before:rotate-[40deg] before:bg-red-400 text-slate-400' : 'cursor-pointer active:scale-[0.98] hover:bg-green-200'} ml-4 z-[22222] w-[45px] h-[45px] px-2 py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 right-0 top-52`}><FaIcons /></div>
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
        
        <div className='absolute right-2 pl-7 bottom-4 w-full flex items-center justify-between'>
          <div className='w-max flex items-center'>
            <div className={`z-[552] ml-0 w-max h-max px-4 py-2 flex items-center justify-center text-center bg-white rounded-full text-[16px] border border-slate-700 bottom-4`}>{ currentPosition?.[0].toFixed(6) + `  |  ` + currentPosition?.[1].toFixed(6) ?? 0 }</div>
          </div>
          <div className={`w-max ${activeClick ? 'hidden' : 'flex'} items-center`}>
            <div title='Kantor kecataman' onClick={() => setSubdistrictDots(!subdistrictDots)} className={`${subdistrictDots ? 'bg-green-200' : 'bg-white'} mr-3 hover:bg-green-200 cursor-pointer active:scale-[0.98] z-[22222] w-[40px] h-[40px] py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}><FaBuilding /></div>
            <div title='Lihat semua koordinat' onClick={() => handleShowAll()} className={`${showAll ? 'bg-green-200' : 'bg-white'} mr-3 hover:bg-green-200 cursor-pointer active:scale-[0.98] z-[22222] w-[40px] h-[40px] py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}>{showAll ? <FaEyeSlash /> : <FaEye />}</div>
            <div title='Ambil gambar peta' onClick={() => window.location.href = 'https://www.google.com/maps/place/Cirebon,+Kota+Cirebon,+Jawa+Barat/@-6.7428609,108.5128389,13z/data=!3m1!4b1!4m15!1m8!3m7!1s0x2e6f1d0f69dbc5d5:0x301e8f1fc28ba20!2sKabupaten+Cirebon,+Jawa+Barat!3b1!8m2!3d-6.6898876!4d108.4750846!16zL20vMGdjN3h6!3m5!1s0x2e6ee2649e6e5bbb:0x70a07638a7fe12fe!8m2!3d-6.7320229!4d108.5523164!16s%2Fg%2F11bc5j9s76?entry=ttu'} className={`z-[33333] active:bg-green-200 bg-white mr-3 hover:brightness-[90%] cursor-pointer active:scale-[0.98] z-[22222] w-[40px] h-[40px] py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}><FaGoogle /></div>
            <div title='Ambil gambar peta' onClick={() => downloadImage()} className={`z-[33333] active:bg-green-200 bg-white mr-3 hover:brightness-[90%] cursor-pointer active:scale-[0.98] z-[22222] w-[40px] h-[40px] py-2 flex items-center justify-center text-center rounded-full text-[16px] border border-slate-700 top-4`}><FaCameraRetro /></div>
          </div>
        </div>
        
        <div className='w-full h-max' ref={captureRef}>
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

          </MapContainer>
        </div>

      </div>
    </>
  );
};


export default Map