import React from "react";
type HeaderProps = {
  title?: string;
};
const Header = ({ title }: HeaderProps) => {
  return (
    <header className="header">
      <h1 className="titile">{title}</h1>
    </header>
  );
};
export default React.memo(Header);
