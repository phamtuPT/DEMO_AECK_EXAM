import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Alert } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../store/Auth/thunk";
import { components } from "../styles";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  const { loading, success, error, message: successMessage } = useSelector(
    (state) => state.authReducer.forgotPassword
  );

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (success && successMessage) {
      messageApi.success(successMessage);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/dang-nhap");
      }, 3000);
    }
  }, [success, successMessage, messageApi, navigate]);

  useEffect(() => {
    if (error) {
      messageApi.error(error);
    }
  }, [error, messageApi]);

  const onFinish = (values) => {
    dispatch(forgotPassword(values.email));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <section className="auth-form flex flex-col justify-center p-8">
      {contextHolder}
      
      {/* Header */}
      <div className="flex flex-col justify-center mb-8">
        <div className="flex items-center mb-4">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate("/dang-nhap")}
            className="mr-2"
          >
            Quay lại
          </Button>
        </div>
        
        <h1 className={components.titleH1}>Quên mật khẩu</h1>
        <p className="text-authForm text-center text-gray-600">
          Nhập email đăng ký của bạn để nhận liên kết đặt lại mật khẩu
        </p>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert
          message="Thành công!"
          description={successMessage}
          type="success"
          showIcon
          className="mb-6"
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          className="mb-6"
        />
      )}

      {/* Form */}
      <Form
        form={form}
        name="forgotPassword"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        disabled={loading || success}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email!",
            },
            {
              type: "email",
              message: "Email không hợp lệ!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Nhập email của bạn"
            className="min-h-[46px]"
            size="large"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            className="text-white min-h-[46px] text-[18px] font-normal"
            block
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={success}
          >
            {loading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
          </Button>
        </Form.Item>
      </Form>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-authForm">
          Nhớ mật khẩu?{" "}
          <Link to="/dang-nhap" className="link">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
