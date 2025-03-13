import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, IconButton, Container, Card, CardContent, CardMedia } from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';  // Example icon for "Thanh toán COD"
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  "https://cdn.santino.com.vn/storage/upload/slide/2025/02/Cover%20fb_PC.webp",
  "https://cdn.santino.com.vn/storage/upload/slide/2024/12/GentlemanlyElegance_PC.webp",
  "https://cdn.santino.com.vn/storage/upload/slide/2025/02/NewSpring_PC.webp",
];

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



const Home = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [direction, setDirection] = useState(1); // Điều hướng trái/phải

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1); // Lướt sang phải
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  //Quần âu nam
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

  const displayedProducts = [...Array(5)].map(
    (_, i) => productData[(start + i) % productData.length]
  );

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

  // Quần âu nữ (tạo state và hàm riêng)
  const [startWomens, setStartWomens] = useState(0);
  const [directionWomens, setDirectionWomens] = useState(0);

  const handleNextWomens = () => {
    setDirectionWomens(1);
    setStartWomens((prev) => (prev + 1) % productData.length);
  };

  const handlePrevWomens = () => {
    setDirectionWomens(-1);
    setStartWomens((prev) => (prev - 1 + productData.length) % productData.length);
  };

  const displayedProductsWomens = [...Array(5)].map(
    (_, i) => productData[(startWomens + i) % productData.length]
  );

  return (
    <Box margin={-3}>
      {/* Banner Section with Auto Slide */}
      <Box sx={{ position: "relative", overflow: "hidden", height: "500px" }}>
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
            height: "500px",
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

      {/* Quần âu Nam */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          QUẦN ÂU NAM
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

      {/* Quần âu Nữ */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          QUẦN ÂU NỮ
        </Typography>

        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence custom={directionWomens} mode="wait">
            <motion.div
              key={startWomens}
              variants={{
                initial: (directionWomens) => ({
                  opacity: 0,
                  x: directionWomens > 0 ? 100 : -100,
                }),
                animate: { opacity: 1, x: 0 },
                exit: (directionWomens) => ({
                  opacity: 0,
                  x: directionWomens > 0 ? -100 : 100,
                }),
              }}
              custom={directionWomens}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: '2px' }}>
                {displayedProductsWomens.map((product) => (
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
                ))}
              </Grid>
            </motion.div>
          </AnimatePresence>

          <IconButton
            onClick={handleNextWomens}
            sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 10 }}
          >
            <ChevronRight />
          </IconButton>

          <IconButton
            onClick={handlePrevWomens}
            sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 10 }}
          >
            <ChevronLeft />
          </IconButton>
        </Box>
      </Container>

      {/* TOP SẢN PHẨM BÁN CHẠY */}
      <Container >
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
          TOP SẢN PHẨM BÁN CHẠY
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {productData.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ position: 'relative', boxShadow: 3, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="350"
                  image={product.img1}
                  alt={product.title}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      opacity: 0,
                    },
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                  }}
                />
                <CardMedia
                  component="img"
                  height="350"
                  image={product.img2}
                  alt={product.title}
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
                <CardContent>
                  <Typography sx={{ mb: 1, fontSize: 15 }}>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={'bold'}>
                    {product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>


    </Box>
  );
};

export default Home;