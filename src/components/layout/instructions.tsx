import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Page1 from "../instructionPages/page1";
import Page2 from "../instructionPages/page2";
import Page3 from "../instructionPages/page3";
import Page4 from "../instructionPages/page4";
import Page5 from "../instructionPages/page5";
import { Disclosure } from "@/types/disclosure";


export default function Instructions({disclosure, taskPermutation}: {disclosure: Disclosure; taskPermutation: number[]}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Instructions
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Instructions
          </DialogTitle>
        </DialogHeader>
            <Tabs defaultValue="page1" className="flex overflow-y-scroll max-h-100">
              <TabsList className="flex mt-5 space-x-2">
                <TabsTrigger className="w-20" value="page1">Page 1</TabsTrigger>
                <TabsTrigger className="w-20" value="page2">Page 2</TabsTrigger>
                <TabsTrigger className="w-20" value="page3">Page 3</TabsTrigger>
                <TabsTrigger className="w-20" value="page4">Page 4</TabsTrigger>
                <TabsTrigger className="w-20" value="page5">Page 5</TabsTrigger>
              </TabsList>

              <TabsContent value="page1">
                <Page1 disclosure={disclosure}></Page1>
              </TabsContent>

              <TabsContent value="page2">
                <Page2></Page2>
              </TabsContent>

              <TabsContent value="page3">
                <Page3></Page3>
              </TabsContent>

              <TabsContent value="page4">
                <Page4 taskPermutation={taskPermutation}></Page4>
              </TabsContent>

              <TabsContent value="page5">
                <Page5></Page5>
              </TabsContent>
            </Tabs>    
      </DialogContent>
    </Dialog>
  );
}