import { toast } from "react-toastify";

const toastInfo = (message) => {
  toast.info(message, {
    theme: "light",
    position: "bottom-right",
    pauseOnFocusLoss: false,
    autoClose: 5000,
    toastId: "error",
  });
};

export default toastInfo;
