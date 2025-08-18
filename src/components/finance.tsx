import DomainTask from "./DomainTask";
import { Disclosure } from "@/types/disclosure";

import data from "../data/data.json";
import { AISystem } from "@/types/aiSystem";


const financeTasks = data.loanPrediction.instances;

interface FinanceProps{
  userId: string; // Will be used for user-specific functionality
  disclosure: Disclosure;
  instancePermutation: number[];
  currentInstance: number;
  aiSystems: AISystem[];
  updatePath: (userId: string, newInstance: number) => void;
  onComplete: () => void;
}

export default function Finance({ userId, disclosure, instancePermutation, currentInstance, aiSystems, updatePath, onComplete }: FinanceProps) {

  return (
    <div className="flex flex-col items-center gap-6">
      
      <DomainTask
        userId={userId}
        domain="Finance"
        disclosure={disclosure}
        tasks={financeTasks}
        instancePermutation={instancePermutation}
        currentInstance={currentInstance}
        aiSystems={aiSystems}
        updatePath={updatePath}
        onComplete={onComplete}
      />
    </div>
  );
}