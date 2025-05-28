import React, { useState } from "react";
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
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, EyeOutlined } from "@ant-design/icons";
import LaTeXEditor from "../components/LaTeXEditor";
import LaTeXRenderer from "../components/LaTeXRenderer";
import { createQuestion } from "../store/Question/thunk";

const { Option } = Select;

const CreateQuestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const loading = useSelector((state) => state.questionReducer.loading.create);

  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("SingleAnswer");
  const [options, setOptions] = useState({
    a: "",
    b: "",
    c: "",
    d: ""
  });
  const [previewMode, setPreviewMode] = useState(false);

  const questionTypes = [
    { value: "SingleAnswer", label: "Một đáp án đúng" },
    { value: "MultipleAnswers", label: "Nhiều đáp án đúng" },
    { value: "TrueFalse", label: "Đúng/Sai" },
    { value: "ConstructedResponse", label: "Tự luận" },
  ];

  const difficulties = [
    { value: "easy", label: "Dễ" },
    { value: "medium", label: "Trung bình" },
    { value: "hard", label: "Khó" },
  ];

  const subjects = [
    { value: "math_thinking", label: "Tư duy Toán học" },
    { value: "reading_thinking", label: "Tư duy Đọc hiểu" },
    { value: "science_thinking", label: "Tư duy Khoa học" },
  ];

  const handleOptionChange = (key, value) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const onFinish = async (values) => {
    try {
      const questionData = {
        ...values,
        question: questionText,
        options: questionType === "SingleAnswer" || questionType === "MultipleAnswers" ? options : undefined,
        type: questionType,
      };

      const result = await dispatch(createQuestion(questionData));

      if (result.success) {
        message.success("Tạo câu hỏi thành công!");
        navigate("/admin/questions");
      } else {
        message.error(result.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo câu hỏi");
    }
  };

  const renderOptionsEditor = () => {
    if (questionType !== "SingleAnswer" && questionType !== "MultipleAnswers") {
      return null;
    }

    return (
      <Card title="Các lựa chọn" className="mb-6">
        <Row gutter={[16, 16]}>
          {Object.keys(options).map((key) => (
            <Col xs={24} lg={12} key={key}>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lựa chọn {key.toUpperCase()}:
                </label>
                <LaTeXEditor
                  value={options[key]}
                  onChange={(value) => handleOptionChange(key, value)}
                  placeholder={`Nhập nội dung lựa chọn ${key.toUpperCase()}`}
                  rows={2}
                  showPreview={false}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    );
  };

  const renderPreview = () => {
    if (!previewMode) return null;

    return (
      <Card title="Preview câu hỏi" className="mb-6 bg-blue-50">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Câu hỏi:</h3>
            <div className="p-3 bg-white rounded border">
              <LaTeXRenderer>{questionText}</LaTeXRenderer>
            </div>
          </div>

          {(questionType === "SingleAnswer" || questionType === "MultipleAnswers") && (
            <div>
              <h3 className="font-semibold mb-2">Các lựa chọn:</h3>
              <div className="space-y-2">
                {Object.entries(options).map(([key, value]) => (
                  <div key={key} className="flex items-start space-x-2 p-2 bg-white rounded border">
                    <span className="font-semibold text-blue-600">{key.toUpperCase()}.</span>
                    <div className="flex-1">
                      <LaTeXRenderer>{value}</LaTeXRenderer>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
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
              <h1 className="text-2xl font-bold text-gray-900">
                Tạo câu hỏi mới
              </h1>
            </div>
            <div className="flex space-x-2">
              <Button
                icon={<EyeOutlined />}
                onClick={() => setPreviewMode(!previewMode)}
                type={previewMode ? "primary" : "default"}
              >
                {previewMode ? "Ẩn Preview" : "Xem Preview"}
              </Button>
            </div>
          </div>
        </div>

        {/* Preview */}
        {renderPreview()}

        {/* Form */}
        <Card title="Thông tin câu hỏi">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              type: "SingleAnswer",
              difficulty: "medium",
              subject: "math_thinking",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  label="Loại câu hỏi"
                  name="type"
                  rules={[{ required: true, message: "Vui lòng chọn loại câu hỏi!" }]}
                >
                  <Select
                    value={questionType}
                    onChange={setQuestionType}
                    placeholder="Chọn loại câu hỏi"
                  >
                    {questionTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label="Độ khó"
                  name="difficulty"
                  rules={[{ required: true, message: "Vui lòng chọn độ khó!" }]}
                >
                  <Select placeholder="Chọn độ khó">
                    {difficulties.map((diff) => (
                      <Option key={diff.value} value={diff.value}>
                        {diff.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label="Phần thi"
                  name="subject"
                  rules={[{ required: true, message: "Vui lòng chọn phần thi!" }]}
                >
                  <Select placeholder="Chọn phần thi">
                    {subjects.map((subject) => (
                      <Option key={subject.value} value={subject.value}>
                        {subject.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            {/* Question Content */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Nội dung câu hỏi: <span className="text-red-500">*</span>
              </label>
              <LaTeXEditor
                value={questionText}
                onChange={setQuestionText}
                placeholder="Nhập nội dung câu hỏi (hỗ trợ LaTeX)"
                rows={4}
              />
            </div>

            {/* Options */}
            {renderOptionsEditor()}

            {/* Correct Answer */}
            {(questionType === "SingleAnswer" || questionType === "MultipleAnswers") && (
              <Form.Item
                label="Đáp án đúng"
                name="correctAnswer"
                rules={[{ required: true, message: "Vui lòng chọn đáp án đúng!" }]}
              >
                <Select
                  mode={questionType === "MultipleAnswers" ? "multiple" : undefined}
                  placeholder="Chọn đáp án đúng"
                >
                  <Option value="a">A</Option>
                  <Option value="b">B</Option>
                  <Option value="c">C</Option>
                  <Option value="d">D</Option>
                </Select>
              </Form.Item>
            )}

            <Divider />

            {/* Submit */}
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                >
                  Tạo câu hỏi
                </Button>
                <Button
                  onClick={() => navigate("/admin/dashboard")}
                  size="large"
                >
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateQuestion;
