import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext";
import { useContext, useEffect } from "react";
import LoadingBall from "../components/loader/chatbot_loader/loadingBall";
import propTypes from "prop-types";

const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const { userData, loading } = useContext(AuthContext);

  useEffect(() => {
    if (userData && !loading) {
      navigate("/chat"); // Redirect to chat if already logged in
    }
  }, [userData, loading, navigate]);

  if (loading) {
    return <LoadingBall />;
  }

  return !userData ? children : null;
};

PublicRoute.propTypes = {
  children: propTypes.node.isRequired,
};

export default PublicRoute;
