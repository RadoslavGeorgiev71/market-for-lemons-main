import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Bot } from "lucide-react";
import { DataQuality } from "@/types/quality";
import { api } from "@/trpc/react";
import { Task as TaskType } from "@/server/api/models/task";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Progress } from "antd";
import { Disclosure } from "@/types/disclosure";

interface AISystem {
  id: number;
  name: string;
  accuracy: number;
  dataQuality: DataQuality;
}

interface Task {
  id: number;
  question: string;
  correctAnswer: string;
}

interface DomainTaskProps {
  domain: string;
  tasks: Task[];
  aiSystems: AISystem[];
  disclosure: Disclosure;
  user_id: string;
  completedTasks?: TaskType[];
  onComplete?: () => void;
}

export default function DomainTask({
  domain,
  tasks,
  aiSystems,
  disclosure,
  user_id,
  completedTasks = [],
  onComplete,
}: DomainTaskProps) {
  const [confidenceInChoice, setConfidenceInChoice] = useState<string>("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [confidenceInFinalAnswer, setConfidenceInFinalAnswer] =
    useState<string>("");

  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectionReasons, setSelectionReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [dialogStep, setDialogStep] = useState(1);
  const [selectedSystem, setSelectedSystem] = useState<AISystem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>("");

  const [evaluatedTask, setEvaluatedTask] = useState<Task | null>(null);

  const [hoveredSystem, setHoveredSystem] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoverProgress, setHoverProgress] = useState(0); // 0 → 100 %
  const hoverTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // API mutations
  const utils = api.useUtils();
  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      // Invalidate tasks query to update task list
      utils.task.getTasksByUserId.invalidate({ user_id });
    },
  });

  // Scroll refs for each step
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);
  const otherInputRef = useRef<HTMLInputElement>(null);

  // Scroll to current step
  useEffect(() => {
    if (isDialogOpen) {
      const refs = [step1Ref, step2Ref, step3Ref, step4Ref, step5Ref];
      const currentRef = refs[dialogStep - 1];
      if (currentRef?.current) {
        currentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [dialogStep, isDialogOpen]);

  // Auto-scroll to other input when selected
  useEffect(() => {
    if (isOtherSelected && otherInputRef.current) {
      setTimeout(() => {
        otherInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        otherInputRef.current?.focus();
      }, 100);
    }
  }, [isOtherSelected]);

  const clearModalState = () => {
    setConfidenceInChoice("");
    setFinalAnswer("");
    setConfidenceInFinalAnswer("");
    setDialogStep(1);
    setSelectedSystem(null);
    setSelectionReasons([]);
    setOtherReason("");
    setIsOtherSelected(false);
    setAiAdvice("");
  };

  // Calculate progress based on completed tasks from DB for current domain
  const domainCompletedTasks = completedTasks.filter(
    (task) => task.domain === domain
  );

  const currentTaskIndex = domainCompletedTasks.length || 0;

  const currentTask = tasks[currentTaskIndex];

  const progress = (domainCompletedTasks.length / tasks.length) * 100;

  const handleSubmit = async () => {
    if (!selectedSystem) return;

    // Before switching to the next task, save the current task data
    setIsCorrect(finalAnswer === currentTask.correctAnswer);
    setEvaluatedTask(currentTask);
    // Save the task data
    try {
      await createTask.mutateAsync({
        user_id,
        domain,
        question_num: currentTaskIndex + 1,
        question: currentTask.question,
        ai_system: selectedSystem.name,
        ai_advice: aiAdvice,
        initial_confidence: parseInt(confidenceInChoice),
        final_confidence: parseInt(confidenceInFinalAnswer),
        final_answer: finalAnswer,
      });
    } catch (error) {
      console.error("Failed to save task:", error);
    }

    setShowResult(true);
    setIsDialogOpen(false);
  };

  // Generate AI advice based on the selected system and task
  const generateAIAdvice = (task: Task, system: AISystem) => {
    // Simple logic to generate AI advice based on accuracy
    // In a real implementation, this would be more sophisticated
    if (Math.random() * 100 < system.accuracy) {
      return task.correctAnswer;
    } else {
      //TODO: 
      // Generate a plausible wrong answer for demonstration
      return "AI generated incorrect answer";
    }
  };

  const handleNextTask = () => {
    if (currentTaskIndex < tasks.length) {
      setConfidenceInChoice("");
      setFinalAnswer("");
      setConfidenceInFinalAnswer("");
      setShowResult(false);
      setSelectionReasons([]);
      setOtherReason("");
      setIsOtherSelected(false);
      setDialogStep(1);
      setSelectedSystem(null);
      setAiAdvice("");
    } else {
      onComplete?.();
    }
  };

  const handleSystemSelect = async (system: AISystem) => {
    setSelectedSystem(system);
    clearInterval(hoverTimer.current!);
    if (!revealedSystems.includes(system.id)) {
      await createHoverSystem.mutateAsync({ user_id: user_id, domain: domain, ai_system: system.id });
    }
    setAiAdvice(generateAIAdvice(currentTask, system));
    setDialogStep(1);
    setIsDialogOpen(true);
  };

  const handleNextStep = () => {
    setDialogStep((prev) => prev + 1);
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return confidenceInChoice !== "";
      case 2:
        return true; // AI prediction is just shown
      case 3:
        return finalAnswer.trim().length > 0;
      case 4:
        return confidenceInFinalAnswer !== "";
      case 5:
        return (
          (selectionReasons.length > 0 || isOtherSelected) &&
          (!isOtherSelected || otherReason.trim() !== "")
        );
      default:
        return false;
    }
  };

  const createHoverSystem = api.hoveredSystem.create.useMutation(
    {
      onSuccess: () => {
        // Invalidate hovered systems query to update list
        utils.hoveredSystem.getHoveredSystems.invalidate({ user_id, domain });
      },
    }
  );

  const revealedSystems: number[] = api.hoveredSystem.getHoveredSystems.useQuery({ user_id, domain }).data?.map((system) => Number(system.ai_system)) || [];

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
        await createHoverSystem.mutateAsync({ user_id: user_id, domain: domain, ai_system: system.id });
        setHoveredSystem(null);
      }
    }, 16);
  };

  const handleMouseLeave = () => {
    //if (revealedSystems.has(systemId)) return; // don't reset revealed
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

  // const handleReasonChange = (reason: string, checked: boolean) => {
  //   if (checked) {
  //     setSelectionReasons((prev) => [...prev, reason]);
  //   } else {
  //     setSelectionReasons((prev) => prev.filter((r) => r !== reason));
  //   }
  // };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">{domain} Tasks!</h1>
      <div className="fixed bottom-8 right-8 z-50">
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Progress type="circle" percent={progress} />
          </TooltipTrigger>
          <TooltipContent className="text-sm">
            <div className="text-center">
              {domainCompletedTasks.length}/{tasks.length} Questions Completed
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      {currentTaskIndex < tasks.length && (
        <div className="w-full max-w-5xl flex flex-col gap-y-2 items-center">
          <h2 className="text-xl max-w-3xl mb-4 text-center">
            {currentTask.question}
          </h2>

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
                {isHovered && !isRevealed && !isDialogOpen && (
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
                <Dialog
                key={system.id}
                open={isDialogOpen && selectedSystem?.id === system.id}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    clearModalState();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <div
                    className="flex flex-col items-center p-6 border rounded-lg cursor-pointer hover:scale-105 transition-transform space-y-4 bg-card"
                    onClick={() => handleSystemSelect(system)}
                  >
                    <div className="p-3 rounded-full bg-primary/10">
                      <Bot size={48} className="text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">
                        {system.name}
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
                </DialogTrigger>
                <DialogContent className="h-[70vh] overflow-hidden flex flex-col">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl">
                      Task {currentTaskIndex + 1}/{tasks.length}
                    </DialogTitle>
                    <p className="text-lg text-muted-foreground mt-2">
                      {currentTask.question}
                    </p>
                    {selectedSystem && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold mb-2">
                          {selectedSystem.name}
                        </h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {disclosure !== Disclosure.none && (
                            <p>Accuracy: {selectedSystem.accuracy}%</p>
                          )}
                          {disclosure === Disclosure.full && (
                            <p>Data Quality: {selectedSystem.dataQuality}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto p-2">
                    <div className="space-y-10">
                      {/* Step 1: Confidence in AI System Choice */}
                      <div
                        ref={step1Ref}
                        className={`${dialogStep > 1 ? "opacity-50" : ""}`}
                      >
                        <div className="flex flex-col gap-y-2">
                          <Label>Confidence in AI System Choice (1-7)</Label>
                          <RadioGroup
                            value={confidenceInChoice}
                            onValueChange={(value) =>
                              setConfidenceInChoice(value)
                            }
                            className="flex flex-row gap-x-6"
                          >
                            {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                              <div
                                key={value}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={value.toString()}
                                  id={`confidence-choice-${value}`}
                                />
                                <Label
                                  htmlFor={`confidence-choice-${value}`}
                                  className="text-sm"
                                >
                                  {value}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>

                      {/* Step 2: AI System Prediction */}
                      {dialogStep >= 2 && (
                        <div
                          ref={step2Ref}
                          className={`space-y-4 ${
                            dialogStep > 2 ? "opacity-50" : ""
                          }`}
                        >
                          <div>
                            <Label>AI System Prediction</Label>
                            <div className="mt-2 p-4 bg-muted rounded-md">
                              {selectedSystem?.name} predicts: {aiAdvice}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Final Answer */}
                      {dialogStep >= 3 && (
                        <div
                          ref={step3Ref}
                          className={`space-y-4 ${
                            dialogStep > 3 ? "opacity-50" : ""
                          }`}
                        >
                          <div>
                            <Label>Your Final Answer</Label>
                            <input
                              type="text"
                              value={finalAnswer}
                              onChange={(e) => setFinalAnswer(e.target.value)}
                              className="mt-2 w-full p-2 border rounded-md"
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 4: Confidence in Final Answer */}
                      {dialogStep >= 4 && (
                        <div
                          ref={step4Ref}
                          className={`space-y-4 ${
                            dialogStep > 4 ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex flex-col gap-y-2">
                            <Label>Confidence in Final Answer (1-7)</Label>
                            <RadioGroup
                              value={confidenceInFinalAnswer}
                              onValueChange={(value) =>
                                setConfidenceInFinalAnswer(value)
                              }
                              className="flex flex-row gap-x-6"
                            >
                              {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                                <div
                                  key={value}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={value.toString()}
                                    id={`confidence-final-${value}`}
                                  />
                                  <Label
                                    htmlFor={`confidence-final-${value}`}
                                    className="text-sm"
                                  >
                                    {value}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </div>
                      )}

                      {/* Step 5: Selection Reason (Last Task Only) */}
                      {/* {dialogStep >= 5 &&
                        currentTaskIndex === tasks.length - 1 && (
                          <div ref={step5Ref} className="space-y-4">
                            <div>
                              <Label className="text-base font-medium">
                                Why did you choose this AI system? (Select all
                                that apply)
                              </Label>
                              <div className="mt-4 space-y-4">
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    id="self-belief"
                                    checked={selectionReasons.includes(
                                      "self-belief"
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleReasonChange("self-belief", !!checked)
                                    }
                                  />
                                  <Label
                                    htmlFor="self-belief"
                                    className="text-sm font-normal"
                                  >
                                    Self-belief in completing the task
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    id="trust"
                                    checked={selectionReasons.includes("trust")}
                                    onCheckedChange={(checked) =>
                                      handleReasonChange("trust", !!checked)
                                    }
                                  />
                                  <Label
                                    htmlFor="trust"
                                    className="text-sm font-normal"
                                  >
                                    Trust in AI capabilities
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    id="experience"
                                    checked={selectionReasons.includes(
                                      "experience"
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleReasonChange("experience", !!checked)
                                    }
                                  />
                                  <Label
                                    htmlFor="experience"
                                    className="text-sm font-normal"
                                  >
                                    Past experience with AI
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    id="complementary"
                                    checked={selectionReasons.includes(
                                      "complementary"
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleReasonChange(
                                        "complementary",
                                        !!checked
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor="complementary"
                                    className="text-sm font-normal"
                                  >
                                    Belief in complementary skills
                                  </Label>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-3">
                                    <Checkbox
                                      id="other"
                                      checked={isOtherSelected}
                                      onCheckedChange={(checked) => {
                                        setIsOtherSelected(!!checked);
                                        if (!checked) {
                                          setOtherReason("");
                                        }
                                      }}
                                    />
                                    <Label
                                      htmlFor="other"
                                      className="text-sm font-normal"
                                    >
                                      Other
                                    </Label>
                                  </div>
                                  {isOtherSelected && (
                                    <div className="ml-7 mt-2">
                                      <Input
                                        ref={otherInputRef}
                                        placeholder="Please specify your reason..."
                                        value={otherReason}
                                        onChange={(e) =>
                                          setOtherReason(e.target.value)
                                        }
                                        className="w-full"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )} */}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    {dialogStep === 1 && (
                      <Button
                        onClick={handleNextStep}
                        className="w-full"
                        disabled={!isStepComplete(1)}
                      >
                        Confirm Choice
                      </Button>
                    )}

                    {dialogStep === 2 && (
                      <div className="flex gap-2">
                        <Button onClick={handleNextStep} className="flex-1">
                          Next
                        </Button>
                      </div>
                    )}

                    {dialogStep === 3 && (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleNextStep}
                          className="flex-1"
                          disabled={!isStepComplete(3)}
                        >
                          Confirm Answer
                        </Button>
                      </div>
                    )}

                    {dialogStep === 4 && (
                      <div className="flex gap-2">
                        <Button
                          onClick={
                            // currentTaskIndex === tasks.length - 1
                            //   ? handleNextStep
                            //   : handleSubmit
                            handleSubmit
                          }
                          className="flex-1"
                          disabled={!isStepComplete(4)}
                        >
                          {currentTaskIndex === tasks.length - 1
                            ? "Next"
                            : "Confirm Confidence and Submit"}
                        </Button>
                      </div>
                    )}

                    {dialogStep === 5 && (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSubmit}
                          className="flex-1"
                          disabled={!isStepComplete(5)}
                        >
                          Submit
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
                </Dialog>
              </div>
              )
            })}
          </div>
        </div>
      )}

      {showResult && (
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
      )}
    </div>
  );
}
