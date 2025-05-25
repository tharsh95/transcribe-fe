
import { useMutation } from "@tanstack/react-query";
import { ProcessVideoResponse } from "./interfaces";

export const useProcessVideo = () => {
  return useMutation<ProcessVideoResponse, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch('http://localhost:3000/video-processing/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Video processing failed');
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Video processed successfully'
      };
    },
  });
};
