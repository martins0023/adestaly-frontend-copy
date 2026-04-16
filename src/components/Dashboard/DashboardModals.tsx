import Modal from 'react-modal';
import {
  dollar,
  mtn,
  glo,
  airtel,
  etisalat,
  dstv,
  gotv,
  startimes,
  neco,
  waec,
  ekedc,
  aedc,
  ibedc,
  ie,
  kedc,
  jedc,
  kadedc,
  phedc,
} from '../../assets';
import { FaLock, FaTimes, FaSpinner, FaShieldAlt } from 'react-icons/fa';
import { useState } from 'react';
import z from 'zod';
import { UsePatchApi } from '@/src/config/Action';
import toast from 'react-hot-toast';
import Input from '../Form/Input';

Modal.setAppElement('#root');

// --- Reusable Styles ---
const modalStyles = {
  overlay: 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center',
  content:
    'bg-white rounded-t-3xl md:rounded-3xl shadow-lg w-full max-w-md p-7 md:mt-auto md:mb-auto mt-auto mb-0 outline-none',
};

// --- Helper Component for Grid Items ---
const GridItem = ({ item, selectedId, onSelect }) => (
  <button type="button" className="relative cursor-pointer" onClick={() => onSelect(item.id)}>
    <img src={item.img} alt={item.name} className="w-[100px] h-[100px]" />
    {selectedId === item.id && (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center w-[100px] h-[100px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    )}
  </button>
);

// --- 1. Airtime Modal ---
export const AirtimeModal = ({
  isOpen,
  onClose,
  onContinue,
  selectedNetwork,
  setSelectedNetwork,
}) => {
  const networks = [
    { id: 'mtn', img: mtn, name: 'MTN' },
    { id: 'airtel', img: airtel, name: 'Airtel' },
    { id: 'glo', img: glo, name: 'Glo' },
    { id: '9mobile', img: etisalat, name: '9mobile' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={modalStyles.content}
      overlayClassName={modalStyles.overlay}
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onClose}
          type="button" // Prevent form submission
          className="text-black text-xl font-bold hover:rounded-full"
        >
          ✕
        </button>
        <p className="font-semibold text-[16px] text-[#000000]">Select Network</p>
      </div>
      <div className="grid grid-cols-2 gap-[46px] justify-items-center p-3 mt-9">
        {networks.map((net) => (
          <GridItem
            key={net.id}
            item={net}
            selectedId={selectedNetwork}
            onSelect={setSelectedNetwork}
          />
        ))}
      </div>
      <div className="flex items-center justify-center mt-5">
        <button
          onClick={onContinue}
          type="button" // Prevent form submission
          className={`mt-6 bg-primary text-white py-3 px-12 rounded-full w-full ${selectedNetwork ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          disabled={!selectedNetwork}
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

// --- 2. Data Modal ---
export const DataModal = ({ isOpen, onClose, onContinue, selectedNetwork, setSelectedNetwork }) => {
  // Reusing networks logic is fine, or pass props if different
  const networks = [
    { id: 'mtn', img: mtn, name: 'MTN' },
    { id: 'airtel', img: airtel, name: 'Airtel' },
    { id: 'glo', img: glo, name: 'Glo' },
    { id: '9mobile', img: etisalat, name: '9mobile' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={modalStyles.content}
      overlayClassName={modalStyles.overlay}
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-4">
        <button onClick={onClose} type="button" className="text-black text-xl font-bold">
          ✕
        </button>
        <p className="font-semibold text-[16px] text-[#000000]">Select Network</p>
      </div>
      <div className="grid grid-cols-2 gap-[46px] justify-items-center p-3 mt-9">
        {networks.map((net) => (
          <GridItem
            key={net.id}
            item={net}
            selectedId={selectedNetwork}
            onSelect={setSelectedNetwork}
          />
        ))}
      </div>
      <div className="flex items-center justify-center mt-5">
        <button
          onClick={onContinue}
          type="button"
          className={`bg-primary text-white py-3 px-12 rounded-full w-full ${selectedNetwork ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          disabled={!selectedNetwork}
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

// --- 3. Data Pin Modal ---
export const DataPinModal = ({
  isOpen,
  onClose,
  onContinue,
  selectedNetwork,
  setSelectedNetwork,
}) => {
  const networks = [
    { id: 'mtn', img: mtn, name: 'MTN' },
    { id: 'airtel', img: airtel, name: 'Airtel' },
    { id: 'glo', img: glo, name: 'Glo' },
    { id: '9mobile', img: etisalat, name: '9mobile' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={modalStyles.content}
      overlayClassName={modalStyles.overlay}
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-4">
        <button onClick={onClose} type="button" className="text-black text-xl font-bold">
          ✕
        </button>
        <p className="font-semibold text-[16px] text-[#000000]">Select Network</p>
      </div>
      <div className="grid grid-cols-2 gap-[46px] justify-items-center p-3 mt-9">
        {networks.map((net) => (
          <GridItem
            key={net.id}
            item={net}
            selectedId={selectedNetwork}
            onSelect={setSelectedNetwork}
          />
        ))}
      </div>
      <div className="flex items-center justify-center mt-5">
        <button
          onClick={onContinue}
          type="button"
          className={`mt-6 bg-primary text-white py-3 px-12 rounded-full w-full ${selectedNetwork ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          disabled={!selectedNetwork}
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

// --- 4. Cable Modal ---
export const CableModal = ({ isOpen, onClose, onContinue, selectedCable, setSelectedCable }) => {
  const cables = [
    { id: 'dstv', img: dstv, name: 'DSTV' },
    { id: 'gotv', img: gotv, name: 'GOTV' },
    { id: 'startimes', img: startimes, name: 'STARTIMES' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={modalStyles.content}
      overlayClassName={modalStyles.overlay}
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-4">
        <button onClick={onClose} type="button" className="text-black text-xl font-bold">
          ✕
        </button>
        <p className="font-semibold text-[16px] text-[#000000]">Select Cable</p>
      </div>
      <div className="grid grid-cols-2 gap-[46px] justify-items-center p-3 mt-9">
        {cables.map((cable) => (
          <GridItem
            key={cable.id}
            item={cable}
            selectedId={selectedCable}
            onSelect={setSelectedCable}
          />
        ))}
      </div>
      <div className="flex items-center justify-center mt-5">
        <button
          onClick={onContinue}
          type="button"
          className={`mt-6 bg-primary text-white py-3 px-12 rounded-full w-full ${selectedCable ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          disabled={!selectedCable}
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

// --- 5. Exam Modal ---
export const ExamModal = ({ isOpen, onClose, onContinue, selectedExam, setSelectedExam }) => {
  const exams = [
    { id: 'waec', img: waec, name: 'WAEC' },
    { id: 'neco', img: neco, name: 'NECO' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={modalStyles.content}
      overlayClassName={modalStyles.overlay}
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-4">
        <button onClick={onClose} type="button" className="text-black text-xl font-bold">
          ✕
        </button>
        <p className="font-semibold text-[16px] text-[#000000]">Select Exam</p>
      </div>
      <div className="grid grid-cols-2 gap-[46px] justify-items-center p-3 mt-9">
        {exams.map((exam) => (
          <GridItem
            key={exam.id}
            item={exam}
            selectedId={selectedExam}
            onSelect={setSelectedExam}
          />
        ))}
      </div>
      <div className="flex items-center justify-center mt-5">
        <button
          onClick={onContinue}
          type="button"
          className={`mt-6 bg-primary text-white py-3 px-12 rounded-full w-full ${selectedExam ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          disabled={!selectedExam}
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

// --- 6. Electricity Modal ---
export const ElectricityModal = ({
  isOpen,
  onClose,
  onContinue,
  selectedDist,
  setSelectedDist,
  toggleHeight,
}) => {
  const electricities = [
    { id: 'ekedc', img: ekedc, name: 'EKEDC' },
    { id: 'aedc', img: aedc, name: 'AEDC' },
    { id: 'ibedc', img: ibedc, name: 'IBEDC' },
    { id: 'ie', img: ie, name: 'IE' },
    { id: 'kedc', img: kedc, name: 'KEDC' },
    { id: 'jedc', img: jedc, name: 'JEDC' },
    { id: 'kadedc', img: kadedc, name: 'KADEDC' },
    { id: 'phedc', img: phedc, name: 'PHEDC' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={modalStyles.content}
      overlayClassName={modalStyles.overlay}
      ariaHideApp={false}
    >
      <button
        type="button"
        className="cursor-pointer w-[66px] h-1 bg-[#5B5B5B] rounded-3xl mx-auto mb-4"
        onClick={toggleHeight}
        aria-label="Toggle modal height"
      ></button>
      <div className="flex justify-between items-center mb-4">
        <button onClick={onClose} type="button" className="text-black text-xl font-bold">
          ✕
        </button>
        <p className="font-semibold text-[16px] text-[#000000]">Select Distribution</p>
      </div>
      <div className="grid grid-cols-2 gap-6 p-3 mt-6 ml-4 overflow-y-auto no-scrollbar max-h-[60vh] lg:flex lg:items-center lg:justify lg:justify-center">
        {electricities.map((dist) => (
          <GridItem
            key={dist.id}
            item={dist}
            selectedId={selectedDist}
            onSelect={setSelectedDist}
          />
        ))}
      </div>
      <div className="flex items-center justify-center mt-5">
        <button
          onClick={onContinue}
          type="button"
          className={`mt-6 bg-primary text-white py-3 px-12 rounded-full w-full ${selectedDist ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          disabled={!selectedDist}
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

// --- 7. Convert to Cash Modal ---
export const ConvertModal = ({ isOpen, onClose }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className={modalStyles.content}
    overlayClassName={modalStyles.overlay}
    ariaHideApp={false}
  >
    <div className="mb-4">
      <p className="font-semibold text-[16px] text-[#000000]">CONVERT AIRTIME TO CASH</p>
    </div>
    <div className="p-3 mt-9 flex justify-center items-center">
      <img src={dollar} alt="Cashflow" className="w-full h-auto items-center" />
    </div>
    <div className="flex justify-between items-center mb-4">
      <p className="font-normal text-center text-[16px] text-[#000000]">
        Airtime to Cash is not available at the moment, please check back later.
      </p>
    </div>
    <button
      onClick={onClose}
      type="button"
      className="mt-6 bg-[#ffff] font-montserrat py-3 px-20 text-primary border-[1.5px] border-primary rounded-full uppercase w-full h-[60px]"
    >
      HOME
    </button>
  </Modal>
);

// --- 9. PIN Success Modal ---

