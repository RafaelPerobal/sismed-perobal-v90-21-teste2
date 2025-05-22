
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ObservationsInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ObservationsInput = ({ value, onChange }: ObservationsInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="observacoes">Observações</Label>
      <Textarea
        id="observacoes"
        name="observacoes"
        placeholder="Observações adicionais para a receita"
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full print:border-none print:bg-white"
      />
    </div>
  );
};

export default ObservationsInput;
