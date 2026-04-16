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

const Exam = () => {
    const router = useRouter()
    const { getBillServices, getDataPlans, loading, initializeBillPayment } = useAppContext();

    const [formData, setFormData] = useState({
        serviceId: '',
        variation_code: '',
        phoneNumber: '',
        amount: '',
        email: ''
    });

    const [services, setServices] = useState<any[]>([]);
    const [variations, setVariations] = useState<any[]>([]);
    const [showAllVariations, setShowAllVariations] = useState(false);

    const visibleVariations = showAllVariations ? variations : variations.slice(0, 6);

    useEffect(() => {
        const getInfo = async () => {
            const userInfo = await readSessionPayload();
            setFormData(prev => ({ ...prev, phoneNumber: userInfo?.phone as string || '', email: userInfo?.email as string }));
        };
        getInfo();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            const serviceRes = await getBillServices("education"); 
            const dataArr = serviceRes?.data;
            setServices(Array.isArray(dataArr) ? dataArr : (dataArr as any)?.content || []);
        };
        fetchServices();
    }, [getBillServices]);

    const handleServiceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const serviceId = e.target.value;
        setFormData(prev => ({ ...prev, serviceId, variation_code: '', amount: '' }));
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const planId = e.target.value;
        const selectedPlan = variations.find(p => p.variation_code === planId || p.dataplan_id === planId);
        setFormData(prev => ({
            ...prev,
            variation_code: planId,
            amount: selectedPlan ? selectedPlan.variation_amount || selectedPlan.amount : ''
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!formData.phoneNumber || !formData.variation_code || !formData.serviceId) {
            toast.error('Please fill all required fields.');
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
            dataName: `Education Pin`,
            service_id: formData.serviceId,
            variation_code: formData.variation_code,
            credit_phone: formData.phoneNumber, // Expected to receive the pin or just for records
            request_type: "education"
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

                        {/* EXAM PROVIDER */}
                        <div className="flex flex-col gap-2">
                            <select
                                name="serviceId"
                                value={formData.serviceId}
                                onChange={handleServiceChange}
                                className="bg-white py-4 px-6 text-black rounded-xl outline-none border-none text-[12px] w-full h-[52px] font-medium appearance-none"
                            >
                                <option value="">{loading.service ? 'Loading Providers...' : 'Select Exam Board'}</option>
                                {services.map((service: any) => (
                                    <option key={service.serviceID || service.id} value={service.serviceID || service.id}>{service.name}</option>
                                ))}
                            </select>
                        </div>

                         {/* PIN TYPE/QUANTITY CARDS GRID */}
                         {variations.length > 0 && (
                            <div className="flex flex-col gap-3 mt-2">
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  {visibleVariations.map((v: any) => (
                                      <motion.div
                                          whileTap={{ scale: 0.95 }}
                                          key={v.variation_code}
                                          onClick={() => setFormData(prev => ({
                                              ...prev,
                                              variation_code: v.variation_code,
                                              amount: v.variation_amount || v.amount
                                          }))}
                                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1 relative overflow-hidden ${formData.variation_code === v.variation_code
                                                  ? 'border-orange-500 bg-orange-50'
                                                  : 'border-white bg-white'
                                              }`}
                                      >
                                          <p className="text-[14px] font-bold text-gray-800">
                                              {v.name}
                                          </p>
                                          <p className="text-[12px] text-gray-500 font-medium">
                                              ₦{Number(v.variation_amount || v.amount).toLocaleString()}
                                          </p>

                                          {formData.variation_code === v.variation_code && (
                                              <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                                                  <div className="w-2 h-2 bg-white rounded-full" />
                                              </div>
                                          )}
                                      </motion.div>
                                  ))}
                              </div>
                              {variations.length > 6 && (
                                  <button
                                      type="button"
                                      onClick={() => setShowAllVariations(!showAllVariations)}
                                      className="text-orange-500 font-bold text-sm mx-auto hover:bg-orange-50 px-4 py-2 rounded-lg transition-all"
                                  >
                                      {showAllVariations ? 'Show Less' : 'Show More Options'}
                                  </button>
                              )}
                            </div>
                         )}

                        {/* PHONE NUMBER (For delivery typically) */}
                        <div className="flex flex-col gap-2">
                            <Input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number (for PIN delivery)"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>

                        {/* AMOUNT INPUT (Readonly) */}
                        <div className="flex flex-col gap-2">
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₦</span>
                                <Input
                                    type="text"
                                    name="amount"
                                    placeholder="Amount to Pay"
                                    className="pl-8 bg-gray-200 text-gray-500 font-bold"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    readOnly
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="flex flex-auto items-center justify-center mt-10 mb-5">
                            <Btn type='submit' title='Buy Exam Pin' loading={loading.payment} />
                        </div>
                    </form>
                </div>
            </motion.div>
        </section>
    );
};

export default Exam;
