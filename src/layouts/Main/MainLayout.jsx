import { useLocation } from "react-router-dom";
import "./MainLayout.scss";
import changeTitle from "../../helpers/changeTitle";
const MainLayout = () => {
    const { pathname } = useLocation();
    changeTitle(pathname);
  return <div>Main</div>;
};

export default MainLayout;
