import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Dropdown } from "antd";
import Footer from "../components/Footer";
import { useDispatch } from "react-redux";
import { logout } from "../store/Auth/thunk";
const { Header, Sider, Content } = Layout;
const HomeLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(true);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/dang-nhap");
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const items = [
    {
      key: "1",
      label: (
        <Link
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2"
          to={"/dashboard"}
        >
          <DashboardOutlined />
          <p className="m-0">Dashboard</p>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link
          onClick={() => navigate("/tai-khoan")}
          className="flex items-center gap-2"
          to={"/tai-khoan"}
        >
          <UserOutlined />
          <p className="m-0">Tài khoản</p>
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link
          onClick={handleLogout}
          className="flex items-center gap-2"
          to={"/dang-nhap"}
        >
          <LogoutOutlined />
          <p className="m-0">Đăng xuất</p>
        </Link>
      ),
    },
  ];
  return (
    <Layout className="min-h-screen">
      <Sider
        className="bg-white border-r border-[#f0f0f0] relative"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="h-[64px] flex items-center border-b border-[#f0f0f0]">
          <img
            className={clsx(`${collapsed ? "hidden" : "block m-4 h-8"}`)}
            src={require("../assets/logo-short.svg").default}
            alt="logo-short"
          />
          <img
            className={clsx(`${collapsed ? "block m-4 h-8" : "hidden"}`)}
            src={require("../assets/logo-square.svg").default}
            alt="logo-square"
          />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: (
                <Link to={"/dashboard"}>
                  <DashboardOutlined />
                </Link>
              ),
              label: "Dashboard",
            },
            {
              key: "2",
              icon: (
                <Link to={"/dang-ky-thi"}>
                  <FileTextOutlined />
                </Link>
              ),
              label: "Bài thi Đánh giá tư duy - TSA",
            },
            {
              key: "3",
              icon: (
                <Link to={"/tai-khoan"}>
                  <UserOutlined />
                </Link>
              ),
              label: "Tài khoản",
            },
            {
              key: "4",
              icon: <QuestionCircleOutlined />,
              label: "Câu hỏi thường gặp",
            },
          ]}
        />
        <Footer className={collapsed ? "hidden" : "absolute bottom-2"} />
      </Sider>
      <Layout>
        <Header className=" bg-white p-0 flex items-center justify-between border-b border-[#f0f0f0]">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
            className="hover:bg-white"
          />
          <div className="flex items-center justify-center text-[#8c8c8c] ">
            <div className="px-5 cursor-pointer after:transition-colors after:duration-300 after:border-[#f0f0f0] after:hover:border-primary relative after:content-[''] after:block after:w-4 after:border-b after:absolute after:bottom-0">
              <UsergroupAddOutlined className="text-[16px] " />
            </div>
            <div className="px-5 cursor-pointer after:transition-colors after:duration-300 after:border-[#f0f0f0] after:hover:border-primary relative after:content-[''] after:block after:w-4 after:border-b after:absolute after:bottom-0">
              <BellOutlined className="text-[16px] " />
            </div>

            <Dropdown
              menu={{
                items,
              }}
              placement="bottom"
            >
              <div className="flex items-center px-5 cursor-pointer border-b border-[#f0f0f0] ">
                <img
                  className="w-[32px] h-[32px] object-cover block mr-1"
                  src={require("../assets/userAvateDefault.png")}
                  alt="userAvatar"
                />
                <p className="m-0">demo_account@gmail.com</p>
                <DownOutlined className="text-[12px] mt-1" />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "8px 24px",
            padding: "12px 24px",
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default HomeLayout;
