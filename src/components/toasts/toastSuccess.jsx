import { toast } from "react-toastify";

const toastSuccess = (message) => {
  toast.success(message, {
    theme: "light",
    position: "bottom-right",
    pauseOnFocusLoss: false,
    autoClose: 5000,
    toastId: "success",
  });
};

export default toastSuccess;
