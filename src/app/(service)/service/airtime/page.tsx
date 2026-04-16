"use client"
import BalanceDashboard from '@/src/components/Dashboard/BalanceDashboard';
import Btn from '@/src/components/Form/Btn';
import Input from '@/src/components/Form/Input';
import { useAppContext } from '@/src/context/AppContextProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, FormEvent } from 'react';
import { mtn, glo, airtel, etisalat } from '../../../../../public/images/index';
import Image, { StaticImageData } from 'next/image';
import { FaCaretDown } from 'react-icons/fa';
import { readSessionPayload } from '@/src/config/session';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const getNetworkByPrefix = (number: string) => {
    if (!number || number.length < 4) return "";
    const prefix = number.slice(0, 4);
    const networks: { [key: string]: string[] } = {
        mtn: ['0703', '0706', '0803', '0806', '0810', '0813', '0814', '0816', '0903', '0906', '0913', '0702'],
        airtel: ['0701', '0708', '0802', '0808', '0812', '0901', '0902', '0904', '0907', '0912'],
        glo: ['0705', '0805', '0807', '0811', '0815', '0905', '0915'],
        '9mobile': ['0809', '0817', '0818', '0908', '0909'],
    };
    for (const [network, prefixes] of Object.entries(networks)) {
        if (prefixes.includes(prefix)) return network;
    }
    return "";
};

const networkOptions = [
    { id: 'mtn', name: 'MTN', img: mtn },
    { id: 'airtel', name: 'Airtel', img: airtel },
    { id: 'glo', name: 'Glo', img: glo },
    { id: '9mobile', name: '9mobile', img: etisalat },
];

const networkLogos: { [key: string]: StaticImageData | string } = { mtn, glo, airtel, '9mobile': etisalat };

const Airtime = () => {
    const router = useRouter()
    const { getBillServices, loading, initializeBillPayment } = useAppContext();

    const [formData, setFormData] = useState({
        network: '',
        serviceId: '',
        phoneNumber: '',
        amount: '',
        email: ''
    });

    const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial load: Fetch User Info
    useEffect(() => {
        const getInfo = async () => {
            const userInfo = await readSessionPayload();
            const phone = userInfo?.phone as string || "";
            const detected = getNetworkByPrefix(phone);
            setFormData(prev => ({ ...prev, phoneNumber: phone, network: detected || prev.network, email: userInfo?.email as string }));
        };
        getInfo();
    }, []);

    // Fetch Services when network changes
    useEffect(() => {
        const fetchNetworkData = async () => {
            if (!formData.network) return;

            setFormData(prev => ({ ...prev, serviceId: '' }));
            const serviceRes = await getBillServices("airtime");

            const networkSearchKey = formData.network === '9mobile' ? 'etisalat' : formData.network;

            const dataArr = serviceRes?.data as any[];
            const filteredServices = dataArr?.filter((s: any) =>
                s.serviceID.toLowerCase().includes(networkSearchKey.toLowerCase())
            ) || [];

            if(filteredServices.length > 0) {
               setFormData(prev => ({ ...prev, serviceId: filteredServices[0].serviceID || filteredServices[0].id }));
            }
        };
        fetchNetworkData();
    }, [formData.network, getBillServices]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNetworkDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === "phoneNumber") {
                const detected = getNetworkByPrefix(value);
                if (detected) newData.network = detected;
            }
            return newData;
        });
    };

    const selectNetwork = (id: string) => {
        setFormData(prev => ({ ...prev, network: id }));
        setShowNetworkDropdown(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!formData.phoneNumber || !formData.amount || !formData.serviceId) {
            toast.error('Please fill all required fields.');
            return;
        }

        const numericAmount = Number(formData.amount);
        if (isNaN(numericAmount) || numericAmount < 50) {
           toast.error('Minimum airtime amount is ₦50.');
           return;
        }

        const phoneRegex = /^0[789][01]\d{8}$/;
        if (!phoneRegex.test(formData.phoneNumber.replace(/\s+/g, ''))) {
            toast.error('Please enter a valid 11-digit Nigerian phone number.');
            return;
        }

        const payload = {
            email: formData.email,
            totalPrice: formData.amount,
            dataName: `Airtime Topup`,
            service_id: formData.serviceId,
            variation_code: formData.serviceId, // For airtime, variation_code is sometimes required but typically matches service_id or "NONE"
            credit_phone: formData.phoneNumber,
            request_type: "airtime"
        };

        const response = await initializeBillPayment(payload);

        if (response?.success) {
            const paymentUrl = (response?.data as any)?.payment_url;
            if (paymentUrl) {
                router.push(paymentUrl);
            } else {
                toast.error("Payment URL not provided");
            }
        } else {
            toast.error(response?.message || "An error occurred");
        }
    }

    return (
        <section className="sm:px-10 px-1">
            <motion.div initial="hidden" animate="visible" className="dashboard-container">
                <div className="w-full max-w-7xl mx-auto pt-4">
                    <BalanceDashboard />
                </div>

                <div className="flex flex-col gap-8 p-3 max-w-xl mx-auto">
                    <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>

                        <div className="flex gap-2 items-start">
                            {/* CUSTOM NETWORK SELECTOR */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                                    className="w-[80px] h-[52px] bg-white rounded-xl flex items-center justify-between px-2 border border-gray-300 shadow-sm hover:bg-gray-50 transition-all"
                                >
                                    {formData.network && networkLogos[formData.network] ? (
                                        <Image src={networkLogos[formData.network] as string | StaticImageData} alt="selected" width={30} height={30} className="rounded-md" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 rounded-md animate-pulse" />
                                    )}
                                    <FaCaretDown className="text-gray-400 text-[10px]" />
                                </button>

                                {/* DROPDOWN MENU */}
                                <AnimatePresence>
                                    {showNetworkDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 5 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-2 grid grid-cols-1 gap-1 w-[140px]"
                                        >
                                            {networkOptions.map((net) => (
                                                <div
                                                    key={net.id}
                                                    onClick={() => selectNetwork(net.id)}
                                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${formData.network === net.id ? 'bg-orange-50' : 'hover:bg-gray-100'}`}
                                                >
                                                    <Image src={net.img} alt={net.name} width={24} height={24} className="rounded" />
                                                    <span className="text-[12px] font-bold text-gray-700 uppercase">{net.name}</span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* PHONE NUMBER INPUT */}
                            <div className="flex-1">
                                <Input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="0803 000 0000"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* AMOUNT INPUT */}
                        <div className="flex flex-col gap-2">
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₦</span>
                                <Input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount to Pay"
                                    className="pl-8"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    min="50"
                                />
                            </div>
                        </div>

                        <div className="flex flex-auto items-center justify-center mt-10 mb-5">
                            <Btn type='submit' title='Buy Airtime' loading={loading.payment} />
                        </div>
                    </form>
                </div>
            </motion.div>
        </section>
    );
};

export default Airtime;