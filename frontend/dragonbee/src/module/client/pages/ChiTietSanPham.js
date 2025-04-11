import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import {
    Container, Grid, Typography, Button, Box, IconButton, Card, CardContent, CardMedia
    , Modal, Breadcrumbs, Link, Tabs
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from "@mui/icons-material/Close";
import ReactImageMagnify from "react-image-magnify";
import { useParams } from "react-router-dom"; // Import đúng
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";


const ChiTietSanPham = () => {
    const navigate = useNavigate(); // Khai báo navigate
    const { id } = useParams(); // Lấy id từ URL
    const thumbnailRefs = useRef([]);
    const [product, setProduct] = useState({});
    const [selectedColor, setSelectedColor] = useState(0);
    const [openSizeGuide, setOpenSizeGuide] = useState(false);
    const [selectedSize, setSelectedSize] = useState(-1);
    const [selectedIDSize, setSelectedIDSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [productData, setProductData] = useState([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    //Khách hàng đăng nhập
    const userKH = JSON.parse(localStorage.getItem("userKH"));

    // Mở bảng chọn size
    const handleOpenSizeGuide = () => setOpenSizeGuide(true);
    const handleCloseSizeGuide = () => setOpenSizeGuide(false);

    var selectedColorReuse = product?.listHinhAnhAndMauSacAndSize?.[selectedColor];
    var selectedSizeReuse = selectedColorReuse?.listSize?.[selectedSize];
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

    const getSanPhamChiTiet = async () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        try {
            const response = await axios.post(`http://localhost:8080/spctClient/getListSanPhamChiTietTheoMau/${id}`,
                {
                    idKhachHang: userKH?.khachHang?.id || null,
                    cart: cart
                }, // Gửi mảng JSON
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });//Gọi api bằng axiosGet
            setProduct(response.data);
            if (selectedIDSize !== null) {
                //Check nếu không còn đủ số lượng cung cấp
                if (response.data?.listHinhAnhAndMauSacAndSize?.[selectedColor]?.listSize?.[selectedSize]?.soLuong <= 0) {
                    setSelectedIDSize(null);
                }
            }
        } catch (error) {
            showErrorToast("Lỗi khi lấy dữ liệu sản phẩm chi tiết")
        }
    };

    const getListSanPhamTuongTu = async () => {
        try {
            if (product?.danhMuc?.tenDanhMuc) {//Nếu chưa load xong product thì trở lại
                const response = await axios.get(`http://localhost:8080/spctClient/getListSanPhamTuongTu/${id}`,
                    {
                        params: {
                            tenDanhMuc: product?.danhMuc?.tenDanhMuc
                        }
                    }
                );//Gọi api bằng axiosGet
                setProductData(response.data);
                setIsFirstLoad(false); // Đã gọi set xong thì set false
            }
        } catch (error) {
            showErrorToast("Lỗi khi lấy dữ liệu sản phẩm chi tiết")
        }
    };
    useEffect(() => {
        if (product && isFirstLoad) {
            getListSanPhamTuongTu();
        }
    }, [product]);

    //Hàm khởi tạo
    useEffect(() => {
        getSanPhamChiTiet();
    }, []);

    //Khi selectedColor thay đổi
    useEffect(() => {
        // const selectedIDSizeCopy = selectedIDSize;
        // setSelectedIDSize(null);
        // let abc = null;
        // if (selectedIDSizeCopy !== null) {//Kiểm tra nếu có size chọn trước đấy
        //     for (const [index, item] of selectedSizeReuse?.listSize?.entries() || []) {
        //         if (selectedIDSizeCopy === item?.id) {
        //             if (item?.soLuong > 0) {
        //                 setSelectedSize(index);
        //                 setSelectedIDSize(item.id);
        //                 abc = 1;
        //                 break;
        //             }
        //         }
        //     }
        // }
        // if (abc === null) { setSelectedSize(-1); }

        setSelectedSize(-1);
    }, [selectedColor]);

    const tangSoLuong = () => {
        setQuantity(quantity + 1);
        //Kiểm tra lại số lượng đang chậm một nhịp
        if (quantity + 1 >= selectedSizeReuse.soLuong) {
            showSuccessToast("Số lượng sản phẩm này đã tối đa")
        };
    }


    const addVaoGioHang = async () => {
        if (selectedSize === -1) { showErrorToast("Bạn chưa chọn size sản phẩm"); return; }
        try {
            if (userKH?.khachHang?.id) {
                console.log("Chạy api");
                const response = await axios.post(`http://localhost:8080/gioHang/addVaoGioHangCoDangNhap`, null, {
                    params: {
                        idSanPhamChiTiet: selectedSizeReuse.idSPCT,
                        soLuong: quantity,
                        gia: product.gia,
                        idKhachHang: userKH?.khachHang?.id
                    }
                });
                if (response.data) {
                    showSuccessToast("Đã thêm vào giỏ hàng");
                } else {
                    showErrorToast("Thêm vào giỏ hàng thất bại. Đã có lỗi xảy ra vui lòng thử lại2");
                }
            } else {
                // Lấy giỏ hàng từ Local Storage (Nếu chưa có, thì set là mảng rỗng [])
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                // Kiểm tra xem sản phẩm đã có trong giỏ chưa
                const index = cart.findIndex(item => item.idSPCT === selectedSizeReuse.idSPCT);
                if (index !== -1) {
                    // Nếu có, tăng số lượng
                    cart[index].quantity += quantity;
                } else {
                    // Nếu chưa có, thêm sản phẩm vào giỏ hàng
                    cart.push({
                        id: product.id,
                        idSPCT: selectedSizeReuse?.idSPCT,
                        anhSPCT: selectedColorReuse?.listAnh === null ? null : selectedColorReuse?.listAnh[0],
                        tenSPCT: selectedSizeReuse.tenSPCT,
                        tenMauSac: selectedColorReuse.mauSac.tenMauSac,
                        tenSize: selectedSizeReuse.tenSize,
                        gia: product.gia,
                        quantity: quantity
                    });
                }
                // Lưu lại vào Local Storage
                localStorage.setItem("cart", JSON.stringify(cart));
                showSuccessToast("Đã thêm vào giỏ hàng");
            }
            //Cập nhật lại sản phẩm gồm số lượng
            getSanPhamChiTiet();
            setQuantity(1);
        } catch (error) {
            showErrorToast("Thêm vào giỏ hàng thất bại. Đã có lỗi xảy ra vui lòng thử lại");
        }

    };

    const handleNextImage = () => {
        setSelectedImageIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % selectedColorReuse?.listAnh?.length;
            scrollToThumbnail(newIndex);
            return newIndex;
        });
    };

    const handlePrevImage = () => {
        setSelectedImageIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + selectedColorReuse?.listAnh?.length) % selectedColorReuse?.listAnh?.length;
            scrollToThumbnail(newIndex);
            return newIndex;
        });
    };

    // Hàm cuộn thumbnail vào khung nhìn
    const scrollToThumbnail = (index) => {
        if (thumbnailRefs.current[index]) {
            thumbnailRefs.current[index].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    };

    // Sản phẩm cùng danh mục 

    //Quần âu nam SPTuongTu
    const [startSPTuongTu, setStartSPTuongTu] = useState(0);
    const [directionSPTuongTu, setDirectionSPTuongTu] = useState(0);

    const handleNextSPTuongTu = () => {
        if (!productData?.length) return; // Kiểm tra trước khi tính toán
        setDirectionSPTuongTu(1);
        setStartSPTuongTu((prev) => (prev + 1) % productData?.length);
    };

    const handlePrevSPTuongTu = () => {
        if (!productData?.length) return; // Kiểm tra trước khi tính toán

        setDirectionSPTuongTu(-1);
        setStartSPTuongTu((prev) => (prev - 1 + productData?.length) % productData?.length);
    };

    const variants = {
        initial: (directionSPNam) => ({
            opacity: 0,
            x: directionSPNam > 0 ? 100 : -100, // Trượt trái hoặc phải
        }),
        animate: {
            opacity: 1,
            x: 0,
        },
        exit: (directionSPNam) => ({
            opacity: 0,
            x: directionSPNam > 0 ? -100 : 100, // Thoát hướng ngược lại
        }),
    };
    useEffect(() => {
        // Gọi API khi id thay đổi
        setIsFirstLoad(true);
        getSanPhamChiTiet(id);
    }, [id]);
    return (
        <Container maxWidth="lg" sx={{ mt: 4, marginBottom: -8 }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="http://localhost:3000/home" sx={{ fontSize: '14px', textDecoration: 'none' }}>
                    Trang chủ
                </Link>
                <Link color="inherit" href="http://localhost:3000/sanPham" sx={{ fontSize: '14px', textDecoration: 'none' }}>
                    Sản phẩm
                </Link>
                <Typography color="text.primary" sx={{ fontSize: '14px' }}>
                    {product?.ten}
                </Typography>
            </Breadcrumbs>
            {product ? (
                <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)", pb: 3, marginTop: 3 }}>
                    <Grid container spacing={4}>
                        {/* Hình ảnh sản phẩm */}
                        <Grid item xs={12} md={6} display="flex" alignItems="center">
                            <Box sx={{ display: "flex", marginTop: -7 }}>
                                {/* List ảnh nhỏ */}
                                <Box sx={{ display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: 400, mr: 2 }}>
                                    {selectedColorReuse?.listAnh?.map((image, index) => (
                                        <img
                                            key={index}
                                            ref={(el) => (thumbnailRefs.current[index] = el)}
                                            src={image}
                                            alt={`Thumbnail ${index}`}
                                            style={{
                                                width: 60,
                                                height: 80,
                                                objectFit: "cover",
                                                cursor: "pointer",
                                                border: selectedImageIndex === index ? "2px solid #1976D2" : "none",
                                                marginBottom: 8,
                                            }}
                                            onClick={() => setSelectedImageIndex(index)}
                                        />
                                    ))}
                                </Box>
                                {/* Ảnh lớn hiển thị */}
                                <Box sx={{ flex: 1, position: "relative", width: 450, height: 450, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <img
                                        src={selectedColorReuse?.listAnh?.[selectedImageIndex]}
                                        alt="Selected product"
                                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                                    />
                                    <IconButton sx={{ position: "absolute", top: "45%", left: 10 }} onClick={handlePrevImage}>
                                        <ArrowBackIosIcon />
                                    </IconButton>
                                    <IconButton sx={{ position: "absolute", top: "45%", right: 10 }} onClick={handleNextImage}>
                                        <ArrowForwardIosIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Thông tin sản phẩm */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" fontWeight="bold">{product.ten}</Typography>
                            <Typography variant="h6" color="primary" mt={1}>{product?.gia?.toLocaleString()} VND</Typography>

                            {/* Chọn màu */}
                            <Box mt={2}>
                                <Typography variant="subtitle1">Màu sắc</Typography>
                                {product?.listHinhAnhAndMauSacAndSize?.map((item, index) => (
                                    <IconButton
                                        key={index}
                                        sx={{
                                            width: 45, // Kích thước tổng thể
                                            height: 30,
                                            borderRadius: "16px", // Bo góc bầu dục
                                            position: "relative",
                                            backgroundColor: "transparent", // Tránh hover làm mất màu
                                            marginRight: "7px",
                                            // Viền xanh khi được chọn
                                            border: selectedColorReuse?.mauSac.id === item.mauSac.id ? "2px solid blue" : "none",
                                            padding: 0,

                                            "&::after": {
                                                content: '""',
                                                display: "block",
                                                width: selectedColorReuse?.mauSac?.id === item.mauSac.id ? "80%" : "85%", // Khi chọn, màu nhỏ đi 20%
                                                height: selectedColorReuse?.mauSac?.id === item.mauSac.id ? "80%" : "85%",
                                                backgroundColor: item.mauSac.maMau, // Giữ màu nền
                                                borderRadius: "12px", // Bo góc nhỏ hơn một chút
                                                transition: "all 0.2s ease-in-out",
                                            },

                                            // "&:hover::after": {
                                            //     width: "90%",
                                            //     height: "90%", // Hover làm nhỏ nhẹ hơn
                                            // },
                                        }}
                                        onClick={() => setSelectedColor(index)}
                                    />
                                ))}
                            </Box>

                            {/* Chọn size */}
                            <Box mt={2}>
                                <Typography variant="subtitle1" fontWeight="bold">Kích thước</Typography>
                                <Box display="flex" gap={1} mt={1}>
                                    {selectedColorReuse?.listSize?.map((size, index) => (
                                        <Button
                                            variant={selectedSizeReuse?.id === size?.id ? "contained" : "outlined"}
                                            onClick={() => { setSelectedSize(index); setSelectedIDSize(size.id) }}
                                            sx={{
                                                minWidth: 50,
                                                borderRadius: 2,
                                                bgcolor: selectedSizeReuse?.id === size?.id ? "black" : "white",
                                                color: selectedSizeReuse?.id === size?.id ? "white" : "black",
                                                borderColor: "black",
                                                "&:hover": {
                                                    bgcolor: selectedSizeReuse?.id === size?.id ? "black" : "#f0f0f0",
                                                },
                                            }}
                                            disabled={size.soLuong <= 0} // Thêm điều kiện này
                                        >
                                            {size.tenSize}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>
                            {/* Hướng dẫn chọn size */}
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{ cursor: "pointer", marginTop: 1 }}
                                onClick={handleOpenSizeGuide}
                            >
                                + Xem hướng dẫn chọn size
                            </Typography>

                            {/* Chọn số lượng */}
                            <Box mt={2} display="flex" alignItems="center">
                                <Typography variant="subtitle1">Số lượng</Typography>
                                <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))}><RemoveIcon /></IconButton>
                                <Typography variant="body1" mx={2}>{quantity}</Typography>
                                <IconButton onClick={() => tangSoLuong()} disabled={quantity >= (selectedSizeReuse?.soLuong ?? 0)}><AddIcon /></IconButton>
                            </Box>

                            {/* Nút thao tác */}
                            <Box mt={3} display="flex" gap={2}>
                                <Button variant="contained" sx={{ backgroundColor: '#1976D2' }} startIcon={<AddShoppingCartIcon />} onClick={() => addVaoGioHang()} disabled={selectedSize === -1}>Thêm vào giỏ hàng</Button>
                                {/* <Button variant="contained" color="error" startIcon={<ShoppingCartCheckoutIcon />}>Mua ngay</Button> */}
                            </Box>


                        </Grid>
                        <Box mt={4} ml={4} variant="h6" style={{ fontSize: "15px" }}>
                            <Typography variant="h6">Chi Tiết Sản Phẩm</Typography>
                            <div style={{ position: "relative", width: "100%", maxWidth: "700px" }}>
                                {/* Hình ảnh có thể phóng to */}
                                <ReactImageMagnify
                                    {...{
                                        smallImage: {
                                            alt: "Bảng size quần",
                                            isFluidWidth: true,
                                            src: "https://down-vn.img.susercontent.com/file/vn-11134208-7ras8-m15dvykkrqezaa",
                                        },
                                        largeImage: {
                                            src: "https://down-vn.img.susercontent.com/file/vn-11134208-7ras8-m15dvykkrqezaa",
                                            width: 2000,
                                            height: 1200,
                                        },
                                        enlargedImageContainerDimensions: {
                                            width: "80%",
                                            height: "100%",
                                        },
                                        enlargedImageContainerStyle: {
                                            transform: "translateX(-10%) translateY(-10%)",
                                        },
                                        lensStyle: { backgroundColor: "rgba(0,0,0,.3)" },
                                    }}
                                />

                            </div>
                            {/* <Typography variant="body1" whiteSpace="pre-line">{product.moTa}</Typography> */}
                            <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl" >
                                <div>
                                    <strong className="text-gray-700">Tên sản phẩm: </strong>
                                    <span className="text-gray-500">{product?.ten}</span>
                                </div>
                                {/* <div style={{ marginTop: '5px' }}>
                                    <strong className="text-gray-700">Mã sản phẩm: </strong>
                                    <span className="text-gray-500">SP001</span>
                                </div> */}
                                <div style={{ marginTop: '5px' }}>

                                    <strong className="text-gray-700">Danh mục: </strong>
                                    <span className="text-gray-500">{product?.danhMuc?.tenDanhMuc}</span>
                                </div>

                                <div style={{ marginTop: '5px' }}>

                                    <strong className="text-gray-700">Kiểu dáng: </strong>
                                    <span className="text-gray-500">{product?.kieuDang?.tenKieuDang}</span>
                                </div>
                                <div style={{ marginTop: '5px' }}>
                                    <strong className="text-gray-700">Chất liệu: </strong>
                                    <span className="text-gray-500">{product?.chatLieu?.tenChatLieu}</span>
                                </div>
                                <div style={{ marginTop: '5px' }}>

                                    <strong className="text-gray-700">Thương hiệu: </strong>
                                    <span className="text-gray-500">{product?.thuongHieu?.tenThuongHieu}</span>
                                </div>
                                <div style={{ marginTop: '5px' }}>

                                    <strong className="text-gray-700">Xuất xứ: </strong>
                                    <span className="text-gray-500">{product?.xuatXu?.tenXuatXu}</span>
                                </div>

                                {/* Hướng dẫn bảo quản */}
                                <section className="mb-6" style={{ marginTop: '5px' }}>
                                    <strong className="text-gray-700">Hướng dẫn bảo quản</strong>
                                    <ul className="list-disc ml-5 space-y-1 text-gray-600">
                                        <li>Giặt dưới 30°C</li>
                                        <li>Không dùng chất tẩy mạnh</li>
                                        <li>Là ở nhiệt độ thấp</li>
                                        <li>Phơi nơi thoáng, tránh ánh nắng trực tiếp</li>
                                    </ul>
                                    {/* <p className="text-sm italic text-gray-500 mt-2">
                                        * Hình ảnh minh họa, màu thực tế có thể khác do ánh sáng và màn hình.
                                    </p> */}
                                </section>
                            </div>
                        </Box>
                    </Grid>
                </Box>
            ) : (
                <div>Sản phẩm này đã ngừng kinh doanh. Xin mời quý khách tham khảo sản phẩm khác!</div>
            )
            }
            {/* Chi tiết sản phẩm */}

            <Box sx={{ marginTop: -1 }}>
                {/* Quần âu Nam */}
                {productData?.length > 0 &&
                    <Container sx={{ py: 4 }}>
                        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                            Sản phẩm tương tự
                        </Typography>
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                            <AnimatePresence custom={directionSPTuongTu} mode="wait">
                                <motion.div
                                    key={startSPTuongTu}
                                    variants={{
                                        initial: (directionSPTuongTu) => variants.initial(directionSPTuongTu),
                                        animate: variants.animate,
                                        exit: (directionSPTuongTu) => variants.exit(directionSPTuongTu),
                                    }}
                                    custom={directionSPTuongTu}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                >
                                    <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: '2px' }}>
                                        {productData?.length > 0 &&
                                            Array.from({ length: Math.min(5, productData.length) }).map((_, index) => {
                                                const product = productData[(startSPTuongTu + index) % productData?.length];
                                                return (
                                                    <Grid sx={{
                                                        cursor: 'pointer',
                                                        '&:focus': {
                                                            outline: '2px solid #1976d2', // tuỳ chọn: hiệu ứng viền khi focus
                                                        }
                                                    }} item key={product.id} xs={12} sm={4} md={2.4} onClick={() => navigate(`/sanPhamChiTiet/${product.id}`, { replace: true })}>
                                                        <Card sx={{ position: 'relative', boxShadow: 2, borderRadius: 2 }}>
                                                            {/* Label "NEW" */}
                                                            {product?.isNew === true && <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    backgroundColor: 'black',
                                                                    color: 'white',
                                                                    padding: '2px 10px',
                                                                    fontSize: '10px',
                                                                    fontWeight: 'bold',
                                                                    borderRadius: '8px 0 8px 0', // Bo góc như hình mẫu
                                                                    zIndex: 2,
                                                                }}
                                                            >
                                                                NEW
                                                            </Typography>
                                                            }

                                                            <CardMedia
                                                                component="img"
                                                                height="250"
                                                                image={product?.listHinhAnhAndMauSacAndSize[0]?.listAnh?.[0]}
                                                                alt={product?.ten}
                                                                sx={{
                                                                    transition: 'opacity 0.3s ease',
                                                                    '&:hover': { opacity: 0 },
                                                                    borderTopLeftRadius: 2,
                                                                    borderTopRightRadius: 2,
                                                                }}
                                                            />

                                                            {product?.listHinhAnhAndMauSacAndSize[0]?.listAnh?.[1] && (
                                                                <CardMedia
                                                                    component="img"
                                                                    height="250"
                                                                    image={product?.listHinhAnhAndMauSacAndSize[0]?.listAnh?.[1]}
                                                                    alt={product.ten}
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        width: '100%',
                                                                        opacity: 0,
                                                                        transition: 'opacity 0.3s ease',
                                                                        '&:hover': { opacity: 1 },
                                                                        borderTopLeftRadius: 2,
                                                                        borderTopRightRadius: 2,
                                                                    }}
                                                                />
                                                            )}

                                                            <CardContent CardContent
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    justifyContent: 'space-between',
                                                                    minHeight: '70px',
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: 14,
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    {product.ten}
                                                                </Typography>
                                                                <Box sx={{ mt: 1, display: 'flex', gap: 1, mb: 2 }}>
                                                                    {product?.listHinhAnhAndMauSacAndSize?.length > 0 ? (
                                                                        product.listHinhAnhAndMauSacAndSize.map(item => (
                                                                            <IconButton
                                                                                sx={{
                                                                                    width: 32, // Kích thước tổng thể
                                                                                    height: 22,
                                                                                    borderRadius: "16px", // Bo góc bầu dục
                                                                                    position: "relative",
                                                                                    backgroundColor: "transparent", // Tránh hover làm mất màu
                                                                                    marginRight: "7px",
                                                                                    // Viền xanh khi được chọn
                                                                                    border: "none",
                                                                                    padding: 0,

                                                                                    "&::after": {
                                                                                        content: '""',
                                                                                        display: "block",
                                                                                        width: "100%", // Khi chọn, màu nhỏ đi 20%
                                                                                        height: "100%",
                                                                                        backgroundColor: item.mauSac.maMau, // Giữ màu nền
                                                                                        borderRadius: "12px", // Bo góc nhỏ hơn một chút
                                                                                        transition: "all 0.2s ease-in-out",
                                                                                    },
                                                                                }}

                                                                            />
                                                                        ))
                                                                    ) : (
                                                                        <Typography variant="body2" color="text.secondary">Không có màu nào hết</Typography>
                                                                    )}
                                                                </Box>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            display: 'inline-flex',
                                                                            alignItems: 'flex-start', // Để chữ 'đ' nằm cao hơn
                                                                            gap: '2px', // Khoảng cách giữa giá và chữ 'đ'
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="text.secondary"
                                                                            fontWeight="bold"
                                                                            sx={{
                                                                                textAlign: 'center',
                                                                                fontSize: '16px',
                                                                            }}
                                                                        >
                                                                            {product.gia?.toLocaleString()}
                                                                        </Typography>

                                                                        <Typography
                                                                            variant="body2"
                                                                            color="text.secondary"
                                                                            fontWeight="bold"
                                                                            sx={{
                                                                                fontSize: '12px',
                                                                                lineHeight: '1', // Giúp chữ 'đ' không bị lệch nhiều so với giá
                                                                                transform: 'translateY(-2px)', // Nhích lên trên một chút
                                                                            }}
                                                                        >
                                                                            đ
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>

                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                );
                                            })}
                                    </Grid>
                                </motion.div>
                            </AnimatePresence>

                            {productData?.length > 5 && (
                                <>
                                    <IconButton
                                        onClick={handleNextSPTuongTu}
                                        sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 10 }}
                                    >
                                        <ChevronRight />
                                    </IconButton>

                                    <IconButton
                                        onClick={handlePrevSPTuongTu}
                                        sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 10 }}
                                    >
                                        <ChevronLeft />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    </Container >
                }
            </Box>
            {/* Modal hướng dẫn chọn size */}
            <Modal open={openSizeGuide} onClose={handleCloseSizeGuide}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 2,
                        borderRadius: 2,
                        maxWidth: "90vw",
                        maxHeight: "90vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflow: "visible",
                    }}
                >
                    <IconButton onClick={handleCloseSizeGuide} sx={{ position: "absolute", top: 8, right: 8 }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Bảng size quần
                    </Typography>

                    {/* Container bọc ảnh và logo */}
                    <div style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
                        {/* Hình ảnh có thể phóng to */}
                        <ReactImageMagnify
                            {...{
                                smallImage: {
                                    alt: "Bảng size quần",
                                    isFluidWidth: true,
                                    src: "https://down-vn.img.susercontent.com/file/vn-11134208-7ras8-m15dvykkrqezaa",
                                },
                                largeImage: {
                                    src: "https://down-vn.img.susercontent.com/file/vn-11134208-7ras8-m15dvykkrqezaa",
                                    width: 2000,
                                    height: 1200,
                                },
                                enlargedImageContainerDimensions: {
                                    width: "80%",
                                    height: "100%",
                                },
                                enlargedImageContainerStyle: {
                                    transform: "translateX(-10%) translateY(-10%)",
                                },
                                lensStyle: { backgroundColor: "rgba(0,0,0,.3)" },
                            }}
                        />

                    </div>
                </Box>
            </Modal>
            {/* </div>)} */}
            <ToastContainer />
        </Container>
    );
};

export default ChiTietSanPham;