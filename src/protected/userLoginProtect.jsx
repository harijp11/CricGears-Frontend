import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ element: Element, ...rest }) {
  const userDatas = useSelector((state) => state.user.userDatas);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if user is logged in
    if (userDatas) {
      navigate("/");
    }
  }, [userDatas, navigate]);

  // Render the passed component if the user is not logged in
  return userDatas ? null : <Element {...rest} />;
}

export default ProtectedRoute;
