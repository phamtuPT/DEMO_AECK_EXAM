import React from "react";
import { Outlet } from "react-router-dom";
const ProfileLayout = () => {
  return (
    <section>
      <Outlet />
    </section>
  );
};

export default ProfileLayout;
