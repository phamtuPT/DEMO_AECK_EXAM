import React from "react";
import clsx from "clsx";
const Footer = ({ className }) => {
  return (
    <footer className={clsx("text-center mt-5 text-[12px]", className)}>
      <p>
        Copyright © 2024 by AECK
        <br />
        Operated by AECK Team | Powered by AECK Platform
      </p>
    </footer>
  );
};

export default Footer;
