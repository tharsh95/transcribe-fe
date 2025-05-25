
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Check, Loader } from "lucide-react";
import { ProcessingStatusProps } from "@/services/interfaces";



const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ currentStep, progress }) => {
  const steps = [
    { id: 'upload', label: 'Uploading Video' },
    { id: 'transcription', label: 'Transcribing Audio' },
    { id: 'segmentation', label: 'Segmenting Content' },
    { id: 'generation', label: 'Generating Questions' },
    { id: 'complete', label: 'Processing Complete' },
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <Progress value={progress} className="h-2 mb-8" />
      
      <div className="grid grid-cols-5 gap-2">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          return (
            <div 
              key={step.id} 
              className={`flex flex-col items-center text-center p-2 ${
                status === 'active' ? 'text-blue-600' : 
                status === 'complete' ? 'text-green-600' : 'text-muted-foreground'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                status === 'active' ? 'bg-blue-100 border-2 border-blue-600' : 
                status === 'complete' ? 'bg-green-100' : 'bg-muted'
              }`}>
                {status === 'complete' ? (
                  <Check className="h-4 w-4" />
                ) : status === 'active' ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="text-xs">{steps.findIndex(s => s.id === step.id) + 1}</span>
                )}
              </div>
              <span className="text-xs">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingStatus;
