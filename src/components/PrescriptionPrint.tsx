
import React from 'react';

interface Medicine {
  id: string;
  nome: string;
  dosagem: string;
  apresentacao: string;
}

interface PrescriptionMedicine {
  medicine_id: string;
  posologia: string;
}

interface Doctor {
  nome: string;
  crm: string;
  especialidade: string;
  telefone?: string;
  email?: string;
}

interface Patient {
  nome: string;
  cpf: string;
  cartao_sus?: string;
  data_nascimento: string;
}

interface Prescription {
  id: string;
  data: string;
  observacoes?: string;
}

interface PrescriptionPrintProps {
  prescription: Prescription;
  doctor: Doctor;
  patient: Patient;
  medicines: PrescriptionMedicine[];
  allMedicines: Medicine[];
}

const PrescriptionPrint = React.forwardRef<HTMLDivElement, PrescriptionPrintProps>(
  ({ prescription, doctor, patient, medicines, allMedicines }, ref) => {
    const getMedicine = (id: string) => allMedicines.find(m => m.id === id);
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    };

    return (
      <div ref={ref} className="prescription-print bg-white p-8 max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="header text-center mb-8 border-b-2 border-health-600 pb-6">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/2da6758a-bafa-4440-9d4f-d8f29482cec7.png" 
              alt="Brasão Perobal" 
              className="h-16 w-16 mr-4"
            />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-health-700">
                PREFEITURA MUNICIPAL DE PEROBAL
              </h1>
              <h2 className="text-xl text-health-600">SECRETARIA MUNICIPAL DE SAÚDE</h2>
              <p className="text-sm text-gray-600">Estado do Paraná</p>
            </div>
          </div>
        </div>

        {/* Informações do Médico */}
        <div className="doctor-info mb-6">
          <h3 className="text-lg font-semibold text-health-700 mb-2">Dados do Médico</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Nome:</strong> {doctor.nome}
            </div>
            <div>
              <strong>CRM:</strong> {doctor.crm}
            </div>
            <div>
              <strong>Especialidade:</strong> {doctor.especialidade}
            </div>
            {doctor.telefone && (
              <div>
                <strong>Telefone:</strong> {doctor.telefone}
              </div>
            )}
          </div>
        </div>

        {/* Informações do Paciente */}
        <div className="patient-info mb-6">
          <h3 className="text-lg font-semibold text-health-700 mb-2">Dados do Paciente</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Nome:</strong> {patient.nome}
            </div>
            <div>
              <strong>CPF:</strong> {patient.cpf}
            </div>
            <div>
              <strong>Data de Nascimento:</strong> {formatDate(patient.data_nascimento)}
            </div>
            {patient.cartao_sus && (
              <div>
                <strong>Cartão SUS:</strong> {patient.cartao_sus}
              </div>
            )}
          </div>
        </div>

        {/* Receita */}
        <div className="prescription-content mb-8">
          <h3 className="text-lg font-semibold text-health-700 mb-4">PRESCRIÇÃO MÉDICA</h3>
          
          <div className="medicines-list space-y-4">
            {medicines.map((prescMed, index) => {
              const medicine = getMedicine(prescMed.medicine_id);
              return (
                <div key={index} className="medicine-item border-l-4 border-health-200 pl-4">
                  <div className="text-base font-medium">
                    {medicine?.nome} - {medicine?.dosagem} ({medicine?.apresentacao})
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    <strong>Posologia:</strong> {prescMed.posologia}
                  </div>
                </div>
              );
            })}
          </div>

          {prescription.observacoes && (
            <div className="observations mt-6">
              <h4 className="font-semibold text-health-700 mb-2">Observações:</h4>
              <p className="text-sm">{prescription.observacoes}</p>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="footer mt-12">
          <div className="flex justify-between items-end">
            <div className="text-sm">
              <p><strong>Data:</strong> {formatDate(prescription.data)}</p>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 w-64 mb-2"></div>
              <p className="text-sm">
                {doctor.nome}<br />
                CRM: {doctor.crm}
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media print {
            .prescription-print {
              font-size: 12pt !important;
              line-height: 1.4 !important;
              color: black !important;
              background: white !important;
            }
            
            .header img {
              max-height: 60px !important;
            }
            
            .medicine-item {
              page-break-inside: avoid;
              margin-bottom: 8pt !important;
            }
            
            h1, h2, h3, h4 {
              color: #1f4788 !important;
              page-break-after: avoid;
            }
            
            .footer {
              page-break-inside: avoid;
            }
          }
        `}</style>
      </div>
    );
  }
);

PrescriptionPrint.displayName = 'PrescriptionPrint';

export default PrescriptionPrint;
