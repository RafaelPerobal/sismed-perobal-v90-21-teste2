
import React from 'react';
import { Medicine } from '@/types';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Search } from "lucide-react";

interface MedicineSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredMedicines: Medicine[];
  selectedMedicine: number | null;
  setSelectedMedicine: (id: number | null) => void;
}

const MedicineSearch = ({
  searchTerm,
  setSearchTerm,
  filteredMedicines,
  selectedMedicine,
  setSelectedMedicine
}: MedicineSearchProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar medicamento"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md max-h-60 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Dosagem</TableHead>
              <TableHead>Apresentação</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  Nenhum medicamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredMedicines.map((med) => (
                <TableRow key={med.id} className={med.id === selectedMedicine ? "bg-health-100" : ""}>
                  <TableCell>{med.nome}</TableCell>
                  <TableCell>{med.dosagem}</TableCell>
                  <TableCell>{med.apresentacao}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant={med.id === selectedMedicine ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMedicine(med.id === selectedMedicine ? null : med.id)}
                    >
                      {med.id === selectedMedicine ? "Selecionado" : "Selecionar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default MedicineSearch;
