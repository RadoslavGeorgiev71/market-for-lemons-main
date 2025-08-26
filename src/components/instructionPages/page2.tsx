export default function Page2() {
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <p>Each round follows the same general procedure:</p>
      <ol className="list-decimal pl-6 space-y-2">
        <li>Observe the prediction problem and review the 10 available AI systems</li>
        <li>Make a decision: 
          <ul>
            <li>- Use an AI system by clicking on one of the AI systems available in the pool.</li>
            <li>- Make the prediction yourself by selecting one of the two possible answers.</li>
          </ul>
        </li>
        <li>Receive feedback: 
          <ul>
            <li>- If you chose an AI system, you’ll see whether it made the correct prediction.</li>
            <li>- If you chose to predict yourself, you’ll find out whether your answer was correct — but you won’t see any AI system’s prediction.</li>
          </ul>
        </li>
        <li>The pool of AI systems refreshes, and a new set of 10 systems is presented for the next round.</li>
      </ol>
      <p>Please proceed Page 3.</p>
    </div>
  );
}