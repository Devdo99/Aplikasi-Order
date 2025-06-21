
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X } from 'lucide-react';
import OrderMenu from './OrderMenu';

interface FullScreenOrderDialogProps {
  tableNumber?: string;
  children: React.ReactNode;
}

export default function FullScreenOrderDialog({ tableNumber, children }: FullScreenOrderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] max-h-[95vh] p-0 gap-0">
        <DialogHeader className="p-4 pb-2 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Buat Pesanan Baru {tableNumber && `- ${tableNumber}`}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden p-4">
          <OrderMenu 
            preselectedTable={tableNumber} 
            onOrderComplete={() => setIsOpen(false)}
            isFullScreen={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
