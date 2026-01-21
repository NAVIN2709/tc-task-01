import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CollegeInvitePage = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const collegeData = {
    nitt: "001",
    nitr: "002",
    iitd: "003",
    iitm: "004",
  };

  useEffect(() => {
    const collegeId = collegeData[name.toLowerCase()];
    if (collegeId) {
      localStorage.setItem("collegeId", collegeId);

      const timer = setTimeout(() => {
        navigate("/login");
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      console.warn("College not found");
      navigate("/");
    }
  }, [name, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-100">
      <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
      <div className="text ml-2 font-bold text-lg">Redirecting...</div>
    </div>
  );
};

export default CollegeInvitePage;
