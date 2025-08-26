import { useState } from "react";
import { Button } from "./ui/button";
import { State } from "@/types/state";
import { api } from "@/trpc/react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useRouter } from "next/navigation";
import { failed_attention_check } from "@/data/constants";


export default function PreTaskQuestions({userId, updateState, handleBeforeUnload}: {userId: string; updateState: any; handleBeforeUnload: (event: BeforeUnloadEvent) => void}) {
    const [loanApproval, setLoanApproval] = useState<number | null>(null);
    const [deceptionDetection, setDeceptionDetection] = useState<number | null>(null);
    const [skinCancerDetection, setSkinCancerDetection] = useState<number | null>(null);
    const taskValues = ["No experience", "Little experience", "Moderate experience", "Very experienced", "Highly experienced"];

    const [risk, setRisk] = useState<number | null>(null);
    const [trust1, setTrust1] = useState<number | null>(null);
    const [trust2, setTrust2] = useState<number | null>(null);
    const trustValues = ["Strongly disagree", "Rather disagree", "Neither agree nor disagree", "Rather agree", "Strongly agree", "No response"];

    const [technology1, setTechnology1] = useState<number | null>(null);
    const [technology2, setTechnology2] = useState<number | null>(null);
    const [technology3, setTechnology3] = useState<number | null>(null);

    const [attention1, setAttention1] = useState<number | null>(null);

    const [technology4, setTechnology4] = useState<number | null>(null);
    const technologyValues = ["Completely disagree", "Largely disagree", "Slightly disagree", "Slightly agree", "Largely agree", "Completely agree"];

    const [aiLiteracy1, setAiLiteracy1] = useState<number | null>(null);

    const [attention2, setAttention2] = useState<number | null>(null);

    const [aiLiteracy2, setAiLiteracy2] = useState<number | null>(null);
    const [aiLiteracy3, setAiLiteracy3] = useState<number | null>(null);
    const [aiLiteracy4, setAiLiteracy4] = useState<number | null>(null);
    const aiLiteracyValues = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

    const [page, setPage] = useState(1);

    const [failed, setFailed] = useState<boolean>(false);

    const createPreTaskAnswers = api.preTaskAnswers.create.useMutation();

    const onSubmit = () => {
        createPreTaskAnswers.mutate({
            userId: userId!,
            loanApproval: loanApproval!,
            deceptionDetection: deceptionDetection!,
            skinCancerDetection: skinCancerDetection!,
            risk: risk!,
            trust1: trust1!,
            trust2: trust2!,
            technology1: technology1!,
            technology2: technology2!,
            technology3: technology3!,
            technology4: technology4!,
            aiLiteracy1: aiLiteracy1!,
            aiLiteracy2: aiLiteracy2!,
            aiLiteracy3: aiLiteracy3!,
            aiLiteracy4: aiLiteracy4!,
            attention1: attention1! === 2,
            attention2: attention2! === 5,
        });

        if (attention1! !== 2 && attention2! !== 5) {
            updateState.mutate({
                userId: userId!,
                state: State.failed_attention_check
            });
            setFailed(true);
        } else {
            updateState.mutate({
                userId: userId!,
                state: State.instructions,
            })
        }
    };

    const router = useRouter();

    return (
        <div>
            <div className="flex w-full h-fit mt-[-50] items-center justify-center gap-x-2 mb-5">
                <h1 className="text-2xl font-semibold">Please answer the following questions</h1>
            </div>
            {page === 1 && (
                <div className="center items-center p-10 bg-gray-50 rounded-md space-y-5 flex flex-col">
                    <p>Do you have any experience with loan application approval?</p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 5 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="loan" value={n} onChange={() => setLoanApproval(n + 1)}/>
                             &nbsp;{taskValues[n]}
                        </label>
                        ))}
                    </div>


                    <p className="mt-10">Do you have any experience with deception detection of hotel reviews? </p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 5 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="reviews" value={n} onChange={() => setDeceptionDetection(n + 1)}/>
                             &nbsp;{taskValues[n]}
                        </label>
                        ))}
                    </div>


                    <p className="mt-10">Do you have any experience with skin cancer detection?  </p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 5 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="cancer" value={n} onChange={() => setSkinCancerDetection(n + 1)}/>
                             &nbsp;{taskValues[n]}
                        </label>
                        ))}
                    </div>

                    <Button className="mt-5" onClick={() => setPage(2)} disabled={loanApproval === null || deceptionDetection === null || skinCancerDetection === null}>
                        Next
                    </Button>
                </div>
            )}
            {page === 2 && (
                <div className="center items-center p-10 bg-gray-50 rounded-md space-y-5 flex flex-col">
                    <p>In general, how willing are you to take risks?</p>
                    <p className="mt-[-20]">Please answer on the following scale from 1 to 10 where 1 means "not at all willing to take risks" and 10 means "very willing to take risks</p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <label key={n}>
                            <input type="radio" name="risk" value={n} onChange={() => setRisk(n)}/>
                             &nbsp;{n}
                        </label>
                        ))}
                    </div>

                    <p className="mt-7">I trust the system.</p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 6 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="trust1" value={n} onChange={() => setTrust1(n + 1)}/>
                             &nbsp;{trustValues[n]}
                        </label>
                        ))}
                    </div>
                    <p className="mt-10">I can rely on the system.</p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 6 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="trust2" value={n} onChange={() => setTrust2(n + 1)}/>
                             &nbsp;{trustValues[n]}
                        </label>
                        ))}
                    </div>

                    <Button className="mt-5" onClick={() => setPage(3)} disabled={risk === null || trust1 === null || trust2 === null}>
                        Next
                    </Button>
                </div>
            )}
            {page === 3 && (
                <div className="center items-center p-10 bg-gray-50 rounded-md space-y-5 flex flex-col">
                    <p>I like to occupy myself in greater detail with technical systems</p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 6 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="technology1" value={n} onChange={() => setTechnology1(n + 1)}/>
                             &nbsp;{technologyValues[n]}
                        </label>
                        ))}
                    </div>


                    <p className="mt-10">I like testing the functions of new technical systems. </p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 6 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="technology2" value={n} onChange={() => setTechnology2(n + 1)}/>
                             &nbsp;{technologyValues[n]}
                        </label>
                        ))}
                    </div>


                    <p className="mt-10">It is enough for me that a technical system works; I don’t care how or why (reverse-coded). </p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 6 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="technology3" value={n} onChange={() => setTechnology3(n + 1)}/>
                             &nbsp;{technologyValues[n]}
                        </label>
                        ))}
                    </div>

                    <p className="mt-10">For this question please select option "Largely disagree". </p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 6 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="attention1" value={n} onChange={() => setAttention1(n + 1)}/>
                             &nbsp;{technologyValues[n]}
                        </label>
                        ))}
                    </div>


                    <p className="mt-10">It is enough for me to know the basic functions of a technical system. (reverse-coded). </p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 6 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="technology4" value={n} onChange={() => setTechnology4(n + 1)}/>
                             &nbsp;{technologyValues[n]}
                        </label>
                        ))}
                    </div>

                    <Button className="mt-5" onClick={() => setPage(4)} disabled={technology1 === null || technology2 === null || technology3 === null || attention1 === null || technology4 === null}>
                        Next
                    </Button>
                </div>
            )}
            {page === 4 && (
                <div className="center items-center p-10 bg-gray-50 rounded-md space-y-5 flex flex-col">
                    <p>I consider myself knowledgeable in the field of artificial intelligence.</p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 5 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="aiLiteracy1" value={n} onChange={() => setAiLiteracy1(n + 1)}/>
                             &nbsp;{aiLiteracyValues[n]}
                        </label>
                        ))}
                    </div>

                    <p className="mt-10">For this question please answer "Strongly agree".</p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 5 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="attention2" value={n} onChange={() => setAttention2(n + 1)}/>
                             &nbsp;{aiLiteracyValues[n]}
                        </label>
                        ))}
                    </div>

                    <p className="mt-10">My current employment includes working with artificial intelligence. </p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 5 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="aiLiteracy2" value={n} onChange={() => setAiLiteracy2(n + 1)}/>
                             &nbsp;{aiLiteracyValues[n]}
                        </label>
                        ))}
                    </div>


                    <p className="mt-10">I am confident interacting with artificial intelligence. </p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 5 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="aiLiteracy3" value={n} onChange={() => setAiLiteracy3(n + 1)}/>
                             &nbsp;{aiLiteracyValues[n]}
                        </label>
                        ))}
                    </div>


                    <p className="mt-10">I understand what the term artificial intelligence means. </p>
                    <div className="flex flex-row justify-center space-x-5">
                        {Array.from({ length: 5 }, (_, i) => i).map((n) => (
                        <label key={n}>
                            <input type="radio" name="aiLiteracy4" value={n} onChange={() => setAiLiteracy4(n + 1)}/>
                             &nbsp;{aiLiteracyValues[n]}
                        </label>
                        ))}
                    </div>

                    <Button className="mt-5" onClick={() => onSubmit()} disabled={aiLiteracy1 === null || attention2 === null || aiLiteracy2 === null || aiLiteracy3 === null || aiLiteracy4 === null}>
                        Start first task
                    </Button>
                </div>
            )}

            {failed && (
                <Dialog
                    open={failed}
                    onOpenChange={(open) => {
                        setFailed(open);
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle></DialogTitle>
                        </DialogHeader>
                        <h3 className="m-2 text-center">
                            You have failed both attention checks and therefore cannot proceed with the experiment. Thank you for your interest!
                        </h3>
                        <div className="flex justify-center">
                            <Button onClick={async () => {
                                if (!userId) return;
                                //TODO: To redirect back
                                setFailed(false);
                                window.removeEventListener("beforeunload", handleBeforeUnload);
                                router.replace(failed_attention_check)
                            }}>
                                Close Survey
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}