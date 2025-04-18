
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // Redirect to dashboard if logged in, otherwise to login
    if (user) {
      navigate("/dashboard");  // Changé de "/" à "/dashboard" pour être explicite
    } else {
      navigate("/login");
    }
  }, [navigate, user]);
  
  return null;
}
