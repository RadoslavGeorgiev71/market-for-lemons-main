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
import { LemonDensity } from "@/types/lemonDensity";

import data from "../data/data.json";
import { AISystem } from "@/types/aiSystem";
import Reviews from "@/components/reviews";


export default function Home() {
  const router = useRouter();
  const utils = api.useUtils();
  const createUser = api.user.create.useMutation({
    onSuccess: async () => {
      await utils.user.getUserCount.invalidate();
    },
  });
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
  const getUserCount = api.user.getUserCount.useQuery();
  const state = getUser.data?.state;

  const calculatePath = (userId: string, currentInstance: number) => {
    if (!userId) return "";
    const userCount: number = getUserCount.data! ?? 0;
    //TODO: to be changed for different instances
    return `/?user_id=${userId}&state=f-l-${userCount % 6}-${userCount % 400}-${currentInstance}`;
  };

  const updatePath = (userId: string, newInstance: number) => {
    if (!userId) return "";
    //TODO: to be changed for different instances
    const currentStatePath = `${searchParams?.get("state")}`;
    const newStatePath = currentStatePath.replace(/-(\d+)$/, `-${newInstance}`);
    router.push(`/?user_id=${userId}&state=${newStatePath}`);
  };

  // Fetch path parameters
  const userState = searchParams?.get("state");
  const stateParts = userState?.split("-") ?? [];
  const [disclosureCode, lemonDensityCode, taskPermutationNum, instancePermutationNum, currentInstanceNum] = stateParts;
  const disclosure = disclosureCode === "f" ? Disclosure.full : disclosureCode === "p" ? Disclosure.partial : Disclosure.none;
  const lemonDensity = lemonDensityCode === "l" ? LemonDensity.Low : lemonDensityCode === "m" ? LemonDensity.Medium : LemonDensity.High;
  const taskPermutation = data.taskPermutations[parseInt(taskPermutationNum, 10)];
  const instancePermutation = data.instancePermutations[parseInt(instancePermutationNum, 10)];
  const currentInstance = parseInt(currentInstanceNum, 10);

  const aiSystems: AISystem[] = lemonDensity === LemonDensity.Low ? 
    data.ais.lowDensity : 
    lemonDensity === LemonDensity.Medium ? data.ais.mediumDensity : data.ais.highDensity;

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
              //TODO: to be changed for different instances
              disclosure: Disclosure.full,
              lemonDensity: LemonDensity.Low,
            });
            const path = calculatePath(user.userId, 0);
            router.push(path);
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
                state: State.task1,
              });
            }} disabled={updateState.isPending}>
              {updateState.isPending && <Loader2 className="animate-spin" />}
              Start your first task
            </Button>
          </div>
        );
      case State.task1:
        return renderTask(1);
      case State.postTask1:
        return renderPostTask(1);
      case State.task2:
        return renderTask(2);
      case State.postTask2:
        return renderPostTask(2);
      case State.task3:
        return renderTask(3);
      case State.postTask3:
        return renderPostTask(3);
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

  const onTaskCompletion = () => {
    if (state === State.task1) {
      updateState.mutate({
        userId: userId!,
        state: State.postTask1,
      });
    } else if (state === State.task2) {
      updateState.mutate({
        userId: userId!,
        state: State.postTask2,
      });
    } else {
      updateState.mutate({
        userId: userId!,
        state: State.postTask3,
      });
    }
  };

  const renderTask = (taskNumber: number) => {
    if (taskPermutation[taskNumber] === 1) {
      return <Finance userId={userId!} disclosure={disclosure} instancePermutation={instancePermutation}
       currentInstance={currentInstance} aiSystems={aiSystems} updatePath={updatePath} onComplete={onTaskCompletion}/>;
    } else if (taskPermutation[taskNumber] === 2) {
      return <Reviews userId={userId!} disclosure={disclosure} instancePermutation={instancePermutation}
       currentInstance={currentInstance} aiSystems={aiSystems} updatePath={updatePath} onComplete={onTaskCompletion}/>;
    }
  };

  const renderPostTask = (taskNumber: number) => {
    return (
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold">You have successfully completed Task {taskNumber}!</h1>
        <Button onClick={() => {
          updateState.mutate({
            userId: userId!,
            state: State.medical,
          });
        }} disabled={updateState.isPending}>
          {updateState.isPending && <Loader2 className="animate-spin" />}
          Proceed to {taskNumber == 3 ? "end of study" : `Task ${taskNumber + 1}`}
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
      {renderStateContent()}
    </div>
  );
}
