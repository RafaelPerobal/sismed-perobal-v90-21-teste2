
import React from 'react';
import { PrescriptionMedicine, Medicine } from '@/types';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface MedicineListProps {
  medicines: PrescriptionMedicine[];
  onRemove: (index: number) => void;
  getMedicineInfo: (id: number) => Medicine | undefined;
}

const MedicineList = ({
  medicines,
  onRemove,
  getMedicineInfo
}: MedicineListProps) => {
  if (medicines.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum medicamento adicionado à receita
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicamento</TableHead>
              <TableHead>Posologia</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((med, index) => {
              const medicine = getMedicineInfo(med.medicamentoId);
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{medicine?.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {medicine?.dosagem} - {medicine?.apresentacao}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{med.posologia}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4">
        <Badge variant="secondary" className="mr-2">
          Total: {medicines.length} medicamentos
        </Badge>
      </div>
    </>
  );
};

export default MedicineList;
