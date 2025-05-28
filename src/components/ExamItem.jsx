import React, { useState } from "react";
import { clsx } from "clsx";
import { Button, Modal, Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { chooseExam, chooseExamTime } from "../store/Exam/thunk";

const ExamItem = ({ data }, className) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleChooseMatchExam = () => {
    dispatch(chooseExam("Tư duy Toán học"));
    dispatch(chooseExamTime(3600));
  };

  const handleChooseCRExam = () => {
    dispatch(chooseExam("Tư duy Đọc hiểu"));
    dispatch(chooseExamTime(1800));
  };

  const handleStartExam = () => {
    // If examId exists, navigate to new exam system
    if (data.examId) {
      window.location.href = `/exam/${data.examId}`;
    } else {
      // Otherwise show modal for old system
      showModal();
    }
  };

  return (
    <section
      className={clsx(
        "bg-[#fff] mb-2 rounded-[8px] shadow-examItem text-textAuth",
        className
      )}
    >
      <div className="border-[#f5f5f5] border-b px-6 py-4 text-[16px] font-bold">
        {data.nameExam}
      </div>
      <div className="flex flex-col px-6 py-4 gap-2">
        <div className="flex justify-between items-center">
          <p className="text-gray text-[14px] leading-[21px] m-0">
            Hình thức thi:{" "}
          </p>
          <Tag color={data.isOnlineExam ? "success" : "error"} className="m-0">
            {data.isOnlineExam ? "Thi trực tuyến" : "Thi tại địa điểm thi"}
          </Tag>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray text-[14px] leading-[21px] m-0">
            Thời gian đăng ký:{" "}
          </p>
          <div>{data.signUpTime}</div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray text-[14px] leading-[21px] m-0">Lệ phí: </p>
          <div className=" font-semibold">{data.cost}</div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray text-[14px] leading-[21px] m-0">
            Thời gian thi:{" "}
          </p>
          <div>{data.examTime}</div>
        </div>
      </div>
      <div className="border-t border-borderAuth px-6 py-4 text-end">
        <Button
          onClick={handleStartExam}
          disabled={data.isSignUp ? false : true}
          className={clsx(
            `${
              data.isSignUp
                ? "bg-success text-white border-success hover:bg-successHover hover:border-successHover"
                : "bg-buttonDisable border-borderDisable text-textDisable"
            }  `
          )}
        >
          {data.isSignUp ? "Vào thi ngay" : "Hết hạn đăng ký"}
        </Button>
      </div>
      {/*
      Modal while the user is not logged in
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        closeIcon={false}
        className="relative max-w-[408px] top-1/2"
        footer={[]}
      >
        <CloseOutlined
          onClick={handleCancel}
          className="block absolute top-[-55px] right-1/2 translate-x-1/2 bg-white rounded-full text-center leading-5 font-bold w-[1.5rem] h-[1.5rem]"
        />

        <div className=" p-6">
          <p className="text-center font-bold ">
            Vui lòng đăng nhập để tiếp tục
          </p>
          <div className="flex items-center justify-center">
            <div className="w-1/2 text-center">
              <Link to={"/dang-ky"} className=" link text-[14px]">
                Chưa có tài khoản?
              </Link>
            </div>
            <div className="w-1/2">
              <Link
                to={"/dang-nhap"}
                className="block text-center w-full bg-primary text-white min-h-[40px] text-[14px] leading-[40px] font-normal hover:bg-secondary hover:border-primary hover:shadow-button outline-none rounded-[6px]"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      */}
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        closeIcon={false}
        className="relative w-[680px] -translate-y-1/2 top-1/2"
        footer={[]}
      >
        <CloseOutlined
          onClick={handleCancel}
          className="block absolute top-[-55px] right-1/2 translate-x-1/2 bg-white rounded-full text-center leading-5 font-bold w-[1.5rem] h-[1.5rem]"
        />

        <div className=" p-6">
          <p className="text-center font-semibold text-[24px]">Chọn phần thi</p>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Link
              onClick={handleChooseMatchExam}
              to={"/e1"}
              className="block text-center w-full bg-primary text-white min-h-[40px] text-[14px] leading-[40px] font-normal hover:bg-secondary hover:border-primary hover:shadow-button outline-none rounded-[6px]"
            >
              Tư duy Toán học
            </Link>
            <Link
              onClick={handleChooseCRExam}
              to={"/e2-tu-luan"}
              className="block text-center w-full bg-primary text-white min-h-[40px] text-[14px] leading-[40px] font-normal hover:bg-secondary hover:border-primary hover:shadow-button outline-none rounded-[6px]"
            >
              Tư duy Đọc hiểu
            </Link>
            <Link
              onClick={handleChooseCRExam}
              to={"/e3"}
              className="block text-center w-full bg-primary text-white min-h-[40px] text-[14px] leading-[40px] font-normal hover:bg-secondary hover:border-primary hover:shadow-button outline-none rounded-[6px]"
            >
              Tư duy Khoa học/Giải quyết vấn đề
            </Link>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default ExamItem;
