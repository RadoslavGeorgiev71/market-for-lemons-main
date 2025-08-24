import Finance from "@/components/finance";
import Medical from "@/components/medical";
import Reviews from "@/components/reviews";
import { AISystem } from "@/types/aiSystem";
import { Disclosure } from "@/types/disclosure";
import { useEffect, useRef, useState } from "react";


interface tutorialProps {
    userId: string;
    disclosure: Disclosure;
    aiSystems: AISystem[];
    taskPermutations: number[];
    aiPermutations: number[][][];
    accuracies: number[][][];
    unlockComprehension: () => void;
}

export default function Tutorial({ userId, disclosure, aiSystems, taskPermutations, aiPermutations, accuracies, unlockComprehension }: tutorialProps) {
    const [isCompleted, setIsCompleted] = useState(() => {
        return sessionStorage.getItem('isCompleted') === 'true' || false;
    });

    useEffect(() => {
        sessionStorage.setItem('isCompleted', isCompleted.toString());
    }, [isCompleted]);

    // keep track of current task(0 to 2)
    const [currentTask, setCurrentTask] = useState(() => {
        return parseInt(sessionStorage.getItem('currentTask') || '0');
    });

    useEffect(() => {
        sessionStorage.setItem('currentTask', currentTask.toString());
    }, [currentTask]);

    // keep track of current instance(0 to 1)
    const [currentInstance, setCurrentInstance] = useState(() => {
        return parseInt(sessionStorage.getItem('currentInstance') || '0');
    });

    useEffect(() => {
        sessionStorage.setItem('currentInstance', currentInstance.toString());
    }, [currentInstance]);

    const instancePermutation = [0, 1];

    const updateInstance = () => {
        setCurrentInstance((prev) => (prev + 1));
    };

    const onCompleteTask = () => {
        if (currentTask == 2) {
            setIsCompleted(true);
            unlockComprehension();
        }
        setCurrentTask((prev) => (prev + 1));
        setCurrentInstance(0);
    }

    // 👇 add a ref for scrolling
    const tutorialRef = useRef<HTMLDivElement>(null);

    // scroll on change
    useEffect(() => {
    if (!tutorialRef.current) return;
        const observer = new MutationObserver(() => {
            tutorialRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        observer.observe(tutorialRef.current, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    // scroll when opened
    useEffect(() => {
        if (tutorialRef.current) {
            tutorialRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    if (isCompleted) {
        return (
            <div className="p-4 border rounded-lg">
                <p>Tutorial completed! Please now go to the comprehension questions.</p>
            </div>
        )
    }

    return (
        <div ref={tutorialRef} className="p-4 border rounded-lg bg-background pt-15">
            {/* <p className="mb-10">Here is a tutorial for the experiment. It contains 5 rounds of each of the 3 tasks. The idea is to familiarize yourself with the interface and the types of questions.</p> */}
            {taskPermutations[currentTask] == 0 && (
                <Finance userId={userId} disclosure={disclosure} instancePermutation={instancePermutation}
                    aiPermutations={aiPermutations[currentTask]} accuracies={accuracies[currentTask]} currentInstance={currentInstance}
                    aiSystems={aiSystems} updatePath={updateInstance} onComplete={onCompleteTask} tutorial={true}></Finance>
            )}
            {taskPermutations[currentTask] == 1 && (
                <Reviews userId={userId} disclosure={disclosure} instancePermutation={instancePermutation}
                    aiPermutations={aiPermutations[currentTask]} accuracies={accuracies[currentTask]} currentInstance={currentInstance}
                    aiSystems={aiSystems} updatePath={updateInstance} onComplete={onCompleteTask} tutorial={true}></Reviews>
            )}
            {taskPermutations[currentTask] == 2 && (
                <Medical userId={userId} disclosure={disclosure} instancePermutation={instancePermutation}
                    aiPermutations={aiPermutations[currentTask]} accuracies={accuracies[currentTask]} currentInstance={currentInstance}
                    aiSystems={aiSystems} updatePath={updateInstance} onComplete={onCompleteTask} tutorial={true}></Medical>
            )}
        </div>
    );
}