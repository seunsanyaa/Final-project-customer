import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface InstallmentManagerProps {
  onPayFull: () => void;
  onPayInstallment: () => void;
  remainingAmount: number;
  nextInstallmentAmount?: number;
}

export function InstallmentManager({ 
  onPayFull, 
  onPayInstallment, 
  remainingAmount,
  nextInstallmentAmount 
}: InstallmentManagerProps) {
  const formatAmount = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          size="sm" 
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-black shadow-2xl flex items-center gap-2"
        >
          Payment Options
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={onPayFull} className="flex justify-between">
          <span>Pay Remaining in Full</span>
          <span className="text-green-600 font-semibold">
            {formatAmount(remainingAmount)}
          </span>
        </DropdownMenuItem>
        {nextInstallmentAmount && (
          <DropdownMenuItem onClick={onPayInstallment} className="flex justify-between">
            <span>Pay Next Installment</span>
            <span className="text-green-600 font-semibold">
              {formatAmount(nextInstallmentAmount)}
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 