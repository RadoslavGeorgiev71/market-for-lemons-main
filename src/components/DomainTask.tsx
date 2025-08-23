import { useState, useRef, useEffect, JSX } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "./ui/dialog";
import { Bot } from "lucide-react";
import { api } from "@/trpc/react";

import { Disclosure } from "@/types/disclosure";
import Loading from "@/app/loading";
import { Slider } from "./ui/slider";
import { AISystem } from "@/types/aiSystem";
import { Task } from "@/types/task";


interface DomainTaskProps {
  userId: string;
  domain: string;
  disclosure: Disclosure;
  instancePermutation: number[];
  aiPermutation: number[];
  accuracies: number[];
  currentInstance: number;
  tasks: Task[];
  aiSystems: AISystem[];
  updatePath: (userId: string, currentInstance: number) => void;
  onComplete?: () => void;
  taskInformationComponent: (currentTask: Task) => JSX.Element;
  taskTerms: {
    positive: string;
    negative: string;
    question: string;
  }
}

export default function DomainTask({
  userId,
  domain,
  disclosure,
  tasks,
  aiSystems,
  instancePermutation,
  aiPermutation,
  accuracies,
  currentInstance,
  updatePath,
  onComplete,
  taskInformationComponent,
  taskTerms
}: DomainTaskProps) {
  const [hoveredSystem, setHoveredSystem] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoverProgress, setHoverProgress] = useState(0); // 0 → 100 %
  const hoverTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [selectedAnswer, setSelectedAnswer] = useState<DomainTaskProps["taskTerms"]["positive"] | DomainTaskProps["taskTerms"]["negative"] | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<AISystem | null>(null);
  const [selectedSystemIndex, setSelectedSystemIndex] = useState<number | null>(null);
  const [chosenOption, setChosenOption] = useState<"Own Answer" |"AI answer" | null>(null);

  const [showResult, setShowResult] = useState(false);

  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedLemonNumber, setSelectedLemonNumber] = useState<number | null>(null);
  const [selectedTrust, setSelectedTrust] = useState<number | null>(null);

  const [startTime, setStartTime] = useState<number | null>(null);


  // Start timer when the page is opened
  useEffect(() => {
    setStartTime(Date.now());
    utils.hoveredAiSystem.getHoveredAiSystems.invalidate({ userId, domain });
  }, []);


  // API mutations
  const utils = api.useUtils();
  const createTask = api.task.create.useMutation({
    onSuccess: async () => {
      // Invalidate tasks query to update task list
      await utils.task.getTasksForUser.invalidate({ userId, domain });
    },
  });

  // Get the current task based on the permutations and the current instance
  const currentTask = tasks[instancePermutation[currentInstance]];

  const handleAiSystemSelect = async (system: AISystem, index: number) => {
    if (revealedSystems.includes(system.id) || disclosure == Disclosure.none) {
      setSelectedSystem(system);
      setSelectedSystemIndex(index);
    }
  };

  const submitAnswer = async () => {
    if (currentInstance == 3 || currentInstance == 8) {
      setShowSurvey(true);
    } else {
      nextTask();
    }
  };

  const nextTask = async () => {
    const elapsedMs = Date.now() - startTime!;
    const elapsedSeconds = Math.floor(elapsedMs / 1000);

    if (chosenOption === "Own Answer") {
      await createTask.mutateAsync({
        userId: userId,
        domain: domain,
        questionNum: currentInstance + 1,
        taskId: currentTask.id,
        usedAI: false,
        systemId: "",
        succeeded: selectedAnswer === currentTask.truePrediction,
        timeSpent: elapsedSeconds,
      });
    } else {
      await createTask.mutateAsync({
        userId: userId,
        domain: domain,
        questionNum: currentInstance + 1,
        taskId: currentTask.id,
        usedAI: true,
        systemId: selectedSystem!.id,
        succeeded: selectedSystem!.isLemon,
        timeSpent: elapsedSeconds,
      });

      if (!revealedSystems.includes(selectedSystem!.id)) {
        await createHoverAiSystem.mutateAsync({ userId: userId, domain: domain, aiSystem: selectedSystem!.id });
      }
    }

    updatePath(userId, currentInstance + 1);

    setSelectedAnswer(null);
    setSelectedSystem(null);

    setStartTime(Date.now());

    if (currentInstance == tasks.length - 1) {
      utils.hoveredAiSystem.getHoveredAiSystems.invalidate({ userId, domain });
      onComplete?.();
    }
  };



  const createSurveyResult = api.surveyResult.create.useMutation();

  const submitSurvey = async () => {
    await createSurveyResult.mutateAsync({
      userId: userId,
      domain: domain,
      questionNum: currentInstance + 1,
      selectedLemonNumber: selectedLemonNumber!,
      selectedTrust: selectedTrust!,
    });

    setSelectedLemonNumber(null);
    setSelectedTrust(null);
    setShowSurvey(false);
    nextTask();
  };

  const { data: hoveredSystemsData, isLoading: isLoadingHoveredSystems } = api.hoveredAiSystem.getHoveredAiSystems.useQuery({ userId, domain });

  const revealedSystems: String[] = hoveredSystemsData?.map((system) => String(system.aiSystemId)) ?? [];

  const createHoverAiSystem = api.hoveredAiSystem.create.useMutation(
    {
      onSuccess: () => {
        // Invalidate hovered systems query to update list
        utils.hoveredAiSystem.getHoveredAiSystems.invalidate({ userId, domain });
      },
    }
  );

  const HOVER_TIME = 1000; // ms until reveal

  const handleMouseEnter = (system: AISystem) => {
    if (disclosure == Disclosure.none) return; // no hover when there is no disclosure
    if (revealedSystems.includes(system.id)) return; // already revealed

    setHoveredSystem(system.id);
    setHoverProgress(0);
    const start = Date.now();

    hoverTimer.current = setInterval(async () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / HOVER_TIME) * 100, 100);
      setHoverProgress(pct);

      if (pct >= 100) {
        clearInterval(hoverTimer.current!);
        await createHoverAiSystem.mutateAsync({ userId: userId, domain, aiSystem: system.id });
        setHoveredSystem(null);
      }
    }, 16);
  };

  const handleMouseLeave = () => {
    setHoveredSystem(null);
    setHoverProgress(0);
    clearInterval(hoverTimer.current!);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX + 15, y: e.clientY + 15 }); // offset 15px from cursor
  };

  useEffect(() => {
    return () => clearInterval(hoverTimer.current!); // cleanup
  }, []);



  const getAIResponse = (system: AISystem): string => {
    const rng = Math.random() * 100;
    if (system.isLemon) {
      return rng < 15 ? taskTerms.positive : taskTerms.negative;
    } else {
      return rng < 90 ? taskTerms.positive : taskTerms.negative;
    }
  }

  

  if (createTask.isPending || isLoadingHoveredSystems) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-0 mt-[-25]">
      <h1 className="text-2xl font-bold mb-4">{domain} task {currentInstance + 1}/{tasks.length}</h1>
      <div className="flex flex-row max-w-300 gap-x-6 p-4 border-2 border-gray-50 rounded-md items-stretch">
        {taskInformationComponent(currentTask)}

        {/* Divider */}
        <div className="border-l-2 border-gray-50 self-stretch"></div>

        <div className="flex flex-grow flex-col items-center justify-between">
          <div className="flex flex-col items-center">
            <h2 className="text-xl max-w-3xl">
              Your decision
            </h2>
            <h3 className="m-2 text-center">
              {taskTerms.question}
            </h3>
            <div className="flex flex-row items-center justify-between space-x-10 min-w-[30%] m-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="choice"
                  value={taskTerms.positive}
                  checked={selectedAnswer === taskTerms.positive}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="cursor-pointer"
                />
                <span className="text-xl">{taskTerms.positive}</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="choice"
                  value={taskTerms.negative}
                  checked={selectedAnswer === taskTerms.negative}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="cursor-pointer"
                />
                <span className="text-xl">{taskTerms.negative}</span>
              </label>
            </div>
            <div className="flex flex-row items-center justify-between space-x-5 m-3">
              {selectedSystem !== null && (
                <Button className="w-45"
                  onClick={() => {
                    setChosenOption("AI answer");
                    setShowResult(true);
                  }}>Delegate decision to AI</Button>
              )}
              {selectedAnswer !== null && (
                <Button className="w-45"
                  onClick={() => {
                    setChosenOption("Own Answer");
                    setShowResult(true);
                  }}>Use own answer</Button>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl max-w-3xl mb-4 mt-5 text-center flex-1">AI pool</h2>
            <div className="grid grid-cols-5 gap-4 p-2 border-2 rounded-lg border-gray-50 min-w-175">
              {/* Display AI Systems in instance order */}
              {aiPermutation.map(i => aiSystems[i]).map((system, index) => {
                const isRevealed = revealedSystems.includes(system.id);
                const isHovered = hoveredSystem === system.id;

                return (
                  <div 
                    key={system.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(system)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    onClick={() => handleAiSystemSelect(system, index)}
                  >
                    {/* Hover & Hold to Open */}
                    {isHovered && !isRevealed && disclosure !== Disclosure.none && (
                      <svg
                        className="fixed z-50 w-5 h-5 pointer-events-none"
                        style={{ top: mousePos.y, left: mousePos.x }}
                        viewBox="0 0 36 36"
                      >
                        {/* Background Circle */}
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          stroke="#ddd"
                          strokeWidth="4"
                          fill="white"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          stroke="#4f46e5" // Tailwind purple-600
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={100}
                          strokeDashoffset={100 - hoverProgress}
                          strokeLinecap="round"
                          transform="rotate(-90 18 18)"
                        />
                      </svg>
                    )}

                    <div className={`${selectedSystem?.id === system.id ? "border-3 border-green-500" : "border-3 border-gray-50"} flex flex-col items-center p-1 w-30 rounded-lg cursor-pointer hover:scale-105 transition-transform bg-card`}>
                        <div className="flex flex-row items-center">
                          <div className="p-3 rounded-full bg-primary/10">
                            <Bot size={25} className="text-primary" />
                          </div>
                          <h3 className="font-semibold text-xs ml-2">
                            AI-{index + 1}
                          </h3>
                        </div>
                        
                        {isRevealed && <div className="text-center text-xs min-w-30 mt-2 text-muted-foreground">
                          {disclosure !== Disclosure.none && (
                            <p>Accuracy: {system.accuracy + accuracies[index]}%</p>
                          )}
                          {disclosure === Disclosure.full && (
                            <p>Data Quality: {system.dataQuality}</p>
                          )}
                        </div>} 
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {showResult && (
        <Dialog 
          open={showResult} 
          onOpenChange={(open) => {
            setShowResult(open);
            if (!open) {
              submitAnswer();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle> </DialogTitle>
            </DialogHeader>
                {chosenOption === "Own Answer" ? (
                  <div className="flex flex-col items-center w-110">
                    <h2 className="text-xl max-w-3xl">Your decision is:</h2>
                    <h2 className="text-xl max-w-3xl m-5">{selectedAnswer}</h2>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-110">
                    <h2 className="text-xl max-w-3xl">Selected AI for delegation:</h2>
                    <div className="border-3 border-green-500 flex flex-col m-5 w-30 items-center p-1 min-w-30 rounded-lg bg-card">
                        <div className="flex flex-row items-center">
                          <div className="p-3 rounded-full bg-primary/10">
                            <Bot size={25} className="text-primary" />
                          </div>
                          <h3 className="font-semibold text-xs ml-2">
                            AI-{selectedSystemIndex! + 1}
                          </h3>
                        </div>
                        
                        <div className="text-center text-xs min-w-30 mt-2 text-muted-foreground">
                          {disclosure !== Disclosure.none && (
                            <p>Accuracy: {selectedSystem!.accuracy + accuracies[selectedSystemIndex!]}%</p>
                          )}
                          {disclosure === Disclosure.full && (
                            <p>Data Quality: {selectedSystem!.dataQuality}</p>
                          )}
                        </div>
                    </div>
                    <h2 className="text-xl max-w-3xl">
                      AI answer: {getAIResponse(selectedSystem!)}
                    </h2>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t-2 border-gray-900 self-stretch m-4"></div>

                <div className="flex flex-col items-center">
                  <h2 className="text-xl max-w-3xl mb-8 text-center">
                    The correct decision is: <strong>{currentTask.truePrediction}</strong>
                  </h2>
                  <Button className="w-50 mb-5" onClick={() => {
                    submitAnswer();
                    setShowResult(false);
                  }}>Finish and Next!</Button>
                </div>
          </DialogContent>
        </Dialog>
      )}

      {showSurvey && !showResult && (
        <Dialog
          open={showSurvey}
          onOpenChange={(open) => {
            setShowSurvey(open);

            // Do not allows the closing of the survey if it is not completed
            if (!open && (selectedLemonNumber === null || selectedTrust === null)) {
              setShowSurvey(true);
              return;
            }

            if (!open) {
              submitSurvey();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
              <h3 className="m-2 text-center">
                How many lemons do you believe exist on the market?
              </h3>
              {/* Two groups of connected radio buttons for numbers 0-5 and 6-10 */}
              <div className="flex flex-row justify-center space-x-5">
                {Array.from({ length: 6 }, (_, i) => i).map((n) => (
                  <label key={n}>
                    <input type="radio" name="number" value={n} onChange={() => setSelectedLemonNumber(n)}/>
                    {n}
                  </label>
                ))}
              </div>
              <div className="flex flex-row justify-center space-x-5">
                {Array.from({ length: 5 }, (_, i) => i + 6).map((n) => (
                  <label key={n}>
                    <input type="radio" name="number" value={n} onChange={() => setSelectedLemonNumber(n)}/>
                    {n}
                  </label>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t-2 border-gray-900 self-stretch m-4"></div>

              <h3 className="m-2 text-center">
                To what extent do you trust the market?
              </h3>
              <div className="flex flex-row justify-between">
                <p>0%</p>
                <p className="ml-5">50%</p>
                <p>100%</p>
              </div>
              <Slider
                min={0}
                max={100}
                step={10}
                onValueChange={(value) => setSelectedTrust(value[0])}
              />
  
              <div className="flex flex-col items-center mt-5">
                {selectedLemonNumber !== null && selectedTrust !== null && (
                  <Button className="w-50 mb-5" onClick={submitSurvey}>
                    Submit Survey
                  </Button>
                )}
              </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
