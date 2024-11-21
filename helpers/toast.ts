import toast from "react-hot-toast";

export const showMessage = (message: string) => {
    toast(message, { duration: 2000 });
};

export const showWarning = (message: string) => {
    toast(message, { duration: 2000, className: 'toast-warning' });
};

export const showError = (message: string) => {
    toast(message, { duration: 2000, className: 'toast-error' });
};