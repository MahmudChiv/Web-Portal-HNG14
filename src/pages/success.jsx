import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthSuccess() {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(() => navigate("/dashboard"));
  }, []);

  return <p>Logging you in...</p>;
}
