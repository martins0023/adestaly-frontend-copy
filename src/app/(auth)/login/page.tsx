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

// 1. Define the Login Schema
const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
    const { loginUser, loading } = useAppContext();

    // --- State ---
    const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' });
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
            toast.error("Please fix the errors in the form");
            const fieldErrors: Partial<Record<keyof LoginForm, string>> = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof LoginForm;
                fieldErrors[field] = issue.message;
            });

            setErrors(fieldErrors);
            return;
        }

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
                            Enter your credentials to access your wallet.
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
                                <Link href="/forget-password" className="text-xs font-bold text-primary hover:underline">Forgot Password</Link>
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
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        New to dọlà?{' '}
                        <Link href="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;