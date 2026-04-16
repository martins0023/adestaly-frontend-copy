"use client"
import BalanceDashboard from '@/src/components/Dashboard/BalanceDashboard';
import Btn from '@/src/components/Form/Btn';
import Input from '@/src/components/Form/Input';
import { useAppContext } from '@/src/context/AppContextProvider';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useEffect, useState, useRef, FormEvent } from 'react';
import { mtn, glo, airtel, etisalat } from '../../../../../public/images/index';
import Image, { StaticImageData } from 'next/image';
import { FaCaretDown } from 'react-icons/fa'; // Install react-icons if you haven't
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

const categorizePlans = (plans: any[]) => {
    const categories: { [key: string]: any[] } = {
        Daily: [],
        Weekly: [],
        Monthly: [],
        OneOff: [],
        Special: [],
        SME: [],
        Others: []
    };

    plans.forEach(plan => {
        const name = plan.name.toLowerCase();
        if (name.includes('sme')) categories.SME.push(plan);
        else if (name.includes('day') || name.includes('hrs') || name.includes('24 hr')) categories.Daily.push(plan);
        else if (name.includes('week') || name.includes('7 day')) categories.Weekly.push(plan);
        else if (name.includes('month') || name.includes('30 day') || name.includes('31 day')) categories.Monthly.push(plan);
        else if (name.includes('Oneoff') || name.includes('oneoff')) categories.OneOff.push(plan);
        else if (name.includes('Special') || name.includes('special')) categories.Special.push(plan);
        else categories.Others.push(plan);
    });

    return categories;
};

const Data = () => {
    const router = useRouter()
    const { getDataPlans, getBillServices, loading, initializeBillPayment } = useAppContext();

    const [formData, setFormData] = useState({
        network: '',
        serviceId: '',
        dataplan: '',
        phoneNumber: '',
        amount: '',
        email: ''
    });

    const [services, setServices] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [activeTab, setActiveTab] = useState('Daily');
    const categorizedPlans = categorizePlans(plans);
    const tabs = Object.keys(categorizedPlans).filter(tab => categorizedPlans[tab].length > 0);

    // Close dropdown when clicking outside

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

    // Fetch Services (Data Types) and Plans when network changes
    useEffect(() => {
        const fetchNetworkData = async () => {
            if (!formData.network) return;

            // Reset dependent fields when network changes
            setFormData(prev => ({ ...prev, serviceId: '', dataplan: '', amount: '' }));

            const serviceRes = await getBillServices("data");

            // 1. Map internal names to API names if they differ
            // e.g., internal '9mobile' needs to find 'etisalat' in the API
            const networkSearchKey = formData.network === '9mobile' ? 'etisalat' : formData.network;

            const dataArr = serviceRes?.data as any[];
            const filteredServices = dataArr?.filter((s: any) =>
                s.serviceID.toLowerCase().includes(networkSearchKey.toLowerCase())
            ) || [];

            setServices(filteredServices);

            // Fetch plans for the selected network
            // const planRes = await getDataPlans(formData.network);
            // setPlans(planRes?.data || []);
        };
        fetchNetworkData();
    }, [formData.network]);



    const handleServiceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const serviceId = e.target.value;
        setFormData(prev => ({ ...prev, serviceId }))
        // Fetch plans for the selected network
        const planRes = await getDataPlans(serviceId);
        const planData = planRes?.data as any;
        console.log(planData?.content?.variations)
        setPlans(planData?.content?.variations || []);
    }

    // Update amount when a plan is selected
    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const planId = e.target.value;
        const selectedPlan = plans.find(p => p.variation_code === planId || p.dataplan_id === planId);
        setFormData(prev => ({
            ...prev,
            dataplan: planId,
            amount: selectedPlan ? selectedPlan.variation_amount : ''
        }));
    };

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
        console.log(formData.phoneNumber, formData.dataplan)
        if (!formData.phoneNumber || !formData.dataplan) {
            toast.error('Please fill all required fields.');
            return;
        }

        const phoneRegex = /^0[789][01]\d{8}$/;
        if (!phoneRegex.test(formData.phoneNumber.replace(/\s+/g, ''))) {
            toast.error('Please enter a valid 11-digit Nigerian phone number.');
            return;
        }


        // setSubmitting(true);


        const selectedPlanDetails = plans.find((p) => p.variation_code === formData.dataplan);

        // Payload matching backend bill.controller.ts: initializePayemnt
        const payload = {
            email: formData.email,
            totalPrice: formData.amount,
            dataName: selectedPlanDetails?.name || 'Data Bundle',
            service_id: formData.serviceId,
            variation_code: formData.dataplan,
            credit_phone: formData.phoneNumber,
            request_type: "data"
        };

        const response = await initializeBillPayment(payload);

        if (response?.success) {
            // Redirect to Paystack payment URL
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
                                {/* <label className="text-white text-[12px] block mb-2">Network</label> */}
                                <button
                                    type="button"
                                    onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                                    className="w-[80px] h-[52px] bg-white rounded-xl flex items-center justify-between px-2 border border-gray-300 shadow-sm hover:bg-gray-50 transition-all"
                                >
                                    {formData.network ? (
                                        <Image src={networkLogos[formData.network]} alt="selected" width={30} height={30} className="rounded-md" />
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
                                {/* <label className="text-white text-[12px] block mb-2">Phone Number</label> */}
                                <Input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="0803 000 0000"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* SERVICE TYPE */}
                        <div className="flex flex-col gap-2">
                            {/* <label className="text-white text-[12px]">Data Type</label> */}
                            <select
                                name="serviceId"
                                value={formData.serviceId}
                                onChange={handleServiceChange}
                                className="bg-white py-4 px-6 text-black rounded-xl outline-none border-none text-[12px] w-full h-[52px] font-medium appearance-none"
                            >
                                <option>{loading.service ? 'Loading...' : 'Select Data Type'}</option>
                                {services.map((service: any) => (
                                    <option key={service.serviceID || service.id} value={service.serviceID || service.id}>{service.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* DATA PLAN */}
                        {/* <div className="flex flex-col gap-2">
                            <select
                                name="dataplan"
                                value={formData.dataplan}
                                onChange={handlePlanChange}
                                className="bg-white py-4 px-6 text-black rounded-xl outline-none border-none text-[12px] w-full h-[52px] font-medium">
                                <option>{loading.plan ? 'Loading...' : 'Select Data Plan'}</option>
                                {plans.map((plan: any) => (
                                    <option key={plan.variation_code} value={plan.variation_code}>
                                        {plan.name || plan.value} - ₦{plan.amount}
                                    </option>
                                ))}
                            </select>
                        </div> */}

                        {/* TAB NAVIGATION */}
                        {plans.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 border border-gray-200'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* PLAN CARDS GRID */}
                        <div className="grid grid-cols-3 gap-3 mt-2">
                            {categorizedPlans[activeTab]?.map((plan: any) => (
                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                    key={plan.variation_code}
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        dataplan: plan.variation_code,
                                        amount: plan.variation_amount
                                    }))}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1 relative overflow-hidden ${formData.dataplan === plan.variation_code
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-white bg-white'
                                        }`}
                                >
                                    <p className="text-[14px] font-bold text-gray-800">
                                        {plan.name.split('-')[1] || plan.name.split(' ')[2] || plan.name}
                                    </p>
                                    <p className="text-[12px] text-gray-500 font-medium">
                                        ₦{Number(plan.variation_amount).toLocaleString()}
                                    </p>

                                    {formData.dataplan === plan.variation_code && (
                                        <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>



                        <div className="flex flex-col gap-2">
                            <div className="flex-1">
                                {/* <label className="text-white text-[12px] block mb-2">Phone Number</label> */}
                                <Input
                                    type="text"
                                    name="amount"
                                    placeholder="Amount to Pay"
                                    value={formData.amount ? `₦${formData.amount}` : ""}
                                    onChange={handleChange}
                                    readOnly
                                    disabled
                                    className="bg-gray-200 text-gray-500 font-bold"
                                />
                            </div>
                        </div>

                        <div className="flex flex-auto items-center justify-center mt-10 mb-5">
                            <Btn type='submit' title='Buy Data' loading={loading.payment} />
                        </div>
                    </form>
                </div>
            </motion.div>
        </section>
    );
};

export default Data;