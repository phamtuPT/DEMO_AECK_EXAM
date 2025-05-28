import React, { useEffect, useState } from "react";
import ExamItem from "../components/ExamItem";
import mockDatabase from "../data/mockDatabase";

const SignUpExam = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Initialize database if needed
    const dbExams = mockDatabase.getExams();
    if (dbExams.length === 0) {
      mockDatabase.resetDatabase();
    }

    // Get active exams and convert to old format
    const activeExams = mockDatabase.getExams().filter(exam => exam.status === "active");

    // Convert new format to old format for ExamItem component
    const convertedExams = activeExams.map(exam => ({
      nameExam: exam.title,
      signUpTime: `${new Date(exam.startDate).toLocaleDateString("vi-VN")} - ${new Date(exam.endDate).toLocaleDateString("vi-VN")}`,
      cost: "Miễn phí",
      examTime: `${new Date(exam.startDate).toLocaleDateString("vi-VN")} - ${new Date(exam.endDate).toLocaleDateString("vi-VN")}`,
      isSignUp: true, // All active exams are available
      isOnlineExam: true, // All are online exams
      examId: exam.id // Add exam ID for navigation
    }));

    setExams(convertedExams);
  }, []);

  return (
    <section className="h-full">
      <div className="flex flex-row items-center">
        <h1 className="m-0 text-start text-[20px] font-normal">
          Bài thi Đánh giá tư duy - TSA
        </h1>
      </div>
      <hr className="line my-6" />
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        {exams.map((item) => (
          <ExamItem className="" key={item.nameExam} data={item} />
        ))}
      </div>
    </section>
  );
};

export default SignUpExam;
