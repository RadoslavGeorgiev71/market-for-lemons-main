import { CitrusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogDescription, DialogTrigger } from "../ui/dialog";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function TaskInstructions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Task Instructions
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Task Instructions
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex items-center gap-2 justify-center">
          <CitrusIcon /> Welcome to the Market for Lemons!
        </DialogDescription>        
      </DialogContent>
    </Dialog>
  );
}