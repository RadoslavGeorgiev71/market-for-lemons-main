import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { revoked_consent } from "@/data/constants";
import { State } from "@/types/state";



export default function RevokeConsent({userId, setRevokedConsent, updateState, handleBeforeUnload}: {userId: string; setRevokedConsent: (value: boolean) => void; updateState: any; handleBeforeUnload: (event: BeforeUnloadEvent) => void}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const router = useRouter();
    //const deleteUser = api.user.delete.useMutation();

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
                        onClick={() => {
                            if (!userId) return;
                            updateState.mutate({
                                userId: userId,
                                state: State.revoked_consent
                            });
                            //TODO: To redirect back
                            //await deleteUser.mutateAsync({ userId: userId });
                            setIsDialogOpen(false);
                            window.removeEventListener("beforeunload", handleBeforeUnload);
                            setRevokedConsent(true);
                            router.replace(revoked_consent)
                        }}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}