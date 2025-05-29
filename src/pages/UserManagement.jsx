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
  Statistic,
  Badge,
  Avatar,
  Tooltip,
  Divider,
  Alert
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  EyeOutlined,
  ReloadOutlined,
  CrownOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import mockDatabase from "../data/mockDatabase";
import apiService from "../services/api";
import storageService from "../services/storageService";
import AuthDebug from "../components/AuthDebug";

const { Option } = Select;
const { Title } = Typography;

const UserManagement = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [useServer, setUseServer] = useState(false);

  useEffect(() => {
    // Add delay to allow localStorage to be set after login
    const checkAuthWithDelay = () => {
      const token = localStorage.getItem('authToken');
      const userInfo = localStorage.getItem('userInfo');

      console.log('Auth check - Token:', token ? 'Present' : 'Missing');
      console.log('Auth check - UserInfo:', userInfo ? 'Present' : 'Missing');

      if (!token || !userInfo) {
        // Give it another chance after a short delay
        setTimeout(() => {
          const retryToken = localStorage.getItem('authToken');
          const retryUserInfo = localStorage.getItem('userInfo');

          if (!retryToken || !retryUserInfo) {
            message.error('Vui lòng đăng nhập để truy cập trang này!');
            navigate('/admin');
            return;
          }

          // Proceed with auth check
          proceedWithAuthCheck(retryToken, retryUserInfo);
        }, 500);
        return;
      }

      proceedWithAuthCheck(token, userInfo);
    };

    const proceedWithAuthCheck = (token, userInfo) => {
      try {
        const user = JSON.parse(userInfo);
        if (user.role !== 'admin') {
          message.error('Bạn không có quyền truy cập trang này!');
          navigate('/');
          return;
        }

        console.log('Auth check passed for admin:', user.name);
        checkStorageMode();
        loadUsers();
        loadStats();
      } catch (error) {
        console.error('Error parsing user info:', error);
        message.error('Dữ liệu đăng nhập không hợp lệ!');
        navigate('/admin');
        return;
      }
    };

    checkAuthWithDelay();
  }, [navigate]);

  const checkStorageMode = () => {
    setUseServer(storageService.getStorageMode() === 'server');
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      if (storageService.getStorageMode() === 'server') {
        const response = await apiService.getUsers();
        setUsers(response.users || []);
      } else {
        // Fallback to localStorage
        const allUsers = mockDatabase.getUsers();
        setUsers(allUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      message.error('Không thể tải danh sách người dùng');
      // Fallback to localStorage
      const allUsers = mockDatabase.getUsers();
      setUsers(allUsers);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      if (storageService.getStorageMode() === 'server') {
        const response = await apiService.getUserStats();
        setStats(response.stats || {});
      } else {
        // Calculate stats from localStorage
        const allUsers = mockDatabase.getUsers();
        const calculatedStats = {
          total: allUsers.length,
          active: allUsers.filter(u => u.isActive).length,
          inactive: allUsers.filter(u => !u.isActive).length,
          admins: allUsers.filter(u => u.role === 'admin').length,
          students: allUsers.filter(u => u.role === 'student').length,
          recentRegistrations: allUsers.filter(u => {
            const createdDate = new Date(u.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return createdDate > weekAgo;
          }).length
        };
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    // Set default values for new user
    form.setFieldsValue({
      role: "student",
      isActive: true
    });
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

  const handleDeleteUser = async (userId) => {
    try {
      if (storageService.getStorageMode() === 'server') {
        await apiService.deleteUser(userId);
        message.success("Xóa người dùng thành công!");
      } else {
        // Fallback to localStorage
        const allUsers = mockDatabase.getUsers();
        const updatedUsers = allUsers.filter(user => user.id !== userId);
        mockDatabase.saveUsers(updatedUsers);
        message.success("Xóa người dùng thành công!");
      }
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Không thể xóa người dùng');
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      if (storageService.getStorageMode() === 'server') {
        const user = users.find(u => u.id === userId);
        await apiService.updateUser(userId, { ...user, isActive });
        message.success(`${isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản thành công!`);
      } else {
        // Fallback to localStorage
        const allUsers = mockDatabase.getUsers();
        const userIndex = allUsers.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          allUsers[userIndex].isActive = isActive;
          mockDatabase.saveUsers(allUsers);
          message.success(`${isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản thành công!`);
        }
      }
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Error updating user status:', error);
      message.error('Không thể cập nhật trạng thái người dùng');
    }
  };

  const handleSubmit = async (values) => {
    console.log('Submitting user data:', values);
    console.log('Storage mode:', storageService.getStorageMode());

    // Debug authentication
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');
    console.log('Auth token:', token ? 'Present' : 'Missing');
    console.log('User info:', userInfo ? JSON.parse(userInfo) : 'Missing');

    try {
      if (editingUser) {
        // Update existing user
        if (storageService.getStorageMode() === 'server') {
          console.log('Updating user via API:', editingUser.id, values);
          const response = await apiService.updateUser(editingUser.id, values);
          console.log('Update response:', response);
          message.success("Cập nhật người dùng thành công!");
        } else {
          // Fallback to localStorage
          console.log('Updating user via localStorage');
          const allUsers = mockDatabase.getUsers();
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
        }
      } else {
        // Create new user
        if (storageService.getStorageMode() === 'server') {
          console.log('Creating user via API:', values);
          const response = await apiService.createUser(values);
          console.log('Create response:', response);
          message.success("Tạo người dùng thành công!");
        } else {
          // Fallback to localStorage
          console.log('Creating user via localStorage');
          const allUsers = mockDatabase.getUsers();

          // Check if email already exists
          const existingUser = allUsers.find(user => user.email === values.email);
          if (existingUser) {
            message.error("Email này đã được sử dụng!");
            return;
          }

          const newUser = {
            ...values,
            id: mockDatabase.getNextId('user'),
            password: values.password || "123456", // Default password
            createdAt: new Date().toISOString().split('T')[0],
            isActive: values.isActive !== undefined ? values.isActive : true,
          };
          allUsers.push(newUser);
          mockDatabase.saveUsers(allUsers);
          console.log('New user created:', newUser);
          message.success("Tạo người dùng thành công!");
        }
      }

      setModalVisible(false);
      form.resetFields();
      loadUsers();
      loadStats();
    } catch (error) {
      console.error('Error submitting user:', error);
      console.error('Error details:', error.response || error);

      // More specific error messages
      if (error.message && error.message.includes('Email already exists')) {
        message.error("Email này đã được sử dụng!");
      } else if (error.message && error.message.includes('Access token required')) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        // Redirect to login
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else if (error.message && error.message.includes('fetch')) {
        message.error("Không thể kết nối với server. Đang chuyển sang chế độ LocalStorage.");
        // Force localStorage mode and retry
        storageService.forceLocalStorageMode();
        handleSubmit(values);
      } else {
        message.error(error.message || "Có lỗi xảy ra khi tạo người dùng!");
      }
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Thông tin",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{
              backgroundColor: record.role === 'admin' ? '#ff4d4f' : '#1890ff',
              marginRight: 12
            }}
          />
          <div>
            <div className="font-medium flex items-center">
              {text}
              {record.role === 'admin' && (
                <CrownOutlined className="ml-2 text-yellow-500" />
              )}
            </div>
            <div className="text-xs text-gray-500">{record.email}</div>
            {record.createdAt && (
              <div className="text-xs text-gray-400">
                Tạo: {new Date(record.createdAt).toLocaleDateString('vi-VN')}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Học sinh', value: 'student' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => (
        <Tag
          color={role === "admin" ? "red" : "blue"}
          icon={role === "admin" ? <CrownOutlined /> : <UserOutlined />}
        >
          {role === "admin" ? "Quản trị viên" : "Học sinh"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Vô hiệu', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive, record) => (
        <div className="flex items-center">
          <Switch
            checked={isActive}
            onChange={(checked) => handleToggleStatus(record.id, checked)}
            size="small"
          />
          <span className="ml-2">
            {isActive ? (
              <Badge status="success" text="Hoạt động" />
            ) : (
              <Badge status="error" text="Vô hiệu" />
            )}
          </span>
        </div>
      ),
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

        {/* Debug Component - Remove in production */}
        {process.env.NODE_ENV === 'development' && <AuthDebug />}

        {/* Storage Status Alert */}
        <Alert
          message={useServer ? "Chế độ Server" : "Chế độ LocalStorage"}
          description={
            useServer
              ? "Đang sử dụng server API. Dữ liệu được lưu trên server và có thể truy cập từ nhiều trình duyệt."
              : "Hiện tại đang sử dụng localStorage. Dữ liệu chỉ có sẵn trên trình duyệt này."
          }
          type={useServer ? "success" : "warning"}
          showIcon
          className="mb-6"
          action={
            !useServer && (
              <Button
                size="small"
                onClick={() => {
                  storageService.reconnectToServer();
                  checkStorageMode();
                  loadUsers();
                  loadStats();
                }}
              >
                Thử kết nối Server
              </Button>
            )
          }
        />

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Tổng người dùng"
                value={stats.total || 0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={stats.active || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Học sinh"
                value={stats.students || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Quản trị viên"
                value={stats.admins || 0}
                prefix={<CrownOutlined />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Recent Registrations */}
        {stats.recentRegistrations > 0 && (
          <Alert
            message={`${stats.recentRegistrations} người dùng mới đăng ký trong 7 ngày qua`}
            type="info"
            showIcon
            className="mb-6"
          />
        )}

        {/* Users Table */}
        <Card
          title={
            <div className="flex items-center justify-between">
              <span>Danh sách người dùng ({users.length})</span>
              <div className="flex items-center space-x-2">
                <Tooltip title="Làm mới dữ liệu">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      loadUsers();
                      loadStats();
                    }}
                    size="small"
                  />
                </Tooltip>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateUser}
                  size="small"
                >
                  Thêm người dùng
                </Button>
              </div>
            </div>
          }
        >
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
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)" />
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
