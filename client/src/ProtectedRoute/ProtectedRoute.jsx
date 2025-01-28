import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext";
import { useContext, useEffect } from "react";
import LoadingBall from "../components/loader/chatbot_loader/loadingBall";
import propTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { userData, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!userData && !loading) {
      navigate("/login");
    }
  }, [userData, loading, navigate]);

  if (loading) {
    return <LoadingBall />;
  }

  return userData ? children : null;
};

ProtectedRoute.propTypes = {
  children: propTypes.node.isRequired,
};

export default ProtectedRoute;
