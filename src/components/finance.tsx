import { Disclosure } from "@/types/disclosure";

import data from "../data/data.json";
import { AISystem } from "@/types/aiSystem";
import DomainTask from "./domainTask";
import { Task } from "@/types/task";


const financeTasks = data.loanPrediction.instances;
const financeTutorialTasks = data.tutorial.loanPrediction;

interface FinanceProps{
  userId: string;
  disclosure: Disclosure;
  instancePermutation: number[];
  aiPermutation: number[];
  accuracies: number[];
  currentInstance: number;
  aiSystems: AISystem[];
  updatePath: (userId: string, newInstance: number) => void;
  onComplete: () => void;
  tutorial?: boolean;
}

export default function Finance({ userId, disclosure, instancePermutation, aiPermutation, accuracies,
   currentInstance, aiSystems, updatePath, onComplete, tutorial }: FinanceProps) {
  const financeTerms = {
    positive: "Accept",
    negative: "Reject",
    question: "Considering the applicant's details on the left, do you decide to accept or reject this loan request?"
  }

  const financeTaskInfoComponent = (currentTask: Task) => (
    <div className="flex flex-col items-center h-full">
        <h2 className="text-xl max-w-3xl mb-4 text-left flex-1">
          Applicant details
        </h2>

        <div className="bg-gray-50 p-2 rounded-md min-w-80">
          <table className="min-w-full border border-gray-300">
              <tbody>
              {Object.entries(currentTask.values).map((row, index) => (
                <tr key={index}>
                  <td className="bg-gray-200 border text-xs border-gray-500 px-2 py-2 text-left w-[40%]">{row[0]}</td>
                  <td className="border text-xs border-gray-500 px-2 py-1 text-left w-[60%]">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  )

  return (
    <DomainTask
      userId={userId}
      domain="Finance"
      disclosure={disclosure}
      tasks={tutorial ? financeTutorialTasks : financeTasks}
      instancePermutation={instancePermutation}
      aiPermutation={aiPermutation}
      accuracies={accuracies}
      currentInstance={currentInstance}
      aiSystems={aiSystems}
      updatePath={updatePath}
      onComplete={onComplete}
      taskInformationComponent={financeTaskInfoComponent}
      taskTerms={financeTerms}
    />
  );
}