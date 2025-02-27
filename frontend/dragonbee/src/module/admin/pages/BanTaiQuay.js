import React, { useState, useEffect, useRef } from 'react'; // Thêm useEffect ở đây
import axios from 'axios';
import {
  Box, Button, Typography, IconButton, Snackbar, Alert
  , FormControlLabel, Switch, InputLabel, Select, MenuItem, FormControl, TextField,
  InputAdornment, Input, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, ListItemText,
  ClickAwayListener, ListItem, List, Popper, Modal, Slider, span
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { Remove as RemoveIcon } from "@mui/icons-material";


const BanTaiQuay = () => {

  // State để lưu danh sách các đơn hàng
  const [orders, setOrders] = useState([]);
  // const [isShowOrders, setIsShowOrders] = useState(false); // Trạng thái để kiểm soát hiển thị đơn hàng
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
  //khai báo voucher
  const [openVoucherModal, setOpenVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState('');

  const [imageIndexes, setImageIndexes] = useState({});//Biến lưu giá trị key(idSPCT từ HDCT) cùng index hình ảnh hiện tại tại giỏ hàng
  const [imageIndexesThemSanPham, setImageIndexesThemSanPham] = useState({});//Biến lưu giá trị key(idSPCT từ HDCT) cùng index hình ảnh hiện tại tại thêm sản phẩm vào giỏ hàng 
  const [openConfirmModal, setOpenConfirmModal] = useState(false);//Mở confirm có muốn xóa sản phẩm khỏi giỏ hàng không
  const [selectedProductId, setSelectedProductId] = useState(null);//Lưu ID sản phẩm được chọn trong giỏ hàng
  const [tempValues, setTempValues] = useState({}); // State tạm để lưu giá trị nhập vào của từng sản phẩm trong giỏ hàng
  const [products, setProducts] = useState([]);//Các sản phẩm của cửa hàng để bán
  const [danhMuc, setDanhMuc] = useState(0); // Giá trị của bộ lọc danh mục
  const [mauSac, setMauSac] = useState(0); // Giá trị của bộ lọc màu sắc
  const [chatLieu, setChatLieu] = useState(0); // Giá trị của bộ lọc chất liệu
  const [kichCo, setKichCo] = useState(0); // Giá trị của bộ lọc sizw
  const [kieuDang, setKieuDang] = useState(0); // Giá trị của bộ lọc kiểu dáng
  const [thuongHieu, setThuongHieu] = useState(0); // Giá trị của bộ lọc thương hiệu
  const [phongCach, setPhongCach] = useState(0); // Giá trị của bộ lọc phong cách
  const [timKiem, setTimKiem] = useState(""); // Giá trị của bộ lọc tìm kiếm sản phẩm
  const [listDanhMuc, setListDanhMuc] = useState([]);
  const [listChatLieu, setListChatLieu] = useState([]);
  const [listKichCo, setListKichCo] = useState([]);
  const [listKieuDang, setListKieuDang] = useState([]);
  const [listMauSac, setListMauSac] = useState([]);
  const [listPhongCach, setListPhongCach] = useState([]);
  const [listThuongHieu, setListThuongHieu] = useState([]);

  //khai báo sản phẩm
  // State để mở modal
  const [openSPModal, setOpenSPModal] = useState(false); //giá trị mở đống modal add sản paharm
  const [value, setValue] = useState([100000, 3200000]);//giá trị slider khoảng giá

  const [selectedProduct, setSelectedProduct] = useState(null);//sản phẩm add được chọn
  const [quantity, setQuantity] = useState(1);//số lượng sản phẩm được thêm vào giỏ hàng
  const [debouncedValue, setDebouncedValue] = useState(value);//giá trị khoảng giá

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

  // Hàm xử lý khi người dùng chọn khách hàng
  const handleSelectCustomer = (customer) => {
    setKeyword(`${customer.tenKhachHang} - ${customer.sdt}`); // Cập nhật TextField
    setSelectedCustomerId(customer.id); // Lưu ID khách hàng được chọn
    setOpenKH(false); // Đóng Popper
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

  // State cho các dropdown
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');

  const handleCityChange = (event) => setCity(event.target.value);
  const handleDistrictChange = (event) => setDistrict(event.target.value);
  const handleWardChange = (event) => setWard(event.target.value);

  //Hàm mở giao hàng
  const handleSwitchChange = (event) => {
    setShowLeftPanel(event.target.checked);
  };







  ///



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
      }
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
      }
    });
  };



  //Hàm cập nhật id hóa đơn được chọn
  const handleSelectOrder = (order) => {
    setSelectedOrder(order); // Cập nhật id của hóa đơn đã chọn
  };

  // Hàm để thêm hóa đơn mới
  const addOrder = async () => {
    if (orders.length === 5) {
      // setErrorMessage('Chỉ được thêm tối đa 5 hóa đơn');
      // setOpenSnackbar(true); // Mở Snackbar khi vượt quá số lượng
      showErrorToast("Chỉ được thêm tối đa 5 hóa đơn");
      return;
    }
    let apiUrl = "http://localhost:8080/ban-hang-tai-quay/addHoaDonTaiQuay";

    try {
      const response = await axios.get(apiUrl);//Gọi api bằng axiosGet
      if (response.data) {
        showSuccessToast("Thêm hóa đơn thành công");
        fetchOrders();
      } else {
        showErrorToast("Thêm hóa đơn thất bại thử lại sau");
      }

    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Lỗi khi chạy API add hóa đơn rồi lấy List về");
    }
  };

  //Hàm lấy dữu liệu hóa đơn tại quầy
  const fetchOrders = async () => {
    let apiUrl = "http://localhost:8080/ban-hang-tai-quay/layHoaDonTaiQuay";
    try {
      const response = await axios.get(apiUrl);//Gọi api bằng axiosGet
      setTempValues({});
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Không lấy được list hóa đơn tại quầy");
    }
  }


  //Hàm tăng số lượng sản phẩm trong giỏ hàng
  const tangSoLuong = async (id) => {
    let apiUrl = `http://localhost:8080/ban-hang-tai-quay/tangSoLuong/${id}`;
    try {
      const response = await axios.post(apiUrl);//Gọi api bằng axiosGet
      if (response.data === true) {
        fetchOrders();
      } else {
        showErrorToast("Rất tiếc đã hết sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Lỗi khi tăng số lượng sản phẩm");
    }
  }
  //Hàm giảm số lượng sản phẩm trong giỏ hàng 
  const giamSoLuong = async (id) => {
    let apiUrl = `http://localhost:8080/ban-hang-tai-quay/giamSoLuong/${id}`;
    try {
      const response = await axios.post(apiUrl);//Gọi api bằng axiosGet
      if (response.data === true) {
        fetchOrders();
      } else {
        setSelectedProductId(id);// Lấy id được chọn để confirm thao tác với sản phẩm
        setOpenConfirmModal(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Lỗi khi giảm số lượng sản phẩm");
    }
  }

  //Hàm confirm xóa sản phẩm khỏi giỏ hàng
  const handleConfirmDelete = async () => {
    xoaSanPham(selectedProductId);
    setOpenConfirmModal(false);
  };

  const xoaSanPham = async (id) => {
    let apiUrl = `http://localhost:8080/ban-hang-tai-quay/xoaSanPham/${id}`;
    try {
      const response = await axios.post(apiUrl);//Gọi api bằng axiosGet
      if (response.data === true) {
        fetchOrders();
        showSuccessToast("Xóa sản phẩm thành công");
      } else {
        showErrorToast("Xóa thất bại vui lòng thử lại");

      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Xóa thất bại vui lòng thử lại");
    }
  }



  //Cập nhật giá trị khi thay đổi số lượng sản phẩm trong giỏ hàng nhập bàn phím
  const handleInputChange = (id, value) => {
    setTempValues((prev) => ({
      ...prev,
      [id]: value, // Cập nhật giá trị nhập vào
    }));
  };

  //Xử lý khi MỞ modal confirm thêm sản phẩm vào giỏ hàng
  const handleOpenConfirmModal = (product) => {
    setSelectedProduct(product);
    setOpenConfirmModal(true);
  };

  //Xử lý khi confirm thêm vào giỏ hàng
  const handleCloseConfirmModal = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/ban-hang-tai-quay/addSanPhamVaoGioHang`, { idHoaDon: selectedOrder.id, idSanPhamChiTiet: selectedProduct.id, soLuong: quantity, donGia: selectedProduct.gia }
      );
      if (response.data) {
        setSelectedProduct(null);
        setQuantity(1);
        setOpenConfirmModal(false);
        getSanPhamThem();
        showSuccessToast("Thêm sản phẩm thành công");
      } else {
        showErrorToast("Thêm sản phẩm thất bại");
      }
    } catch (error) {
      showErrorToast("Thêm sản phẩm thất bại. Vui lòng thử lại!");
      console.error(error.response || error.message);
    }
  };

  //Cập nhật giá trị khi thay đổi số lượng nhập từ bàn phím
  const handleInputChangeThemSanPhamVaoGioHang = (value) => {
    if (value === 0) {
      setQuantity(1);
      return;
    }

    setQuantity(value);

    //Độ trể xóa nếu không hợp lệ
    setTimeout(() => {
      if (value > selectedProduct.soLuong) {
      value = value.toString().slice(0, -1) || selectedProduct.soLuong;
    }
      setQuantity(value);
    }, 200); // Độ trễ 1 giây
  };



  //Hàm xử lý nhập số lượng
  const nhapSoLuong = async (id, soLuong) => {
    let apiUrl = `http://localhost:8080/ban-hang-tai-quay/nhapSoLuong/${id}/${soLuong}`;
    try {
      const response = await axios.post(apiUrl);//Gọi api bằng axiosGet
      if (response.data === true) {
        fetchOrders();
      } else {
        fetchOrders();
        showErrorToast("Số lượng trong kho không đủ cung cấp hoàn toàn số lượng bạn muốn");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Lỗi khi nhập số lượng sản phẩm catch");
    }
  }

  //Kho nhập số lượng bàn phím và thoát focus nhập số lượng
  const handleInputBlur = (id) => {
    setSelectedProductId(id);
    const newValue = Number(tempValues[id]);
    if (newValue >= 1) {
      nhapSoLuong(id, newValue); // Gọi API cập nhật số lượng khi mất focus
    } else {
      setSelectedProductId(id);
      setOpenConfirmModal(true);
    }
  };



  //Hàm lọcThemSanPhamHoaDonTaiQuay
  const getSanPhamThem = async () => {
    let apiUrl = "http://localhost:8080/ban-hang-tai-quay/layListCacSanPhamHienThiThem";
    // Xây dựng query string
    const params = new URLSearchParams();
    params.append("timKiem", timKiem);//Truyền vào loại đơn
    params.append("fromGia", value[0]);//Truyền vào loại đơn
    params.append("toGia", value[1]);//Truyền vào loại đơn
    params.append("danhMuc", danhMuc);//Truyền vào loại đơn
    params.append("mauSac", mauSac);//Truyền vào loại đơn
    params.append("chatLieu", chatLieu);//Truyền vào loại đơn
    params.append("kichCo", kichCo);//Truyền vào loại đơn
    params.append("kieuDang", kieuDang);//Truyền vào loại đơn
    params.append("thuongHieu", thuongHieu);//Truyền vào loại đơn
    params.append("phongCach", phongCach);//Truyền vào loại đơn
    try {
      const response = await axios.get(`${apiUrl}?${params.toString()}`);//Gọi api bằng axiosGet
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Lỗi khi lấy dữ liệu sản phẩm để thêm vào giỏ hàng")
    }
  };



  //get set toàn bộ bộ lọc
  const getAndSetToanBoBoLoc = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/ban-hang-tai-quay/layListDanhMuc`);
      var doiTuongCoCacThuocTinhListCacBoLoc = response.data;
      setListDanhMuc(doiTuongCoCacThuocTinhListCacBoLoc.listDanhMuc);
      setListMauSac(doiTuongCoCacThuocTinhListCacBoLoc.listMauSac);
      setListChatLieu(doiTuongCoCacThuocTinhListCacBoLoc.listChatLieu);
      setListKichCo(doiTuongCoCacThuocTinhListCacBoLoc.listSize);
      setListKieuDang(doiTuongCoCacThuocTinhListCacBoLoc.listKieuDang);
      setListThuongHieu(doiTuongCoCacThuocTinhListCacBoLoc.listThuongHieu);
      setListPhongCach(doiTuongCoCacThuocTinhListCacBoLoc.listPhongCach);
    } catch (err) {
      console.log(err)
      showErrorToast("Lỗi lấy dữ liệu bộ lọc");
    }
  };

  //Hàm load ảnh sản phẩm để thêm vào giỏ hàng
  useEffect(() => {
    if (!products) return;
    const interval = setInterval(() => {
      setImageIndexesThemSanPham((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        products.forEach((product) => {
          if (product.hinhAnh.length > 1) {
            newIndexes[product.id] = (prevIndexes[product.id] + 1) % product.hinhAnh.length || 0;
          }
        });
        return newIndexes;
      });
    }, 3000); // Chuyển ảnh sau mỗi 3 giây
    return () => clearInterval(interval);
  }, [products]);

  //Hàm xử lý khi đóng mở modal
  useEffect(() => {
    if (openSPModal) { // Khi mở modal add sản phẩm vào giỏ hàng thì load bộ lọc và sản phẩm thêm
      getAndSetToanBoBoLoc();
      getSanPhamThem();
    }
    else { // Khi modal add sản phẩm vào giỏ hàng đóng thì load lại hóa đơn
      fetchOrders();
    }
  }, [openSPModal]);

  //Tạo độ trễ cho ô tìm kiếm
  useEffect(() => {
    const handler = setTimeout(() => {
      getSanPhamThem();
    }, 800); // Chờ 800ms sau khi user dừng nhập
    return () => clearTimeout(handler); // Hủy timeout nếu user nhập tiếp
  }, [timKiem]);

  //Tạo độ trễ khi kéo slider khoảng giá
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value); // Chỉ cập nhật giá trị sau 1.5s
    }, 1500);
    return () => clearTimeout(handler); // Xóa timeout nếu người dùng tiếp tục kéo
  }, [value]);

  //Khi bộ lọc khoảng giá thay đổi
  useEffect(() => {
    getSanPhamThem();
  }, [debouncedValue]);

  //Khi thay đổi bộ lọc
  useEffect(() => {
    getSanPhamThem();
  }, [danhMuc, mauSac, chatLieu, kichCo, kieuDang, thuongHieu, phongCach]);

  useEffect(() => {
    if (selectedOrder) {
      // Tìm order mới trong danh sách orders
      const updatedOrder = orders.find(order => order.id === selectedOrder.id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      } else {
        setSelectedOrder(null); // Nếu không tìm thấy, đặt lại null
      }
    }
  }, [orders]);

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
      <Dialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
        <DialogContent>Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?</DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setTempValues((prev) => ({
              ...prev,
              [selectedProductId]: selectedOrder.listDanhSachSanPham.find((p) => p.id === selectedProductId)?.soLuong || 1, // Reset nếu nhập sai
            }));
            setOpenConfirmModal(false)
          }} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer /> {/* Quan trọng để hiển thị toast */}
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
          onClick={addOrder}
        >
          + Tạo đơn hàng
        </Button>
      </Box>

      {/* Hiển thị các đơn hàng */}
      {orders.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #E0E0E0' }}>
          {orders.map((order) => (

            <Box
              key={order.id}
              sx={{
                padding: '10px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'start',
                gap: '8px',
                cursor: 'pointer',
                borderBottom: selectedOrder?.id === order.id ? '2px solid #1E88E5' : 'none', // Đường kẻ dưới khi chọn
                '&:hover': {
                  borderColor: '#FF8C00',
                },
              }}
              onClick={() => handleSelectOrder(order)} // Chọn đơn hàng khi click
            >
              <Typography
                variant="body2"
                sx={{
                  color: selectedOrder?.id === order.id ? '#1E88E5' : 'inherit', // Màu chữ xanh dương khi chọn
                  fontWeight: selectedOrder?.id === order.id ? 'bold' : 'normal', // Đậm chữ khi chọn
                }}
              >
                {order.ma}
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

                }}
              >
                <CloseIcon sx={{ fontSize: '16px' }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Khi không có đơn nào */}
      {orders.length <= 0 && (
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
      {orders.length > 0 && (
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
                    onClick={() => setOpenSPModal(true)}  // Khi nhấn vào button, mở modal
                  >
                    Thêm Sản Phẩm
                  </Button>
                </Box>
              </Box>
            </Box>
            {selectedOrder === null ? (
              <Box sx={{ textAlign: 'center', position: 'relative', marginBottom: 5 }}>
                <img
                  src="https://img.freepik.com/premium-vector/result-not-found_878233-777.jpg" // Placeholder image
                  alt="No data"
                  style={{ width: '150px', height: 'auto' }}
                />
                <Typography variant="h6" sx={{ marginTop: '-40px' }}>Chưa chọn hóa đơn nào</Typography>
              </Box>
            ) : (

              <Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>#</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Hình ảnh</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Sản phẩm</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số lượng</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Đơn giá</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số tiền</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.listDanhSachSanPham?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Box sx={{ textAlign: 'center', position: 'relative', marginBottom: 5 }}>
                              <img
                                src="https://img.freepik.com/premium-vector/result-not-found_878233-777.jpg" // Placeholder image
                                alt="No data"
                                style={{ width: '150px', height: 'auto' }}
                              />
                              <Typography variant="h6" sx={{ marginTop: '-40px' }}>Giỏ hàng hóa đơn {selectedOrder?.ma} của bạn chưa có sản phẩm nào!
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        selectedOrder.listDanhSachSanPham.map((product, index) => {
                          const images = product.hinhAnh || [];
                          const currentIndex = imageIndexes[product.id] ?? 0;
                          return (
                            <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="center">
                                {images.length > 0 && (
                                  <img
                                    src={images[currentIndex]}
                                    alt={`Ảnh ${currentIndex + 1}`}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "cover",
                                      borderRadius: "10px",
                                      transition: "transform 0.3s ease-in-out",
                                      boxShadow: "0px 0px 8px rgba(0,0,0,0.15)",
                                    }}
                                    onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                                    onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                  />
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <Typography>{product.tenMauSize}</Typography>
                                <Typography sx={{ color: "gray", fontSize: "0.85rem" }}>{product.maSanPhamChiTiet}</Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Box display="flex" justifyContent="center" alignItems="center">
                                  <Box display="flex" sx={{ border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden", width: "120px" }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => giamSoLuong(product.id)}
                                      disabled={product.quantity <= 1}
                                      sx={{ borderRight: "1px solid #ccc", background: "#f5f5f5", borderRadius: 0 }}
                                    >
                                      <RemoveIcon fontSize="small" />
                                    </IconButton>
                                    <TextField
                                      value={tempValues[product.id] ?? product.soLuong}
                                      onChange={(e) => handleInputChange(product.id, e.target.value)}
                                      onBlur={() => handleInputBlur(product.id)}
                                      type="number"
                                      inputProps={{ min: 1, style: { textAlign: "center" }, step: 1 }}
                                      size="small"
                                      sx={{
                                        width: "60px",
                                        "& .MuiInputBase-input": {
                                          textAlign: "center",
                                          padding: "5px 0",
                                          backgroundColor: "transparent"
                                        },
                                        "& .MuiOutlinedInput-root": {
                                          border: "none",
                                          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                          "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" }
                                        },
                                        "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                                          WebkitAppearance: "none",
                                          margin: 0
                                        }
                                      }}
                                    />
                                    <IconButton
                                      size="small"
                                      onClick={() => tangSoLuong(product.id)}
                                      sx={{ borderLeft: "1px solid #ccc", background: "#f5f5f5", borderRadius: 0 }}
                                    >
                                      <AddIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell align="center">{product.donGia?.toLocaleString()}₫</TableCell>
                              <TableCell align="center">{product.soTien?.toLocaleString()}₫</TableCell>
                              <TableCell align="center" onClick={() => { setSelectedProductId(product.id); setOpenConfirmModal(true) }} >
                                <IconButton color="error">
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Box hiển thị tổng tiền */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <Box></Box>
                  <Box>
                    <Typography component="span" variant="body1" sx={{ mr: 2 }}>Tổng tiền:</Typography>
                    <Typography component="span" fontSize={20} sx={{ fontWeight: 'bold', color: 'red', marginRight: 3 }}>
                      0 VNĐ
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
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
                    <Typography variant="h6" marginBottom={2} marginTop={2}>Thông tin khách hàng</Typography>
                    <TextField fullWidth label="Tên người nhận" variant="outlined" size='small' sx={{ marginBottom: '16px' }} />
                    <TextField fullWidth label="Số điện thoại" variant="outlined" size='small' sx={{ marginBottom: '16px' }} />
                    <TextField fullWidth label="Địa chỉ" variant="outlined" size='small' sx={{ marginBottom: '16px' }} />

                    {/* Các dropdowns chỉ hiển thị khi showLeftPanel là true */}
                    <FormControl fullWidth sx={{ marginBottom: '16px' }} size='small'>
                      <InputLabel>Tỉnh/Thành phố</InputLabel>
                      <Select value={city} onChange={handleCityChange} label="Tỉnh/Thành phố">
                        <MenuItem value="Son La">Son La</MenuItem>
                        <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                        <MenuItem value="Hồ Chí Minh">Hồ Chí Minh</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: '16px' }} size='small'>
                      <InputLabel>Quận/Huyện</InputLabel>
                      <Select value={district} onChange={handleDistrictChange} label="Quận/Huyện">
                        <MenuItem value="Quyen">Huyện Quỳnh</MenuItem>
                        <MenuItem value="Cau Giay">Cầu Giấy</MenuItem>
                        <MenuItem value="Go Vap">Gò Vấp</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: '16px' }} size='small'>
                      <InputLabel>Xã/Phường</InputLabel>
                      <Select value={ward} onChange={handleWardChange} label="Xã/Phường">
                        <MenuItem value="Xa Muong Gi">Xã Mường Già</MenuItem>
                        <MenuItem value="Tan Mai">Tân Mai</MenuItem>
                        <MenuItem value="Quang Trung">Quang Trung</MenuItem>
                      </Select>
                    </FormControl>
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
                  <Typography variant="h6" marginTop={2}>Thông tin thanh toán</Typography>
                  {/* Nút Switch điều khiển việc hiển thị/ẩn bên trái */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <FormControlLabel
                      control={<Switch checked={showLeftPanel} onChange={handleSwitchChange} />}
                      label="Giao hàng"
                    />
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
          <TableContainer component={Paper} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
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
        onClose={() => setOpenSPModal(false)} // Khi nhấn ngoài modal hoặc nhấn nút đóng sẽ đóng modal
      >
        <Box sx={style}>
          {/* Nút đóng modal */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => { setOpenSPModal(false) }}
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
                value={timKiem}
                label="Tìm kiếm sản phẩm theo tên, mã sản phẩm"
                variant="outlined"
                fullWidth
                size='small'
                sx={{ marginBottom: 2 }}
                onChange={(e) => setTimKiem(e.target.value)}
              />
            </Grid>
            <Grid item xs={4} marginLeft={10} marginTop={3}>
              <Slider
                value={value}
                onChange={(e, newValue) => setValue(newValue)} // Sửa lại đúng cú pháp
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${value.toLocaleString()} VNĐ`}
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

            <Grid item>
              {/* ✅ Làm cho label (Danh mục, Màu sắc, ...) đậm */}
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Danh mục</Typography>
                <Select
                  value={danhMuc}//Sửa lại chỗ này
                  onChange={(e) => setDanhMuc(e.target.value)}
                >
                  <MenuItem value="0" selected>Tất cả</MenuItem>
                  {listDanhMuc?.map((item, index) => (
                    <MenuItem value={item.id} key={item.id}>{item.tenDanhMuc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              {/* ✅ Làm cho label (Danh mục, Màu sắc, ...) đậm */}
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Màu sắc</Typography>
                <Select
                  value={mauSac}//Sửa lại chỗ này
                  onChange={(e) => setMauSac(e.target.value)}
                >
                  <MenuItem value="0" selected>Tất cả</MenuItem>
                  {listMauSac?.map((item, index) => (
                    <MenuItem value={item.id} key={item.id}>{item.tenMauSac}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item >
              {/* ✅ Làm cho label (Danh mục, Màu sắc, ...) đậm */}
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Chất liệu</Typography>
                <Select
                  value={chatLieu}//Sửa lại chỗ này
                  onChange={(e) => setChatLieu(e.target.value)}
                >
                  <MenuItem value="0" selected>Tất cả</MenuItem>
                  {listChatLieu?.map((item, index) => (
                    <MenuItem value={item.id} key={item.id}>{item.tenChatLieu}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              {/* ✅ Làm cho label (Danh mục, Màu sắc, ...) đậm */}
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Kích cỡ</Typography>
                <Select
                  value={kichCo}//Sửa lại chỗ này
                  onChange={(e) => setKichCo(e.target.value)}
                >
                  <MenuItem value="0" selected>Tất cả</MenuItem>
                  {listKichCo?.map((item, index) => (
                    <MenuItem value={item.id} key={item.id}>{item.tenSize}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item >
              {/* ✅ Làm cho label (Danh mục, Màu sắc, ...) đậm */}
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Kiểu dáng</Typography>
                <Select
                  value={kieuDang}//Sửa lại chỗ này
                  onChange={(e) => setKieuDang(e.target.value)}
                >
                  <MenuItem value="0" selected>Tất cả</MenuItem>
                  {listKieuDang?.map((item, index) => (
                    <MenuItem value={item.id} key={item.id}>{item.tenKieuDang}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              {/* ✅ Làm cho label (Danh mục, Màu sắc, ...) đậm */}
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Thương hiệu</Typography>
                <Select
                  value={thuongHieu}//Sửa lại chỗ này
                  onChange={(e) => setThuongHieu(e.target.value)}
                >
                  <MenuItem value="0" selected>Tất cả</MenuItem>
                  {listThuongHieu?.map((item, index) => (
                    <MenuItem value={item.id} key={item.id}>{item.tenThuongHieu}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item >
              {/* ✅ Làm cho label (Danh mục, Màu sắc, ...) đậm */}
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Phong cách</Typography>
                <Select
                  value={phongCach}//Sửa lại chỗ này
                  onChange={(e) => setPhongCach(e.target.value)}
                >
                  <MenuItem value="0" selected>Tất cả</MenuItem>
                  {listPhongCach?.map((item, index) => (
                    <MenuItem value={item.id} key={item.id}>{item.tenPhongCach}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

          </Grid>

          {/* Bảng sản phẩm */}
          <Box sx={{ overflowX: 'auto' }}>
            <>
              {/* Table hiển thị danh sách sản phẩm */}
              <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>#</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Ảnh</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>TênMauSize Mã sản phẩm</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Chất liệu</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Danh mục</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Thương hiệu-Xuất xứ</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Kiểu dáng</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Phong cách</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Giá</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số lượng</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Trạng thái</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products?.length > 0 ? (
                      products?.map((product, index) => {
                        const images = product.hinhAnh || [];
                        const currentIndex = imageIndexesThemSanPham[product.id] ?? 0;
                        return (
                          <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="center">
                              {images.length > 0 && (
                                <img
                                  src={images[currentIndex]}
                                  alt={`Ảnh ${currentIndex + 1}`}
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                    transition: "transform 0.3s ease-in-out",
                                    boxShadow: "0px 0px 8px rgba(0,0,0,0.15)",
                                  }}
                                  onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                                  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Typography >{product.tenMauSize}</Typography>
                              <Typography sx={{ color: "gray", fontSize: "0.85rem" }}>{product.ma}</Typography>
                            </TableCell>
                            <TableCell align="center">{product.chatLieu}</TableCell>
                            <TableCell align="center">{product.danhMuc}</TableCell>
                            <TableCell align="center">{product.thuongHieuXuatXu}</TableCell>
                            <TableCell align="center">{product.kieuDang}</TableCell>
                            <TableCell align="center">{product.phongCach}</TableCell>
                            <TableCell align="center">{product.gia.toLocaleString()} đ</TableCell>
                            <TableCell align="center">{product.soLuong}</TableCell>
                            <TableCell align="center">{product.trangThai}</TableCell>
                            <TableCell align="center">{product.trangThai}</TableCell>
                            <TableCell>
                              <Button variant="outlined" onClick={() => handleOpenConfirmModal(product)}>Chọn</Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow align="center" dis>
                        <TableCell colSpan={13} align="center" sx={{ py: 2, fontStyle: "italic", color: "gray" }}>
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Modal xác nhận khi bấm "Chọn" */}
              {selectedProduct && (
                <Modal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
                  <Box
                    sx={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      width: 400, bgcolor: 'white', p: 3, boxShadow: 24, borderRadius: 2
                    }}
                  >
                    {/* Nút đóng Modal */}
                    <IconButton
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => { setQuantity(1);fetchOrders(); setOpenConfirmModal(false) }}
                    >
                      <CloseIcon />
                    </IconButton>

                    {/* Tiêu đề sản phẩm */}
                    <Typography variant="h6" fontWeight="bold">
                      {selectedProduct?.tenMauSize}-{selectedProduct?.ma}
                    </Typography>

                    {/* Giá sản phẩm */}
                    <Typography sx={{ mt: 1 }}>
                      <span>
                        {selectedProduct.gia.toLocaleString()} VNĐ
                      </span>
                    </Typography>

                    {/* Chọn số lượng */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Box display="flex" sx={{ border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden", width: "120px" }}>
                          <IconButton
                            size="small"
                            onClick={() => setQuantity(prev => prev - 1)}

                            disabled={quantity <= 1}
                            sx={{ borderRight: "1px solid #ccc", background: "#f5f5f5", borderRadius: 0 }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            value={quantity}
                            onChange={(e) => handleInputChangeThemSanPhamVaoGioHang(e.target.value)}
                            // onBlur={() => handleInputBlur(product.id)}
                            type="number"
                            inputProps={{ min: 1, style: { textAlign: "center" }, step: 1 }}
                            size="small"
                            sx={{
                              width: "60px",
                              "& .MuiInputBase-input": {
                                textAlign: "center",
                                padding: "5px 0",
                                backgroundColor: "transparent"
                              },
                              "& .MuiOutlinedInput-root": {
                                border: "none",
                                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" }
                              },
                              "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                                WebkitAppearance: "none",
                                margin: 0
                              }
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => setQuantity(prev => prev + 1)}
                            disabled={quantity >= selectedProduct.soLuong}
                            sx={{ borderLeft: "1px solid #ccc", background: "#f5f5f5", borderRadius: 0 }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
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
