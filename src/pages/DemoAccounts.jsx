import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Row,
  Col,
  Tag,
  Space,
  Divider,
  Alert,
  message,
} from "antd";
import {
  UserOutlined,
  CrownOutlined,
  BookOutlined,
  TrophyOutlined,
  LoginOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import mockDatabase from "../data/mockDatabase";

const { Title, Text, Paragraph } = Typography;

const DemoAccounts = () => {
  const handleResetDatabase = () => {
    mockDatabase.resetDatabase();
    message.success("Database đã được reset! Bài thi test 15s đã có sẵn.");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleClearUserData = () => {
    // Clear all user-related localStorage
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("persist:auth");
    localStorage.removeItem("persist:root");

    // Clear old TSA data
    localStorage.removeItem("tsa_users");
    localStorage.removeItem("tsa_questions");
    localStorage.removeItem("tsa_exams");
    localStorage.removeItem("tsa_exam_results");
    localStorage.removeItem("tsa_next_ids");

    message.success("Đã xóa dữ liệu user! Refresh trang để thấy thay đổi.");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const accounts = [
    {
      type: "admin",
      title: "👨‍💼 Tài khoản Admin",
      email: "admin@aeck.com",
      password: "admin123",
      description: "Quản trị viên hệ thống với đầy đủ quyền hạn",
      features: [
        "Quản lý câu hỏi và đề thi",
        "Xem báo cáo và thống kê",
        "Quản lý người dùng",
        "Xem kết quả thi của tất cả học sinh",
      ],
      color: "red",
      icon: <CrownOutlined />,
      loginPath: "/admin/login",
    },
    {
      type: "student",
      title: "👨‍🎓 Tài khoản Học sinh 1",
      email: "student1@gmail.com",
      password: "123456",
      description: "Học sinh có thể tham gia thi và xem kết quả",
      features: [
        "Tham gia các kỳ thi AECK",
        "Xem kết quả và phân tích",
        "Thi thử không giới hạn",
        "Theo dõi tiến độ học tập",
      ],
      color: "blue",
      icon: <UserOutlined />,
      loginPath: "/dang-nhap",
    },
    {
      type: "student",
      title: "👩‍🎓 Tài khoản Học sinh 2",
      email: "student2@gmail.com",
      password: "123456",
      description: "Tài khoản học sinh khác để test",
      features: [
        "Tham gia các kỳ thi TSA",
        "Xem kết quả và phân tích",
        "Thi thử không giới hạn",
        "Theo dõi tiến độ học tập",
      ],
      color: "green",
      icon: <UserOutlined />,
      loginPath: "/dang-nhap",
    },
    {
      type: "demo",
      title: "🎯 Tài khoản Demo",
      email: "demo@test.com",
      password: "demo123",
      description: "Tài khoản demo để trải nghiệm nhanh",
      features: [
        "Trải nghiệm đầy đủ tính năng",
        "Dữ liệu mẫu có sẵn",
        "Không cần đăng ký",
        "Reset dữ liệu hàng ngày",
      ],
      color: "purple",
      icon: <EyeOutlined />,
      loginPath: "/dang-nhap",
    },
  ];

  const systemFeatures = [
    {
      title: "📝 Quản lý Câu hỏi",
      description: "Tạo, chỉnh sửa, xóa câu hỏi với hỗ trợ LaTeX",
      icon: <BookOutlined className="text-blue-500" />,
    },
    {
      title: "📚 Quản lý Đề thi",
      description: "Tạo đề thi từ ngân hàng câu hỏi, cấu hình settings",
      icon: <TrophyOutlined className="text-green-500" />,
    },
    {
      title: "👥 Quản lý Người dùng",
      description: "Thêm, sửa, xóa tài khoản học sinh và admin",
      icon: <UserOutlined className="text-purple-500" />,
    },
    {
      title: "📊 Báo cáo & Thống kê",
      description: "Xem báo cáo chi tiết, thống kê kết quả thi",
      icon: <CrownOutlined className="text-red-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-gray-800 mb-4">
            🎯 Hệ thống AECK Demo
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chào mừng bạn đến với hệ thống đánh giá tư duy AECK!
            Sử dụng các tài khoản demo bên dưới để trải nghiệm đầy đủ tính năng của hệ thống.
          </Paragraph>
        </div>

        {/* Alert */}
        <Alert
          message="💡 Lưu ý quan trọng"
          description="Đây là hệ thống demo với dữ liệu mẫu. Tất cả thông tin được lưu trữ tạm thời trong trình duyệt và sẽ được reset khi refresh trang."
          type="info"
          showIcon
          className="mb-8"
        />

        {/* Demo Accounts */}
        <div className="mb-12">
          <Title level={2} className="text-center mb-6">
            🔑 Tài khoản Demo
          </Title>
          <Row gutter={[24, 24]}>
            {accounts.map((account, index) => (
              <Col xs={24} md={12} lg={6} key={index}>
                <Card
                  className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                  bodyStyle={{ padding: "24px" }}
                >
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 bg-${account.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <span className={`text-2xl text-${account.color}-600`}>
                        {account.icon}
                      </span>
                    </div>
                    <Title level={4} className="mb-2">
                      {account.title}
                    </Title>
                    <Text className="text-gray-600">
                      {account.description}
                    </Text>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Text strong>Email:</Text>
                      <br />
                      <code className="text-blue-600">{account.email}</code>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Text strong>Mật khẩu:</Text>
                      <br />
                      <code className="text-green-600">{account.password}</code>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Text strong className="block mb-2">Tính năng:</Text>
                    <div className="space-y-1">
                      {account.features.map((feature, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          • {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to={account.loginPath}>
                    <Button
                      type="primary"
                      block
                      size="large"
                      icon={<LoginOutlined />}
                      className={`bg-${account.color}-600 hover:bg-${account.color}-700 border-0`}
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* System Features */}
        <div className="mb-12">
          <Title level={2} className="text-center mb-6">
            ⚡ Tính năng hệ thống
          </Title>
          <Row gutter={[24, 24]}>
            {systemFeatures.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="h-full text-center shadow-md hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      {feature.icon}
                    </div>
                    <Title level={4} className="mb-2">
                      {feature.title}
                    </Title>
                    <Text className="text-gray-600">
                      {feature.description}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Quick Actions */}
        <Card className="text-center shadow-lg">
          <Title level={3} className="mb-6">
            🚀 Bắt đầu ngay
          </Title>
          <Space size="large" wrap>
            <Link to="/admin/login">
              <Button type="primary" size="large" icon={<CrownOutlined />}>
                Đăng nhập Admin
              </Button>
            </Link>
            <Link to="/dang-nhap">
              <Button size="large" icon={<UserOutlined />}>
                Đăng nhập Học sinh
              </Button>
            </Link>
            <Link to="/dang-ky">
              <Button size="large" icon={<UserOutlined />}>
                Đăng ký tài khoản mới
              </Button>
            </Link>
            <Link to="/exams">
              <Button size="large" icon={<BookOutlined />}>
                Xem đề thi
              </Button>
            </Link>
            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={handleResetDatabase}
              type="dashed"
            >
              Reset Database
            </Button>
            <Button
              size="large"
              icon={<UserOutlined />}
              onClick={handleClearUserData}
              type="dashed"
              danger
            >
              Clear User Data
            </Button>
          </Space>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <Text className="text-gray-500">
            © 2024 Hệ thống đánh giá tư duy TSA - Demo Version
          </Text>
        </div>
      </div>
    </div>
  );
};

export default DemoAccounts;
