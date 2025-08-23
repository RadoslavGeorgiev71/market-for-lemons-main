import Image from "next/image";
import { Button } from "../ui/button";
import { State } from "@/types/state";


export default function ReviewInstructions({userId, updateState}: {userId: string; updateState: any}) {
  return (
    <div className="flex flex-col bg-background w-full items-center justify-center gap-6 p-24">
      <div className="flex w-full h-fit mt-[-100] items-center justify-center gap-x-2">
        <h1 className="text-2xl font-semibold">Identifying deceptive hotel reviews</h1>
      </div>
      <div className="center items-center p-4 bg-gray-50 rounded-md">
        <p>In this task you will be presented with a series of 10 hotel reviews. Each review has a positive note but some of them are not truthful.
            Your goal is to examine each hotel review and determine whether it is genuine or deceptive.
            Two examples of such reviews are presented below. The first one is genuine while the second one is deceptive.
            Feel free to make any decision yourself or delegate it to an AI system.</p>

            <div className="flex flex-row items-center justify-center gap-4 m-5">
              <Image 
                  src="/images/Reviews_Genuine.png" 
                  alt="Photo" 
                  width={400} 
                  height={400} 
                  className="rounded-sm m-5"
              />

              <Image 
                  src="/images/Reviews_Deceptive.png" 
                  alt="Photo" 
                  width={400} 
                  height={400} 
                  className="rounded-sm m-5"
              />
            </div>

            <div className="flex items-center justify-center">
              <Button onClick={() => {
                updateState.mutate({
                    userId: userId!,
                    state: State.reviews,
                });
              }}>Start hotel reviews task</Button>
            </div>
      </div>
    </div>
  );
}