import React, { useState, useEffect, useRef } from 'react'; // Thêm useEffect ở đây
import axios from 'axios';
import {
  Box, Button, Typography, IconButton, Snackbar, Alert
  , FormControlLabel, Switch, InputLabel, Select, MenuItem, FormControl, TextField,
  InputAdornment, Input, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, ListItemText,
  ClickAwayListener, ListItem, List, Popper, Modal, Slider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const BanTaiQuay = () => {

  //Khai báo Thành phố huyện xã
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // State để lưu danh sách các đơn hàng
  const [orders, setOrders] = useState([]);
  const [isShowOrders, setIsShowOrders] = useState(false); // Trạng thái để kiểm soát hiển thị đơn hàng
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // State để điều khiển việc hiển thị/ẩn màn bên trái
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [discount, setDiscount] = useState('');
  const [openTT, setOpenTT] = useState(false);
  const [tienKhachDua, setTienKhachDua] = useState('');
  const [tienKhachChuyen, setTienKhachChuyen] = useState('');
  const handleOpenTT = () => setOpenTT(true);
  const handleCloseTT = () => setOpenTT(false);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Mặc định là 'cash' (tiền mặt)
  // khai báo tìm khách hàng
  const [keyword, setKeyword] = useState('');
  const [customers, setCustomers] = useState([]);
  const [openKH, setOpenKH] = useState(false); // Trạng thái hiển thị danh sách khách hàng
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const inputRef = useRef(null); // Tham chiếu đến TextField
  const popperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  const [description, setDescription] = useState('');
  const [addresses, setAddresses] = useState([]);

  //khai báo voucher
  const [openVoucherModal, setOpenVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState('');
  //khai báo sản phẩm
  // State để mở modal
  const [openSPModal, setOpenSPModal] = useState(false);
  const [value, setValue] = useState([100000, 3200000]);
  const [filters, setFilters] = useState({
    category: 'Tất cả',
    color: 'Tất cả',
    material: 'Tất cả',
    size: 'Tất cả',
    sole: 'Tất cả',
    brand: 'Tất cả',
  });

  const products = [
    {
      id: 'PD41',
      name: 'Kkkk',
      sole: 'Đế sắt',
      category: 'Giày cao cổ',
      brand: 'Converse',
      color: 'Xanh dương',
      material: 'Sắt',
      size: 40,
      price: 100000,
      discount: '20%',
      image: 'https://360.com.vn/wp-content/uploads/2024/04/QASTK501-2.jpg', // Thay bằng link ảnh thật nếu có
    },
    {
      id: 'PD44',
      name: 'Kkkk',
      sole: 'Đế sắt',
      category: 'Giày cao cổ',
      brand: 'Converse',
      color: 'Tím',
      material: 'Sắt',
      size: 41,
      price: 700000,
      discount: '20%',
      image: 'https://360.com.vn/wp-content/uploads/2024/04/QASTK501-6.jpg', // Thay bằng link ảnh thật nếu có
    }
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleOpenConfirmModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleCloseConfirmModal = () => {
    setSelectedProduct(null);
    handleCloseSPModal(); // Đóng luôn modal cha
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === 'increase' ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  // Hàm mở modal sản phẩm
  const handleOpenSPModal = () => setOpenSPModal(true);

  // Hàm đóng modal sản phẩm
  const handleCloseSPModal = () => setOpenSPModal(false);

  const handleFilterChange = (event, name) => {
    setFilters((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  // Hàm mở và đóng modal voucher
  const handleOpenVoucherModal = () => {
    setOpenVoucherModal(true);
  };

  const handleCloseVoucherModal = () => {
    setOpenVoucherModal(false);
  };

  // Gọi API tìm kiếm voucher
  const handleVoucherCodeChange = async (event) => {
    const keyword = event.target.value;
    setVoucherCode(keyword);

    if (keyword.trim() === '') {
      // Nếu không có mã, lấy tất cả các voucher
      fetchVouchers();
    } else {
      // Nếu có mã, tìm kiếm voucher theo mã
      try {
        const response = await axios.get(`http://localhost:8080/dragonbee/tim-kiem-phieu-giam-gia?keyword=${keyword}`);
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    }
  };

  // Fetch tất cả voucher khi không có mã tìm kiếm
  const fetchVouchers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/dragonbee/tim-kiem-phieu-giam-gia', {
        params: {
          keyword: ''        // Truyền từ khóa tìm kiếm rỗng để lấy tất cả các voucher
        }
      });

      // Sắp xếp dữ liệu theo ngày tạo (ngayTao)
      const sortedVouchers = response.data.sort((a, b) => {
        return new Date(b.ngayTao) - new Date(a.ngayTao);  // Sắp xếp theo ngày tạo giảm dần (mới nhất lên đầu)
      });

      // Cập nhật dữ liệu voucher sau khi đã sắp xếp
      setVouchers(sortedVouchers);
    } catch (error) {
      console.error("Error fetching all vouchers:", error);
    }
  };

  // Gọi fetchVouchers khi modal mở lần đầu hoặc chưa có dữ liệu voucher
  useEffect(() => {
    if (openVoucherModal) {
      fetchVouchers();
    }
  }, [openVoucherModal]);

  const handleUseVoucher = (voucherCode) => {
    setSelectedVoucherCode(voucherCode); // Cập nhật mã voucher đã chọn
    handleCloseVoucherModal(); // Đóng modal sau khi chọn voucher
  };

  //Hàm tìm khách hàng
  const searchCustomers = async (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value === '') {
      setSelectedCustomerId(null); // Reset selected customer
      setOpenKH(false); // Đóng Popper tạm thời

      // Gọi lại API để lấy danh sách top 5 khách hàng
      fetchDefaultCustomers();
      return;
    }

    if (value.length > 0) {
      try {
        const response = await axios.get(`http://localhost:8080/dragonbee/tim-kiem-khach-hang?keyword=${value}`);
        setCustomers(response.data);
        setOpenKH(true);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    }
  };


  // Lấy 5 khách hàng đầu tiên nếu không có từ khóa
  const fetchDefaultCustomers = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/dragonbee/tim-kiem-khach-hang?keyword=`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const handleSelectCustomer = (customer) => {
    // Reset tất cả các trường trước khi cập nhật dữ liệu mới
    setRecipientName('');
    setRecipientPhone('');
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedWard('');
    setSpecificAddress('');
    setDescription(''); // Reset mô tả
    setDistricts([]);
    setWards([]);

    setKeyword(`${customer.tenKhachHang} - ${customer.sdt}`);
    setSelectedCustomerId(customer.id);
    setOpenKH(false);

    setRecipientName(customer.tenKhachHang);
    setRecipientPhone(customer.sdt);
    setAddresses(customer.diaChis || []);

    if (customer.diaChis && customer.diaChis.length > 0) {
      const address = customer.diaChis[0];

      setSelectedCity(address.thanhPho);

      const city = cities.find(c => c.Name === address.thanhPho);
      if (city) {
        setDistricts(city.Districts);

        setSelectedDistrict(address.huyen);
        const district = city.Districts.find(d => d.Name === address.huyen);
        if (district) {
          setWards(district.Wards);
          setSelectedWard(address.xa);
        }
      }

      setSpecificAddress(`${address.soNha}, ${address.duong}`);
      setDescription(address.moTa || ""); // Cập nhật mô tả, nếu không có thì đặt là chuỗi rỗng
    } else {
      setDescription(""); // Nếu không có địa chỉ nào, đặt lại mô tả thành chuỗi rỗng
    }
  };

  // Hiển thị 5 khách hàng đầu tiên khi vừa mở trang (ngay khi chưa nhập gì)
  useEffect(() => {
    fetchDefaultCustomers();
  }, []);

  // Để khi focus vào TextField, show danh sách
  const handleFocus = () => {
    if (keyword === '') {
      fetchDefaultCustomers(); // Gọi lại danh sách khách hàng mặc định
      setOpenKH(true);
    }
  };

  // Hàm xử lý khi click ra ngoài Popper (để đóng nó)
  const handleClickAway = (event) => {
    setTimeout(() => {
      if (
        inputRef.current && !inputRef.current.contains(event.target) &&
        popperRef.current && !popperRef.current.contains(event.target)
      ) {
        setOpenKH(false);
      }
    }, 0); // Trì hoãn một chút để tránh xung đột với sự kiện mở Popper
  };

  // Sử dụng onMouseDown để tránh blur và luôn mở Popper
  const handleMouseDown = (e) => {
    if (e.target === inputRef.current) {
      setOpenKH(true); // Khi bạn bấm chuột vào TextField, luôn mở Popper
    }
  };

  // Mở hoặc đóng modal khach hàng
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //fake data cho lịch sử thanh toán hóa đơn
  const data = [
    { id: 1, maGiaoDich: '', phuongThuc: 'Tiền mặt', soTien: 2127500 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  // Hàm để xử lý nhập liệu cho "phí ship"
  const handleDiscountInput = (e) => {
    const newValue = e.target.value.replace(/\D/g, ''); // Chỉ cho phép nhập số
    setDiscount(newValue);
  };

  // Hàm để xử lý nhập liệu cho "tiền khách đưa"
  const handleTienKhachDua = (e) => {
    const newValue = e.target.value.replace(/\D/g, ''); // Chỉ cho phép nhập số
    setTienKhachDua(newValue);
  };

  // Hàm để xử lý nhập liệu cho "tiền khách đưa"
  const handleTienKhachChuyen = (e) => {
    const newValue = e.target.value.replace(/\D/g, ''); // Chỉ cho phép nhập số
    setTienKhachChuyen(newValue);
  };

  // hàm sử dụng để gọi tỉnh thành quận huyện xã việt nam
  useEffect(() => {
    axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json")
      .then(response => {
        const normalizedCities = response.data.map(city => ({
          ...city,
          Name: city.Name.replace(/^(Thành phố |Tỉnh )/, ""), // Loại bỏ "Thành phố " và "Tỉnh "
        }));
        setCities(normalizedCities);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);


  const handleCityChange = (event) => {
    const cityName = event.target.value;
    setSelectedCity(cityName);
    setSelectedDistrict(""); // Reset huyện
    setSelectedWard(""); // Reset xã

    const city = cities.find(city => city.Name === cityName);
    setDistricts(city ? city.Districts : []);
    setWards([]);
  };

  const handleDistrictChange = (event) => {
    const districtName = event.target.value;
    setSelectedDistrict(districtName);
    setSelectedWard(""); // Reset xã

    const district = districts.find(d => d.Name === districtName);
    setWards(district ? district.Wards : []);
  };

  const handleWardChange = (event) => {
    setSelectedWard(event.target.value);
  };

  const handleSwitchChange = (event) => {
    setShowLeftPanel(event.target.checked);
  };

  const handleSelectOrder = (index) => {
    setSelectedOrder(index === selectedOrder ? null : index); // Toggle selection
  };

  // Hàm tạo đơn hàng mới
  const createOrder = () => {
    if (orders.length < 5) {
      const newOrder = `Đơn hàng ${orders.length + 1} - HD${Math.floor(Math.random() * 1000)}`;
      const newOrders = [...orders, newOrder];
      setOrders(newOrders);
      setIsShowOrders(true); // Hiển thị đơn hàng sau khi có ít nhất một hóa đơn
      setSelectedOrder(newOrders.length - 1); // Tự động chọn đơn hàng mới
    } else {
      setOpenSnackbar(true); // Mở Snackbar khi đạt tối đa số lượng đơn hàng
    }
  };

  // Lấy ngày hiện tại và cộng thêm 3 ngày
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 3);

  // Format ngày thành dd/MM/yyyy
  const formattedDate = currentDate.toLocaleDateString("vi-VN");

  const [openDC, setOpenDC] = useState(false);
  // Mở hoặc đóng modal khach hàng
  const handleOpenDC = () => setOpenDC(true);
  const handleCloseDC = () => setOpenDC(false);

  const handleSelectAddress = (address) => {
    // Tìm khách hàng dựa vào ID đã chọn
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    if (!selectedCustomer) return; // Nếu không tìm thấy khách hàng thì thoát
  
    setRecipientName(selectedCustomer.tenKhachHang);
    setRecipientPhone(selectedCustomer.sdt);
    setSelectedCity(address.thanhPho);
    setSelectedDistrict(address.huyen);
    
    // Cập nhật danh sách xã theo huyện mới
    const city = cities.find(city => city.Name === address.thanhPho);
    if (city) {
      const district = city.Districts.find(d => d.Name === address.huyen);
      setWards(district ? district.Wards : []);
    }
  
    setSelectedWard(address.xa);
    setSpecificAddress(`${address.soNha}, ${address.duong}`);
    setDescription(address.moTa || ""); // Nếu không có mô tả, đặt rỗng
    setOpenDC(false); // Đóng modal
  };
  

  return (
    <Box
      sx={{
        border: '1px solid #E0E0E0', // Light border
        borderRadius: '8px', // Rounded corners
        padding: '24px', // Padding around the content
        minHeight: '400px', // Ensure the container has a minimum height
        backgroundColor: '#FAFAFA', // Light background color
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow effect
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Bán hàng</Typography>
        <Button
          sx={{
            color: "#fff",
            borderColor: "rgb(52, 152, 234)",
            backgroundColor: "rgb(52, 152, 234)",
            "&:hover": {
              backgroundColor: "#e3f2fd",
              borderColor: "#1565c0",
              color: "#1565c0",
            },
          }}
          onClick={createOrder}
        >
          + Tạo đơn hàng
        </Button>
      </Box>

      {/* Hiển thị các đơn hàng */}
      {isShowOrders && orders.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #E0E0E0' }}>
          {orders.map((order, index) => (
            <Box
              key={index}
              sx={{
                padding: '10px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'start',
                gap: '8px',
                cursor: 'pointer',
                borderBottom: selectedOrder === index ? '2px solid #1E88E5' : 'none', // Đường kẻ dưới khi chọn
                '&:hover': {
                  borderColor: '#FF8C00',
                },
              }}
              onClick={() => handleSelectOrder(index)} // Chọn đơn hàng khi click
            >
              <Typography
                variant="body2"
                sx={{
                  color: selectedOrder === index ? '#1E88E5' : 'inherit', // Màu chữ xanh dương khi chọn
                  fontWeight: selectedOrder === index ? 'bold' : 'normal', // Đậm chữ khi chọn
                }}
              >
                {order}
              </Typography>

              {/* Nút Xóa */}
              <IconButton
                sx={{
                  backgroundColor: '#FF1744',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#D50000',
                  },
                  borderRadius: '50%',
                  padding: 1,
                  width: '15px',
                  height: '15px',
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Ngừng sự kiện click trên Box khi bấm nút xóa
                  const newOrders = orders.filter((_, i) => i !== index);
                  setOrders(newOrders);
                  if (newOrders.length === 0) {
                    setSelectedOrder(null); // Nếu không còn đơn hàng nào, bỏ chọn
                    setIsShowOrders(false)
                  }
                }}
              >
                <CloseIcon sx={{ fontSize: '16px' }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Khi không có đơn nào */}
      {!isShowOrders && (
        <Box sx={{ textAlign: 'center', position: 'relative', marginBottom: 5 }}>
          <img
            src="https://img.freepik.com/premium-vector/result-not-found_878233-777.jpg" // Placeholder image
            alt="No data"
            style={{ width: '150px', height: 'auto' }}
          />
          <Typography variant="h6" sx={{ marginTop: '-40px' }}>Không có đơn nào</Typography>
        </Box>
      )}

      {/* Phần sản phẩm */}
      {isShowOrders && orders.length > 0 && (
        <Box>
          <Box sx={{ borderBottom: '1px solid #E0E0E0' }}>
            <Box sx={{ borderBottom: '1px solid #9b9b9b' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Sản phẩm
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    sx={{
                      marginRight: '10px',
                      backgroundColor: 'rgb(52, 152, 234)',
                      color: 'white',
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                        borderColor: "#1565c0",
                        color: "#1565c0",
                      },
                    }}
                  >
                    Quét QR Sản Phẩm
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#1976D2",
                      borderColor: "#1976D2",
                      backgroundColor: "#fff",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                        borderColor: "#1565c0",
                        color: "#1565c0",
                      },
                    }}
                    onClick={handleOpenSPModal}  // Khi nhấn vào button, mở modal
                  >
                    Thêm Sản Phẩm
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center', position: 'relative', marginBottom: 5 }}>
              <img
                src="https://img.freepik.com/premium-vector/result-not-found_878233-777.jpg" // Placeholder image
                alt="No data"
                style={{ width: '150px', height: 'auto' }}
              />
              <Typography variant="h6" sx={{ marginTop: '-40px' }}>Không có sản phẩm nào</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <Typography color='white'>m</Typography>
              <Typography color='white'>m</Typography>
              <Typography color='white'>m</Typography>
              <Typography color='white'>m</Typography>
              <Typography color='white'>m</Typography>
              <Typography color='white'>m</Typography>
              <Typography color='white'>m</Typography>
              <Typography variant="body1">Tổng tiền:</Typography>
              <Typography fontSize={20} sx={{ fontWeight: 'bold', color: 'red', marginRight: 3 }}>
                0 VNĐ
              </Typography>
            </Box>
          </Box>
          <Box sx={{ borderBottom: '1px solid #9b9b9b' }}>
            <Box sx={{ width: '100%', }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3, marginBottom: 3 }}>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '60%', marginLeft: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Khách hàng
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'center', position: 'relative', width: '40%', marginRight: 3 }}>

                </Box>
              </Box>
            </Box>
          </Box>

          {/* ở đây */}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '55%', marginLeft: 3, paddingRight: '40px' }}>
                {/* Box bên trái */}
                {showLeftPanel && (
                  <Box sx={{ width: '100%', backgroundColor: '#fff' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2} marginTop={2}>
                      <Typography variant="h6">Thông tin khách hàng</Typography>
                      <Button
                        variant="outlined"
                        onClick={handleOpenDC}
                        sx={{
                          color: "#1976D2",
                          borderColor: "#1976D2",
                          backgroundColor: "#fff",
                          "&:hover": {
                            backgroundColor: "#e3f2fd",
                            borderColor: "#1565c0",
                            color: "#1565c0",
                          },

                        }}
                      >
                        Chọn địa chỉ
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: '16px', marginTop: 5 }}>
                      <TextField
                        fullWidth
                        label="Tên người nhận"
                        variant="outlined"
                        size="small"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        variant="outlined"
                        size="small"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: '16px', marginTop: 5 }}>
                      {/* Các dropdowns chỉ hiển thị khi showLeftPanel là true */}
                      <FormControl fullWidth size='small'>
                        <InputLabel>Tỉnh/Thành phố</InputLabel>
                        <Select value={selectedCity} onChange={handleCityChange} label="Tỉnh/Thành phố">
                          {cities.map((city) => (
                            <MenuItem key={city.Id} value={city.Name}>{city.Name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Chọn Quận/Huyện */}
                      <FormControl fullWidth size='small' disabled={!selectedCity}>
                        <InputLabel>Quận/Huyện</InputLabel>
                        <Select value={selectedDistrict} onChange={handleDistrictChange} label="Quận/Huyện">
                          {districts.map((district) => (
                            <MenuItem key={district.Id} value={district.Name}>{district.Name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Chọn Xã/Phường */}
                      <FormControl fullWidth size='small' disabled={!selectedDistrict}>
                        <InputLabel>Xã/Phường</InputLabel>
                        <Select value={selectedWard} onChange={handleWardChange} label="Xã/Phường">
                          {wards.map((ward) => (
                            <MenuItem key={ward.Id} value={ward.Name}>{ward.Name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '16px', marginTop: 5 }}>
                      <TextField
                        fullWidth
                        label="Địa chỉ cụ thể"
                        variant="outlined"
                        size="small"
                        sx={{ marginBottom: '16px' }}
                        value={specificAddress}
                        onChange={(e) => setSpecificAddress(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Mô tả"
                        variant="outlined"
                        size='small'
                        sx={{ marginBottom: '16px' }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      {/* Box chứa thông tin bên trái */}
                      <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LocalShippingIcon fontSize="small" />
                          <Typography variant="body1" fontWeight="bold">
                            Đơn vị vận chuyển:
                            <span style={{ color: '#1976d2' }}>
                              <span> </span>Giao hàng nhanh
                            </span>
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <LocalShippingIcon fontSize="small" />
                          <Typography variant="body1" fontWeight="bold">
                            Thời gian dự kiến:
                            <span style={{ color: '#1976d2' }}>
                              <span> </span>{formattedDate}
                            </span>
                          </Typography>
                        </Box>
                      </Box>

                      {/* Box chứa logo bên phải */}
                      <Box>
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4kQyiXGjJmXcP6UKya0gkj19iOmgyvjrOng&s"
                          alt="GHN Logo"
                          style={{ height: '100px' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}

              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '40%', marginRight: 3 }}>
                {/* Box bên phải (Thông tin thanh toán) */}
                <Box
                  sx={{
                    width: '100%',
                    backgroundColor: '#fff',
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
                    <Typography variant="h6" >Thông tin thanh toán</Typography>
                    {/* Nút Switch điều khiển việc hiển thị/ẩn bên trái */}
                    <FormControlLabel
                      control={<Switch checked={showLeftPanel} onChange={handleSwitchChange} />}
                      label="Giao hàng"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', position: 'relative' }}>

                    {/* TextField với biểu tượng tìm kiếm */}
                    <TextField
                      value={keyword}
                      onChange={searchCustomers}
                      onFocus={handleFocus}
                      onMouseDown={handleMouseDown} // Giữ Popper mở khi nhấn vào
                      inputRef={inputRef}
                      placeholder="Thêm khách hàng vào đơn"
                      variant="standard"
                      sx={{ width: '100%' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'gray' }} />
                          </InputAdornment>
                        ),
                      }}
                      autoComplete="off"
                    />

                    {/* Đặt AddIcon bên ngoài TextField, nhưng vẫn trong Box */}
                    <IconButton
                      onClick={handleOpen}
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10
                      }}
                    >
                      <AddIcon sx={{ color: 'gray' }} />
                    </IconButton>

                    {/* Popper hiển thị danh sách khách hàng */}
                    <Popper
                      open={openKH && customers.length > 0}
                      anchorEl={inputRef.current}
                      placement="bottom-start"
                      sx={{ zIndex: 1300, width: 422 }}
                      ref={popperRef} // Gán ref vào Popper để kiểm tra click
                    >
                      <ClickAwayListener onClickAway={handleClickAway}>
                        <Box sx={{ border: '1px solid #ddd', maxHeight: 200, overflowY: 'auto', backgroundColor: 'white', boxShadow: 3 }}>
                          <List>
                            {customers.map((customer) => (
                              <ListItem
                                button
                                key={customer.id}
                                onClick={(e) => {
                                  e.stopPropagation(); // Ngừng lan truyền sự kiện click
                                  handleSelectCustomer(customer); // Chọn khách hàng
                                }}
                              >
                                <ListItemText primary={`${customer.tenKhachHang} - ${customer.sdt}`} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </ClickAwayListener>
                    </Popper>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Typography variant="body1">Phiếu giảm giá:</Typography>
                    <Input
                      value={selectedVoucherCode} // Hiển thị mã voucher đã chọn
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
                  <Typography variant="body1" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                    Tiền hàng: <span>2.377.500 <span>VNĐ</span></span>
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                    <Typography variant="body1">Phí vận chuyển:</Typography>
                    <Input
                      value={discount} // Sử dụng giá trị state
                      onInput={handleDiscountInput} // Xử lý sự kiện nhập liệu
                      sx={{ color: 'black' }}
                      endAdornment={<InputAdornment position="end"><Typography sx={{ color: 'black' }}>VNĐ</Typography></InputAdornment>}
                      inputProps={{
                        style: {
                          textAlign: 'right',
                          width: 100
                        },
                        type: 'text',             // Thay vì "number", dùng "text" để loại bỏ spinner
                        inputMode: 'numeric'      // Hạn chế nhập chỉ số (dành cho các thiết bị di động)
                      }}
                    />
                  </Box>
                  <Typography variant="body1" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                    Giảm giá: <span>250.000 <span>VNĐ</span></span>
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '16px' }} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontWeight: 'bold' }}>
                    Tổng số tiền: <span style={{ color: 'red' }}>2.377.500 <span style={{ color: 'red' }}>VNĐ</span></span>
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      display: 'flex',
                      alignItems: 'center', // Căn giữa icon với text
                      justifyContent: 'space-between',
                      marginTop: 5,
                      fontWeight: 'bold'
                    }}
                  >
                    Khách thanh toán:
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Button
                        variant="outlined" // Đặt kiểu viền
                        onClick={handleOpenTT} // Khi nhấn mở modal
                        sx={{
                          borderColor: 'black', // Viền màu đen
                          color: 'black', // Màu chữ đen
                          backgroundColor: 'white', // Nền trắng
                          borderRadius: '8px', // Bo góc
                          padding: '3px 13px', // Khoảng cách trong button
                          minWidth: '40px', // Kích thước tối thiểu cho button không bị co lại
                          marginRight: 20,
                          '&:hover': {
                            backgroundColor: '#f5f5f5', // Màu nền nhạt hơn khi hover
                            borderColor: 'black' // Giữ viền màu đen khi hover
                          }
                        }}
                      >
                        <CreditCardIcon style={{ color: 'black' }} /> {/* Icon ví */}
                      </Button>
                      <span style={{ color: 'red' }}>0 VNĐ</span>
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontWeight: 'bold' }}>
                    Tiền thiếu: <span style={{ color: 'red' }}>0 <span style={{ color: 'red' }}>VNĐ</span></span>
                  </Typography>
                  <Typography variant="body1" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontWeight: 'bold' }}>
                    Tiền thừa trả khách: <span style={{ color: 'red' }}>250.000 <span style={{ color: 'red' }}>VNĐ</span></span>
                  </Typography>

                  <Button variant="contained" sx={{ width: '100%', marginTop: 10, height: 50, backgroundColor: '#1976D2' }}>
                    Xác nhận đặt hàng
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Snackbar thông báo khi đạt tối đa số lượng đơn hàng */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Thời gian tự ẩn sau 3 giây
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Vị trí của Snackbar
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: '100%' }}>
          Đã đạt tối đa số lượng hóa đơn chờ (5 đơn)
        </Alert>
      </Snackbar>

      <Dialog open={openTT} onClose={handleCloseTT} maxWidth="sm" fullWidth>
        {/* Tiêu đề có nút đóng */}
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '25px', color: '#1976D2', position: 'relative' }}>
          THANH TOÁN
          <IconButton
            onClick={handleCloseTT}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#1976D2' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Tổng tiền hàng */}
          <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6">Tổng tiền hàng</Typography>
            <Typography variant="h6" sx={{ color: 'red', fontWeight: 'bold' }}>2.127.500 VND</Typography>
          </Grid>

          {/* Nút Chuyển Khoản - Tiền Mặt - Cả Hai */}
          <Grid container justifyContent="center" spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setPaymentMethod('transfer');
                  setTienKhachDua('');
                  setTienKhachChuyen('');
                }}
                sx={{
                  backgroundColor: paymentMethod === 'transfer' ? 'red' : '#FFB6C1',
                  color: 'white',
                  opacity: paymentMethod === 'transfer' ? 1 : 0.5,
                }}
              >
                CHUYỂN KHOẢN
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setPaymentMethod('cash');
                  setTienKhachDua('');
                  setTienKhachChuyen('');
                }}
                sx={{
                  backgroundColor: paymentMethod === 'cash' ? 'green' : '#a3c88e',
                  color: 'white',
                  opacity: paymentMethod === 'cash' ? 1 : 0.5,
                }}
              >
                TIỀN MẶT
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setPaymentMethod('both');
                  setTienKhachDua('');
                  setTienKhachChuyen('');
                }}
                sx={{
                  backgroundColor: paymentMethod === 'both' ? '#1976D2' : '#B6D0FF',
                  color: 'white',
                  opacity: paymentMethod === 'both' ? 1 : 0.5,
                }}
              >
                CẢ HAI
              </Button>
            </Grid>
          </Grid>

          {/* Nếu chọn TIỀN MẶT hoặc CẢ HAI thì hiển thị input nhập tiền khách đưa */}
          {(paymentMethod === 'cash' || paymentMethod === 'both') && (
            <>
              <Typography sx={{ color: '#1976D2', fontSize: 14 }}>Tiền khách đưa</Typography>
              <TextField
                fullWidth
                variant="standard"
                value={tienKhachDua}
                onInput={handleTienKhachDua}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography sx={{ color: 'black' }}>VNĐ</Typography>
                    </InputAdornment>
                  )
                }}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': { fontSize: 18, fontWeight: 'bold', textAlign: 'right' }
                }}
              />
            </>
          )}

          {/* Nếu chọn CHUYỂN KHOẢN hoặc CẢ HAI thì hiển thị input Mã giao dịch & Tiền khách chuyển */}
          {(paymentMethod === 'transfer' || paymentMethod === 'both') && (
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography sx={{ color: '#1976D2', fontSize: 14 }}>Mã giao dịch</Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  sx={{
                    '& .MuiInputBase-input': { fontSize: 18, fontWeight: 'bold' }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: '#1976D2', fontSize: 14 }}>Tiền khách chuyển</Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  value={tienKhachChuyen}
                  onInput={handleTienKhachChuyen}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography sx={{ color: 'black' }}>VNĐ</Typography>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiInputBase-input': { fontSize: 18, fontWeight: 'bold', textAlign: 'right' }
                  }}
                />
              </Grid>
            </Grid>
          )}

          {/* Bảng Thanh Toán */}
          <TableContainer component={Paper} sx={{ borderRadius: '10px', overflow: 'hidden', marginBottom: 2 }}>
            <Table sx={{ width: '100%' }}>
              <TableHead sx={{ backgroundColor: '#1976D2' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Mã giao dịch</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Phương thức</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Số tiền</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.maGiaoDich}</TableCell>
                    <TableCell>{row.phuongThuc}</TableCell>
                    <TableCell>{formatCurrency(row.soTien)}</TableCell>
                    <TableCell>
                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body1" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontWeight: 'bold' }}>
            Tiền thừa trả khách: <span style={{ color: 'red' }}>250.000 <span style={{ color: 'red' }}>VNĐ</span></span>
          </Typography>
        </DialogContent>

        {/* Nút Xác nhận */}
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="contained" sx={{ backgroundColor: 'green', color: 'white', fontWeight: 'bold' }} onClick={handleCloseTT}>
            XÁC NHẬN
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* Show Voucher */}
      <Dialog open={openVoucherModal} onClose={handleCloseVoucherModal} sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: '800px' } }}>
        <DialogTitle>
          Chọn Voucher
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseVoucherModal}
            sx={{ position: 'absolute', right: '25px', top: '15px' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Input voucher mã */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder='Nhập mã hoặc tên voucher'
              variant="outlined"
              value={voucherCode}
              onChange={handleVoucherCodeChange}
              sx={{
                marginBottom: 2,
                marginTop: 1,
                flex: 1,
                '& .MuiInputBase-root': { height: '40px' },
              }}
            />
          </Box>

          {/* Danh sách voucher */}
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {vouchers.map((voucher) => (
              <Box key={voucher.id} sx={{ border: '1px dashed #db5656', padding: 2, marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Box 1: Mã và giảm giá */}
                <Box sx={{ flex: 2, padding: '20px 30px', marginRight: 2, backgroundColor: '#db5656', borderRadius: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
                    Mã: {voucher.ma}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    Giảm: <span> </span>
                    {voucher.giaTriGiam < 100
                      ? `${voucher.giaTriGiam}${voucher.loaiPhieuGiamGia === 'Phần trăm' ? '%' : ' VNĐ'}` // Khoảng cách chỉ có khi là VNĐ
                      : `${new Intl.NumberFormat().format(voucher.giaTriGiam)}${voucher.loaiPhieuGiamGia === 'Phần trăm' ? '%' : ' VNĐ'}`}
                  </Typography>

                </Box>

                {/* Box 2: Các thông tin còn lại */}
                <Box sx={{ flex: 3, paddingRight: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {voucher.tenPhieuGiamGia}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>
                    {voucher.moTa}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>
                    {voucher.trangThai}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>
                    Số tiền tối thiểu: {voucher.soTienToiThieu}
                  </Typography>
                </Box>

                {/* Box 3: Nút sử dụng */}
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#d32f2f' }}
                    onClick={() => handleUseVoucher(voucher.ma)} // Truyền mã voucher vào khi nhấn nút Sử dụng
                  >
                    Sử dụng
                  </Button>

                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal sản phẩm*/}
      <Modal
        open={openSPModal} // Khi open=true, modal sẽ hiển thị
        onClose={handleCloseSPModal} // Khi nhấn ngoài modal hoặc nhấn nút đóng sẽ đóng modal
      >
        <Box sx={style}>
          {/* Nút đóng modal */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseSPModal}
            aria-label="close"
            sx={{
              position: 'absolute',
              top: 10,
              right: 20,
              color: 'gray'
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Tìm kiếm sản phẩm
          </Typography>

          {/* Bố trí tìm kiếm và slider cùng 1 dòng */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <TextField
                label="Tìm kiếm sản phẩm"
                variant="outlined"
                fullWidth
                size='small'
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={4} marginLeft={10} marginTop={3}>
              <Slider
                value={value}
                onChange={handleSliderChange}
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${value} VNĐ`}
                min={100000}
                max={3200000}
                sx={{
                  marginBottom: 2,
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: '#fff',  // Màu nền của giá trị
                    color: 'black',  // Màu chữ của giá trị
                  }
                }}
              />
            </Grid>
          </Grid>

          {/* Bộ lọc danh mục */}
          <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
            {[
              { label: 'Danh mục', key: 'category' },
              { label: 'Màu sắc', key: 'color' },
              { label: 'Chất liệu', key: 'material' },
              { label: 'Kích cỡ', key: 'size' },
              { label: 'Đế giày', key: 'sole' },
              { label: 'Thương hiệu', key: 'brand' }
            ].map((filter) => (
              <Grid item key={filter.key}>
                {/* ✅ Làm cho label (Danh mục, Màu sắc, ...) đậm */}
                <Typography sx={{ display: 'inline', fontWeight: 'bold' }}>
                  {filter.label}:{' '}
                </Typography>
                <Select
                  value={filters[filter.key]}
                  onChange={(e) => handleFilterChange(e, filter.key)}
                  size="small"
                  variant="standard" // Loại bỏ viền xanh khi focus
                  sx={{
                    minWidth: 100,
                    borderBottom: 'none', // Loại bỏ viền dưới của Select
                    '&::before': { borderBottom: 'none' }, // Loại bỏ viền trước khi focus
                    '&::after': { borderBottom: 'none' }, // Loại bỏ viền sau khi focus
                    '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }, // Loại bỏ viền khi hover
                    color: filters[filter.key] === 'Tất cả' ? '#1976D2' : 'black', // Màu xanh dương khi là 'Tất cả'
                    fontWeight: filters[filter.key] === 'Tất cả' ? 'bold' : 'normal', // Chữ đậm khi là 'Tất cả'
                  }}
                >
                  <MenuItem value="Tất cả" sx={{ fontWeight: 'bold', color: 'blue' }}>Tất cả</MenuItem>
                  <MenuItem value="Lựa chọn 1">Lựa chọn 1</MenuItem>
                  <MenuItem value="Lựa chọn 2">Lựa chọn 2</MenuItem>
                </Select>
              </Grid>
            ))}
          </Grid>

          {/* Bảng sản phẩm */}
          <Box sx={{ overflowX: 'auto' }}>
            <>
              {/* Table hiển thị danh sách sản phẩm */}
              <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ảnh</TableCell>
                      <TableCell>Tên</TableCell>
                      <TableCell>Đế Giày</TableCell>
                      <TableCell>Danh mục</TableCell>
                      <TableCell>Thương hiệu</TableCell>
                      <TableCell>Màu sắc</TableCell>
                      <TableCell>Chất liệu</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => {
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img src={product.image} alt={product.name} width="100" height="100" />
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.sole}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>{product.color}</TableCell>
                          <TableCell>{product.material}</TableCell>
                          <TableCell>{product.size}</TableCell>
                          <TableCell>
                            <span>
                              {product.price.toLocaleString()} VND
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outlined" onClick={() => handleOpenConfirmModal(product)}>Chọn</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Modal xác nhận khi bấm "Chọn" */}
              {selectedProduct && (
                <Modal open={!!selectedProduct} onClose={handleCloseConfirmModal}>
                  <Box
                    sx={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      width: 400, bgcolor: 'white', p: 3, boxShadow: 24, borderRadius: 2
                    }}
                  >
                    {/* Nút đóng Modal */}
                    <IconButton
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={handleCloseConfirmModal}
                    >
                      <CloseIcon />
                    </IconButton>

                    {/* Tiêu đề sản phẩm */}
                    <Typography variant="h6" fontWeight="bold">
                      {selectedProduct.name}<span> </span>{selectedProduct.color}
                    </Typography>

                    {/* Thông tin sản phẩm */}
                    <Typography variant="body1">
                      <b>Loại giày:</b> {selectedProduct.category} {' '}
                      <b>Thương hiệu:</b> {selectedProduct.brand}
                    </Typography>

                    {/* Giá sản phẩm */}
                    <Typography sx={{ mt: 1 }}>
                      <span>
                        {selectedProduct.price.toLocaleString()} VNĐ
                      </span>
                    </Typography>

                    {/* Size sản phẩm */}
                    <Typography sx={{ mt: 1 }}>
                      <b>Size:</b> {selectedProduct.size}
                    </Typography>

                    {/* Chọn số lượng */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                        onClick={() => handleQuantityChange('decrease')}
                      >
                        -
                      </Button>
                      <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                        onClick={() => handleQuantityChange('increase')}
                      >
                        +
                      </Button>
                    </Box>

                    {/* Nút xác nhận */}
                    <Button
                      variant="contained"
                      sx={{ width: '100%', mt: 2, color: '#fff', backgroundColor: '#1976D2' }}
                      onClick={handleCloseConfirmModal}
                    >
                      XÁC NHẬN
                    </Button>
                  </Box>
                </Modal>
              )}
            </>
          </Box>
        </Box>
      </Modal>
      {/* Gọi Modal */}
      <Modal open={openDC} onClose={handleCloseDC}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Danh sách Địa chỉ</Typography>
            <IconButton onClick={handleCloseDC}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Table hiển thị danh sách địa chỉ */}
          <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tên người nhận</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Số điện thoại</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Địa chỉ</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addresses.map((address, index) => (
                  <TableRow key={address.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{recipientName}</TableCell>
                    <TableCell>{recipientPhone}</TableCell>
                    <TableCell>
                      {`${address.soNha}, ${address.duong}, ${address.xa}, ${address.huyen}, ${address.thanhPho}`}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" onClick={() => handleSelectAddress(address)}>
                        CHỌN
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>

          {/* Nút thêm địa chỉ */}
          <Button variant="contained" color="warning" sx={{ mt: 2 }} fullWidth>
            THÊM ĐỊA CHỈ
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

// Style cho modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

export default BanTaiQuay;
