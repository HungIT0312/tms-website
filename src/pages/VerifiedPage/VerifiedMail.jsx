import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyMailUser } from "../../stores/user/userThunk";
// import { message as msg } from "antd";

const VerifiedMail = () => {
  const [countdown, setCountdown] = useState(5);
  const location = useLocation();
  const navigate = useNavigate();
  const verificationToken = location.search.replace("?verificationToken=", "");
  const { verified } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (verificationToken) {
      dispatch(verifyMailUser({ verificationToken })).unwrap();
      // .then((rs) => msg.success(rs.message))
      // .catch((err) => msg.error(err.errMessage));
    }
  }, [dispatch, verificationToken]);

  useEffect(() => {
    if (verificationToken) {
      if (countdown > 0) {
        const timeout = setTimeout(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        return () => clearTimeout(timeout);
      } else {
        navigate("/auth/login");
      }
    }
  }, [countdown, navigate, verificationToken]);
  return (
    <div>
      {!verified && !verificationToken ? (
        <p>Please verify your email to complete registration...</p>
      ) : (
        <p>Email verified successfully! Redirecting in {countdown} seconds</p>
      )}
    </div>
  );
};

export default VerifiedMail;
