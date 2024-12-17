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
}

export function InstallmentManager({ onPayFull, onPayInstallment, remainingAmount }: InstallmentManagerProps) {
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
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onPayFull}>
          Pay Remaining in Full
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPayInstallment}>
          Pay Next Installment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 