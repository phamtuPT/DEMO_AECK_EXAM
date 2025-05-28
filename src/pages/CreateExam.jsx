import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  message,
  Space,
  Divider,
  InputNumber,
  Switch,
  Transfer,
  Typography,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, EyeOutlined } from "@ant-design/icons";
import { createExam } from "../store/Exam/thunk/examThunk";
import { getQuestions } from "../store/Question/thunk";
import LaTeXRenderer from "../components/LaTeXRenderer";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const CreateExam = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const loading = useSelector((state) => state.examManagementReducer.loading.create);
  const questions = useSelector((state) => state.questionReducer.questions);
  const questionsLoading = useSelector((state) => state.questionReducer.loading.read);

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [examSettings, setExamSettings] = useState({
    shuffleQuestions: true,
    showResults: true,
    allowReview: false,
    passingScore: 60,
  });

  useEffect(() => {
    dispatch(getQuestions());
  }, [dispatch]);

  const difficulties = [
    { value: "easy", label: "Dễ" },
    { value: "medium", label: "Trung bình" },
    { value: "hard", label: "Khó" },
    { value: "mixed", label: "Hỗn hợp" },
  ];

  const subjects = [
    { value: "math_thinking", label: "Tư duy Toán học" },
    { value: "reading_thinking", label: "Tư duy Đọc hiểu" },
    { value: "science_thinking", label: "Tư duy Khoa học" },
    { value: "mixed", label: "Hỗn hợp" },
  ];

  const statuses = [
    { value: "draft", label: "Bản nháp" },
    { value: "active", label: "Hoạt động" },
    { value: "archived", label: "Lưu trữ" },
  ];

  // Transform questions for Transfer component
  const questionDataSource = questions.map(q => ({
    key: q.id.toString(),
    title: q.question.length > 50 ? q.question.substring(0, 50) + "..." : q.question,
    description: `${q.type} - ${q.difficulty} - ${q.subject}`,
    question: q,
  }));

  const onFinish = async (values) => {
    try {
      const examData = {
        ...values,
        questionIds: selectedQuestions,
        settings: examSettings,
      };

      const result = await dispatch(createExam(examData));

      if (result.success) {
        message.success("Tạo đề thi thành công!");
        navigate("/admin/exams");
      } else {
        message.error(result.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo đề thi");
    }
  };

  const handleTransferChange = (targetKeys) => {
    setSelectedQuestions(targetKeys.map(key => parseInt(key)));
  };

  const renderQuestionItem = (item) => {
    const customLabel = (
      <div className="flex flex-col">
        <div className="font-medium">
          <LaTeXRenderer>{item.title}</LaTeXRenderer>
        </div>
        <div className="text-xs text-gray-500">{item.description}</div>
      </div>
    );
    return {
      label: customLabel,
      value: item.title,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
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
                Tạo đề thi mới
              </Title>
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: "draft",
            difficulty: "medium",
            subject: "mixed",
            duration: 90,
          }}
        >
          <Row gutter={[24, 24]}>
            {/* Left Column - Basic Info */}
            <Col xs={24} lg={12}>
              <Card title="Thông tin cơ bản" className="h-full">
                <Form.Item
                  label="Tên đề thi"
                  name="title"
                  rules={[{ required: true, message: "Vui lòng nhập tên đề thi!" }]}
                >
                  <Input placeholder="Nhập tên đề thi" size="large" />
                </Form.Item>

                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Nhập mô tả đề thi"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Thời gian (phút)"
                      name="duration"
                      rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
                    >
                      <InputNumber
                        min={1}
                        max={300}
                        className="w-full"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Trạng thái"
                      name="status"
                      rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                    >
                      <Select size="large">
                        {statuses.map((status) => (
                          <Option key={status.value} value={status.value}>
                            {status.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Độ khó"
                      name="difficulty"
                      rules={[{ required: true, message: "Vui lòng chọn độ khó!" }]}
                    >
                      <Select size="large">
                        {difficulties.map((diff) => (
                          <Option key={diff.value} value={diff.value}>
                            {diff.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Phần thi"
                      name="subject"
                      rules={[{ required: true, message: "Vui lòng chọn phần thi!" }]}
                    >
                      <Select size="large">
                        {subjects.map((subject) => (
                          <Option key={subject.value} value={subject.value}>
                            {subject.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Right Column - Settings */}
            <Col xs={24} lg={12}>
              <Card title="Cài đặt đề thi" className="h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Trộn thứ tự câu hỏi</span>
                    <Switch
                      checked={examSettings.shuffleQuestions}
                      onChange={(checked) =>
                        setExamSettings(prev => ({ ...prev, shuffleQuestions: checked }))
                      }
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Hiển thị kết quả</span>
                    <Switch
                      checked={examSettings.showResults}
                      onChange={(checked) =>
                        setExamSettings(prev => ({ ...prev, showResults: checked }))
                      }
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Cho phép xem lại</span>
                    <Switch
                      checked={examSettings.allowReview}
                      onChange={(checked) =>
                        setExamSettings(prev => ({ ...prev, allowReview: checked }))
                      }
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Điểm đạt (%)</span>
                    <InputNumber
                      min={0}
                      max={100}
                      value={examSettings.passingScore}
                      onChange={(value) =>
                        setExamSettings(prev => ({ ...prev, passingScore: value }))
                      }
                      className="w-20"
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Question Selection */}
          <Card title={`Chọn câu hỏi (${selectedQuestions.length} câu đã chọn)`} className="mt-6">
            <Transfer
              dataSource={questionDataSource}
              targetKeys={selectedQuestions.map(id => id.toString())}
              onChange={handleTransferChange}
              render={renderQuestionItem}
              titles={['Ngân hàng câu hỏi', 'Câu hỏi đã chọn']}
              listStyle={{
                width: '100%',
                height: 400,
              }}
              showSearch
              searchPlaceholder="Tìm kiếm câu hỏi..."
              loading={questionsLoading}
            />
          </Card>

          {/* Submit */}
          <Card className="mt-6">
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => navigate("/admin/dashboard")}
                size="large"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
                disabled={selectedQuestions.length === 0}
              >
                Tạo đề thi
              </Button>
            </div>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default CreateExam;
