
import { Patient, Medicine, Doctor, Prescription } from "../types";

// Chaves para o localStorage
const KEYS = {
  PATIENTS: 'sistema-perobal-pacientes',
  MEDICINES: 'sistema-perobal-medicamentos',
  DOCTORS: 'sistema-perobal-medicos',
  PRESCRIPTIONS: 'sistema-perobal-receitas'
};

// Pacientes
export const getPatients = (): Patient[] => {
  const data = localStorage.getItem(KEYS.PATIENTS);
  return data ? JSON.parse(data) : [];
};

export const savePatients = (patients: Patient[]) => {
  localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
};

export const addPatient = (patient: Omit<Patient, 'id'>): Patient => {
  const patients = getPatients();
  const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
  
  const newPatient = { ...patient, id: newId };
  patients.push(newPatient);
  savePatients(patients);
  return newPatient;
};

export const updatePatient = (patient: Patient): Patient => {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === patient.id);
  
  if (index !== -1) {
    patients[index] = patient;
    savePatients(patients);
  }
  
  return patient;
};

export const deletePatient = (id: number): void => {
  const patients = getPatients();
  const filtered = patients.filter(p => p.id !== id);
  savePatients(filtered);
};

export const findPatientByCpf = (cpf: string): Patient | undefined => {
  const patients = getPatients();
  return patients.find(p => p.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, ''));
};

export const findPatientsByName = (name: string): Patient[] => {
  if (!name.trim()) return [];
  
  const patients = getPatients();
  const searchTerm = name.toLowerCase().trim();
  
  return patients.filter(p => p.nome.toLowerCase().includes(searchTerm));
};

export const getPatientById = (id: number): Patient | undefined => {
  const patients = getPatients();
  return patients.find(p => p.id === id);
};

// Medicamentos
export const getMedicines = (): Medicine[] => {
  const data = localStorage.getItem(KEYS.MEDICINES);
  return data ? JSON.parse(data) : [];
};

export const saveMedicines = (medicines: Medicine[]) => {
  localStorage.setItem(KEYS.MEDICINES, JSON.stringify(medicines));
};

export const addMedicine = (medicine: Omit<Medicine, 'id'>): Medicine => {
  const medicines = getMedicines();
  const newId = medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1;
  
  const newMedicine = { ...medicine, id: newId };
  medicines.push(newMedicine);
  saveMedicines(medicines);
  return newMedicine;
};

export const updateMedicine = (medicine: Medicine): Medicine => {
  const medicines = getMedicines();
  const index = medicines.findIndex(m => m.id === medicine.id);
  
  if (index !== -1) {
    medicines[index] = medicine;
    saveMedicines(medicines);
  }
  
  return medicine;
};

export const deleteMedicine = (id: number): void => {
  const medicines = getMedicines();
  const filtered = medicines.filter(m => m.id !== id);
  saveMedicines(filtered);
};

export const getMedicineById = (id: number): Medicine | undefined => {
  const medicines = getMedicines();
  return medicines.find(m => m.id === id);
};

// Médicos
export const getDoctors = (): Doctor[] => {
  const data = localStorage.getItem(KEYS.DOCTORS);
  return data ? JSON.parse(data) : [];
};

export const saveDoctors = (doctors: Doctor[]) => {
  localStorage.setItem(KEYS.DOCTORS, JSON.stringify(doctors));
};

export const addDoctor = (doctor: Omit<Doctor, 'id'>): Doctor => {
  const doctors = getDoctors();
  const newId = doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
  
  const newDoctor = { ...doctor, id: newId };
  doctors.push(newDoctor);
  saveDoctors(doctors);
  return newDoctor;
};

export const updateDoctor = (doctor: Doctor): Doctor => {
  const doctors = getDoctors();
  const index = doctors.findIndex(d => d.id === doctor.id);
  
  if (index !== -1) {
    doctors[index] = doctor;
    saveDoctors(doctors);
  }
  
  return doctor;
};

export const deleteDoctor = (id: number): void => {
  const doctors = getDoctors();
  const filtered = doctors.filter(d => d.id !== id);
  saveDoctors(filtered);
};

export const getDoctorById = (id: number): Doctor | undefined => {
  const doctors = getDoctors();
  return doctors.find(d => d.id === id);
};

// Receitas
export const getPrescriptions = (): Prescription[] => {
  const data = localStorage.getItem(KEYS.PRESCRIPTIONS);
  return data ? JSON.parse(data) : [];
};

export const savePrescriptions = (prescriptions: Prescription[]) => {
  localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
};

export const addPrescription = (prescription: Omit<Prescription, 'id'>): Prescription => {
  const prescriptions = getPrescriptions();
  const newId = prescriptions.length > 0 
    ? Math.max(...prescriptions.map(p => p.id)) + 1 
    : 1;
  
  const newPrescription = { ...prescription, id: newId };
  prescriptions.push(newPrescription);
  savePrescriptions(prescriptions);
  return newPrescription;
};

export const updatePrescription = (prescription: Prescription): Prescription => {
  const prescriptions = getPrescriptions();
  const index = prescriptions.findIndex(p => p.id === prescription.id);
  
  if (index !== -1) {
    prescriptions[index] = prescription;
    savePrescriptions(prescriptions);
  }
  
  return prescription;
};

export const deletePrescription = (id: number): void => {
  const prescriptions = getPrescriptions();
  const filtered = prescriptions.filter(p => p.id !== id);
  savePrescriptions(filtered);
};

export const getPrescriptionsByPatientId = (patientId: number): Prescription[] => {
  const prescriptions = getPrescriptions();
  return prescriptions.filter(p => p.pacienteId === patientId);
};

export const getPrescriptionById = (id: number): Prescription | undefined => {
  const prescriptions = getPrescriptions();
  return prescriptions.find(p => p.id === id);
};
