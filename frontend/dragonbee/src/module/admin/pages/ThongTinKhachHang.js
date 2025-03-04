import { Add, ArrowBack, Delete, Star } from "@mui/icons-material";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
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
            districts: [],
            wards: [],
        }],
    });
    const [provinces, setProvinces] = useState([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [isDeleteAddress, setIsDeleteAddress] = useState(false);
    const [isUpdateCustomer, setIsUpdateCustomer] = useState(false);

    useEffect(() => {
        axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
            headers: { token: '2ae73454-f01a-11ef-b6c2-d21b7695c8d0' }
        }).then(response => setProvinces(response.data.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (!id) return;
        axios.get(`http://localhost:8080/khach-hang/${id}`)
            .then(response => setKhachHang(response.data))

            .catch(error => console.log(error));
        return () => {
        };
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            for (let index = 0; index < khachHang.diaChiDtos.length; index++) {
                const item = khachHang.diaChiDtos[index];

                // Step 1: Fetch districts based on province
                const provinceId = provinces.find(province => province.ProvinceName === item.thanhPho)?.ProvinceID;
                if (!provinceId) continue;

                try {
                    const districtResponse = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
                        headers: { token: '2ae73454-f01a-11ef-b6c2-d21b7695c8d0', province_id: provinceId }
                    });

                    // Update districts in state
                    setKhachHang(prev => ({
                        ...prev,
                        diaChiDtos: prev.diaChiDtos.map((item, i) => {
                            if (i !== index) return item;
                            return {
                                ...item,
                                districts: districtResponse.data.data.filter(data => data.ProvinceID === provinceId)
                            };
                        })
                    }));

                    // Step 2: Fetch wards based on district
                    const districtId = districtResponse.data.data.find(district => district.DistrictName === item.huyen)?.DistrictID;
                    if (!districtId) continue;

                    const wardResponse = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`, {
                        headers: { token: '2ae73454-f01a-11ef-b6c2-d21b7695c8d0', district_id: districtId }
                    });

                    // Update wards in state
                    setKhachHang(prev => ({
                        ...prev,
                        diaChiDtos: prev.diaChiDtos.map((item, i) => {
                            if (i !== index) return item;
                            return {
                                ...item,
                                wards: wardResponse.data.data
                            };
                        })
                    }));
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [provinces,khachHang.diaChiDtos]);

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
                    [field]: event.target.value,
                }
            })
        }));
    }
    const capNhatKhachHangHandler = () => {
        setIsUpdateCustomer(true);
    }

    const capNhatKhachHang = () => {
        axios.put(`http://localhost:8080/khach-hang/${id}`, khachHang)
            .then(response => { toast.success('Cập nhật khách hàng thành công'); setTimeout(() => navigate('/khachhang'), 2000); })
            .catch(error => toast.error('Cập nhật khách hàng thất bại'));
        setIsUpdateCustomer(false);
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
                districts: [],
                wards: [],
            }]
        }));
    }

    const deleteAddressHandler = () => {
        if (khachHang.diaChiDtos[selectedAddressIndex]?.id) {
            axios.delete(`http://localhost:8080/dia-chi/${khachHang.diaChiDtos[selectedAddressIndex]?.id}`)
                .then(response => toast.success('Xóa địa chỉ thành công'))
                .catch(error => toast.error('Xóa địa chỉ thất bại'));
        }
        setIsDeleteAddress(false);
        setKhachHang(prev => ({
            ...prev,
            diaChiDtos: prev.diaChiDtos.filter((_, i) => i !== selectedAddressIndex)
        }));
    }

    const makeDefaultAddress = (index) => {
        if (khachHang.diaChiDtos[index]?.id) {
            axios.put(`http://localhost:8080/dia-chi/${khachHang.diaChiDtos[index]?.id}/mac-dinh`)
                .then(response => toast.success('Đặt làm địa chỉ mặc định thành công'))
                .catch(error => toast.error('Đặt làm địa chỉ mặc định thất bại'));
        }
        setKhachHang(prev => ({
            ...prev,
            diaChiDtos: prev.diaChiDtos.map((item, i) => {
                if (i !== index) return { ...item, macDinh: false };
                return { ...item, macDinh: true };
            })
        }));
    }


    const updateDistrictsHandler = (index, provinceId) => {
        axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
            headers: { token: '2ae73454-f01a-11ef-b6c2-d21b7695c8d0', province_id: provinceId }
        }).then(response => {
            setKhachHang(prev => ({
                ...prev,
                diaChiDtos: prev.diaChiDtos.map((item, i) => {
                    if (i !== index) return item;
                    return {
                        ...item,
                        districts: [...response.data.data.filter((data) => data.ProvinceID === provinceId)],
                    }
                })
            }));
        })
    }

    const updateWardsHandler = (index, districtId) => {
        axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`, {
            headers: { token: '2ae73454-f01a-11ef-b6c2-d21b7695c8d0', district_id: districtId }
        }).then(response => {
            setKhachHang(prev => ({
                ...prev,
                diaChiDtos: prev.diaChiDtos.map((item, i) => {
                    if (i !== index) return item;
                    return {
                        ...item,
                        wards: response.data.data,
                    }
                })
            }));
        })
    }


    const onDeleteAddress = (index) => {
        setIsDeleteAddress(true);
        setSelectedAddressIndex(index);
    }
    const DiaChi = (index) => {
        return (
            <Box key={index} sx={{ padding: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <h5 style={{ margin: 0 }}>&#9899; Địa chỉ {index + 1}</h5>
                        {khachHang.diaChiDtos[index]?.macDinh ? <IconButton><Star style={{ color: "red" }} /></IconButton> : <IconButton onClick={() => makeDefaultAddress(index)}><Star /></IconButton>}
                    </Box>
                    <IconButton onClick={() => onDeleteAddress(index)} size="small" aria-label="delete">
                        <Delete />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl sx={{ flex: 1 }}>
                        {/* {khachHang.diaChiDtos[index]?.thanhPho ? <TextField sx={classNames.textField} type="text" value={khachHang.diaChiDtos[index]?.thanhPho} ></TextField>
                            :
                            <> */}
                        <InputLabel id="provice-select-label">Tỉnh/Thành phố</InputLabel>
                        <Select
                            labelId="provice-select-label"
                            id="provice-select"
                            label="Tỉnh/Thành phố"
                            value={khachHang.diaChiDtos[index]?.thanhPho}
                            onChange={(e) => addressChangeHandler(e, index, 'thanhPho')}
                        >
                            {provinces.map((province, i) => <MenuItem key={i} onClick={() => updateDistrictsHandler(index, province.ProvinceID)} value={province.ProvinceName}>{province.ProvinceName}</MenuItem>)}
                        </Select>
                        {/* </>} */}
                    </FormControl>
                    <FormControl sx={{ flex: 1 }}>
                        {/* {khachHang.diaChiDtos[index]?.huyen ? <TextField sx={classNames.textField} type="text" value={khachHang.diaChiDtos[index]?.huyen} > </TextField> : */}
                        {/* <> */}
                        <InputLabel id="district-select-label">Quận/Huyện</InputLabel>
                        <Select
                            labelId="district-select-label"
                            id="district-select"
                            label="Quận/Huyện"
                            value={khachHang.diaChiDtos[index]?.huyen}
                            onChange={(e) => addressChangeHandler(e, index, 'huyen')}
                        >
                            {khachHang.diaChiDtos[index].districts?.map((district, i) => <MenuItem key={i} onClick={() => updateWardsHandler(index, district.DistrictID)} value={district.DistrictName}>{district.DistrictName}</MenuItem>)}
                        </Select>
                        {/* </>} */}
                    </FormControl>
                    <FormControl sx={{ flex: 1 }}>
                        {/* {khachHang.diaChiDtos[index]?.xa ? <TextField sx={classNames.textField} type="text" value={khachHang.diaChiDtos[index]?.xa} ></TextField> :
                            <> */}
                        <InputLabel id="ward-select-label">Xã/Phường/Thị Trấn</InputLabel>
                        <Select
                            labelId="ward-select-label"
                            id="ward-select"
                            label="Xã/Phường/Thị Trấn"
                            value={khachHang.diaChiDtos[index]?.xa}
                            onChange={(e) => addressChangeHandler(e, index, 'xa')}
                        >
                            {khachHang.diaChiDtos[index].wards?.map((ward, i) => <MenuItem key={i} value={ward.WardName}>{ward.WardName}</MenuItem>)}
                        </Select>
                        {/* </>} */}
                    </FormControl>
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
        <Box >
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
                    <Button onClick={id ? capNhatKhachHangHandler : themKhachHang} sx={{ marginTop: 3, width: '20%' }} variant="outlined">
                        {id ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
                    </Button>
                </Box>
            </Box>

            <Toaster position="top-right" />
            <Dialog
                open={isDeleteAddress}
                onClose={() => setIsDeleteAddress(false)}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Address
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you really want delete this address?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setIsDeleteAddress(false)}>
                        Cancel
                    </Button>
                    <Button onClick={deleteAddressHandler}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={isUpdateCustomer}
                onClose={() => setIsUpdateCustomer(false)}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Customer
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you really want update this customer?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setIsUpdateCustomer(false)}>
                        Cancel
                    </Button>
                    <Button onClick={capNhatKhachHang}>Confirm</Button>
                </DialogActions>
            </Dialog>
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