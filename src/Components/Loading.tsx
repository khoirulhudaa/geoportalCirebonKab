import { Loading } from "../assets";

const LoadingFallback = () => {
    return (
      <div className='flex fixed top-0 left-0 z-[99999999999] items-center w-screen h-screen justify-center'>
        <img src={Loading} className='animate-pulse w-[14%] duration-[6s] ease' alt="eart" />
    </div>
    )
};

export default LoadingFallback