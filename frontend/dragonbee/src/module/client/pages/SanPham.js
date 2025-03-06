import React, { useState } from 'react';
import {
  Box, Typography, Slider, Grid, Card, CardMedia, CardContent,
  Button, Accordion, AccordionSummary, AccordionDetails, InputAdornment, TextField
} from '@mui/material';
import logo from '../../../img/bannerQuanAu.png';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

const products = [
  { id: 1, name: 'Balenciaga Balen Grey 2023', brand: 'Balenciaga', description: 'Giày lười', price: '137,500 đ', oldPrice: '250,000 đ', discount: '45%', image: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg', sizes: [40, 41, 42] },
  { id: 2, name: 'Converse Venom', brand: 'Converse', description: 'Giày tây', price: '75,000 đ', oldPrice: '100,000 đ', discount: '25%', image: 'https://360.com.vn/wp-content/uploads/2024/11/APHTK533-QSKTK514-1.jpg', sizes: [40, 41] },
  { id: 3, name: 'Nike Dunk 2022', brand: 'Nike', description: 'Giày cổ thấp', price: '55,000 đ', oldPrice: '100,000 đ', discount: '45%', image: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg', sizes: [39, 40, 43] },
  { id: 4, name: 'Nike Dunk 2022', brand: 'Nike', description: 'Giày cổ thấp', price: '55,000 đ', oldPrice: '100,000 đ', discount: '45%', image: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg', sizes: [39, 40, 43] },
  { id: 5, name: 'Nike Dunk 2022', brand: 'Nike', description: 'Giày cổ thấp', price: '55,000 đ', oldPrice: '100,000 đ', discount: '45%', image: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg', sizes: [39, 40, 43] },
  { id: 6, name: 'Nike Dunk 2022', brand: 'Nike', description: 'Giày cổ thấp', price: '55,000 đ', oldPrice: '100,000 đ', discount: '45%', image: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg', sizes: [39, 40, 43] },

];

const SanPham = () => {
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    material: "",
    sole: "",
    size: "",
    color: "",
    price: [0, 300000],
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      brand: "",
      material: "",
      sole: "",
      size: "",
      color: "",
      price: [0, 300000],
    });
  };

  return (
    <Box sx={{ margin: -3 }}>
      {/* Banner */}
      <Box
        sx={{
          width: '100%',
          height: 200,
          backgroundImage: `url(${logo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {/* Overlay để làm tối nền giúp chữ dễ đọc */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />

        {/* Chữ Banner */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            position: 'relative',
            zIndex: 1,
            fontSize: { xs: '1.5rem', md: '2.5rem' }, // Responsive font size
          
          }}
        >
          Quần Âu DragonBee
        </Typography>
      </Box>

      {/* Danh sách sản phẩm */}
      <Box sx={{ display: 'flex', padding: 3 }}>
        {/* Sidebar bộ lọc */}
        <Box sx={{ width: 400, padding: 2, bgcolor: "white", borderRadius: 2, boxShadow: 2, height:510 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            DANH MỤC SẢN PHẨM
          </Typography>

          {[
            { key: "category", label: "Loại giày" },
            { key: "brand", label: "Thương hiệu" },
            { key: "material", label: "Chất liệu" },
            { key: "sole", label: "Đế giày" },
            { key: "size", label: "Kích cỡ" },
            { key: "color", label: "Màu sắc" },
          ].map((item, index) => (
            <Accordion key={index} sx={{ boxShadow: "none", mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    fontWeight: filters[item.key] ? "bold" : "normal",
                    color: filters[item.key] ? "#1976D2" : "black",
                  }}
                >
                  {item.label}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Nội dung bộ lọc, bạn có thể thêm tùy chọn dropdown, checkbox... */}
                <Typography variant="body2">Tùy chọn...</Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
            Giá tiền (Giá gốc)
          </Typography>
          <Slider
            value={filters.price}
            onChange={(e, newValue) => handleFilterChange("price", newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={300000}
            step={5000}
            sx={{ color: filters.price[0] !== 0 || filters.price[1] !== 300000 ? "#1976D2" : "#1976D2" }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              bgcolor: "#1976D2",
              color: "white",
              "&:hover": { bgcolor: "#e69500" },
            }}
            onClick={resetFilters}
          >
            XÓA
          </Button>
        </Box>

        {/* Danh sách sản phẩm */}
        <Box marginLeft={3}>
          <Box width={600}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm sản phẩm"
              size='small'
              sx={{
                bgcolor: "white",
                marginBottom: 3,
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box>
            <Grid container spacing={3}>
              {products.length > 0 ? (
                products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}> {/* Cập nhật lg={3} để có 4 sản phẩm mỗi dòng */}
                    <Card
                      sx={{
                        width: 280, // Cố định chiều rộng
                        height: 400, // Cố định chiều cao
                        position: 'relative',
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                    >

                      <CardMedia component="img" height="200" image={product.image} alt={product.name} />
                      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>

                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            minHeight: '40px', // Giữ chiều cao cố định để tránh lệch
                          }}
                        >
                          {product.name}
                        </Typography>


                        <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                        <Typography variant="h6" sx={{ color: 'red', fontWeight: 'bold' }}>{product.price}</Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                            product.sizes.map(size => (
                              <Box key={size} sx={{ border: '1px solid black', borderRadius: 1, px: 1, py: 0.5 }}>{size}</Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">Không có size</Typography>
                          )}
                        </Box>
                        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Mua Ngay</Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="h6" color="text.secondary">Không có sản phẩm nào</Typography>
              )}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SanPham;
