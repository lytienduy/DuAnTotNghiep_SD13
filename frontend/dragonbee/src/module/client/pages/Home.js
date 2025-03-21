import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Box, Typography, Grid, IconButton, Container, Card, CardContent, CardMedia } from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';  // Example icon for "Thanh toán COD"
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const banners = [
  "https://cdn.santino.com.vn/storage/upload/slide/2025/02/Cover%20fb_PC.webp",
  "https://cdn.santino.com.vn/storage/upload/slide/2024/12/GentlemanlyElegance_PC.webp",
  "https://cdn.santino.com.vn/storage/upload/slide/2025/02/NewSpring_PC.webp",
];


const Home = () => {
  const navigate = useNavigate(); // Khai báo navigate
  const [currentBanner, setCurrentBanner] = useState(0);
  const [direction, setDirection] = useState(1); // Điều hướng trái/phải
  const [productDataBusiness, setProductDataBusiness] = useState([]);
  const [productDataGolf, setProductDataGolf] = useState([]);
  const [productDataCasual, setProductDataCasual] = useState([]);
  const [productDataTopBanChay, setProductDataTopBanChay] = useState([]);

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


  //Hàm chạy slides
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1); // Lướt sang phải
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  const getProductsDataHome = async () => {
    //Lấy business
    try {
      const responseBusiness = await axios.get(`http://localhost:8080/home/getListSanPhamQuanAuNamDanhMucBusiness`);//Gọi api bằng axiosGet
      setProductDataBusiness(responseBusiness.data);
    } catch (error) {
      showErrorToast("Lỗi khi lấy dữ liệu sản phẩm danh mục business")
    }
    //Lấy golf
    try {
      const responseGolf = await axios.get(`http://localhost:8080/home/getListSanPhamQuanAuNamDanhMucGolf`);//Gọi api bằng axiosGet
      setProductDataGolf(responseGolf.data);
    } catch (error) {
      showErrorToast("Lỗi khi lấy dữ liệu sản phẩm danh mục golf")
    }
    //Lấy casual
    try {
      const responseCasual = await axios.get(`http://localhost:8080/home/getListSanPhamQuanAuNamDanhMucCasual`);//Gọi api bằng axiosGet
      setProductDataCasual(responseCasual.data);
    } catch (error) {
      showErrorToast("Lỗi khi lấy dữ liệu sản phẩm danh mục casual")
    }
    //Lấy topBanChay
    try {
      const responseTopBanChay = await axios.get(`http://localhost:8080/home/getListTopSanPhamBanChay`);//Gọi api bằng axiosGet
      setProductDataTopBanChay(responseTopBanChay.data);
    } catch (error) {
      showErrorToast("Lỗi khi lấy dữ liệu sản phẩm danh mục topBanChay")
    }
  };

  //Hàm khởi tạo trang home lấy data hoem (business,golf,casual,topBanChay)
  useEffect(() => {
    getProductsDataHome();
  }, []);

  //Quần âu nam Business
  const [startBusiness, setStartBusiness] = useState(0);
  const [directionBusiness, setDirectionBusiness] = useState(0);

  const handleNextBusiness = () => {
    if (!productDataBusiness?.length) return; // Kiểm tra trước khi tính toán

    setDirectionBusiness(1);
    setStartBusiness((prev) => (prev + 1) % productDataBusiness?.length);
  };

  const handlePrevBusiness = () => {
    if (!productDataBusiness?.length) return; // Kiểm tra trước khi tính toán

    setDirectionBusiness(-1);
    setStartBusiness((prev) => (prev - 1 + productDataBusiness?.length) % productDataBusiness?.length);
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

  // Quần âu nam golf (tạo state và hàm riêng)
  const [startGolf, setStartGolf] = useState(0);
  const [directionGolf, setDirectionGolf] = useState(0);

  const handleNextGolf = () => {
    if (!productDataGolf?.length) return; // Kiểm tra trước khi tính toán

    setDirectionGolf(1);
    setStartGolf((prev) => (prev + 1) % productDataGolf.length);
  };

  const handlePrevGolf = () => {
    if (!productDataGolf?.length) return; // Kiểm tra trước khi tính toán

    setDirectionGolf(-1);
    setStartGolf((prev) => (prev - 1 + productDataGolf.length) % productDataGolf.length);
  };

  // Quần âu nam casual (tạo state và hàm riêng)
  const [startCasual, setStartCasual] = useState(0);
  const [directionCasual, setDirectionCasual] = useState(0);

  const handleNextCasual = () => {
    if (!productDataCasual?.length) return; // Kiểm tra trước khi tính toán

    setDirectionCasual(1);
    setStartCasual((prev) => (prev + 1) % productDataCasual?.length);
  };

  const handlePrevCasual = () => {
    if (!productDataCasual?.length) return; // Kiểm tra trước khi tính toán

    setDirectionCasual(-1);
    setStartCasual((prev) => (prev - 1 + productDataCasual?.length) % productDataCasual?.length);
  };

  return (
    <Box margin={-3}>
      {/* Banner Section with Auto Slide */}
      <Box sx={{ position: "relative", overflow: "hidden", height: "700px" }}>
        {/* Banner Section with Sliding Effect */}
        <motion.div
          key={currentBanner}
          initial={{ x: direction * 100 + "%" }}
          animate={{ x: 0 }}
          exit={{ x: -direction * 100 + "%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `url(${banners[currentBanner]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "700px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
            position: "absolute",
            width: "100%",
          }}
        >

        </motion.div>

        {/* Dots Navigation */}
        <Box sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
        }}>
          {banners.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: currentBanner === index ? "red" : "white",
                border: currentBanner === index ? "2px solid red" : "none",
                cursor: "pointer",
              }}
              onClick={() => {
                setDirection(index > currentBanner ? 1 : -1);
                setCurrentBanner(index);
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Service Section */}
      <Container sx={{ py: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          {[
            { title: "Freeship", desc: "Cho đơn hàng từ 500K", icon: <LocalShippingIcon /> },
            { title: "Thanh toán COD", desc: "Nhận hàng & thanh toán", icon: <PaymentIcon /> },
            { title: "Nhiều ưu đãi", desc: "Chiết khấu & quà tặng", icon: <LocalOfferIcon /> },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: "center", p: 2 }}>
                <CardContent>
                  <div sx={{ mb: 2 }}>
                    {item.icon}
                  </div>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Quần âu Nam Business*/}
      {productDataBusiness?.length > 0 &&
        <Container sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
            QUẦN ÂU NAM BUSINESS
          </Typography>
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence custom={directionBusiness} mode="wait">
              <motion.div
                key={startBusiness}
                variants={{
                  initial: (directionBusiness) => variants.initial(directionBusiness),
                  animate: variants.animate,
                  exit: (directionBusiness) => variants.exit(directionBusiness),
                }}
                custom={directionBusiness}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: '2px' }}>
                  {productDataBusiness?.length > 0 &&
                    Array.from({ length: Math.min(5, productDataBusiness.length) }).map((_, index) => {
                      const product = productDataBusiness[(startBusiness + index) % productDataBusiness?.length];
                      return (
                        <Grid item key={product.id} xs={12} sm={4} md={2.4} onClick={() => navigate(`/sanPhamChiTiet/${product.id}`)}>
                          <Card sx={{ position: 'relative', boxShadow: 2, borderRadius: 2 }}>
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

                            {/* Chỉ hiển thị ảnh thứ hai nếu tồn tại */}
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
                                  // height: '100%',
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

            {productDataBusiness?.length > 5 && (
              <>
                <IconButton
                  onClick={handleNextBusiness}
                  sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 10 }}
                >
                  <ChevronRight />
                </IconButton>

                <IconButton
                  onClick={handlePrevBusiness}
                  sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 10 }}
                >
                  <ChevronLeft />
                </IconButton>
              </>
            )}
          </Box>
        </Container >
      }

      {/* Quần âu Golf */}
      {productDataGolf?.length > 0 &&
        <Container sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
            QUẦN ÂU NAM GOLF
          </Typography>
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence custom={directionGolf} mode="wait">
              <motion.div
                key={startGolf}
                variants={{
                  initial: (directionGolf) => variants.initial(directionGolf),
                  animate: variants.animate,
                  exit: (directionGolf) => variants.exit(directionGolf),
                }}
                custom={directionGolf}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: '2px' }}>
                  {productDataGolf?.length > 0 &&
                    Array.from({ length: Math.min(5, productDataGolf.length) }).map((_, index) => {
                      const product = productDataGolf[(startGolf + index) % productDataGolf?.length];
                      return (
                        <Grid item key={product.id} xs={12} sm={4} md={2.4} onClick={() => navigate(`/sanPhamChiTiet/${product.id}`)}>
                          <Card sx={{ position: 'relative', boxShadow: 2, borderRadius: 2 }}>
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

                            {/* Chỉ hiển thị ảnh thứ hai nếu tồn tại */}
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
                                  // height: '100%',
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

            {productDataGolf?.length > 5 && (
              <>
                <IconButton
                  onClick={handleNextGolf}
                  sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 10 }}
                >
                  <ChevronRight />
                </IconButton>

                <IconButton
                  onClick={handlePrevGolf}
                  sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 10 }}
                >
                  <ChevronLeft />
                </IconButton>
              </>
            )}
          </Box>
        </Container >
      }
      {/* Quần âu Nam Casual*/}
      {productDataCasual?.length > 0 &&
        <Container sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
            QUẦN ÂU NAM CASUAL
          </Typography>
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence custom={directionCasual} mode="wait">
              <motion.div
                key={startCasual}
                variants={{
                  initial: (directionCasual) => variants.initial(directionCasual),
                  animate: variants.animate,
                  exit: (directionCasual) => variants.exit(directionCasual),
                }}
                custom={directionCasual}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: '2px' }}>
                  {productDataCasual?.length > 0 &&
                    Array.from({ length: Math.min(5, productDataCasual.length) }).map((_, index) => {
                      const product = productDataCasual[(startCasual + index) % productDataCasual?.length];
                      return (
                        <Grid item key={product.id} xs={12} sm={4} md={2.4} onClick={() => navigate(`/sanPhamChiTiet/${product.id}`)}>
                          <Card sx={{ position: 'relative', boxShadow: 2, borderRadius: 2 }}>
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

                            {/* Chỉ hiển thị ảnh thứ hai nếu tồn tại */}
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
                                  // height: '100%',
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

            {productDataCasual?.length > 5 && (
              <>
                <IconButton
                  onClick={handleNextCasual}
                  sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 10 }}
                >
                  <ChevronRight />
                </IconButton>

                <IconButton
                  onClick={handlePrevCasual}
                  sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 10 }}
                >
                  <ChevronLeft />
                </IconButton>
              </>
            )}
          </Box>
        </Container >
      }
      {/* TOP SẢN PHẨM BÁN CHẠY */}
      {productDataTopBanChay?.length > 0 &&
        <Container Container >
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            TOP SẢN PHẨM BÁN CHẠY
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {productDataTopBanChay.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id} onClick={() => navigate(`/sanPhamChiTiet/${product.id}`)}>
                <Card sx={{ position: 'relative', boxShadow: 3, borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    height="350"
                    image={product?.listHinhAnhAndMauSacAndSize[0]?.listAnh?.[0]}
                    alt={product.ten}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        opacity: 0,
                      },
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                    }}
                  />
                  {product?.listHinhAnhAndMauSacAndSize[0]?.listAnh?.[1] && (
                    <CardMedia
                      component="img"
                      height="350"
                      image={product?.listHinhAnhAndMauSacAndSize[0]?.listAnh?.[1]}
                      alt={product.ten}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          opacity: 1,
                        },
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography sx={{ mb: 1, fontSize: 15, fontWeight: 'bold' }}>
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
            ))}
          </Grid>
        </Container >
      }
      <ToastContainer />
    </Box >
  );
};

export default Home;