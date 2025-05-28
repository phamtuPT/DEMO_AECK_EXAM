import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  Statistic,
  Progress,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  DownloadOutlined,
  TrophyOutlined,
  UserOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import mockDatabase from "../data/mockDatabase";

const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const ExamResultsAdmin = () => {
  const navigate = useNavigate();
  
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    examId: "",
    userId: "",
    dateRange: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const examResults = mockDatabase.getExamResults();
      const allUsers = mockDatabase.getUsers();
      const allExams = mockDatabase.getExams();
      
      // Generate some mock results if empty
      if (examResults.length === 0) {
        const mockResults = generateMockResults(allUsers, allExams);
        mockDatabase.saveExamResults(mockResults);
        setResults(mockResults);
      } else {
        setResults(examResults);
      }
      
      setUsers(allUsers);
      setExams(allExams);
      setLoading(false);
    }, 500);
  };

  const generateMockResults = (users, exams) => {
    const mockResults = [];
    const students = users.filter(u => u.role === "student");
    
    students.forEach((student, index) => {
      exams.forEach((exam, examIndex) => {
        if (Math.random() > 0.3) { // 70% chance student took the exam
          const correctAnswers = Math.floor(Math.random() * exam.totalQuestions * 0.6) + 
                                Math.floor(exam.totalQuestions * 0.2);
          const score = Math.round((correctAnswers / exam.totalQuestions) * 100);
          const passed = score >= (exam.settings?.passingScore || 60);
          
          mockResults.push({
            id: mockResults.length + 1,
            examId: exam.id,
            examTitle: exam.title,
            userId: student.id,
            userName: student.name,
            userEmail: student.email,
            score,
            correctAnswers,
            totalQuestions: exam.totalQuestions,
            passed,
            timeSpent: Math.floor(Math.random() * exam.duration * 0.8) + Math.floor(exam.duration * 0.2),
            completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            answers: {},
          });
        }
      });
    });
    
    return mockResults;
  };

  const handleViewDetail = (result) => {
    Modal.info({
      title: "Chi tiết kết quả thi",
      width: 600,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Học sinh:</strong> {result.userName}
            </div>
            <div>
              <strong>Email:</strong> {result.userEmail}
            </div>
            <div>
              <strong>Đề thi:</strong> {result.examTitle}
            </div>
            <div>
              <strong>Điểm số:</strong> {result.score}/100
            </div>
            <div>
              <strong>Số câu đúng:</strong> {result.correctAnswers}/{result.totalQuestions}
            </div>
            <div>
              <strong>Thời gian:</strong> {result.timeSpent} phút
            </div>
            <div>
              <strong>Kết quả:</strong> 
              <Tag color={result.passed ? "green" : "red"} className="ml-2">
                {result.passed ? "Đạt" : "Không đạt"}
              </Tag>
            </div>
            <div>
              <strong>Hoàn thành:</strong> {new Date(result.completedAt).toLocaleString("vi-VN")}
            </div>
          </div>
          <div className="mt-4">
            <Progress 
              percent={result.score} 
              strokeColor={result.score >= 80 ? "#52c41a" : result.score >= 60 ? "#faad14" : "#ff4d4f"}
            />
          </div>
        </div>
      ),
    });
  };

  const columns = [
    {
      title: "Học sinh",
      key: "student",
      render: (_, record) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2 text-blue-500" />
          <div>
            <div className="font-medium">{record.userName}</div>
            <div className="text-xs text-gray-500">{record.userEmail}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Đề thi",
      dataIndex: "examTitle",
      key: "examTitle",
      render: (text) => (
        <div className="max-w-xs">
          <div className="font-medium truncate">{text}</div>
        </div>
      ),
    },
    {
      title: "Điểm số",
      dataIndex: "score",
      key: "score",
      render: (score) => (
        <div className="text-center">
          <div className={`text-lg font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {score}
          </div>
          <div className="text-xs text-gray-500">/100</div>
        </div>
      ),
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: "Kết quả",
      dataIndex: "passed",
      key: "passed",
      render: (passed) => (
        <Tag color={passed ? "green" : "red"}>
          {passed ? "Đạt" : "Không đạt"}
        </Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "timeSpent",
      key: "timeSpent",
      render: (time) => (
        <div className="flex items-center">
          <ClockCircleOutlined className="mr-1 text-gray-500" />
          {time} phút
        </div>
      ),
    },
    {
      title: "Ngày thi",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.completedAt) - new Date(b.completedAt),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  // Filter results
  const filteredResults = results.filter(result => {
    if (filters.examId && result.examId !== parseInt(filters.examId)) return false;
    if (filters.userId && result.userId !== parseInt(filters.userId)) return false;
    if (filters.dateRange && filters.dateRange.length === 2) {
      const resultDate = new Date(result.completedAt);
      const [start, end] = filters.dateRange;
      if (resultDate < start.toDate() || resultDate > end.toDate()) return false;
    }
    return true;
  });

  // Statistics
  const stats = {
    totalResults: filteredResults.length,
    averageScore: filteredResults.length > 0 ? 
      Math.round(filteredResults.reduce((sum, r) => sum + r.score, 0) / filteredResults.length) : 0,
    passedCount: filteredResults.filter(r => r.passed).length,
    passRate: filteredResults.length > 0 ? 
      Math.round((filteredResults.filter(r => r.passed).length / filteredResults.length) * 100) : 0,
  };

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
                Kết quả thi
              </Title>
            </div>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                // Export functionality
                const csvContent = "data:text/csv;charset=utf-8," + 
                  "Học sinh,Email,Đề thi,Điểm số,Kết quả,Thời gian,Ngày thi\n" +
                  filteredResults.map(r => 
                    `${r.userName},${r.userEmail},${r.examTitle},${r.score},${r.passed ? 'Đạt' : 'Không đạt'},${r.timeSpent},${new Date(r.completedAt).toLocaleDateString("vi-VN")}`
                  ).join("\n");
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "ket_qua_thi.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Tổng lượt thi"
                value={stats.totalResults}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Điểm trung bình"
                value={stats.averageScore}
                suffix="/100"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Số lượt đạt"
                value={stats.passedCount}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Tỷ lệ đạt"
                value={stats.passRate}
                suffix="%"
                valueStyle={{ color: stats.passRate >= 70 ? "#52c41a" : "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Chọn đề thi"
                value={filters.examId}
                onChange={(value) => setFilters(prev => ({ ...prev, examId: value }))}
                allowClear
                className="w-full"
              >
                {exams.map(exam => (
                  <Option key={exam.id} value={exam.id}>
                    {exam.title}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Chọn học sinh"
                value={filters.userId}
                onChange={(value) => setFilters(prev => ({ ...prev, userId: value }))}
                allowClear
                className="w-full"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {users.filter(u => u.role === "student").map(user => (
                  <Option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <RangePicker
                placeholder={["Từ ngày", "Đến ngày"]}
                value={filters.dateRange}
                onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
                className="w-full"
              />
            </Col>
          </Row>
        </Card>

        {/* Results Table */}
        <Card title={`Kết quả thi (${filteredResults.length})`}>
          <Table
            columns={columns}
            dataSource={filteredResults}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} kết quả`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default ExamResultsAdmin;
