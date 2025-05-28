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
  Table,
  Statistic,
  Switch,
  message,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  SettingOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getExams, deleteExam, updateExam } from "../store/Exam/thunk/examThunk";
import { getQuestions } from "../store/Question/thunk";
import LaTeXRenderer from "../components/LaTeXRenderer";

const { Title, Text, Paragraph } = Typography;

const ExamDetail = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const exams = useSelector((state) => state.examManagementReducer.exams);
  const questions = useSelector((state) => state.questionReducer.questions);
  const loading = useSelector((state) => state.examManagementReducer.loading.read);

  const [exam, setExam] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);

  useEffect(() => {
    dispatch(getExams());
    dispatch(getQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (exams.length > 0 && questions.length > 0) {
      const foundExam = exams.find(e => e.id === parseInt(examId));
      if (foundExam) {
        setExam(foundExam);
        
        // Get questions for this exam
        const examQuestionList = foundExam.questionIds
          .map(qId => questions.find(q => q.id === qId))
          .filter(q => q !== undefined);
        setExamQuestions(examQuestionList);
      }
    }
  }, [exams, questions, examId]);

  const getStatusColor = (status) => {
    const colors = { active: "green", draft: "orange", archived: "default" };
    return colors[status] || "default";
  };

  const getStatusLabel = (status) => {
    const labels = { active: "Hoạt động", draft: "Bản nháp", archived: "Lưu trữ" };
    return labels[status] || status;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = { easy: "green", medium: "orange", hard: "red", mixed: "purple" };
    return colors[difficulty] || "default";
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = { easy: "Dễ", medium: "Trung bình", hard: "Khó", mixed: "Hỗn hợp" };
    return labels[difficulty] || difficulty;
  };

  const getSubjectLabel = (subject) => {
    const labels = {
      math_thinking: "Tư duy Toán học",
      reading_thinking: "Tư duy Đọc hiểu", 
      science_thinking: "Tư duy Khoa học",
      mixed: "Hỗn hợp"
    };
    return labels[subject] || subject;
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      SingleAnswer: "Một đáp án",
      MultipleAnswers: "Nhiều đáp án",
      TrueFalse: "Đúng/Sai",
      ConstructedResponse: "Tự luận"
    };
    return labels[type] || type;
  };

  const handleStatusChange = async (checked) => {
    const newStatus = checked ? "active" : "draft";
    try {
      const result = await dispatch(updateExam(exam.id, { status: newStatus }));
      if (result.success) {
        setExam(prev => ({ ...prev, status: newStatus }));
        message.success(`Đã ${checked ? 'kích hoạt' : 'tạm dừng'} đề thi`);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Xóa đề thi",
      content: "Bạn có chắc chắn muốn xóa đề thi này? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          const result = await dispatch(deleteExam(exam.id));
          if (result.success) {
            message.success("Xóa đề thi thành công!");
            navigate("/admin/exams");
          }
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa đề thi");
        }
      }
    });
  };

  const questionColumns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Câu hỏi",
      dataIndex: "question",
      key: "question",
      render: (text) => (
        <div className="max-w-md">
          <LaTeXRenderer>{text.length > 100 ? text.substring(0, 100) + "..." : text}</LaTeXRenderer>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color="blue">{getQuestionTypeLabel(type)}</Tag>
      ),
    },
    {
      title: "Độ khó",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (difficulty) => (
        <Tag color={getDifficultyColor(difficulty)}>
          {getDifficultyLabel(difficulty)}
        </Tag>
      ),
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
          Xem
        </Button>
      ),
    },
  ];

  if (loading || !exam) {
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/exams")}
              >
                Quay lại
              </Button>
              <div>
                <Title level={2} className="mb-2">{exam.title}</Title>
                <div className="flex items-center space-x-4">
                  <Tag color={getStatusColor(exam.status)}>
                    {getStatusLabel(exam.status)}
                  </Tag>
                  <Tag color={getDifficultyColor(exam.difficulty)}>
                    {getDifficultyLabel(exam.difficulty)}
                  </Tag>
                  <Tag color="blue">
                    {getSubjectLabel(exam.subject)}
                  </Tag>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Text>Trạng thái:</Text>
                <Switch
                  checked={exam.status === "active"}
                  onChange={handleStatusChange}
                  checkedChildren="Hoạt động"
                  unCheckedChildren="Tạm dừng"
                />
              </div>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => navigate(`/exam/${exam.id}`)}
              >
                Thi thử
              </Button>
              <Button
                icon={<EditOutlined />}
                onClick={() => navigate(`/admin/exams/${exam.id}/edit`)}
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
          {/* Left Column - Basic Info */}
          <Col xs={24} lg={16}>
            {/* Description */}
            <Card title="Mô tả đề thi" className="mb-6">
              <Paragraph>{exam.description}</Paragraph>
            </Card>

            {/* Questions List */}
            <Card title={`Danh sách câu hỏi (${examQuestions.length} câu)`}>
              <Table
                columns={questionColumns}
                dataSource={examQuestions}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} câu hỏi`,
                }}
                scroll={{ x: 800 }}
              />
            </Card>
          </Col>

          {/* Right Column - Stats & Settings */}
          <Col xs={24} lg={8}>
            {/* Statistics */}
            <Card title="Thống kê" className="mb-6">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Thời gian"
                    value={exam.duration}
                    suffix="phút"
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Số câu hỏi"
                    value={exam.totalQuestions}
                    prefix={<FileTextOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Lượt thi"
                    value={Math.floor(Math.random() * 100)}
                    prefix={<UserOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Điểm TB"
                    value={Math.floor(Math.random() * 40) + 60}
                    suffix="/100"
                  />
                </Col>
              </Row>
            </Card>

            {/* Settings */}
            <Card title="Cài đặt đề thi" icon={<SettingOutlined />}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Text>Trộn thứ tự câu hỏi</Text>
                  <Tag color={exam.settings?.shuffleQuestions ? "green" : "red"}>
                    {exam.settings?.shuffleQuestions ? "Có" : "Không"}
                  </Tag>
                </div>
                <Divider className="my-3" />
                
                <div className="flex justify-between items-center">
                  <Text>Hiển thị kết quả</Text>
                  <Tag color={exam.settings?.showResults ? "green" : "red"}>
                    {exam.settings?.showResults ? "Có" : "Không"}
                  </Tag>
                </div>
                <Divider className="my-3" />
                
                <div className="flex justify-between items-center">
                  <Text>Cho phép xem lại</Text>
                  <Tag color={exam.settings?.allowReview ? "green" : "red"}>
                    {exam.settings?.allowReview ? "Có" : "Không"}
                  </Tag>
                </div>
                <Divider className="my-3" />
                
                <div className="flex justify-between items-center">
                  <Text>Điểm đạt</Text>
                  <Tag color="blue">{exam.settings?.passingScore || 60}%</Tag>
                </div>
              </div>
            </Card>

            {/* Metadata */}
            <Card title="Thông tin khác" className="mt-6">
              <div className="space-y-3">
                <div>
                  <Text strong>Ngày tạo:</Text>
                  <br />
                  <Text>{exam.createdAt}</Text>
                </div>
                <div>
                  <Text strong>Người tạo:</Text>
                  <br />
                  <Text>{exam.createdBy}</Text>
                </div>
                {exam.updatedAt && (
                  <div>
                    <Text strong>Cập nhật lần cuối:</Text>
                    <br />
                    <Text>{exam.updatedAt}</Text>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ExamDetail;
