import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./MainLayout.scss";
import changeTitle from "../../helpers/changeTitle";
import Header from "../../components/Header";
import { useEffect } from "react";
import { useSelector } from "react-redux";
const MainLayout = () => {
  const { pathname } = useLocation();
  changeTitle(pathname);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.userInformation || !user.isLogin) {
      navigate("/home");
    }
  }, [navigate, user]);

  if (!user || !user.userInformation || !user.isLogin) {
    return null;
  }
  return (
    <div className="main-layout">
      <Header />
      <Outlet />
    </div>
  );
};

export default MainLayout;
