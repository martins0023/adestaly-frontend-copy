"use client"

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';
import {
    FaUser,
    FaPhone,
    FaMapMarkerAlt,
    FaChevronLeft,
    FaCheckCircle,
    FaUserCircle,
    FaCamera
} from 'react-icons/fa';
import { useAppContext } from '@/src/context/AppContextProvider';
import { UseGetApi } from '@/src/config/Action';
import toast from 'react-hot-toast';
import Input from '@/src/components/Form/Input';
import Btn from '@/src/components/Form/Btn';
import { z } from 'zod';
import { nigerianStates } from '@/src/constants/states';
import Image from 'next/image';

const profileSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    middlename: z.string().optional(),
    phone: z.string().min(10, "Invalid phone number"),
    state: z.string().min(1, "State is required"),
});

type ProfileForm = z.infer<typeof profileSchema>;

const EditProfile = () => {
    const router = useRouter();
    const { loading, updateUser } = useAppContext(); // Added user from context

    // --- State ---
    const [showSuccess, setShowSuccess] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState<ProfileForm>({
        firstname: '',
        lastname: '',
        middlename: '',
        phone: '',
        state: '',
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // For UI Preview
    const [imageFile, setImageFile] = useState<File | null>(null);    // For Backend Upload
    const [isHovered, setIsHovered] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});

    // --- Effects ---
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await UseGetApi(`api/user`)
                if (response.success) {
                    setFormData({
                        firstname: response.data?.firstname || "",
                        lastname: response.data?.lastname || "",
                        middlename: response.data?.middlename || "",
                        phone: response.data?.phone || "",
                        state: response.data?.state || "",
                    });
                    // If user already has an image, set it as preview
                    if (response.data?.image) setPreviewUrl(response.data.image);
                }
            } catch (err) {
                toast.error("Failed to fetch user data");
            } finally {
                setFetching(false)
            }
        }
        fetchUserData()
    }, []);

    // --- Handlers ---
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create a local URL for the preview
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleChange = <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        const result = profileSchema.shape[field].safeParse(value);
        setErrors((prev) => ({ ...prev, [field]: result.success ? undefined : result.error.issues[0].message }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const result = profileSchema.safeParse(formData);
        if (!result.success) {
            toast.error("Please fix the errors in the form");
            return;
        }

        // --- Prepare FormData ---
        const data = new FormData();
        data.append('firstname', formData.firstname);
        data.append('lastname', formData.lastname);
        data.append('middlename', formData.middlename || "");
        data.append('phone', formData.phone);
        data.append('state', formData.state);

        // Append the file if a new one was selected
        if (imageFile) {
            data.append('image', imageFile);
        }

        // Pass the FormData object to your update function
        const response = await updateUser(data);

        if (response?.success) {
            setShowSuccess(true);
        } else {
            toast.error(response?.message || "Update failed");
        }
    };

    const renderProfilePic = () => {
        if (previewUrl) {
            return (
                <Image
                    src={previewUrl}
                    alt="Profile Preview"
                    fill
                    className="object-cover rounded-full"
                />
            );
        }
        return (
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-primary border-2 border-gray-300 overflow-hidden">
                <FaUserCircle className="w-full h-full text-gray-400" />
            </div>
        );
    };

    if (fetching) return <div className="p-10 text-center">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-23">
            <motion.div
                className="max-w-md mx-auto px-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="py-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 active:scale-90 transition-transform"
                    >
                        <FaChevronLeft size={14} />
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    {/* Image Upload Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div
                            className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {renderProfilePic()}
                            <label className={`absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                                <FaCamera className="text-white text-xl" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">Change Photo</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Personal Details</h2>
                        <p className="text-xs text-gray-500">Update your basic information</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 ml-1">FIRST NAME</label>
                                <Input
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={(e) => handleChange("firstname", e.target.value)}
                                    placeholder="John"
                                    icon={<FaUser />}
                                    error={!!errors.firstname}
                                    hint={errors.firstname}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 ml-1">LAST NAME</label>
                                <Input
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={(e) => handleChange("lastname", e.target.value)}
                                    placeholder="Doe"
                                    icon={<FaUser />}
                                    error={!!errors.lastname}
                                    hint={errors.lastname}
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 ml-1">MIDDLE NAME <span className="text-gray-400 text-[10px]">(Optional)</span> </label>
                                <Input
                                    name="middlename"
                                    value={formData.middlename}
                                    onChange={(e) => handleChange("middlename", e.target.value)}
                                    placeholder="Smith"
                                    icon={<FaPhone />}
                                    error={!!errors.middlename}
                                    hint={errors.middlename}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 ml-1">PHONE NUMBER</label>
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    placeholder="080..."
                                    icon={<FaPhone />}
                                    error={!!errors.phone}
                                    hint={errors.phone}
                                />
                            </div>

                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 ml-1">SELECT STATE</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <FaMapMarkerAlt />
                                </div>
                                <select
                                    value={formData.state}
                                    onChange={(e) => handleChange("state", e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl text-sm font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none ${errors.state ? 'border-red-500' : 'border-gray-200'}`}
                                >
                                    <option value="" disabled>Select State</option>
                                    {nigerianStates.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.state && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.state}</p>}
                        </div>

                        <Btn
                            title="Save Changes"
                            type="submit"
                            className="w-full py-4"
                            loading={loading.login}
                        />
                    </form>
                </div>
            </motion.div>

            {/* Success Modal */}
            <Modal
                isOpen={showSuccess}
                onRequestClose={() => { setShowSuccess(false); router.push('/profile'); }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl p-6 text-center outline-none shadow-2xl"
                overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-3xl text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Updated!</h2>
                <p className="text-sm text-gray-500 mb-6">Your changes have been saved successfully.</p>
                <button
                    onClick={() => { setShowSuccess(false); router.push('/profile'); }}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold"
                >
                    Return to Profile
                </button>
            </Modal>
        </div>
    );
};

export default EditProfile;