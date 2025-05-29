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
  CloseCircleOutlined,
  LockOutlined,
  CopyOutlined
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
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);
  const [userPassword, setUserPassword] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showDecryptedPassword, setShowDecryptedPassword] = useState(false);
  const [mockOtpCode, setMockOtpCode] = useState('');
  const [isMockMode, setIsMockMode] = useState(false);

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

  const handleViewPassword = async (user) => {
    setSelectedUserForPassword(user);
    setUserPassword('Đang tải...');
    setPasswordModalVisible(true);
    setShowDecryptedPassword(false);

    try {
      console.log('Getting password for user:', user);

      if (useServer) {
        // For server mode, we need to get password from server
        console.log('Using server mode to get password');
        try {
          const response = await apiService.getUserPassword(user.id);
          console.log('Server password response:', response);

          if (response.success) {
            setUserPassword(response.password);
            message.success('Đã lấy mật khẩu mã hóa từ server');
          } else {
            throw new Error(response.error || 'Server error');
          }
        } catch (serverError) {
          console.log('Server password failed, trying localStorage:', serverError.message);
          message.warning('Server không khả dụng, sử dụng dữ liệu local');

          // Fallback to localStorage
          const allUsers = mockDatabase.getUsers();
          const foundUser = allUsers.find(u => u.id === user.id);
          setUserPassword(foundUser ? foundUser.password : 'Không tìm thấy');
        }
      } else {
        // For localStorage mode, get password directly
        console.log('Using localStorage mode to get password');
        const allUsers = mockDatabase.getUsers();
        const foundUser = allUsers.find(u => u.id === user.id);
        const password = foundUser ? foundUser.password : 'Không tìm thấy';
        console.log('Found password in localStorage:', password);
        setUserPassword(password);
        message.success('Đã lấy mật khẩu từ localStorage');
      }

    } catch (error) {
      console.error('Error getting user password:', error);
      message.error(`Có lỗi xảy ra khi lấy mật khẩu: ${error.message}`);
      setUserPassword('Lỗi khi lấy mật khẩu');
    }
  };

  const handleRequestOTP = async () => {
    setOtpLoading(true);
    try {
      const response = await apiService.requestPasswordOTP();
      if (response.success) {
        setOtpSent(true);
        setOtpModalVisible(true);
        setIsMockMode(response.mockMode || false);

        if (response.mockMode && response.otpCode) {
          setMockOtpCode(response.otpCode);
          message.success(`${response.message} - Mã OTP: ${response.otpCode}`);
        } else {
          message.success(response.message);
        }
      } else {
        message.error(response.error || 'Không thể gửi OTP');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      message.error('Có lỗi xảy ra khi gửi OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      message.error('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setOtpLoading(true);
    try {
      const response = await apiService.getUserPasswordWithOTP(selectedUserForPassword.id, otpCode);
      if (response.success) {
        setUserPassword(response.password);
        setShowDecryptedPassword(true);
        setOtpModalVisible(false);
        setOtpCode('');
        setOtpSent(false);
        message.success('Đã xác thực thành công! Hiển thị mật khẩu gốc.');
      } else {
        message.error(response.error || 'OTP không đúng');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      message.error('Có lỗi xảy ra khi xác thực OTP');
    } finally {
      setOtpLoading(false);
    }
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
            icon={<LockOutlined />}
            onClick={() => handleViewPassword(record)}
            type="dashed"
          >
            Mật khẩu
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

        {/* Password View Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <LockOutlined className="mr-2 text-orange-500" />
              Mật khẩu người dùng
            </div>
          }
          open={passwordModalVisible}
          onCancel={() => {
            setPasswordModalVisible(false);
            setSelectedUserForPassword(null);
            setUserPassword('');
          }}
          footer={[
            <Button
              key="copy"
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(userPassword);
                message.success('Đã sao chép mật khẩu!');
              }}
            >
              Sao chép
            </Button>,
            !showDecryptedPassword && useServer && (
              <Button
                key="decrypt"
                type="primary"
                danger
                icon={<LockOutlined />}
                onClick={handleRequestOTP}
                loading={otpLoading}
              >
                Xem mật khẩu gốc
              </Button>
            ),
            <Button
              key="close"
              onClick={() => {
                setPasswordModalVisible(false);
                setSelectedUserForPassword(null);
                setUserPassword('');
                setShowDecryptedPassword(false);
              }}
            >
              Đóng
            </Button>
          ].filter(Boolean)}
          width={500}
        >
          {selectedUserForPassword && (
            <div className="space-y-4">
              {/* User Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar size={40} className="bg-blue-500">
                    {selectedUserForPassword.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-800">{selectedUserForPassword.name}</h4>
                    <p className="text-sm text-gray-600">{selectedUserForPassword.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-600">
                    <strong>ID:</strong> {selectedUserForPassword.id}
                  </span>
                  <span className="text-gray-600">
                    <strong>Vai trò:</strong> {selectedUserForPassword.role === 'admin' ? 'Quản trị viên' : 'Học sinh'}
                  </span>
                </div>
              </div>

              {/* Security Warning */}
              <Alert
                message="Cảnh báo bảo mật"
                description="Thông tin mật khẩu này chỉ dành cho quản trị viên. Vui lòng không chia sẻ với người khác."
                type="warning"
                showIcon
                className="mb-4"
              />

              {/* Password Display */}
              <div className={`border rounded-lg p-4 ${showDecryptedPassword ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <label className={`text-sm font-medium ${showDecryptedPassword ? 'text-green-800' : 'text-red-800'}`}>
                        {showDecryptedPassword ? '🔓 Mật khẩu gốc:' : '🔒 Mật khẩu mã hóa:'}
                      </label>
                      {showDecryptedPassword && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          ✅ Đã xác thực OTP
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input.Password
                        value={userPassword}
                        readOnly
                        className={`font-mono ${showDecryptedPassword ? 'text-lg font-bold' : 'text-sm'}`}
                        placeholder="Đang tải..."
                        visibilityToggle={{
                          visible: true,
                          onVisibleChange: () => {}
                        }}
                      />
                      <Button
                        icon={<CopyOutlined />}
                        onClick={() => {
                          navigator.clipboard.writeText(userPassword);
                          message.success('Đã sao chép mật khẩu!');
                        }}
                        title="Sao chép mật khẩu"
                      />
                    </div>
                    {showDecryptedPassword && (
                      <p className="text-xs text-green-600 mt-2">
                        💡 Đây là mật khẩu gốc có thể sử dụng để đăng nhập
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <p><strong>Lưu ý:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Mật khẩu này được mã hóa trong hệ thống</li>
                  <li>Chỉ admin mới có quyền xem thông tin này</li>
                  <li>Vui lòng bảo mật thông tin này</li>
                </ul>
              </div>
            </div>
          )}
        </Modal>

        {/* OTP Verification Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <LockOutlined className="mr-2 text-blue-500" />
              Xác thực OTP
            </div>
          }
          open={otpModalVisible}
          onCancel={() => {
            setOtpModalVisible(false);
            setOtpCode('');
            setOtpSent(false);
            setMockOtpCode('');
            setIsMockMode(false);
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setOtpModalVisible(false);
                setOtpCode('');
                setOtpSent(false);
                setMockOtpCode('');
                setIsMockMode(false);
              }}
            >
              Hủy
            </Button>,
            <Button
              key="verify"
              type="primary"
              onClick={handleVerifyOTP}
              loading={otpLoading}
              disabled={!otpCode || otpCode.length !== 6}
            >
              Xác thực
            </Button>
          ]}
          width={500}
        >
          <div className="space-y-4">
            {/* OTP Info */}
            <div className={`p-4 rounded-lg border ${isMockMode ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isMockMode ? 'bg-orange-500' : 'bg-blue-500'}`}>
                  <span className="text-white text-xl">{isMockMode ? '🧪' : '📧'}</span>
                </div>
                <div>
                  <h4 className={`font-semibold ${isMockMode ? 'text-orange-800' : 'text-blue-800'}`}>
                    {isMockMode ? 'Demo Mode - Mã OTP đã tạo' : 'Mã OTP đã được gửi'}
                  </h4>
                  <p className={`text-sm ${isMockMode ? 'text-orange-600' : 'text-blue-600'}`}>
                    {isMockMode ? 'Console / Notification' : 'chuyenvienaeck@gmail.com'}
                  </p>
                </div>
              </div>
              <p className={`text-sm ${isMockMode ? 'text-orange-700' : 'text-blue-700'}`}>
                {isMockMode
                  ? 'Đây là chế độ demo. Mã OTP được hiển thị trực tiếp để test.'
                  : 'Vui lòng kiểm tra email và nhập mã xác thực 6 số để xem mật khẩu gốc.'
                }
              </p>

              {/* Demo OTP Display */}
              {isMockMode && mockOtpCode && (
                <div className="mt-3 p-3 bg-white border-2 border-dashed border-orange-300 rounded text-center">
                  <p className="text-xs text-orange-600 mb-1">Demo OTP Code:</p>
                  <p className="text-2xl font-mono font-bold text-orange-800 tracking-widest">
                    {mockOtpCode}
                  </p>
                  <p className="text-xs text-orange-500 mt-1">Copy mã này vào ô bên dưới</p>
                </div>
              )}
            </div>

            {/* Security Warning */}
            <Alert
              message="Bảo mật cao"
              description="Mã OTP có hiệu lực trong 5 phút và chỉ được sử dụng 1 lần. Tối đa 3 lần nhập sai."
              type="warning"
              showIcon
            />

            {/* OTP Input */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Nhập mã OTP (6 số):
                </label>
                {isMockMode && mockOtpCode && (
                  <Button
                    size="small"
                    type="link"
                    onClick={() => setOtpCode(mockOtpCode)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    Auto-fill
                  </Button>
                )}
              </div>
              <Input
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtpCode(value);
                }}
                placeholder="000000"
                className="text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                style={{ letterSpacing: '0.5em' }}
              />
              <p className="text-xs text-gray-500 mt-2">
                Chỉ nhập số, tối đa 6 ký tự
                {isMockMode && ' • Click "Auto-fill" để điền tự động'}
              </p>
            </div>

            {/* User Info */}
            {selectedUserForPassword && (
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm text-gray-600">
                  <strong>Xem mật khẩu cho:</strong> {selectedUserForPassword.name} ({selectedUserForPassword.email})
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <p><strong>Hướng dẫn:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Kiểm tra hộp thư đến của chuyenvienaeck@gmail.com</li>
                <li>Tìm email từ "AECK Security" với tiêu đề chứa "Mã xác thực"</li>
                <li>Nhập chính xác mã 6 số trong email</li>
                <li>Mã chỉ có hiệu lực trong 5 phút</li>
              </ul>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
