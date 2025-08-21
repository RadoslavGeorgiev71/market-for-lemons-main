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
import Medical from "@/components/medical";
import { useEffect, useRef } from "react";
import { exitPath } from "@/data/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Page1 from "./instructionPages/page1";
import Page2 from "./instructionPages/page2";
import Page3 from "./instructionPages/page3";
import Page4 from "./instructionPages/page4";
import Page5 from "./instructionPages/page5";
import ComprehensionQuestions from "./instructionPages/comprehensionQuestions";


const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    // Required for the confirmation popup
    event.preventDefault();
};

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
  const getUserCount = api.user.getUserCount.useMutation();
  const state = getUser.data?.state;



  const ignoreBeforeUnload = useRef(false);

  // Confirmation when refreshing, or trying to change URL(Going back is prevented)
  useEffect(() => {
    if (!userId || ignoreBeforeUnload.current) return;

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [userId]);



  const calculatePath = async (userId: string, currentInstance: number) => {
    if (!userId) return "";
    const userCount: number = await getUserCount.mutateAsync() ?? 0;
    //TODO: to be changed for different instances
    return `/?user_id=${userId}&state=f-l-${userCount % 6}-${userCount % 400}-${currentInstance}`;
  };

  const updatePath = (userId: string, newInstance: number) => {
    if (!userId) return "";

    const currentStatePath = `${searchParams?.get("state")}`;
    const newStatePath = currentStatePath.replace(/-(\d+)$/, `-${newInstance}`);
    router.replace(`/?user_id=${userId}&state=${newStatePath}`);
  };

  // Fetch path parameters
  const userState = searchParams?.get("state");
  const stateParts = userState?.split("-") ?? [];
  const [disclosureCode, lemonDensityCode, taskPermutationNum, instancePermutationNum, currentInstanceNum] = stateParts;
  const disclosure = disclosureCode === "f" ? Disclosure.full : disclosureCode === "p" ? Disclosure.partial : Disclosure.none;
  const lemonDensity = lemonDensityCode === "l" ? LemonDensity.Low : lemonDensityCode === "m" ? LemonDensity.Medium : LemonDensity.High;
  const taskPermutation = data.taskPermutations[parseInt(taskPermutationNum, 10)];
  const instancePermutation = data.instancePermutations[parseInt(instancePermutationNum, 10)];
  const aiPermutations = data.aiPermutations[parseInt(instancePermutationNum, 10)];
  const accuracies = data.accuracies[parseInt(instancePermutationNum, 10)];
  const currentInstance = parseInt(currentInstanceNum, 10);

  const aiSystems: AISystem[] = lemonDensity === LemonDensity.Low ? 
    data.ais.lowDensity : 
    lemonDensity === LemonDensity.Medium ? data.ais.mediumDensity : data.ais.highDensity;

  if (!userId) {
    return (
      <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
        <div className="flex w-full h-fit mt-[-50] items-center justify-center gap-x-2">
          <h1 className="text-2xl font-semibold">Market for</h1>
          <CitrusIcon />
        </div>
        <div className="md:h-[70vh] overflow-y-auto center items-center p-4 bg-gray-50 rounded-md">
          <h2 className="text-xl max-w-3xl mb-2">Informed Consent</h2>
          <p>
            We are a team of researchers from Delft University of Technology, Netherlands,
             University of Göttingen, Germany, and University of Cagliari, Italy.
             This study explores how individuals interpret and respond to programming errors,
            with the aim of improving how such errors are explained based on a programmer’s skill level.
             You are invited to take part in this research project.
          </p>
          <h2 className="text-xl max-w-3xl mb-2 mt-5">Your Participation</h2>
          <p>
            If you agree to participate, you will begin by ….. 
            The entire study should take approximately XXX minutes to complete.
            You don’t need any special equipment to participate in the study.
            The study is designed to be completed entirely online.Your involvement is completely voluntary,
            and you are free to withdraw at any point without penalty. Note, however, that if you choose to withdraw,
            you will NOT receive any compensation for your participation apart from the base payment.
          </p>
          <h2 className="text-xl max-w-3xl mb-2 mt-5">Integrity & Fairness</h2>
          <p>
            <strong>Important:</strong> To maintain the integrity of this study, please complete all tasks independently,
            without using external assistance such as large language models (LLMs), AI tools of any sort,
            search engines, or help from others. Copy-pasting answers from any source, including external websites or tools,
            is strictly prohibited and will result in immediate disqualification.
            Your responses must reflect your own reasoning and understanding.
            It is essential that you thoughtfully engage with each question rather than submitting answers at random or
            without proper consideration. We will actively check for signs of inauthentic or careless participation.
          </p>
          <p className="font-bold mt-2">The use of LLMs (e.g., ChatGPT, Copilot), or failing to engage meaningfully with the task,
            will result in your responses being invalidated.
          </p>
          <h2 className="text-xl max-w-3xl mb-2 mt-5">What Data Will Be Collected?</h2>
          <p>
            We will collect the following information during your participation:
          </p>
          <ul className="list-disc pl-6">
            <li>...</li>
            <li>Your interaction data: Your interactions in the task interfaces, metrics such as the time you spend on each question, whether the survey window remains active (for example, when you switch tabs or windows), and keystroke data (e.g., if you copy or paste code).</li>
            <li>Your task and survey responses: The responses you provide within tasks, your answers to the multiple-choice questions, open questions and Likert-style questions throughout the study.</li>
          </ul>
          <h2 className="text-xl max-w-3xl mb-2 mt-5">Confidentiality & Data Use</h2>
          <p>
            We will only collect the data described above, and your information will be treated with strict confidentiality.
            Your PROLIFIC_ID will be collected solely for the purposes of tracking participation and ensuring fair monetary
            compensation. After the data collection phase is complete, all PROLIFIC_IDs will be anonymized so that your responses
            cannot be linked back to you. All data will be securely stored in password-protected electronic systems.
            Please note that the data collected in this study may be published or shared in anonymized form.
            This anonymized dataset may include your responses to the survey and coding submissions,
            but will exclude any personal identifiers (i.e., PROLIFIC_ID), ensuring that your responses cannot be
            traced back to you.
          </p>
          <h2 className="text-xl max-w-3xl mb-2 mt-5">Contact Information</h2>
          <p>
            You can further contact the researchers for any clarification.
            To do this, send an email to <a href="mailto:A.H.Erlei@tudelft.nl" className="text-blue-600 hover:underline">A.H.Erlei@tudelft.nl</a> for any questions.
          </p>
          <h2 className="text-xl max-w-3xl mb-2 mt-5">Your Rights</h2>
          <p className="mb-4">
            By clicking  "Yes, I consent"  at the bottom of this page, you confirm that you have carefully read, understood, and consent to the above information.
          </p>
          <p className="mb-4">
            Note: You can exit the task at any time. This will imply revoking your consent, and subsequently, all your data will be discarded from our databases.
          </p>
          <p className="mb-4">
            Do you consent to participate in this study under the above conditions?
          </p>
          <div className="flex flex-row w-full items-center justify-center">
            <Button className="mr-5" 
              onClick={async () => {
                const user = await createUser.mutateAsync({
                  userId: uuidv4(),
                  state: State.instructions,
                  //TODO: to be changed for different instances
                  disclosure: Disclosure.full,
                  lemonDensity: LemonDensity.Low,
                });
                const path = await calculatePath(user.userId, 0);
                sessionStorage.setItem("canLeave", JSON.stringify(false));
                router.replace(path);
              }}
              disabled={createUser.isPending}>
                {createUser.isPending && <Loader2 className="animate-spin"/>}
              Yes
            </Button>
            <Button onClick={() => router.push(exitPath)}>
              No
            </Button>
          </div>
        </div>
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
            Unfortunately, we were unable to find your current submission.
            Please contact the researchers for support at <a href="mailto:A.H.Erlei@tudelft.nl" className="text-blue-600 hover:underline">A.H.Erlei@tudelft.nl</a>
          </p>
        </>
      );
    }
    
    if (!state) return <div>Invalid state</div>;

    switch (state) {
      case State.instructions:
        return (
          <>
            <div className="flex w-full h-fit mt-[-50] items-center justify-center gap-x-2">
              <h1 className="text-2xl font-semibold">Instructions</h1>
            </div>
            <div className="max-h-[70vh] overflow-y-auto center items-center p-4 bg-gray-50 rounded-md">
              <p className="mb-2">Thank you for participating in this experiment!</p>
              <p className="mb-2">
              The experiment will take approximately 20 minutes. You will be paid £1.5 for completing the experiment.
              Additionally, you can earn a bonus of up to  £3.6 that depends on your choices, as explained in more detail on the next pages.
              Throughout the experiment, we will use Coins instead of Pounds.
              The Coins you earn will be converted into Pounds at the end of the experiment.
              The following conversion rate applies: 100 Coins =  £0.4</p>
              <p className="mb-2">Please read the following instructions carefully.
                After the instructions, you will need to answer a number of comprehension questions.
                You can only proceed with the experiment after answering them correctly within three trials.
                If you did not successfully answer all three comprehension questions after three trials,
                you will not be allowed to participate in the experiment.</p>

              <Tabs defaultValue="page1" className="">
                <TabsList className="flex mt-5 space-x-2">
                  <TabsTrigger className="w-20" value="page1">Page 1</TabsTrigger>
                  <TabsTrigger className="w-20" value="page2">Page 2</TabsTrigger>
                  <TabsTrigger className="w-20" value="page3">Page 3</TabsTrigger>
                  <TabsTrigger className="w-20" value="page4">Page 4</TabsTrigger>
                  <TabsTrigger className="w-20" value="page5">Page 5</TabsTrigger>
                  <TabsTrigger value="comprehension">Comprehension Questions</TabsTrigger>
                </TabsList>

                <TabsContent value="page1">
                  <Page1 disclosure={disclosure}></Page1>
                </TabsContent>

                <TabsContent value="page2">
                  <Page2></Page2>
                </TabsContent>

                <TabsContent value="page3">
                  <Page3></Page3>
                </TabsContent>

                <TabsContent value="page4">
                  <Page4 taskPermutation={taskPermutation}></Page4>
                </TabsContent>

                <TabsContent value="page5">
                  <Page5></Page5>
                </TabsContent>

                <TabsContent value="comprehension">
                  <ComprehensionQuestions disclosure={disclosure} userId={userId} updateState={updateState} handleBeforeUnload={handleBeforeUnload} />
                </TabsContent>
              </Tabs>
            </div>
          </>
        );
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
       aiPermutation={aiPermutations[taskNumber]} accuracies={accuracies[taskNumber]}
       currentInstance={currentInstance} aiSystems={aiSystems} updatePath={updatePath} onComplete={onTaskCompletion}/>;
    } else if (taskPermutation[taskNumber] === 2) {
      return <Reviews userId={userId!} disclosure={disclosure} instancePermutation={instancePermutation}
       aiPermutation={aiPermutations[taskNumber]} accuracies={accuracies[taskNumber]}
       currentInstance={currentInstance} aiSystems={aiSystems} updatePath={updatePath} onComplete={onTaskCompletion}/>;
    } else {
      return <Medical userId={userId!} disclosure={disclosure} instancePermutation={instancePermutation}
       aiPermutation={aiPermutations[taskNumber]} accuracies={accuracies[taskNumber]}
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
            state: State[`task${taskNumber + 1}` as keyof typeof State],
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
