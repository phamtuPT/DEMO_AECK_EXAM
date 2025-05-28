import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Alert } from "antd";
import { UserOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { adminLogin } from "../store/Auth/thunk";
import { components } from "../styles";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(adminLogin(values));

      if (result.success) {
        messageApi.success("Đăng nhập admin thành công!");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <section className="auth-form flex flex-col justify-center p-8">
      {contextHolder}

      {/* Header */}
      <div className="flex flex-col justify-center mb-8">
        <div className="flex justify-center mb-4">
          <SafetyOutlined className="text-4xl text-blue-600" />
        </div>
        <h1 className={components.titleH1}>Đăng nhập Admin</h1>
        <p className="text-authForm text-center text-gray-600">
          Dành cho quản trị viên hệ thống
        </p>
      </div>

      {/* Demo Account Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Tài khoản demo:</h3>
        <p className="text-sm text-blue-700 mb-1">Email: <code>admin@tsa.com</code></p>
        <p className="text-sm text-blue-700">Mật khẩu: <code>admin123</code></p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          message="Lỗi đăng nhập"
          description={error}
          type="error"
          showIcon
          className="mb-6"
          closable
          onClose={() => setError(null)}
        />
      )}

      {/* Form */}
      <Form
        name="adminLogin"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        disabled={loading}
        initialValues={{
          email: "admin@tsa.com",
          password: "admin123"
        }}
      >
        <Form.Item
          label="Email Admin"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email admin!",
            },
            {
              type: "email",
              message: "Email không hợp lệ!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Nhập email admin"
            className="min-h-[46px]"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu admin"
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
            icon={<SafetyOutlined />}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}
          </Button>
        </Form.Item>
      </Form>

      {/* Footer */}
      <div className="text-center mt-6 space-y-3">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-2">
            🔑 Tài khoản Admin Demo:
          </p>
          <div className="text-xs text-blue-700">
            <div>Email: <code className="bg-white px-1 rounded">admin@tsa.com</code></div>
            <div>Mật khẩu: <code className="bg-white px-1 rounded">admin123</code></div>
          </div>
        </div>
        <p className="text-authForm">
          Không phải admin?{" "}
          <Link to="/dang-nhap" className="link">
            Đăng nhập thí sinh
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AdminLogin;
