import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Card, Row, Col, Statistic, Button, Table, Tag, Avatar } from "antd";
import {
  UserOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LineChartOutlined,
  TrophyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getQuestions } from "../store/Question/thunk";
import { getExams } from "../store/Exam/thunk/examThunk";
import { logout } from "../store/Auth/thunk";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const questions = useSelector((state) => state.questionReducer.questions);
  const loading = useSelector((state) => state.questionReducer.loading.read);
  const exams = useSelector((state) => state.examManagementReducer.exams);
  const examLoading = useSelector((state) => state.examManagementReducer.loading.read);

  useEffect(() => {
    dispatch(getQuestions());
    dispatch(getExams());
  }, [dispatch]);

  // Statistics
  const stats = {
    totalQuestions: questions.length,
    totalUsers: 156,
    totalExams: exams.length,
    totalAttempts: 1247,
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  const questionColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Câu hỏi",
      dataIndex: "question",
      key: "question",
      render: (text) => (
        <div className="max-w-md truncate" title={text}>
          {text.replace(/\$([^$]+)\$/g, '$1')} {/* Remove LaTeX $ for preview */}
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color="blue">
          {type === "SingleAnswer" ? "Một đáp án" : type}
        </Tag>
      ),
    },
    {
      title: "Độ khó",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (difficulty) => {
        const colors = {
          easy: "green",
          medium: "orange",
          hard: "red"
        };
        const labels = {
          easy: "Dễ",
          medium: "Trung bình",
          hard: "Khó"
        };
        return <Tag color={colors[difficulty]}>{labels[difficulty]}</Tag>;
      },
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <Tag color="purple">
          {subject === "math" ? "Toán học" : subject}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/questions/${record.id}`)}
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/questions/${record.id}/edit`)}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              // Handle delete
              console.log("Delete question", record.id);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar size={64} icon={<UserOutlined />} className="bg-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Chào mừng {userInfo?.name || userInfo?.email}!
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link to="/admin/questions/create">
                <Button type="primary" icon={<PlusOutlined />}>
                  Thêm câu hỏi
                </Button>
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
                title="Tổng câu hỏi"
                value={stats.totalQuestions}
                prefix={<QuestionCircleOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng người dùng"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng đề thi"
                value={stats.totalExams}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Lượt thi"
                value={stats.totalAttempts}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={12}>
            <Card title="Quản lý câu hỏi" className="h-full">
              <div className="space-y-3">
                <Link to="/admin/questions/create">
                  <Button block icon={<PlusOutlined />}>
                    Thêm câu hỏi mới
                  </Button>
                </Link>
                <Link to="/admin/questions">
                  <Button block icon={<QuestionCircleOutlined />}>
                    Xem tất cả câu hỏi
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Quản lý đề thi" className="h-full">
              <div className="space-y-3">
                <Link to="/admin/exams/create">
                  <Button block icon={<PlusOutlined />}>
                    Tạo đề thi mới
                  </Button>
                </Link>
                <Link to="/admin/exams">
                  <Button block icon={<FileTextOutlined />}>
                    Xem tất cả đề thi
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Management & Analytics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={12}>
            <Card title="Quản lý hệ thống" className="h-full">
              <div className="space-y-3">
                <Link to="/admin/users">
                  <Button block icon={<UserOutlined />} size="large">
                    Quản lý người dùng
                  </Button>
                </Link>
                <Link to="/admin/results">
                  <Button block icon={<TrophyOutlined />} size="large">
                    Xem kết quả thi
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Báo cáo & Thống kê" className="h-full">
              <div className="space-y-3">
                <Link to="/admin/reports">
                  <Button block icon={<BarChartOutlined />} size="large">
                    Báo cáo tổng quan
                  </Button>
                </Link>
                <Link to="/admin/reports">
                  <Button block icon={<LineChartOutlined />} size="large">
                    Thống kê chi tiết
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Recent Questions Table */}
        <Card title="Câu hỏi gần đây" className="mb-6">
          <Table
            columns={questionColumns}
            dataSource={questions.slice(0, 10)}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} câu hỏi`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
