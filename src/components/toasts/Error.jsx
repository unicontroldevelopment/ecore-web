import { toast } from "react-toastify";

export const Error = (message) => {
  toast.error(message, {
    theme: "light",
    position: "bottom-right",
    pauseOnFocusLoss: false,
    autoClose: 5000,
    toastId: "error",
  });
};
