import { Disclosure } from "@/types/disclosure";
import Image from "next/image";

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
                <p>Although the AI systems available in the pool may appear similar, their ability to make accurate predictions can vary significantly. To achieve reliable performance, an AI system must meet <strong>two key criteria</strong>:</p>
                <p>1. <strong>High accuracy on test data</strong> – This indicates the model performs well on unseen examples.</p>
                <p>2. <strong>High-quality training data</strong> – The data used to train the model must be clean, relevant, and representative.</p>
                <p>An AI system that satisfies <strong>both</strong> of these conditions has a <strong>90% probability</strong> of making a correct prediction.
                     If <strong>either</strong> of these conditions is not met, the probability of a correct prediction drops to <strong>15%</strong>.</p>
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
                    However, by observing the performance of selected systems, you can gain insights into the <strong>overall distribution</strong> of high-performing vs. low-performing AI systems across rounds.
                </p>
                <p>Please now go to Page 2.</p>
            </div>
        )}
        {disclosure === Disclosure.partial && (
            <div className="space-y-4">
                <p>Although the AI systems available in the pool may appear similar, their ability to make accurate predictions can vary significantly. To achieve reliable performance, an AI system must meet <strong>two key criteria</strong>:</p>
                <p>1. <strong>High accuracy on test data</strong> – This indicates the model performs well on unseen examples.</p>
                <p>2. <strong>High-quality training data</strong> – The data used to train the model must be clean, relevant, and representative.</p>
                <p>An AI system that satisfies <strong>both</strong> of these conditions has a <strong>90% probability</strong> of making a correct prediction.
                     If <strong>either</strong> of these conditions is not met, the probability of a correct prediction drops to <strong>15%</strong>.</p>
                <p>
                    You can observe the accuracy of each AI system by hovering over it. You cannot observe the training data quality of any AI system. 
                    Each AI system can have either high or low quality training data.
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
                    However, by observing the performance of selected systems, you can gain insights into the <strong>overall distribution</strong> of high-performing vs. low-performing AI systems across rounds.
                </p>
                <p>Please now go to Page 2.</p>
            </div>
        )}
        {disclosure === Disclosure.full && (
            <div className="space-y-4">
                <p>Although the AI systems available in the pool may appear similar, their ability to make accurate predictions can vary significantly. To achieve reliable performance, an AI system must meet <strong>two key criteria</strong>:</p>
                <p>1. <strong>High accuracy on test data</strong> – This indicates the model performs well on unseen examples.</p>
                <p>2. <strong>High-quality training data</strong> – The data used to train the model must be clean, relevant, and representative.</p>
                <p>An AI system that satisfies <strong>both</strong> of these conditions has a <strong>90% probability</strong> of making a correct prediction.
                     If <strong>either</strong> of these conditions is not met, the probability of a correct prediction drops to <strong>15%</strong>.</p>
                <p>You are fully informed about both of these features for all AI systems. You can observe the system’s accuracy and training data quality by hovering over it. Each AI system can have either high or low quality training data. Only AI systems with a high accuracy and high data quality have a probability of <strong>90%</strong> to make a correct prediction.</p>
                <p>
                    <strong>2/3</strong> of low-performing AI systems have low accuracy and low quality training data, and <strong>1/3</strong> of low-performing AI systems have high accuracy but low quality training data. 
                    Note that, importantly, both kinds of low-performing AI systems have a probability of <strong>15%</strong> to make a correct prediction.
                </p>
                <p>The actual share of AI systems that provide good prediction performance is <strong>constant across all 30 rounds, irrespective of the specific task.</strong></p>
                <p>Furthermore, after each round, the pool of 10 AI systems refreshes. This means that each round, you see a new set of AI systems. Therefore, if you choose an AI system in any round and observe its performance, you cannot choose that AI system again. However, by observing the performance of selected systems, you can gain insights into the <strong>overall distribution</strong> of high-performing vs. low-performing AI systems across rounds.</p>
                <p>Please proceed to Page 2.</p>
            </div>
        )}
    </div>
  );
}
