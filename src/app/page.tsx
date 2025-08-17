"use client";

import { Button } from "@/components/ui/button";
import { CitrusIcon, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import { v4 as uuidv4 } from "uuid";
import { State } from "@/types/state";
import { useSearchParams } from "next/navigation";
import Loading from "./loading";
import Finance from "@/components/finance";
import { useRouter } from "next/navigation";
import { Disclosure } from "@/types/disclosure";


export default function Home() {
  const router = useRouter();
  const utils = api.useUtils();
  const createUser = api.user.create.useMutation();
  const updateState = api.user.updateState.useMutation({
    onSuccess: async () => {
      await utils.user.getUserById.invalidate({ userId: userId ?? "" });
    },
  });
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const getUser = api.user.getUserById.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId }
  );

  if (!userId) {
    return (
      <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
        <div className="flex w-full h-fit items-center justify-center gap-x-2">
          <h1 className="text-2xl font-semibold">Market for</h1>
          <CitrusIcon />
        </div>
        <Button
          onClick={async () => {
            const user = await createUser.mutateAsync({
              userId: uuidv4(),
              state: State.preTask,
              disclosure: Disclosure.full,
            });
            router.push(`/?user_id=${user.userId}`);
          }}
          disabled={createUser.isPending}
        >
          {createUser.isPending && <Loader2 className="animate-spin" />}
          Simulate the domains!
        </Button>
      </div>
    );
  }


  const renderStateContent = () => {
    if (getUser.isLoading) {
      return <Loading />;
    }

    if (!getUser.data) {
      return (
        <>
          <h1 className="text-2xl font-semibold">Contact researchers!</h1>
          <p>
            Unfortunately, we were unable to find your current submission. Please contact the researchers for support.
          </p>
        </>
      );
    }
    const state = getUser.data?.state;
    const disclosure = getUser.data?.disclosure;
    if (!state) return <div>Invalid state</div>;

    switch (state) {
      case State.preTask:
        return (
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold">Pre-Task</h1>
            <Button onClick={() => {
              updateState.mutate({
                userId: userId!,
                state: State.tutorial,
              });
            }} disabled={updateState.isPending}>
              {updateState.isPending && <Loader2 className="animate-spin" />}
              Proceed to Tutorial
            </Button>
          </div>
        );
      case State.tutorial:
        return (
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold">Tutorial</h1>
            <Button onClick={() => {
              updateState.mutate({
                userId: userId!,
                state: State.finance,
              });
            }} disabled={updateState.isPending}>
              {updateState.isPending && <Loader2 className="animate-spin" />}
              Start Finance Task
            </Button>
          </div>
        );
      case State.finance:
        return (
          <Finance userId={userId!} disclosure={disclosure} />
        );
      case State.cybersecurity:
        return (
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold">Cybersecurity Task</h1>
            <Button onClick={() => {
              updateState.mutate({
                userId: userId!,
                state: State.medical,
              });
            }} disabled={updateState.isPending}>
              {updateState.isPending && <Loader2 className="animate-spin" />}
              Next Task
            </Button>
          </div>
        );
      case State.medical:
        return (
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold">Medical Task</h1>
            <Button onClick={() => {
              updateState.mutate({
                userId: userId!,
                state: State.postTask,
              });
            }} disabled={updateState.isPending}>
              {updateState.isPending && <Loader2 className="animate-spin" />}
              Complete Tasks
            </Button>
          </div>
        );
      case State.postTask:
        return (
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold">Post-Task</h1>
            <Button onClick={() => {
              updateState.mutate({
                userId: userId!,
                state: State.completion,
              });
            }} disabled={updateState.isPending}>
              {updateState.isPending && <Loader2 className="animate-spin" />}
              Complete Study
            </Button>
          </div>
        );
      case State.completion:
        return (
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold">Thank you for participating!</h1>
          </div>
        );
      case State.revokedConsent:
        return (
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold">Consent Revoked</h1>
            <p>You have revoked your consent to participate in this study.</p>
          </div>
        );
      default:
        return <div>Invalid state</div>;
    }
  };

  return (
    <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
      {renderStateContent()}
    </div>
  );
}
