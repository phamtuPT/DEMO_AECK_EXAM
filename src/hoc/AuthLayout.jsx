import React from "react";
import { Outlet } from "react-router-dom";
import Background from "../assets/bg-page-login.png";
import { ReactComponent as LogoFull } from "../assets/logo-full.svg";

const AuthLayout = () => {
  return (
    <section
      className=" h-full min-h-screen w-full bg-center bg-no-repeat bg-cover flex justify-center"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="container-custom mt-20 justify-center relative flex">
        <div className="ml-[15px] mr-[15px] w-full h-full ">
          <div className="flex justify-center flex-col w-full ">
            <div className=" flex justify-center ">
              <LogoFull className=" my-6 max-w-[90%] max-h-[32px]" />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
