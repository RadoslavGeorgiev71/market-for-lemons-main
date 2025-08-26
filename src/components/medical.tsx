import { Disclosure } from "@/types/disclosure";
import data from "../data/data.json";
import { AISystem } from "@/types/aiSystem";
import DomainTask from "./domainTask";
import { Task } from "@/types/task";
import Image from "next/image";


const medicalTasks = data.skinCancer.instances;
const medicalTutorialTasks = data.tutorial.skinCancer;

interface MedicalProps {
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

export default function Medical({ userId, disclosure, instancePermutation, aiPermutations, accuracies,
     currentInstance, aiSystems, updatePath, onComplete, tutorial }: MedicalProps) {
    const medicalTerms = {
        positive: "Benign",
        negative: "Malignant",
        question: "Considering the image on the left, does it appear to be benign or show signs of cancer?"
    }

    const medicalTaskInfoComponent = (currentTask: Task) => (
        <div className="flex flex-col items-center h-full">
            <h2 className="h-5 mb-5 text-xl max-w-3xl">
                Skin image
            </h2>

            <Image 
                src={`/images/${tutorial ? `cancer_tutorial_images/` : `cancer_images/`}${currentTask.values.file}`} 
                alt="Photo" 
                width={512} 
                height={512} 
                className="rounded-sm m-5"
            />
        </div>
    )

    return (
        <DomainTask
            userId={userId}
            domain="Cancer prediction"
            disclosure={disclosure}
            tasks={tutorial ? medicalTutorialTasks : medicalTasks}
            instancePermutation={instancePermutation}
            aiPermutations={aiPermutations}
            accuracies={accuracies}
            currentInstance={currentInstance}
            aiSystems={aiSystems}
            updatePath={updatePath}
            onComplete={onComplete}
            taskInformationComponent={medicalTaskInfoComponent}
            taskTerms={medicalTerms}
            tutorial={tutorial}
        />
    )
}