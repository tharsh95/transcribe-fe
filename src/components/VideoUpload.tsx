
import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { VideoUploadProps } from "@/services/interfaces";



const VideoUpload: React.FC<VideoUploadProps> = ({ onUpload, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'video/mp4') {
        toast.error('Please upload an MP4 video file');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'video/mp4') {
        toast.error('Please upload an MP4 video file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProcessFile = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      toast.success(`Processing ${selectedFile.name}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`drop-zone ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="video/mp4"
          className="hidden"
          onChange={handleFileSelect}
          ref={fileInputRef}
        />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Drag and drop your lecture video</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Supports MP4 video files up to 1GB
        </p>
        <Button 
          variant="outline" 
          onClick={handleUploadClick}
        >
          Select File
        </Button>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button 
              onClick={handleProcessFile}
              disabled={isProcessing}
            >
              Process Video
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
