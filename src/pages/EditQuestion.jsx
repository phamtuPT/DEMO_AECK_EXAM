import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Radio,
  Checkbox,
  Typography,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { getQuestions, updateQuestion } from "../store/Question/thunk";
import LaTeXEditor from "../components/LaTeXEditor";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const EditQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  const loading = useSelector((state) => state.questionReducer.loading.update);
  const questions = useSelector((state) => state.questionReducer.questions);
  
  const [question, setQuestion] = useState(null);
  const [questionType, setQuestionType] = useState("SingleAnswer");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState({
    a: "",
    b: "",
    c: "",
    d: ""
  });
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    dispatch(getQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (questions.length > 0) {
      const foundQuestion = questions.find(q => q.id === parseInt(questionId));
      if (foundQuestion) {
        setQuestion(foundQuestion);
        setQuestionType(foundQuestion.type);
        setQuestionText(foundQuestion.question);
        setOptions(foundQuestion.options || { a: "", b: "", c: "", d: "" });
        setExplanation(foundQuestion.explanation || "");
        
        // Set form values
        form.setFieldsValue({
          type: foundQuestion.type,
          difficulty: foundQuestion.difficulty,
          subject: foundQuestion.subject,
          correctAnswer: foundQuestion.correctAnswer,
        });
      } else {
        message.error("Không tìm thấy câu hỏi!");
        navigate("/admin/dashboard");
      }
    }
  }, [questions, questionId, form, navigate]);

  const questionTypes = [
    { value: "SingleAnswer", label: "Một đáp án" },
    { value: "MultipleAnswers", label: "Nhiều đáp án" },
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
      let questionData = {
        ...values,
        question: questionText,
        explanation: explanation,
      };

      // Add options for non-constructed response questions
      if (questionType !== "ConstructedResponse") {
        questionData.options = options;
      }

      const result = await dispatch(updateQuestion(question.id, questionData));
      
      if (result.success) {
        message.success("Cập nhật câu hỏi thành công!");
        navigate(`/admin/questions/${question.id}`);
      } else {
        message.error(result.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật câu hỏi");
    }
  };

  const renderCorrectAnswerField = () => {
    if (questionType === "SingleAnswer") {
      return (
        <Form.Item
          label="Đáp án đúng"
          name="correctAnswer"
          rules={[{ required: true, message: "Vui lòng chọn đáp án đúng!" }]}
        >
          <Radio.Group>
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
            <Radio value="c">C</Radio>
            <Radio value="d">D</Radio>
          </Radio.Group>
        </Form.Item>
      );
    }

    if (questionType === "MultipleAnswers") {
      return (
        <Form.Item
          label="Đáp án đúng (có thể chọn nhiều)"
          name="correctAnswer"
          rules={[{ required: true, message: "Vui lòng chọn ít nhất một đáp án đúng!" }]}
        >
          <Checkbox.Group>
            <Checkbox value="a">A</Checkbox>
            <Checkbox value="b">B</Checkbox>
            <Checkbox value="c">C</Checkbox>
            <Checkbox value="d">D</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      );
    }

    if (questionType === "TrueFalse") {
      return (
        <Form.Item
          label="Đáp án đúng"
          name="correctAnswer"
          rules={[{ required: true, message: "Vui lòng chọn đáp án đúng!" }]}
        >
          <Radio.Group>
            <Radio value="true">Đúng</Radio>
            <Radio value="false">Sai</Radio>
          </Radio.Group>
        </Form.Item>
      );
    }

    if (questionType === "ConstructedResponse") {
      return (
        <Form.Item
          label="Đáp án mẫu"
          name="correctAnswer"
          rules={[{ required: true, message: "Vui lòng nhập đáp án mẫu!" }]}
        >
          <LaTeXEditor
            value={form.getFieldValue("correctAnswer") || ""}
            onChange={(value) => form.setFieldsValue({ correctAnswer: value })}
            placeholder="Nhập đáp án mẫu (hỗ trợ LaTeX)"
          />
        </Form.Item>
      );
    }

    return null;
  };

  if (!question) {
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(`/admin/questions/${question.id}`)}
              >
                Quay lại
              </Button>
              <Title level={2} className="mb-0">
                Chỉnh sửa câu hỏi #{question.id}
              </Title>
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={[24, 24]}>
            {/* Left Column - Question Content */}
            <Col xs={24} lg={16}>
              <Card title="Nội dung câu hỏi" className="mb-6">
                <Form.Item
                  label="Câu hỏi"
                  required
                  rules={[{ required: true, message: "Vui lòng nhập câu hỏi!" }]}
                >
                  <LaTeXEditor
                    value={questionText}
                    onChange={setQuestionText}
                    placeholder="Nhập nội dung câu hỏi (hỗ trợ LaTeX)"
                  />
                </Form.Item>

                {/* Options for non-constructed response questions */}
                {questionType !== "ConstructedResponse" && questionType !== "TrueFalse" && (
                  <div className="space-y-4">
                    <Title level={4}>Các lựa chọn:</Title>
                    {Object.entries(options).map(([key, value]) => (
                      <Form.Item
                        key={key}
                        label={`Lựa chọn ${key.toUpperCase()}`}
                        required
                      >
                        <LaTeXEditor
                          value={value}
                          onChange={(val) => handleOptionChange(key, val)}
                          placeholder={`Nhập lựa chọn ${key.toUpperCase()} (hỗ trợ LaTeX)`}
                        />
                      </Form.Item>
                    ))}
                  </div>
                )}

                {/* Correct Answer */}
                {renderCorrectAnswerField()}

                {/* Explanation */}
                <Form.Item label="Giải thích (tùy chọn)">
                  <LaTeXEditor
                    value={explanation}
                    onChange={setExplanation}
                    placeholder="Nhập giải thích cho câu hỏi (hỗ trợ LaTeX)"
                  />
                </Form.Item>
              </Card>
            </Col>

            {/* Right Column - Settings */}
            <Col xs={24} lg={8}>
              <Card title="Cài đặt câu hỏi" className="h-full">
                <Form.Item
                  label="Loại câu hỏi"
                  name="type"
                  rules={[{ required: true, message: "Vui lòng chọn loại câu hỏi!" }]}
                >
                  <Select 
                    placeholder="Chọn loại câu hỏi"
                    onChange={setQuestionType}
                  >
                    {questionTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

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
              </Card>
            </Col>
          </Row>

          {/* Submit */}
          <Card className="mt-6">
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => navigate(`/admin/questions/${question.id}`)}
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
              >
                Cập nhật câu hỏi
              </Button>
            </div>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default EditQuestion;
