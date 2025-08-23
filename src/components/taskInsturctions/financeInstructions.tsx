import Image from "next/image";
import { Button } from "../ui/button";
import { State } from "@/types/state";


export default function FinanceInstructions({userId, updateState}: {userId: string; updateState: any}) {
    return (
       <div className="flex flex-col bg-background w-full items-center justify-center gap-6 p-24">
        <div className="flex w-full h-fit mt-[-100] items-center justify-center gap-x-2">
          <h1 className="text-2xl font-semibold">Loan prediction task</h1>
        </div>
        <div className="center items-center p-4 bg-gray-50 rounded-md">
            <p>In this task you will be presented with a series of 10 loan applications.
                Your goal is to evaluate each application and determine whether it should be accepted or rejected.
                You can observe the applicant&apos;s details in the two examples below.
                The first applicant should be accepted for the loan while the second one should be rejected.
                Feel free to make any decision yourself or delegate it to an AI system.</p>

            <div className="flex flex-row items-center justify-center gap-4 m-5">
              <Image 
                  src="/images/Finance_Accept.png" 
                  alt="Photo" 
                  width={350} 
                  height={350} 
                  className="rounded-sm m-5"
              />

              <Image 
                  src="/images/Finance_Reject.png" 
                  alt="Photo" 
                  width={350} 
                  height={350} 
                  className="rounded-sm m-5"
              />
            </div>

            <div className="flex items-center justify-center">
              <Button onClick={() => {
                updateState.mutate({
                    userId: userId!,
                    state: State.finance,
                });
              }}>Start loan prediction task</Button>
            </div>
        </div>
      </div>
    )
}