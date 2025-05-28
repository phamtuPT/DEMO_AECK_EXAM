import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Tag,
  Select,
  Input,
  Typography,
  Space,
  Divider,
} from "antd";
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getExams } from "../store/Exam/thunk/examThunk";
import mockDatabase from "../data/mockDatabase";

const { Option } = Select;
const { Search } = Input;
const { Title, Text } = Typography;

const ExamListUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const exams = useSelector((state) => state.examManagementReducer.exams);
  const loading = useSelector((state) => state.examManagementReducer.loading.read);

  const [filters, setFilters] = useState({
    subject: "",
    difficulty: "",
    search: "",
  });

  useEffect(() => {
    // Initialize database if needed
    const dbExams = mockDatabase.getExams();
    if (dbExams.length === 0) {
      mockDatabase.resetDatabase();
    }

    // Only get active exams for users
    dispatch(getExams({ status: "active" }));
  }, [dispatch]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    dispatch(getExams({ ...newFilters, status: "active" }));
  };

  const getSubjectLabel = (subject) => {
    const labels = {
      math_thinking: "Tư duy Toán học",
      reading_thinking: "Tư duy Đọc hiểu",
      science_thinking: "Tư duy Khoa học",
      mixed: "Hỗn hợp",
    };
    return labels[subject] || subject;
  };

  const getSubjectColor = (subject) => {
    const colors = {
      math_thinking: "blue",
      reading_thinking: "green",
      science_thinking: "orange",
      mixed: "purple",
    };
    return colors[subject] || "default";
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
      mixed: "Hỗn hợp",
    };
    return labels[difficulty] || difficulty;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "green",
      medium: "orange",
      hard: "red",
      mixed: "purple",
    };
    return colors[difficulty] || "default";
  };

  // Filter exams based on search and filters
  const filteredExams = exams.filter(exam => {
    let matches = true;

    if (filters.search) {
      matches = matches && (
        exam.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        exam.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.subject) {
      matches = matches && exam.subject === filters.subject;
    }

    if (filters.difficulty) {
      matches = matches && exam.difficulty === filters.difficulty;
    }

    return matches && exam.status === "active";
  });

  const handleStartExam = (examId) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-blue-600">
            Danh sách đề thi TSA
          </Title>
          <Text className="text-gray-600 text-lg">
            Chọn đề thi phù hợp để bắt đầu luyện tập
          </Text>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Tìm kiếm đề thi..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                allowClear
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Chọn phần thi"
                value={filters.subject}
                onChange={(value) => handleFilterChange("subject", value)}
                allowClear
                className="w-full"
              >
                <Option value="math_thinking">Tư duy Toán học</Option>
                <Option value="reading_thinking">Tư duy Đọc hiểu</Option>
                <Option value="science_thinking">Tư duy Khoa học</Option>
                <Option value="mixed">Hỗn hợp</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Chọn độ khó"
                value={filters.difficulty}
                onChange={(value) => handleFilterChange("difficulty", value)}
                allowClear
                className="w-full"
              >
                <Option value="easy">Dễ</Option>
                <Option value="medium">Trung bình</Option>
                <Option value="hard">Khó</Option>
                <Option value="mixed">Hỗn hợp</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Exam Cards */}
        <Row gutter={[24, 24]}>
          {filteredExams.map((exam) => (
            <Col xs={24} sm={12} lg={8} key={exam.id}>
              <Card
                hoverable
                className="h-full"
                actions={[
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleStartExam(exam.id)}
                    size="large"
                    block
                  >
                    Bắt đầu thi
                  </Button>
                ]}
              >
                <div className="mb-4">
                  <Title level={4} className="mb-2 line-clamp-2">
                    {exam.title}
                  </Title>
                  <Text className="text-gray-600 text-sm line-clamp-3">
                    {exam.description}
                  </Text>
                </div>

                <Divider className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Space>
                      <ClockCircleOutlined className="text-blue-500" />
                      <Text strong>{exam.duration} phút</Text>
                    </Space>
                    <Space>
                      <FileTextOutlined className="text-green-500" />
                      <Text strong>{exam.totalQuestions} câu</Text>
                    </Space>
                  </div>

                  <div className="flex justify-between items-center">
                    <Tag color={getSubjectColor(exam.subject)}>
                      {getSubjectLabel(exam.subject)}
                    </Tag>
                    <Tag color={getDifficultyColor(exam.difficulty)}>
                      {getDifficultyLabel(exam.difficulty)}
                    </Tag>
                  </div>

                  {exam.settings?.passingScore && (
                    <div className="text-center">
                      <Text className="text-xs text-gray-500">
                        Điểm đạt: {exam.settings.passingScore}%
                      </Text>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Empty State */}
        {filteredExams.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
            <Title level={3} className="text-gray-400">
              Không tìm thấy đề thi nào
            </Title>
            <Text className="text-gray-500">
              Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
            </Text>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Title level={3} className="text-gray-400">
              Đang tải đề thi...
            </Title>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamListUser;
