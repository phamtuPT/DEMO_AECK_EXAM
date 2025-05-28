import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Button,
  Select,
  DatePicker,
  Space,
  Progress,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  FileTextOutlined,
  BookOutlined,
  TrophyOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getExams } from "../store/Exam/thunk/examThunk";
import { getQuestions } from "../store/Question/thunk";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminReports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const exams = useSelector((state) => state.examManagementReducer.exams);
  const questions = useSelector((state) => state.questionReducer.questions);

  const [timeRange, setTimeRange] = useState("week");
  const [selectedExam, setSelectedExam] = useState("all");

  useEffect(() => {
    dispatch(getExams());
    dispatch(getQuestions());
  }, [dispatch]);

  // Mock data for reports
  const mockStats = {
    totalUsers: 156,
    activeUsers: 89,
    totalAttempts: 1247,
    avgScore: 72.5,
    completionRate: 85.3,
  };

  const mockExamStats = exams.map(exam => ({
    ...exam,
    attempts: Math.floor(Math.random() * 100) + 20,
    avgScore: Math.floor(Math.random() * 40) + 60,
    completionRate: Math.floor(Math.random() * 30) + 70,
    passRate: Math.floor(Math.random() * 50) + 50,
  }));

  const mockQuestionStats = questions.map(question => ({
    ...question,
    attempts: Math.floor(Math.random() * 200) + 50,
    correctRate: Math.floor(Math.random() * 50) + 50,
    avgTime: Math.floor(Math.random() * 120) + 30, // seconds
  }));

  const mockUserActivity = [
    { date: "2024-01-15", users: 45, attempts: 89 },
    { date: "2024-01-16", users: 52, attempts: 103 },
    { date: "2024-01-17", users: 38, attempts: 76 },
    { date: "2024-01-18", users: 61, attempts: 125 },
    { date: "2024-01-19", users: 47, attempts: 94 },
    { date: "2024-01-20", users: 55, attempts: 112 },
    { date: "2024-01-21", users: 43, attempts: 87 },
  ];

  const getSubjectLabel = (subject) => {
    const labels = {
      math_thinking: "Tư duy Toán học",
      reading_thinking: "Tư duy Đọc hiểu",
      science_thinking: "Tư duy Khoa học",
      mixed: "Hỗn hợp"
    };
    return labels[subject] || subject;
  };

  const examColumns = [
    {
      title: "Đề thi",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <Tag color="blue">{getSubjectLabel(record.subject)}</Tag>
        </div>
      ),
    },
    {
      title: "Lượt thi",
      dataIndex: "attempts",
      key: "attempts",
      sorter: (a, b) => a.attempts - b.attempts,
    },
    {
      title: "Điểm TB",
      dataIndex: "avgScore",
      key: "avgScore",
      render: (score) => `${score}/100`,
      sorter: (a, b) => a.avgScore - b.avgScore,
    },
    {
      title: "Tỷ lệ hoàn thành",
      dataIndex: "completionRate",
      key: "completionRate",
      render: (rate) => (
        <Progress percent={rate} size="small" />
      ),
      sorter: (a, b) => a.completionRate - b.completionRate,
    },
    {
      title: "Tỷ lệ đạt",
      dataIndex: "passRate",
      key: "passRate",
      render: (rate) => (
        <span className={rate >= 70 ? "text-green-600" : "text-red-600"}>
          {rate}%
        </span>
      ),
      sorter: (a, b) => a.passRate - b.passRate,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/exams/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const questionColumns = [
    {
      title: "Câu hỏi",
      dataIndex: "question",
      key: "question",
      render: (text) => (
        <div className="max-w-md">
          {text.length > 80 ? text.substring(0, 80) + "..." : text}
        </div>
      ),
    },
    {
      title: "Phần thi",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <Tag color="blue">{getSubjectLabel(subject)}</Tag>
      ),
    },
    {
      title: "Lượt trả lời",
      dataIndex: "attempts",
      key: "attempts",
      sorter: (a, b) => a.attempts - b.attempts,
    },
    {
      title: "Tỷ lệ đúng",
      dataIndex: "correctRate",
      key: "correctRate",
      render: (rate) => (
        <Progress 
          percent={rate} 
          size="small"
          strokeColor={rate >= 70 ? "#52c41a" : rate >= 50 ? "#faad14" : "#ff4d4f"}
        />
      ),
      sorter: (a, b) => a.correctRate - b.correctRate,
    },
    {
      title: "Thời gian TB",
      dataIndex: "avgTime",
      key: "avgTime",
      render: (time) => `${time}s`,
      sorter: (a, b) => a.avgTime - b.avgTime,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/questions/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const activityColumns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Người dùng hoạt động",
      dataIndex: "users",
      key: "users",
      render: (users) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2 text-blue-500" />
          {users}
        </div>
      ),
    },
    {
      title: "Lượt thi",
      dataIndex: "attempts",
      key: "attempts",
      render: (attempts) => (
        <div className="flex items-center">
          <FileTextOutlined className="mr-2 text-green-500" />
          {attempts}
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
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/dashboard")}
              >
                Quay lại
              </Button>
              <Title level={2} className="mb-0">
                Báo cáo và Thống kê
              </Title>
            </div>
            <div className="flex items-center space-x-4">
              <Select
                value={timeRange}
                onChange={setTimeRange}
                style={{ width: 120 }}
              >
                <Option value="week">7 ngày</Option>
                <Option value="month">30 ngày</Option>
                <Option value="quarter">3 tháng</Option>
              </Select>
              <RangePicker />
              <Button icon={<DownloadOutlined />}>
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Statistics */}
        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng người dùng"
                value={mockStats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Người dùng hoạt động"
                value={mockStats.activeUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng lượt thi"
                value={mockStats.totalAttempts}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Điểm trung bình"
                value={mockStats.avgScore}
                suffix="/100"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Exam Statistics */}
          <Col xs={24} xl={14}>
            <Card title="Thống kê đề thi" className="mb-6">
              <Table
                columns={examColumns}
                dataSource={mockExamStats}
                rowKey="id"
                pagination={{
                  pageSize: 5,
                  showSizeChanger: false,
                }}
                scroll={{ x: 800 }}
              />
            </Card>

            {/* Question Statistics */}
            <Card title="Thống kê câu hỏi khó">
              <Table
                columns={questionColumns}
                dataSource={mockQuestionStats
                  .filter(q => q.correctRate < 60)
                  .sort((a, b) => a.correctRate - b.correctRate)
                  .slice(0, 5)
                }
                rowKey="id"
                pagination={false}
                scroll={{ x: 800 }}
              />
            </Card>
          </Col>

          {/* Activity & Performance */}
          <Col xs={24} xl={10}>
            {/* Recent Activity */}
            <Card title="Hoạt động gần đây" className="mb-6">
              <Table
                columns={activityColumns}
                dataSource={mockUserActivity}
                rowKey="date"
                pagination={false}
                size="small"
              />
            </Card>

            {/* Performance Metrics */}
            <Card title="Chỉ số hiệu suất">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>Tỷ lệ hoàn thành bài thi</Text>
                    <Text strong>{mockStats.completionRate}%</Text>
                  </div>
                  <Progress percent={mockStats.completionRate} />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Text>Tỷ lệ đạt điểm</Text>
                    <Text strong>68.2%</Text>
                  </div>
                  <Progress percent={68.2} strokeColor="#52c41a" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Text>Độ khó trung bình</Text>
                    <Text strong>Trung bình</Text>
                  </div>
                  <Progress percent={65} strokeColor="#faad14" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Text>Mức độ hài lòng</Text>
                    <Text strong>4.2/5</Text>
                  </div>
                  <Progress percent={84} strokeColor="#722ed1" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminReports;
