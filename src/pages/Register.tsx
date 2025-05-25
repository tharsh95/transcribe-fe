
import React from "react";
import AuthForm from "@/components/AuthForm";

const Register = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">LectureQuiz AI</h1>
        <p className="text-lg text-muted-foreground">
          Create an account to start using LectureQuiz
        </p>
      </div>
      
      <AuthForm mode="register" />
    </div>
  );
};

export default Register;
