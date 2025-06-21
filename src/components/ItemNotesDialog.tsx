
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare } from 'lucide-react';

interface ItemNotesDialogProps {
  itemName: string;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function ItemNotesDialog({ itemName, notes, onNotesChange }: ItemNotesDialogProps) {
  const [tempNotes, setTempNotes] = useState(notes);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onNotesChange(tempNotes);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempNotes(notes);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={notes ? "default" : "outline"}>
          <MessageSquare className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Catatan untuk {itemName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              placeholder="Tambahkan catatan khusus untuk item ini..."
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Batal
            </Button>
            <Button onClick={handleSave}>
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
