import { toast } from "react-toastify";

export const Info = (message) => {
  toast.info(message, {
    theme: "light",
    position: "bottom-right",
    pauseOnFocusLoss: false,
    autoClose: 5000,
    toastId: "error",
  });
};
