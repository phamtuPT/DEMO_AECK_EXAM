import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";

import { Button, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { components } from "../styles";
import { useDispatch } from "react-redux";
import { isLogin, login } from "../store/Auth/thunk";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const defaultAcc = {
    email: "demo_account@gmail.com",
    password: 123987,
  };
  const [messageApi, contextHolder] = message.useMessage();

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Tài khoản hoặc mật khẩu của bạn không đúng",
    });
  };
  const onFinish = async (values) => {
    try {
      const result = await dispatch(login(values));
      if (result.success) {
        dispatch(isLogin(true));
        navigate("/dashboard");
      } else {
        onFinishFailed();
      }
    } catch (error) {
      onFinishFailed();
    }
  };
  const onFinishFailed = (errorInfo) => {
    error();
  };


  return (
    <section className=" auth-form flex flex-col justify-center p-8">
      {contextHolder}
      <div className="flex flex-col justify-center mb-12">
        <h1 className={components.titleH1}>Đăng nhập</h1>
        <p className="text-authForm text-center">
          Bạn chưa có tài khoản?{" "}
          <Link to="/dang-ky" className="link">
            Đăng ký ngay
          </Link>
        </p>
      </div>
      <Form
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={{
          email: "student1@gmail.com",
          password: "123456"
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input className="min-h-[46px]" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password className="min-h-[46px]" prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            span: 24,
          }}
        >
          <Button
            className="text-white min-h-[46px] text-[18px] font-normal"
            block
            type="primary"
            htmlType="submit"
          >
            Đăng nhập
          </Button>
        </Form.Item>
        <Link to="/quen-mat-khau" className="link hover:cursor-pointer">
          Quên mật khẩu?
        </Link>
      </Form>

      {/* Footer */}
      <div className="text-center mt-6 space-y-2">
        <p className="text-authForm">
          Bạn chưa có tài khoản?{" "}
          <Link to="/dang-ky" className="link">
            Đăng ký ngay
          </Link>
        </p>
        <p className="text-authForm text-sm">
          Bạn là quản trị viên?{" "}
          <Link to="/admin/login" className="link text-blue-600">
            Đăng nhập Admin
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignIn;
