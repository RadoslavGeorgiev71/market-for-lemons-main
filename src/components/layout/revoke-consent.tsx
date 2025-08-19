"use client";

import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RevokeConsent() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const searchParams = useSearchParams();
    const userId = searchParams?.get("user_id");
    const utils = api.useUtils();
    const deleteUser = api.user.delete.useMutation({
        onSuccess: async () => {
            await utils.user.getUserById.invalidate({ userId: userId ?? "" });
        },
    });

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
                        //TODO: To redirect back
                        deleteUser.mutate({ userId: userId });
                        setIsDialogOpen(false);
                    }}
                >
                    Confirm
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}