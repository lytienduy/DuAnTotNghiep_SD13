import React, { useState } from 'react';
import axios from "axios";
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';  // Hoặc import từ @mui/material
import backgroundLogin from '../../img/backgroundLogin.png';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
// Tùy chỉnh màu sắc
const themeColors = {
  primary: '#1976d2',  // Màu xanh dương
  secondary: '#ffffff',  // Màu trắng
};

const Background = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${backgroundLogin})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,  // Đảm bảo background nằm phía dưới form
  height: '100vh',  // Đảm bảo chiều cao bằng 100% viewport height
  width: '100%',    // Đảm bảo chiều rộng bằng 100%
  backgroundColor: 'rgba(0,0,0,0.5)',  // Thêm màu nền tạm thời để thấy background
});

// Tạo style cho form đăng nhập
const LoginPaper = styled(Paper)(() => ({
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  // Thêm bóng đổ để tạo chiều sâu
  backgroundColor: 'rgba(229, 229, 229, 0.95)', // Màu nền trắng với opacity giảm
  border: '2px solid rgba(229, 229, 229, 0.95)',  // Đặt viền trắng cho form
}));

const RegisterPaper = styled(Paper)(() => ({
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundColor: 'rgba(229, 229, 229, 0.95)',
  border: '2px solid rgba(229, 229, 229, 0.95)',
}));

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [usernameDK, setUsernameDK] = useState('');
  const [emailDK, setEmailDK] = useState('');
  const [passwordDK, setPasswordDK] = useState('');
  const [CFpasswordDK, setCFPasswordDK] = useState('');
  //Thông báo Toast
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#1976D2", // Màu nền xanh đẹp hơn
        color: "white", // Chữ trắng nổi bật
        fontSize: "14px", // Nhỏ hơn một chút
        fontWeight: "500",
        borderRadius: "8px",
      },
    });
  };
  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#D32F2F", // Màu đỏ cảnh báo
        color: "white", // Chữ trắng nổi bật
        fontSize: "14px", // Nhỏ hơn một chút
        fontWeight: "500",
        borderRadius: "8px",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu đăng nhập
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.text(); // Đọc lỗi nếu có
        console.error("Login failed:", errorData);
        showErrorToast(errorData || 'Đăng nhập không thành công');
        return;
      }

      const data = await response.json();
      const { token, refreshToken } = data; // Lấy token và refreshToken từ API

      // Kiểm tra xem token có hợp lệ không
      if (!token) {
        showErrorToast("Token không hợp lệ");
        return;
      }

      // Lấy thông tin người dùng và vai trò
      const userResponse = await fetch('http://localhost:8080/api/auth/userInfo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Kiểm tra nếu có lỗi khi lấy thông tin người dùng
      if (!userResponse.ok) {
        const userError = await userResponse.text();  // Đọc lỗi nếu có
        console.error("User info fetch failed:", userError);
        showErrorToast('Có lỗi khi lấy thông tin người dùng.');
        return;
      }

      const userData = await userResponse.json();

      const roleId = userData.vaiTro.id;

      // Điều hướng người dùng dựa trên vai trò và lưu token vào localStorage với tên khác nhau
      if (roleId === 1) {
        // Lưu token cho admin
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));  // Lưu thông tin người dùng
        navigate('/admin/thongKe'); // Điều hướng đến trang admin

      } else if (roleId === 2) {
        // Lưu token cho nhân viên
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));  // Lưu thông tin người dùng
        navigate('/admin/thongKe'); // Điều hướng đến trang nhân viên

      } else if (roleId === 3) {
        // Lưu token cho khách hàng
        localStorage.setItem('tokenKH', token);
        localStorage.setItem('userKH', JSON.stringify(userData));  // Lưu thông tin khách hàng
        navigate('/home'); // Điều hướng đến trang khách hàng
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);  // Log lỗi chi tiết
      showErrorToast('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
  
    if (!usernameDK || !emailDK || !passwordDK || !CFpasswordDK) {
      showErrorToast("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    if (passwordDK !== CFpasswordDK) {
      showErrorToast("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
  
    axios.post('http://localhost:8080/api/auth/register', {
      tenKhachHang: usernameDK,
      email: emailDK,
      matKhau: passwordDK,
      xacNhanMatKhau: CFpasswordDK
    })
      .then((res) => {
        showSuccessToast(res.data); // Đăng ký thành công
        setIsRegister(false);
      })
      .catch((err) => {
        showErrorToast(err.response.data); // Email đã được đăng ký hoặc lỗi khác
      });
  };  

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -3,
        marginLeft: -3,
        marginBottom: -4,
        marginRight: -4
      }}
    >
      <Background />
      <ToastContainer />
      {isRegister ? (
        <RegisterPaper sx={{ zIndex: 2, width: '400px', marginBottom: 4.2 }}>
          {/* Nội dung form đăng ký ở đây */}
          <Typography variant="h4" color="primary" gutterBottom marginTop={2} sx={{ fontWeight: 'bold', marginBottom: 4 }}>
            Đăng Ký
          </Typography>
          <form onSubmit={handleRegisterSubmit} style={{ width: '100%' }}>
            {/* Các TextField cho đăng ký */}
            <TextField
              variant="outlined"
              label="Tên khách hàng"
              fullWidth
              value={usernameDK}
              onChange={(e) => setUsernameDK(e.target.value)}
              required
              style={{ marginBottom: '16px' }}
            />
            <TextField
              variant="outlined"
              label="Email"
              fullWidth
              value={emailDK}
              onChange={(e) => setEmailDK(e.target.value)}
              required
              style={{ marginBottom: '16px' }}
            />
            <TextField
              variant="outlined"
              label="Mật khẩu"
              type="password"
              fullWidth
              value={passwordDK}
              onChange={(e) => setPasswordDK(e.target.value)}
              required
              style={{ marginBottom: '16px' }}
            />
            <TextField
              variant="outlined"
              label="Xác nhận mật khẩu"
              type="password"
              fullWidth
              value={CFpasswordDK}
              onChange={(e) => setCFPasswordDK(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '20px', marginBottom: 10, height: 40 }}
            >
              <span style={{ fontWeight: 'bold' }}>Đăng ký</span>
            </Button>
          </form>
          <Box display="flex" justifyContent="flex-end">
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', mt: 1 }}
              onClick={() => setIsRegister(false)}
            >
              Đã có tài khoản? Đăng nhập
            </Typography>
          </Box>
        </RegisterPaper>
      ) : (
        <LoginPaper sx={{ zIndex: 2, width: '400px', marginBottom: 20 }}>
          <Typography variant="h4" color="primary" gutterBottom marginTop={2} sx={{ fontWeight: 'bold', marginBottom: 4 }}>
            Đăng Nhập
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box mb={2}>
              <TextField
                variant="outlined"
                label="Tên người dùng"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ marginBottom: '16px' }}
              />
              <TextField
                variant="outlined"
                label="Mật khẩu"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '20px', marginBottom: 10, height: 40 }}
            >
              <span style={{ fontWeight: 'bold' }}>Đăng nhập</span>
            </Button>
          </form>
          <Box display="flex" justifyContent="flex-end">
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', mt: 1 }}
              onClick={() => setIsRegister(true)}
            >
              Đăng ký tài khoản
            </Typography>
          </Box>
        </LoginPaper>
      )}

    </Container>

  );
};

export default Login;

