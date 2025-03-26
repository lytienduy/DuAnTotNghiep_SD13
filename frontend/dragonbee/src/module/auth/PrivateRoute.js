import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Sử dụng named import từ 'jwt-decode'

// Hàm kiểm tra xem token còn hợp lệ hay không
const isTokenValid = (token) => {
  try {
    const decodedToken = jwtDecode(token);  // Giải mã token
    const currentTime = Date.now() / 1000;   // Lấy thời gian hiện tại (seconds)
    return decodedToken.exp > currentTime;   // Kiểm tra xem token còn hạn hay không
  } catch (error) {
    return false;
  }
};

// Protected Route Component
const PrivateRoute = ({ element }) => {
  // Lấy các token từ localStorage
  const token = localStorage.getItem('token');

  // Kiểm tra nếu không có token hoặc token hết hạn, điều hướng về trang login
  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace />;  // Nếu không có token hợp lệ, điều hướng về trang đăng nhập
  }

  return element;  // Nếu có token hợp lệ, render component của route
};

export default PrivateRoute;
