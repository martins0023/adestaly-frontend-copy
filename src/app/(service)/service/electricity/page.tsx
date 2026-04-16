"use client"
import BalanceDashboard from '@/src/components/Dashboard/BalanceDashboard';
import Btn from '@/src/components/Form/Btn';
import Input from '@/src/components/Form/Input';
import { useAppContext } from '@/src/context/AppContextProvider';
import { motion } from 'framer-motion';
import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { readSessionPayload } from '@/src/config/session';

const Electricity = () => {
    const router = useRouter()
    const { getBillServices, getDataPlans, loading, initializeBillPayment, verifyBillerCode } = useAppContext();

    const [formData, setFormData] = useState({
        serviceId: '',
        variation_code: '',
        meterNumber: '',
        amount: '',
        email: ''
    });

    const [services, setServices] = useState<any[]>([]);
    const [variations, setVariations] = useState<any[]>([]);
    const [billerName, setBillerName] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        const getInfo = async () => {
            const userInfo = await readSessionPayload();
            setFormData(prev => ({ ...prev, email: userInfo?.email as string }));
        };
        getInfo();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            const serviceRes = await getBillServices("electricity-bill");
            const dataArr = serviceRes?.data;
            setServices(Array.isArray(dataArr) ? dataArr : (dataArr as any)?.content || []);
        };
        fetchServices();
    }, [getBillServices]);

    const handleServiceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const serviceId = e.target.value;
        setBillerName('');
        setFormData(prev => ({ ...prev, serviceId, variation_code: '' }));
        if(!serviceId) {
            setVariations([]);
            return;
        }

        const planRes = await getDataPlans(serviceId);
        const planData = planRes?.data as any;
        setVariations(planData?.content?.variations || []);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'meterNumber') setBillerName('');
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVerify = async () => {
        if (!formData.meterNumber || !formData.serviceId || !formData.variation_code) {
            toast.error("Please fill provider, meter type, and meter number fully to verify.");
            return;
        }

        setIsVerifying(true);
        setBillerName('');
        try {
            const res = await verifyBillerCode(formData.meterNumber, formData.serviceId, formData.variation_code);
            if (res?.success && (res?.data as any)?.Customer_Name) {
                setBillerName((res.data as any).Customer_Name);
                toast.success('Meter Verification Successful');
            } else {
                toast.error(res?.message || 'Invalid Meter constraints');
            }
        } catch (error) {
            toast.error('Meter Verification Failed');
        } finally {
            setIsVerifying(false);
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!formData.meterNumber || !formData.amount || !formData.serviceId) {
            toast.error('Please fill all required fields.');
            return;
        }

        const numericAmount = Number(formData.amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
           toast.error('Please enter a valid amount.');
           return;
        }

        const payload = {
            email: formData.email,
            totalPrice: formData.amount,
            dataName: `Electricity Payment`,
            service_id: formData.serviceId,
            variation_code: formData.variation_code || formData.serviceId, // Fallback if no variations
            credit_phone: formData.meterNumber, // API expects identifier here usually for VTpass, mapping credit_phone to meter
            request_type: "electricity-bill"
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

                        {/* SERVICE TYPE */}
                        <div className="flex flex-col gap-2">
                            <select
                                name="serviceId"
                                value={formData.serviceId}
                                onChange={handleServiceChange}
                                className="bg-white py-4 px-6 text-black rounded-xl outline-none border-none text-[12px] w-full h-[52px] font-medium appearance-none"
                            >
                                <option value="">{loading.service ? 'Loading Providers...' : 'Select Electricity Provider'}</option>
                                {services.map((service: any) => (
                                    <option key={service.serviceID || service.id} value={service.serviceID || service.id}>{service.name}</option>
                                ))}
                            </select>
                        </div>

                         {/* VARIATION TYPE (Optional for some providers) */}
                         {variations.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    {variations.map((v: any) => (
                                        <motion.div
                                            whileTap={{ scale: 0.95 }}
                                            key={v.variation_code}
                                            onClick={() => {
                                                setBillerName('');
                                                setFormData(prev => ({
                                                    ...prev,
                                                    variation_code: v.variation_code
                                                }))
                                            }}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between relative overflow-hidden ${formData.variation_code === v.variation_code
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-white bg-white'
                                                }`}
                                        >
                                            <p className="text-[14px] font-bold text-gray-800">
                                                {v.name}
                                            </p>
                                            {formData.variation_code === v.variation_code && (
                                                <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* METER NUMBER INPUT */}
                        <div className="flex flex-col gap-2">
                            {/* <div className="flex gap-2"> */}
                                <Input
                                    type="text"
                                    name="meterNumber"
                                    placeholder="Meter Number"
                                    value={formData.meterNumber}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={handleVerify}
                                    disabled={isVerifying || !formData.meterNumber || !formData.variation_code}
                                    className="self-end bg-orange-100 px-4 py-2 rounded-lg text-orange-600 font-bold text-sm disabled:opacity-50 transition-colors hover:bg-orange-200"
                                >
                                    {isVerifying ? 'Verifying...' : 'Verify'}
                                </button>
                            {/* </div> */}
                        </div>

                        {/* VERIFIED CUSTOMER BADGE */}
                        {billerName && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border border-green-500 rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden"
                            >
                                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Customer Verified</span>
                                <h3 className="text-lg font-black text-green-900">{billerName}</h3>
                                
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-500 rounded-full opacity-10 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </motion.div>
                        )}

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
                                    min="100"
                                />
                            </div>
                        </div>

                        {billerName && (
                            <div className="flex flex-auto items-center justify-center mt-5 mb-5">
                                <Btn type='submit' title='Pay Electricity' loading={loading.payment} />
                            </div>
                        )}
                    </form>
                </div>
            </motion.div>
        </section>
    );
};

export default Electricity;
