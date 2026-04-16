"use client"

import { ChangeEvent, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    FaChevronLeft,
    FaCheckCircle,
    FaShieldAlt,
    FaLock,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/src/context/AppContextProvider';
import Input from '@/src/components/Form/Input';
import Btn from '@/src/components/Form/Btn';
import toast from 'react-hot-toast';

const EditLogin = () => {
    const router = useRouter()
    const { updateUserPassword, loading: globalLoading, logoutUser } = useAppContext()

    // --- State ---
    const [form, setForm] = useState({
        oldpassword: '',
        newpassword: '',
        confirmpassword: '',
    });

    const [successModalOpen, setSuccessModalOpen] = useState(false);

    // --- Logic ---
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const calculateStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length > 7) score += 1;
        if (pass.length > 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score; // Max 5
    };

    const strengthScore = calculateStrength(form.newpassword);

    const getStrengthColor = () => {
        if (strengthScore <= 2) return 'bg-red-500';
        if (strengthScore <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthLabel = () => {
        if (strengthScore <= 2) return 'Weak';
        if (strengthScore <= 3) return 'Medium';
        return 'Strong';
    };

    const isValid =
        form.oldpassword.length > 0 &&
        form.newpassword.length >= 8 &&
        form.newpassword === form.confirmpassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        const res = await updateUserPassword(form.oldpassword, form.newpassword);

        if (res?.success) {
            setSuccessModalOpen(true);
        } else if (res?.message) {
            toast.error(res.message);
        }
    };

    const handleSuccessClose = () => {
        setSuccessModalOpen(false);
        logoutUser();
    };

    // --- Animations ---
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 ">
            <motion.div
                className="max-w-md mx-auto px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-md mx-auto px-4 pt-6">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 active:scale-90 transition-transform"
                    >
                        <FaChevronLeft size={14} />
                    </button>
                </div>
                <div className="max-w-md mx-auto px-4 mt-2">
                    <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your account password and security preferences.</p>
                </div>
                {/* Intro Card */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <FaShieldAlt className="text-xl" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-blue-800">Change Password</h3>
                        <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                            For your security, we highly recommend that you choose a unique password that you
                            don&lsquo;t use for any other account.
                        </p>
                    </div>
                </div>

                {/* Form Container */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5"
                >
                    {/* Old Password */}
                    <Input
                        type="password"
                        label="Current Password"
                        name="oldpassword"
                        value={form.oldpassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                        icon={<FaLock />}
                    />

                    <hr className="border-gray-100" />

                    {/* New Password */}
                    <div>
                        <Input
                            type="password"
                            label="New Password"
                            name="newpassword"
                            value={form.newpassword}
                            onChange={handleChange}
                            placeholder="Min. 8 characters"
                            icon={<FaLock />}
                        />

                        {/* Strength Meter */}
                        {form.newpassword.length > 0 && (
                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${getStrengthColor()}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(strengthScore / 5) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold uppercase text-gray-400 min-w-[50px] text-right">
                                    {getStrengthLabel()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <Input
                            type="password"
                            label="Confirm New Password"
                            name="confirmpassword"
                            value={form.confirmpassword}
                            onChange={handleChange}
                            placeholder="Re-enter new password"
                            icon={<FaLock />}
                            error={form.confirmpassword !== '' && form.newpassword !== form.confirmpassword}
                            hint={form.confirmpassword !== '' && form.newpassword !== form.confirmpassword ? "Passwords do not match" : undefined}
                        />
                    </div>

                    {/* Submit Button */}
                    <Btn
                        title="Update Password"
                        type="submit"
                        disabled={!isValid}
                        loading={globalLoading.login}
                    />
                </form>
            </motion.div>

            {/* --- Success Modal --- */}
            <AnimatePresence>
                {successModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={handleSuccessClose}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center"
                        >
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheckCircle className="text-3xl text-green-500" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Password Updated!</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Your password has been changed successfully. Please log in again with your new credentials.
                            </p>
                            <Btn title="Go to Login" onClick={handleSuccessClose} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditLogin;
