"use client"

import { createContext, ReactNode, SetStateAction, useContext, useState, useCallback } from "react";
import { SessionPayload, ILoading } from "../constants/type";
import { AxiosErrorResponse, handleCatchError } from "../config/utils";
import axiosClient from "../config/client";
import { useRouter } from "next/navigation";
import { createSession, deleteSession, readSessionPayload } from "../config/session";
import toast from "react-hot-toast";
import { RegisterForm } from "../app/(auth)/register/page";


type LoginFn = (username: string, password: string) => Promise<void>;
type RegisterFn = (user: RegisterForm) => Promise<void>;
type verifyEmailI = (userId: string, code: string) => Promise<{ success: string, message: string } | undefined>;
type resendVerificationCodeI = (userId: string) => Promise<{ success: string, message: string } | undefined>;
type forgotPasswordI = (email: string) => Promise<{ success: string, message: string } | undefined>;
type resetPasswordI = (token: string, newPassword: string) => Promise<{ success: string, message: string } | undefined>;
type updateUserPasswordI = (oldPassword: string, newPassword: string) => Promise<{ success: string, message: string } | undefined>;
type updatePinI = (oldPassword: string, newPassword: string) => Promise<{ success: string, message: string } | undefined>;
type updateUserI = (updateData: FormData | object) => Promise<{ success: string, message: string } | undefined>;
type getBillServicesI = (identifier: string) => Promise<{ success: string, message: string, data: unknown } | undefined>;
type getDataPlansI = (serviceId: string) => Promise<{ success: string, message: string, data: unknown } | undefined>;
type initializeBillPaymentI = (payload: unknown) => Promise<{ success: string, message: string, data: unknown } | undefined>;
type verifyBillerCodeI = (billersCode: string, serviceID: string, type?: string) => Promise<{ success: string, message: string, data: unknown } | undefined>;

interface AppContextProviderProps {
    setCurrentUser: React.Dispatch<SetStateAction<SessionPayload | null>>;
    currentUser: SessionPayload | null;
    loginUser: LoginFn;
    registerUser: RegisterFn;
    logoutUser: () => void;
    verifyEmail: verifyEmailI;
    resendVerificationCode: resendVerificationCodeI;
    forgotPassword: forgotPasswordI;
    resetPassword: resetPasswordI;
    updateUserPassword: updateUserPasswordI;
    updatePin: updatePinI;
    updateUser: updateUserI;
    getBillServices: getBillServicesI;
    getDataPlans: getDataPlansI;
    initializeBillPayment: initializeBillPaymentI;
    verifyBillerCode: verifyBillerCodeI;
    loading: ILoading;
    setLoading: React.Dispatch<SetStateAction<ILoading>>;
}

const AppContext = createContext<AppContextProviderProps | undefined>(undefined)

export function AppContextProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    // const searchParams = useSearchParams();

    const [currentUser, setCurrentUser] = useState<SessionPayload | null>(null)
    const [loading, setLoading] = useState<ILoading>({ login: false, resendVerification: false, register: false, service: false, plan: false, payment: false})

    const registerUser = async (user: RegisterForm) => {
        setLoading((prev) => ({ ...prev, register: true }));

        try {
            const response = await axiosClient.post(`/api/auth/register`, { ...user },
                {
                    headers: { 'Content-Type': 'application/json' }
                },
            );
            const data = await response.data;

            if (data.success) {
                toast.success("Account created! Redirecting...")
                setTimeout(() => router.push(`/verify-email/${data.details.userId}`), 1000);
            }

        } catch (err: unknown) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, register: false }));
        }
    }

    const loginUser = async (email: string, password: string) => {
        setLoading((prev) => ({ ...prev, login: true }));

        try {
            const response = await axiosClient.post(`/api/auth/login`, { email, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                },
            );
            const data = await response.data;

            if (response.status === 203) {
                const userId = data.details.userId;
                return router.push(`/verify-email/${userId}`);

            }


            if (response.status === 200 && data.success) {

                await createSession({ token: data.api_access_token, firstName: data.details.firstname, lastName: data.details.lastname, middleName: data.details.middlename, email: data.details.email, id: data.details._id, phone: data.details.phone, isVerified: data.details.isVerified })
                const user = await readSessionPayload() as SessionPayload | null;
                setCurrentUser(user);
                
                const params = new URLSearchParams(window.location.search);
                const callbackUrl = params.get("callbackUrl") || "/dashboard";
                
                const destination = callbackUrl || "/dashboard";
                router.push(destination);

            }

        } catch (err: unknown) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, login: false }));
        }
    }

    // Verify Email function
    const verifyEmail = async (userId: string, code: string) => {
        try {
            setLoading((prev) => ({ ...prev, login: true }));

            const response = await axiosClient.post(`/api/auth/verify-email/${userId}`, { code });
            const data = response.data
            if (data.success) {
                return { success: data.success, message: data.details.message }
            } else {
                return { success: data.success, message: data.details.message || data.message }
            }

        } catch (err) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, login: false }));
        }
        // The component will handle success/error
    };

    // Resend Verification Code function
    const resendVerificationCode = async (userId: string) => {
        // The component will handle success/error
        try {

            setLoading((prev) => ({ ...prev, resendVerification: true }));

            const response = await axiosClient.post(`/api/auth/resend-email/${userId}`);
            const data = response.data
            if (data.success) {
                return { success: data.success, message: data.details.message }
            } else {
                return { success: data.success, message: data.details.message || data.message }
            }

        } catch (err) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, resendVerification: false }));

        }
    };

    const forgotPassword = async (email: string) => {
        // The component will handle success/error
        try {
            setLoading((prev) => ({ ...prev, login: true }));

            const response = await axiosClient.post(`/api/auth/forgot-password`, { email: email });
            const data = response.data
            if (data.success) {
                return { success: data.success, message: data.details.message }
            } else {
                return { success: data.success, message: data.details.message || data.message }
            }

        } catch (err) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, login: false }));

        }
    };

    const resetPassword = async (token: string, newPassword: string) => {
        // The component will handle success/error
        try {
            setLoading((prev) => ({ ...prev, login: true }));

            const response = await axiosClient.post(`/api/auth/reset-password`, { token: token, newPassword: newPassword });
            const data = response.data
            if (data.success) {
                return { success: data.success, message: data.details.message }
            } else {
                return { success: data.success, message: data.details.message || data.message }
            }

        } catch (err) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, login: false }));

        }
    };

    const updateUserPassword = async (oldPassword: string, newPassword: string) => {
        // The component will handle success/error
        try {
            setLoading((prev) => ({ ...prev, login: true }));

            const response = await axiosClient.post(`/api/auth/update-password`, { oldPassword: oldPassword, newPassword: newPassword });
            const data = response.data
            if (data.success) {
                return { success: data.success, message: data?.details?.message || data.message }
            } else {
                return { success: data.success, message: data?.details?.message || data.message }
            }

        } catch (err) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, login: false }));

        }
    };

    const updatePin = async (oldPin: string, newPin: string) => {
        // The component will handle success/error
        try {
            setLoading((prev) => ({ ...prev, login: true }));

            const response = await axiosClient.patch(`/api/user/update-pin`, { oldPin: oldPin, pin: newPin });
            const data = response.data
            if (data.success) {
                return { success: data.success, message: data?.details?.message || data.message }
            } else {
                return { success: data.success, message: data?.details?.message || data.message }
            }

        } catch (err) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, login: false }));

        }
    };

    const updateUser = async (updateData: FormData | object) => {
        // The component will handle success/error
        try {
            setLoading((prev) => ({ ...prev, login: true }));

            const response = await axiosClient.put(`/api/user/update-user`, updateData);
            const data = response.data
            return {
                success: data.success,
                message: data?.details?.message || data.message
            };

        } catch (err) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, login: false }));

        }
    };


    const getBillServices = useCallback(async (identifier: string) => {
        // Identifier could be 'data', 'airtime', etc.
        try {
            setLoading((prev) => ({ ...prev, service: true }));

            const response = await axiosClient.get(`/api/bill/services?identifier=${identifier}`)
            const data = response.data
            return {
                success: data.success,
                message: data?.details?.message || data.message,
                data: data?.details
            };

        } catch (err) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, service: false }));

        }

        // return await axiosClient.get(`/bill/services?identifier=${identifier}`);
    }, []);

    const getDataPlans = useCallback(async (serviceId: string) => {
        // Identifier could be 'data', 'airtime', etc.
        try {
            setLoading((prev) => ({ ...prev, plan: true }));

            const response = await axiosClient.get(`/api/bill/data-variations?service_id=${serviceId}`)
            const data = response.data
            return {
                success: data.success,
                message: data?.details?.message || data.message,
                data: data?.details
            };

        } catch (err) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, plan: false }));

        }

        // return await axiosClient.get(`/bill/services?identifier=${identifier}`);
    }, []);

    const initializeBillPayment = useCallback(async (payload: unknown) => {
        // Identifier could be 'data', 'airtime', etc.
        try {
            setLoading((prev) => ({ ...prev, payment: true }));

            const response = await axiosClient.post(`/api/bill/initialize-payment`, payload)
            const data = response.data
            return {
                success: data.success,
                message: data?.details?.message || data.message,
                data: data?.details
            };

        } catch (err) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, payment: false }));

        }

        // return await axiosClient.get(`/bill/services?identifier=${identifier}`);
    }, []);

    const verifyBillerCode = useCallback(async (billersCode: string, serviceID: string, type?: string) => {
        try {
            const payload: any = { billersCode, serviceID };
            if (type) payload.type = type;
            const response = await axiosClient.post(`/api/bill/verify-biller`, payload);
            const data = response.data;
            return {
                success: data.success,
                message: data?.details?.message || data.message,
                data: data?.details
            };
        } catch (err) {
            handleCatchError(err as AxiosErrorResponse);
            return { success: false, message: "Verification failed", data: null };
        }
    }, []);

    const logoutUser = async () => {


        try {
            await deleteSession()
            router.push("/login")

        } catch (err: unknown) {
            handleCatchError(err as AxiosErrorResponse)
        } finally {
            setLoading((prev) => ({ ...prev, login: false }));
        }

    }


    return (
        <AppContext.Provider
            value={{
                setCurrentUser,
                currentUser,
                loginUser,
                logoutUser,
                loading,
                setLoading,
                verifyEmail,
                resendVerificationCode,
                forgotPassword,
                resetPassword,
                updateUserPassword,
                updatePin,
                updateUser,
                getBillServices,
                getDataPlans,
                initializeBillPayment,
                verifyBillerCode,
                registerUser
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppContextProvider");
    return context;
}