import toast from "react-hot-toast";
import axiosClient from "./client";
import { AxiosErrorResponse, handleCatchError } from "./utils";

export const UsePostApi = async (url: string, body?: unknown) => {
  try {
    // Interceptor now handles headers and withCredentials automatically
    const response = await axiosClient.post(`/${url}`, body);
    const data = response.data;

    if (data.success === false) {
      // toast.error(data.message || "Operation failed");
      return { success: false, message: data.details?.message };
    }

    return { success: true, message: data.details?.message, data: data.details };
  } catch (err: unknown) {
    handleCatchError(err as AxiosErrorResponse);
    return { success: false, message: (err as Error).message || "An unknown error occurred" };
  }
}

export const UsePutApi = async (url: string, body: unknown) => {
  try {
    const response = await axiosClient.put(`/${url}`, body);
    const data = response.data;

    if ((response.status === 200 || response.status === 201) && data.success !== false) {
      return { success: true, message: data.details?.message, data: data.details };
    } else {
      return { success: false, message: data.details?.message || "Update failed" };
    }
  } catch (err: unknown) {
    handleCatchError(err as AxiosErrorResponse);
    // const errorData = (err as any).response?.data;
    // return { success: false, message: errorData?.message || (err as Error).message || "An unknown error occurred" };
    return { success: false, message: (err as Error).message || "An unknown error occurred" };
  }
}

export const UsePatchApi = async (url: string, body: unknown) => {
  try {
    const response = await axiosClient.patch(`/${url}`, body);
    const data = response.data;

    if ((response.status === 200 || response.status === 201) && data.success !== false) {
      return { success: true, message: data.details?.message, data: data.details };
    } else {
      return { success: false, message: data.details?.message || "Update failed" };
    }
  } catch (err: unknown) {
    handleCatchError(err as AxiosErrorResponse);
    // const errorData = (err as any).response?.data;
    // return { success: false, message: errorData?.message || (err as Error).message || "An unknown error occurred" };
    return { success: false, message: (err as Error)?.message || "An unknown error occurred" };
  }
}

export const UseGetApi = async (url: string, params?: FilterModel) => {
  try {
    const response = await axiosClient.get(`/${url}${getParamData(params)}`);
    const data = response.data;

    if ((response.status === 200 || response.status === 201) && data.success !== false) {
      return { success: true, message: data.details?.message || data?.message, data: data.details || data };
    } else {
      return { success: false, message: data.details.message || "Failed to fetch data" };
    }
  } catch (err: unknown) {
    handleCatchError(err as AxiosErrorResponse);
    // const errorData = (err as any).response?.data;
    // return { success: false, message: errorData?.message || (err as Error).message || "An unknown error occurred" };
    return { success: false, message: (err as Error).message || "An unknown error occurred" };
  }
}

export class FilterModel {
  from?: string;
  to?: string;
  user_id?: string
  q?: string;
  page?: number;
  status?: string;
  limit?: string;
}


export function getParamData(param: FilterModel | undefined): string {
  //return `?UserId=${param.userId}&query=${param.Query}&PageSize=${param.PageSize}&Page=${param.Page}&startDate=${param.StartDate}&endDate=${param.EndDate}`

  if (!param) {
    return '';
  }

  const queryParams: string[] = [];

  if (param.from !== undefined && param.from !== "") {
    queryParams.push(`from=${param.from}`);
  }

  if (param.to !== undefined) {
    queryParams.push(`to=${param.to}`);
  }
  if (param.user_id !== undefined) {
    queryParams.push(`user_id=${param.user_id}`);
  }
  if (param.q !== undefined) {
    queryParams.push(`q=${param.q}`);
  }
  if (param.page !== undefined) {
    queryParams.push(`page=${param.page}`);
  }
  if (param.status !== undefined) {
    queryParams.push(`status=${param.status}`);
  }
  if (param.limit !== undefined) {
    queryParams.push(`limit=${param.limit}`);
  }
  // Join the parameters with '&' and prefix with '?'
  return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
}