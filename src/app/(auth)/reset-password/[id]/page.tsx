"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner, FaKey, FaLock } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/src/context/AppContextProvider';
import toast from 'react-hot-toast';
import Input from '@/src/components/Form/Input';
import Btn from '@/src/components/Form/Btn';
import Image from 'next/image';
import z from 'zod';
import { UseGetApi } from '@/src/config/Action';

// 1. Define Reset Schema
const resetSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

const ResetPassword = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { resetPassword, loading } = useAppContext();

    // State for token check
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [validatingToken, setValidatingToken] = useState(true);
    const [userEmailMasked, setUserEmailMasked] = useState('');

    // Form state
    const [form, setForm] = useState<ResetForm>({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof ResetForm, string>>>({});

    // --- 1. Validate Token on Mount ---
    useEffect(() => {
        if (!id) {
            setValidatingToken(false);
            return;
        }

        const checkToken = async () => {
            try {
                const response = await UseGetApi(`api/auth/reset-context?token=${id}`);
                if (response.success) {
                    setIsTokenValid(true);
                    setUserEmailMasked(response.data);
                } else {
                    setIsTokenValid(false);
                    // toast.error(response.message || "Invalid or expired reset link.");
                }
            } catch (error) {
                setIsTokenValid(false);
                toast.error("An error occurred. Please try again.");
            } finally {
                setValidatingToken(false);
            }
        };

        checkToken();
    }, [id]);

    /* ---------- FIELD VALIDATION ---------- */
    const validateField = (field: keyof ResetForm, value: string, currentForm: ResetForm) => {
        if (field === 'confirmPassword') {
            return value !== currentForm.password ? "Passwords do not match" : undefined;
        }
        
        const result = resetSchema.shape.password.safeParse(value);
        return result.success ? undefined : result.error.issues[0].message;
    };

    /* ---------- HANDLE CHANGE ---------- */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof ResetForm;

        const updatedForm = { ...form, [fieldName]: value };
        setForm(updatedForm);

        const errorMessage = validateField(fieldName, value, updatedForm);
        setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

          const result = resetSchema.safeParse(form);

        if (!result.success) {
            // toast.error("Please fix the errors in the form");
            const fieldErrors: Partial<Record<keyof ResetForm, string>> = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof ResetForm;
                fieldErrors[field] = issue.message;
            });

            setErrors(fieldErrors);
            return;
        }

        const response = await resetPassword(id, form.password);

        if (response?.success) {
            toast.success("Password reset successfully! Redirecting...");
            setTimeout(() => router.push('/login'), 3000);
        } else {
            // toast.error(response?.message || "Failed to reset password.");
        }
    };

    if (validatingToken) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-original text-3xl" />
            </div>
        );
    }

    if (!isTokenValid) {
        return (
            <div className="flex flex-col items-center justify-center text-center px-4 h-screen">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500 text-3xl">
                   <FaKey className="opacity-50" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Expired or Invalid</h2>
                <p className="text-gray-500 mb-8 max-w-sm">The password reset link is no longer valid. Please request a new one.</p>
                <button
                    onClick={() => router.push('/forget-password')}
                    className="bg-original text-white px-8 py-3 rounded-full font-bold hover:brightness-110 transition-all"
                >
                    Request New Link
                </button>
            </div>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 py-10"
        >
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <div className="w-full max-w-md">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                    </div>
                    
                    <h1 className="sm:text-[24px] text-[#141416] tracking-wider font-medium  text-center text-[24px] font-semibold">Reset Password</h1>
                    <p className="sm:text-[14px] text-[12px] tracking-wider text-[#777E90] font-400  text-center font-normal text-[14px] mt-2">
                        Set a new password for <span className="font-semibold text-black">{userEmailMasked}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-[32px]">
                        {/* New Password */}
                        <Input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="New Password"
                            icon={<FaLock />}
                            error={!!errors.password}
                            hint={errors.password}
                        />

                        {/* Confirm Password */}
                        <Input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            icon={<FaLock />}
                            error={!!errors.confirmPassword}
                            hint={errors.confirmPassword}
                        />

                        <div className="mt-4">
                            <Btn
                                title={"Set New Password"}
                                type='submit'
                                disabled={loading.login}
                                loading={loading.login}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </motion.section>
    );
};

export default ResetPassword;