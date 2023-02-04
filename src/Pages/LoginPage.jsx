import { Outlet } from "react-router-dom";

const LoginPage = (props) => {
  return (
    <div className="grid place-items-center h-screen">
      Login page
      <Outlet />
    </div>
  );
};

export default LoginPage;
