import toast from "react-hot-toast";

export type AxiosErrorResponse = {
  response?: {
    data?: {
      message?: string;
      detail?: {
        message?: string
      }; // <-- Add 'detail' here
    };
  };
  message?: string;
};

export const handleCatchError = (err: AxiosErrorResponse) => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const error = err as AxiosErrorResponse; // Use the new type

    // Now accessing 'detail' is fine
    console.log({ success: false, message: error.response?.data?.message || error.response?.data?.detail || error.message });
    toast.error(error.response?.data?.message || error.response?.data?.detail?.message || error.message || "An Error occur!!!");
  } else {
    // Handle cases where 'err' isn't an object with a 'response' property
    toast.error("An unknown error occurred.");
  }
}

