import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import VideoUpload from "@/components/VideoUpload";
import ProcessingStatus from "@/components/ProcessingStatus";
import TranscriptSegment from "@/components/TranscriptSegment";
import { toast } from "sonner";
import { LayoutDashboard } from "lucide-react";
import { ProcessingStep, TranscriptSegmentData } from "@/services/interfaces";

const Index = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] =
    useState<ProcessingStep>("upload");
  const [progress, setProgress] = useState(0);
  const [segments, setSegments] = useState<TranscriptSegmentData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("upload");

  const handleNavigateToDashboard = () => {
    navigate("/dashboard");
  };


  const videoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/video-processing/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Video processing failed');
      }

      return response.json();
    },
    onMutate: () => {
      setIsProcessing(true);
      setProcessingStep("upload");
      setProgress(10);
      setActiveTab("processing");
     new Promise((res) => setTimeout(res, 1500)); // simulate UI update lag
      setProcessingStep("transcription");
      setProgress(30);
    },
    onSuccess: (result) => {
      
      setProcessingStep("segmentation");
      setProgress(60);
      
      setProcessingStep("generation");
      setProgress(90);
      setSegments(result);
      setProcessingStep("complete");
      setProgress(100);
      toast.success("Video processed successfully!");
      
      setTimeout(() => {
        setActiveTab("results");
        setIsProcessing(false);
      }, 500);
    },
    onError: (error) => {
      console.error("Error processing video:", error);
      toast.error("Failed to process video");
      setProcessingStep("upload");
      setProgress(0);
      setIsProcessing(false);
    }
  });

  const handleVideoUpload = (file: File) => {
    videoMutation.mutate(file);
  };
  console.log("segments chunk", segments);
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            LectureQuiz AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload lectures, get transcripts and quiz questions automatically
          </p>
        </div>
        <Button onClick={handleNavigateToDashboard} variant="outline">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="max-w-4xl mx-auto"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="upload">Upload Video</TabsTrigger>
          <TabsTrigger
            value="processing"
            disabled={!isProcessing && segments.length === 0}
          >
            Processing
          </TabsTrigger>
          <TabsTrigger value="results" disabled={segments.length === 0}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Lecture Video</CardTitle>
              <CardDescription>
                Upload an MP4 video file to generate a transcript and quiz
                questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoUpload
                onUpload={handleVideoUpload}
                isProcessing={isProcessing}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle>Processing Video</CardTitle>
              <CardDescription>
                Your video is being transcribed and analyzed to generate quiz
                questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProcessingStatus
                currentStep={processingStep}
                progress={progress}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Transcript with automatically generated questions for each
                5-minute segment
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="space-y-4">
            {segments?.chunks && segments.chunks.length > 0 ? (
              segments?.chunks.map((segment) => (
                <TranscriptSegment key={segment._id} segment={segment} />
              ))
            ) : (
              <div className="text-center p-12 text-muted-foreground">
                No results available yet. Please upload and process a video.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
