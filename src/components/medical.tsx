import { Disclosure } from "@/types/disclosure";
import data from "../data/data.json";
import { AISystem } from "@/types/aiSystem";
import DomainTask from "./domainTask";
import { Task } from "@/types/task";


const medicalTasks = data.skinCancer.instances;

interface MedicalProps {
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

export default function Medical({ userId, disclosure, instancePermutation, aiPermutation, accuracies,
     currentInstance, aiSystems, updatePath, onComplete }: MedicalProps) {
    const medicalTerms = {
        positive: "Benign",
        negative: "Cancer"
    }

    const medicalTaskInfoComponent = (currentTask: Task) => (
        <div className="flex flex-col items-center h-full">
            <h2 className="h-5 mb-5 text-xl max-w-3xl">
                Skin image
            </h2>

            <div className="bg-gray-50 w-100 h-100">
                
            </div>
        </div>
    )

    return (
        <DomainTask
            userId={userId}
            domain="Skin cancer detection"
            disclosure={disclosure}
            tasks={medicalTasks}
            instancePermutation={instancePermutation}
            aiPermutation={aiPermutation}
            accuracies={accuracies}
            currentInstance={currentInstance}
            aiSystems={aiSystems}
            updatePath={updatePath}
            onComplete={onComplete}
            taskInformationComponent={medicalTaskInfoComponent}
            taskTerms={medicalTerms}
        />
    )
}