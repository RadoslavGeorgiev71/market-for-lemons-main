import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Bot } from "lucide-react";
import { api } from "@/trpc/react";
import { Task as TaskType } from "@/server/api/models/task";

import { Disclosure } from "@/types/disclosure";

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
  completedTasks?: TaskType[];
  onComplete?: () => void;
}

export default function DomainTask({
  domain,
  tasks,
  aiSystems,
  disclosure,
  userId,
  completedTasks = [],
  onComplete,
}: DomainTaskProps) {
  const [showResult, setShowResult] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  const [evaluatedTask, setEvaluatedTask] = useState<FinanceTask | null>(null);

  const [hoveredSystem, setHoveredSystem] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoverProgress, setHoverProgress] = useState(0); // 0 → 100 %
  const hoverTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // API mutations
  const utils = api.useUtils();
  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      // Invalidate tasks query to update task list
      utils.task.getTasksByUserId.invalidate({ userId });
    },
  });

  // const handleSubmit = async () => {
  //   if (!selectedSystem) return;

  //   // Before switching to the next task, save the current task data
  //   setIsCorrect(finalAnswer === currentTask.correctAnswer);
  //   setEvaluatedTask(currentTask);
  //   // Save the task data
  //   try {
  //     await createTask.mutateAsync({
  //       user_id,
  //       domain,
  //       question_num: currentTaskIndex + 1,
  //       question: currentTask.question,
  //       ai_system: selectedSystem.name,
  //       ai_advice: aiAdvice,
  //       initial_confidence: parseInt(confidenceInChoice),
  //       final_confidence: parseInt(confidenceInFinalAnswer),
  //       final_answer: finalAnswer,
  //     });
  //   } catch (error) {
  //     console.error("Failed to save task:", error);
  //   }

  //   setShowResult(true);
  //   setIsDialogOpen(false);
  // };

  // Generate AI advice based on the selected system and task
  // const generateAIAdvice = (task: Task, system: AISystem) => {
  //   // Simple logic to generate AI advice based on accuracy
  //   // In a real implementation, this would be more sophisticated
  //   if (Math.random() * 100 < system.accuracy) {
  //     return task.correctAnswer;
  //   } else {
  //     //TODO: 
  //     // Generate a plausible wrong answer for demonstration
  //     return "AI generated incorrect answer";
  //   }
  // };

  // const handleSystemSelect = async (system: AISystem) => {
  //   setSelectedSystem(system);
  //   clearInterval(hoverTimer.current!);
  //   if (!revealedSystems.includes(system.id)) {
  //     await createHoverSystem.mutateAsync({ user_id: user_id, domain: domain, ai_system: system.id });
  //   }
  //   setAiAdvice(generateAIAdvice(currentTask, system));
  //   setDialogStep(1);
  //   setIsDialogOpen(true);
  // };

  const createHoverAiSystem = api.hoveredAiSystem.create.useMutation(
    {
      onSuccess: () => {
        // Invalidate hovered systems query to update list
        utils.hoveredAiSystem.getHoveredAiSystems.invalidate({ userId });
      },
    }
  );

  const revealedSystems: String[] = api.hoveredAiSystem.getHoveredAiSystems.useQuery({ userId }).data?.map((system) => String(system.aiSystemId)) || [];

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

  return (
    <div className="flex flex-col items-center gap-6 p-0">
      <h1 className="text-2xl font-bold mb-4">{domain} task {currentTaskIndex + 1}/{tasks.length}</h1>
      <div className="w-full flex flex-row gap-x-6 items-start p-4 border-2 border-gray-50 rounded-md">
        <div className="flex flex-col items-center w-[30%]">
          <h2 className="text-xl max-w-3xl mb-4 text-left flex-1">
            Applicant details
          </h2>

          <div className="bg-gray-50 p-2 rounded-md min-w-full">
            <table className="min-w-full border border-gray-300">
                <tbody>
                {Object.entries(tasks[0].values).map((row, index) => (
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
        
        <div className="h-full flex flex-col items-center">
          <h2 className="text-xl max-w-3xl mb-4 text-left flex-1">
            Your decision
          </h2>
          {/* <h2 className="text-xl max-w-3xl mb-4 text-left flex-1">
            {currentTask.question}
          </h2> */}

          <div className="grid grid-cols-5 gap-4">
            {aiSystems.map((system) => {
              const isRevealed = revealedSystems.includes(system.id);
              const isHovered = hoveredSystem === system.id;

              return (
                <div 
                  key={system.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(system)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
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

                  <div
                      className="flex flex-col items-center p-6 border rounded-lg cursor-pointer hover:scale-105 transition-transform space-y-4 bg-card"
                      // onClick={() => handleSystemSelect(system)}
                    >
                      <div className="p-3 rounded-full bg-primary/10">
                        <Bot size={48} className="text-primary" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg mb-2">
                          {system.id}
                        </h3>
                        {isRevealed && <div className="space-y-1 text-sm text-muted-foreground">
                          {disclosure !== Disclosure.none && (
                            <p>Accuracy: {system.accuracy}%</p>
                          )}
                          {disclosure === Disclosure.full && (
                            <p>Data Quality: {system.dataQuality}</p>
                          )}
                        </div>} 
                      </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* {showResult && (
        <Dialog open={showResult} onOpenChange={setShowResult}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Result</DialogTitle>
            </DialogHeader>
            <div className="text-center">
              <p className="text-lg">{isCorrect ? "Correct!" : "Incorrect"}</p>
              <p className="mt-2">
                Correct answer: {evaluatedTask?.correctAnswer}
              </p>
              <Button onClick={handleNextTask} className="mt-4">
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )} */}
    </div>
  );
}
