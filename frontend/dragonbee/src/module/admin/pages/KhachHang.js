import React, { useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, Box, Button, Chip, FormControl, InputBase, InputLabel, MenuItem, Pagination, Paper, Select, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Tooltip } from '@mui/material';
import { Add, GetApp, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { exportToExcel } from '../../../utils';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    width: '60%',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        width: '100%',
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
    },
}));
const KhachHang = () => {
    const [khachHang, setKhachHang] = React.useState([]);
    const [key, setKey] = React.useState([]);
    const [gender, setGender] = React.useState('');
    const [status, setStatus] = React.useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const navigate = useNavigate();
    const tableRef = useRef();

    useEffect(() => {
        axios.get('http://localhost:8080/khach-hang/').then((response) => { setKhachHang(response.data) }).catch((error) => { console.log(error) });;
    }, []);
    const handleKeyChange = (event) => {
        setKey(event.target.value);
    }
    const genderChangeHandler = (event) => {
        setGender(event.target.value);
    }

    const statusChangeHandler = (event) => { setStatus(event.target.value); }

    const filterKhachHang = khachHang.filter((kh) => (kh.tenKhachHang.includes(key) || kh.sdt.includes(key) || kh.email.includes(key)) && (kh.gioiTinh.includes(gender) || gender === '') && (kh.trangThai.includes(status) || status === ''));
    const showKhachHang = filterKhachHang.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const viewDetailHandler = (id) => {
        navigate(`/khachHang/detail/${id}`);
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value)
    }
    const handleChangePage = (page) => {
        setPage(page)
    }
    const exportToExcelHandler = () => {
        const data = khachHang.map((kh) => {
            return {
                'Mã khách hàng': kh.ma,
                'Email': kh.email,
                'Họ tên': kh.tenKhachHang,
                'Ngày sinh': kh.ngaySinh,
                'Số điện thoại': kh.sdt,
                'Giới tính': kh.gioiTinh,
                'Trạng thái': kh.trangThai
            }
        });
        exportToExcel(data, 'customers');
    }
    return (
        <Box margin={3}>
            <h1>Khách hàng </h1>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 1 }}>
                <Box sx={styles.headerContainer}>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            value={key}
                            onChange={handleKeyChange}
                            placeholder="Tìm kiếm theo tên hoặc sdt hoặc email"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Button variant="outlined" startIcon={<Add />} onClick={() => navigate('/khachHang/add')}>
                        Tạo khách hàng
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl variant="standard" sx={{ minWidth: 120, mx: 2 }}>
                        <InputLabel id="demo-simple-select-label">Giới tính</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={gender}
                            label="Giới tính"
                            onChange={genderChangeHandler}
                        >
                            <MenuItem value={''}>Chọn giới tính</MenuItem>
                            <MenuItem value={'Nam'}>Nam</MenuItem>
                            <MenuItem value={'Nữ'}>Nữ</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="standard" sx={{ minWidth: 120, mx: 2 }}>
                        <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={status}
                            label="Giới tính"
                            onChange={statusChangeHandler}
                        >
                            <MenuItem value={''}>Chọn trạng thái</MenuItem>
                            <MenuItem value={'Hoạt động'}>Hoạt động</MenuItem>
                            <MenuItem value={'Tạm ngừng'}>Tạm ngưng</MenuItem>
                        </Select>
                    </FormControl>
                    {/* <DownloadTableExcel
                        filename="customers table"
                        sheet="customers"
                        currentTableRef={tableRef.current}
                    > */}
                    <Button onClick={exportToExcelHandler} variant="outlined" color="primary" startIcon={<GetApp />}>
                        Xuất Excel
                    </Button>
                    {/* </DownloadTableExcel> */}

                </Box>
            </Box>
            <Box sx={{ marginTop: 5 }}>
                <TableContainer component={Paper} ref={tableRef}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>STT</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Mã Khách Hàng</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Họ tên</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Ngày sinh</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Giới tính</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {showKhachHang.map((kh, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: 'black' }}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>{kh.ma}</TableCell>
                                    <TableCell>{kh.email}</TableCell>
                                    <TableCell>{kh.tenKhachHang}</TableCell>
                                    <TableCell>{kh.ngaySinh}</TableCell>
                                    <TableCell>{kh.sdt}</TableCell>
                                    <TableCell>{kh.gioiTinh}</TableCell>
                                    <TableCell>
                                        {kh.trangThai === 'Hoạt động' ? (
                                            <Chip label="Hoạt động" color="success" />
                                        ) : (
                                            <Chip label="Tạm ngưng" color="error" />
                                        )}
                                    </TableCell>
                                    <TableCell onClick={viewDetailHandler.bind(this, kh.ma)}>
                                        <Tooltip title="Xem chi tiết" placement="bottom-start">
                                            <IconButton>
                                                <Visibility style={{ color: 'orange' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}> <Typography
                        variant="body2">Xem</Typography> <Select value={rowsPerPage} onChange={(e) =>
                            handleChangeRowsPerPage(e)} size="small" sx={{ minWidth: "60px" }}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                        <Typography variant="body2">sản phẩm</Typography> </Box>
                    <Pagination
                        count={Math.ceil(filterKhachHang.length / rowsPerPage)}
                        page={page + 1} onChange={(event,
                            newPage) => handleChangePage(newPage - 1)}
                        color="primary" />
                </Box>
            </Box>
        </Box >
    );
};

export default KhachHang;


const styles = {
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
}