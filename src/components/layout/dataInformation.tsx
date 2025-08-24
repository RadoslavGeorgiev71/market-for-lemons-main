import { Disclosure } from "@/types/disclosure";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";


export default function DataInformation({disclosure}: {disclosure: Disclosure}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Systems Information
                </Button>
            </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Systems Information
                </DialogTitle>
            </DialogHeader>
                {disclosure === Disclosure.none && (
                    <div>
                        <p>High-Quality AI System: Correct Predictions: 90%</p>

                        <p className="mt-5">Low-Quality AI System: Correct Predictions: 15%</p>
                    </div>
                )}
                {disclosure === Disclosure.partial && (
                    <div>
                        <p>High-Quality AI System: Correct Predictions: 90%</p>
                        <p className="ml-35">Accuracy: High ({">"}= 90%)</p>

                        <p className="mt-5">Low-Quality AI System: Correct Predictions: 15%</p>
                        <p className="ml-35"> Data Quality: Low</p>
                    </div>
                )}
                {disclosure === Disclosure.full && (
                    <div>
                        <p>High-Quality AI System: Correct Predictions: 90%</p>
                        <p className="ml-35">Accuracy: High ({">"}= 90%)</p>
                        <p className="ml-35">Data Quality: High</p>

                        <p className="mt-5">Low-Quality AI System: Correct Predictions: 15%</p>
                        <p className="ml-35">Accuracy: High (2/3); Low (1/3)</p>
                        <p className="ml-35"> Data Quality: Low</p>
                    </div>
                )}        
        </DialogContent>
    </Dialog>
    )
}