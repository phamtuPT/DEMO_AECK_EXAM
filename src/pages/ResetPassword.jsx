import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Form, Input, message, Alert } from "antd";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../store/Auth/thunk";
import { components } from "../styles";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get("token");
  
  const { loading, success, error, message: successMessage } = useSelector(
    (state) => state.authReducer.resetPassword
  );

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // Check if token exists
    if (!token) {
      messageApi.error("Token không hợp lệ");
      setTimeout(() => {
        navigate("/dang-nhap");
      }, 2000);
    }
  }, [token, messageApi, navigate]);

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
    if (values.password !== values.confirmPassword) {
      messageApi.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    dispatch(resetPassword(token, values.password));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (!token) {
    return (
      <section className="auth-form flex flex-col justify-center p-8">
        <Alert
          message="Token không hợp lệ"
          description="Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."
          type="error"
          showIcon
        />
      </section>
    );
  }

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
        
        <h1 className={components.titleH1}>Đặt lại mật khẩu</h1>
        <p className="text-authForm text-center text-gray-600">
          Nhập mật khẩu mới cho tài khoản của bạn
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
        name="resetPassword"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        disabled={loading || success}
      >
        <Form.Item
          label="Mật khẩu mới"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu mới!",
            },
            {
              min: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu mới"
            className="min-h-[46px]"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng xác nhận mật khẩu!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập lại mật khẩu mới"
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
            {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
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

export default ResetPassword;
