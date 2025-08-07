import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export default function RevokeConsent() {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="destructive">
                Revoke Consent
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Revoke Consent</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Are you sure you want to revoke your consent?
            </DialogDescription>
            <DialogFooter>
                <Button variant="destructive">Confirm</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}