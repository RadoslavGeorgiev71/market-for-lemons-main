export default function Page2() {
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <p>Each round follows the same general procedure:</p>
      <ol className="list-decimal pl-6 space-y-2">
        <li>You observe the prediction problem and the 10 AI systems.</li>
        <li>You decide whether you want to use an AI system, or make the prediction yourself. If you decide to use an AI system, you can freely pick between all 10.</li>
        <li>If you chose to rely on an AI system, you will receive feedback on whether the AI made the correct prediction.</li>
        <li>If you choose to rely on yourself, you will make the prediction. Afterwards, you will receive feedback on whether you made the correct prediction. You will not see the prediction of any AI system.</li>
        <li>The pool of AI systems refreshes itself and you proceed to the next round.</li>
      </ol>
    </div>
  );
}