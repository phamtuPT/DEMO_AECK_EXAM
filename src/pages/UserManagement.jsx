import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Typography,
  Switch,
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import mockDatabase from "../data/mockDatabase";

const { Option } = Select;
const { Title } = Typography;

const UserManagement = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    setTimeout(() => {
      const allUsers = mockDatabase.getUsers();
      setUsers(allUsers);
      setLoading(false);
    }, 500);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setModalVisible(true);
  };

  const handleDeleteUser = (userId) => {
    const allUsers = mockDatabase.getUsers();
    const updatedUsers = allUsers.filter(user => user.id !== userId);
    mockDatabase.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    message.success("Xóa người dùng thành công!");
  };

  const handleToggleStatus = (userId, isActive) => {
    const allUsers = mockDatabase.getUsers();
    const userIndex = allUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      allUsers[userIndex].isActive = isActive;
      mockDatabase.saveUsers(allUsers);
      setUsers([...allUsers]);
      message.success(`${isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản thành công!`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const allUsers = mockDatabase.getUsers();
      
      if (editingUser) {
        // Update existing user
        const userIndex = allUsers.findIndex(user => user.id === editingUser.id);
        if (userIndex !== -1) {
          allUsers[userIndex] = {
            ...allUsers[userIndex],
            ...values,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          mockDatabase.saveUsers(allUsers);
          message.success("Cập nhật người dùng thành công!");
        }
      } else {
        // Create new user
        const newUser = {
          ...values,
          id: mockDatabase.getNextId('user'),
          password: values.password || "123456", // Default password
          createdAt: new Date().toISOString().split('T')[0],
          isActive: values.isActive !== undefined ? values.isActive : true,
        };
        allUsers.push(newUser);
        mockDatabase.saveUsers(allUsers);
        message.success("Tạo người dùng thành công!");
      }
      
      setUsers([...allUsers]);
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2 text-blue-500" />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role === "admin" ? "Quản trị viên" : "Học sinh"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Vô hiệu"
        />
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
            onClick={() => {
              Modal.info({
                title: "Thông tin người dùng",
                content: (
                  <div>
                    <p><strong>ID:</strong> {record.id}</p>
                    <p><strong>Tên:</strong> {record.name}</p>
                    <p><strong>Email:</strong> {record.email}</p>
                    <p><strong>Vai trò:</strong> {record.role === "admin" ? "Quản trị viên" : "Học sinh"}</p>
                    <p><strong>Trạng thái:</strong> {record.isActive ? "Hoạt động" : "Vô hiệu"}</p>
                    <p><strong>Ngày tạo:</strong> {record.createdAt}</p>
                    {record.updatedAt && <p><strong>Cập nhật:</strong> {record.updatedAt}</p>}
                  </div>
                ),
              });
            }}
          >
            Xem
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Sửa
          </Button>
          {record.role !== "admin" && (
            <Popconfirm
              title="Xóa người dùng"
              description="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
              >
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    students: users.filter(u => u.role === "student").length,
    admins: users.filter(u => u.role === "admin").length,
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
                Quản lý người dùng
              </Title>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateUser}
              size="large"
            >
              Thêm người dùng
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={6}>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-gray-600">Tổng người dùng</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-gray-600">Đang hoạt động</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.students}</div>
                <div className="text-gray-600">Học sinh</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
                <div className="text-gray-600">Quản trị viên</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Users Table */}
        <Card title={`Danh sách người dùng (${users.length})`}>
          <Table
            columns={columns}
            dataSource={users}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} người dùng`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              role: "student",
              isActive: true,
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên"
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                  <Input placeholder="Nhập tên người dùng" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" }
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </Col>
            </Row>

            {!editingUser && (
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            )}

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Vai trò"
                  name="role"
                  rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
                >
                  <Select placeholder="Chọn vai trò">
                    <Option value="student">Học sinh</Option>
                    <Option value="admin">Quản trị viên</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Trạng thái"
                  name="isActive"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Hoạt động" unCheckedChildren="Vô hiệu" />
                </Form.Item>
              </Col>
            </Row>

            <div className="flex justify-end space-x-4">
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
