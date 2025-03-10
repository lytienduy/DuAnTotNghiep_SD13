import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("phuongthao@gmail.com");
  const [password, setPassword] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <Container maxWidth="sm"> {/* Điều chỉnh kích thước rộng hơn */}
      <Box
        sx={{
          textAlign: "center",
          mt: 5,
          p: 5,
          border: "2px solid #1c2a63",
          borderRadius: "12px",
          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#1c2a63", fontFamily: "sans-serif" }}
        >
          DRAGONBEE
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#555" }}>
          Dragon • Bee • Platform
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold" }}>
          Chào mừng trở lại
        </Typography>
        <Typography variant="body2" sx={{ color: "#888", mb: 3 }}>
          Đăng nhập để bắt đầu làm việc
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                fontSize: "1rem", // Phóng to text
                height: "50px", // Điều chỉnh chiều cao
                "& fieldset": { borderColor: "#1c2a63" },
                "&:hover fieldset": { borderColor: "#ff9800" },
                "&.Mui-focused fieldset": { borderColor: "#ff9800" },
              },
            }}
            required
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                fontSize: "1rem",
                height: "50px",
                "& fieldset": { borderColor: "#1c2a63" },
                "&:hover fieldset": { borderColor: "#ff9800" },
                "&.Mui-focused fieldset": { borderColor: "#ff9800" },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#1c2a63",
              color: "white",
              fontSize: "1rem",
              height: "50px",
              mb: 2,
              "&:hover": { backgroundColor: "#ff9800" },
            }}
          >
            Đăng nhập
          </Button>
        </form>

        <Typography variant="body2" sx={{ color: "#1c2a63", cursor: "pointer", marginLeft: "366px"  }}>
          Quên mật khẩu?
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;