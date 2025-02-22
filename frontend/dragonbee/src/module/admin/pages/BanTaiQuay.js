import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, TextField, InputAdornment, Button, IconButton, Box, Grid, Paper, Input, Snackbar, Alert,
  Dialog, DialogContent, DialogTitle, Modal, FormControl, InputLabel, Select, MenuItem, RadioGroup, Radio,
  FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import 'font-awesome/css/font-awesome.min.css';
import CloseIcon from '@mui/icons-material/Close';
import Switch from '@mui/material/Switch';  // Thêm import cho Switch
import EditIcon from '@mui/icons-material/Edit';  // Thêm import cho EditIcon

const BanTaiQuay = () => {

  const [orders, setOrders] = useState([{ id: 1, name: 'Hóa đơn 1' }]); // State để lưu trữ các hóa đơn
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Điều khiển trạng thái Snackbar
  const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi
  const [discount, setDiscount] = useState(''); // State cho "Chiết khấu"
  const [moneyGiven, setMoneyGiven] = useState(''); // State cho "Tiền khách đưa"
  const [openVoucherModal, setOpenVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [open, setOpen] = useState(false);
  const [isShippingIconClicked, setIsShippingIconClicked] = useState(false);
  const [feeType, setFeeType] = useState('Miễn phí giao hàng');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });

  const handleHomeClick = () => {
    // Mở trang Thống Kê (hoặc trang bất kỳ) trong một tab mới
    window.open('/thongKe', '_blank'); // '_blank' để mở tab mới
  };

  const handleFeeTypeChange = (event) => {
    setFeeType(event.target.value);
  };

  const handleWeightChange = (event) => {
    setWeight(event.target.value);
  };

  const handleDimensionsChange = (event) => {
    const { name, value } = event.target;
    setDimensions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm để xử lý sự kiện khi người dùng nhấn vào icon
  const handleShippingIconClick = () => {
    setIsShippingIconClicked(!isShippingIconClicked);
  };

  // Mở hoặc đóng modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Dữ liệu voucher (ví dụ)
  const voucherInfo = {
    code: '128722347',
    discount: '30.000 VNĐ',
    description: 'Giảm giá áp dụng cho toàn bộ sản phẩm',
    condition: 'Cho đơn hàng từ 500.000 VNĐ',
    quantity: 50,
    expiry: '2022-06-23 02:33:00',
  };

  // Hàm mở và đóng modal voucher
  const handleOpenVoucherModal = () => {
    setOpenVoucherModal(true);
  };

  const handleCloseVoucherModal = () => {
    setOpenVoucherModal(false);
  };

  // Hàm xử lý thay đổi mã voucher
  const handleVoucherCodeChange = (e) => {
    setVoucherCode(e.target.value);
  };

  // Hàm để thêm hóa đơn mới
  const addOrder = () => {
    if (orders.length >= 5) {
      setErrorMessage('Chỉ được thêm tối đa 5 hóa đơn');
      setOpenSnackbar(true); // Mở Snackbar khi vượt quá số lượng
      return;
    }

    const newOrder = {
      id: orders.length + 1, // Tạo ID mới dựa trên số lượng hiện tại
      name: `Hóa đơn ${orders.length + 1}`, // Tạo tên hóa đơn
    };
    setOrders([...orders, newOrder]); // Cập nhật danh sách hóa đơn
  };

  // Xử lý sự kiện khi chọn một hóa đơn
  const handleOrderClick = (id) => {
    setSelectedOrderId(id); // Cập nhật id của hóa đơn đã chọn
  };

  // Hàm đóng Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Hàm để xử lý nhập liệu cho "Chiết khấu"
  const handleDiscountInput = (e) => {
    const newValue = e.target.value.replace(/\D/g, ''); // Chỉ cho phép nhập số
    setDiscount(newValue);
  };

  // Hàm để xử lý nhập liệu cho "Tiền khách đưa"
  const handleMoneyGivenInput = (e) => {
    const newValue = e.target.value.replace(/\D/g, ''); // Chỉ cho phép nhập số
    setMoneyGiven(newValue);
  };

  // radioButton chọn phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <div>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#1976D2', margin: 0, padding: 0 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '67%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  padding: '0 8px',
                  backgroundColor: 'white',
                  marginRight: 2 
                }}
                onClick={handleHomeClick}
              >
                <Box
                  component="img"
                  src="https://raw.githubusercontent.com/lytienduy/DuAnTotNghiep_SD13/refs/heads/main/frontend/dragonbee/src/img/dragonbee_logo_v1.png"
                  alt="logo"
                  sx={{ width: 50, height: 50}}
                />
              </Box>
              <TextField
                variant="outlined"
                size="small"
                sx={{ backgroundColor: 'white', marginRight: 2, width: '300px' }}
                placeholder="Tìm kiếm sản phẩm"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {/* Hiển thị danh sách các hóa đơn */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {orders.map((order) => (
                  <Button
                    key={order.id}
                    sx={{
                      color: selectedOrderId === order.id ? '#1976D2' : 'white', // Màu chữ khi chọn
                      backgroundColor: selectedOrderId === order.id ? 'white' : 'transparent', // Màu nền khi chọn
                      marginRight: 1,
                      borderRadius: '12px', // Giữ bo góc cho các góc trên
                      padding: '10px 16px',
                      textTransform: 'none', // Tắt chuyển chữ thành chữ hoa
                      fontWeight: 'bold'
                    }}
                    onClick={() => handleOrderClick(order.id)} // Gọi hàm khi click vào hóa đơn
                  >
                    {order.name}
                  </Button>
                ))}
              </Box>
            </Box>
            {/* Đảm bảo AddIcon sát cạnh phải */}
            <IconButton sx={{ color: 'white', ml: 0 }} onClick={addOrder}>
              <AddIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', width: '31.5%' }}>
            {/* LocalShippingIcon ở phía bên trái */}
            <IconButton sx={{ color: 'white' }}>
              <LocalShippingIcon onClick={handleShippingIconClick} />
            </IconButton>

            {/* Các IconButton còn lại căn về phía bên phải */}
            <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
              <IconButton sx={{ color: 'white' }}>
                <PersonIcon />
              </IconButton>
              <Button sx={{ color: 'white' }}>Admin</Button>
              <IconButton sx={{ color: 'white' }} onClick={handleHomeClick}>
                <HomeIcon />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>


      {/* Main Content */}
      <Box sx={{ backgroundColor: '#f5f5f5' }}>
        <Box sx={{ padding: 0 }}>
          <Grid container spacing={1}>

            {/* bên trái  */}
            <Grid item xs={12} sm={6} md={isShippingIconClicked ? 6 : 8}>
              <Paper sx={{ padding: 2, minHeight: 598, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 0 }}>
                {/* Biểu tượng thùng hàng */}
                <Box sx={{ fontSize: 70, color: 'gray', marginBottom: 2 }}>
                  <i className="fa fa-cube" style={{ fontSize: '70px', color: 'gray' }}></i>
                </Box>
                {/* Văn bản */}
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                  {selectedOrderId
                    ? `Hóa đơn ${selectedOrderId} của bạn chưa có sản phẩm nào!`
                    : 'Chưa chọn hóa đơn'}
                </Typography>
              </Paper>
            </Grid>

            {/* ở giữa */}
            {isShippingIconClicked && (
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ padding: 2, maxHeight: 600, overflowY: 'auto' }}>

                  <Typography variant="h7" sx={{ fontWeight: 'bold' }}>Địa chỉ nhận hàng</Typography>

                  <TextField
                    label="Địa chỉ lấy hàng"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    size='small'
                  />

                  <TextField
                    label="Điện thoại"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    size='small'
                  />

                  <TextField
                    label="Tên người nhận"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    size='small'
                  />

                  <FormControl fullWidth margin="normal" size='small'>
                    <InputLabel>Tỉnh Thành phố</InputLabel>
                    <Select label="Tỉnh Thành phố">
                      {/* Add province options here */}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal" size='small'>
                    <InputLabel>Quận huyện</InputLabel>
                    <Select label="Quận huyện">
                      {/* Add district options here */}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal" size='small'>
                    <InputLabel>Phường xã</InputLabel>
                    <Select label="Phường xã">
                      {/* Add ward options here */}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Địa chỉ chi tiết"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    size='small'
                  />

                  <FormControl fullWidth margin="normal" size='small'>
                    <InputLabel>Phí giao hàng</InputLabel>
                    <Select value={feeType} onChange={handleFeeTypeChange} label="Phí giao hàng">
                      <MenuItem value="Miễn phí giao hàng">Miễn phí giao hàng</MenuItem>
                      <MenuItem value="Phí dự kiến">Phí dự kiến của đối tác vận chuyển</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Show weight and dimensions only if "Phí dự kiến" is selected */}
                  {feeType === "Phí dự kiến" && (
                    <>
                      <Typography variant="body2" sx={{ marginTop: 2 }}>Khối lượng (g)</Typography>
                      <TextField
                        value={weight}
                        onChange={handleWeightChange}
                        label="Khối lượng"
                        variant="outlined"
                        fullWidth
                        type="number"
                        margin="normal"
                        size='small'
                      />

                      <Typography variant="body2" sx={{ marginTop: 2 }}>Kích thước (cm)</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextField
                          name="length"
                          value={dimensions.length}
                          onChange={handleDimensionsChange}
                          label="Dài"
                          variant="outlined"
                          fullWidth
                          type="number"
                          margin="normal"
                          size='small'
                        />
                        <TextField
                          name="width"
                          value={dimensions.width}
                          onChange={handleDimensionsChange}
                          label="Rộng"
                          variant="outlined"
                          fullWidth
                          type="number"
                          margin="normal"
                          size='small'
                        />
                        <TextField
                          name="height"
                          value={dimensions.height}
                          onChange={handleDimensionsChange}
                          label="Cao"
                          variant="outlined"
                          fullWidth
                          type="number"
                          margin="normal"
                          size='small'
                        />
                      </Box>
                    </>
                  )}

                  <Button variant="contained" fullWidth sx={{ marginTop: 2 }}>
                    Xác nhận
                  </Button>
                </Paper>
              </Grid>
            )}

            {/* bên phải */}
            <Grid item xs={12} sm={6} md={isShippingIconClicked ? 3 : 4}>
              <Paper sx={{ padding: 2, borderRadius: 0, minHeight: 598 }}>
                <Box sx={{ width: '100%' }}>
                  {/* TextField với biểu tượng tìm kiếm */}
                  <TextField
                    placeholder="Thêm khách hàng vào đơn"
                    variant="standard"
                    sx={{ width: '100%' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'gray' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end" onClick={handleOpen}>
                          <AddIcon sx={{ color: 'gray' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Typography variant="body1">Tổng tiền: (0 sản phẩm)</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>648.000 VNĐ</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Typography variant="body1">Voucher:</Typography>
                  <Input
                    value={'PGG001'}
                    sx={{ color: '#5e5e5ede', width: 140 }}
                    endAdornment={<InputAdornment position="end"><EditIcon onClick={handleOpenVoucherModal} /></InputAdornment>}
                    inputProps={{
                      style: {
                        textAlign: 'right',
                        fontWeight: 'bold',
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Typography variant="body1">Giảm giá sản phẩm:</Typography>
                  <Typography variant="body1" sx={{ color: 'gray' }}>+0 VNĐ</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Typography variant="body1">Chiết khấu:</Typography>
                  <Input
                    value={discount} // Sử dụng giá trị state
                    onInput={handleDiscountInput} // Xử lý sự kiện nhập liệu
                    endAdornment={<InputAdornment position="end">VNĐ</InputAdornment>}
                    inputProps={{
                      style: {
                        textAlign: 'right',
                        fontWeight: 'bold',
                      },
                      type: 'text',             // Thay vì "number", dùng "text" để loại bỏ spinner
                      inputMode: 'numeric'      // Hạn chế nhập chỉ số (dành cho các thiết bị di động)
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Typography variant="body1">Khách phải trả:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'red', fontSize: 30 }}>618.200 VNĐ</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Typography variant="body1">Tiền khách đưa:</Typography>
                  <Input
                    value={moneyGiven} // Sử dụng giá trị state
                    onInput={handleMoneyGivenInput} // Xử lý sự kiện nhập liệu
                    endAdornment={<InputAdornment position="end">VNĐ</InputAdornment>}
                    inputProps={{
                      style: {
                        textAlign: 'right',
                        fontSize: '20px',
                        color: 'black',
                        fontWeight: 'bold',
                      },
                      type: 'text',             // Thay vì "number", dùng "text" để loại bỏ spinner
                      inputMode: 'numeric'      // Hạn chế nhập chỉ số (dành cho các thiết bị di động)
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, borderTop: '1px solid rgba(0, 0, 0, 0.2)', paddingTop: 2 }}>
                  <Typography variant="body1">Tiền thừa trả khách</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>0 VNĐ</Typography>
                </Box>

                {/* Giống như trong hình, bạn có thể thêm biểu tượng bên cạnh "Thêm ghi chú" */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1, paddingTop: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <TextField
                      placeholder='Thêm ghi chú'
                      variant="standard"
                      sx={{ width: '100%' }}  // Đảm bảo TextField chiếm hết chiều rộng của Box
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EditIcon /> {/* Biểu tượng bút chỉnh sửa */}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                  <Typography variant="body1">In hóa đơn</Typography>
                  <Switch defaultChecked /> {/* Thêm một nút chuyển */}
                </Box>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <FormControl component="fieldset" size="small">
                    <RadioGroup
                      value={paymentMethod}
                      onChange={handlePaymentChange}
                      row
                      sx={{ justifyContent: 'center' }}
                    >
                      <FormControlLabel
                        value="cash"
                        control={<Radio sx={{ transform: 'scale(0.5)' }} />}
                        label={<Typography sx={{ fontSize: '0.9rem' }}>Tiền mặt</Typography>}
                      />
                      <FormControlLabel
                        value="transfer"
                        control={<Radio sx={{ transform: 'scale(0.5)' }} />}
                        label={<Typography sx={{ fontSize: '0.9rem' }}>Chuyển khoản</Typography>}
                      />
                      <FormControlLabel
                        value="both"
                        control={<Radio sx={{ transform: 'scale(0.5)' }} />}
                        label={<Typography sx={{ fontSize: '0.9rem' }}>Cả 2</Typography>}
                      />
                    </RadioGroup>
                  </FormControl>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      height: 80,
                      backgroundColor: '#43a047',
                      fontSize: 25,
                    }}
                  >
                    Thanh toán
                  </Button>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Modal thêm khách hàng */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          width: 700,
          margin: '50px auto',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          position: 'relative'  // Để đặt Close Icon ở góc trên bên phải
        }}>
          {/* Close button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'gray'  // Bạn có thể chỉnh màu theo ý thích
            }}>
            <CloseIcon />
          </IconButton>

          <h2>Thêm mới khách hàng</h2>

          <Grid container spacing={2}>
            {/* Cột bên trái */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tên khách hàng"
                variant="outlined"
                margin="normal"
                name="name"
                size='small'
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                variant="outlined"
                margin="normal"
                name="phone"
                size='small'
              />
              <TextField
                fullWidth
                label="Ngày sinh"
                variant="outlined"
                margin="normal"
                type="date"
                size='small'
                name="dob"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Thành phố"
                variant="outlined"
                margin="normal"
                name="area"
                size='small'
              />
              <TextField
                fullWidth
                label="Xã / Thị trấn"
                variant="outlined"
                margin="normal"
                name="address"
                size='small'
              />
            </Grid>

            {/* Cột bên phải */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Mã khách hàng (Có thể nhập hoặc không)"
                variant="outlined"
                margin="normal"
                name="customerId"
                size='small'
              />
              <FormControl fullWidth margin="normal" size='small'>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  label="Giới tính"
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                name="email"
                size='small'
              />

              <TextField
                fullWidth
                label="Quận / Huyện"
                variant="outlined"
                margin="normal"
                name="district"
                size='small'
              />
              <TextField
                fullWidth
                label="Số nhà, Đường, Thôn/Xóm"
                variant="outlined"
                margin="normal"
                name="district"
                size='small'
              />
            </Grid>
          </Grid>

          <Button

            variant="contained"
            color="primary"
            sx={{ marginTop: '20px', left: 270 }}
          >
            Thêm khách hàng
          </Button>
        </Box>
      </Modal>
      {/* Snackbar thông báo lỗi */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Tự động đóng sau 3 giây
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'top',  // Đặt vị trí theo chiều dọc ở trên cùng
          horizontal: 'right', // Đặt vị trí theo chiều ngang ở bên phải
        }}
        sx={{ marginTop: 7 }} // Di chuyển xuống 30px, giá trị 3 tương đương với 30px (tùy thuộc vào hệ thống đơn vị của bạn)
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Show Voucher */}
      <Dialog open={openVoucherModal} onClose={handleCloseVoucherModal} sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: '800px' } }}>
        <DialogTitle>
          Chọn Voucher
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseVoucherModal}
            sx={{
              position: 'absolute',
              right: '25px',
              top: '15px',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Input voucher mã */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder='Nhập mã voucher'
              variant="outlined"
              value={voucherCode}
              onChange={handleVoucherCodeChange}
              sx={{
                marginBottom: 2,
                marginTop: 1,
                flex: 1,
                '& .MuiInputBase-root': {
                  height: '40px',  // Điều chỉnh chiều cao của TextField
                },
              }}
            />
          </Box>


          <Box sx={{ border: '1px dashed #db5656', padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Box 1: Mã và giảm giá */}
            <Box sx={{ flex: 2, padding: '20px 30px', marginRight: 2, backgroundColor: '#db5656', borderRadius: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
                Mã: {voucherInfo.code}
              </Typography>
              <Typography variant="body1" sx={{ color: 'white' }}>
                Giảm {voucherInfo.discount}
              </Typography>
            </Box>

            {/* Box 2: Các thông tin còn lại */}
            <Box sx={{ flex: 3, paddingRight: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Miễn phí vận chuyển
              </Typography>

              <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>
                {voucherInfo.description}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>
                {voucherInfo.condition}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>
                Số lượng còn lại: {voucherInfo.quantity}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>
                HSD: {voucherInfo.expiry}
              </Typography>

            </Box>

            {/* Box 3: Nút sử dụng */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Button variant="contained" sx={{ backgroundColor: '#d32f2f' }} onClick={handleCloseVoucherModal}>
                Sử dụng
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BanTaiQuay;
