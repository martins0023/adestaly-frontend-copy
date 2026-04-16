"use client"

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaEnvelope,
    FaArrowRight,
    FaSpinner,
    FaChevronLeft,
    FaKey,
    FaCheckCircle,
    FaExclamationCircle,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/src/context/AppContextProvider';
import z from 'zod';
import toast from 'react-hot-toast';
import Input from '@/src/components/Form/Input';
import Btn from '@/src/components/Form/Btn';

// 1. Define the Forget Password Schema
const forgetPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgetPassForm = z.infer<typeof forgetPasswordSchema>;

const ForgetPassword = () => {
    const { forgotPassword, loading } = useAppContext();
    const router = useRouter();

    // --- State ---
    const [email, setEmail] = useState<string>('');
    const [errors, setErrors] = useState<Partial<Record<keyof ForgetPassForm, string>>>({});
    // const [loading, setLoading] = useState(false);
    // const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [isSuccess, setIsSuccess] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    /* ---------- FIELD VALIDATION ---------- */
    const validateField = <K extends keyof ForgetPassForm>(
        field: K,
        value: ForgetPassForm[K]
    ) => {
        // Safe validation using the shape of the schema
        const result = forgetPasswordSchema.shape[field].safeParse(value);
        return result.success ? undefined : result.error.issues[0].message;
    };

    /* ---------- HANDLE CHANGE ---------- */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        // Instant error feedback for 'email'
        const errorMessage = validateField("email", value);
        setErrors((prev) => ({ ...prev, email: errorMessage }));

        // Hide alert when user starts typing again
        // if (alert.show) setAlert({ show: false, message: '', type: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final Validation
        const result = forgetPasswordSchema.safeParse({ email });

        if (!result.success) {
            // toast.error("Please fix the errors in the form");
            const fieldErrors: Partial<Record<keyof ForgetPassForm, string>> = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof ForgetPassForm;
                fieldErrors[field] = issue.message;
            });

            setErrors(fieldErrors);
            return;
        }
        // try {
        const response = await forgotPassword(email);
        if (response?.success) {
            setIsSuccess(true);
        } else {
            toast.error(response?.message || 'Failed to send reset link. Please try again.')
        }
        // } catch (error: any) {
        //     setAlert({
        //         show: true,
        //         message: error.response?.data?.message || 'Failed to send reset link. Please try again.',
        //         type: 'error',
        //     });
        // } finally {
        //     setLoading(false);
        // }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-md overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="p-8">
                    {/* --- Navigation --- */}
                    {!isSuccess && (
                        <button
                            onClick={() => router.push('/login')}
                            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors text-xs font-bold uppercase tracking-wider mb-6"
                        >
                            <FaChevronLeft /> Back to Login
                        </button>
                    )}

                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 text-3xl">
                                <FaCheckCircle className="animate-bounce" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h2>
                            <p className="text-sm text-gray-500 leading-relaxed mb-8">
                                We have sent a password reset link to <br />
                                <span className="font-bold text-gray-800">{email}</span>.
                            </p>

                            <button
                                onClick={() => router.push('/login')}
                                className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors"
                            >
                                Return to Login
                            </button>

                            <button
                                onClick={() => {
                                    setIsSuccess(false);
                                    setEmail('');
                                    setErrors({});
                                }}
                                className="mt-4 text-primary text-xs font-bold hover:underline"
                            >
                                Didn&apos;t receive the email? Try again
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                                    <FaKey />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    No worries, we&apos;ll send you reset instructions.
                                </p>
                            </div>

                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="email"
                                        className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                            <FaEnvelope />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            error={!!errors.email}
                                            hint={errors.email}
                                        />
                                    </div>
                                </div>

                                <div className="">
                                    <Btn
                                        title='Reset Password'
                                        type='submit'
                                        disabled={loading.login}
                                        loading={loading.login}
                                    />
                                </div>

                                {/* <button
                                    type="submit"
                                    disabled={loading.login || !email || !!errors.email}
                                    className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${loading || !email || !!errors.email
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-primary text-white hover:brightness-110 shadow-primary/30'
                                        }`}
                                >
                                    {loading.login ? (
                                        <>
                                            <FaSpinner className="animate-spin text-lg" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Reset Password</span>
                                            <FaArrowRight />
                                        </>
                                    )}
                                </button> */}
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgetPassword;