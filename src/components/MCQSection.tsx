import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { MCQSectionProps } from "@/services/interfaces";



const MCQSection: React.FC<MCQSectionProps> = ({ questions, segmentId }) => {
  console.log("MCQSection questions:", questions, segmentId);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);

  const handleOptionChange = (questionId: string, selectedOption: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const checkAnswers = () => {
    let correct = 0;
    questions.forEach(question => {
      const correctAnswer =question.answer;
      if (selectedOptions[question._id.toString()] === correctAnswer) {
        correct++;
      }
    });

    toast.success(`You got ${correct} out of ${questions.length} correct!`);
    setShowAnswers(true);
  };

  const exportQuestions = () => {
    const exportData = {
      segmentId,
      questions: questions.map(q => ({
        question: q.question,
        options: q.options,
        answer: q.answer
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcq-segment-${segmentId}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Questions exported successfully!');
  };

  return (
    <div className="mt-4 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Multiple Choice Questions</h3>
        <Button variant="outline" size="sm" onClick={exportQuestions}>
          Export Questions
        </Button>
      </div>

      <Separator />

      {questions.map((question, qIndex) => {
        const correctAnswer = question.answer;

        return (
          <div key={question._id.toString()} className="space-y-4">
            <p className="font-medium">
              {qIndex + 1}. {question.question}
            </p>

            <RadioGroup
              value={selectedOptions[question._id.toString()] || ""}
              onValueChange={(value) => handleOptionChange(question._id.toString(), value)}
            >
              {question.options.map((option, oIndex) => {
                const isCorrect = option === correctAnswer;
                const isSelected = selectedOptions[question._id.toString()] === option;

                return (
                  <div
                    key={oIndex}
                    className={`flex items-center space-x-2 p-2 rounded ${
                      showAnswers && isCorrect ? "bg-green-50" :
                      showAnswers && isSelected && !isCorrect ? "bg-red-50" : ""
                    }`}
                  >
                    <RadioGroupItem value={option} id={`q${question._id}-o${oIndex}`} />
                    <Label htmlFor={`q${question._id}-o${oIndex}`} className="flex-grow cursor-pointer">
                      {option}
                    </Label>
                    {showAnswers && isCorrect && (
                      <span className="text-xs text-green-600">Correct</span>
                    )}
                  </div>
                );
              })}
            </RadioGroup>

            {qIndex < questions.length - 1 && <Separator className="my-4" />}
          </div>
        );
      })}

      {!showAnswers && (
        <div className="pt-4 flex justify-end">
          <Button onClick={checkAnswers}>Check Answers</Button>
        </div>
      )}
    </div>
  );
};

export default MCQSection;
