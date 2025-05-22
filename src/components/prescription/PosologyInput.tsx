
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PosologyInputProps {
  posologia: string;
  setPosologia: (value: string) => void;
  selectedMedicine: number | null;
  onAddMedicine: () => void;
}

const PosologyInput = ({
  posologia,
  setPosologia,
  selectedMedicine,
  onAddMedicine
}: PosologyInputProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="posologia">Posologia</Label>
        <Textarea
          id="posologia"
          value={posologia}
          onChange={(e) => setPosologia(e.target.value)}
          placeholder="Ex: Tomar 1 comprimido a cada 8 horas por 7 dias"
          rows={3}
          className="w-full print:border-none print:bg-white"
        />
      </div>
      
      <Button
        type="button"
        onClick={onAddMedicine}
        className="w-full bg-health-600 hover:bg-health-700"
        disabled={!selectedMedicine}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Medicamento à Receita
      </Button>
    </>
  );
};

export default PosologyInput;
