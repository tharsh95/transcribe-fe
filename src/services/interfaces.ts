export interface AuthFormProps {
    mode: "login" | "register";
  }
  export interface MCQSectionProps {
    questions: MCQ[];
    segmentId: string;
  }

  export interface MCQ {
    _id: { $oid: string };
    question: string;
    options: string[];
    answer: string;
  }
  export type ProcessingStep = 'upload' | 'transcription' | 'segmentation' | 'generation' | 'complete';

export interface ProcessingStatusProps {
  currentStep: ProcessingStep;
  progress: number;
}

    export type Chunk = {
        _id: { $oid: string };
        chunkNumber: number;
        startTime: number;
        endTime: number;
        transcription: string;
        mcqs: MCQ[];
    };
    export interface TranscriptSegmentData {
        _id?: { $oid: string };
        videoName?: string;
        chunks: Chunk[];
        createdAt?: { $date: string };
        __v: number;
    }
  export interface TranscriptSegmentProps {
    segment: Chunk;
  }
  export interface VideoUploadProps {
    onUpload: (file: File) => void;
    isProcessing: boolean;
  }
  export interface LectureData {
    _id: { $oid: string };
    videoName: string;
    chunks: Chunk[];
    createdAt:  string ;
    __v: number;
  }
  export interface ProcessVideoResponse {
    success: boolean;
    data: TranscriptSegmentData[];
    message?: string;
  }