import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Row,
  Col,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import mockDatabase from "../data/mockDatabase";
import { login, isLogin } from "../store/Auth/thunk";
import storageService from "../services/storageService";

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Use hybrid storage service for registration
      const result = await storageService.register({
        name: values.name,
        email: values.email,
        password: values.password
      });

      if (result.success) {
        // Auto login after successful registration
        const loginResult = await dispatch(login({
          email: values.email,
          password: values.password
        }));

        if (loginResult.success) {
          dispatch(isLogin(true));
          message.success(result.message + " Đã tự động đăng nhập.");
          navigate("/dashboard");
        } else {
          message.success(result.message + " Vui lòng đăng nhập.");
          navigate("/dang-nhap");
        }
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi đăng ký!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl border-0">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserOutlined className="text-2xl text-white" />
            </div>
            <Title level={2} className="text-gray-800 mb-2">
              Đăng ký tài khoản
            </Title>
            <Text className="text-gray-600">
              Tạo tài khoản mới để tham gia thi AECK
            </Text>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập họ tên!" },
                { min: 2, message: "Họ tên phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nhập họ và tên"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Định dạng email không đúng!"
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Nhập địa chỉ email"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập mật khẩu"
                className="rounded-lg"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
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
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Xác nhận mật khẩu"
                className="rounded-lg"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 border-0 text-lg font-medium"
                loading={loading}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <Divider className="my-6">
            <Text className="text-gray-500">Hoặc</Text>
          </Divider>

          <div className="text-center space-y-4">
            <Text className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/dang-nhap"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Đăng nhập ngay
              </Link>
            </Text>

            <div className="pt-4 border-t border-gray-100">
              <Text className="text-sm text-gray-500">
                Bằng việc đăng ký, bạn đồng ý với{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Chính sách bảo mật
                </a>
              </Text>
            </div>
          </div>
        </Card>

        {/* Demo Accounts Info */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <Title level={5} className="text-blue-800 mb-3">
            🎯 Tài khoản demo có sẵn:
          </Title>
          <div className="space-y-2 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-blue-700">👨‍🎓 Học sinh:</div>
              <div>Email: <code>student1@gmail.com</code></div>
              <div>Mật khẩu: <code>123456</code></div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-red-700">👨‍💼 Admin:</div>
              <div>Email: <code>admin@aeck.com</code></div>
              <div>Mật khẩu: <code>admin123</code></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
