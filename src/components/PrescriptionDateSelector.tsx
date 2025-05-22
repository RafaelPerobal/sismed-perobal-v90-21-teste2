
import { useState } from 'react';
import { PrescriptionDateConfig } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { format, addMonths, parse } from 'date-fns';

interface PrescriptionDateSelectorProps {
  dates: PrescriptionDateConfig[];
  onChange: (dates: PrescriptionDateConfig[]) => void;
  initialDate: string;
}

const PrescriptionDateSelector = ({ dates, onChange, initialDate }: PrescriptionDateSelectorProps) => {
  const [showOptions, setShowOptions] = useState(false);
  
  const toggleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleQuickSelect = (months: number) => {
    // Create an array with the specified number of months
    const today = initialDate ? new Date(initialDate) : new Date();
    
    const newDates: PrescriptionDateConfig[] = Array.from({ length: months }, (_, i) => {
      const date = addMonths(today, i);
      return {
        enabled: true,
        date: format(date, 'yyyy-MM-dd')
      };
    });
    
    onChange(newDates);
  };

  const handleToggleDate = (index: number) => {
    const newDates = [...dates];
    newDates[index].enabled = !newDates[index].enabled;
    onChange(newDates);
  };

  const handleDateChange = (index: number, newDate: string) => {
    const newDates = [...dates];
    newDates[index].date = newDate;
    onChange(newDates);
  };

  const addDate = () => {
    // Calculate next date based on the last date in the array
    const lastDate = dates.length > 0 
      ? new Date(dates[dates.length - 1].date)
      : initialDate ? new Date(initialDate) : new Date();
    
    const nextDate = addMonths(lastDate, 1);
    
    const newDates = [
      ...dates,
      {
        enabled: true,
        date: format(nextDate, 'yyyy-MM-dd')
      }
    ];
    
    onChange(newDates);
  };

  const removeDate = (index: number) => {
    const newDates = [...dates];
    newDates.splice(index, 1);
    onChange(newDates);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="multiple-dates" className="text-base font-medium">
          Gerar múltiplas receitas
        </Label>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleShowOptions}
          className="text-health-600"
        >
          {showOptions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>
      
      {showOptions && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleQuickSelect(1)}>
                1 mês
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleQuickSelect(2)}>
                2 meses
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleQuickSelect(3)}>
                3 meses
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleQuickSelect(6)}>
                6 meses
              </Button>
            </div>
            
            <div className="space-y-2">
              {dates.map((dateConfig, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`date-enabled-${index}`} 
                    checked={dateConfig.enabled}
                    onCheckedChange={() => handleToggleDate(index)}
                  />
                  <div className="grid grid-cols-3 gap-2 flex-grow">
                    <div className="col-span-2">
                      <Input
                        type="date"
                        value={dateConfig.date}
                        onChange={(e) => handleDateChange(index, e.target.value)}
                        disabled={!dateConfig.enabled}
                      />
                    </div>
                    <div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeDate(index)}
                      >
                        <span className="sr-only">Remover data</span>
                        &times;
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {dates.length < 6 && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addDate}
                className="w-full"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Adicionar data
              </Button>
            )}
            
            <div className="text-sm text-muted-foreground">
              {dates.filter(d => d.enabled).length > 0 
                ? `Serão geradas ${dates.filter(d => d.enabled).length} receitas separadas` 
                : 'Nenhuma receita selecionada'}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PrescriptionDateSelector;
