import React from "react";
import clsx from "clsx";
const Footer = ({ className }) => {
  return (
    <footer className={clsx("text-center mt-5 text-[12px]", className)}>
      <p>
        Copyright © 2021 by TSA.HUST
        <br />
        Operated by FPT IS | Powered by Khaothi.Online
      </p>
    </footer>
  );
};

export default Footer;
