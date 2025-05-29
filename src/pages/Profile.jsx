import React from "react";
import { useSelector } from "react-redux";
import { Tooltip, Card, Input, Button, Form } from "antd";
import userImg from "../assets/user.png";
import { FormOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { ReactComponent as AwardImg } from "../assets/icon-test-taker.svg";
import { ReactComponent as TodoImg } from "../assets/icon-test-taker-todo.svg";
const Profile = () => {
  // Get user info from Redux store
  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const isAuthenticated = useSelector((state) => state.authReducer.isLogin);

  // Display user info or fallback
  const displayEmail = userInfo?.email || "Thí sinh ẩn danh";
  const displayName = userInfo?.name || "Chưa cập nhật";
  const displayId = userInfo?.id || "N/A";

  const onFinish = (values) => {};
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <section>
      <div className="flex gap-10">
        <div className="bg-white w-1/4 rounded-[8px] shadow-examItem text-textAuth min-h-[10.5rem] text-center flex flex-col items-center p-6 text-[18px]">
          <img
            src={userImg}
            alt="user-image"
            className="w-[108px] h-[108px] object-cover"
          />
          <p className="mb-2">{displayEmail}</p>
          <div className="flex items-center">
            {" "}
            <Tooltip placement="top" title="Mã hồ sơ">
              <p className="mx-2 my-0">{displayId}</p>
            </Tooltip>
            <Tooltip placement="top" title="Sửa mã hồ sơ">
              <FormOutlined className="text-primary cursor-pointer" />
            </Tooltip>
          </div>
        </div>
        <div className="bg-white w-1/4 rounded-[8px] shadow-examItem text-textAuth min-h-[10.5rem] text-center flex flex-col items-center justify-around p-6 text-[18px]">
          <div className="w-full flex justify-end">
            <AwardImg />
          </div>
          <div className="w-full flex justify-start">
            <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center font-semibold bg-[#e6fffb] text-[#1c3664] border-[#e6fffb]">
              0
            </div>
          </div>
          <div className="w-full flex justify-start">Bài đã làm</div>
        </div>
        <div className="bg-white w-1/4 rounded-[8px] shadow-examItem text-textAuth min-h-[10.5rem] text-center flex flex-col items-center justify-around p-6 text-[18px]">
          <div className="w-full flex justify-end">
            <TodoImg />
          </div>
          <div className="w-full flex justify-start">
            <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center font-semibold bg-[#fff2e8] text-[#ff7a45] border-[#fff2e8]">
              0
            </div>
          </div>
          <div className="w-full flex justify-start">Bài cần làm</div>
        </div>
      </div>
      <div className="flex gap-10 mt-10 min-h-[300px] ">
        <Card
          title="Thông tin tài khoản"
          className="w-1/2 bg-white rounded-[8px] shadow-examItem text-textAuth"
        >
          <div className="flex justify-between items-center mb-6">
            <p className="m-0">Email:</p>
            <Input
              disabled
              value={displayEmail}
              className="min-h-[46px] w-9/12"
            />
          </div>
          <div className="flex justify-between items-center mb-6">
            <p className="m-0">Xác thực email:</p>
            <div
              className="min-h-[46px] w-9/12 text-start flex items-center"
            >
              <p className="m-0 mx-1">
                {isAuthenticated ? "Đã xác thực" : "Chưa xác thực"}
              </p>
              {isAuthenticated && <CheckCircleTwoTone />}
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <p className="m-0"></p>
            <div className=" w-9/12 text-start flex items-center">
              <Button className="bg-[#fae8e9] text-[#ce1628] border-none hover:bg-primary hover:text-white duration-300">
                Đổi mật khẩu
              </Button>
            </div>
          </div>
        </Card>
        <Card
          title="Thông tin cá nhân"
          className="w-1/2 bg-white rounded-[8px] shadow-examItem text-textAuth"
        >
          <Form
            className="profile-form"
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Họ tên"
              name="username"
              initialValue={displayName}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                placeholder="Điền đầy đủ theo họ tên trên CMND/CCCD"
                className="min-h-[46px]"
                defaultValue={displayName}
              />
            </Form.Item>
            <Form.Item
              label="Trường học"
              name="school"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input className="min-h-[46px]" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                type="number"
                className="min-h-[46px]"
                placeholder="Số điện thoại liên hệ"
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="Address"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input className="min-h-[46px]" />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 24,
              }}
            >
              <div className="flex justify-between">
                <div></div>
                <Button
                  className="text-white min-h-[46px] text-[18px] w-9/12 font-normal"
                  block
                  type="primary"
                  htmlType="submit"
                >
                  Cập nhập thông tin
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </section>
  );
};

export default Profile;
