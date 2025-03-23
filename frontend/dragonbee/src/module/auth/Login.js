import { useState } from "react";
import axios from "axios";

const Login = ({ onLoginSuccess }) => {
    const [tenNguoiDung, setTenNguoiDung] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/auth/login", null, {
                params: { tenNguoiDung, matKhau }
            });

            // Lưu token vào localStorage
            localStorage.setItem("token", response.data);

            // Gọi callback khi đăng nhập thành công
            onLoginSuccess();
        } catch (err) {
            setError("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        <div>
            <h2>Đăng Nhập</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Tên đăng nhập" 
                    value={tenNguoiDung} 
                    onChange={(e) => setTenNguoiDung(e.target.value)} 
                    required
                />
                <input 
                    type="password" 
                    placeholder="Mật khẩu" 
                    value={matKhau} 
                    onChange={(e) => setMatKhau(e.target.value)} 
                    required
                />
                <button type="submit">Đăng Nhập</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;
