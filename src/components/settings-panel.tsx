
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEncryption } from "@/hooks/use-encryption";
import { FileText, ShieldCheck } from "lucide-react";

export default function SettingsPanel() {
  const { isEncrypted, toggleEncryption } = useEncryption();

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">Privacy & Export</CardTitle>
        <CardDescription>Manage your data and privacy settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="encryption-switch" className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Local Encryption
              </Label>
              <p className="text-sm text-muted-foreground">
                Secure your entries on this device.
              </p>
            </div>
            <Switch
              id="encryption-switch"
              checked={isEncrypted}
              onCheckedChange={toggleEncryption}
              aria-label="Toggle local encryption"
            />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Export Journal to PDF
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Export Preview</DialogTitle>
              <DialogDescription>
                This is a preview of your journal export. Actual export functionality is not implemented.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 h-64 overflow-y-auto rounded-md border p-4 bg-secondary/30">
              <h2 className="font-bold text-lg">My Wellness Journal</h2>
              <p className="text-sm text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold">Entry: {new Date(Date.now() - 86400000).toLocaleDateString()}</h3>
                <p className="text-sm">Mood: Happy</p>
                <p className="text-sm border-l-2 pl-2 border-primary">Today was a great day. I felt productive and happy. I managed to finish all my tasks and even had time to relax and read a book.</p>
              </div>
               <div className="mt-4 space-y-2">
                <h3 className="font-semibold">Entry: {new Date(Date.now() - 2*86400000).toLocaleDateString()}</h3>
                <p className="text-sm">Mood: Sad</p>
                <p className="text-sm border-l-2 pl-2 border-primary">Felt a bit down today. Things didn't go as planned at work, but I'm trying to stay positive.</p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit">Download PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
