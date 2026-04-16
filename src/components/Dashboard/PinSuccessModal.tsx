import Modal from "react-modal";

const modalStyles = {
    overlay: 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center',
    content:
        'bg-white rounded-t-3xl md:rounded-3xl shadow-lg w-full max-w-md p-7 md:mt-auto md:mb-auto mt-auto mb-0 outline-none',
};

export const PinSuccessModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className={modalStyles.content}
        overlayClassName={modalStyles.overlay}
        ariaHideApp={false}
    >
        <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                    ></path>
                </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">PIN Set Successfully!</h2>
            <p className="text-sm text-gray-500 mb-8">
                Your account is now secured. You can now perform transactions.
            </p>
            <button
                onClick={onClose}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg hover:brightness-110"
            >
                Continue to Dashboard
            </button>
        </div>
    </Modal>
);