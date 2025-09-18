
"use client";

import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEncryption } from "@/hooks/use-encryption";
import { FileText, ShieldCheck } from "lucide-react";
import jsPDF from 'jspdf';

type JournalEntry = {
  mood: string;
  text: string;
  date: Date;
  isEncrypted?: boolean;
};

interface SettingsPanelProps {
  entries: JournalEntry[];
  getDecryptedText: (entry: JournalEntry) => string;
}

export default function SettingsPanel({ entries, getDecryptedText }: SettingsPanelProps) {
  const { isEncrypted, toggleEncryption } = useEncryption();
  const exportContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const content = exportContentRef.current;
    if (!content) return;

    // Dynamically import html2canvas
    const html2canvas = (await import('html2canvas')).default;

    // Temporarily make the content visible for capturing
    content.style.position = 'absolute';
    content.style.left = '-9999px';
    content.style.display = 'block';
    
    const canvas = await html2canvas(content, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      backgroundColor: null,
    });
    
    // Hide the content again
    content.style.position = '';
    content.style.left = '';
    content.style.display = '';

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('peacepod-journal.pdf');
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">Settings & Export</CardTitle>
        <CardDescription>Manage your data and privacy settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Export Journal to PDF
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Export Journal</DialogTitle>
              <DialogDescription>
                Your journal will be exported as a PDF document.
              </DialogDescription>
            </DialogHeader>
            <div ref={exportContentRef} className="my-4 h-64 overflow-y-auto rounded-md border p-4 bg-white text-black hidden">
              <h2 className="font-bold text-lg">My PeacePod Journal</h2>
              <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
              {entries.map((entry, index) => (
                <div key={index} className="mt-4 space-y-2">
                  <h3 className="font-semibold">Entry: {entry.date.toLocaleDateString()}</h3>
                  <p className="text-sm">Mood: {entry.mood}</p>
                  <p className="text-sm border-l-2 pl-2 border-primary">{getDecryptedText(entry)}</p>
                </div>
              ))}
              {entries.length === 0 && <p className="text-sm text-center py-8">No entries to export.</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button onClick={handleDownloadPdf} disabled={entries.length === 0}>Download PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
