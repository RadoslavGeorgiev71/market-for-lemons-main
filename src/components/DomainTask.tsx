import { useState, useRef, useEffect } from "react";
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

interface AISystem {
  id: string;
  accuracy: number;
  dataQuality: string;
  isLemon: boolean;
}

interface FinanceTask {
  id: string;
  truePrediction: string;
  values: {
    [key: string]: string | number;
  }
}

interface DomainTaskProps {
  domain: string;
  tasks: FinanceTask[];
  aiSystems: AISystem[];
  disclosure: Disclosure;
  userId: string;
  // completedTasks?: TaskType[];
  onComplete?: () => void;
}

export default function DomainTask({
  domain,
  tasks,
  aiSystems,
  disclosure,
  userId,
  // completedTasks = [],
  onComplete,
}: DomainTaskProps) {
  const [hoveredSystem, setHoveredSystem] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoverProgress, setHoverProgress] = useState(0); // 0 → 100 %
  const hoverTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [selectedAnswer, setSelectedAnswer] = useState<"Accept" | "Reject" | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<AISystem | null>(null);
  const [selectedSystemIndex, setSelectedSystemIndex] = useState<number | null>(null);
  const [chosenOption, setChosenOption] = useState<"Own Answer" |"AI answer" | null>(null);

  const [showResult, setShowResult] = useState(false);



  // API mutations
  const utils = api.useUtils();
  const createTask = api.task.create.useMutation({
    onSuccess: async () => {
      // Invalidate tasks query to update task list
      await utils.task.getTasksForUser.invalidate({ userId, domain });
    },
  });

  const tasksQuery = api.task.getTasksForUser.useQuery({ userId, domain });
  const currentTaskIndex = tasksQuery.data?.length || 0;

  const handleAiSystemSelect = async (system: AISystem, index: number) => {
    clearInterval(hoverTimer.current!);
    setSelectedSystem(system);
    setSelectedSystemIndex(index);
  };

  const submitAnswer = () => {
    if (chosenOption === "Own Answer") {
      createTask.mutate({
        userId: userId,
        domain: domain,
        questionNum: currentTaskIndex + 1,
        taskId: tasks[currentTaskIndex].id,
        usedAI: false,
        systemId: "",
        succeeded: selectedAnswer === tasks[currentTaskIndex].truePrediction,
      });
    } else {
      createTask.mutate({
        userId: userId,
        domain: domain,
        questionNum: currentTaskIndex + 1,
        taskId: tasks[currentTaskIndex].id,
        usedAI: true,
        systemId: selectedSystem!.id,
        succeeded: selectedSystem!.isLemon,
      });
    }

    setSelectedAnswer(null);
    setSelectedSystem(null);
  };



  const revealedSystems: String[] = api.hoveredAiSystem.getHoveredAiSystems
    .useQuery({ userId }).data?.map((system) => String(system.aiSystemId)) || [];

  const createHoverAiSystem = api.hoveredAiSystem.create.useMutation(
    {
      onSuccess: () => {
        // Invalidate hovered systems query to update list
        utils.hoveredAiSystem.getHoveredAiSystems.invalidate({ userId });
      },
    }
  );

  const HOVER_TIME = 1000; // ms until reveal

  const handleMouseEnter = (system: AISystem) => {
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
        await createHoverAiSystem.mutateAsync({ userId: userId, aiSystem: system.id });
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



  if (tasksQuery.isFetching) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-0">
      <h1 className="text-2xl font-bold mb-4">{domain} task {currentTaskIndex + 1}/{tasks.length}</h1>
      <div className="w-full flex flex-row gap-x-6 items-start p-4 border-2 border-gray-50 rounded-md h-126">
        <div className="flex flex-col items-center w-[30%]">
          <h2 className="text-xl max-w-3xl mb-4 text-left flex-1">
            Applicant details
          </h2>

          <div className="bg-gray-50 p-2 rounded-md min-w-80">
            <table className="min-w-full border border-gray-300">
                <tbody>
                {Object.entries(tasks[currentTaskIndex].values).map((row, index) => (
                  <tr key={index}>
                    <td className="bg-gray-200 border text-xs border-gray-500 px-2 py-2 text-left w-[40%]">{row[0]}</td>
                    <td className="border text-xs border-gray-500 px-2 py-1 text-left w-[60%]">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Divider */}
        <div className="border-l-2 border-gray-50 self-stretch"></div>

        <div className="h-full flex flex-col items-center justify-between">
          <div className="flex flex-col items-center">
            <h2 className="text-xl max-w-3xl">
              Your decision
            </h2>
            <h3 className="m-2 text-center">
              Considering the applicant's details on the left, do you decide to accept or reject this loan request?
            </h3>
            <div className="flex flex-row items-center justify-between space-x-2 min-w-[30%] m-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="choice"
                  value="Accept"
                  checked={selectedAnswer === "Accept"}
                  onChange={(e) => setSelectedAnswer(e.target.value as "Accept")}
                />
                <p className="text-xl">Accept</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="choice"
                  value="Reject"
                  checked={selectedAnswer === "Reject"}
                  onChange={(e) => setSelectedAnswer(e.target.value as "Reject")}
                />
                <p className="text-xl">Reject</p>
              </div>
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
            <h2 className="text-xl max-w-3xl mb-4 text-center flex-1">AI pool</h2>
            <div className="grid grid-cols-5 gap-4 p-2 border-2 rounded-lg border-gray-50 min-w-175">
              {aiSystems.map((system, index) => {
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
                    {isHovered && !isRevealed && selectedSystem !== system && disclosure !== Disclosure.none && (
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
                            <p>Accuracy: {system.accuracy}%</p>
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
                        
                        <div className="text-center text-xs mt-2 text-muted-foreground">
                          <p>Accuracy: {selectedSystem!.accuracy}%</p>
                          <p>Data Quality: {selectedSystem!.dataQuality}</p>
                        </div>
                    </div>
                    <h2 className="text-xl max-w-3xl">
                      AI answer: {selectedSystem!.isLemon ? 
                        (tasks[currentTaskIndex].truePrediction === "Accept" ? "Reject" : "Accept") : 
                        (tasks[currentTaskIndex].truePrediction === "Accept" ? "Accept" : "Reject")}
                      </h2>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t-2 border-gray-900 self-stretch m-4"></div>

                <div className="flex flex-col items-center">
                  <h2 className="text-xl max-w-3xl mb-8 text-center">
                    The correct decision is: <strong>{tasks[currentTaskIndex].truePrediction}</strong>
                  </h2>
                  <Button className="w-50 mb-5" onClick={() => {
                    submitAnswer();
                    setShowResult(false);
                  }}>Finish and Next!</Button>
                </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
