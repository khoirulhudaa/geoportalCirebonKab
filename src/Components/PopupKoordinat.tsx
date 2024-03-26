import React from 'react'
import { popUpProps } from '../Models/componentInterface'
import FormGroup from './FormGroup'

const PopupKoordinat: React.FC<popUpProps> = ({
    handleAlert,
    close,
    titleID,
    handleDone,
    dataSubdistrict,
    handleStatus
}) => {

  return (
    <div className='w-screen min-h-screen p-6 box-border absolute left-0 top-0 flex justify-center overflow-y-auto items-center z-[99999999999] bg-slate-700 bg-opacity-[0.7]'>
        <FormGroup handleStatus={handleStatus} dataSubdistrict={dataSubdistrict} handleDone={handleDone} titleID={titleID} type='coordinate' handleAlert={handleAlert} close={close} />
    </div>
  )
}

export default PopupKoordinat
