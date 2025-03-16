import React, { useState, useRef } from "react";
import {
    Container, Grid, Typography, Button, Box, IconButton, Card, CardContent, CardMedia
    , Modal, Breadcrumbs,Link
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

const product = {
    name: "QUẦN ÂU NAM QASTK503",
    price: 489000,
    colors: ["#1D1D1D", "#D1D1D1"],
    sizes: [29, 30, 31, 32, 34],
    images: [
        "https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-8.jpg",
        "https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg",
        "https://360.com.vn/wp-content/uploads/2024/11/APHTK533-QSKTK514-1.jpg",
        "https://360.com.vn/wp-content/uploads/2024/12/AKGTK503-QGGTK502-7.jpg",
        'https://360.com.vn/wp-content/uploads/2024/12/AKGTK503-QGGTK502-6.jpg',
        "https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-8.jpg",
        "https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg",
    ],
    description: "- Chất liệu: Tuytsi Cafe\n- Form: Slim\n- Đặc tính: Quần âu cafe form dáng slim mặc vừa vặn với cơ thể.",
};

const productData = [
    {
        id: 1,
        img1: 'https://360.com.vn/wp-content/uploads/2024/12/ANHTK512-5.jpg',
        img2: 'https://360.com.vn/wp-content/uploads/2024/12/ANHTK512-6.jpg',
        title: 'Áo khoác cổ đức chần bông AKHTK55',
        price: '849.000 VND'
    },
    {
        id: 2,
        img1: 'https://360.com.vn/wp-content/uploads/2024/12/ADLTK502-QJDTK501-6.jpg',
        img2: 'https://360.com.vn/wp-content/uploads/2024/12/ADLTK502-QJDTK501-8.jpg',
        title: 'Áo gile chần bông AKHTK507',
        price: '619.000 VND'
    },
    {
        id: 3,
        img1: 'https://360.com.vn/wp-content/uploads/2024/12/AKGTK503-QGGTK502-7.jpg',
        img2: 'https://360.com.vn/wp-content/uploads/2024/12/AKGTK503-QGGTK502-6.jpg',
        title: 'Áo polo dài tay nam POTTK530',
        price: '399.000 VND'
    },
    {
        id: 4,
        img1: 'https://360.com.vn/wp-content/uploads/2024/11/APHTK533-QSKTK514-1.jpg',
        img2: 'https://360.com.vn/wp-content/uploads/2024/11/APHTK533-QSKTK514-2.jpg',
        title: 'Quần jogger QGNTK508',
        price: '449.000 VND'
    },
    {
        id: 5,
        img1: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg',
        img2: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-8.jpg',
        title: 'Áo khoác kaki cổ đức AKHTK510',
        price: '819.000 VND'
    },
    {
        id: 6,
        img1: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg',
        img2: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-8.jpg',
        title: 'Áo khoác kaki cổ đức AKHTK510',
        price: '819.000 VND'
    }
];

const ChiTietSanPham = () => {
    const { id } = useParams(); // Lấy id từ URL
    const thumbnailRefs = useRef([]);
    const [openSizeGuide, setOpenSizeGuide] = useState(false);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Mở bảng chọn size
    const handleOpenSizeGuide = () => setOpenSizeGuide(true);
    const handleCloseSizeGuide = () => setOpenSizeGuide(false);

    const handleNextImage = () => {
        setSelectedImageIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % product.images.length;
            scrollToThumbnail(newIndex);
            return newIndex;
        });
    };

    const handlePrevImage = () => {
        setSelectedImageIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + product.images.length) % product.images.length;
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
    const [start, setStart] = useState(0);
    const [directionSPNam, setDirectionSPNam] = useState(0);

    const handleNext = () => {
        setDirectionSPNam(1);
        setStart((prev) => (prev + 1) % productData.length);
    };

    const handlePrev = () => {
        setDirectionSPNam(-1);
        setStart((prev) => (prev - 1 + productData.length) % productData.length);
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

    return (
        <Container maxWidth="lg" sx={{ mt: 4, marginBottom: -8 }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="http://localhost:3000/home" sx={{fontSize:'14px',textDecoration:'none'}}>
                    Trang chủ
                </Link>
                <Link color="inherit" href="http://localhost:3000/sanPham" sx={{fontSize:'14px',textDecoration:'none'}}>
                    Sản phẩm
                </Link>
                <Typography color="text.primary" sx={{fontSize:'14px'}}>
                    Tên sản phẩm 
                </Typography>
            </Breadcrumbs>
            <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)", pb: 3, marginTop:3 }}>
                <Grid container spacing={4}>
                    {/* Hình ảnh sản phẩm */}
                    <Grid item xs={12} md={6} display="flex" alignItems="center">
                        <Box sx={{ display: "flex", marginTop: -7 }}>
                            {/* List ảnh nhỏ */}
                            <Box sx={{ display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: 400, mr: 2 }}>
                                {product.images.map((image, index) => (
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
                                    src={product.images[selectedImageIndex]}
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
                        <Typography variant="h5" fontWeight="bold">{product.name}</Typography>
                        <Typography variant="h6" color="primary" mt={1}>{product.price.toLocaleString()} VND</Typography>

                        {/* Chọn màu */}
                        <Box mt={2}>
                            <Typography variant="subtitle1">Màu sắc</Typography>
                            {product.colors.map((color, index) => (
                                <IconButton
                                    key={index}
                                    sx={{ bgcolor: color, width: 32, height: 32, m: 0.5, border: selectedColor === color ? "2px solid black" : "none" }}
                                    onClick={() => setSelectedColor(color)}
                                ></IconButton>
                            ))}
                        </Box>

                        {/* Chọn size */}
                        <Box mt={2}>
                            <Typography variant="subtitle1" fontWeight="bold">Kích thước</Typography>
                            <Box display="flex" gap={1} mt={1}>
                                {product.sizes.map((size) => (
                                    <Button
                                        key={size}
                                        variant={selectedSize === size ? "contained" : "outlined"}
                                        onClick={() => setSelectedSize(size)}
                                        sx={{
                                            minWidth: 50,
                                            borderRadius: 2,
                                            bgcolor: selectedSize === size ? "black" : "white",
                                            color: selectedSize === size ? "white" : "black",
                                            borderColor: "black",
                                            "&:hover": {
                                                bgcolor: selectedSize === size ? "black" : "#f0f0f0",
                                            },
                                        }}
                                    >
                                        {size}
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
                            <IconButton onClick={() => setQuantity(quantity + 1)}><AddIcon /></IconButton>
                        </Box>

                        {/* Nút thao tác */}
                        <Box mt={3} display="flex" gap={2}>
                            <Button variant="contained" sx={{ backgroundColor: '#1976D2' }} startIcon={<AddShoppingCartIcon />}>Thêm vào giỏ hàng</Button>
                            {/* <Button variant="contained" color="error" startIcon={<ShoppingCartCheckoutIcon />}>Mua ngay</Button> */}
                        </Box>

                        {/* Chi tiết sản phẩm */}
                        <Box mt={4}>
                            <Typography variant="h6">Chi Tiết Sản Phẩm</Typography>
                            <Typography variant="body1" whiteSpace="pre-line">{product.description}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ marginTop: -1 }}>
                {/* Quần âu Nam */}
                <Container sx={{ py: 4 }}>
                    <Typography variant="h6" sx={{ mb: 4, textAlign: 'left', fontWeight: 'bold' }}>
                        Sản phẩm cùng danh mục
                    </Typography>

                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <AnimatePresence custom={directionSPNam} mode="wait">
                            <motion.div
                                key={start}
                                variants={{
                                    initial: (directionSPNam) => variants.initial(directionSPNam),
                                    animate: variants.animate,
                                    exit: (directionSPNam) => variants.exit(directionSPNam),
                                }}
                                custom={directionSPNam}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: '2px' }}>
                                    {Array.from({ length: 5 }).map((_, index) => {
                                        const product = productData[(start + index) % productData.length];
                                        return (
                                            <Grid item key={product.id} xs={12} sm={4} md={2.4}>
                                                <Card sx={{ position: 'relative', boxShadow: 2, borderRadius: 2 }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="250"
                                                        image={product.img1}
                                                        alt={product.title}
                                                        sx={{
                                                            transition: 'opacity 0.3s ease',
                                                            '&:hover': { opacity: 0 },
                                                            borderTopLeftRadius: 2,
                                                            borderTopRightRadius: 2,
                                                        }}
                                                    />
                                                    <CardMedia
                                                        component="img"
                                                        height="250"
                                                        image={product.img2}
                                                        alt={product.title}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            opacity: 0,
                                                            transition: 'opacity 0.3s ease',
                                                            '&:hover': { opacity: 1 },
                                                            borderTopLeftRadius: 2,
                                                            borderTopRightRadius: 2,
                                                        }}
                                                    />
                                                    <CardContent
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
                                                            }}
                                                        >
                                                            {product.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mb: -2 }}>
                                                            {product.price}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </motion.div>
                        </AnimatePresence>

                        <IconButton
                            onClick={handleNext}
                            sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 10 }}
                        >
                            <ChevronRight />
                        </IconButton>

                        <IconButton
                            onClick={handlePrev}
                            sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 10 }}
                        >
                            <ChevronLeft />
                        </IconButton>
                    </Box>
                </Container>
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
        </Container>
    );
};

export default ChiTietSanPham;