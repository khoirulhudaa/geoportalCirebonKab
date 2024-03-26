import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SweetAlert: any = ({
    title,
    text,
    icon="success",
    showCancelButton=true,
    cancelButtonText="Tutup",
    showConfirmButton=true,
    confirmButtonText="Konfirmasi",
    navigate,
    route,
    onClick
}: {
    title?: string,
    text?: any,
    icon?: "success" | "info" | "warning" | "error" | "question",
    showCancelButton?: boolean,
    cancelButtonText?: string,
    showConfirmButton?: boolean,
    confirmButtonText?: string,
    navigate?: any,
    route?: string,
    onClick?: any
}) => {

 const MySwal = withReactContent(Swal);

 const customClasses = {
    popup: 'z-[9999999999999] text-black',
    backdrop: 'z-[9999999999] text-black',
 };
  
 MySwal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton,
      cancelButtonText,
      showConfirmButton,
      confirmButtonText,
      customClass: customClasses,
    }).then((result: any) => {
        if (result.isConfirmed) {
            if (route && navigate) {
              navigate.push(route);
            }
            if (onClick) {
              onClick();
            }
        }
    })

}

export default SweetAlert
