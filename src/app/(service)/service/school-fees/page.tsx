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
import BackButton from '@/src/components/BackButton';
import { UseGetApi, UsePostApi } from '@/src/config/Action';

const SchoolFees = () => {
    const router = useRouter();
    const { initializeBillPayment } = useAppContext();

    const [formData, setFormData] = useState({
        schoolId: '',
        schoolName: '',
        studentId: '',
        studentName: '',
        department: '',
        paymentItem: '',
        amount: '',
        email: ''
    });

    const [schools, setSchools] = useState<any[]>([]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loadingSchools, setLoadingSchools] = useState(true);
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        const getInfo = async () => {
            const userInfo = await readSessionPayload();
            setFormData(prev => ({ ...prev, email: userInfo?.email as string }));
        };
        getInfo();
    }, []);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                setLoadingSchools(true);
                const res = await UseGetApi('api/school-fee/schools');
                if (res.success && Array.isArray(res.data)) {
                    setSchools(res.data);
                } else {
                    toast.error("Failed to load schools catalog");
                }
            } catch (error) {
                console.error("Error loading schools", error);
            } finally {
                setLoadingSchools(false);
            }
        };
        fetchSchools();
    }, []);

    const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const schoolId = e.target.value;
        const matchedSchool = schools.find(s => s.serviceId === schoolId);
        setFormData(prev => ({
            ...prev,
            schoolId,
            schoolName: matchedSchool ? matchedSchool.name : '',
            studentName: '',
            department: '',
            isVerified: false
        }));
        setIsVerified(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'studentId') {
            setIsVerified(false);
            setFormData(prev => ({ ...prev, studentName: '', department: '' }));
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVerify = async () => {
        if (!formData.studentId || !formData.schoolId) {
            toast.error("Please select a school and enter your student ID/matric number");
            return;
        }

        setIsVerifying(true);
        try {
            const res = await UsePostApi('api/school-fee/verify-student', {
                matricNumber: formData.studentId,
                schoolId: formData.schoolId
            });

            if (res.success && res.data) {
                setFormData(prev => ({
                    ...prev,
                    studentName: res.data.Customer_Name,
                    department: res.data.Department || "General"
                }));
                setIsVerified(true);
                toast.success("Student details verified successfully!");
            } else {
                toast.error(res.message || "Failed to verify student details");
            }
        } catch (error) {
            toast.error("Student verification error");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!isVerified || !formData.studentName || !formData.amount || !formData.paymentItem) {
            toast.error('Please verify student details and fill all fields.');
            return;
        }

        const numericAmount = Number(formData.amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
           toast.error('Please enter a valid payment amount.');
           return;
        }

        setIsPaying(true);
        try {
            const paymentRef = "SCH-" + Date.now() + "-" + Math.floor(Math.random() * 1e6);
            
            // 1. Log pending school fee payment on backend
            const pendingRes = await UsePostApi('api/school-fee/pending-payment', {
                schoolName: formData.schoolName,
                studentId: formData.studentId,
                studentName: formData.studentName,
                department: formData.department,
                paymentItem: formData.paymentItem,
                amount: numericAmount,
                paymentReference: paymentRef
            });

            if (!pendingRes.success || !pendingRes.data) {
                toast.error(pendingRes.message || "Failed to initialize payment record");
                setIsPaying(false);
                return;
            }

            // 2. Initialize Paystack transaction using the pending record ID
            const payload = {
                email: formData.email,
                totalPrice: formData.amount,
                dataName: `${formData.schoolName} - ${formData.paymentItem}`,
                service_id: pendingRes.data._id, // map pending model ID as serviceID
                variation_code: formData.studentId,
                credit_phone: formData.studentId,
                request_type: "school-fees"
            };

            const response = await initializeBillPayment(payload);

            if (response?.success) {
                const paymentUrl = (response?.data as any)?.payment_url;
                if (paymentUrl) {
                    router.push(paymentUrl);
                } else {
                    toast.error("Payment URL not returned");
                }
            } else {
                toast.error(response?.message || "An error occurred");
            }
        } catch (err) {
            toast.error("Error processing school fee payment");
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <>
        <BackButton />
        <section className="sm:px-10 px-1 mt-15">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-container">
                <div className="w-full max-w-7xl mx-auto pt-4 relative">
                    <BalanceDashboard />
                </div>

                <div className="flex flex-col gap-8 p-3 max-w-xl mx-auto">
                    <div className="text-center mt-4">
                        <h2 className="text-xl font-bold text-gray-800">School Fee Payments</h2>
                        <p className="text-xs text-gray-500 mt-1">Pay school fees and educational dues across Nigerian universities</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* SCHOOL SELECTION */}
                        <div className="flex flex-col gap-2">
                            <select
                                name="schoolId"
                                value={formData.schoolId}
                                onChange={handleSchoolChange}
                                className="bg-white py-4 px-6 text-black rounded-xl outline-none border-none text-[12px] w-full h-[52px] font-medium appearance-none"
                            >
                                <option value="">{loadingSchools ? 'Loading Institutions...' : 'Select School / Institution'}</option>
                                {schools.map((school: any) => (
                                    <option key={school.serviceId} value={school.serviceId}>{school.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* MATRIC / STUDENT ID INPUT */}
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        name="studentId"
                                        placeholder="Matric / Student ID / Exam No"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleVerify}
                                    disabled={isVerifying || !formData.studentId || !formData.schoolId}
                                    className="h-[52px] bg-orange-100 px-4 rounded-xl text-orange-600 font-bold text-xs disabled:opacity-50 transition-colors hover:bg-orange-200"
                                >
                                    {isVerifying ? 'Verifying...' : 'Verify ID'}
                                </button>
                            </div>
                        </div>

                        {/* VERIFIED CUSTOMER BADGE */}
                        {isVerified && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 border border-green-500 rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden"
                            >
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Student Verified</span>
                                <h3 className="text-base font-black text-green-900">{formData.studentName}</h3>
                                <p className="text-xs text-green-700 font-medium">Dept: {formData.department}</p>
                                
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-500 rounded-full opacity-10 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </motion.div>
                        )}

                        {/* PAYMENT ITEM */}
                        <div className="flex flex-col gap-2">
                            <select
                                name="paymentItem"
                                value={formData.paymentItem}
                                onChange={handleChange}
                                className="bg-white py-4 px-6 text-black rounded-xl outline-none border-none text-[12px] w-full h-[52px] font-medium appearance-none"
                            >
                                <option value="">Select Payment Item</option>
                                <option value="School Fees / Tuition">School Fees / Tuition</option>
                                <option value="Hostel Accommodation Dues">Hostel Accommodation Dues</option>
                                <option value="Departmental & Faculty Dues">Departmental & Faculty Dues</option>
                                <option value="Acceptance Fees">Acceptance Fees</option>
                                <option value="Sports & Library Levies">Sports & Library Levies</option>
                            </select>
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
                                    min="1000"
                                />
                            </div>
                        </div>

                        {isVerified && (
                            <div className="flex flex-auto items-center justify-center mt-5 mb-5">
                                <Btn type='submit' title='Initialize Payment' loading={isPaying} />
                            </div>
                        )}
                    </form>
                </div>
            </motion.div>
        </section>
        </>
    );
};

export default SchoolFees;
