import Image from "next/image";
import { Button } from "../ui/button";
import { State } from "@/types/state";


export default function MedicalInstructions({userId, updateState}: {userId: string; updateState: any}) {
  return (
    <div className="flex flex-col bg-background w-full items-center justify-center gap-6 p-24">
      <div className="flex w-full h-fit mt-[-100] items-center justify-center gap-x-2">
        <h1 className="text-2xl font-semibold">Cancer prediction task</h1>
      </div>
      <div className="center items-center p-4 bg-gray-50 rounded-md">
        <p>In this task you will be presented with a series of 10 skin images. Each image shows tissue that may appear normal, but some of them indicate cancer.
            Your goal is to examine each image and determine whether it is benign (non-malignant) or cancerous.
            Two examples of such images are presented below. The first one is benign while the second one indicates cancer.
            Feel free to make any decision yourself or delegate it to an AI system.</p>

            <div className="flex flex-row items-center justify-center gap-4 m-5">
              <Image 
                  src="/images/cancer_tutorial_images/ISIC_0034305.jpg" 
                  alt="Photo" 
                  width={400} 
                  height={400} 
                  className="rounded-sm m-5"
              />

              <Image 
                  src="/images/cancer_tutorial_images/ISIC_0032684.jpg" 
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
                    state: State.medical,
                });
              }}>Start cancer prediction task</Button>
            </div>
      </div>
    </div>
  );
}