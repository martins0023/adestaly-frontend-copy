"use client"

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    FaChevronLeft,
    FaEye,
    FaEyeSlash,
    FaLock,
    FaShieldAlt,
    FaCheckCircle,
    FaExclamationTriangle,
} from 'react-icons/fa';
import { UsePatchApi } from '@/src/config/Action';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import { useAppContext } from '@/src/context/AppContextProvider';
import Btn from '@/src/components/Form/Btn';

const EditTransactionPin = () => {
    const router = useRouter();
    const { updatePin, loading } = useAppContext()

    // --- State ---
    const [successModal, setSuccessModal] = useState({
        show: false,
        message: '',
    });

    // Change PIN Form
    const [pinForm, setPinForm] = useState({
        oldPin: '',
        newPin: '',
        confirmPin: '',
    });

    // Visibility Toggles
    const [showValues, setShowValues] = useState({
        old: false,
        new: false,
        confirm: false,
        disable: false,
    });

    // Disable PIN Form
    const [isPinEnabled, setIsPinEnabled] = useState(true); // Assuming enabled by default

    // --- Handlers ---
    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Only allow numbers and max 4 digits
        if (/^\d{0,4}$/.test(value)) {
            setPinForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const toggleVis = (field: keyof typeof showValues) => {
        setShowValues((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const isChangeValid =
        pinForm.oldPin.length === 4 &&
        pinForm.newPin.length === 4 &&
        pinForm.newPin === pinForm.confirmPin;

    const handleSubmitChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isChangeValid) return;

        const response = await updatePin(pinForm.oldPin, pinForm.newPin);

        if (response?.success) {
            setSuccessModal({
                show: true,
                message: 'Transaction PIN updated successfully.',
            });
            setPinForm({ oldPin: '', newPin: '', confirmPin: '' });
        }


        // try {
        //     if (response.success) {
        //         setSuccessModal({
        //             show: true,
        //             message: 'Transaction PIN updated successfully.',
        //         });
        //         setPinForm({ oldPin: '', newPin: '', confirmPin: '' });
        //     } else {
        //         console.log("Failed to set up pin")
        //         toast.error(response.message || "Failed to set PIN");
        //     }
        // } catch (err) {
        //     toast.error("An unexpected error occurred");
        // } finally {
        // }

    };

    const handleToggleSecurity = async () => {
        // In a real app, you'd trigger a modal to ask for the current PIN before disabling
        // setLoading(true);
        setTimeout(() => {
            setIsPinEnabled(!isPinEnabled);
            // setLoading(false);
            setSuccessModal({
                show: true,
                message: `Transaction PIN has been ${!isPinEnabled ? 'enabled' : 'disabled'}.`,
            });
        }, 1000);
    };

    const handleModalClose = () => {
        setSuccessModal({ show: false, message: '' });
        if (successModal.message.includes('disabled')) router.push('/dashboard');
    };

    // --- Animations ---
    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">

            <motion.div
                className="max-w-md mx-auto px-4 space-y-6"
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

                {/* --- Info Card --- */}
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-3">
                    <FaShieldAlt className="text-purple-600 text-xl mt-1" />
                    <div>
                        <h3 className="text-sm font-bold text-purple-900">Secure Your Funds</h3>
                        <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                            Your 4-digit PIN is required for all transfers and bill payments. Never share it with
                            anyone.
                        </p>
                    </div>
                </div>

                {/* --- Card 1: Change PIN --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50">
                        <h2 className="text-sm font-bold text-gray-800">Change PIN</h2>
                    </div>

                    <form onSubmit={handleSubmitChange} className="p-6 space-y-5">
                        <PinInput
                            label="Current PIN"
                            name="oldPin"
                            value={pinForm.oldPin}
                            onChange={handlePinChange}
                            isVisible={showValues.old}
                            toggleVis={() => toggleVis('old')}
                            placeholder="••••"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <PinInput
                                label="New PIN"
                                name="newPin"
                                value={pinForm.newPin}
                                onChange={handlePinChange}
                                isVisible={showValues.new}
                                toggleVis={() => toggleVis('new')}
                                placeholder="••••"
                            />
                            <PinInput
                                label="Confirm"
                                name="confirmPin"
                                value={pinForm.confirmPin}
                                onChange={handlePinChange}
                                isVisible={showValues.confirm}
                                toggleVis={() => toggleVis('confirm')}
                                placeholder="••••"
                            />
                        </div>

                        {pinForm.confirmPin && pinForm.newPin !== pinForm.confirmPin && (
                            <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                <FaExclamationTriangle /> PINs do not match
                            </p>
                        )}

                        <Btn
                            title="Update PIN"
                            type="submit"
                            disabled={!isChangeValid}
                            loading={loading.login}
                        />
                    </form>
                </div>

                {/* --- Card 2: Security Settings (Toggle) --- */}
                {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-gray-800">Require PIN for Transactions</h2>
                        <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                            Disabling this makes your wallet vulnerable.
                        </p>
                    </div>

                    <button
                        onClick={handleToggleSecurity}
                        className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out ${isPinEnabled ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                    >
                        <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isPinEnabled ? 'translate-x-5' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div> */}
            </motion.div>

            {/* --- Success Modal --- */}
            <AnimatePresence>
                {successModal.show && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={handleModalClose}
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
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Pin Updated!</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                {successModal.message}
                            </p>
                            <Btn title="Okay, Got it" onClick={handleModalClose} />
                        </motion.div>
                    </div>



                    // <Modal
                    //     isOpen={successModal.show}
                    //     onRequestClose={handleModalClose}
                    //     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl outline-none shadow-2xl p-6 text-center"
                    //     ariaHideApp={false}
                    //     overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    // >
                    //     <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    //         <FaCheckCircle className="text-3xl text-green-500" />
                    //     </div>
                    //     <h2 className="text-xl font-bold text-gray-900 mb-2">Success!</h2>
                    //     <p className="text-sm text-gray-500 mb-6">{successModal.message}</p>
                    //     <button
                    //         onClick={handleModalClose}
                    //         className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:brightness-110"
                    //     >
                    //         Okay, Got it
                    //     </button>
                    // </Modal>
                )}
            </AnimatePresence>

        </div>
    );
};

// --- Reusable PIN Input Component ---
interface PinInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isVisible: boolean;
    toggleVis: () => void;
    placeholder: string;
}
const PinInput = ({ label, name, value, onChange, isVisible, toggleVis, placeholder }: PinInputProps) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaLock className="text-xs" />
            </div>
            <input
                type={isVisible ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-9 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-mono tracking-widest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:tracking-normal placeholder:font-sans"
            />
            <button
                type="button"
                onClick={toggleVis}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
                {isVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
    </div>
);

export default EditTransactionPin;
