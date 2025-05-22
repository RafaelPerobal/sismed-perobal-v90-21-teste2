
import React from 'react';
import { Doctor } from '@/types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedDoctorId: number;
  onChange: (value: string) => void;
}

const DoctorSelector = ({
  doctors,
  selectedDoctorId,
  onChange
}: DoctorSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="medicoId">Médico</Label>
      <Select
        value={selectedDoctorId.toString()}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione o médico" />
        </SelectTrigger>
        <SelectContent>
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id.toString()}>
              {doctor.nome} - CRM: {doctor.crm}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DoctorSelector;
