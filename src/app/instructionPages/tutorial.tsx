import Finance from "@/components/finance";
import { Disclosure } from "@/types/disclosure";
import { useEffect, useState } from "react";


interface tutorialProps {
    userId: string;
    disclosure: Disclosure;
}

export default function Tutorial({ userId, disclosure }: tutorialProps) {
    // keep track of current task(0 to 2)
    const [currentTask, setCurrentTask] = useState(() => {
        return sessionStorage.getItem('currentTask') || '0';
    });

    useEffect(() => {
        sessionStorage.setItem('currentTask', currentTask);
    }, [currentTask]);

    // keep track of current instance(0 to 4)
    const [currentInstance, setCurrentInstance] = useState(() => {
        return sessionStorage.getItem('currentInstance') || '0';
    });

    useEffect(() => {
        sessionStorage.setItem('currentInstance', currentInstance);
    }, [currentInstance]);

    return (
        <div className="p-4 border rounded-lg">
            <p>Here is a tutorial for the experiment. It contains 5 rounds of each of the 3 tasks. The idea is to familiarize yourself with the interface and the types of questions.</p>
            <Finance userId={userId} disclosure={disclosure} instancePermutation={[]} aiPermutation={[]} accuracies={[]} currentInstance={0} aiSystems={[]} updatePath={function (userId: string, newInstance: number): void {
                throw new Error("Function not implemented.");
            } } onComplete={function (): void {
                throw new Error("Function not implemented.");
            } }></Finance>
        </div>
    );
}