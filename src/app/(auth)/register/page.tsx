"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaLock,
    FaArrowRight,
    FaCheckCircle,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/src/context/AppContextProvider';
import Image from 'next/image';
import Input from '@/src/components/Form/Input';
import { nigerianStates } from '@/src/constants/states';
import Link from 'next/link';
import Btn from '@/src/components/Form/Btn';
import z from "zod";
import toast from 'react-hot-toast';

// 1. Define the Register Schema
const registerSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    phone: z.string().min(11, "Enter a valid phone number"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    state: z.string().min(1, "Please select a state"),
    password: z.string()
        .min(8, "Minimum 8 characters")
        .regex(/[A-Z]/, "Include an uppercase letter")
        .regex(/[0-9]/, "Include a number")
        .regex(/[^A-Za-z0-9]/, "Include a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    referral: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
    const { registerUser, loading } = useAppContext();
    const [termsChecked, setTermsChecked] = useState(false);

    // --- State ---
    const [formData, setFormData] = useState<RegisterForm>({
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        state: '',
        password: '',
        confirmPassword: '',
        referral: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});

    /* ---------- FIELD VALIDATION ---------- */
    const validateField = <K extends keyof RegisterForm>(
        field: K,
        value: RegisterForm[K],
        currentForm: RegisterForm
    ) => {
        // Handle refinement fields (like confirmPassword) separately or use the full schema
        if (field === "confirmPassword" || field === "password") {
            const result = registerSchema.safeParse({ ...currentForm, [field]: value });
            if (result.success) return undefined;
            return result.error.issues.find(i => i.path.includes(field))?.message;
        }

        // Standard field validation
        const fieldSchema = registerSchema.shape[field];
        const result = fieldSchema.safeParse(value);
        return result.success ? undefined : result.error.issues[0].message;
    };

    /* ---------- HANDLE CHANGE ---------- */
    const handleChange = <K extends keyof RegisterForm>(
        field: K,
        value: RegisterForm[K]
    ) => {
        const updatedForm = { ...formData, [field]: value };
        setFormData(updatedForm);

        const errorMessage = validateField(field, value, updatedForm);
        setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    };

    /* ---------- SUBMIT ---------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = registerSchema.safeParse(formData);

        if (!result.success) {
            toast.error("Please fix the errors in the form");
            const fieldErrors: Partial<Record<keyof RegisterForm, string>> = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof RegisterForm;
                fieldErrors[field] = issue.message;
            });

            setErrors(fieldErrors);
            return;
        }

        if (!termsChecked) {
            toast.error("You must agree to the Terms & Conditions");
            return;
        }

        await registerUser(formData);
    };

    const calculateStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    return (
        <div className="min-h-screen flex justify-center py-10 px-4">
            <motion.div
                className="w-full max-w-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="p-5">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                            <Image src="/images/logo.png" alt="Logo" width={100} height={100} className="w-10 h-10 object-contain" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Start your journey with <span className="font-bold text-primary">dọlà</span> today.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                icon={<FaUser />}
                                placeholder="First Name"
                                value={formData.firstname}
                                onChange={(e) => handleChange("firstname", e.target.value)}
                                error={!!errors.firstname}
                                hint={errors.firstname}
                            />
                            <Input
                                icon={<FaUser />}
                                placeholder="Last Name"
                                value={formData.lastname}
                                onChange={(e) => handleChange("lastname", e.target.value)}
                                error={!!errors.lastname}
                                hint={errors.lastname}
                            />
                        </div>

                        <Input
                            icon={<FaEnvelope />}
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            error={!!errors.email}
                            hint={errors.email}
                        />

                        <Input
                            icon={<FaPhone />}
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            error={!!errors.phone}
                            hint={errors.phone}
                        />

                        {/* State Select */}
                        <div className="relative group">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex w-[inherit] items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                <FaMapMarkerAlt />
                            </div>
                            <select
                                value={formData.state}
                                onChange={(e) => handleChange("state", e.target.value)}
                                className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl text-sm font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none ${
                                    errors.state ? 'border-red-500' : 'border-gray-200'
                                }`}
                            >
                                <option value="" disabled>Select State</option>
                                {nigerianStates.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                            {errors.state && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.state}</p>}
                        </div>

                        <div className="space-y-4 pt-2">
                            <Input
                                icon={<FaLock />}
                                type="password"
                                placeholder="Create Password"
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                error={!!errors.password}
                                hint={errors.password}
                            />

                            {/* Strength Bar */}
                            {formData.password.length > 0 && (
                                <div className="flex gap-1 h-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`flex-1 rounded-full transition-colors duration-300 ${
                                                calculateStrength(formData.password) >= level
                                                    ? calculateStrength(formData.password) < 3 ? 'bg-yellow-400' : 'bg-green-500'
                                                    : 'bg-gray-100'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}

                            <Input
                                icon={<FaLock />}
                                type="password"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                error={!!errors.confirmPassword}
                                hint={errors.confirmPassword}
                            />
                        </div>

                        <Input
                            placeholder="Referral Code (Optional)"
                            value={formData.referral}
                            onChange={(e) => handleChange("referral", e.target.value)}
                        />

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={termsChecked}
                                    onChange={(e) => setTermsChecked(e.target.checked)}
                                    className="peer h-5 w-5 opacity-0 absolute z-10 cursor-pointer"
                                />
                                <div className="w-5 h-5 border-2 border-gray-300 rounded bg-white peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                                <FaCheckCircle className="w-3 h-3 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <span className="text-xs text-gray-500 leading-relaxed">
                                I agree to the{' '}
                                <Link href="/terms" className="text-primary font-bold hover:underline">Terms & Conditions</Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
                            </span>
                        </label>

                        <Btn
                            title='Register'
                            type="submit"
                            disabled={loading.register}
                            loading={loading.register}
                            endIcon={<FaArrowRight />}
                        />
                    </form>
                </div>

                <div className="bg-gray-50/50 p-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">Log In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;