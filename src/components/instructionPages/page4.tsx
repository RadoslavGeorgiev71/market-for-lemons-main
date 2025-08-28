export default function Page4({ taskPermutation }: { taskPermutation: number[] }) {
    const tasks = ["Loan Prediction", "Identifying Deceptive Hotel Reviews", "Cancer Prediction"];

    return (
        <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
            <p>These are the three tasks you will complete throughout this survey:</p>
            <ol className="list-decimal pl-6 space-y-2">
                {taskPermutation.map((task, index) => (
                    <li key={index}>{tasks[task]}</li>
                ))}
            </ol>
            <p>You will complete 10 prediction rounds for each. You will receive specific instructions before the respective task.</p>
            <p>During each task, you will have access to:</p>
            <ul className="pl-6">
                <li>- <strong>Instructions</strong>: A set of 5 pages explaining the task and process (via the "Instructions" button).</li>
                <li>- <strong>Systems Information</strong>: A summary of the AI systems' parameters (via the "Systems Information" button).</li>
            </ul>
            <p>Continue with Page 5.</p>
        </div>
    )
}