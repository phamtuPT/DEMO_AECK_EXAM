import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Dropdown, Avatar } from "antd";
import { logout } from "../store/Auth/thunk";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const userRole = useSelector((state) => state.authReducer.userRole);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  const dropdownItems = [
    {
      key: "1",
      label: (
        <Link to="/admin/profile" className="flex items-center gap-2">
          <UserOutlined />
          <span>Hồ sơ Admin</span>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/admin/settings" className="flex items-center gap-2">
          <SettingOutlined />
          <span>Cài đặt</span>
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <div onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
          <LogoutOutlined />
          <span>Đăng xuất</span>
        </div>
      ),
    },
  ];

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <QuestionCircleOutlined />,
      label: "Quản lý câu hỏi",
      children: [
        {
          key: "2-1",
          label: <Link to="/admin/questions">Tất cả câu hỏi</Link>,
        },
        {
          key: "2-2",
          label: <Link to="/admin/questions/create">Thêm câu hỏi</Link>,
        },
        {
          key: "2-3",
          label: <Link to="/admin/question-banks">Ngân hàng câu hỏi</Link>,
        },
      ],
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: "Quản lý đề thi",
      children: [
        {
          key: "3-1",
          label: <Link to="/admin/exams">Tất cả đề thi</Link>,
        },
        {
          key: "3-2",
          label: <Link to="/admin/exams/create">Tạo đề thi</Link>,
        },
      ],
    },
    {
      key: "4",
      icon: <UserOutlined />,
      label: "Quản lý người dùng",
      children: [
        {
          key: "4-1",
          label: <Link to="/admin/users">Tất cả người dùng</Link>,
        },
        {
          key: "4-2",
          label: <Link to="/admin/users/students">Thí sinh</Link>,
        },
        {
          key: "4-3",
          label: <Link to="/admin/users/teachers">Giáo viên</Link>,
        },
      ],
    },
    {
      key: "5",
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Cài đặt hệ thống</Link>,
    },
  ];

  // Check if user is admin
  if (userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <SafetyOutlined className="text-6xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Truy cập bị từ chối
          </h1>
          <p className="text-gray-600 mb-4">
            Bạn không có quyền truy cập vào khu vực admin
          </p>
          <Button type="primary" onClick={() => navigate("/dang-nhap")}>
            Quay lại đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bg-white border-r border-gray-200"
        width={250}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          {collapsed ? (
            <SafetyOutlined className="text-2xl text-blue-600" />
          ) : (
            <div className="flex items-center space-x-2">
              <SafetyOutlined className="text-2xl text-blue-600" />
              <span className="text-lg font-bold text-gray-900">TSA Admin</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["2", "3", "4"]}
          items={menuItems}
          className="border-none"
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header className="bg-white px-4 border-b border-gray-200 flex items-center justify-between">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-16 h-16"
          />

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Chào mừng, <strong>{userInfo?.name || userInfo?.email}</strong>
            </span>

            <Dropdown
              menu={{ items: dropdownItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded">
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  className="bg-blue-600"
                />
                <DownOutlined className="text-xs" />
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
