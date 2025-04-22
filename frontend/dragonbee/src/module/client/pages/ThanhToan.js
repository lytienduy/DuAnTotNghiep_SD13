import React, { useState, useEffect } from 'react'; // Thêm useEffect ở đây
import axios from 'axios';
import {
    Box, Grid, TextField, Typography, Button, FormControlLabel, Radio, InputAdornment,
    Container, Breadcrumbs, Link, MenuItem, Select, InputLabel, FormControl, Input, Dialog,
    DialogTitle, IconButton, DialogContent, DialogActions, DialogContentText, Modal,
    TableContainer, Paper, Table, TableHead, TableCell, TableRow, TableBody
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const PayNowImage = 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png'; // PayNow image URL
const CODImage = 'https://drive.gianhangvn.com/image/thanh-toan-khi-nhan-hang-2135165j32025.jpg';


const ThanhToan = () => {
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [discount, setDiscount] = useState(0);
    const [selectedGHNDistrict, setSelectedGHNDistrict] = useState("");
    const [selectedGHNWard, setselectedGHNWard] = useState("");
    const [bestVoucher, setBestVoucher] = useState(null);
    //Khai báo Thành phố huyện xã
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [specificAddress, setSpecificAddress] = useState('');
    const [ghiChu, setGhiChu] = useState('');
    const [tenNguoiNhan, setTenNguoiNhan] = useState('');
    const [sdtNguoiNhan, setSdtNguoiNhan] = useState('');
    const [emailNguoiNhan, setEmailNguoiNhan] = useState('');

    //Thêm mới địa chỉ
    const [newCities, setNewCities] = useState([]);
    const [newDistricts, setNewDistricts] = useState([]);
    const [newWards, setNewWards] = useState([]);
    const [newCity, setNewCity] = useState('');
    const [newDistrict, setNewDistrict] = useState('');
    const [newWard, setNewWard] = useState('');

    //khai báo phiếu giảm giá
    const [openVoucherModal, setOpenVoucherModal] = useState(false);
    const [voucherCode, setVoucherCode] = useState('');
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucherCode, setSelectedVoucherCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
    const [phiShip, setPhiShip] = useState(0);

    //Phong
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const selectedProducts = location.state?.selectedProducts || []; // Tránh undefined
    const tongTien = products.reduce((tong, item) => tong + item.gia * item.quantity, 0);
    const tongTienThanhToan = tongTien - discountAmount + Number(discount);
    const [openConfirmDatHang, setOpenConfirmDatHang] = useState(false);
    const userKH = JSON.parse(localStorage.getItem("userKH"));

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

    const getEstimatedDeliveryDate = () => {
        const today = new Date();
        const estimatedDate = new Date();
        estimatedDate.setDate(today.getDate() + 5); // Cộng thêm 5 ngày

        // Format về dạng dd/mm/yyyy
        const day = estimatedDate.getDate().toString().padStart(2, '0');
        const month = (estimatedDate.getMonth() + 1).toString().padStart(2, '0');
        const year = estimatedDate.getFullYear();

        return `${day}/${month}/${year}`;
    };

    //Lấy dữ liệu cart
    const layDuLieuCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const filteredCart = cart.filter((_, index) => selectedProducts.includes(index));
        setProducts(filteredCart);
    };

    useEffect(() => {
        layDuLieuCart();
    }, []);

    const khiAnNutXacNhanDatHang = () => {
        if (selectedPaymentMethod === "") {
            showErrorToast("Bạn chưa chọn phương thức thanh toán");
            return;
        }
        setOpenConfirmDatHang(true);
    }

    //Hàm lưu hóa đơn
    const luuHoaDon = async (maHoaDon = "") => {
        const addressParts = [specificAddress, ward, district, city]
            .filter(part => part) // Lọc bỏ giá trị null, undefined hoặc chuỗi rỗng
            .join(", "); // Ghép chuỗi với dấu , cách
        const response = await axios.post(`http://localhost:8080/thanhToanClient/xacNhanDatHang`, {
            maHoaDon: maHoaDon,
            pgg: selectedVoucherCode,
            tenNguoiNhan: tenNguoiNhan,
            sdtNguoiNhan: sdtNguoiNhan,
            emailNguoiNhan: emailNguoiNhan,
            diaChiNhanHang: addressParts,
            tongTienPhaiTra: tongTienThanhToan,
            phiShip: discount,
            ghiChu: ghiChu,
            danhSachThanhToan: products, //đây là mảng json
            idKhachHang: userKH?.khachHang?.id || null
        })
        if (response.data === "OK") {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            // Loại bỏ các phần tử có index nằm trong selectedProducts
            const updatedCart = cart.filter((_, index) => !selectedProducts.includes(index));
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            showSuccessToast("Đặt hàng thành công. Cảm ơn quý khách");
            navigate('/datHangThanhCong', { state: { selectedProducts } });
        }
        else {
            showErrorToast(response.data);
        }
    }

    // ✅ Hàm kiểm tra trạng thái hóa đơn
    const checkPaymentStatus = async (maHoaDon) => {
        try {
            const response = await axios.get(`http://localhost:8080/payment/check-status?maHoaDon=${maHoaDon}`);
            if (response.data === "Đã thanh toán") {
                luuHoaDon(maHoaDon);
            } else {
                showErrorToast("Bạn chưa hoàn tất thanh toán!");
            }
        } catch (err) {
            console.error("Lỗi khi kiểm tra thanh toán:", err);
        }
    };

    const xacNhanDatHang = async () => {
        try {
            setOpenConfirmDatHang(false);
            if (selectedPaymentMethod === "COD") {
                luuHoaDon();
            } else if (selectedPaymentMethod === "PayNow") {
                const maHoaDon = "HD" + (Date.now() % 100000);
                const response = await axios.get(`http://localhost:8080/payment/vn-pay?maHoaDon=${maHoaDon}&amount=${tongTienThanhToan}`);
                const paymentWindow = window.open(response.data, "_blank"); // Mở VNPay ở tab mới

                // 👀 Kiểm tra nếu tab VNPay bị đóng
                const checkClosed = setInterval(async () => {
                    if (paymentWindow?.closed) {
                        clearInterval(checkClosed);
                        checkPaymentStatus(maHoaDon); // Kiểm tra trạng thái thanh toán
                    }
                }, 1000);
            }
        } catch (err) {
            console.error("Lỗi khi tạo thanh toán:", err);
            showErrorToast("Có lỗi không mong muốn xảy ra. Vui lòng load lại trang");
        }
    };

    const handleChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

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
                setNewCities(normalizedCities); // Cập nhật citiess thay vì setCities

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

    // Hàm thay đổi tỉnh thành cho modal
    // Hàm thay đổi tỉnh thành cho modal
    const handleCityChangeModal = (event) => {
        const cityName = event.target.value;
        setNewCity(cityName);
        setNewDistrict(""); // Reset quận/huyện khi thay đổi tỉnh thành
        setNewWard(""); // Reset xã/phường khi thay đổi quận/huyện

        const city = cities.find((c) => c.Name === cityName);
        const fetchDistricts = async () => {
            const districtResponse = await axios.get(
                `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
                {
                    headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
                    params: {
                        province_id: city.ProvinceID,
                    },
                }
            );
            setNewDistricts(districtResponse.data.data);
        };
        fetchDistricts();
        setNewWards([]); // Reset xã/phường
    };

    // Hàm thay đổi quận/huyện cho modal
    const handleDistrictChangeModal = (event) => {
        const districtName = event.target.value;
        setNewDistrict(districtName);
        setNewWard("");

        const id = newDistricts.find(
            (d) => d.DistrictName === districtName
        ).DistrictID;
        const fetchWards = async () => {
            const wardsResponse = await axios.get(
                `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=` +
                id,
                {
                    headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
                }
            );
            setNewWards(wardsResponse.data.data);
        };
        fetchWards();
    };

    // Hàm thay đổi xã/phường cho modal
    const handleWardChangeModal = (event) => {
        setNewWard(event.target.value);
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
            const validVouchers = sortedVouchers.filter(voucher => tongTien >= voucher.soTienToiThieu);

            // Tìm voucher tốt nhất
            let bestVoucher = null;
            let bestDiscount = 0;

            validVouchers.forEach(voucher => {
                let discountAmount = 0;
                if (voucher.loaiPhieuGiamGia === "Cố định") {
                    discountAmount = voucher.giaTriGiam;
                } else if (voucher.loaiPhieuGiamGia === "Phần trăm") {
                    discountAmount = (tongTien || 0) * (voucher.giaTriGiam / 100);
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
                setBestVoucher(bestVoucher); // Lưu bestVoucher vào state
            } else {
                setBestVoucher(null); // Đề phòng trường hợp không có phiếu nào phù hợp
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
            discountAmount = (tongTien || 0) * (selectedVoucher.giaTriGiam / 100);
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
        return tongTien >= voucher.soTienToiThieu;
    };

    // Hàm để tính toán số tiền thiếu để áp dụng voucher
    const calculateAmountToSpend = (voucher) => {
        if (tongTien < voucher.soTienToiThieu) {
            return voucher.soTienToiThieu - tongTien;
        }
        return 0;
    };

    // Hàm fetchVouchers đã được cập nhật trong trước đó, bạn không cần thay đổi hàm này

    useEffect(() => {
        if (tongTien) {
            fetchVouchers(); // Gọi lại fetchVouchers mỗi khi tổng tiền thay đổi
        }
    }, [tongTien]); // Lắng nghe sự thay đổi của tổng tiền (tongTienSanPham)

    // Hàm để hiển thị thông báo thiếu tiền
    const renderAdditionalAmountMessage = (voucher) => {
        const amountToSpend = calculateAmountToSpend(voucher);
        const isBest = bestVoucher?.id === voucher.id;

        return (
            <>
                {amountToSpend > 0 && (
                    <Typography sx={{ color: "red", marginTop: 1, fontSize: 12 }}>
                        Bạn cần chi tiêu thêm {amountToSpend.toLocaleString()} VNĐ để áp dụng
                        phiếu giảm giá này.
                    </Typography>
                )}
                {isBest && (
                    <Typography
                        sx={{
                            color: "green",
                            marginTop: 1,
                            fontSize: 12,
                            fontWeight: "bold",
                        }}
                    >
                        Đây là phiếu giảm giá tốt nhất!
                    </Typography>
                )}
            </>
        );
    };

    const checkVoucherAvailability = async (voucherCode) => {
        try {
            const response = await axios.get(`http://localhost:8080/dragonbee/kiem-tra-voucher/${voucherCode}`);
            console.log(response.data.soLuong);
            return response.data.soLuong > 0; // Kiểm tra số lượng voucher còn lại
        } catch (error) {
            console.error("Error checking voucher availability:", error);
            return false;
        }
    };

    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (selectedVoucherCode) {
                const isAvailable = await checkVoucherAvailability(selectedVoucherCode);
                if (!isAvailable) {
                    alert("Phiếu giảm giá đã hết, vui lòng chọn phiếu khác.");
                    setSelectedVoucherCode(''); // Xóa voucher đã chọn
                    setDiscountAmount(0); // Đặt giảm giá về 0
                }
            }
        }, 1000); // Kiểm tra mỗi giây

        // Cleanup interval khi component unmount hoặc khi mã voucher thay đổi
        return () => clearInterval(intervalId);
    }, [selectedVoucherCode]); // Lắng nghe sự thay đổi của mã voucher đã chọn  

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [addresses, setAddresses] = useState([]); // Để lưu danh sách địa chỉ
    const [defaultAddress, setDefaultAddress] = useState(null); // Địa chỉ mặc định

    useEffect(() => {
        const user = localStorage.getItem("userKH");
        if (user) {
            setIsLoggedIn(true);
            const customerId = JSON.parse(user).khachHang.id;

            fetch(`http://localhost:8080/dragonbee/danh-sach-dia-chi?customerId=${customerId}`)
                .then((res) => res.json())
                .then(async (data) => {
                    const sortedAddresses = data.sort((a, b) => {
                        if (a.macDinh && !b.macDinh) return -1;
                        if (!a.macDinh && b.macDinh) return 1;
                        return 0;
                    });

                    setAddresses(sortedAddresses);

                    const defaultAddr = sortedAddresses.find((addr) => addr.macDinh);
                    if (defaultAddr) {
                        setDefaultAddress(defaultAddr);
                        setCity(defaultAddr.thanhPho);
                        setDistrict(defaultAddr.huyen);
                        setWard(defaultAddr.xa);
                        setSpecificAddress(`${defaultAddr.soNha}, ${defaultAddr.duong}`);

                        // Lấy ID tỉnh/thành từ cities
                        const selectedCity = cities.find(c => c.Name === defaultAddr.thanhPho);
                        if (!selectedCity) return;

                        setSelectedGHNDistrict(selectedCity.ProvinceID);

                        // Fetch quận/huyện
                        const districtResponse = await axios.get(
                            `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
                            {
                                headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
                                params: { province_id: selectedCity.ProvinceID }
                            }
                        );
                        setDistricts(districtResponse.data.data);

                        const selectedDistrict = districtResponse.data.data.find(d => d.DistrictName === defaultAddr.huyen);
                        if (!selectedDistrict) return;

                        setSelectedGHNDistrict(selectedDistrict.DistrictID);

                        // Fetch xã/phường
                        const wardResponse = await axios.get(
                            `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
                            {
                                headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
                                params: { district_id: selectedDistrict.DistrictID }
                            }
                        );
                        setWards(wardResponse.data.data);

                        const selectedWard = wardResponse.data.data.find(w => w.WardName === defaultAddr.xa);
                        if (selectedWard) {
                            setselectedGHNWard(selectedWard.WardCode);
                        }

                        // Gọi phí GHN (tuỳ chọn)
                        const feeResponse = await axios.get(
                            `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
                            {
                                headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
                                params: {
                                    service_type_id: 2,
                                    to_district_id: selectedDistrict.DistrictID,
                                    to_ward_code: selectedWard?.WardCode,
                                    weight: 3000,
                                    insurance_value: 0,
                                },
                            }
                        );
                        const rawFee = feeResponse.data.data.service_fee;
                        setDiscount(roundToNearestThousand(rawFee));
                    }
                })
                .catch((error) => console.error("Error fetching addresses:", error));
        } else {
            setIsLoggedIn(false);
        }
    }, [cities]);
    // Lắng nghe sự thay đổi của cities để cập nhật lại khi cần

    useEffect(() => {
        // Kiểm tra xem khách hàng có đăng nhập không
        const user = localStorage.getItem('userKH');
        if (user) {
            const customerData = JSON.parse(user);
            setTenNguoiNhan(customerData.khachHang.tenKhachHang); // Set tên người nhận
            setSdtNguoiNhan(customerData.khachHang.sdt); // Set số điện thoại
            setEmailNguoiNhan(customerData.khachHang.email); // Set email
        }
    }, []);

    const handleLoginRedirect = () => {
        // Điều hướng đến trang login
        navigate('/login');
    };

    const [openDC, setOpenDC] = useState(false);
    const handleOpenDC = () => setOpenDC(true);
    const handleCloseDC = () => setOpenDC(false);
    const [openChonDC, setOpenChonDC] = useState(false);

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

    // Thêm mới địa chỉ cho khách hàng được chọn
    const handleSaveAddress = () => {
        const detailedAddress = document
            .getElementById("detailed-address")
            .value.trim();
        const description = document.getElementById("description").value.trim();
        const [soNha, duong] = detailedAddress.split(",");

        // Lấy customerId từ localStorage
        const user = localStorage.getItem('userKH');
        const selectedCustomerId = user ? JSON.parse(user).khachHang.id : null; // Lấy ID khách hàng từ localStorage

        const newAddress = {
            khachHang: { id: selectedCustomerId },
            soNha: soNha?.trim() || "",
            duong: duong?.trim() || "",
            xa: newWard,
            huyen: newDistrict,
            thanhPho: newCity,
            moTa: description || "",
            trangThai: "Hoạt động",
            macDinh: false,
        };

        // Gọi API để thêm địa chỉ mới
        axios
            .post("http://localhost:8080/dragonbee/them-dia-chi", newAddress)
            .then((response) => {
                // Sau khi thêm địa chỉ, gọi lại API để lấy danh sách địa chỉ mới nhất từ server
                axios
                    .get(
                        `http://localhost:8080/dragonbee/danh-sach-dia-chi?customerId=${selectedCustomerId}`
                    )
                    .then((response) => {
                        // Cập nhật lại danh sách địa chỉ từ response
                        setAddresses(response.data);

                        // Lấy địa chỉ mới nhất (ở cuối danh sách) để tự động chọn
                        const lastAddress = response.data[response.data.length - 1];
                        handleSelectAddress(lastAddress); // Chọn địa chỉ cuối cùng trong danh sách

                        // Đóng modal thêm địa chỉ sau khi lưu thành công
                        setOpenChonDC(false); // Đóng modal thêm địa chỉ

                        showSuccessToast("Thêm địa chỉ thành công!");
                        setNewCity(""); // Reset thành phố
                        setNewDistrict(""); // Reset quận/huyện
                        setNewWard(""); // Reset xã/phường
                    })
                    .catch((error) => {
                        console.error("Lỗi khi lấy danh sách địa chỉ:", error);
                        showErrorToast("Có lỗi khi lấy danh sách địa chỉ.");
                    });
            })
            .catch((error) => {
                console.error("Có lỗi khi thêm địa chỉ:", error);
                showErrorToast("Có lỗi khi thêm địa chỉ.");
            });
    };

    const handleSelectAddress = async (address) => {
        // Lấy thông tin người dùng từ localStorage
        const user = localStorage.getItem('userKH');
        const selectedCustomerId = user ? JSON.parse(user).khachHang.id : null;

        if (!selectedCustomerId) return; // Nếu không tìm thấy khách hàng thì thoát

        setTenNguoiNhan(address.khachHang.tenKhachHang);  // Cập nhật tên người nhận
        setSdtNguoiNhan(address.khachHang.sdt);  // Cập nhật số điện thoại người nhận
        setCity(address.thanhPho);  // Cập nhật thành phố
        setDistrict(address.huyen);  // Cập nhật huyện
        setWard(address.xa);  // Cập nhật xã/phường
        setSpecificAddress(`${address.soNha}, ${address.duong}`);  // Cập nhật địa chỉ cụ thể

        // Cập nhật lại danh sách quận/huyện và xã/phường dựa trên thành phố và huyện
        const city = cities.find((city) => city.Name === address.thanhPho);
        if (city) {
            setCity(address.thanhPho);
            const fetchDistricts = async () => {
                const districtResponse = await axios.get(
                    `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
                    {
                        headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
                        params: {
                            province_id: city.ProvinceID,
                        },
                    }
                );
                const districts = districtResponse.data.data;
                setDistricts(districts);
                setDistrict(address.huyen);
                const selectedDistrict = districts.find(
                    (d) => d.DistrictName === address.huyen
                );
                if (selectedDistrict) {
                    const fetchWards = async () => {
                        const wardsResponse = await axios.get(
                            `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=` +
                            selectedDistrict.DistrictID,
                            {
                                headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
                            }
                        );
                        const wards = wardsResponse.data.data;
                        setWards(wards);
                        setWard(address.xa);
                        const selectedWard = wards.find((d) => d.WardName === address.xa);
                        const fetchGHNServiceFee = async () => {
                            const serviceFeeResponse = await axios.get(
                                `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
                                {
                                    headers: { token: "2ae73454-f01a-11ef-b6c2-d21b7695c8d0" },
                                    params: {
                                        service_type_id: 2,
                                        to_district_id: selectedDistrict.DistrictID,
                                        to_ward_code: selectedWard.WardCode,
                                        weight: 3000,
                                        insurance_value: 0,
                                    },
                                }
                            );
                            const rawFee = serviceFeeResponse.data.data.service_fee;
                            setDiscount(roundToNearestThousand(rawFee));
                        };
                        await fetchGHNServiceFee();
                    };
                    await fetchWards();
                }
            };
            await fetchDistricts();
        } else {
            setDistricts([]); // Nếu không tìm thấy thành phố, reset danh sách quận/huyện
            setWards([]); // Reset xã/phường
        }

        setOpenDC(false); // Đóng modal sau khi chọn
    };

    // Hàm để xử lý nhập liệu cho "phí ship"handleDiscountInput
    const handleDiscountInput = (e) => {
        var newValue = e.target.value.replace(/\D/g, ""); // Chỉ cho phép nhập số

        if (/^0+$/.test(newValue)) {
            newValue = "0";
        } else {
            newValue = newValue.replace(/^0+/, ""); // Xóa 0 thừa đầu
        }

        setDiscount(newValue);
    };

    return (
        <Container sx={{ marginBottom: 0 }}>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <Grid container sx={{ flex: 1 }}>
                    {/* Left side (60%) - Customer information */}
                    <Grid item xs={7} sx={{ padding: 2, paddingRight: '60px' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
                            THÔNG TIN
                        </Typography>

                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" href="http://localhost:3000/home" sx={{ fontSize: '14px', textDecoration: 'none' }}>
                                Trang chủ
                            </Link>
                            <Link color="inherit" href="http://localhost:3000/gioHang" sx={{ fontSize: '14px', textDecoration: 'none' }}>
                                Giỏ hàng
                            </Link>
                            <Typography color="text.primary" sx={{ fontSize: '14px' }}>
                                Thanh toán
                            </Typography>
                        </Breadcrumbs>

                        <Box>
                            {isLoggedIn ? (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                            ) : (
                                <Box
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        marginTop: '24px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            Bạn đã có tài khoản?
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginTop: '8px' }}>
                                            Đăng nhập để có trải nghiệm thanh toán nhanh nhất
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        sx={{ fontWeight: 'bold' }}
                                        onClick={handleLoginRedirect}  // Gọi hàm điều hướng khi click
                                    >
                                        ĐĂNG NHẬP
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Họ và tên" margin="normal" size="small" value={tenNguoiNhan}
                                    onChange={(e) => setTenNguoiNhan(e.target.value)} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Số điện thoại" margin="normal" size="small" value={sdtNguoiNhan}
                                    onChange={(e) => setSdtNguoiNhan(e.target.value)} />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email" margin="normal" size="small" value={emailNguoiNhan}
                                    onChange={(e) => setEmailNguoiNhan(e.target.value)} />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} marginTop={0}>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Tỉnh/Thành phố</InputLabel>
                                    <Select value={city} onChange={handleCityChange} label="Tỉnh/Thành phố">
                                        {cities.length > 0 ? (
                                            cities.map((city) => (
                                                <MenuItem key={city.ProvinceID} value={city.Name}>
                                                    {city.Name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>Không có dữ liệu</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small" sx={{ height: '100%' }}>
                                    <InputLabel>Quận/Huyện</InputLabel>
                                    <Select
                                        value={district}
                                        onChange={handleDistrictChange}
                                        label="Quận/Huyện"
                                    >
                                        {districts.length > 0 ? (
                                            districts.map((district) => (
                                                <MenuItem key={district.DistrictID} value={district.DistrictName}>
                                                    {district.DistrictName}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>Không có dữ liệu</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} marginTop={-1}>
                            <Grid item xs={6} marginTop={2}>
                                <FormControl fullWidth size="small" sx={{ height: '100%' }}>
                                    <InputLabel>Xã/Phường</InputLabel>
                                    <Select
                                        value={ward}
                                        onChange={handleWardChange}
                                        label="Xã/Phường"
                                    >
                                        {wards.length > 0 ? (
                                            wards.map((ward) => (
                                                <MenuItem key={ward.WardCode} value={ward.WardName}>
                                                    {ward.WardName}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>Không có dữ liệu</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Địa chỉ cụ thể" margin="normal" size="small" value={specificAddress}
                                    onChange={(e) => setSpecificAddress(e.target.value)} />
                            </Grid>
                        </Grid>


                        <TextField fullWidth label="Ghi chú" margin="normal" size='small' value={ghiChu}
                            onChange={(e) => setGhiChu(e.target.value)} />

                        <div>
                            <Typography variant="subtitle1" gutterBottom marginTop={1} fontWeight={'bold'}>
                                Phương thức thanh toán
                            </Typography>
                            <Box
                                display="flex"
                                gap={2} // khoảng cách giữa hai ô (20px, vì mặc định gap là tính theo đơn vị px)
                            >
                                <Box
                                    border={1} // tạo viền
                                    padding={1} // khoảng cách giữa các phần tử và viền
                                    width="270px" // chiều rộng cố định cho mỗi ô (bạn có thể điều chỉnh)
                                    height="50px" // chiều cao cố định cho mỗi ô
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <FormControlLabel
                                        value="COD"
                                        control={<Radio
                                            name="paymentMethod"
                                            checked={selectedPaymentMethod === "COD"}
                                            onChange={handleChange} // Gắn sự kiện onChange
                                        />}
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <img src={CODImage} alt="COD" style={{ width: 30, height: 30, marginRight: 8 }} />
                                                <span style={{ fontSize: 15 }}>Thanh toán khi nhận hàng</span>
                                            </Box>
                                        }
                                    />
                                </Box>
                                <Box
                                    border={1} // tạo viền
                                    padding={1} // khoảng cách giữa các phần tử và viền
                                    width="270px" // chiều rộng cố định cho mỗi ô (bạn có thể điều chỉnh)
                                    height="50px" // chiều cao cố định cho mỗi ô
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <FormControlLabel
                                        value="PayNow"
                                        control={<Radio
                                            name="paymentMethod"
                                            checked={selectedPaymentMethod === "PayNow"}
                                            onChange={handleChange} // Gắn sự kiện onChange
                                        />}
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <img src={PayNowImage} alt="Pay Now" style={{ width: 90, height: 30, marginRight: 8 }} />
                                                <span style={{ fontSize: 15 }}>Thanh toán ngay</span>
                                            </Box>
                                        }
                                    />
                                </Box>
                            </Box>
                        </div>
                        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={khiAnNutXacNhanDatHang} disabled={products?.length === 0}>HOÀN THÀNH ĐẶT HÀNG</Button>
                    </Grid>

                    {/* Right side (40%) - Order summary */}
                    <Grid item xs={5} sx={{ backgroundColor: '#f5f5f5', padding: 2 }}>
                        {/* <Typography variant="h6" gutterBottom>Thông tin đơn hàng</Typography> */}

                        {products.map((product, index) => (
                            <Box key={index} sx={{ marginBottom: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1, position: 'relative' }}>
                                    {/* Cột 1: Hình ảnh sản phẩm và số lượng */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, borderRadius: 2, width: '20%' }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <img
                                                src={product.anhSPCT}
                                                alt={product.ten}
                                                width="70"
                                                height="70"
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <Typography
                                                sx={{
                                                    position: 'absolute',
                                                    top: -10,
                                                    right: -10,
                                                    backgroundColor: '#1976D2',
                                                    borderRadius: '50%',
                                                    padding: '5px 10px',
                                                    color: 'white',
                                                    fontSize: 10
                                                }}
                                            >
                                                {product.quantity}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Cột 2: Tên sản phẩm và Size */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: 2, borderRadius: 2, width: '65%' }}>
                                        <Typography sx={{
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            marginBottom: 0.5,
                                            wordBreak: 'break-word',
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {product.tenSPCT}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{
                                                backgroundColor: '#1976D2',
                                                color: '#ffffff',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontWeight: 'bold',
                                                fontSize: '12px',
                                                marginTop: -0.5
                                            }}
                                        >
                                            Size: {product.tenSize}
                                        </Typography>
                                    </Box>

                                    {/* Cột 3: Giá */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 2, borderRadius: 2, width: '30%' }}>
                                        <Typography sx={{
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            textAlign: 'right',
                                            whiteSpace: 'nowrap',
                                            marginRight: -2
                                        }}>
                                            <span style={{ color: 'red', marginLeft: 5 }}>
                                                {product.gia?.toLocaleString()} VNĐ
                                            </span>
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Dòng kẻ mờ */}
                                <Box sx={{
                                    borderBottom: '1px solid #e0e0e0',
                                    marginTop: 2
                                }} />
                            </Box>
                        ))}

                        {/* Tổng tiền */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: 2,
                            paddingRight: 0
                        }}>
                            <Typography sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'red'
                            }}>
                                Tổng tiền: {tongTien?.toLocaleString()} VNĐ
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 2,
                                alignItems: "flex-start", // Chuyển từ center sang flex-start để các box con có thể giãn theo chiều dọc
                            }}
                        >
                            <Typography variant="body1" sx={{ marginTop: "6px" }}>
                                Phiếu giảm giá:
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Input
                                        value={selectedVoucherCode}
                                        sx={{ color: "#5e5e5ede", width: 140 }}
                                        endAdornment={
                                            <InputAdornment position="end" sx={{ position: "relative" }}>
                                                {selectedVoucherCode && (
                                                    <CloseIcon
                                                        sx={{
                                                            color: "red",
                                                            fontSize: 14,
                                                            cursor: "pointer",
                                                            position: "absolute",
                                                            left: -13,
                                                            top: "-3px",
                                                            transform: "translateY(-50%)",
                                                            backgroundColor: "white",
                                                            borderRadius: "50%",
                                                            boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                                                        }}
                                                        onClick={() => {
                                                            setSelectedVoucherCode("");
                                                            setDiscountAmount(0);
                                                        }}
                                                    />
                                                )}
                                                <EditIcon
                                                    sx={{
                                                        color: "gray",
                                                        fontSize: 18,
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={handleOpenVoucherModal}
                                                />
                                            </InputAdornment>
                                        }
                                        inputProps={{
                                            style: {
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            },
                                        }}
                                    />
                                </Box>

                                {selectedVoucherCode === bestVoucher?.ma && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "green",
                                            marginTop: "4px",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        Phiếu giảm giá tốt nhất!
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        {showLeftPanel && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: 1,
                                }}
                            >
                                <Typography variant="body1">
                                    Phí vận chuyển:
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    value={
                                        discount
                                            ? parseInt(discount, 10).toLocaleString()
                                            : discount
                                    }
                                    onChange={handleDiscountInput}
                                    onBlur={() => {
                                        if (discount === "") {
                                            setDiscount(0);
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography sx={{ color: "black" }}>
                                                    VNĐ
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        width: "140px", // Giới hạn chiều rộng
                                        "& .MuiInputBase-input": {
                                            fontSize: 16,
                                            fontWeight: 400,
                                            textAlign: "right",
                                        },
                                    }}
                                />
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1.5, marginTop: 1 }}>
                            <Typography>Giảm giá</Typography>
                            <Typography>{discountAmount.toLocaleString()} VNĐ</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <Typography>Tổng số tiền cần thanh toán</Typography>
                            <Typography color="error">{tongTienThanhToan.toLocaleString()} VNĐ</Typography>
                        </Box>

                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                            Ngày nhận dự kiến: {getEstimatedDeliveryDate()}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
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
            {/* Modal confirm xác nhận đặt hàng */}
            <Dialog open={openConfirmDatHang} onClose={() => setOpenConfirmDatHang(false)}>
                <DialogTitle>Xác nhận đơn hàng</DialogTitle>
                <DialogContent>
                    <DialogContentText>Bạn có chắc chắn muốn xác nhận đặt hàng không?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDatHang(false)} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={xacNhanDatHang} color="primary" variant="contained">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

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
                                        <TableCell>{tenNguoiNhan}</TableCell>
                                        <TableCell>{sdtNguoiNhan}</TableCell>
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
                        <InputLabel id="city-label" size="small">
                            Tỉnh/Thành phố
                        </InputLabel>
                        <Select
                            labelId="city-label"
                            value={newCity} // Sử dụng state cho modal là 'city'
                            label="Tỉnh/Thành phố"
                            onChange={handleCityChangeModal}
                            size="small" // Áp dụng size nhỏ cho Select
                        >
                            {newCities.map(
                                (
                                    newCity // Sử dụng citiess (dữ liệu cho modal)
                                ) => (
                                    <MenuItem key={newCity.ProvinceID} value={newCity.Name}>
                                        {newCity.Name}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>

                    {/* Quận/Huyện */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="district-label" size="small">
                            Quận/Huyện
                        </InputLabel>
                        <Select
                            labelId="district-label"
                            value={newDistrict} // Sử dụng state cho modal là 'district'
                            label="Quận/Huyện"
                            onChange={handleDistrictChangeModal}
                            disabled={!newCities} // Disable nếu chưa chọn thành phố
                            size="small" // Áp dụng size nhỏ cho Select
                        >
                            {newDistricts.map(
                                (
                                    newDistrict // Sử dụng districtss (dữ liệu cho modal)
                                ) => (
                                    <MenuItem
                                        key={newDistrict.DistrictID}
                                        value={newDistrict.DistrictName}
                                    >
                                        {newDistrict.DistrictName}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>

                    {/* Xã/Phường */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="ward-label" size="small">
                            Xã/Phường
                        </InputLabel>
                        <Select
                            labelId="ward-label"
                            value={newWard} // Sử dụng state cho modal là 'ward'
                            label="Xã/Phường"
                            onChange={handleWardChangeModal}
                            disabled={!newDistrict} // Disable nếu chưa chọn quận/huyện
                            size="small" // Áp dụng size nhỏ cho Select
                        >
                            {newWards.map(
                                (
                                    newWard // Sử dụng wardss (dữ liệu cho modal)
                                ) => (
                                    <MenuItem key={newWard.WardID} value={newWard.WardName}>
                                        {newWard.WardName}
                                    </MenuItem>
                                )
                            )}
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
                    <Button onClick={handleSaveAddress} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Container>
    );

};

export default ThanhToan;
