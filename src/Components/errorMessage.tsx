const ErrorMessage = ({error}: {error?: string}) => {
    return (
      <div className='relative text-[white] w-max rounded-full px-4 py-1 text-[13px] font-normal bg-red-400 mb-[20px]'>
          {error}
      </div>
    )
}
  
export default ErrorMessage
  