"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaEnvelope,
    FaLock,
    FaArrowRight,
} from 'react-icons/fa';
import { useAppContext } from '@/src/context/AppContextProvider';
import Image from 'next/image';
import Link from 'next/link';
import Input from '@/src/components/Form/Input';
import z from "zod"
import toast from 'react-hot-toast';
import Btn from '@/src/components/Form/Btn';

// 1. Define the Login Schema (Updated with enterprise compliance fields)
const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().optional(),
    termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms and policies to proceed"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
    const { loginUser, loading } = useAppContext();

    // --- State ---
    const [formData, setFormData] = useState<LoginForm>({ 
        email: '', 
        password: '', 
        rememberMe: false, 
        termsAccepted: false 
    });
    const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});

    /* ---------- FIELD VALIDATION ---------- */
    const validateField = <K extends keyof LoginForm>(
        field: K,
        value: LoginForm[K]
    ) => {
        // Validate the specific value against the schema's internal shape for that key
        const result = loginSchema.shape[field].safeParse(value);

        return result.success ? undefined : result.error.issues[0].message;
    };

    /* ---------- HANDLE CHANGE ---------- */
    const handleChange = <K extends keyof LoginForm>(
        field: K,
        value: LoginForm[K]
    ) => {
        // Update data
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Instant error feedback
        const errorMessage = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    };

    /* ---------- SUBMIT ---------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final full validation check
        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            toast.error("Please fix the errors in the form before proceeding");
            const fieldErrors: Partial<Record<keyof LoginForm, string>> = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof LoginForm;
                fieldErrors[field] = issue.message;
            });

            setErrors(fieldErrors);
            return;
        }

        // We only pass email and password to your existing login function. 
        // rememberMe could be passed here later if your API supports persistent sessions.
        await loginUser(formData.email, formData.password);
    };

    // --- Animations ---
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
                <div className="p-5">
                    {/* --- Header --- */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                            <Image src="/images/logo.png" alt="Logo" width={100} height={100} className="w-10 h-10 object-contain" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Enter your credentials to access your secure enterprise wallet.
                        </p>
                    </div>

                    {/* --- Login Form --- */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1">
                                Email
                            </label>
                            <Input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="name@example.com"
                                icon={<FaEnvelope />}
                                error={!!errors.email}
                                hint={errors.email}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label htmlFor="password" className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    Password
                                </label>
                                <Link href="/forget-password" className="text-xs font-bold text-primary hover:underline">Forgot Password?</Link>
                            </div>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                placeholder="••••••••"
                                icon={<FaLock />}
                                error={!!errors.password}
                                hint={errors.password}
                            />
                        </div>

                        {/* Enterprise Compliance & Session Options */}
                        <div className="space-y-4 pt-2">
                            {/* Remember Me */}
                            <div className="flex items-center ml-1">
                                <input
                                    id="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => handleChange("rememberMe", e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                    Remember this device
                                </label>
                            </div>

                            {/* Terms and Privacy (Required) */}
                            <div className="space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex items-start">
                                    <input
                                        id="termsAccepted"
                                        type="checkbox"
                                        checked={formData.termsAccepted}
                                        onChange={(e) => handleChange("termsAccepted", e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                                    />
                                    <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-600 cursor-pointer leading-relaxed">
                                        I agree to the <Link href="/terms" className="text-primary hover:underline font-semibold">Terms of Service</Link>, <Link href="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link>, and the Enterprise Acceptable Use Policy.
                                    </label>
                                </div>
                                {errors.termsAccepted && (
                                    <p className="text-xs text-red-500 ml-6 mt-1 font-medium">{errors.termsAccepted}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Btn
                            title='Login'
                            type='submit'
                            className="w-full"
                            endIcon={<FaArrowRight />}
                            loading={loading.login}
                        />
                    </form>
                </div>

                {/* --- Footer --- */}
                <div className="text-center pb-6">
                    <p className="text-sm text-gray-500">
                        New to dọlà?{' '}
                        <Link href="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
                            Create an account
                        </Link>
                    </p>
                    {/* Optional Enterprise Security Badge */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <FaLock className="w-3 h-3" />
                        <span>Protected by enterprise-grade security</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;