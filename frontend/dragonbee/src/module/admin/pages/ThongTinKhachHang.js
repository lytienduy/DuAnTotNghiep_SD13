import { Add, ArrowBack, Delete, Star } from "@mui/icons-material";
import { Avatar, Box, Button, FormControlLabel, IconButton, Radio, RadioGroup, TextField } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const ThongTinKhachHang = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [khachHang, setKhachHang] = useState({
        tenKhachHang: "",
        email: "",
        sdt: "",
        ngaySinh: "",
        gioiTinh: "",
        trangThai: "",
        diaChiDtos: [{
            id: '',
            xa: '',
            huyen: '',
            thanhPho: '',
            soNha: '',
            duong: '',
            macDinh: false,
        }],
    });
    useEffect(() => {
        if (!id) return;
        axios.get(`http://localhost:8080/khach-hang/${id}`)
            .then(response => setKhachHang(response.data))
            .catch(error => console.log(error));
        return () => {
        };
    }, [id]);

    const infoChangeHandler = useCallback((event, field) => {
        const value = event.target.value;
        setKhachHang(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const addressChangeHandler = (event, index, field) => {
        setKhachHang(prev => ({
            ...prev,
            diaChiDtos: prev.diaChiDtos.map((item, i) => {
                if (i !== index) return item;
                return {
                    ...item,
                    [field]: event.target.value
                }
            })
        }));
    }


    const capNhatKhachHang = () => {
        axios.put(`http://localhost:8080/khach-hang/${id}`, khachHang)
            .then(response => { toast.success('Cập nhật khách hàng thành công'); setTimeout(() => navigate('/khachhang'), 2000); })
            .catch(error => toast.error('Cập nhật khách hàng thất bại'));
    }

    const themKhachHang = () => {
        axios.post('http://localhost:8080/khach-hang/', khachHang)
            .then(response => { toast.success('Thêm khách hàng thành công'); setTimeout(() => navigate('/khachhang'), 2000); })
            .catch(error => { toast.error(error.response.data.message) });
    }

    const addAddressHandler = () => {
        setKhachHang(prev => ({
            ...prev,
            diaChiDtos: [...prev.diaChiDtos, {
                id: '',
                xa: '',
                huyen: '',
                thanhPho: '',
                soNha: '',
                duong: '',
                macDinh: false,
            }]
        }));
    }

    const deleteAddressHandler = (index) => {
        axios.delete(`http://localhost:8080/dia-chi/${khachHang.diaChiDtos[index]?.id}`)
            .then(response => toast.success('Xóa địa chỉ thành công'))
            .catch(error => toast.error('Xóa địa chỉ thất bại'));
        setKhachHang(prev => ({
            ...prev,
            diaChiDtos: prev.diaChiDtos.filter((_, i) => i !== index)
        }));
    }

    const makeDefaultAddress = (index) => {
        axios.put(`http://localhost:8080/dia-chi/${khachHang.diaChiDtos[index]?.id}/mac-dinh`)
            .then(response => toast.success('Đặt làm địa chỉ mặc định thành công'))
            .catch(error => toast.error('Đặt làm địa chỉ mặc định thất bại'));
        setKhachHang(prev => ({
            ...prev,
            diaChiDtos: prev.diaChiDtos.map((item, i) => {
                if (i !== index) return { ...item, macDinh: false };
                return { ...item, macDinh: true };
            })
        }));
    }

    const DiaChi = (index) => {
        return (
            <Box key={index} sx={{ padding: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <h5 style={{ margin: 0 }}>&#9899; Địa chỉ {index + 1}</h5>
                        {khachHang.diaChiDtos[index]?.macDinh ? <IconButton><Star style={{ color: "red" }} /></IconButton> : <IconButton onClick={() => makeDefaultAddress(index)}><Star /></IconButton>}
                    </Box>
                    <IconButton onClick={() => deleteAddressHandler(index)} size="small" aria-label="delete">
                        <Delete />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box>
                        <p>Xã/Phường/Thị Trấn </p>
                        <TextField sx={classNames.textField} type="text" value={khachHang.diaChiDtos[index]?.xa}
                            onChange={(e) => addressChangeHandler(e, index, 'xa')}></TextField>
                    </Box>
                    <Box>
                        <p>Quận/Huyện </p>
                        <TextField sx={classNames.textField} type="text" value={khachHang.diaChiDtos[index]?.huyen}
                            onChange={(e) => addressChangeHandler(e, index, 'huyen')}></TextField>
                    </Box>
                    <Box>
                        <p>Tỉnh/Thành phố </p>
                        <TextField sx={classNames.textField} type="text" value={khachHang.diaChiDtos[index]?.thanhPho}
                            onChange={(e) => addressChangeHandler(e, index, 'thanhPho')}></TextField>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                        <p>Số nhà </p>
                        <TextField sx={classNames.textField} type="text" value={khachHang.diaChiDtos[index]?.soNha}
                            onChange={(e) => addressChangeHandler(e, index, 'soNha')}></TextField>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <p>Đường </p>
                        <TextField sx={classNames.textField} type="text" value={khachHang.diaChiDtos[index]?.duong}
                            onChange={(e) => addressChangeHandler(e, index, 'duong')}></TextField>
                    </Box>
                </Box>
            </Box>
        )
    }

    return (
        <Box>
            <h2 style={{ display: 'flex', alignItems: 'center' }}>
                <ArrowBack onClick={() => {
                    navigate('/khachhang');
                }} sx={{ marginRight: 1 }} />
                Khách hàng <span style={{ fontWeight: 'lighter' }}>/ {id}</span>
            </h2>
            <Box sx={classNames.container}>
                <Box sx={classNames.infoContainer}>
                    <Box sx={{ ...classNames.customerInfo, width: '30%' }}>
                        <h4>Thông tin khách hàng</h4>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar
                                alt="Remy Sharp"
                                src="/static/images/avatar/1.jpg"
                                sx={{ width: 80, height: 80 }}
                            />
                        </Box>
                        <Box>
                            <p>Tên khách hàng </p>
                            <TextField sx={classNames.textField}
                                type="text" value={khachHang.tenKhachHang}
                                onChange={(e) => infoChangeHandler(e, 'tenKhachHang')}></TextField>
                        </Box>
                        <Box>
                            <p>Email </p>
                            <TextField sx={classNames.textField} type="email" value={khachHang.email}
                                onChange={(e) => infoChangeHandler(e, 'email')}></TextField>
                        </Box>
                        <Box>
                            <p>Số điện thoại </p>
                            <TextField sx={classNames.textField} type="text" value={khachHang.sdt}
                                onChange={(e) => infoChangeHandler(e, 'sdt')}
                            ></TextField>
                        </Box>
                        <Box>
                            <p>Ngày sinh</p>
                            <TextField sx={classNames.textField} type="date" value={khachHang.ngaySinh}
                                onChange={(e) => infoChangeHandler(e, 'ngaySinh')}></TextField>
                        </Box>
                        <Box>
                            <p>Giới tính</p>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                value={khachHang.gioiTinh}
                                name="radio-buttons-group"
                                sx={{ display: 'flex', flexDirection: 'row' }}
                                onChange={(e) => infoChangeHandler(e, 'gioiTinh')}
                            >
                                <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                                <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                            </RadioGroup>
                        </Box>
                        <Box>
                            <p>Trạng thái</p>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                value={khachHang.trangThai}
                                name="radio-buttons-group"
                                sx={{ display: 'flex', flexDirection: 'row' }}
                                onChange={(e) => infoChangeHandler(e, 'trangThai')}
                            >
                                <FormControlLabel value="Hoạt động" control={<Radio />} label="Hoạt động" />
                                <FormControlLabel value="Tạm ngừng" control={<Radio />} label="Tạm ngừng" />
                            </RadioGroup>
                        </Box>

                    </Box>
                    <Box sx={{ ...classNames.customerInfo, width: '50%' }}>
                        <h4>Danh sách địa chỉ</h4>
                        {khachHang.diaChiDtos.map((_, index) => (DiaChi(index)))}
                        <IconButton onClick={addAddressHandler} size="small" aria-label="add">
                            <Add />
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={id ? capNhatKhachHang : themKhachHang} sx={{ marginTop: 3, width: '20%' }} variant="outlined">
                        {id ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
                    </Button>
                </Box>
            </Box>

            <Toaster position="top-right" />
        </Box>
    );
}
export default ThongTinKhachHang;

const classNames = {
    container: {
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    },
    infoContainer: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    textField: {
        width: '100%',
        '& .MuiInputBase-input': {
            padding: '5px 10px',
        }
    },
    customerInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
    }
};