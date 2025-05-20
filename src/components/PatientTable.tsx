
import { useState } from "react";
import { Patient } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deletePatient } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, File, Edit, Trash2, Search } from "lucide-react";

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onPrescription?: (patient: Patient) => void;
  onPatientDeleted?: () => void;
}

const PatientTable = ({ 
  patients, 
  onEdit, 
  onPrescription, 
  onPatientDeleted 
}: PatientTableProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPatients = patients.filter(
    (patient) => 
      patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm)
  );

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este paciente?")) {
      deletePatient(id);
      toast({
        title: "Paciente excluído",
        description: "O paciente foi excluído com sucesso",
      });
      if (onPatientDeleted) onPatientDeleted();
    }
  };

  // Função para formatar a data
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou CPF"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CPF</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Dt Nascimento</TableHead>
              <TableHead className="hidden md:table-cell">Cartão SUS</TableHead>
              <TableHead className="hidden lg:table-cell">Contato</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  Nenhum paciente encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.cpf}</TableCell>
                  <TableCell className="font-medium">{patient.nome}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(patient.dataNascimento)}</TableCell>
                  <TableCell className="hidden md:table-cell">{patient.cartaoSus}</TableCell>
                  <TableCell className="hidden lg:table-cell">{patient.contato}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(patient)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        {onPrescription && (
                          <DropdownMenuItem onClick={() => onPrescription(patient)}>
                            <File className="mr-2 h-4 w-4" />
                            <span>Nova Receita</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(patient.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PatientTable;
