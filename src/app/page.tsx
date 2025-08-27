"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
import { use, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Page1 from "../components/instructionPages/page1";
import Page2 from "../components/instructionPages/page2";
import Page3 from "../components/instructionPages/page3";
import Page4 from "../components/instructionPages/page4";
import Page5 from "../components/instructionPages/page5";
import ComprehensionQuestions from "../components/instructionPages/comprehensionQuestions";
import Tutorial from "../components/instructionPages/tutorial";
import FinanceInstructions from "@/components/taskInsturctions/financeInstructions";
import ReviewInstructions from "@/components/taskInsturctions/reviewInstructions";
import MedicalInstructions from "@/components/taskInsturctions/medicalInstructions";
import RevokeConsent from "@/components/layout/revoke-consent";
import DataInformation from "@/components/layout/dataInformation";
import Instructions from "@/components/layout/instructions";
import PreTaskQuestions from "@/components/preTaskQuestions";
import { completed_successfully, no_consent, problem_with_completion } from "@/data/constants";


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

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Read from sessionStorage after the component mounts
    const saved = sessionStorage.getItem('userId');
    setUserId(saved ? saved : null);
  }, []);

  useEffect(() => {
    if (userId !== null) {
      sessionStorage.setItem('userId', userId.toString());
    }
  }, [userId]);


  const getUser = api.user.getUserById.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId }
  );
  const getUserCount = api.user.getUserCount.useMutation();
  const state = getUser.data?.state;


  const prolificId = searchParams?.get("PROLIFIC_PID");
  const studyId = searchParams?.get("STUDY_ID");
  const sessionId = searchParams?.get("SESSION_ID");


  const completion = api.completion.getByUserId.useQuery({ userId: userId! }, { enabled: !!userId });

  const createCompletion = api.completion.create.useMutation({
    onSuccess: async () => {
      await utils.completion.getByUserId.invalidate({ userId: userId ?? "" });
    },
  });

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

    return `/?PROLIFIC_PID=${prolificId}&STUDY_ID=${studyId}&SESSION_ID=${sessionId}&state=${disclosureCode}-${lemonDensityCode}-${userCount % 6}-${userCount % 400}-${currentInstance}`;
  };

  const updatePath = (userId: string, newInstance: number) => {
    if (!userId) return "";

    const currentStatePath = `${searchParams?.get("state")}`;
    const newStatePath = currentStatePath.replace(/-(\d+)$/, `-${newInstance}`);
    router.replace(`/?PROLIFIC_PID=${prolificId}&STUDY_ID=${studyId}&SESSION_ID=${sessionId}&state=${newStatePath}`);
  };

  // Fetch path parameters
  const userState = searchParams?.get("state");
  const stateParts = userState?.split("-") ?? [];
  const [disclosureCode, lemonDensityCode, taskPermutationNum, instancePermutationNum, currentInstanceNum] = stateParts;
  const disclosure = disclosureCode === "f" ? Disclosure.full : disclosureCode === "p" ? Disclosure.partial : Disclosure.none;
  const lemonDensity = lemonDensityCode === "l" ? LemonDensity.Low : lemonDensityCode === "m" ? LemonDensity.Medium : LemonDensity.High;
  const taskPermutation = data.taskPermutations[parseInt(taskPermutationNum, 10)];

  const instancePermutation = data.instancePermutations[parseInt(instancePermutationNum, 10)];

  // get the next 30 aiPermutaions and accuracies
  const circularSlice = (array: number[][], start: number, length: number) => {
    const result = [];

    for (let i = 0; i < 3; i++) {
      const tempResult = [];
      for (let j = 0; j < length; j++) {
        tempResult.push(array[(start + j + i * length) % array.length]);
      }
      result.push(tempResult);
    }

    return result as number[][][];
  }

  const aiPermutations: number[][][] = circularSlice(data.aiPermutations, parseInt(instancePermutationNum, 10), 10);
  const accuracies: number[][][] = circularSlice(data.accuracies, parseInt(instancePermutationNum, 10), 10);

  const currentInstance = parseInt(currentInstanceNum, 10);

  const tutorialAiPermutations: number[][][] = circularSlice(data.aiPermutations, (parseInt(instancePermutationNum, 10) + 30) % 400, 10);
  const tutorialAccuracies: number[][][] = circularSlice(data.accuracies, (parseInt(instancePermutationNum, 10) + 30) % 400, 10);

  const aiSystems: AISystem[] = lemonDensity === LemonDensity.Low ? 
    data.ais.lowDensity : 
    lemonDensity === LemonDensity.Medium ? data.ais.mediumDensity : data.ais.highDensity;

  const [activeTab, setActiveTab] = useState<string>("page1");
  const [unlockedTabs, setUnlockedTabs] = useState<string[]>(["page1", "page2"]);

  const [revokedConsent, setRevokedConsent] = useState<boolean>(false);

  const [completionText, setCompletionText] = useState<string>("");

  const [currentTaskNum, setCurrentTaskNum] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Read from sessionStorage after the component mounts
    const saved = sessionStorage.getItem('currentTaskNum');
    setCurrentTaskNum(saved ? parseInt(saved, 10) : 0);
  }, []);
  useEffect(() => {
    if (currentTaskNum !== null) {
      sessionStorage.setItem('currentTaskNum', currentTaskNum.toString());
    }
  }, [currentTaskNum]);


  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // unlock the next tab only when current tab is visited
    const order = ["page1", "page2", "page3", "page4", "page5", "tutorial"];
    const currentIndex = order.indexOf(value);
    const nextTab = order[currentIndex + 1];
    if (nextTab && !unlockedTabs.includes(nextTab)) {
      setUnlockedTabs([...unlockedTabs, nextTab]);
    }
  };

  const isTabDisabled = (value: string) => !unlockedTabs.includes(value);

  // 👇 This is the method Tutorial will call
  const unlockComprehension = () => {
    if (!unlockedTabs.includes("comprehension")) {
      setUnlockedTabs([...unlockedTabs, "comprehension"]);
    }
    setActiveTab("comprehension"); // immediately open it
  };

  const createCompletionResponse = api.completionResponse.create.useMutation();

  const handleSurveySubmit = () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);

    updateState.mutate({
      userId: userId!,
      state: State.fully_completed
    });

    createCompletionResponse.mutate({
      userId: userId!,
      response: completionText,
    });

    router.replace(completed_successfully);
  }



  if (!userId) {
    return (
      <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
        <div className="overflow-y-auto center items-center p-4 bg-gray-50 rounded-md space-y-5">
          <h2 className="text-xl max-w-3xl mb-2">About the survey</h2>
          <p>
            We are a group of researchers from Delft University of Technology, Netherlands, University of Göttingen, Germany, and University of Cagliari, Italy. In this research project, we aim to investigate how users interact with AI systems across different tasks. You will complete a series of tasks involving a pool of AI systems that can help with cancer prediction, loan prediction, and deceptive hotel review identification. Completion of these tasks does not require any specific equipment beyond a computer with internet access.
          </p>
          <p className="">
              The survey will take approximately 20 minutes. You will be paid £2.5 for completing the experiment.
              Additionally, you can earn a bonus of up to  £3 that depends on your choices, as explained in more detail on the next pages.
              Throughout the experiment, we will use Coins instead of Pounds.
              The Coins you earn will be converted into Pounds at the end of the experiment.
              The following conversion rate applies: 300 Coins =  £1</p>
          <p className="mt-2 mb-2">
            <strong>We will collect the following information:</strong>
          </p>
          <ul className="list-disc pl-6">
            <li>Your interaction data: Your interactions in the task interfaces, metrics such as the time you spend on each question, whether the survey window remains active (for example, when you switch tabs or windows), and keystroke data (e.g., if you copy or paste code).</li>
            <li>Your task and survey responses: The responses you provide within tasks, your answers to the multiple-choice questions, open questions and Likert-style questions throughout the study.</li>
          </ul>
          <p>
            We do not collect any data aside from the information described, and we will keep your information confidential. All data is stored in a password-protected electronic format. The data we gather may be published in anonymized form. <strong>By clicking "I consent" below, you confirm that you have read, understood, and consent to the above information.</strong> Note: You can exit the survey at any time. This will imply revoking your consent, and subsequently, all your data will be discarded from our databases. If you want to contact the researchers beyond this survey you can email at <a href="mailto:A.H.Erlei@tudelft.nl" className="text-blue-600 hover:underline">A.H.Erlei@tudelft.nl</a> for questions. Do you consent to participate in this study under the above conditions?
          </p>
          <div className="flex flex-row w-full items-center justify-center">
            <Button className="mr-5" 
              onClick={async () => {
                const user = await createUser.mutateAsync({
                  userId: prolificId!,
                  state: State.preTaskQuestions,
                  disclosure: disclosure,
                  lemonDensity: lemonDensity,
                  studyId: studyId!,
                  sessionId: sessionId!
                });
                setUserId(user.userId);
                const path = await calculatePath(user.userId, 0);
                router.replace(path);
              }}
              disabled={createUser.isPending}>
                {createUser.isPending && <Loader2 className="animate-spin"/>}
              Yes
            </Button>
            <Button onClick={() => router.push(no_consent)}>
              No
            </Button>
          </div>
        </div>
      </div>
    );
  }


  const renderStateContent = () => {
    if (!state) return <div>Invalid state</div>;

    switch (state) {
      case State.preTaskQuestions:
        return <PreTaskQuestions userId={userId!} updateState={updateState} handleBeforeUnload={handleBeforeUnload}/>;
      case State.instructions:
        return (
          <>
            <div className="flex w-full h-fit mt-[-50] items-center justify-center gap-x-2">
              <h1 className="text-2xl font-semibold">Instructions</h1>
            </div>
            <div className="w-full">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="flex mt-5 space-x-2">
                  <TabsTrigger className="w-20" value="page1" disabled={isTabDisabled("page1")}>Page 1</TabsTrigger>
                  <TabsTrigger className="w-20" value="page2" disabled={isTabDisabled("page2")}>Page 2</TabsTrigger>
                  <TabsTrigger className="w-20" value="page3" disabled={isTabDisabled("page3")}>Page 3</TabsTrigger>
                  <TabsTrigger className="w-20" value="page4" disabled={isTabDisabled("page4")}>Page 4</TabsTrigger>
                  <TabsTrigger className="w-20" value="page5" disabled={isTabDisabled("page5")}>Page 5</TabsTrigger>
                  <TabsTrigger value="tutorial" disabled={isTabDisabled("tutorial")}>Tutorial</TabsTrigger>
                  <TabsTrigger value="comprehension" disabled={isTabDisabled("comprehension")}>Comprehension Questions</TabsTrigger>
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

                <TabsContent value="tutorial">
                  <Tutorial userId={userId!} disclosure={disclosure} aiSystems={aiSystems} taskPermutations={taskPermutation} aiPermutations={tutorialAiPermutations} accuracies={tutorialAccuracies} unlockComprehension={unlockComprehension}></Tutorial>
                </TabsContent>

                <TabsContent value="comprehension">
                  <ComprehensionQuestions disclosure={disclosure} userId={userId!} updateState={updateState} handleBeforeUnload={handleBeforeUnload} />
                </TabsContent>
              </Tabs>
            </div>
          </>
        );
      case State.preTask1:
        return renderPreTask(0);
      case State.preTask2:
        return renderPreTask(1);
      case State.preTask3:
        return renderPreTask(2);
      case State.finance:
        return <Finance userId={userId!} disclosure={disclosure} instancePermutation={instancePermutation}
       aiPermutations={aiPermutations[currentTaskNum]} accuracies={accuracies[currentTaskNum]}
       currentInstance={currentInstance} aiSystems={aiSystems} updatePath={updatePath} onComplete={onTaskCompletion}/>;
      case State.reviews:
        return <Reviews userId={userId!} disclosure={disclosure} instancePermutation={instancePermutation}
       aiPermutations={aiPermutations[currentTaskNum]} accuracies={accuracies[currentTaskNum]}
       currentInstance={currentInstance} aiSystems={aiSystems} updatePath={updatePath} onComplete={onTaskCompletion}/>;
      case State.medical:
        return <Medical userId={userId!} disclosure={disclosure} instancePermutation={instancePermutation}
       aiPermutations={aiPermutations[currentTaskNum]} accuracies={accuracies[currentTaskNum]}
       currentInstance={currentInstance} aiSystems={aiSystems} updatePath={updatePath} onComplete={onTaskCompletion}/>;
      case State.completion_screen:
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold">Thank you for participating!</h1>
            <p>You have earned <strong>{completion.data?.coins || 0} coins.</strong></p>

            <p className="mt-5">Do you have any thoughts you would like to share with us(optional)?</p>
            <textarea className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-50"
              rows={6}              
              cols={50}
              maxLength={250}
              placeholder="Max 250 characters"
              onChange={(e) => setCompletionText(e.target.value)}
            />
            <Button className="mt-5" onClick={handleSurveySubmit}>
              Submit Survey
            </Button>
          </div>
        );
      default:
        return <div>Invalid state</div>;
    }
  };

  const onTaskCompletion = async () => {
    if (currentTaskNum === 2) {
      setIsLoading(true);
      const financeTasks = await utils.task.getTasksForUser.fetch({ userId: userId!, domain: "Loan prediction" });
      const reviewTasks = await utils.task.getTasksForUser.fetch({ userId: userId!, domain: "Identifying deceptive hotel reviews" });
      const medicalTasks = await utils.task.getTasksForUser.fetch({ userId: userId!, domain: "Cancer prediction" });
      setIsLoading(false);

      if (financeTasks.length !== 10 || reviewTasks.length !== 10 || medicalTasks.length !== 10) {
        updateState.mutate({
          userId: userId!,
          state: State.failed_completion,
        });

        window.removeEventListener("beforeunload", handleBeforeUnload);
        router.replace(problem_with_completion);
        return;
      }

      const freshCount = await utils.task.countSuccessfulTasks.fetch({ userId: userId ?? "" });

      updateState.mutate({
        userId: userId!,
        state: State.completion_screen,
      });

      await createCompletion.mutateAsync({ userId: userId!, coins: freshCount * 30 });
    } else {
      updateState.mutate({
        userId: userId!,
        state: State[`preTask${currentTaskNum + 2}` as keyof typeof State],
      });
      setCurrentTaskNum(currentTaskNum + 1);
    }

    // reset the current instance
    updatePath(userId!, 0);
  };

  const renderPreTask = (taskNumber: number) => {
    if (taskPermutation[taskNumber] === 0) {
      return <FinanceInstructions userId={userId!} updateState={updateState}/>;
    } else if (taskPermutation[taskNumber] === 1) {
      return <ReviewInstructions userId={userId!} updateState={updateState}/>;
    } else {
      return <MedicalInstructions userId={userId!} updateState={updateState}/>;
    }
  }



  if (getUser.isLoading || updateState.isPending || isLoading) {
    return (
      <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
        <Loading />
      </div>
    );
  }

  // if (revokedConsent) {
  //   return (
  //     <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
  //       <h1 className="text-2xl font-semibold">Consent Revoked</h1>
  //       <p>You have revoked your consent to participate in this study. All of your data has been safely deleted. You can close this tab.</p>
  //     </div>
  //   )
  // }

  if (!getUser.data) {
    return (
      <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
        <h1 className="text-2xl font-semibold">Contact researchers!</h1>
        <p>
          Unfortunately, we were unable to find your current submission.
          Please contact the researchers for support at <a href="mailto:A.H.Erlei@tudelft.nl" className="text-blue-600 hover:underline">A.H.Erlei@tudelft.nl</a>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background min-h-screen w-full items-center gap-6 p-24 mt-10">
      {/* Absolute top left and top right task instructions and revoke consent button */}
      <div className="absolute top-0 left-0 right-0 flex justify-between p-4">
        <div>
          {(state === State.finance || state === State.reviews || state === State.medical) && (
              <div className="flex flex-col gap-6">
                <Instructions disclosure={disclosure} taskPermutation={taskPermutation} />
                <DataInformation disclosure={disclosure} />
              </div>
            )}
        </div>
        <div>
            {state !== State.completion_screen && !revokedConsent && (
            <RevokeConsent userId={userId!} setRevokedConsent={setRevokedConsent} updateState={updateState} handleBeforeUnload={handleBeforeUnload} />
          )}
        </div> 
      </div>
      {renderStateContent()}
    </div>
  );
}
