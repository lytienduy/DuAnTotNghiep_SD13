import React, { useState, useEffect, useRef } from 'react'; // Thêm useEffect ở đây
import axios from 'axios';
import {
  Box, Button, Typography, IconButton, Snackbar, Alert
  , FormControlLabel, Switch, InputLabel, Select, MenuItem, FormControl, TextField,
  InputAdornment, Input, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, ListItemText,
  ClickAwayListener, ListItem, List, Popper, Modal, Slider, DialogContentText
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
import soldOutImg from '../../../img/sold-out.png';
import inactiveImg from '../../../img/inactive.png';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import QrScanner from "react-qr-scanner";
import { Html5QrcodeScanner } from "html5-qrcode";
import HoaDonPrint from "./HoaDonPrint";

const BanTaiQuay = () => {
  //Khai báo Thành phố huyện xã
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  //Thêm mới địa chỉ
  const [newCities, setNewCities] = useState([]);
  const [newDistricts, setNewDistricts] = useState([]);
  const [newWards, setNewWards] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newWard, setNewWard] = useState('');
  const [openChonDC, setOpenChonDC] = useState(false);

  // State để lưu danh sách các đơn hàng
  const [orders, setOrders] = useState([]);
  // const [isShowOrders, setIsShowOrders] = useState(false); // Trạng thái để kiểm soát hiển thị đơn hàng
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // State để điều khiển việc hiển thị/ẩn màn bên trái
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [openTT, setOpenTT] = useState(false);
  const [tienKhachDua, setTienKhachDua] = useState(0);
  const [tienKhachChuyen, setTienKhachChuyen] = useState(0);
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
  const [discountAmount, setDiscountAmount] = useState(0);
  const [imageIndexes, setImageIndexes] = useState({});//Biến lưu giá trị key(idSPCT từ HDCT) cùng index hình ảnh hiện tại tại giỏ hàng
  const [imageIndexesThemSanPham, setImageIndexesThemSanPham] = useState({});//Biến lưu giá trị key(idSPCT từ HDCT) cùng index hình ảnh hiện tại tại thêm sản phẩm vào giỏ hàng 
  const [openConfirmModal, setOpenConfirmModal] = useState(false);//Mở confirm có muốn xóa sản phẩm khỏi giỏ hàng không
  const [selectedProductId, setSelectedProductId] = useState(null);//Lưu ID sản phẩm được chọn trong giỏ hàng
  const [checkSelectedOrder, setCheckSelectedOrder] = useState(null);//Lưu ID sản phẩm được chọn trong giỏ hàng
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

  //State khai báo hủy hóa đơn
  const [openLyDo, setOpenLyDo] = useState(false);  // Biến lưu giá trị mở modal nhập lý do khi thực hiện chức năng hủy hóa đơn
  const [openConfirm, setOpenConfirm] = useState(false); // Mở modal xác nhận
  const [ghiChuTrangThai, setGhiChuTrangThai] = useState("");
  const [error, setError] = useState(false);//Biến báo lỗi
  const [idOrderCanXoa, setIdOrderCanXoa] = useState(null);//Biến báo lỗi
  const tongTienKhachDaThanhToan = selectedOrder?.listThanhToanHoaDon
    ?.reduce((total, item) => total + item.soTien, 0) || 0;

  //State thông báo lỗi xác nhận thanh toán hóa đơn
  const [errorTienKhachChuyen, setErrorTienKhachChuyen] = useState("");
  const [errorTienKhachDua, setErrorTienKhachDua] = useState("");
  const [errorSoLuongThemVaoGioHang, setErrorSoLuongThemVaoGioHang] = useState("");
  const [openConfirmXacNhanDatHang, setOpenConfirmXacNhanDatHang] = useState(false);
  const [openQRQuetSanPham, setOpenQRQuetSanPham] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [qrScanner, setQrScanner] = useState(null);
  const [nhuCauInHoaDon, setNhuCauInHoaDon] = useState(false);



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

    const customerId = selectedCustomerId ? selectedCustomerId : null;

    try {
      const params = { keyword };
      if (customerId) {
        params.idKhachHang = customerId;
      }

      const response = await axios.get('http://localhost:8080/dragonbee/tim-kiem-phieu-giam-gia', { params });
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  // Tự động chọn voucher tốt nhất khi fetch dữ liệu
  const fetchVouchers = async () => {
    try {
      const customerId = selectedCustomerId ? selectedCustomerId : null;
      const params = { keyword: '' };
      if (customerId) {
        params.idKhachHang = customerId;
      }

      const response = await axios.get('http://localhost:8080/dragonbee/tim-kiem-phieu-giam-gia', { params });

      // Sắp xếp dữ liệu theo ngày tạo (ngayTao)
      const sortedVouchers = response.data.sort((a, b) => {
        return new Date(b.ngayTao) - new Date(a.ngayTao);
      });

      // Tính toán giá trị giảm của tất cả các phiếu giảm giá
      const validVouchers = sortedVouchers.filter(voucher => selectedOrder?.tongTienSanPham >= voucher.soTienToiThieu);

      // Tìm voucher tốt nhất
      let bestVoucher = null;
      let bestDiscount = 0;

      validVouchers.forEach(voucher => {
        let discountAmount = 0;
        if (voucher.loaiPhieuGiamGia === "Cố định") {
          discountAmount = voucher.giaTriGiam;
        } else if (voucher.loaiPhieuGiamGia === "Phần trăm") {
          discountAmount = (selectedOrder?.tongTienSanPham || 0) * (voucher.giaTriGiam / 100);
          if (voucher.soTienGiamToiDa) {
            discountAmount = Math.min(discountAmount, voucher.soTienGiamToiDa);
          }
        }

        if (discountAmount > bestDiscount) {
          bestDiscount = discountAmount;
          bestVoucher = voucher;
        }
      });

      // Cập nhật voucher tốt nhất nếu có
      if (bestVoucher) {
        setSelectedVoucherCode(bestVoucher.ma);
        setDiscountAmount(bestDiscount);
      }

      // Cập nhật danh sách phiếu giảm giá
      setVouchers(sortedVouchers);

    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };


  // Gọi fetchVouchers khi modal mở lần đầu hoặc chưa có dữ liệu voucher
  useEffect(() => {
    if (openVoucherModal) {
      fetchVouchers();
    }
  }, [openVoucherModal, selectedCustomerId]); // Thêm selectedCustomerId vào dependency


  // Khi người dùng chọn một phiếu giảm giá
  const handleUseVoucher = (voucherCode) => {
    const selectedVoucher = vouchers.find(v => v.ma === voucherCode);
    if (!selectedVoucher) return;

    let discountAmount = 0;

    if (selectedVoucher.loaiPhieuGiamGia === "Cố định") {
      discountAmount = selectedVoucher.giaTriGiam;
    } else if (selectedVoucher.loaiPhieuGiamGia === "Phần trăm") {
      discountAmount = (selectedOrder?.tongTienSanPham || 0) * (selectedVoucher.giaTriGiam / 100);
      if (selectedVoucher.soTienGiamToiDa) {
        discountAmount = Math.min(discountAmount, selectedVoucher.soTienGiamToiDa);
      }
    }

    setSelectedVoucherCode(voucherCode);
    setDiscountAmount(discountAmount);
    handleCloseVoucherModal();
  };

  // Cập nhật UI để làm mờ và hiển thị thông báo nếu không đủ điều kiện
  const isVoucherValid = (voucher) => {
    return selectedOrder?.tongTienSanPham >= voucher.soTienToiThieu;
  };

  // Hàm để tính toán số tiền thiếu để áp dụng voucher
  const calculateAmountToSpend = (voucher) => {
    if (selectedOrder?.tongTienSanPham < voucher.soTienToiThieu) {
      return voucher.soTienToiThieu - selectedOrder?.tongTienSanPham;
    }
    return 0;
  };

  // Hàm fetchVouchers đã được cập nhật trong trước đó, bạn không cần thay đổi hàm này

  useEffect(() => {
    if (selectedOrder?.tongTienSanPham) {
      fetchVouchers(); // Gọi lại fetchVouchers mỗi khi tổng tiền thay đổi
    }
  }, [selectedOrder?.tongTienSanPham]); // Lắng nghe sự thay đổi của tổng tiền (tongTienSanPham)

  // Hàm để hiển thị thông báo thiếu tiền
  const renderAdditionalAmountMessage = (voucher) => {
    const amountToSpend = calculateAmountToSpend(voucher);
    if (amountToSpend > 0) {
      return (
        <Typography sx={{ color: 'red', marginTop: 1, fontSize: 12 }}>
          Bạn cần chi tiêu thêm {amountToSpend.toLocaleString()} VNĐ để áp dụng phiếu giảm giá này.
        </Typography>
      );
    }
    return null;
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
    setCity('');
    setDistrict('');
    setWard('');
    setSpecificAddress('');
    setDescription('');
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
      setCity(address.thanhPho); // Cập nhật vào giá trị của form

      const city = cities.find(c => c.Name === address.thanhPho);
      if (city) {
        setDistricts(city.Districts);
        setSelectedDistrict(address.huyen);
        setDistrict(address.huyen); // Cập nhật vào giá trị của form

        const district = city.Districts.find(d => d.Name === address.huyen);
        if (district) {
          setWards(district.Wards);
          setSelectedWard(address.xa);
          setWard(address.xa); // Cập nhật vào giá trị của form
        }
      }

      setSpecificAddress(`${address.soNha}, ${address.duong}`);
      setDescription(address.moTa || "");
    } else {
      setDescription("");
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

  // //fake data cho lịch sử thanh toán hóa đơn
  const data = [
    { id: 1, maGiaoDich: '', phuongThuc: 'Tiền mặt', soTien: 2127500 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  // Hàm để xử lý nhập liệu cho "phí ship"handleDiscountInput
  const handleDiscountInput = (e) => {
    var newValue = e.target.value.replace(/\D/g, ''); // Chỉ cho phép nhập số

    if (/^0+$/.test(newValue)) {
      newValue = "0";
    } else {
      newValue = newValue.replace(/^0+/, ''); // Xóa 0 thừa đầu
    }

    setDiscount(newValue);
  };

  // Hàm để xử lý nhập liệu cho "tiền khách đưa"
  const handleTienKhachDua = (e) => {
    let newValue = e.target.value.replace(/\D/g, ''); // Chỉ cho phép nhập số

    if (/^0+$/.test(newValue)) {
      newValue = "0";
    } else {
      newValue = newValue.replace(/^0+/, ''); // Xóa 0 thừa đầu
    }

    setTienKhachDua(newValue);
    // Kiểm tra lỗi ngay khi nhập
    if (Number(newValue) < 1000) {
      setErrorTienKhachDua("Số tiền khách đưa phải lớn hơn 1,000 VNĐ");
    } else {
      setErrorTienKhachDua(""); // Xóa lỗi nếu nhập đúng
    }
  };


  // Hàm để xử lý nhập liệu cho "tiền khách đưa"
  const handleTienKhachChuyen = (e) => {
    var newValue = e.target.value.replace(/\D/g, ''); // Chỉ cho phép nhập số

    if (/^0+$/.test(newValue)) {
      newValue = "0";
    } else {
      newValue = newValue.replace(/^0+/, ''); // Xóa 0 thừa đầu
    }
    setTienKhachChuyen(newValue);
    // Kiểm tra lỗi ngay khi nhập
    if (Number(newValue) < 1000) {
      setErrorTienKhachChuyen("Số tiền chuyển phải lớn hơn 1,000 VNĐ");
    } else {
      setErrorTienKhachChuyen(""); // Xóa lỗi nếu nhập đúng
    }
  };

  // Hàm sử dụng để gọi tỉnh thành quận huyện xã Việt Nam
  useEffect(() => {
    axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json")
      .then(response => {
        const normalizedCities = response.data.map(city => ({
          ...city,
          Name: city.Name.replace(/^(Thành phố |Tỉnh )/, ""), // Loại bỏ "Thành phố " và "Tỉnh "
        }));
        setCities(normalizedCities);  // Cập nhật citiess thay vì setCities
        setNewCities(normalizedCities);  // Cập nhật citiess thay vì setCities
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // Hàm mở modal
  const handleClickOpen = () => {
    setOpenChonDC(true);
  };

  // Hàm đóng modal
  const handleCloseChonDC = () => {
    // Chỉ reset các giá trị đã chọn, không xóa dữ liệu
    setNewCity('');  // Reset thành phố
    setNewDistrict('');  // Reset quận/huyện
    setNewWard('');  // Reset xã/phường

    setOpenChonDC(false);  // Đóng modal
  };


  const handleCityChange = (event) => {
    const cityName = event.target.value;
    setCity(cityName);  // Cập nhật giá trị của city
    setDistrict("");  // Reset quận/huyện khi thay đổi tỉnh thành
    setWard("");  // Reset xã/phường khi thay đổi quận/huyện

    const city = cities.find(city => city.Name === cityName);
    setDistricts(city ? city.Districts : []);  // Cập nhật danh sách quận/huyện
    setWards([]);  // Reset xã/phường
  };

  const handleDistrictChange = (event) => {
    const districtName = event.target.value;
    setDistrict(districtName);  // Cập nhật giá trị của district
    setWard("");  // Reset xã/phường khi thay đổi quận/huyện

    const district = districts.find(d => d.Name === districtName);
    setWards(district ? district.Wards : []);  // Cập nhật danh sách xã/phường
  };

  const handleWardChange = (event) => {
    setWard(event.target.value);
  };

  // Hàm thay đổi tỉnh thành cho modal
  const handleCityChangeModal = (event) => {
    const cityName = event.target.value;
    setNewCity(cityName);
    setNewDistrict(""); // Reset quận/huyện khi thay đổi tỉnh thành
    setNewWard(""); // Reset xã/phường khi thay đổi quận/huyện
    // Tìm thành phố đã chọn và cập nhật districtss
    const selectedCity = newCities.find(city => city.Name === cityName);
    setNewDistricts(selectedCity ? selectedCity.Districts : []);  // Cập nhật quận/huyện
    setNewWards([]);  // Reset xã/phường
  };

  // Hàm thay đổi quận/huyện cho modal
  const handleDistrictChangeModal = (event) => {
    const districtName = event.target.value;
    setNewDistrict(districtName);
    setNewWard(""); // Reset xã/phường khi thay đổi quận/huyện
    // Tìm quận/huyện đã chọn và cập nhật wardss
    const district = newDistricts.find(d => d.Name === districtName);
    setNewWards(district ? district.Wards : []);  // Cập nhật danh sách xã/phường
  };

  // Hàm thay đổi xã/phường cho modal
  const handleWardChangeModal = (event) => {
    setNewWard(event.target.value);
  };

  //Hàm mở giao hàng
  const handleSwitchChange = (event) => {
    setShowLeftPanel(event.target.checked);
  };








  ///


  //Quét QR
  // const handleScan = (data) => {
  //   console.log("Đã scan");
  //   console.log(data);

  //   if (data) {
  //     setQrData(data);
  //     setOpenQRQuetSanPham(false); // Đóng camera sau khi quét thành công
  //   }
  // };

  // const handleError = (err) => {
  //   console.error(err);
  // };
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false); // Trạng thái đang quét
  const handleCloseQRScanner = () => {
    setOpenQRQuetSanPham(false); // Đóng modal
  
    if (scannerRef.current) {
      try {
        scannerRef.current.clear()
          .then(() => {
            console.log("Scanner đã dừng");
            isScanningRef.current = false;
            scannerRef.current = null; // Reset scanner để tránh lỗi
          })
          .catch(err => console.error("Lỗi dừng scanner:", err));
      } catch (error) {
        console.error("Scanner không thể dừng:", error);
      }
    }
  };
  useEffect(() => {
    if (openQRQuetSanPham && !isScanningRef.current) {
      setTimeout(() => {
        const readerElement = document.getElementById("reader");

        if (readerElement) {
          const scanner = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: 250,
            disableFlip: false,
          });

          scanner.render(
            (decodedText) => {
              setScannedData(decodedText);
              console.log("Đã quét được:", decodedText);

              handleCloseQRScanner(); // Đóng modal & dừng quét
            },
            (errorMessage) => {
              console.error("Lỗi quét QR:", errorMessage);
            }
          );

          scannerRef.current = scanner;
          isScanningRef.current = true;
        }
      }, 500);
    } else if (!openQRQuetSanPham && scannerRef.current) {
      handleCloseQRScanner();
    }
  }, [openQRQuetSanPham]);
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

  //Hàm load ảnh sản phẩm trong giỏ hàng
  useEffect(() => {
    if (!selectedOrder || !selectedOrder?.listDanhSachSanPham) return; // Kiểm tra nếu hoaDon chưa load hoặc hoaDon.listDanhSachSanPham rỗng
    const interval = setInterval(() => {
      setImageIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        selectedOrder?.listDanhSachSanPham.forEach((product) => {
          if (product.hinhAnh.length > 1) {
            newIndexes[product.id] = (prevIndexes[product.id] + 1) % product.hinhAnh.length || 0;
          }
        });
        return newIndexes;
      });
    }, 3000); // Chuyển ảnh sau mỗi 3 giây
    return () => clearInterval(interval);
  }, [selectedOrder?.listDanhSachSanPham]);


  useEffect(() => {
    setSelectedCustomerId(null);
    setDiscount(0);
    setSelectedVoucherCode("");
    setShowLeftPanel(false);
    setKeyword("");
    setDiscountAmount(0);
    setNhuCauInHoaDon(false);
  }, [checkSelectedOrder]);

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
      const updatedOrder = orders?.find(order => order.id === selectedOrder.id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      } else {
        setSelectedOrder(null); // Nếu không tìm thấy, đặt lại null
      }
    }
  }, [orders]);

  useEffect(() => {
    fetchOrders();
  }, []);


  //Hàm cập nhật id hóa đơn được chọn
  const handleSelectOrder = (order) => {
    if (order?.id !== selectedOrder?.id) {
      setCheckSelectedOrder(order);
    }
    setSelectedOrder(order); // Cập nhật id của hóa đơn đã chọn
  };

  // Hàm để thêm hóa đơn mới
  const addOrder = async () => {
    try {
      // if (orders) {
      if (orders?.length === 5) {
        showErrorToast("Chỉ được thêm tối đa 5 hóa đơn");
        return;
      }
      // }

      let apiUrl = "http://localhost:8080/ban-hang-tai-quay/addHoaDonTaiQuay";


      const response = await axios.get(apiUrl);//Gọi api bằng axiosGet
      if (response.data) {
        showSuccessToast("Thêm hóa đơn thành công");
        fetchOrders(); // Cập nhật danh sách hóa đơn trước

        // Sử dụng callback function để lấy giá trị mới nhất
        setSelectedOrder(response.data);
      } else {
        showErrorToast("Thêm hóa đơn thất bại thử lại sau");
      }

    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Lỗi khi chạy API add hóa đơn rồi lấy List về");
    }
  };

  //Hàm hủy hóa đơn
  const handleHuyOrder = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/hoa-don/cap-nhat-trang-thai-hoa-don/${idOrderCanXoa}`, {
        lyDo: ghiChuTrangThai,
        trangThai: "Đã hủy",
        hanhDong: "Hủy"
      });
      if (response.data) {
        setOpenConfirm(false);
        setGhiChuTrangThai("");
        fetchOrders(); // Cập nhật danh sách hóa đơn trước
        showSuccessToast("Hủy hóa đơn thành công")
      } else {
        showErrorToast("Hủy hóa đơn đã có lỗi xảy ra");
      }
    } catch (error) {
      showErrorToast("Hủy hóa đơn đã có lỗi xảy ra catch");
      console.error(error);
    }
  };
  const handleNextConfirm = () => {
    if (!ghiChuTrangThai.trim()) { //Check nếu nhập lý do hủy hóa đơn
      setError(true);
    } else {
      setError(false);
      setOpenLyDo(false);
      setOpenConfirm(true);
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
    let apiUrl = `http://localhost:8080/ban-hang-tai-quay/xoaSanPham/${id}/${selectedOrder.id}`;
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
    setQuantity(value);
    let newValue = value.replace(/\D/g, ''); // Chỉ cho phép nhập số

    if (/^0+$/.test(newValue)) {
      newValue = "";
    }

    if (newValue !== "") {
      if (Number(newValue) > selectedProduct.soLuong) {
        newValue = Number(newValue).toString().slice(0, -1) || selectedProduct.soLuong;
      }
    }
    setTimeout(() => {
      setQuantity(newValue);
    }, 100);
    if (newValue === "" || Number(newValue) <= 0) {
      setErrorSoLuongThemVaoGioHang("Không hợp lệ");
    } else {
      setErrorSoLuongThemVaoGioHang(""); // Xóa lỗi nếu nhập đúng
    }

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

  const xacNhanThanhToan = async () => {
    try {
      let errorChuyen = "";
      let errorDua = "";

      if (paymentMethod === 'transfer' && Number(tienKhachChuyen) < 1000) {
        errorChuyen = "Số tiền chuyển phải lớn hơn 1,000 VNĐ";
      }
      if (paymentMethod === 'cash' && Number(tienKhachDua) < 1000) {
        errorDua = "Số tiền khách đưa phải lớn hơn 1,000 VNĐ";
      }
      if (paymentMethod === 'both') {
        if (Number(tienKhachChuyen) < 1000) errorChuyen = "Số tiền chuyển phải lớn hơn 1,000 VNĐ";
        if (Number(tienKhachDua) < 1000) errorDua = "Số tiền khách đưa phải lớn hơn 1,000 VNĐ";
      }

      setErrorTienKhachChuyen(errorChuyen);
      setErrorTienKhachDua(errorDua);
      if (!errorChuyen && !errorDua) {
        const response = await axios.post(`http://localhost:8080/ban-hang-tai-quay/thanhToanHoaDon`, {
          idHoaDon: selectedOrder.id, pttt: paymentMethod, tienMat: tienKhachDua, chuyenKhoan: tienKhachChuyen
        })
        if (response.data) {
          setTienKhachDua(0);
          setTienKhachChuyen(0);
          setPaymentMethod('cash');
          setOpenTT(false);
          showSuccessToast("Xác nhận thanh toán thành công");
          fetchOrders();
        } else {
          showErrorToast("Lỗi thanh toán");
        }
      }
    } catch (err) {
      console.log(err)
      showErrorToast("Lỗi thanh toán");
    }
  }

  //Xác nhận đặt hàng
  const handleConfirmXacNhatThanhToan = () => {
    xacNhanDatHang(); // Gọi hàm khi người dùng xác nhận
    setOpenConfirmXacNhanDatHang(false);
  };

  const handlePrint = async () => {
    // Lấy thông tin hóa đơn từ API hoặc dữ liệu có sẵn và gán vào state
    try {
      // const response = await axios.get(`http://localhost:8080/hoa-don/${id}`);
      // if (response.data) {
      //   setHoaDon(response.data);
      setTimeout(() => {
        const printContent = document.getElementById("hoaDonPrint");
        if (!printContent) {
          showErrorToast("Không tìm thấy nội dung hóa đơn để in!");
          return;
        }

        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.close();

        // Thêm sự kiện khi in xong
        printWindow.onafterprint = () => {
          showSuccessToast("In hóa đơn thành công!");
        };

        printWindow.print();
      }, 500);
      // }
    } catch (error) {
      showErrorToast("Lỗi khi tải hóa đơn, vui lòng thử lại!");
      console.error("Lỗi khi lấy dữ liệu hóa đơn:", error);
    }
  };

  const xacNhanDatHang = async () => {
    try {
      // if (!errorChuyen && !errorDua) {
      const addressParts = [specificAddress, ward, district, city]
        .filter(part => part) // Lọc bỏ giá trị null, undefined hoặc chuỗi rỗng
        .join(" "); // Ghép chuỗi với dấu cách
      const response = await axios.post(`http://localhost:8080/ban-hang-tai-quay/xacNhanDatHang`, {
        idHoaDon: selectedOrder.id, idKhachHang: selectedCustomerId, pgg: selectedVoucherCode, giaoHang: showLeftPanel, tenNguoiNhan: recipientName, sdtNguoiNhan: recipientPhone, diaChiNhanHang: addressParts, tongTienPhaiTra: selectedOrder?.tongTienSanPham + Number(discount) - Number(discountAmount), phiShip: discount
      })
      if (response.data !== null) {
        showSuccessToast("Đặt hàng thành công");
        if (nhuCauInHoaDon == true) {
          setSelectedOrder(response.data);
          handlePrint();
        }
        setShowLeftPanel(false);
        fetchOrders();

      } else {
        showErrorToast("Lỗi đặt hàng");
      }
      // }
    } catch (err) {
      console.log(err)
      showErrorToast("Lỗi đặt hàng catch");
    }
  }


  //   const kiemTraThayDoiSelectedOrderTruocKhiSet = (order){
  // if(selectedOrder)
  //   }


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
      {/* Modal confirm xác nhận đặt hàng */}
      <Dialog open={openConfirmXacNhanDatHang} onClose={() => setOpenConfirmXacNhanDatHang(false)}>
        <DialogTitle>Xác nhận đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc chắn muốn xác nhận đặt hàng đơn này không?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmXacNhanDatHang(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleConfirmXacNhatThanhToan} color="primary" variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {/* Xác nhận hủy hóa đơn */}
      <Dialog open={openLyDo} onClose={() => setOpenLyDo(false)}>
        <DialogTitle>Nhập lý do hủy hóa đơn</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Lý do hủy"
            variant="outlined"
            value={ghiChuTrangThai}
            onChange={(e) => { setGhiChuTrangThai(e.target.value); setError(false) }}
            error={error} // Hiển thị lỗi nếu có
            helperText={error ? "Bạn chưa nhập lý do!" : ""} // Nội dung lỗi
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLyDo(false)} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleNextConfirm} color="error" variant="contained">
            Tiếp tục
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirm thực hiện chức năng hủy hóa đơn */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận hủy hóa đơn</DialogTitle>
        <DialogContent>
          <p><b>Lý do hủy:</b> {ghiChuTrangThai}</p>
          <p>Bạn có chắc chắn muốn hủy hóa đơn này không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Quay lại
          </Button>
          <Button onClick={handleHuyOrder} color="error" variant="contained">
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
      {/* Xác nhận xóa sản phẩm */}
      <Dialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
        <DialogContent>Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?</DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setTempValues((prev) => ({
              ...prev,
              [selectedProductId]: selectedOrder?.listDanhSachSanPham?.find((p) => p.id === selectedProductId)?.soLuong || 1, // Reset nếu nhập sai
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
      {/* Quan trọng để hiển thị toast */}
      <ToastContainer />
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #E0E0E0' }}>
        {orders?.map((order, index) => (
          <Box
            key={order.id}
            sx={{
              padding: '10px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              borderBottom: selectedOrder?.id === order.id ? '2px solid #1E88E5' : 'none',
              '&:hover': {
                borderColor: '#FF8C00',
              },
              position: 'relative', // Để định vị nút xóa khi hover
            }}
            onClick={() => handleSelectOrder(order)}
            onMouseEnter={(e) => e.currentTarget.querySelector('.delete-icon')?.classList.add('show')}
            onMouseLeave={(e) => e.currentTarget.querySelector('.delete-icon')?.classList.remove('show')}
          >
            {/* Mã đơn hàng và số lượng */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Typography
                variant="body2"
                sx={{
                  color: selectedOrder?.id === order.id ? '#1E88E5' : 'inherit',
                  fontWeight: selectedOrder?.id === order.id ? 'bold' : 'normal',
                }}
              >
                HD00{index + 1}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#ff4d4f",

                }}
              >
                ({order.listDanhSachSanPham?.length || 0})
              </Typography>
            </Box>

            {/* Nút Xóa - chỉ hiển thị khi hover */}
            <IconButton
              className="delete-icon"
              sx={{
                backgroundColor: 'transparent',
                color: '#ff4d4f',
                borderRadius: '50%',
                padding: 0.5,
                width: '18px',
                height: '18px',
                position: 'absolute',
                top: '4px',  // Đưa lên sát mép trên
                right: '0px', // Đưa vào sát góc phải
                opacity: 0,
                transition: 'opacity 0.2s ease-in-out',
                '&.show': {
                  opacity: 1, // Chỉ hiện khi hover vào đơn hàng
                },
                '&:hover': {
                  color: '#D50000',
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIdOrderCanXoa(order.id);
                setOpenLyDo(true);
              }}
            >
              <CloseIcon sx={{ fontSize: '12px' }} />
            </IconButton>
          </Box>
        ))}
      </Box>


      {/* Khi không có đơn nào */}
      {orders?.length === 0 ? (
        <Box sx={{ textAlign: 'center', position: 'relative', marginBottom: 5 }}>
          <img
            src="https://img.freepik.com/premium-vector/result-not-found_878233-777.jpg" // Placeholder image
            alt="No data"
            style={{ width: '150px', height: 'auto' }}
          />
          <Typography variant="h6" sx={{ marginTop: '-40px' }}>Không có đơn nào</Typography>
        </Box>
      ) : (
        <>
          {!selectedOrder ? (
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
                        onClick={() => setOpenQRQuetSanPham(true)}
                      >
                        Quét QR Sản Phẩm
                      </Button>
                      {/* <Dialog open={openQRQuetSanPham} onClose={() => setOpenQRQuetSanPham(false)}>
                        <DialogContent>
                          <QrScanner
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: "100%" }}
                          />
                        </DialogContent>
                      </Dialog> */}
                      {/* Dialog chứa camera */}
                      <Dialog open={openQRQuetSanPham} onClose={handleCloseQRScanner} fullWidth maxWidth="sm">
                        <DialogTitle>Quét mã QR</DialogTitle>
                        <DialogContent>
                          <div id="reader" style={{ width: "100%" }}></div>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseQRScanner} color="secondary">
                            Đóng
                          </Button>
                        </DialogActions>
                      </Dialog>

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

                <Box>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>STT</TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Hình ảnh</TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Sản phẩm</TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số lượng</TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Đơn giá</TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số tiền</TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder?.listDanhSachSanPham?.length === 0 ? (
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
                          selectedOrder?.listDanhSachSanPham?.map((product, index) => {
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
                                        width: "70px",
                                        height: "70px",
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
                                <TableCell align="center">{product.donGia?.toLocaleString()} VNĐ</TableCell>
                                <TableCell align="center">{product.soTien?.toLocaleString()} VNĐ</TableCell>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, marginTop: 2 }}>
                    <Box></Box>
                    <Box>
                      <Typography component="span" variant="body1" sx={{ mr: 2 }}>Tổng tiền:</Typography>
                      <Typography component="span" fontSize={20} sx={{ fontWeight: 'bold', color: 'red', marginRight: 3 }}>
                        {selectedOrder?.tongTienSanPham?.toLocaleString()} VNĐ
                      </Typography>
                    </Box>
                  </Box>
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
                            <Select value={city} onChange={handleCityChange} label="Tỉnh/Thành phố">
                              {cities.map((city) => (
                                <MenuItem key={city.Id} value={city.Name}>{city.Name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          {/* Chọn Quận/Huyện */}
                          <FormControl fullWidth size='small'>
                            <InputLabel>Quận/Huyện</InputLabel>
                            <Select value={district} onChange={handleDistrictChange} label="Quận/Huyện">
                              {districts.map((district) => (
                                <MenuItem key={district.Id} value={district.Name}>{district.Name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          {/* Chọn Xã/Phường */}
                          <FormControl fullWidth size='small'>
                            <InputLabel>Xã/Phường</InputLabel>
                            <Select
                              value={ward}
                              onChange={handleWardChange}
                              label="Xã/Phường"
                            >
                              {wards.length > 0 ? (
                                wards.map((ward) => (
                                  <MenuItem key={ward.Id} value={ward.Name}>
                                    {ward.Name}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled>No wards available</MenuItem>
                              )}
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

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, alignItems: 'center' }}>
                        <Typography variant="body1">Phiếu giảm giá:</Typography>
                        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <Input
                            value={selectedVoucherCode} // Hiển thị mã voucher đã chọn
                            sx={{ color: '#5e5e5ede', width: 140 }} // Tăng padding phải để đủ chỗ cho icon
                            endAdornment={
                              <InputAdornment position="end" sx={{ position: 'relative' }}>
                                {/* CloseIcon - Xóa voucher */}
                                {selectedVoucherCode && (
                                  <CloseIcon
                                    sx={{
                                      color: 'red',
                                      fontSize: 14,
                                      cursor: 'pointer',
                                      position: 'absolute',
                                      left: -13, // Dịch sang phải thêm 5px
                                      top: '-3px', // Đưa lên cao hơn
                                      transform: 'translateY(-50%)',
                                      backgroundColor: 'white', // Đảm bảo không bị che khuất
                                      borderRadius: '50%',
                                      boxShadow: '0 0 4px rgba(0,0,0,0.2)' // Thêm hiệu ứng nổi
                                    }}
                                    onClick={() => {
                                      setSelectedVoucherCode(''); // Xóa mã voucher
                                      setDiscountAmount(0); // Đặt giảm giá về 0 để cập nhật lại tổng tiền
                                    }}
                                  />
                                )}
                                {/* EditIcon - Mở modal chọn voucher */}
                                <EditIcon
                                  sx={{
                                    color: 'gray',
                                    fontSize: 18,
                                    cursor: 'pointer',
                                  }}
                                  onClick={handleOpenVoucherModal}
                                />
                              </InputAdornment>
                            }
                            inputProps={{
                              style: {
                                textAlign: 'right',
                                fontWeight: 'bold',
                              },
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="body1" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                        Tiền hàng({selectedOrder?.listDanhSachSanPham?.reduce(
                          (total, item) => total + (item.soLuong || 0),
                          0
                        ) || 0} sản phẩm):
                        <span>
                          {selectedOrder?.tongTienSanPham?.toLocaleString()} VNĐ
                        </span>
                      </Typography>
                      {showLeftPanel &&
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                          <Typography variant="body1">Phí vận chuyển:</Typography>
                          <TextField
                            fullWidth
                            variant="standard"
                            value={discount ? parseInt(discount, 10).toLocaleString() : discount}
                            onChange={handleDiscountInput}
                            onBlur={() => {
                              if (discount === '') {
                                setDiscount(0);
                              }
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Typography sx={{ color: 'black' }}>VNĐ</Typography>
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              width: '140px', // Giới hạn chiều rộng
                              '& .MuiInputBase-input': { fontSize: 18, textAlign: 'right' }
                            }}
                          />
                        </Box>
                      }
                      <Typography variant="body1" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                        Giảm giá:
                        <span>{discountAmount.toLocaleString()} VNĐ</span>
                      </Typography>
                      <Typography variant="body1" sx={{ marginTop: '16px' }} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontWeight: 'bold' }}>
                        Số tiền thanh toán:
                        <span style={{ color: 'red' }}>
                          {((selectedOrder?.tongTienSanPham ?? 0) + Number(discount || 0) - Number(discountAmount || 0)).toLocaleString()} VNĐ
                        </span>
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
                            onClick={() => setOpenTT(true)} // Khi nhấn mở modal
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
                            disabled={selectedOrder.tongTienSanPham === 0}
                          >
                            <CreditCardIcon style={{ color: 'black' }} /> {/* Icon ví */}
                          </Button>
                          <span style={{ color: 'red' }}>{tongTienKhachDaThanhToan?.toLocaleString()} VNĐ</span>
                        </span>
                      </Typography>
                      <Typography variant="body1" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontWeight: 'bold' }}>
                        Tiền thiếu: <span style={{ color: 'red' }}>
                          {tongTienKhachDaThanhToan - (selectedOrder?.tongTienSanPham + Number(discount) - Number(discountAmount || 0)) < 0
                            ? Math.abs(tongTienKhachDaThanhToan - (selectedOrder?.tongTienSanPham + Number(discount) - Number(discountAmount || 0))).toLocaleString()
                            : "0"}
                          <span style={{ color: 'red' }}> VNĐ</span>
                        </span>
                      </Typography>
                      <Typography variant="body1" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontWeight: 'bold' }}>
                        Tiền thừa trả khách: <span style={{ color: 'red' }}>
                          {tongTienKhachDaThanhToan - (selectedOrder?.tongTienSanPham + Number(discount) - Number(discountAmount || 0)) > 0
                            ? (tongTienKhachDaThanhToan - (selectedOrder?.tongTienSanPham + Number(discount) - Number(discountAmount || 0))).toLocaleString()
                            : "0"}
                          <span style={{ color: 'red' }}> VNĐ</span>
                        </span>
                      </Typography>

                      <FormControlLabel
                        control={<Switch checked={nhuCauInHoaDon} onChange={(event) => { setNhuCauInHoaDon(event.target.checked) }} />}
                        label="In hóa đơn"
                      />

                      <Button variant="contained" sx={{ width: '100%', marginTop: 10, height: 50, backgroundColor: '#1976D2' }}
                        disabled={
                          selectedOrder.listDanhSachSanPham?.length === 0 ||
                          (!showLeftPanel && tongTienKhachDaThanhToan < (selectedOrder?.tongTienSanPham + Number(discount) - Number(discountAmount || 0)))
                        }
                        onClick={() => { setOpenConfirmXacNhanDatHang(true) }}
                      >
                        Xác nhận đặt hàng
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )
      }





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

      <Dialog open={openTT} onClose={() => setOpenTT(false)} maxWidth="sm" fullWidth>
        {/* Tiêu đề có nút đóng */}
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '25px', color: '#1976D2', position: 'relative' }}>
          THANH TOÁN
          <IconButton
            onClick={() => {
              setTienKhachDua(0);
              setTienKhachChuyen(0);
              setPaymentMethod('cash');
              setOpenTT(false)
            }}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#1976D2' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Tổng tiền hàng */}
          <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6">Tổng tiền hàng</Typography>
            <Typography variant="h6" sx={{ color: 'red', fontWeight: 'bold' }}>{(selectedOrder?.tongTienSanPham + + Number(discount || 0)).toLocaleString()} VNĐ</Typography>
          </Grid>


          {/* Nút Chuyển Khoản - Tiền Mặt - Cả Hai */}
          <Grid container justifyContent="center" spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setPaymentMethod('transfer');
                  setTienKhachDua(0);
                  setTienKhachChuyen(0);
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
                  setTienKhachDua(0);
                  setTienKhachChuyen(0);
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
                  setTienKhachDua(0);
                  setTienKhachChuyen(0);
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
                value={tienKhachDua ? parseInt(tienKhachDua, 10).toLocaleString() : tienKhachDua}
                onChange={handleTienKhachDua}
                error={!!errorTienKhachDua} // Nếu có lỗi thì hiển thị lỗi
                helperText={errorTienKhachDua} // Nội dung lỗi
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

              <Grid item xs={12}>
                <Typography sx={{ color: '#1976D2', fontSize: 14 }}>Tiền khách chuyển</Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  value={tienKhachChuyen ? parseInt(tienKhachChuyen, 10).toLocaleString() : tienKhachChuyen}
                  onChange={handleTienKhachChuyen}
                  error={!!errorTienKhachChuyen}
                  helperText={errorTienKhachChuyen}
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
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">STT</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">Phương thức</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">Số tiền</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">Thời gian</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedOrder?.listThanhToanHoaDon?.length > 0 ? (
                  selectedOrder.listThanhToanHoaDon.map((payment, index) => (
                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{payment.phuongThuc}</TableCell>
                      <TableCell align="center">{payment.soTien.toLocaleString()} VND</TableCell>
                      <TableCell align="center">{new Date(payment.ngayTao).toLocaleString("vi-VN")}</TableCell>
                      <TableCell align="center">{payment.ghiChu}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 2, fontStyle: "italic", color: "gray" }}>
                      Không có lịch sử thanh toán nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        {/* Nút Xác nhận */}
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={xacNhanThanhToan} variant="contained" sx={{ backgroundColor: 'green', color: 'white', fontWeight: 'bold' }}
            disabled={
              (paymentMethod === 'transfer' && errorTienKhachChuyen) ||
              (paymentMethod === 'cash' && errorTienKhachDua) ||
              (paymentMethod === 'both' && errorTienKhachChuyen || errorTienKhachDua)
            }
          >
            Xác nhận thanh toán
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

          {/* // Trong phần render danh sách các voucher */}
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {vouchers.map((voucher) => (
              <Box
                key={voucher.id}
                sx={{
                  border: '1px dashed #db5656',
                  padding: 2,
                  marginBottom: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: isVoucherValid(voucher) ? 1 : 0.5,
                  pointerEvents: isVoucherValid(voucher) ? 'auto' : 'none',
                }}
              >
                {/* Nội dung voucher */}
                <Box sx={{ flex: 2, padding: '20px 30px', marginRight: 2, backgroundColor: '#db5656', borderRadius: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
                    Mã: {voucher.ma}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    Giảm: {voucher.giaTriGiam < 100 ? `${voucher.giaTriGiam}${voucher.loaiPhieuGiamGia === 'Phần trăm' ? '%' : ' VNĐ'}` : `${new Intl.NumberFormat().format(voucher.giaTriGiam)}${voucher.loaiPhieuGiamGia === 'Phần trăm' ? '%' : ' VNĐ'}`}
                  </Typography>
                </Box>

                {/* Các thông tin còn lại */}
                <Box sx={{ flex: 3, paddingRight: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{voucher.tenPhieuGiamGia}</Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>{voucher.moTa}</Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>{voucher.trangThai}</Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>Số tiền tối thiểu: {voucher.soTienToiThieu}</Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>Số lượng: {voucher.soLuong}</Typography>
                  {renderAdditionalAmountMessage(voucher)} {/* Hiển thị thông báo nếu thiếu tiền */}
                </Box>

                {/* Nút sử dụng */}
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#d32f2f' }}
                    onClick={() => handleUseVoucher(voucher.ma)}
                    disabled={!isVoucherValid(voucher)} // Disable button nếu không đủ điều kiện
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
                      <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>STT</TableCell>
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
                                    width: "65px",
                                    height: "65px",
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
                            <TableCell align="center">
                              {product.soLuong === 0 ? (
                                // Nếu hết hàng, hiển thị ảnh Sold Out
                                <img
                                  src={soldOutImg}  // Đổi link ảnh nếu cần
                                  alt="Sold Out"
                                  style={{ width: "100px", height: "50px", objectFit: "contain" }}
                                />
                              ) : product.trangThai !== "Hoạt động" ? (
                                // Nếu không hoạt động, hiển thị ảnh Ngừng Hoạt Động
                                <img
                                  src={inactiveImg}  // Đổi link ảnh nếu cần
                                  alt="Ngừng Hoạt Động"
                                  style={{ width: "100px", height: "40px", objectFit: "contain" }}
                                />
                              ) : (
                                // Nếu còn hàng và đang hoạt động, hiển thị nút Chọn
                                <Button variant="outlined" onClick={() => handleOpenConfirmModal(product)}>Chọn</Button>
                              )}
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
                      onClick={() => { setQuantity(1); fetchOrders(); setOpenConfirmModal(false) }}
                    >
                      <CloseIcon />
                    </IconButton>

                    {/* Tiêu đề sản phẩm (căn lề trái) */}
                    <Typography variant="h6" fontWeight="bold" sx={{ textAlign: "left" }}>
                      {selectedProduct?.tenMauSize} - {selectedProduct?.ma}
                    </Typography>

                    {/* Khu vực chứa ẢNH - GIÁ - Ô NHẬP SỐ LƯỢNG */}
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      {/* Ảnh sản phẩm (bên trái) */}
                      <Box sx={{ flex: 1 }}>
                        <img
                          src={selectedProduct.hinhAnh[0]}
                          alt={`Ảnh load`}
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

                      </Box>

                      {/* Giá sản phẩm & Ô nhập số lượng (bên phải) */}
                      <Box sx={{ flex: 2, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        {/* Giá sản phẩm */}
                        <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1 }}>
                          {selectedProduct?.gia.toLocaleString()} VNĐ
                        </Typography>

                        {/* Chọn số lượng */}
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
                            // type="number"
                            inputProps={{ min: 1, style: { textAlign: "center" }, step: 1 }}
                            size="small"
                            error={!!errorSoLuongThemVaoGioHang}
                            helperText={errorSoLuongThemVaoGioHang}
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
                            onClick={() => setQuantity(prev => Number(prev) + 1)}
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
                      disabled={errorSoLuongThemVaoGioHang}
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
          <Button variant="contained" color="warning" sx={{ mt: 2 }} fullWidth onClick={handleClickOpen}>
            THÊM ĐỊA CHỈ
          </Button>
        </Box>
      </Modal>

      {/* Modal cho chọn địa chỉ */}
      <Dialog open={openChonDC} onClose={handleCloseChonDC}>
        <DialogTitle>Chọn địa chỉ</DialogTitle>
        <DialogContent>
          {/* Thành phố */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="city-label" size="small">Tỉnh/Thành phố</InputLabel>
            <Select
              labelId="city-label"
              value={newCity}  // Sử dụng state cho modal là 'city'
              label="Tỉnh/Thành phố"
              onChange={handleCityChangeModal}
              size="small" // Áp dụng size nhỏ cho Select
            >
              {newCities.map((newCity) => (  // Sử dụng citiess (dữ liệu cho modal)
                <MenuItem key={newCity.Id} value={newCity.Name}>
                  {newCity.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Quận/Huyện */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="district-label" size="small">Quận/Huyện</InputLabel>
            <Select
              labelId="district-label"
              value={newDistrict}  // Sử dụng state cho modal là 'district'
              label="Quận/Huyện"
              onChange={handleDistrictChangeModal}
              disabled={!newCities}  // Disable nếu chưa chọn thành phố
              size="small" // Áp dụng size nhỏ cho Select
            >
              {newDistricts.map((newDistrict) => (  // Sử dụng districtss (dữ liệu cho modal)
                <MenuItem key={newDistrict.Id} value={newDistrict.Name}>
                  {newDistrict.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Xã/Phường */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="ward-label" size="small">Xã/Phường</InputLabel>
            <Select
              labelId="ward-label"
              value={newWard}  // Sử dụng state cho modal là 'ward'
              label="Xã/Phường"
              onChange={handleWardChangeModal}
              disabled={!newDistrict}  // Disable nếu chưa chọn quận/huyện
              size="small" // Áp dụng size nhỏ cho Select
            >
              {newWards.map((newWard) => (  // Sử dụng wardss (dữ liệu cho modal)
                <MenuItem key={newWard.Id} value={newWard.Name}>
                  {newWard.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Địa chỉ cụ thể */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="detailed-address"
              label="Địa chỉ cụ thể"
              variant="outlined"
              placeholder="Nhập địa chỉ cụ thể"
              fullWidth
              size="small" // Áp dụng size nhỏ cho TextField
            />
          </FormControl>

          {/* Mô tả */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="description"
              label="Mô tả"
              variant="outlined"
              placeholder="Nhập mô tả"
              fullWidth
              size="small" // Áp dụng size nhỏ cho TextField
            />
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChonDC} color="primary">
            Hủy
          </Button>
          <Button onClick={handleCloseChonDC} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* In hóa đơn */}
      <Box id="hoaDonPrint" style={{ display: "none" }}> {/* Thay display: none bằng block */}
        <HoaDonPrint hoaDon={selectedOrder} />
      </Box>
    </Box >

  );
};

// Style cho modal
const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw", // Giới hạn chiều rộng
  maxWidth: "1200px", // Định kích thước tối đa
  maxHeight: "80vh", // Giới hạn chiều cao
  bgcolor: "white",
  boxShadow: 24,
  p: 2,
  overflow: "auto", // Cho phép cuộn nếu nội dung quá dài
  borderRadius: "8px",
};

export default BanTaiQuay;
