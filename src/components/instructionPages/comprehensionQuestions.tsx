import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { exitPath } from "@/data/constants";
import { api } from "@/trpc/react";
import { Disclosure } from "@/types/disclosure";
import { State } from "@/types/state";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ComprehensionQuestions({disclosure, userId, updateState, handleBeforeUnload}: {disclosure: Disclosure, userId: string, updateState: any, handleBeforeUnload: any}) {
    const [selectedAnswer1, setSelectedAnswer1] = useState<string | null>(null);
    const [selectedAnswer2, setSelectedAnswer2] = useState<string | null>(null);
    const [selectedAnswer3, setSelectedAnswer3] = useState<string | null>(null);
    const [selectedAnswer4, setSelectedAnswer4] = useState<string | null>(null);

    const [visibleResult, setVisibleResult] = useState(false);
    const [isCorrect1, setIsCorrect1] = useState(false);
    const [isCorrect2, setIsCorrect2] = useState(false);
    const [isCorrect3, setIsCorrect3] = useState(false);
    const [isCorrect4, setIsCorrect4] = useState(false);

    const [showDialog, setShowDialog] = useState(false);

    const router = useRouter();

    const deleteTasks = api.task.delete.useMutation();
    const deleteSurveyResults = api.surveyResult.delete.useMutation();
    const deleteHoveredSystems = api.hoveredAiSystem.delete.useMutation();

    const handleSubmit = () => {
        if (selectedAnswer1 === "2" &&
            selectedAnswer2 === "4" &&
            selectedAnswer3 === "2" &&
            selectedAnswer4 === "3"
        ) {
            // clean up data from tutorial
            deleteTasks.mutate({ userId: userId });
            deleteSurveyResults.mutate({ userId: userId });
            deleteHoveredSystems.mutate({ userId: userId });

            updateState.mutate({
                userId: userId!,
                state: State.preTask1,
            });
        } else {
            const trialsNum = sessionStorage.getItem("trialsNum");
            if (trialsNum) {
                const trials = JSON.parse(trialsNum);
                if (trials < 2) {
                    sessionStorage.setItem("trialsNum", JSON.stringify(trials + 1));
                    resetAnswers();
                } else {
                    window.removeEventListener("beforeunload", handleBeforeUnload);
                    router.replace(exitPath);
                }
            } else {
                sessionStorage.setItem("trialsNum", JSON.stringify(1));
                resetAnswers();
            }
        }
    };

    const resetAnswers = () => {
        setShowDialog(true);
        selectedAnswer1 === "2" ? setIsCorrect1(true) : setIsCorrect1(false);
        selectedAnswer2 === "4" ? setIsCorrect2(true) : setIsCorrect2(false);
        selectedAnswer3 === "2" ? setIsCorrect3(true) : setIsCorrect3(false);
        selectedAnswer4 === "3" ? setIsCorrect4(true) : setIsCorrect4(false);
        setVisibleResult(true);
    };

    return (
        <div className="p-4 border rounded-lg space-y-4">
            {disclosure == Disclosure.none && (
                <div>
                    <p>Choose the correct option: {visibleResult && (isCorrect1 ? "✅": "❌")}</p>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="1"
                                checked={selectedAnswer1 === "1"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>All AI systems have the same performance</p>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="2"
                                checked={selectedAnswer1 === "2"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>Some AI systems are 90% likely to make a correct prediction, others are 15% likely to make a correct prediction</p>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="3"
                                checked={selectedAnswer1 === "3"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>Some AI systems are 100% likely to make a correct prediction, others are 50% likely to make a correct prediction</p>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="4"
                                checked={selectedAnswer1 === "4"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>Before choosing an AI system, you observe whether they are of high-quality or of low-quality</p>
                        </label>
                </div>
            )}
            {disclosure == Disclosure.partial && (
                <div>
                    <p>Choose the correct option: {visibleResult && (isCorrect1 ? "✅": "❌")}</p>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="1"
                                checked={selectedAnswer1 === "1"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>All low-quality AI systems have low accuracy</p>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="2"
                                checked={selectedAnswer1 === "2"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>All low-quality AI systems have low training data quality</p>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="3"
                                checked={selectedAnswer1 === "3"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>Some high-quality AI systems have low accuracy</p>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="4"
                                checked={selectedAnswer1 === "4"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>All high-quality AI systems have low training data quality</p>
                        </label>
                </div>
            )}
            {disclosure == Disclosure.full && (
                <div>
                    <p>Choose the correct option: {visibleResult && (isCorrect1 ? "✅": "❌")}</p>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="1"
                                checked={selectedAnswer1 === "1"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>All AI systems have the same performance</p>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="2"
                                checked={selectedAnswer1 === "2"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>Some AI systems are 90% likely to make a correct prediction, others are 15% likely to make a correct prediction</p>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="3"
                                checked={selectedAnswer1 === "3"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>Some AI systems are 100% likely to make a correct prediction, others are 50% likely to make a correct prediction</p>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="1"
                                value="4"
                                checked={selectedAnswer1 === "4"}
                                onChange={(e) => setSelectedAnswer1(e.target.value)}
                                className="cursor-pointer"
                            />
                            <p>Before choosing an AI system, you do not observe whether they are of high-quality or of low-quality</p>
                        </label>
                </div>
            )}

            <div>
                <p>Choose the correct option: {visibleResult && (isCorrect2 ? "✅": "❌")}</p>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="2"
                        value="1"
                        checked={selectedAnswer2 === "1"}
                        onChange={(e) => setSelectedAnswer2(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p>The share of low-quality AI systems changes across tasks</p>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="2"
                        value="2"
                        checked={selectedAnswer2 === "2"}
                        onChange={(e) => setSelectedAnswer2(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p>The share of low-quality AI systems changes across rounds</p>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="2"
                        value="3"
                        checked={selectedAnswer2 === "3"}
                        onChange={(e) => setSelectedAnswer2(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p>The share of low-quality AI systems is drawn randomly at the beginning of each round</p>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="2"
                        value="4"
                        checked={selectedAnswer2 === "4"}
                        onChange={(e) => setSelectedAnswer2(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p>The share of low-quality AI systems is the same in every round</p>
                </label>
            </div>

            <div>
                <p>Choose the correct option: {visibleResult && (isCorrect3 ? "✅": "❌")}</p>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="3"
                        value="1"
                        checked={selectedAnswer3 === "1"}
                        onChange={(e) => setSelectedAnswer3(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p>Each round, you see a new set of 10 AI systems</p>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="3"
                        value="2"
                        checked={selectedAnswer3 === "2"}
                        onChange={(e) => setSelectedAnswer3(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p>The pool of 10 AI systems only changes between tasks</p>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="3"
                        value="3"
                        checked={selectedAnswer3 === "3"}
                        onChange={(e) => setSelectedAnswer3(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p>The pool of 10 AI systems never changes</p>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="3"
                        value="4"
                        checked={selectedAnswer3 === "4"}
                        onChange={(e) => setSelectedAnswer3(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p>The pool of 10 AI systems changes every five rounds</p>
                </label>
            </div>

            <div>
                <p>Choose the correct option: {visibleResult && (isCorrect4 ? "✅": "❌")}</p>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="4"
                        value="1"
                        checked={selectedAnswer4 === "1"}
                        onChange={(e) => setSelectedAnswer4(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p> You only earn a bonus when you make the predictions yourself</p>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="4"
                        value="2"
                        checked={selectedAnswer4 === "2"}
                        onChange={(e) => setSelectedAnswer4(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p>You only earn a bonus when you use an AI system</p>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="4"
                        value="3"
                        checked={selectedAnswer4 === "3"}
                        onChange={(e) => setSelectedAnswer4(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p>You earn a bonus for each correct prediction</p>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="4"
                        value="4"
                        checked={selectedAnswer4 === "4"}
                        onChange={(e) => setSelectedAnswer4(e.target.value)}
                        className="cursor-pointer"
                    />
                    <p>Your bonus is determined by one randomly drawn prediction round</p>
                </label>
            </div>

            <Button
                disabled={selectedAnswer1 === null || selectedAnswer2 === null || selectedAnswer3 === null || selectedAnswer4 === null}
                onClick={handleSubmit}
            >Submit</Button>

            {showDialog && (
                <Dialog
                    open={showDialog}
                    onOpenChange={(open) => {
                        setShowDialog(open);
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle></DialogTitle>
                        </DialogHeader>
                        <h3 className="m-2 text-center">
                            Wrong answers! Please try again.
                            You have {3 - JSON.parse(sessionStorage.getItem("trialsNum")!)} more tries!
                        </h3>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
