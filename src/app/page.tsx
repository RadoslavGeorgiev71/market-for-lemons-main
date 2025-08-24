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
import { useEffect, useRef, useState } from "react";
import { exitPath } from "@/data/constants";
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
import { parse } from "path";


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

  const [currentTaskNum, setCurrentTaskNum] = useState<number>(0);

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

  if (!userId) {
    return (
      <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
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
            By clicking  &quot;Yes, I consent&quot;  at the bottom of this page, you confirm that you have carefully read, understood, and consent to the above information.
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
    if (!state) return <div>Invalid state</div>;

    switch (state) {
      case State.instructions:
        return (
          <>
            <div className="flex w-full h-fit mt-[-50] items-center justify-center gap-x-2">
              <h1 className="text-2xl font-semibold">Instructions</h1>
            </div>
            <div className="center items-center p-4 bg-gray-50 rounded-md">
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
                  <Tutorial userId={userId} disclosure={disclosure} aiSystems={aiSystems} taskPermutations={taskPermutation} aiPermutations={tutorialAiPermutations} accuracies={tutorialAccuracies} unlockComprehension={unlockComprehension}></Tutorial>
                </TabsContent>

                <TabsContent value="comprehension">
                  <ComprehensionQuestions disclosure={disclosure} userId={userId} updateState={updateState} handleBeforeUnload={handleBeforeUnload} />
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
      case State.completion:
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold">Thank you for participating!</h1>
            <p>You have earned <strong>{completion.data?.coins} coins.</strong></p>
            <p>You have completed all of the study. You can safely close this tab.</p>
          </div>
        );
      default:
        return <div>Invalid state</div>;
    }
  };

  const onTaskCompletion = async () => {
    if (currentTaskNum === 2) {
      const freshCount = await utils.task.countSuccessfulTasks.fetch({ userId: userId ?? "" });

      updateState.mutate({
        userId: userId!,
        state: State.completion,
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



  if (getUser.isLoading || updateState.isPending) {
    return (
      <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
        <Loading />
      </div>
    );
  }

  if (revokedConsent) {
    return (
      <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
        <h1 className="text-2xl font-semibold">Consent Revoked</h1>
        <p>You have revoked your consent to participate in this study. All of your data has been safely deleted. You can close this tab.</p>
      </div>
    )
  }

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
    <div className="flex flex-col bg-background min-h-screen w-full items-center justify-center gap-6 p-24">
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
            {state !== State.completion && !revokedConsent && (
            <RevokeConsent userId={userId!} setRevokedConsent={setRevokedConsent} handleBeforeUnload={handleBeforeUnload} />
          )}
        </div> 
      </div>
      {renderStateContent()}
    </div>
  );
}
