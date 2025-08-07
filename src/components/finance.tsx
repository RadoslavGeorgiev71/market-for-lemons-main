import { Button } from "./ui/button";
import DomainTask from "./DomainTask";
import { DataQuality } from "@/types/quality"
import { api } from "@/trpc/react";
import { State } from "@/types/state";
import { Disclosure } from "@/types/disclosure";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Loading from "../app/loading";

const financeTasks = [
  {
    id: 1,
    question: "What is the expected return on investment for a stock with a beta of 1.2, risk-free rate of 3%, and market return of 8%?",
    correctAnswer: "9%"
  },
  {
    id: 2,
    question: "Calculate the present value of $10,000 to be received in 5 years with a discount rate of 5%.",
    correctAnswer: "$7,835.26"
  },
  {
    id: 3,
    question: "What is the debt-to-equity ratio if a company has total debt of $500,000 and total equity of $1,000,000?",
    correctAnswer: "0.5"
  },
  {
    id: 4,
    question: "Calculate the compound annual growth rate (CAGR) for an investment that grew from $1,000 to $1,500 over 3 years.",
    correctAnswer: "14.47%"
  },
  {
    id: 5,
    question: "What is the weighted average cost of capital (WACC) if the cost of equity is 12%, cost of debt is 6%, tax rate is 30%, and the debt-to-equity ratio is 0.5?",
    correctAnswer: "9.6%"
  },
  {
    id: 6,
    question: "Calculate the net present value (NPV) of a project with an initial investment of $100,000 and expected cash flows of $30,000 per year for 5 years, with a discount rate of 8%.",
    correctAnswer: "$19,790.79"
  },
  {
    id: 7,
    question: "What is the price-to-earnings (P/E) ratio if a stock is trading at $50 per share with earnings per share of $2.50?",
    correctAnswer: "20"
  },
  {
    id: 8,
    question: "Calculate the internal rate of return (IRR) for a project with an initial investment of $50,000 and expected cash flows of $15,000 per year for 5 years.",
    correctAnswer: "15.24%"
  },
  {
    id: 9,
    question: "What is the current ratio if a company has current assets of $200,000 and current liabilities of $100,000?",
    correctAnswer: "2"
  },
  {
    id: 10,
    question: "Calculate the future value of $5,000 invested at 7% interest for 10 years.",
    correctAnswer: "$9,835.76"
  }
];

const aiSystems = [
  { id: 1, name: "FinanceGPT-1", accuracy: 85, dataQuality: DataQuality.High },
  { id: 2, name: "FinanceGPT-2", accuracy: 78, dataQuality: DataQuality.High },
  { id: 3, name: "FinanceGPT-3", accuracy: 92, dataQuality: DataQuality.High },
  { id: 4, name: "FinanceGPT-4", accuracy: 88, dataQuality: DataQuality.High },
  { id: 5, name: "FinanceGPT-5", accuracy: 75, dataQuality: DataQuality.High },
  { id: 6, name: "FinanceGPT-6", accuracy: 90, dataQuality: DataQuality.Medium },
  { id: 7, name: "FinanceGPT-7", accuracy: 82, dataQuality: DataQuality.Medium },
  { id: 8, name: "FinanceGPT-8", accuracy: 95, dataQuality: DataQuality.Low },
  { id: 9, name: "FinanceGPT-9", accuracy: 80, dataQuality: DataQuality.Low },
  { id: 10, name: "FinanceGPT-10", accuracy: 87, dataQuality: DataQuality.Low }
];

interface FinanceProps{
  user_id: string; // Will be used for user-specific functionality
  disclosure: Disclosure;
}

export default function Finance({ user_id, disclosure }: FinanceProps) {
  const [clickedButton, setClickedButton] = useState<Disclosure | null>(null);
  const utils = api.useUtils();

  // Get completed tasks for this user
  const { data: completedTasks } = api.task.getTasksByUserId.useQuery({ user_id });

  const updateState = api.user.updateState.useMutation({
    onSuccess: () => {
      utils.user.getUserById.invalidate({ user_id });
    },
  });

  const updateDisclosure = api.user.updateDisclosure.useMutation({
    onSuccess: () => {
      utils.user.getUserById.invalidate({ user_id });
      setClickedButton(null);
    },
    onError: () => {
      setClickedButton(null);
    },
  });

  const handleDisclosureClick = (disclosureType: Disclosure) => {
    setClickedButton(disclosureType);
    updateDisclosure.mutate({ user_id, disclosure: disclosureType });
  };

  const handleTaskCompletion = () => {
    // Invalidate tasks query to refresh completed tasks
    utils.task.getTasksByUserId.invalidate({ user_id });
    updateState.mutate({
      user_id,
      state: State.cybersecurity,
    });
  };

  // if data for getTasksByUserId is still loading, show a loading state
  if (updateDisclosure.isPending || !completedTasks) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="absolute top-4 flex  items-center gap-4">
        <Button
          variant={disclosure === Disclosure.full ? "default" : "outline"}
          onClick={() => handleDisclosureClick(Disclosure.full)}
          disabled={updateDisclosure.isPending}
        >
          {updateDisclosure.isPending && clickedButton === Disclosure.full && <Loader2 className="animate-spin" />}
          Full Disclosure
        </Button>
        <Button
          variant={disclosure === Disclosure.partial ? "default" : "outline"}
          onClick={() => handleDisclosureClick(Disclosure.partial)}
          disabled={updateDisclosure.isPending}
        >
          {updateDisclosure.isPending && clickedButton === Disclosure.partial && <Loader2 className="animate-spin" />}
          Partial Disclosure
        </Button>
        <Button
          variant={disclosure === Disclosure.none ? "default" : "outline"}
          onClick={() => handleDisclosureClick(Disclosure.none)}
          disabled={updateDisclosure.isPending}
        >
          {updateDisclosure.isPending && clickedButton === Disclosure.none && <Loader2 className="animate-spin" />}
          No Disclosure
        </Button>
      </div>
      
      <DomainTask
        domain="Finance"
        tasks={financeTasks}
        aiSystems={aiSystems}
        disclosure={disclosure}
        user_id={user_id}
        completedTasks={completedTasks || []}
        onComplete={handleTaskCompletion}
      />
    </div>
  );
}