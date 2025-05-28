import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Button,
  Typography,
  Tag,
  Row,
  Col,
  Divider,
  Space,
  Radio,
  Checkbox,
  message,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getQuestions, deleteQuestion } from "../store/Question/thunk";
import LaTeXRenderer from "../components/LaTeXRenderer";

const { Title, Text, Paragraph } = Typography;

const QuestionDetail = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const questions = useSelector((state) => state.questionReducer.questions);
  const loading = useSelector((state) => state.questionReducer.loading.read);

  const [question, setQuestion] = useState(null);

  useEffect(() => {
    dispatch(getQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (questions.length > 0) {
      const foundQuestion = questions.find(q => q.id === parseInt(questionId));
      if (foundQuestion) {
        setQuestion(foundQuestion);
      } else {
        message.error("Không tìm thấy câu hỏi!");
        navigate("/admin/dashboard");
      }
    }
  }, [questions, questionId, navigate]);

  const getDifficultyColor = (difficulty) => {
    const colors = { easy: "green", medium: "orange", hard: "red" };
    return colors[difficulty] || "default";
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = { easy: "Dễ", medium: "Trung bình", hard: "Khó" };
    return labels[difficulty] || difficulty;
  };

  const getSubjectLabel = (subject) => {
    const labels = {
      math_thinking: "Tư duy Toán học",
      reading_thinking: "Tư duy Đọc hiểu",
      science_thinking: "Tư duy Khoa học"
    };
    return labels[subject] || subject;
  };

  const getTypeLabel = (type) => {
    const labels = {
      SingleAnswer: "Một đáp án",
      MultipleAnswers: "Nhiều đáp án",
      TrueFalse: "Đúng/Sai",
      ConstructedResponse: "Tự luận"
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      SingleAnswer: "blue",
      MultipleAnswers: "purple",
      TrueFalse: "orange",
      ConstructedResponse: "green"
    };
    return colors[type] || "default";
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Xóa câu hỏi",
      content: "Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          const result = await dispatch(deleteQuestion(question.id));
          if (result.success) {
            message.success("Xóa câu hỏi thành công!");
            navigate("/admin/dashboard");
          }
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa câu hỏi");
        }
      }
    });
  };

  const renderAnswerOptions = () => {
    if (!question.options) return null;

    if (question.type === "SingleAnswer") {
      return (
        <Radio.Group value={question.correctAnswer} disabled>
          <Space direction="vertical" className="w-full">
            {Object.entries(question.options).map(([key, value]) => (
              <Radio key={key} value={key} className="text-base">
                <div className="flex items-center">
                  <LaTeXRenderer>{key.toUpperCase()}. {value}</LaTeXRenderer>
                  {question.correctAnswer === key && (
                    <CheckCircleOutlined className="ml-2 text-green-500" />
                  )}
                </div>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      );
    }

    if (question.type === "MultipleAnswers") {
      const correctAnswers = Array.isArray(question.correctAnswer) 
        ? question.correctAnswer 
        : [question.correctAnswer];
      
      return (
        <Checkbox.Group value={correctAnswers} disabled>
          <Space direction="vertical" className="w-full">
            {Object.entries(question.options).map(([key, value]) => (
              <Checkbox key={key} value={key} className="text-base">
                <div className="flex items-center">
                  <LaTeXRenderer>{key.toUpperCase()}. {value}</LaTeXRenderer>
                  {correctAnswers.includes(key) && (
                    <CheckCircleOutlined className="ml-2 text-green-500" />
                  )}
                </div>
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      );
    }

    if (question.type === "TrueFalse") {
      return (
        <Radio.Group value={question.correctAnswer} disabled>
          <Space direction="vertical" className="w-full">
            <Radio value="true" className="text-base">
              <div className="flex items-center">
                Đúng
                {question.correctAnswer === "true" && (
                  <CheckCircleOutlined className="ml-2 text-green-500" />
                )}
              </div>
            </Radio>
            <Radio value="false" className="text-base">
              <div className="flex items-center">
                Sai
                {question.correctAnswer === "false" && (
                  <CheckCircleOutlined className="ml-2 text-green-500" />
                )}
              </div>
            </Radio>
          </Space>
        </Radio.Group>
      );
    }

    return null;
  };

  if (loading || !question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <Title level={3}>Đang tải...</Title>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/dashboard")}
              >
                Quay lại
              </Button>
              <div>
                <Title level={2} className="mb-2">Chi tiết câu hỏi #{question.id}</Title>
                <div className="flex items-center space-x-4">
                  <Tag color={getTypeColor(question.type)}>
                    {getTypeLabel(question.type)}
                  </Tag>
                  <Tag color={getDifficultyColor(question.difficulty)}>
                    {getDifficultyLabel(question.difficulty)}
                  </Tag>
                  <Tag color="blue">
                    {getSubjectLabel(question.subject)}
                  </Tag>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                icon={<EditOutlined />}
                onClick={() => navigate(`/admin/questions/${question.id}/edit`)}
              >
                Chỉnh sửa
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            {/* Question Content */}
            <Card title="Nội dung câu hỏi" className="mb-6">
              <div className="text-lg mb-6">
                <LaTeXRenderer>{question.question}</LaTeXRenderer>
              </div>
              
              {question.type !== "ConstructedResponse" && (
                <div>
                  <Title level={4} className="mb-4">Các lựa chọn:</Title>
                  {renderAnswerOptions()}
                </div>
              )}

              {question.type === "ConstructedResponse" && (
                <div>
                  <Title level={4} className="mb-4">Đáp án mẫu:</Title>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <LaTeXRenderer>{question.correctAnswer}</LaTeXRenderer>
                  </div>
                </div>
              )}
            </Card>

            {/* Explanation */}
            {question.explanation && (
              <Card title="Giải thích">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <LaTeXRenderer>{question.explanation}</LaTeXRenderer>
                </div>
              </Card>
            )}
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Metadata */}
            <Card title="Thông tin chi tiết" className="mb-6">
              <div className="space-y-4">
                <div>
                  <Text strong>ID:</Text>
                  <br />
                  <Text>#{question.id}</Text>
                </div>
                
                <Divider className="my-3" />
                
                <div>
                  <Text strong>Loại câu hỏi:</Text>
                  <br />
                  <Tag color={getTypeColor(question.type)}>
                    {getTypeLabel(question.type)}
                  </Tag>
                </div>
                
                <Divider className="my-3" />
                
                <div>
                  <Text strong>Độ khó:</Text>
                  <br />
                  <Tag color={getDifficultyColor(question.difficulty)}>
                    {getDifficultyLabel(question.difficulty)}
                  </Tag>
                </div>
                
                <Divider className="my-3" />
                
                <div>
                  <Text strong>Phần thi:</Text>
                  <br />
                  <Tag color="blue">
                    {getSubjectLabel(question.subject)}
                  </Tag>
                </div>
                
                <Divider className="my-3" />
                
                <div>
                  <Text strong>Ngày tạo:</Text>
                  <br />
                  <Text>{question.createdAt}</Text>
                </div>
                
                {question.updatedAt && (
                  <>
                    <Divider className="my-3" />
                    <div>
                      <Text strong>Cập nhật lần cuối:</Text>
                      <br />
                      <Text>{question.updatedAt}</Text>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Usage Stats */}
            <Card title="Thống kê sử dụng">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>Số đề thi sử dụng:</Text>
                  <Text strong>{Math.floor(Math.random() * 10) + 1}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Lượt trả lời:</Text>
                  <Text strong>{Math.floor(Math.random() * 100) + 50}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Tỷ lệ đúng:</Text>
                  <Text strong className="text-green-600">
                    {Math.floor(Math.random() * 40) + 60}%
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default QuestionDetail;
