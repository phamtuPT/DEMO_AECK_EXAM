import React from "react";
import { components } from "../styles";
import clsx from "clsx";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import ExamItem from "../components/ExamItem";
import exam from "../utils/exam.js";

const ExamList = () => {
  return (
    <section className=" auth-form flex flex-col justify-center md:min-w-[900px] sm:min-w-[680px] min-w-[380px] ">
      <div className="flex flex-row items-center">
        <div className=" w-9/12 p-7">
          <h1 className={clsx(components.titleH1, "m-0 text-start ")}>
            Đăng ký thi
          </h1>
        </div>
        <div className=" w-3/12 flex flex-row gap-1 items-center justify-center p-2 ">
          <UserOutlined className="hidden sm:block" />
          <p className="m-0 hidden sm:block">Thí sinh</p>
          <Link className="link" to="/dang-nhap">
            Đăng nhập
          </Link>
        </div>
      </div>
      <div className="bg-[#fafafa] p-6">
        <div className="grid md:grid-cols-2 gird-cols-1 bg-global gap-4">
          {exam.map((item) => (
            <ExamItem className="" key={item.nameExam} data={item} />
          ))}
        </div>
        <Footer></Footer>
      </div>
    </section>
  );
};

export default ExamList;
