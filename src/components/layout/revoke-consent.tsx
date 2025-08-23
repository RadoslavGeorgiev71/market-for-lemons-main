import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { State } from "@/types/state";



export default function RevokeConsent({userId, setRevokedConsent, handleBeforeUnload}: {userId: string; setRevokedConsent: (value: boolean) => void; handleBeforeUnload: (event: BeforeUnloadEvent) => void}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const deleteUser = api.user.delete.useMutation();

    const router = useRouter();

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    Are you sure you want to revoke your consent? This will delete all your data and you will not be able to participate in the study anymore.
                </DialogDescription>
                <DialogFooter>
                    <Button 
                        variant="destructive"
                        onClick={async () => {
                            if (!userId) return;
                            //TODO: To redirect back
                            await deleteUser.mutateAsync({ userId: userId });
                            setIsDialogOpen(false);
                            window.removeEventListener("beforeunload", handleBeforeUnload);
                            setRevokedConsent(true);
                        }}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}