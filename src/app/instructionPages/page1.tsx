import { Disclosure } from "@/types/disclosure";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Page1({disclosure}: {disclosure: Disclosure}) {

  return (
    <div className="p-4 border rounded-lg">
        <p>You will complete 10 rounds of three prediction tasks.
            In total, you will complete 30 rounds. Each round, you will choose between either
            (1) making the prediction yourself or (2) choosing an AI system to make the prediction for you.
            You can choose from 10 different AI systems, as shown in the screenshot below.
        </p>
        <Image 
            src="/images/AI_pool.png" 
            alt="Photo" 
            width={512} 
            height={512} 
            className="rounded-sm m-5"
        />

        {disclosure === Disclosure.none && (
            <div className="space-y-4">
                <p>
                    The AI systems all look the same, but can differ in their average prediction performance. To make good predictions, an AI system must exhibit:
                </p>
                <p>1. High accuracy in test data and</p>
                <p>2. High training data quality.</p>
                <p>
                    If an AI system has both of these features, it has a probability of <strong>90%</strong> to make a correct prediction. 
                    If an AI system does not have both of these features, it has a probability of <strong>15%</strong> to make a correct prediction.
                </p>
                <p>
                    You cannot observe the features of any AI system. You only know that some AI systems have both features and therefore a probability of <strong>90%</strong> to make a correct prediction, 
                    and some AI systems do not have both features and therefore a probability of <strong>15%</strong> to make a correct prediction.
                </p>
                <p>
                    The actual share of AI systems that provide good prediction performance is <strong>constant across all 30 rounds, irrespective of the specific task.</strong>
                </p>
                <p>
                    Furthermore, after each round, the pool of 10 AI systems refreshes. This means that each round, you see a new set of AI systems. 
                    Therefore, if you choose an AI system in any round and observe its performance, you cannot choose that AI system again. 
                    You can, however, learn about the overall share of high-performing and low-performing AI systems after choosing an AI system.
                </p>
            </div>
        )}
        {disclosure === Disclosure.partial && (
            <div className="space-y-4">
                <p>
                    The AI systems can differ in their average prediction performance. To make good predictions, an AI system must exhibit:
                </p>
                <p>1. High accuracy in test data and</p>
                <p>2. High training data quality.</p>
                <p>
                    If an AI system has both of these features, it has a probability of <strong>90%</strong> to make a correct prediction. 
                    If an AI system does not have both of these features, it has a probability of <strong>15%</strong> to make a correct prediction.
                </p>
                <p>
                    You can observe the accuracy of each AI system in a given test data set by hovering over it. You cannot observe the training data quality of any AI system. 
                    Each AI system can have either high or low quality training data.
                </p>
                <p>
                    All high-performing AI systems have high accuracy and high quality training data.
                </p>
                <p>
                    <strong>2/3</strong> of low-performing AI systems have low accuracy and low quality training data, and <strong>1/3</strong> of low-performing AI systems have high accuracy but low quality training data. 
                    Note that, importantly, both kinds of low-performing AI systems have a probability of <strong>15%</strong> to make a correct prediction.
                </p>
                <p>
                    You do not know how many AI systems exhibit both features and therefore make the correct prediction with a probability of <strong>90%</strong>. 
                    However, you know that all three cases (High Accuracy High Quality Training Data, High Accuracy Low Quality Training Data, Low Accuracy Low Quality Training Data) exist. 
                    Furthermore, you can observe for all AI systems whether they showed low accuracy in test data.
                </p>
                <p>
                    The actual share of AI systems that provide good prediction performance is <strong>constant across all 30 rounds, irrespective of the specific task.</strong>
                </p>
                <p>
                    Furthermore, after each round, the pool of 10 AI systems refreshes. This means that each round, you see a new set of AI systems. 
                    Therefore, if you choose an AI system in any round and observe its performance, you cannot choose that AI system again. 
                    You can, however, learn about the overall share of high-performing and low-performing AI systems after choosing an AI system.
                </p>
            </div>
        )}
        {disclosure === Disclosure.full && (
            <div className="space-y-4">
                <p>The AI systems all look the same, but can differ in their average prediction performance.
                To make good predictions, an AI system must exhibit:</p>
                <p>(1) high accuracy in test data and</p>
                <p>(2) high training data quality.</p>
                <p>If an AI system has both of these features, it has a probability of <strong>90%</strong> to make a correct prediction. If an AI system does not have both of these features, it has a probability of <strong>15%</strong> to make a correct prediction.</p>
                <p>You are fully informed about both of these features for all AI systems. You can observe the system’s accuracy in test data and training data quality by hovering over it. Each AI system can have either high or low quality training data. Only AI systems with a high accuracy and high data quality have a probability of <strong>90%</strong> to make a correct prediction.</p>
                <p>The actual share of AI systems that provide good prediction performance is <strong>constant across all 30 rounds, irrespective of the specific task.</strong></p>
                <p>Furthermore, after each round, the pool of 10 AI systems refreshes. This means that each round, you see a new set of AI systems. Therefore, if you choose an AI system in any round and observe its performance, you cannot choose that AI system again. You can, however, learn about the overall share of high-performing and low-performing AI systems after choosing an AI system.</p>
            </div>
        )}
    </div>
  );
}
