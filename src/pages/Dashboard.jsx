import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Card, Row, Col, Statistic, Progress, Button, Table, Tag, Avatar } from "antd";
import {
  TrophyOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { logout } from "../store/Auth/thunk";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const isAuthenticated = useSelector((state) => state.authReducer.isLogin);
  const examResults = useSelector((state) => state.examReducer);

  // Check authentication status and clear localStorage if needed
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear any stale user data from localStorage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    }
  }, [isAuthenticated]);

  // Mock data for demo purposes
  const mockStats = {
    totalExams: 5,
    completedExams: 3,
    averageScore: 85,
    totalTime: 180, // minutes
  };

  const mockExamHistory = [
    {
      key: "1",
      examName: "Bài thi TSA 2024 - Đợt 1",
      date: "2024-01-15",
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      timeSpent: "45 phút",
      status: "completed",
    },
    {
      key: "2",
      examName: "Thi thử Đánh giá tư duy",
      date: "2024-01-10",
      score: 92,
      totalQuestions: 15,
      correctAnswers: 14,
      timeSpent: "38 phút",
      status: "completed",
    },
    {
      key: "3",
      examName: "Bài thi TSA 2024 - Đợt 2",
      date: "2024-01-05",
      score: 78,
      totalQuestions: 25,
      correctAnswers: 19,
      timeSpent: "52 phút",
      status: "completed",
    },
  ];

  const columns = [
    {
      title: "Tên bài thi",
      dataIndex: "examName",
      key: "examName",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Ngày thi",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Điểm số",
      dataIndex: "score",
      key: "score",
      render: (score) => (
        <Tag color={score >= 80 ? "green" : score >= 60 ? "orange" : "red"}>
          {score}/100
        </Tag>
      ),
    },
    {
      title: "Kết quả",
      key: "result",
      render: (_, record) => (
        <span>
          {record.correctAnswers}/{record.totalQuestions} câu đúng
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "timeSpent",
      key: "timeSpent",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Hoàn thành
        </Tag>
      ),
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/dang-nhap");
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#52c41a";
    if (score >= 60) return "#faad14";
    return "#ff4d4f";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar size={64} icon={<UserOutlined />} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Xin chào, {userInfo?.name || userInfo?.email || "Thí sinh ẩn danh"}!
                </h1>
                <p className="text-gray-600">Chào mừng bạn đến với hệ thống thi AECK</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link to="/dang-ky-thi">
                <Button type="primary" icon={<PlayCircleOutlined />}>
                  Thi ngay
                </Button>
              </Link>
              <Link to="/tai-khoan">
                <Button>Hồ sơ</Button>
              </Link>
              <Button onClick={handleLogout}>Đăng xuất</Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng số bài thi"
                value={mockStats.totalExams}
                prefix={<BookOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đã hoàn thành"
                value={mockStats.completedExams}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Điểm trung bình"
                value={mockStats.averageScore}
                suffix="/100"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: getScoreColor(mockStats.averageScore) }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng thời gian"
                value={mockStats.totalTime}
                suffix="phút"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Progress Overview */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={12}>
            <Card title="Tiến độ học tập" className="h-full">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Hoàn thành bài thi</span>
                    <span>{mockStats.completedExams}/{mockStats.totalExams}</span>
                  </div>
                  <Progress
                    percent={(mockStats.completedExams / mockStats.totalExams) * 100}
                    strokeColor="#52c41a"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Điểm số trung bình</span>
                    <span>{mockStats.averageScore}/100</span>
                  </div>
                  <Progress
                    percent={mockStats.averageScore}
                    strokeColor={getScoreColor(mockStats.averageScore)}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Thành tích gần đây" className="h-full">
              <div className="space-y-3">
                {mockExamHistory.slice(0, 3).map((exam) => (
                  <div key={exam.key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-sm">{exam.examName}</div>
                      <div className="text-xs text-gray-500">{new Date(exam.date).toLocaleDateString("vi-VN")}</div>
                    </div>
                    <Tag color={exam.score >= 80 ? "green" : exam.score >= 60 ? "orange" : "red"}>
                      {exam.score}/100
                    </Tag>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Exam History Table */}
        <Card title="Lịch sử thi" className="mb-6">
          <Table
            columns={columns}
            dataSource={mockExamHistory}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} bài thi`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
