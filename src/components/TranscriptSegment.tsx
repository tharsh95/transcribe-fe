
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MCQSection from "./MCQSection";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { TranscriptSegmentProps } from "@/services/interfaces";





const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TranscriptSegment: React.FC<TranscriptSegmentProps> = ({ segment }) => {
  const [showQuestions, setShowQuestions] = useState(false);

  const exportSegmentData = () => {
    const exportData ={

      id: segment._id.$oid,
      timeRange: `${formatTime(segment.startTime)} - ${formatTime(segment.endTime)}`,
      transcript: segment.transcription,
      questions: segment.mcqs.map((q) => ({
        question: q.question,
        options: q.options,
        correctOption: q.answer,
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `segments-${segment._id.$oid}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Segment exported successfully!");
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
       
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowQuestions(!showQuestions)}
          >
            {showQuestions ? "Hide Questions" : "Show Questions"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
          <div key={segment._id.toString()} className="mb-6">
            <div className="text-sm font-semibold text-muted-foreground mb-1">
              Chunk {segment.chunkNumber} — {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
            </div>
            <div className="text-sm leading-relaxed mb-2">{segment.transcription}</div>
            {showQuestions && segment.mcqs.length > 0 && (
              <MCQSection questions={segment.mcqs} segmentId={segment._id.$oid} />
            )}
          </div>

      </CardContent>
      <CardFooter className="pt-0 flex justify-end">
        <Button variant="outline" size="sm" onClick={exportSegmentData}>
          <FileText className="mr-2 h-4 w-4" />
          Export Segment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranscriptSegment;
