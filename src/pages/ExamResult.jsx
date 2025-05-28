import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Progress,
  Space,
  Divider,
  Tag,
  Row,
  Col,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  HomeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ExamResult = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Get result from navigation state or localStorage
    if (location.state?.result) {
      setResult(location.state.result);
    } else {
      // Try to get from localStorage
      const existingResults = JSON.parse(localStorage.getItem("examResults") || "[]");
      const foundResult = existingResults.find(r => r.examId === parseInt(examId));
      if (foundResult) {
        setResult(foundResult);
      } else {
        navigate("/exams");
      }
    }
  }, [examId, location.state, navigate]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <Title level={3}>Đang tải kết quả...</Title>
        </Card>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "exception";
  };

  const getScoreStatus = (score, passed) => {
    if (passed) return "Đạt";
    return "Không đạt";
  };

  const getScoreStatusColor = (passed) => {
    return passed ? "success" : "error";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            {result.passed ? (
              <TrophyOutlined className="text-6xl text-yellow-500" />
            ) : (
              <CloseCircleOutlined className="text-6xl text-red-500" />
            )}
          </div>
          <Title level={1} className={result.passed ? "text-green-600" : "text-red-600"}>
            {result.passed ? "Chúc mừng!" : "Chưa đạt yêu cầu"}
          </Title>
          <Text className="text-lg text-gray-600">
            Kết quả bài thi: {result.examTitle}
          </Text>
        </div>

        {/* Score Overview */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} md={8}>
            <Card className="text-center h-full">
              <div className="mb-4">
                <Progress
                  type="circle"
                  percent={result.score}
                  status={getScoreColor(result.score)}
                  size={120}
                  format={(percent) => (
                    <div>
                      <div className="text-2xl font-bold">{percent}</div>
                      <div className="text-sm">điểm</div>
                    </div>
                  )}
                />
              </div>
              <Title level={4}>Điểm số</Title>
              <Tag color={getScoreStatusColor(result.passed)} className="text-base px-4 py-1">
                {getScoreStatus(result.score, result.passed)}
              </Tag>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card className="text-center h-full">
              <div className="mb-4">
                <CheckCircleOutlined className="text-6xl text-green-500" />
              </div>
              <Title level={4}>Câu đúng</Title>
              <div className="text-3xl font-bold text-green-600">
                {result.correctAnswers}
              </div>
              <Text className="text-gray-500">
                / {result.totalQuestions} câu
              </Text>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card className="text-center h-full">
              <div className="mb-4">
                <CloseCircleOutlined className="text-6xl text-red-500" />
              </div>
              <Title level={4}>Câu sai</Title>
              <div className="text-3xl font-bold text-red-600">
                {result.totalQuestions - result.correctAnswers}
              </div>
              <Text className="text-gray-500">
                / {result.totalQuestions} câu
              </Text>
            </Card>
          </Col>
        </Row>

        {/* Detailed Stats */}
        <Card className="mb-8">
          <Title level={3} className="mb-4">Chi tiết kết quả</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <div className="flex justify-between py-2">
                <Text strong>Tổng số câu hỏi:</Text>
                <Text>{result.totalQuestions}</Text>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between py-2">
                <Text strong>Số câu trả lời đúng:</Text>
                <Text className="text-green-600">{result.correctAnswers}</Text>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between py-2">
                <Text strong>Số câu trả lời sai:</Text>
                <Text className="text-red-600">{result.totalQuestions - result.correctAnswers}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="flex justify-between py-2">
                <Text strong>Điểm số:</Text>
                <Text className="text-2xl font-bold">{result.score}/100</Text>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between py-2">
                <Text strong>Tỷ lệ chính xác:</Text>
                <Text>{Math.round((result.correctAnswers / result.totalQuestions) * 100)}%</Text>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between py-2">
                <Text strong>Kết quả:</Text>
                <Tag color={getScoreStatusColor(result.passed)}>
                  {getScoreStatus(result.score, result.passed)}
                </Tag>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Performance Analysis */}
        <Card className="mb-8">
          <Title level={3} className="mb-4">Phân tích kết quả</Title>
          <div className="space-y-4">
            {result.score >= 90 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <Text className="text-green-800">
                  <CheckCircleOutlined className="mr-2" />
                  Xuất sắc! Bạn đã thể hiện khả năng tư duy rất tốt.
                </Text>
              </div>
            )}
            
            {result.score >= 70 && result.score < 90 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Text className="text-blue-800">
                  <CheckCircleOutlined className="mr-2" />
                  Tốt! Bạn đã nắm vững phần lớn kiến thức.
                </Text>
              </div>
            )}
            
            {result.score >= 50 && result.score < 70 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Text className="text-yellow-800">
                  <CloseCircleOutlined className="mr-2" />
                  Khá! Bạn cần ôn luyện thêm để cải thiện kết quả.
                </Text>
              </div>
            )}
            
            {result.score < 50 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <Text className="text-red-800">
                  <CloseCircleOutlined className="mr-2" />
                  Cần cố gắng hơn! Hãy ôn luyện kỹ lưỡng và thử lại.
                </Text>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <Card>
          <div className="text-center">
            <Space size="large">
              <Button
                type="primary"
                icon={<HomeOutlined />}
                size="large"
                onClick={() => navigate("/dashboard")}
              >
                Về trang chủ
              </Button>
              <Button
                icon={<ReloadOutlined />}
                size="large"
                onClick={() => navigate("/exams")}
              >
                Thi lại
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/exams")}
              >
                Chọn đề khác
              </Button>
            </Space>
          </div>
        </Card>

        {/* Completion Time */}
        <div className="text-center mt-6">
          <Text className="text-gray-500">
            Hoàn thành lúc: {new Date(result.completedAt).toLocaleString("vi-VN")}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
