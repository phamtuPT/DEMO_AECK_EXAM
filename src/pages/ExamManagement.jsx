import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Popconfirm,
  message,
  Row,
  Col,
  Select,
  Input,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { getExams, deleteExam } from "../store/Exam/thunk/examThunk";

const { Option } = Select;
const { Search } = Input;
const { Title } = Typography;

const ExamManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const exams = useSelector((state) => state.examManagementReducer.exams);
  const loading = useSelector((state) => state.examManagementReducer.loading.read);
  const deleteLoading = useSelector((state) => state.examManagementReducer.loading.delete);

  const [filters, setFilters] = useState({
    status: "",
    difficulty: "",
    subject: "",
    search: "",
  });

  useEffect(() => {
    dispatch(getExams());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(deleteExam(id));
      if (result.success) {
        message.success("Xóa đề thi thành công!");
        dispatch(getExams()); // Refresh list
      } else {
        message.error(result.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa đề thi");
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    dispatch(getExams(newFilters));
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "green",
      draft: "orange",
      archived: "default",
    };
    return colors[status] || "default";
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: "Hoạt động",
      draft: "Bản nháp",
      archived: "Lưu trữ",
    };
    return labels[status] || status;
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

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
      mixed: "Hỗn hợp",
    };
    return labels[difficulty] || difficulty;
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tên đề thi",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500 mt-1">
            {record.description?.substring(0, 50)}...
          </div>
        </div>
      ),
    },
    {
      title: "Thông tin",
      key: "info",
      render: (_, record) => (
        <div className="text-sm">
          <div>⏱️ {record.duration} phút</div>
          <div>📝 {record.totalQuestions} câu</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
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
      title: "Phần thi",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <Tag color="blue">
          {getSubjectLabel(subject)}
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
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/exams/${record.id}`)}
            title="Xem chi tiết"
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/exams/${record.id}/edit`)}
            title="Chỉnh sửa"
          />
          <Button
            size="small"
            icon={<PlayCircleOutlined />}
            type="primary"
            onClick={() => navigate(`/exam/${record.id}`)}
            title="Thi thử"
          />
          <Popconfirm
            title="Xóa đề thi"
            description="Bạn có chắc chắn muốn xóa đề thi này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={deleteLoading}
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Filter exams based on search
  const filteredExams = exams.filter(exam => {
    if (filters.search) {
      return exam.title.toLowerCase().includes(filters.search.toLowerCase()) ||
             exam.description?.toLowerCase().includes(filters.search.toLowerCase());
    }
    return true;
  });

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
                Quản lý đề thi
              </Title>
            </div>
            <Link to="/admin/exams/create">
              <Button type="primary" icon={<PlusOutlined />} size="large">
                Tạo đề thi mới
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Search
                placeholder="Tìm kiếm đề thi..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Trạng thái"
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                allowClear
                className="w-full"
              >
                <Option value="active">Hoạt động</Option>
                <Option value="draft">Bản nháp</Option>
                <Option value="archived">Lưu trữ</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Độ khó"
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
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Phần thi"
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
          </Row>
        </Card>

        {/* Table */}
        <Card title={`Danh sách đề thi (${filteredExams.length})`}>
          <Table
            columns={columns}
            dataSource={filteredExams}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} đề thi`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default ExamManagement;
