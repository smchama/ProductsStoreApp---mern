// src/components/AdminRoute.jsx
import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/auth.js";
import { useToast } from "@chakra-ui/react";

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  const toast = useToast();
  const toastShown = useRef(false);

  useEffect(() => {
    if ((!user || user.role !== "admin") && !toastShown.current) {
      toastShown.current = true;
      toast({
        title: "Access Denied",
        description: "You must be logged in as an administrator to view this page.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [user, toast]);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;