import { Disclosure } from "@/types/disclosure";
import Image from "next/image";

export default function Page1({disclosure}: {disclosure: Disclosure}) {

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
        <p className="mb-2">Thank you for participating in this experiment!</p>
        <p className="mb-5">Please read through the following instructions carefully. After the instructions, you will complete a short tutorial, and answer some comprehension questions. 	You can only proceed with the experiment after answering the questions correctly within three trials. If you did not successfully answer all three comprehension questions after 	three trials, you will not be allowed to participate in the experiment.</p>
	<p>The survey will take approximately 25 minutes. You will be paid £2.5 for completing the experiment. Additionally, you can earn a bonus of up to £3 that depends on your choices, 	as explained in more detail on the next pages. Throughout the experiment, we will use Coins instead of Pounds. The Coins you earn will be converted into Pounds at the end of the 	experiment. The following conversion rate applies: 300 Coins = £1 </p>

	<p>In the survey, you will complete 10 rounds of three prediction tasks. In total, you will complete 30 rounds. Each round, you will choose between (1) making the prediction 	yourself or (2) choosing an AI system to make the prediction for you. You can choose from 10 different AI systems, as shown in the screenshot below. </p>

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
                <p>1. <strong>High accuracy on test data</strong> – this indicates the model performs well on unseen examples in a test run. An AI system exhibits high accuracy if their accuracy is &ge; 90%</p>
                <p>2. <strong>High-quality training data</strong> – the data used to train the model must be clean, relevant, and representative. Otherwise, the accuracy does not generalize to new problems, such as those you are about to face.</p>
                <p>An AI system that satisfies <strong>both</strong> of these conditions has a <strong>90% probability</strong> of making a correct prediction.
                     If <strong>either</strong> of these conditions is not met, the probability of a correct prediction drops to <strong>15%</strong>. Thus, only an AI system with an accuracy of at least 90%, and high-quality training data (as opposed to low-quality training data), has a 90% probability of making a correct prediction.</p>
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
                <p>Continue with Page 2.</p>
            </div>
        )}
        {disclosure === Disclosure.partial && (
            <div className="space-y-4">
                <p>Although the AI systems available in the pool may appear similar, their ability to make accurate predictions can vary significantly. To achieve reliable performance, an AI system must meet <strong>two key criteria</strong>:</p>
                <p>1. <strong>High accuracy on test data</strong> – this indicates the model performs well on unseen examples in a test run. An AI system exhibits high accuracy if their accuracy is &ge; 90%</p>
                <p>2. <strong>High-quality training data</strong> – the data used to train the model must be clean, relevant, and representative. Otherwise, the accuracy does not generalize to new problems, such as those you are about to face.</p>
                <p>An AI system that satisfies <strong>both</strong> of these conditions has a <strong>90% probability</strong> of making a correct prediction.
                     If <strong>either</strong> of these conditions is not met, the probability of a correct prediction drops to <strong>15%</strong>. Thus, only an AI system with an accuracy of at least 90%, and high-quality training data (as opposed to low-quality training data), has a 90% probability of making a correct prediction.</p>
                <p>
                    You can observe the accuracy of each AI system by hovering over it. You cannot observe the training data quality of any AI system. 
                    Each AI system can have either high or low quality training data.
                    <strong>Important:</strong> All high-performing AI systems have high accuracy and high quality training data.
                </p>
                <p>
                    <strong>Important: 2/3</strong> of the low-performing AI systems with a 15% probability to make the correct prediction have low accuracy and low quality training data, while <strong>1/3</strong> of low-performing AI systems also have low quality training data, but high accuracy. 
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
                <p>Continue with Page 2.</p>
            </div>
        )}
        {disclosure === Disclosure.full && (
            <div className="space-y-4">
                <p>Although the AI systems available in the pool may appear similar, their ability to make accurate predictions can vary significantly. To achieve reliable performance, an AI system must meet <strong>two key criteria</strong>:</p>
                <p>1. <strong>High accuracy on test data</strong> – this indicates the model performs well on unseen examples in a test run. An AI system exhibits high accuracy if their accuracy is &ge; 90%</p>
                <p>2. <strong>High-quality training data</strong> – the data used to train the model must be clean, relevant, and representative. Otherwise, the accuracy does not generalize to new problems, such as those you are about to face.</p>
                <p>An AI system that satisfies <strong>both</strong> of these conditions has a <strong>90% probability</strong> of making a correct prediction.
                     If <strong>either</strong> of these conditions is not met, the probability of a correct prediction drops to <strong>15%</strong>. Thus, only an AI system with an accuracy of at least 90%, and high-quality training data (as opposed to low-quality training data), has a 90% probability of making a correct prediction.</p>
                <p>You are fully informed about both of these features for all AI systems. You can observe the system’s accuracy and training data quality by hovering over it. Each AI system can have either high or low quality training data. Only AI systems with a high accuracy and high data quality have a probability of <strong>90%</strong> to make a correct prediction.</p>
                <p>
                    <strong>2/3</strong> of the low-performing AI systems with a 15% probability to make the correct prediction have low accuracy and low quality training data, while <strong>1/3</strong> of low-performing AI systems also have low quality training data, but high accuracy. 
                    Note that, importantly, both kinds of low-performing AI systems have a probability of <strong>15%</strong> to make a correct prediction.
                </p>
                <p>The actual share of AI systems that provide good prediction performance is <strong>constant across all 30 rounds, irrespective of the specific task.</strong></p>
                <p>Furthermore, after each round, the pool of 10 AI systems refreshes. This means that each round, you see a new set of AI systems. Therefore, if you choose an AI system in any round and observe its performance, you cannot choose that AI system again. However, by observing the performance of selected systems, you can gain insights into the <strong>overall distribution</strong> of high-performing vs. low-performing AI systems across rounds.</p>
                <p>Continue with Page 2.</p>
            </div>
        )}
    </div>
  );
}
