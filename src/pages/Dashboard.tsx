import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TranscriptSegment from "@/components/TranscriptSegment";
import { Book, LogOut, Upload } from "lucide-react";
import { toast } from "sonner";
import { LectureData } from "@/services/interfaces";


const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedLecture, setSelectedLecture] = useState<LectureData | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: lectures = [],
    isLoading,
    error,
  } = useQuery<LectureData[]>({
    queryKey: ["lectures"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/video-processing");
      if (!response.ok) {
        throw new Error("Failed to fetch lectures");
      }
      return response.json();
    },
  });
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleViewLecture = (lecture: LectureData) => {
    setSelectedLecture(lecture);
    setIsDialogOpen(true);
  };
  const durationOfVideo = (lecture: LectureData) => {
    const chunks = lecture.chunks.length;
    const durationInSeconds = lecture.chunks[chunks - 1].endTime;
    const durationInMinutes = Math.floor(durationInSeconds / 60);
    const remainingSeconds = durationInSeconds % 60;
    if (remainingSeconds > 0) {
      return `${durationInMinutes}  ${remainingSeconds.toFixed(0)}`;
    }
    return `${durationInMinutes}`;
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        Loading lectures...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center text-red-500">
        Error loading lectures: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text">LectureQuiz AI</h1>
          <p className="text-lg text-muted-foreground">
            Manage your lecture transcriptions and quizzes
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/")} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload New
          </Button>
          <Button onClick={handleLogout} variant="secondary">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Lectures</CardTitle>
          <CardDescription>
            All your uploaded lecture videos with transcripts and generated MCQ
            quizzes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lectures.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Segments</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lectures.map((lecture) => (
                  <TableRow key={lecture._id.toString()}>
                    <TableCell className="font-medium">
                      {`${lecture.videoName
                        .split(" ")
                        .slice(0, 5)
                        .join(" ")}...`}
                    </TableCell>{" "}
                    <TableCell>{formatDate(lecture.createdAt)}</TableCell>
                    <TableCell>{durationOfVideo(lecture)}</TableCell>
                    <TableCell>
                      {lecture.chunks ? lecture.chunks.length : 0}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleViewLecture(lecture)}
                        size="sm"
                        variant="outline"
                      >
                        <Book className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No lectures found
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedLecture?.videoName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedLecture?.chunks.map((segment) => (
              <TranscriptSegment key={segment._id.$oid} segment={segment} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
