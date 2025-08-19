import { Disclosure } from "@/types/disclosure";
import data from "../data/data.json";
import { AISystem } from "@/types/aiSystem";
import DomainTask from "./domainTask";
import { Task } from "@/types/task";


const reviewTasks = data.deceptionDetection.instances;

interface ReviewProps {
    userId: string;
    disclosure: Disclosure;
    instancePermutation: number[];
    aiPermutation: number[];
    accuracies: number[];
    currentInstance: number;
    aiSystems: AISystem[];
    updatePath: (userId: string, newInstance: number) => void;
    onComplete: () => void;
}

export default function Reviews({ userId, disclosure, instancePermutation, aiPermutation, accuracies,
    currentInstance, aiSystems, updatePath, onComplete }: ReviewProps) {
    const reviewTerms = {
        positive: "Genuine",
        negative: "Deceptive"
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
            domain="Deception detection"
            disclosure={disclosure}
            tasks={reviewTasks}
            instancePermutation={instancePermutation}
            aiPermutation={aiPermutation}
            accuracies={accuracies}
            currentInstance={currentInstance}
            aiSystems={aiSystems}
            updatePath={updatePath}
            onComplete={onComplete}
            taskInformationComponent={reviewTaskInfoComponent}
            taskTerms={reviewTerms}
        />
    )
}