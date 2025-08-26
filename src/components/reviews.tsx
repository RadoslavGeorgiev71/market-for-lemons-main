import { Disclosure } from "@/types/disclosure";
import data from "../data/data.json";
import { AISystem } from "@/types/aiSystem";
import DomainTask from "./domainTask";
import { Task } from "@/types/task";


const reviewTasks = data.deceptionDetection.instances;
const reviewTutorialTasks = data.tutorial.deceptionDetection;

interface ReviewProps {
    userId: string;
    disclosure: Disclosure;
    instancePermutation: number[];
    aiPermutations: number[][];
    accuracies: number[][];
    currentInstance: number;
    aiSystems: AISystem[];
    updatePath: (userId: string, newInstance: number) => void;
    onComplete: () => void;
    tutorial?: boolean;
}

export default function Reviews({ userId, disclosure, instancePermutation, aiPermutations, accuracies,
    currentInstance, aiSystems, updatePath, onComplete, tutorial }: ReviewProps) {
    const reviewTerms = {
        positive: "Genuine",
        negative: "Deceptive",
        question: "Considering the hotel review on the left, is it genuine or deceptive?"
    }

    const reviewTaskInfoComponent = (currentTask: Task) => (
        <div className="flex flex-col items-center h-full">
            <h2 className="h-5 mb-5 text-xl max-w-3xl">
                Hotel Review
            </h2>

            <p>{`"${currentTask.values.review}"`}</p>
        </div>
    )

    return (
        <DomainTask
            userId={userId}
            domain="Identifying deceptive hotel reviews"
            disclosure={disclosure}
            tasks={tutorial ? reviewTutorialTasks : reviewTasks}
            instancePermutation={instancePermutation}
            aiPermutations={aiPermutations}
            accuracies={accuracies}
            currentInstance={currentInstance}
            aiSystems={aiSystems}
            updatePath={updatePath}
            onComplete={onComplete}
            taskInformationComponent={reviewTaskInfoComponent}
            taskTerms={reviewTerms}
            tutorial={tutorial}
        />
    )
}