export default function Page4({ taskPermutation }: { taskPermutation: number[] }) {
    const tasks = ["Loan prediction", "Identifying deceptive hotel reviews", "Cancer prediction"];
    
    return (
        <div className="p-4 border rounded-lg space-y-4">
            <p>These are the three tasks you will complete throughout this survey:</p>
            <ol className="list-decimal pl-6 space-y-2">
                {taskPermutation.map((task, index) => (
                    <li key={index}>{tasks[task]}</li>
                ))}
            </ol>
            <p>You will complete 10 prediction rounds for each. You will receive detailed instructions before each respective task.</p>
            <p>During each task, you have access to these 5 instruction pages (button "Instructions") and to a summary of the AI system's parameters(button "Systems Information"). You can additionally revoke your consent at any time via the button "Revoke Consent" and your data will be deleted.</p>
            <p>Please now go to Page 5.</p>
        </div>
    )
}