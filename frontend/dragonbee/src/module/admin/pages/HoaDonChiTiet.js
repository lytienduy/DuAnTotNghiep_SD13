import React, { useRef, useEffect, useState, useCallback } from "react";
import axios from "axios"; // Import axios
import {
  Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography, Button, Chip, Paper, Container, CircularProgress, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, Stack, InputAdornment
  , Modal, Slider, FormControl, Select, MenuItem, InputLabel
} from "@mui/material";
import { Delete, History, Close, ArrowBack, ArrowForward } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Remove as RemoveIcon } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import soldOutImg from '../../../img/sold-out.png';
import inactiveImg from '../../../img/inactive.png';

const HoaDonChiTiet = () => {
  //Khai báo useState
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); //Lấy id khi truyền đến trang này bằng useParams
  const [hoaDon, setHoaDon] = useState({}); //Biến lưu dữ liệu hóa đơn
  const [loading, setLoading] = useState(true);//Biến lưu giá trị loading dữ liệu
  const [error, setError] = useState(false);//Biến báo lỗi
  const [imageIndexes, setImageIndexes] = useState({});//Biến lưu giá trị key(idSPCT từ HDCT) cùng index hình ảnh hiện tại 
  const [openLyDo, setOpenLyDo] = useState(false);  // Biến lưu giá trị mở modal nhập lý do khi thực hiện chức năng hủy hóa đơn
  const [openConfirm, setOpenConfirm] = useState(false); // Mở modal xác nhận
  const [open, setOpen] = useState(false);//Biến lưu giá trị mở modal xem lịch sử hóa đơn
  const [openGhiChuPrevious, setOpenGhiChuPrevious] = useState(false);  // Biến lưu giá trị mở modal nhập lý do khi thực hiện chức năng hủy hóa đơn
  const [openConfirmPrevious, setOpenConfirmPrevious] = useState(false); // Mở modal xác nhận
  const [openGhiChuNext, setOpenGhiChuNext] = useState(false);
  const [openConfirmNext, setOpenConfirmNext] = useState(false); // Mở modal xác nhận
  const [ghiChuTrangThai, setGhiChuTrangThai] = useState("");
  const [openTT, setOpenTT] = useState(false);
  const [tienKhachDua, setTienKhachDua] = useState(0);
  const [tienKhachChuyen, setTienKhachChuyen] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Mặc định là 'cash' (tiền mặt)
  const [errorTienKhachChuyen, setErrorTienKhachChuyen] = useState("");
  const [errorTienKhachDua, setErrorTienKhachDua] = useState("");

  //Thay đổi địa chỉ nhận hàng
  const [openModal, setOpenModal] = useState(false);
  const [hoTen, setHoTen] = useState(hoaDon.tenNguoiNhanHang);
  const [sdt, setSdt] = useState(hoaDon.sdtNguoiNhanHang);
  const [email, setEmail] = useState(hoaDon.emailNguoiNhanHang);
  const [diaChiCuThe, setDiaChiCuThe] = useState("");

  useEffect(() => {
    setHoTen(hoaDon.tenNguoiNhanHang);
    setSdt(hoaDon.sdtNguoiNhanHang);
    setEmail(hoaDon.emailNguoiNhanHang);
  }, [hoaDon]); // Chạy lại mỗi khi hoaDon thay đổi

  // Khai báo Thành phố huyện xã
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [preDistrict, setPreDistrict] = useState("");
  const [preWard, setPreWard] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedGHNDistrict, setSelectedGHNDistrict] = useState("");
  const [selectedGHNWard, setselectedGHNWard] = useState("");
  // State để lưu thông báo lỗi
  const [errorMessage, setErrorMessage] = useState({
    hoTen: "",
    sdt: "",
    email: "",
    phiShip: "",
    diaChi: "",
  });

  const [openSPModal, setOpenSPModal] = useState(false); //giá trị mở đống modal add sản paharm
  const [value, setValue] = useState([100000, 3200000]);//giá trị slider khoảng giá

  const [selectedProduct, setSelectedProduct] = useState(null);//sản phẩm add được chọn
  const [quantity, setQuantity] = useState(1);//số lượng sản phẩm được thêm vào giỏ hàng
  const [debouncedValue, setDebouncedValue] = useState(value);//giá trị khoảng giá

  //State khai báo hủy hóa đơn
  const [imageIndexesThemSanPham, setImageIndexesThemSanPham] = useState({});//Biến lưu giá trị key(idSPCT từ HDCT) cùng index hình ảnh hiện tại tại thêm sản phẩm vào giỏ hàng 
  const [openConfirmModal, setOpenConfirmModal] = useState(false);//Mở confirm có muốn xóa sản phẩm khỏi giỏ hàng không
  const [selectedProductId, setSelectedProductId] = useState(null);//Lưu ID sản phẩm được chọn trong giỏ hàng
  const [tempValues, setTempValues] = useState({}); // State tạm để lưu giá trị nhập vào của từng sản phẩm trong giỏ hàng
  const [products, setProducts] = useState([]);//Các sản phẩm của cửa hàng để bán
  const [danhMuc, setDanhMuc] = useState(0); // Giá trị của bộ lọc danh mục
  const [mauSac, setMauSac] = useState(0); // Giá trị của bộ lọc màu sắc
  const [chatLieu, setChatLieu] = useState(0); // Giá trị của bộ lọc chất liệu
  const [kichCo, setKichCo] = useState(0); // Giá trị của bộ lọc size
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
  const [errorSoLuongThemVaoGioHang, setErrorSoLuongThemVaoGioHang] = useState("");
  const [openConfirmRefund, setOpenConfirmRefund] = useState(false);
  const [productsCapNhatSoLuong, setProductsCapNhatSoLuong] = useState([]);
  const [openDialogThongBaoHetHangHoacKDuSoLuong, setOpenDialogThongBaoHetHangHoacKDuSoLuong] = useState(false);
  const [tenSanPhamThongBao, setTenSanPhamThongBao] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const handleDialogOpen = (message, tenSanPhamThongBao) => {
    setDialogMessage(message);
    setTenSanPhamThongBao(tenSanPhamThongBao);
    setOpenDialogThongBaoHetHangHoacKDuSoLuong(true);
  };

  const handleDialogClose = () => {
    setTenSanPhamThongBao("");
    setOpenDialogThongBaoHetHangHoacKDuSoLuong(false);
  };

  const [tienGiam, setTienGiam] = useState(0);
  const [phieuGiamGia, setPhieuGiamGia] = useState(null);

  useEffect(() => {
    const fetchGiamGia = async () => {
      if (hoaDon.maVoucher && hoaDon.tongTienSanPham) {
        try {
          const res = await axios.get(`http://localhost:8080/dragonbee/giam-gia`, {
            params: {
              ma: hoaDon.maVoucher,
              tongTienSanPham: hoaDon.tongTienSanPham,
            },
          });
          setTienGiam(res.data.tienGiam);
          setPhieuGiamGia(res.data.phieuGiamGia);

          // Optional: cập nhật lại tổng tiền thanh toán nếu muốn
          setHoaDon(prev => ({
            ...prev,
            tongTienThanhToan:
              prev.tongTienSanPham + (prev.phiVanChuyen ?? 0) - res.data.tienGiam,
          }));
        } catch (error) {
          console.error("Lỗi khi gọi API giảm giá:", error);
        }
      }
    };

    fetchGiamGia();
  }, [hoaDon.maVoucher, hoaDon.tongTienSanPham]);

  const handleDatHang = useCallback(async () => {
    try {
      await axios.put(`http://localhost:8080/dragonbee/hoa-don/${hoaDon.id}`, {
        ...hoaDon,
        tongTien: hoaDon.tongTienThanhToan,
      });
      console.log("Đã cập nhật tổng tiền hóa đơn");
    } catch (error) {
      console.error("Lỗi khi cập nhật hóa đơn:", error);
    }
  }, [hoaDon]);

  useEffect(() => {
    if (hoaDon.id && hoaDon.tongTienThanhToan > 0) {
      handleDatHang();
    }
  }, [hoaDon.tongTienThanhToan]);

  useEffect(() => {
    if (hoaDon.diaChiNguoiNhanHang) {
      const addressParts = hoaDon.diaChiNguoiNhanHang.split(", ");
      if (addressParts.length >= 4) {
        const cityFromAddress = addressParts[addressParts.length - 1];
        const districtFromAddress = addressParts[addressParts.length - 2];
        const wardFromAddress = addressParts[addressParts.length - 3];

        // Cập nhật địa chỉ cụ thể
        setDiaChiCuThe(addressParts.slice(0, addressParts.length - 3).join(", "));

        // Lưu tạm để xử lý sau khi dữ liệu thành phố có sẵn
        setTimeout(() => {
          setCity(cityFromAddress);
          setPreDistrict(districtFromAddress);
          setPreWard(wardFromAddress);
        }, 0);
      }
    }
  }, [hoaDon.diaChiNguoiNhanHang]);

  const handleChangeAddress = async () => {
    const addressParts = hoaDon.diaChiNguoiNhanHang?.split(", ");
    if (addressParts.length >= 4) {
      const cityFromAddress = addressParts[addressParts.length - 1];
      const districtFromAddress = addressParts[addressParts.length - 2];
      const wardFromAddress = addressParts[addressParts.length - 3];
      const specificAddress = addressParts.slice(0, addressParts.length - 3).join(", ");

      setDiaChiCuThe(specificAddress);
      setCity(cityFromAddress); // Triggers useEffect to load districts

      const selectedCity = cities.find((c) => c.Name === cityFromAddress);
      if (selectedCity) {
        const provinceId = selectedCity.ProvinceID;
        setSelectedGHNDistrict(provinceId);

        // Fetch districts
        const districtResponse = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
          {
            headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
            params: { province_id: provinceId },
          }
        );
        setDistricts(districtResponse.data.data);

        const matchedDistrict = districtResponse.data.data.find(
          (d) => d.DistrictName === districtFromAddress
        );

        if (matchedDistrict) {
          setDistrict(matchedDistrict.DistrictName);
          const districtId = matchedDistrict.DistrictID;

          // Fetch wards
          const wardResponse = await axios.get(
            `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
            {
              headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
              params: { district_id: districtId },
            }
          );
          setWards(wardResponse.data.data);

          const matchedWard = wardResponse.data.data.find(
            (w) => w.WardName === wardFromAddress
          );
          if (matchedWard) {
            setWard(matchedWard.WardName);
            setselectedGHNWard(matchedWard.WardCode);
          }
        }
      }
    }

    setOpenModal(true); // Mở modal sau khi dữ liệu đã set
  };

  useEffect(() => {
    if (preDistrict && districts.length > 0) {
      const districtExists = districts.some(
        (d) => d.DistrictName === preDistrict
      );
      if (districtExists) {
        setDistrict(preDistrict);
        setPreDistrict(""); // reset sau khi đã set
      }
    }
  }, [districts, preDistrict]);

  useEffect(() => {
    if (preWard && wards.length > 0) {
      const wardExists = wards.some((w) => w.WardName === preWard);
      if (wardExists) {
        setWard(preWard);
        setPreWard(""); // reset sau khi đã set
      }
    }
  }, [wards, preWard]);

  const roundToNearestThousand = (number) => {
    return Math.round(number / 1000) * 1000;
  };

  // Hàm sử dụng để gọi tỉnh thành quận huyện xã Việt Nam
  useEffect(() => {
    // axios
    //   .get(
    //     "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    //   )
    axios
      .get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
        {
          headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
        }
      )
      .then((response) => {
        const normalizedCities = response.data.data.map((city) => ({
          ...city,
          Name: city.ProvinceName.replace(/^(Thành phố |Tỉnh )/, ""), // Loại bỏ "Thành phố " và "Tỉnh "
        }));
        setCities(normalizedCities); // Cập nhật citiess thay vì setCities
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleCityChange = (event) => {
    const cityName = event.target.value;
    setCity(cityName); // Cập nhật giá trị của city
    setDistrict(""); // Reset quận/huyện khi thay đổi tỉnh thành
    setWard(""); // Reset xã/phường khi thay đổi quận/huyện
    const id = cities.find((c) => c.Name === cityName).ProvinceID;
    setSelectedGHNDistrict(id);
    const fetchDistricts = async () => {
      const districtResponse = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
        {
          headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
          params: {
            province_id: id,
          },
        }
      );
      setDistricts(districtResponse.data.data);
    };
    fetchDistricts();
    setWards([]); // Reset xã/phường
  };

  const handleDistrictChange = (event) => {
    const districtName = event.target.value;
    setDistrict(districtName); // Cập nhật giá trị của district
    setWard(""); // Reset xã/phường khi thay đổi quận/huyện

    const id = districts.find(
      (d) => d.DistrictName === districtName
    ).DistrictID;
    setSelectedGHNDistrict(id);
    const fetchWards = async () => {
      const wardsResponse = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=` +
        id,
        {
          headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
        }
      );
      setWards(wardsResponse.data.data);
    };
    fetchWards();
  };

  const handleWardChange = (event) => {
    setWard(event.target.value);

    const id = wards.find((d) => d.WardName === event.target.value).WardCode;
    setselectedGHNWard(id);

    // Lấy phí dịch vụ của giao hàng nhanh dựa trên huyện và xã đã chọn
    const fetchGHNServiceFee = async () => {
      const serviceFeeResponse = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
        {
          headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
          params: {
            service_type_id: 2,
            to_district_id: selectedGHNDistrict,
            to_ward_code: selectedGHNWard,
            weight: 3000,
            insurance_value: 0,
          },
        }
      );
      const rawFee = serviceFeeResponse.data.data.service_fee;
      setDiscount(roundToNearestThousand(rawFee));
    };
    fetchGHNServiceFee();
  };

  useEffect(() => {
    const fetchGHNServiceFee = async () => {
      if (selectedGHNDistrict && selectedGHNWard) {
        try {
          const response = await axios.get(
            `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
            {
              headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
              params: {
                service_type_id: 2,
                to_district_id: selectedGHNDistrict,
                to_ward_code: selectedGHNWard,
                weight: 3000,
                insurance_value: 0,
              },
            }
          );
          const fee = roundToNearestThousand(response.data.data.service_fee);
          setHoaDon((prev) => ({
            ...prev,
            phiVanChuyen: fee,
          }));
        } catch (error) {
          console.error("Error fetching GHN service fee:", error);
        }
      }
    };

    fetchGHNServiceFee();
  }, [selectedGHNDistrict, selectedGHNWard]);

  useEffect(() => {
    // Khi thành phố thay đổi, gọi API để lấy danh sách quận/huyện
    if (city) {
      const selectedCity = cities.find((c) => c.Name === city);
      if (selectedCity) {
        const id = selectedCity.ProvinceID;
        setSelectedGHNDistrict(id);
        setDistrict(""); // Reset quận/huyện
        setWard(""); // Reset xã/phường
        setWards([]); // Reset danh sách xã/phường

        const fetchDistricts = async () => {
          try {
            const response = await axios.get(
              `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
              {
                headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
                params: {
                  province_id: id,
                },
              }
            );
            setDistricts(response.data.data);
          } catch (error) {
            console.error("Error fetching districts:", error);
          }
        };

        fetchDistricts();
      }
    }
  }, [city]);

  useEffect(() => {
    // Khi quận/huyện thay đổi, gọi API để lấy danh sách xã/phường
    if (district) {
      const selectedDistrict = districts.find(
        (d) => d.DistrictName === district
      );
      if (selectedDistrict) {
        const id = selectedDistrict.DistrictID;
        setSelectedGHNDistrict(id);
        setWard(""); // Reset xã/phường

        const fetchWards = async () => {
          try {
            const response = await axios.get(
              `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
              {
                headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
                params: {
                  district_id: id,
                },
              }
            );
            setWards(response.data.data);
          } catch (error) {
            console.error("Error fetching wards:", error);
          }
        };

        fetchWards();
      }
    }
  }, [district]);

  useEffect(() => {
    if (ward) {
      const selectedWard = wards.find((w) => w.WardName === ward);
      if (selectedWard) {
        setselectedGHNWard(selectedWard.WardCode);

        // Gọi API tính phí vận chuyển
        const fetchGHNServiceFee = async () => {
          try {
            const response = await axios.get(
              `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
              {
                headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
                params: {
                  service_type_id: 2,
                  to_district_id: selectedGHNDistrict,
                  to_ward_code: selectedWard.WardCode,
                  weight: 3000,
                  insurance_value: 0,
                },
              }
            );
            const rawFee = response.data.data.service_fee;
            setDiscount(roundToNearestThousand(rawFee));
          } catch (error) {
            console.error("Error fetching GHN service fee:", error);
          }
        };

        fetchGHNServiceFee();
      }
    }
  }, [ward]);

  const handlePhiVanChuyenChange = (e) => {
    const value = e.target.value;
    setHoaDon((prev) => ({
      ...prev,
      phiVanChuyen: value,
    }));
  };

  const validateForm = () => {
    const newError = { hoTen: "", sdt: "", email: "", phiShip: "", diaChi: "" };
    let isValid = true;

    if (!hoTen) {
      newError.hoTen = "Họ tên không được để trống.";
      isValid = false;
    }

    if (!sdt) {
      newError.sdt = "Số điện thoại không được để trống.";
      isValid = false;
    } else if (!/^(03|05|07|08|09)\d{8}$/.test(sdt)) {
      newError.sdt = "Số điện thoại không hợp lệ.";
      isValid = false;
    }

    if (!email) {
      newError.email = "Email không được để trống.";
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newError.email = "Email không hợp lệ.";
      isValid = false;
    }

    if (!diaChiCuThe) {
      newError.diaChi = "Địa chỉ không được để trống.";
      isValid = false;
    }

    let phiShip = hoaDon.phiVanChuyen != null ? String(hoaDon.phiVanChuyen).replace(/,/g, '') : '';
    if (phiShip === '' || isNaN(parseFloat(phiShip))) {
      newError.phiShip = "Phí vận chuyển không hợp lệ.";
      isValid = false;
    }

    setErrorMessage(newError);
    return isValid;
  };

  const handleSave = async () => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (!storedUserData || !storedUserData.nhanVien) {
      setErrorMessage((prev) => ({
        ...prev,
        hoTen: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
      }));
      return;
    }

    // Sử dụng validateForm() để kiểm tra dữ liệu
    const formIsValid = validateForm();
    if (!formIsValid) return;

    // Xây dựng địa chỉ đầy đủ từ các thông tin nhận hàng
    const diaChiNhanHang = `${diaChiCuThe}, ${ward}, ${district}, ${city}`;

    const data = {
      tenNguoiNhan: hoTen,
      sdt: sdt,
      emailNguoiNhan: email,
      diaChiNhanHang: diaChiNhanHang,
      phiShip: parseFloat(String(hoaDon.phiVanChuyen).replace(/,/g, '')),
      nguoiSua: storedUserData.nhanVien.tenNhanVien,
    };

    try {
      const response = await fetch(`http://localhost:8080/hoa-don/cap-nhat-thong-tin-nhan-hang/${hoaDon.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        if (result) {
          setHoaDon(prev => ({
            ...prev,
            tenNguoiNhanHang: hoTen,  
            sdtNguoiNhanHang: sdt,    
            emailNguoiNhanHang: email,
            diaChiNguoiNhanHang: diaChiNhanHang,
          }));

          setOpenModal(false);
          alert("Cập nhật thông tin nhận hàng thành công!");
        } else {
          alert("Cập nhật thất bại!");
        }
      } else {
        const errorMessage = await response.text();
        alert(`Lỗi từ server: ${errorMessage}`);
      }
    } catch (errorMessage) {
      console.error("Lỗi khi cập nhật thông tin:", errorMessage);
      alert("Đã có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const xoaSanPham = async (id) => {
    //Đang sai đoạn này listDanhSachSanPham này chứa cả hoạt động và không hoạt động
    let apiUrl = `http://localhost:8080/hdctClient/xoaSanPhamSauKhiDatHang/${id}/${hoaDon.id}`;
    try {
      const response = await axios.post(apiUrl);//Gọi api bằng axiosGet
      if (response.data === true) {
        fetchHoaDon();
        showSuccessToast("Xóa sản phẩm thành công");
      } else {
        showErrorToast("Xóa thất bại vui lòng thử lại");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Xóa thất bại vui lòng thử lại");
    }
  }

  //Hàm gọi api lấy hóa đơn
  const fetchHoaDon = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/hoa-don-chi-tiet/${id}`);
      setTempValues({});
      setHoaDon(response.data); // Dữ liệu được lấy từ response.data
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Không load được hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  const listDanhSachSanPhamHoatDong = (hoaDon?.listDanhSachSanPham || [])
    .filter(tt => tt?.trangThai === "Hoạt động") // Lọc chỉ lấy các phần tử có id = 3

  //Hàm lọcThemSanPhamHoaDonTaiQuay
  const getSanPhamThem = async () => {
    let apiUrl = "http://localhost:8080/hdctClient/layListCacSanPhamHienThiThem";
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
    params.append("idHoaDon", id);//Truyền vào loại đơn
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
      const response = await axios.get(`http://localhost:8080/hdctClient/layListDanhMuc`);
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

  //Hàm confirm xóa sản phẩm khỏi giỏ hàng
  const handleConfirmDelete = async () => {
    xoaSanPham(selectedProductId);
    setOpenConfirmModal(false);
  };

  //Hàm cập nhật số lượng trong giỏ hàng
  const getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/hdctClient/getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang?idHoaDon=${id}`);
      setProductsCapNhatSoLuong(response.data);
    } catch (error) {
      showErrorToast("Lỗi khi lấy dữ liệu sản phẩm chi tiết")
    }
  };


  //Lấy dữ liệu hóa đơn
  useEffect(() => {
    fetchHoaDon();
    if (hoaDon?.trangThai === "Chờ xác nhận") {
      const interval = setInterval(() => {
        getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang();
      }, 1000); // 60 giây
      return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }
  }, []);


  //Hàm load ảnh
  useEffect(() => {
    if (!hoaDon || !hoaDon.listDanhSachSanPham) return; // Kiểm tra nếu hoaDon chưa load hoặc hoaDon.listDanhSachSanPham rỗng
    const interval = setInterval(() => {
      setImageIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        hoaDon.listDanhSachSanPham.forEach((product) => {
          if (product.hinhAnh.length > 1) {
            newIndexes[product.id] = (prevIndexes[product.id] + 1) % product.hinhAnh.length || 0;
          }
        });
        return newIndexes;
      });
    }, 3000); // Chuyển ảnh sau mỗi 3 giây
    return () => clearInterval(interval);
  }, [hoaDon?.listDanhSachSanPham]);

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
      fetchHoaDon();
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




  //Validate nhập tiền khách đưa
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
          idHoaDon: hoaDon.id, pttt: paymentMethod, tienMat: tienKhachDua, chuyenKhoan: tienKhachChuyen
        })
        if (response.data) {
          setTienKhachDua(0);
          setTienKhachChuyen(0);
          setPaymentMethod('cash');
          setOpenTT(false);
          showSuccessToast("Xác nhận thanh toán thành công");
          fetchHoaDon();
        } else {
          showErrorToast("Lỗi thanh toán");
        }
      }
    } catch (err) {
      console.log(err)
      showErrorToast("Lỗi thanh toán");
    }
  }

  //Thông báo thành công
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

  //Hàm mở modal nhập lý do hủy hóa đơn khi thực hiện chức năng hủy hóa đơn
  const handleOpenLyDo = () => {
    setOpenLyDo(true);
  };

  //Hàm kiểm tra check nhạp lý do chưa để mở confirm khi thực hiện chức năng hủy hóa đơn
  const handleNextConfirm = () => {
    if (!ghiChuTrangThai.trim()) { //Check nếu nhập lý do hủy hóa đơn
      setError(true);
    } else {
      setError(false);
      setOpenLyDo(false);
      setOpenConfirm(true);
    }
  };
  const handleNextConfirmPrevious = () => {
    if (!ghiChuTrangThai.trim()) { //Check nếu nhập lý do hủy hóa đơn
      setError(true);
    } else {
      setError(false);
      setOpenGhiChuPrevious(false);
      setOpenConfirmPrevious(true);
    }

  };
  const handleNextConfirmNext = () => {
    setOpenGhiChuNext(false);
    setOpenConfirmNext(true);
  };

  //Hàm thực hiện chức năng hủy hóa đơn gọi api
  //Hủy này cần xem xét lại
  const handleHuyHoaDon = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/hoa-don/cap-nhat-trang-thai-hoa-don/${hoaDon.id}`, {
        lyDo: ghiChuTrangThai,
        trangThai: "Đã hủy",
        hanhDong: "Hủy"
      });
      if (response.data) {
        setOpenConfirm(false);
        setGhiChuTrangThai("");
        fetchHoaDon();
        showSuccessToast("Hủy hóa đơn thành công")
      } else {
        showErrorToast("Hủy hóa đơn đã có lỗi xảy ra");
      }
    } catch (error) {
      showErrorToast("Hủy hóa đơn đã có lỗi xảy ra");
      console.error(error);
    }
  };

  //Hàm trả về CSS khung theo trạng thái
  const getStatusStyles = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return { backgroundColor: "#FFF9C4", color: "#9E9D24" }; // Vàng nhạt
      case "Đã xác nhận":
        return { backgroundColor: "#C8E6C9", color: "#388E3C" }; // Xanh lá nhạt
      case "Chờ giao hàng":
        return { backgroundColor: "#FFE0B2", color: "#E65100" }; // Cam nhạt
      case "Đang vận chuyển":
        return { backgroundColor: "#BBDEFB", color: "#1976D2" }; // Xanh dương nhạt
      case "Đã giao hàng":
        return { backgroundColor: "#DCEDC8", color: "#689F38" }; // Xanh lá nhạt hơn
      case "Đã thanh toán":
        return { backgroundColor: "#E1BEE7", color: "#8E24AA" }; // Tím nhạt
      case "Chờ thanh toán":
        return { backgroundColor: "#FFCCBC", color: "#D84315" }; // Đỏ cam nhạt
      case "Hoàn thành":
        return { backgroundColor: "#CFD8DC", color: "#455A64" }; // Xám nhạt
      case "Đã hủy":
        return { backgroundColor: "#FFCDD2", color: "#C62828" }; // Đỏ nhạt
      default:
        return { backgroundColor: "#E3F2FD", color: "#000" }; // Màu mặc định (xanh siêu nhẹ)
    }
  };

  //List trạng thái hóa đơn
  const steps = hoaDon.loaiHoaDon === "Tại quầy"
    ? (hoaDon.sdtNguoiNhanHang === null
      ? ["Chờ thêm sản phẩm", "Chờ thanh toán", "Đã thanh toán", "Hoàn thành"]
      : ["Chờ thêm sản phẩm", "Chờ xác nhận", "Đã xác nhận", "Chờ giao hàng", "Đang vận chuyển", "Đã giao hàng", "Chờ thanh toán", "Đã thanh toán", "Hoàn thành"]
    )
    : ["Chờ xác nhận", "Đã xác nhận", "Chờ giao hàng", "Đang vận chuyển", "Đã giao hàng", "Chờ thanh toán", "Đã thanh toán", "Hoàn thành"];


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
        <Typography ml={2}>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  const currentStep = hoaDon ? steps.indexOf(hoaDon.trangThai) : -1; //Biến lưu index trạng thái hiện tại của hóa đơn trong steps
  const isCanceled = hoaDon?.trangThai === "Đã hủy";//Biến true false có phải hóa đơn trạng thái Hủy không
  const isComplete = hoaDon?.trangThai === "Hoàn thành";//Biến true false có phải hóa đơn trạng thái Hoàn Thành không

  const handleWheel = (event) => {
    if (scrollRef.current) {
      event.preventDefault();
      scrollRef.current.scrollLeft += event.deltaY;
    }
  };

  //Hàm trờ lại trạng thái trước
  const handlePrevious = async () => {
    if (currentStep === 0) return;

    try {
      // Lấy trạng thái trước đó
      const trangThaiCanDoi = steps[currentStep - 1];
      // Gọi API để thay đổi trạng thái
      const response = await axios.post(
        `http://localhost:8080/hoa-don/cap-nhat-trang-thai-hoa-don/${hoaDon.id}`, { trangThai: trangThaiCanDoi, hanhDong: "Hoàn tác", lyDo: ghiChuTrangThai }
      );
      if (response.data) {
        setGhiChuTrangThai("");
        setOpenConfirmPrevious(false);
        fetchHoaDon();
        showSuccessToast("Hoàn tác trạng thái hóa đơn thành công");
      } else {
        showErrorToast("Hoàn tác thất bại, thử lại!");
      }
    } catch (error) {
      showErrorToast("Lỗi khi hoàn tác hóa đơn!");
      console.error(error.response || error.message);
    }
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) return;

    try {
      // Lấy trạng thái trước đó
      const trangThaiCanDoi = steps[currentStep + 1];
      // Gọi API để thay đổi trạng thái
      const response = await axios.post(
        `http://localhost:8080/hoa-don/cap-nhat-trang-thai-hoa-don/${hoaDon.id}`, { trangThai: trangThaiCanDoi, hanhDong: trangThaiCanDoi === "Hoàn thành" ? "Hoàn thành" : "Cập nhật", lyDo: ghiChuTrangThai }
      );
      if (response.data) {
        setGhiChuTrangThai("");
        setOpenConfirmNext(false);
        fetchHoaDon();
        showSuccessToast("Cập nhật trạng thái hóa đơn thành công");
      } else {
        setOpenConfirmNext(false);
        showErrorToast("Cập nhật thất bại, thử lại!");
      }
      console.log(response.data);  // In kết quả trả về
    } catch (error) {
      showErrorToast("Lỗi khi cập nhật hóa đơn!");
      console.error(error.response || error.message);
    }
  };

  //Hàm giảm số lượng sản phẩm trong giỏ hàng 
  const giamSoLuong = async (id) => {
    let apiUrl = `http://localhost:8080/hdctClient/giamSoLuongOnline/${id}`;
    try {
      const response = await axios.post(apiUrl);//Gọi api bằng axiosGet
      if (response.data === true) {
        fetchHoaDon();
      } else {
        if (hoaDon?.listDanhSachSanPham?.length > 1) {
          clickDeleteIcon(id);
        } else {
          showErrorToast("Hóa đơn không được để rỗng sản phẩm");
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Lỗi khi giảm số lượng sản phẩm");
    }
  }

  //Cập nhật giá trị khi thay đổi số lượng sản phẩm trong giỏ hàng nhập bàn phím
  const handleInputChange = (id, value) => {
    setTempValues((prev) => ({
      ...prev,
      [id]: value, // Cập nhật giá trị nhập vào
    }));
  };

  //Kho nhập số lượng bàn phím và thoát focus nhập số lượng
  const handleInputBlur = (id) => {
    setSelectedProductId(id);
    const newValue = Number(tempValues[id]);
    if (newValue >= 1) {
      nhapSoLuong(id, newValue); // Gọi API cập nhật số lượng khi mất focus
    } else if (newValue < 1) {//Không được để else  
      if (listDanhSachSanPhamHoatDong?.length > 1) {
        setSelectedProductId(id);
        setOpenConfirmModal(true);
      } else if (listDanhSachSanPhamHoatDong?.length === 1) {
        setTempValues({});
        showErrorToast("Hóa đơn không được để rỗng sản phẩm");
      }
    }
  };

  //Hàm tăng số lượng sản phẩm trong giỏ hàng
  const tangSoLuong = async (index, id) => {
    if (hoaDon?.listDanhSachSanPham[index]?.soLuong === 30) {
      handleDialogOpen("Chúng tôi không nhận đơn hàng có sản phẩm trên 30 sản phẩm cho một mặt hàng \n  Với số lượng lớn bạn vui lòng liên hệ với chúng tôi để được nhận giá và trải nghiệm tốt nhất");
      return;
    }
    let apiUrl = `http://localhost:8080/hdctClient/tangSoLuongOnline/${id}`;
    try {
      const response = await axios.post(apiUrl);//Gọi api bằng axiosGet
      if (response.data === "Ok") {
        fetchHoaDon();
      } else if (response.data === "Hết sản phẩm") {
        showErrorToast("Rất tiếc đã hết sản phẩm");
      } else if (response.data === "Có mặt hàng vượt quá số lượng 30") {
        handleDialogOpen("Chúng tôi không nhận đơn hàng có sản phẩm trên 30 sản phẩm cho một mặt hàng \n  Với số lượng lớn bạn vui lòng liên hệ với chúng tôi để được nhận giá và trải nghiệm tốt nhất");
      } else if (response.data === "Đơn hàng vượt quá 20tr") {
        handleDialogOpen("Chúng tôi không nhận đơn hàng quá 20 triệu cho đơn online \n  Với số lượng lớn bạn vui lòng liên hệ với chúng tôi để được nhận giá và trải nghiệm tốt nhất");
      } else {
        showErrorToast(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Lỗi khi tăng số lượng sản phẩm");
    }
  }


  //Hàm xử lý nhập số lượng
  const nhapSoLuong = async (id, soLuong) => {
    if (soLuong > 30) {
      handleDialogOpen("Chúng tôi không nhận đơn hàng có sản phẩm trên 30 sản phẩm cho một mặt hàng \n  Với số lượng lớn bạn vui lòng liên hệ với chúng tôi để được nhận giá và trải nghiệm tốt nhất");
      return;
    }
    let apiUrl = `http://localhost:8080/hdctClient/nhapSoLuongOnline/${id}/${soLuong}`;
    try {
      const response = await axios.post(apiUrl);//Gọi api bằng axiosGet
      if (response.data === "Ok") {
        fetchHoaDon();
      } else if (response.data === "Có mặt hàng vượt quá số lượng 30") {
        setTempValues({});
        handleDialogOpen("Chúng tôi không nhận đơn hàng có sản phẩm trên 30 sản phẩm cho một mặt hàng \n  Với số lượng lớn bạn vui lòng liên hệ với chúng tôi để được nhận giá và trải nghiệm tốt nhất");
      } else if (response.data === "Đơn hàng vượt quá 20tr") {
        setTempValues({});
        handleDialogOpen("Chúng tôi không nhận đơn hàng quá 20 triệu cho đơn online \n  Với số lượng lớn bạn vui lòng liên hệ với chúng tôi để được nhận giá và trải nghiệm tốt nhất");
      } else {
        setTempValues({});
        showErrorToast(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showErrorToast("Lỗi khi nhập số lượng sản phẩm catch");
    }
  }
  const handleOpenConfirmModal = (product) => {
    setSelectedProduct(product);
    setOpenConfirmModal(true);
  };

  //Cập nhật giá trị khi thay đổi số lượng nhập từ bàn phím
  const handleInputChangeThemSanPhamVaoGioHang = (value) => {
    setQuantity(value);
    let newValue = value.replace(/\D/g, ''); // Chỉ cho phép nhập số

    if (/^0+$/.test(newValue)) {
      newValue = "";
    }

    if (newValue != "") {
      if (Number(newValue) > selectedProduct.soLuong) {
        newValue = Number(newValue).toString().slice(0, -1) || selectedProduct.soLuong;
      }
    }
    setTimeout(() => {
      setQuantity(newValue);
    }, 50);
    if (newValue === "" || Number(newValue) <= 0) {
      setErrorSoLuongThemVaoGioHang("Không hợp lệ");
    } else {
      setErrorSoLuongThemVaoGioHang(""); // Xóa lỗi nếu nhập đúng
    }

  };


  //Xử lý khi confirm thêm vào giỏ hàng
  const handleCloseConfirmModal = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/hdctClient/addSanPhamSauKhiDatHang`, { idHoaDon: hoaDon.id, idSanPhamChiTiet: selectedProduct.id, soLuong: quantity, donGia: selectedProduct.gia }
      );
      if (response.data === "Ok") {
        setSelectedProduct(null);
        setQuantity(1);
        setOpenConfirmModal(false);
        getSanPhamThem();
        showSuccessToast("Thêm sản phẩm thành công");
      } else if (response.data === "Có mặt hàng vượt quá số lượng 30") {
        handleDialogOpen("Chúng tôi không nhận đơn hàng có sản phẩm trên 30 sản phẩm cho một mặt hàng \n  Với số lượng lớn bạn vui lòng liên hệ với chúng tôi để được nhận giá và trải nghiệm tốt nhất");
      } else if (response.data === "Đơn hàng vượt quá 20tr") {
        handleDialogOpen("Chúng tôi không nhận đơn hàng quá 20 triệu cho đơn online \n  Với số lượng lớn bạn vui lòng liên hệ với chúng tôi để được nhận giá và trải nghiệm tốt nhất");
      } else {
        showErrorToast(response.data);
      }
    } catch (error) {
      showErrorToast("Thêm sản phẩm thất bại. Vui lòng thử lại!");
      console.error(error.response || error.message);
    }
  };



  const clickDeleteIcon = (id) => {
    if (hoaDon?.listDanhSachSanPhamHoatDong?.length === 1) {
      showErrorToast("Hóa đơn không được để trống sản phẩm");
      return;
    }
    setSelectedProductId(id);
    setOpenConfirmModal(true);
  }

  const listThanhToan = (hoaDon?.listThanhToanHoaDon || [])
    .filter(tt => tt?.loai !== "Hoàn tiền")

  const soTienDaThanhToan = listThanhToan?.reduce((tong, tt) => tong + tt?.soTien, 0);

  const listHoanTien = (hoaDon?.listThanhToanHoaDon || [])
    .filter(tt => tt?.loai === "Hoàn tiền") // Lọc chỉ lấy các phần tử có id = 3

  const tongTienDaThanhToanVaDaHoanTienCuaOnline = soTienDaThanhToan - listHoanTien?.reduce((tong, tt) => tong + tt?.soTien, 0); // Tính tiền cần hoàn lấy tiền đã thanh toán trừ đi tiền đã hoàn so sánh với số tiền cần thanh toán của hóa đơn

  const handleNextCheckHoanTienVaMoModal = () => {

    if (hoaDon?.trangThai === "Đã thanh toán" && tongTienDaThanhToanVaDaHoanTienCuaOnline > hoaDon?.tongTienThanhToan) {
      showErrorToast("Bạn chưa hoàn tiền cho khách hàng");
      return;
    }
    setOpenGhiChuNext(true);
  }
  const handleHuyCheckHoanTienVaMoModal = () => {
    if (tongTienDaThanhToanVaDaHoanTienCuaOnline > hoaDon?.tongTienThanhToan) {
      showErrorToast("Bạn chưa hoàn tiền cho khách hàng");
      return;
    }
    handleOpenLyDo();
  }

  const handleHoanTien = async () => {
    // Gửi API hoàn tiền hoặc thực hiện xử lý tại đây
    try {
      const response = await axios.post(
        `http://localhost:8080/hoa-don-chi-tiet/hoanTien/${id}`, null,
        {
          params: {
            soTienCanHoan: tongTienDaThanhToanVaDaHoanTienCuaOnline - hoaDon?.tongTienThanhToan
          }
        });//Gọi api bằng  
      if (response.data) {
        setOpenConfirmRefund(false);
        fetchHoaDon();
        showSuccessToast("Xác nhận hoàn tiền thành công");
      } else {
        setOpenConfirmRefund(false);
        showErrorToast("Xác nhận hoàn tiền thất bại");

      }
    } catch (error) {
      showErrorToast("Xác nhận hoàn tiền thất bại. Vui lòng thử lại!");
      console.error(error.response || error.message);
    }
  };

  return (
    <div>
      <Dialog open={openDialogThongBaoHetHangHoacKDuSoLuong} onClose={handleDialogClose}>
        <DialogTitle>Thông Báo</DialogTitle>
        {tenSanPhamThongBao && <DialogContent ><strong>{tenSanPhamThongBao}</strong></DialogContent>}
        <DialogContent>{dialogMessage}</DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Đóng</Button>
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
              [selectedProductId]: hoaDon?.listDanhSachSanPham?.find((p) => p.id === selectedProductId)?.soLuong || 1, // Reset nếu nhập sai
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
          {(hoaDon.tongTienThanhToan - tongTienDaThanhToanVaDaHoanTienCuaOnline) > 0 &&
            <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6">Thanh toán còn lại</Typography>
              <Typography variant="h6" sx={{ color: 'red', fontWeight: 'bold' }}>{(hoaDon.tongTienThanhToan - tongTienDaThanhToanVaDaHoanTienCuaOnline)?.toLocaleString()} VNĐ</Typography>
            </Grid>
          }
          {/* Tổng tiền hàng */}
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
          )}</DialogContent> <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
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
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(`/admin/hoaDon`)} sx={{ marginRight: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Quản lý đơn hàng{" "}
          <Box component="span" sx={{ color: "#b0b0b0", fontWeight: "bold" }} >
            / Chi tiết hóa đơn {hoaDon.ma}
          </Box>
        </Typography>
      </Box>
      {/* Trạng thái hóa đơn */}
      <Box sx={{ textAlign: "center", maxWidth: "100%", mb: 3, display: "flex", justifyContent: "center" }}>
        {isCanceled ? (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "error.dark",
              bgcolor: "#FFEBEE",
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 2px 8px rgba(211, 47, 47, 0.2)",
              display: "inline-block",
              maxWidth: "90%",
            }}
          >
            🚫 Hóa đơn này đã bị hủy!
          </Typography>
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", overflow: "hidden" }}>
              <Box
                ref={scrollRef}
                onWheel={handleWheel}
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": { height: 4 },
                  "&::-webkit-scrollbar-thumb": { bgcolor: "grey.400", borderRadius: 2 },
                  width: "100%",
                  maxWidth: "1200px", // Giới hạn chiều rộng tối đa để không kéo cả trang
                  p: 1,
                  whiteSpace: "nowrap",
                  alignItems: "center",
                }}
              >

                {steps.map((step, index) => {
                  const isPast = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isSameStatus = step === steps[currentStep]; // Kiểm tra trùng trạng thái                
                  return (
                    <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                      <Chip
                        label={step}
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          fontWeight: isCurrent ? 700 : 500,
                          bgcolor: isSameStatus ? "#3498EA" : isPast ? "success.main" : isCurrent ? "warning.main" : "grey.300",
                          color: "white",
                          transition: "0.3s",
                          boxShadow: isCurrent ? "0px 2px 8px rgba(78, 172, 235, 0.16)" : "none",
                        }}
                      />
                      {index < steps.length - 1 && (
                        <Box
                          sx={{
                            width: 30,
                            height: 3,
                            bgcolor: isPast ? "success.light" : "grey.400",
                            mx: 1,
                            transition: "0.3s",
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </>)}
      </Box>
      <Box display="flex" gap={2} justifyContent="center" mb={3}>
        <Stack direction="row" spacing={2}>
          {/* Nút Previous */}
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{
              borderRadius: 3,
              px: 3,
              boxShadow: 2,
              background: "#2e7d32",
              "&:hover": { background: "#2e7d32" },
            }}
            onClick={() => setOpenGhiChuPrevious(true)}
            disabled={currentStep === 0 || isCanceled || isComplete || hoaDon?.trangThai === "Đã xác nhận"} // Vô hiệu hóa khi ở trạng thái đầu tiên hoặc khi hóa đơn đã hủy hoặc hoàn thành
          >
            Hoàn tác
          </Button>
          <Dialog open={openGhiChuPrevious} onClose={() => setOpenGhiChuPrevious(false)}>
            <DialogTitle>Nhập lý do hoàn tác trạng thái</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="* Nhập lý do hoàn tác trạng thái:"
                variant="outlined"
                value={ghiChuTrangThai}
                onChange={(e) => { setGhiChuTrangThai(e.target.value); setError(false) }}
                error={error} // Hiển thị lỗi nếu có
                helperText={error ? "Bạn chưa nhập lý do!" : ""} // Nội dung lỗi
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenGhiChuPrevious(false)} color="primary">
                Hủy bỏ
              </Button>
              <Button onClick={handleNextConfirmPrevious} color="warning" variant="contained">
                Tiếp tục
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openConfirmPrevious} onClose={() => setOpenConfirmPrevious(false)}>
            <DialogTitle>Xác nhận hoàn tác trạng thái hóa đơn</DialogTitle>
            <DialogContent>
              <p><b>Lý do hoàn tác trạng thái:</b> {ghiChuTrangThai}</p>
              <p>Bạn có chắc chắn muốn hoàn tác trạng thái hóa đơn này không?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmPrevious(false)} color="primary">
                Quay lại
              </Button>
              <Button onClick={handlePrevious} color="warning" variant="contained">
                Xác nhận hoàn tác
              </Button>
            </DialogActions>
          </Dialog>

          {/* Nút Next */}
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 3,
              px: 3,
              boxShadow: 2,
              background: "#3498EA",
              "&:hover": { background: "#3498EA" },
            }}
            onClick={() => handleNextCheckHoanTienVaMoModal()}
            disabled={isCanceled || isComplete ||
              (hoaDon.trangThai === "Chờ thanh toán" &&  // Nếu trạng thái là "Chờ thanh toán"
                (!hoaDon.listThanhToanHoaDon ||              // Nếu danh sách lịch sử thanh toán không tồn tại
                  hoaDon.listThanhToanHoaDon.length === 0 ||  // Hoặc danh sách rỗng
                  tongTienDaThanhToanVaDaHoanTienCuaOnline < hoaDon.tongTienThanhToan)) ||
              (hoaDon.trangThai === "Đã xác nhận" &&  // Nếu trạng thái là "Đã xác nhận"
                (!hoaDon.listDanhSachSanPham || hoaDon.listDanhSachSanPham.length === 0)) ||  // Nếu danh sách sản phẩm rỗng thì vô hiệu hóa
              (hoaDon.trangThai === "Chờ thanh toán" &&
                (!hoaDon.listDanhSachSanPham || hoaDon.listDanhSachSanPham.length === 0))
            }
          >
            Xác nhận
          </Button>
          <Dialog open={openGhiChuNext} onClose={() => setOpenGhiChuNext(false)}>
            <DialogTitle>Nhập lý do thay đổi trạng thái</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Nhập lý do cập nhật trạng thái trạng thái(Có thể nhập hoặc không):"
                variant="outlined"
                placeholder="Có thể nhập hoặc để trống"
                value={ghiChuTrangThai}
                onChange={(e) => { setGhiChuTrangThai(e.target.value); setError(false) }}
              // error={error} // Hiển thị lỗi nếu có
              // helperText={error ? "Bạn chưa nhập lý do!" : ""} // Nội dung lỗi
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenGhiChuNext(false)} color="primary">
                Hủy bỏ
              </Button>
              <Button onClick={handleNextConfirmNext} color="primary" variant="contained">
                Tiếp tục
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openConfirmNext} onClose={() => setOpenConfirmNext(false)}>
            <DialogTitle>Xác nhận cập nhật trạng thái hóa đơn</DialogTitle>
            <DialogContent>
              <p><b>Lý do cập nhật trạng thái:</b> {ghiChuTrangThai}</p>
              <p>Bạn có chắc chắn muốn cập nhật trạng thái hóa đơn này không?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmNext(false)} color="primary">
                Quay lại
              </Button>
              <Button onClick={handleNext} color="primary" variant="contained">
                Xác nhận cập nhật
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>

        <Button disabled={isCanceled || isComplete || (hoaDon.trangThai !== "Chờ xác nhận")} variant="outlined" color="error" startIcon={<Delete />} sx={{ borderRadius: 3, px: 3 }} onClick={() => handleHuyCheckHoanTienVaMoModal()}>
          Hủy hóa đơn
        </Button>
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
            <Button onClick={handleHuyHoaDon} color="error" variant="contained">
              Xác nhận hủy
            </Button>
          </DialogActions>
        </Dialog>
        <Button variant="outlined" color="secondary" startIcon={<History />} sx={{ borderRadius: 3, px: 3 }} onClick={() => setOpen(true)} >
          Lịch sử hóa đơn
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Lịch sử hóa đơn
            <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", right: 16, top: 16 }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            {/* Table hiển thị lịch sử hóa đơn */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow >
                    <TableCell><b>#</b></TableCell>
                    <TableCell><b>Hành động</b></TableCell>
                    <TableCell><b>Thời gian</b></TableCell>
                    <TableCell><b>Mô tả</b></TableCell>
                    <TableCell><b>Nhân viên xác nhận</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hoaDon?.listLichSuHoaDon?.map((lshd, index) => (
                    <TableRow key={index}
                      sx={{
                        backgroundColor:
                          lshd.hanhDong === "Hoàn tác" ? "#E8F5E9" :  // Xanh nhạt
                            lshd.hanhDong === "Hủy" ? "#FFEBEE" :       // Đỏ nhạt
                              lshd.hanhDong === "Hoàn thành" ? "#ECEFF1" : // Xám nhạt
                                "white", // Mặc định là màu trắng
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell >{lshd.hanhDong}</TableCell>
                      <TableCell>{new Date(lshd.ngay).toLocaleString("vi-VN")}</TableCell>
                      <TableCell>{lshd.moTa}</TableCell>
                      <TableCell>{lshd.nguoiTao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>

          {/* Nút đóng dialog */}
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary" variant="contained">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Thông tin hóa đơn */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          {/* Cột 1: Thông tin hóa đơn */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1976D2" }}>
              Thông tin hóa đơn {hoaDon.ma}
            </Typography>

            <Typography>
              <b>Trạng thái:</b>{" "}
              <Box
                component="span"
                sx={{
                  ...getStatusStyles(hoaDon.trangThai),
                  borderRadius: "8px",
                  padding: "4px 10px",
                  fontWeight: "normal",
                  display: "inline-block",
                  ml: 1,
                }}
              >
                {hoaDon.trangThai}
              </Box>
            </Typography>

            <Typography sx={{ marginTop: "5px" }}>
              <b>Loại hóa đơn:</b>{" "}
              <Box sx={{
                backgroundColor: hoaDon.loaiHoaDon === "Online" ? "#E3F2FD" : "#FFEBEE",
                color: hoaDon.loaiHoaDon === "Online" ? "#1976D2" : "#D32F2F",
                borderRadius: "8px",
                padding: "4px 10px",
                fontWeight: "normal",
                display: "inline-block",
                ml: 1,
              }}>
                {hoaDon.loaiHoaDon}
              </Box>
            </Typography>

            <Typography>
              <b>Ghi chú:</b> {hoaDon.ghiChu}
            </Typography>
          </Grid>

          {/* Cột 2: Thông tin nhận hàng */}
          {hoaDon.sdtNguoiNhanHang && (
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h7" gutterBottom sx={{ fontWeight: "bold", color: "#E65100" }}>
                  Thông tin nhận hàng
                </Typography>
                {hoaDon.trangThai === "Chờ xác nhận" &&
                  <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: "white",
                      color: "#0077ff", // Màu chữ xanh
                      borderColor: "#0077ff", // Màu viền xanh
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                        borderColor: "#1565c0",
                        color: "#1565c0",
                      },
                    }}
                    onClick={handleChangeAddress} // Sử dụng hàm để mở modal
                  >
                    Thay đổi địa chỉ
                  </Button>
                }
              </Box>
              <Typography>
                <b>Tên người nhận:</b> {hoaDon.tenNguoiNhanHang}
              </Typography>
              <Typography>
                <b>SDT người nhận:</b> {hoaDon.sdtNguoiNhanHang}
              </Typography>
              <Typography>
                <b>Email người nhận:</b> {hoaDon.emailNguoiNhanHang}
              </Typography>
              <Typography>
                <b>Địa chỉ người nhận:</b> {hoaDon.diaChiNguoiNhanHang}
              </Typography>
            </Grid>
          )
          }

          {/* Dòng mới: Thông tin khách hàng */}
          <Grid item xs={12}>
            <Typography variant="h7" gutterBottom sx={{ fontWeight: "bold", color: "#388E3C", mt: 2 }}>
              Thông tin khách hàng
            </Typography>
            <Typography>
              <Box sx={{
                backgroundColor: "#D1E8FF",
                color: "#0D47A1",
                borderRadius: "8px",
                padding: "4px 10px",
                fontWeight: "normal",
                display: "inline-block",

              }}>
                {hoaDon.maKhachHang ?
                  `${hoaDon.maKhachHang} - ${hoaDon.tenKhachHang} - ${hoaDon.sdtKhachHang}` : "Khách vãng lai"}
              </Box>

            </Typography>
          </Grid>
        </Grid>
      </Paper>



      {/* Lịch sử thanh toán */}

      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflow: "hidden", flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "1.2rem", flex: 1, textAlign: "center" }}
          >
            Lịch sử thanh toán
          </Typography>

          {(hoaDon.trangThai != "Đã thanh toán" && hoaDon.trangThai != "Hoàn thành" && hoaDon.trangThai != "Đã hủy" && hoaDon.tongTienSanPham > 0) &&
            <Button
              variant="outlined" // Đặt kiểu viền
              onClick={() => setOpenTT(true)} // Khi nhấn mở modal
              sx={{
                borderColor: 'black', // Viền màu đen
                color: 'black', // Màu chữ đen
                backgroundColor: 'white', // Nền trắng
                borderRadius: '8px', // Bo góc
                padding: '3px 13px', // Khoảng cách trong button
                minWidth: '130px', // Kích thước tối thiểu cho button không bị co lại
                // marginRight: "10px",
                '&:hover': {
                  backgroundColor: '#f5f5f5', // Màu nền nhạt hơn khi hover
                  borderColor: 'black' // Giữ viền màu đen khi hover
                }
              }}
            >
              <CreditCardIcon style={{ color: 'black', marginRight: '5px' }} /> {/* Icon ví */}
              Thanh toán
            </Button>
          }
        </Box>
        <Table sx={{ border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>#</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Phương Thức</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số Tiền</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Thời Gian</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Nhân Viên Xác Nhận</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Ghi Chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listThanhToan?.length > 0 ? (
              listThanhToan?.map((payment, index) => (
                <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{payment.phuongThuc}</TableCell>
                  <TableCell align="center">{payment.soTien.toLocaleString()} VND</TableCell>
                  <TableCell align="center">{new Date(payment.ngayTao).toLocaleString("vi-VN")}</TableCell>
                  <TableCell align="center">{payment.nhanVienXacNhan}</TableCell>
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
      {(listHoanTien?.length > 0 || (hoaDon?.loaiHoaDon === "Online" && tongTienDaThanhToanVaDaHoanTienCuaOnline > hoaDon?.tongTienThanhToan)) &&
        <>
          <Dialog
            open={openConfirmRefund}
            onClose={() => setOpenConfirmRefund(false)}
          >
            <DialogTitle fontWeight="bold">Xác nhận hoàn tiền</DialogTitle>
            <DialogContent>
              <Typography>Bạn có chắc chắn muốn xác nhận đã hoàn tiền {(tongTienDaThanhToanVaDaHoanTienCuaOnline - hoaDon?.tongTienThanhToan)?.toLocaleString()} cho khách hàng?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmRefund(false)} color="inherit">
                Hủy
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  // TODO: Xử lý hoàn tiền ở đây
                  handleHoanTien(); // Giả sử bạn có hàm này xử lý hoàn tiền

                }}
              >
                Xác nhận
              </Button>
            </DialogActions>
          </Dialog>
          <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflow: "hidden", flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "1.2rem", flex: 1, textAlign: "center" }}
              >
                Lịch sử hoàn tiền
              </Typography>
              {(hoaDon.loaiHoaDon === "Online" && tongTienDaThanhToanVaDaHoanTienCuaOnline > hoaDon.tongTienThanhToan) &&
                <Button
                  variant="outlined" // Đặt kiểu viền 
                  onClick={() => setOpenConfirmRefund(true)} // Khi nhấn mở modal
                  sx={{
                    borderColor: 'black', // Viền màu đen
                    color: 'black', // Màu chữ đen
                    backgroundColor: 'white', // Nền trắng
                    borderRadius: '8px', // Bo góc
                    padding: '3px 13px', // Khoảng cách trong button
                    minWidth: '130px', // Kích thước tối thiểu cho button không bị co lại
                    // marginRight: "10px",
                    '&:hover': {
                      backgroundColor: '#f5f5f5', // Màu nền nhạt hơn khi hover
                      borderColor: 'black' // Giữ viền màu đen khi hover
                    }
                  }}
                >
                  <CreditCardIcon style={{ color: 'black', marginRight: '5px' }} /> {/* Icon ví */}
                  Xác nhận hoàn tiền {(tongTienDaThanhToanVaDaHoanTienCuaOnline - hoaDon?.tongTienThanhToan)?.toLocaleString()}
                </Button>
              }
            </Box>
            <Table sx={{ border: "1px solid #ddd" }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>#</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Phương Thức</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số Tiền</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Thời Gian</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Nhân Viên Xác Nhận</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Ghi Chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listHoanTien?.map((payment, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{payment.phuongThuc}</TableCell>
                    <TableCell align="center">{payment.soTien.toLocaleString()} VND</TableCell>
                    <TableCell align="center">{new Date(payment.ngayTao).toLocaleString("vi-VN")}</TableCell>
                    <TableCell align="center">{payment.nhanVienXacNhan}</TableCell>
                    <TableCell align="center">{payment.ghiChu}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      }


      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "1.2rem", flex: 1, textAlign: "center" }}
          >
            Danh sách sản phẩm
          </Typography>
          {hoaDon.trangThai === "Chờ xác nhận" &&

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
          }
        </Box>

        <Table sx={{ border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>STT</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Hình ảnh</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Sản phẩm</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số lượng</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Đơn giá</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số tiền</TableCell>
              {(hoaDon.trangThai === "Chờ xác nhận" && listDanhSachSanPhamHoatDong?.length > 1) && <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {hoaDon?.listDanhSachSanPham?.length === 0 ? (

              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 2, fontStyle: "italic", color: "gray" }}>
                  Không có dữ liệu
                </TableCell>
              </TableRow>

            ) : (
              hoaDon?.listDanhSachSanPham?.map((product, index) => {
                const images = product.hinhAnh || [];
                const currentIndex = imageIndexes[product.id] ?? 0;
                return (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: product.trangThai !== "Hoạt động" ? "#FFEBEE" : "inherit", // Màu đỏ nhạt nếu không hoạt động
                      "&:hover": { backgroundColor: product.trangThai !== "Hoạt động" ? "#FFCDD2" : "#f5f5f5" } // Màu hover khác nhau
                    }}
                  >
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
                      {(productsCapNhatSoLuong[index]?.soLuongConLai < 0 && hoaDon.trangThai === "Chờ xác nhận") && (
                        productsCapNhatSoLuong[index]?.soLuongGoc === 0 ?
                          <Typography variant="caption" color="error" display="block" font Weight="bold">
                            Sản phẩm này đã hết hàng
                          </Typography> :
                          <Typography variant="caption" color="error" display="block" fontWeight="bold">
                            Sản phẩm hiện chỉ còn {productsCapNhatSoLuong[index]?.soLuongGoc} sản phẩm
                          </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" alignItems="center">
                        {hoaDon.trangThai === "Chờ xác nhận" && product.trangThai === "Hoạt động" ? (
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
                              onClick={() => tangSoLuong(index, product.id)}
                              sx={{ borderLeft: "1px solid #ccc", background: "#f5f5f5", borderRadius: 0 }}
                              hidden={hoaDon.trangThai != "Chờ xác nhận"}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>

                          </Box>
                        ) : (
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
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">{product.donGia?.toLocaleString()} VNĐ</TableCell>
                    <TableCell align="center">{product.soTien?.toLocaleString()} VNĐ</TableCell>
                    <TableCell align="center">
                      {(hoaDon.trangThai === "Chờ xác nhận" && product.trangThai === "Hoạt động" && listDanhSachSanPhamHoatDong?.length > 1) &&
                        <IconButton color="error" onClick={() => clickDeleteIcon(product.id)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ p: 2, borderRadius: 2 }}>
        {/* Tổng tiền hàng */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1" fontWeight={500}>Tổng tiền sản phẩm:</Typography>
          <Typography variant="body1" fontWeight={500}>{hoaDon.tongTienSanPham?.toLocaleString()} VNĐ</Typography>
        </Box>

        {/* Phí ship */}
        {(hoaDon?.phiVanChuyen ?? 0) > 0 && (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1" fontWeight={500}>Phí vận chuyển:</Typography>
            <Typography variant="body1" fontWeight={500}>{(hoaDon?.phiVanChuyen ?? 0).toLocaleString()} VNĐ</Typography>
          </Box>
        )}

        {/* Mã voucher */}
        {phieuGiamGia && (
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body1" fontWeight={500}>Mã giảm giá:</Typography>
            <Typography variant="body1" fontWeight={500} color="error">
              {phieuGiamGia.ma} - {Math.round(tienGiam).toLocaleString()} VNĐ
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Tổng tiền thanh toán */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" color="primary">
            Tổng thanh toán:
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: "#D32F2F",
              // textShadow: "0px 0px 5px rgba(211, 47, 47, 0.5)",
            }}
          >
            {(hoaDon.tongTienThanhToan ?? 0).toLocaleString()} VNĐ
          </Typography>

        </Box>
        {(soTienDaThanhToan > 0 && tongTienDaThanhToanVaDaHoanTienCuaOnline < hoaDon?.tongTienThanhToan) &&
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold" color="primary">
                Đã thanh toán:
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  color: "#D32F2F",
                  // textShadow: "0px 0px 5px rgba(211, 47, 47, 0.5)",
                }}
              >
                {(tongTienDaThanhToanVaDaHoanTienCuaOnline ?? 0).toLocaleString()} VNĐ
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold" color="primary">
                Số tiền cần thanh toán còn lại:
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  color: "#D32F2F",
                  // textShadow: "0px 0px 5px rgba(211, 47, 47, 0.5)",
                }}
              >
                {(hoaDon.tongTienThanhToan - tongTienDaThanhToanVaDaHoanTienCuaOnline ?? 0).toLocaleString()} VNĐ
              </Typography>
            </Box>
          </>}
      </Box>
      <ToastContainer /> {/* Quan trọng để hiển thị toast */}
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
                                // <img
                                //   src={soldOutImg}  // Đổi link ảnh nếu cần
                                //   alt="Sold Out"
                                //   style={{ width: "100px", height: "50px", objectFit: "contain" }}
                                // />
                                <Typography color="error" fontWeight="bold">
                                  Hết hàng
                                </Typography>
                              ) : product.trangThai !== "Hoạt động" ? (
                                // Nếu không hoạt động, hiển thị ảnh Ngừng Hoạt Động
                                // <img
                                //   src={inactiveImg}  // Đổi link ảnh nếu cần
                                //   alt="Ngừng Hoạt Động"
                                //   style={{ width: "100px", height: "40px", objectFit: "contain" }}
                                // />
                                <Typography color="error" fontWeight="bold">
                                  Ngừng hoạt động
                                </Typography>
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
                      onClick={() => { setQuantity(1); fetchHoaDon(); setOpenConfirmModal(false) }}
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

      {/* Modal thay đổi địa chỉ nhận hàng */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Thay đổi địa chỉ</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Họ và Tên"
                fullWidth
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
                variant="outlined"
                margin="normal"
                size="small"
              />
              {errorMessage.hoTen && <Typography color="error" variant="body2">{errorMessage.hoTen}</Typography>}
            </Grid>

            <Grid item xs={12} marginTop={-2}>
              <TextField
                label="Số Điện Thoại"
                fullWidth
                value={sdt}
                onChange={(e) => setSdt(e.target.value)}
                variant="outlined"
                margin="normal"
                size="small"
              />
              {errorMessage.sdt && <Typography color="error" variant="body2">{errorMessage.sdt}</Typography>}
            </Grid>

            <Grid item xs={12} marginTop={-2}>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                size="small"
              />
              {errorMessage.email && <Typography color="error" variant="body2">{errorMessage.email}</Typography>}
            </Grid>

            <Grid item xs={12} marginTop={-2}>
              <TextField
                label="Địa Chỉ Cụ Thể"
                fullWidth
                value={diaChiCuThe}
                onChange={(e) => setDiaChiCuThe(e.target.value)}
                variant="outlined"
                margin="normal"
                size="small"
              />
              {errorMessage.diaChi && <Typography color="error" variant="body2">{errorMessage.diaChi}</Typography>}
            </Grid>

            {/* Các trường Thành phố, Quận, Xã... */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" sx={{ height: '100%' }}>
                <InputLabel>Tỉnh/Thành phố</InputLabel>
                <Select
                  value={city}
                  onChange={handleCityChange}
                  label="Tỉnh/Thành phố"
                >
                  {cities.map((city) => (
                    <MenuItem key={city.Id} value={city.Name}>
                      {city.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" sx={{ height: '100%' }}>
                <InputLabel>Quận/Huyện</InputLabel>
                <Select
                  value={district}
                  onChange={handleDistrictChange}
                  label="Quận/Huyện"
                >
                  {districts.map((district) => (
                    <MenuItem
                      key={district.DistrictID}
                      value={district.DistrictName}
                    >
                      {district.DistrictName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" sx={{ height: '100%' }}>
                <InputLabel>Xã/Phường</InputLabel>
                <Select
                  value={ward}
                  onChange={handleWardChange}
                  label="Xã/Phường"
                >
                  {wards.length > 0 ? (
                    wards.map((ward) => (
                      <MenuItem
                        key={ward.WardCode}
                        value={ward.WardName}
                      >
                        {ward.WardName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Không có dữ liệu</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Phí vận chuyển */}
            <Grid item xs={12} marginTop={-1}>
              <TextField
                label="Phí vận chuyển"
                fullWidth
                value={hoaDon.phiVanChuyen}
                onChange={handlePhiVanChuyenChange}  // Sử dụng hàm thay đổi riêng cho phí vận chuyển
                variant="outlined"
                margin="normal"
                size="small"
              />
              {errorMessage.phiShip && <Typography color="error" variant="body2">{errorMessage.phiShip}</Typography>}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Hủy</Button>
          <Button onClick={handleSave} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>


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
export default HoaDonChiTiet;
