import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Slider, Grid, Card, CardMedia, CardContent,
  Button, Accordion, AccordionSummary, AccordionDetails, InputAdornment, TextField
} from '@mui/material';
import logo from '../../../img/bannerQuanAu.png';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const products = [
  { id: 1, name: 'Balenciaga Balen Grey 2023', brand: 'Balenciaga', description: 'Giày lười', price: '137,500 đ', oldPrice: '250,000 đ', discount: '45%', image: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg', sizes: [40, 41, 42] },
  { id: 2, name: 'Converse Venom', brand: 'Converse', description: 'Giày tây', price: '75,000 đ', oldPrice: '100,000 đ', discount: '25%', image: 'https://360.com.vn/wp-content/uploads/2024/11/APHTK533-QSKTK514-1.jpg', sizes: [40, 41] },
  { id: 3, name: 'Nike Dunk 2022', brand: 'Nike', description: 'Giày cổ thấp', price: '55,000 đ', oldPrice: '100,000 đ', discount: '45%', image: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg', sizes: [39, 40, 43] },
  { id: 4, name: 'Nike Dunk 2022', brand: 'Nike', description: 'Giày cổ thấp', price: '55,000 đ', oldPrice: '100,000 đ', discount: '45%', image: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg', sizes: [39, 40, 43] },
  { id: 5, name: 'Nike Dunk 2022', brand: 'Nike', description: 'Giày cổ thấp', price: '55,000 đ', oldPrice: '100,000 đ', discount: '45%', image: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg', sizes: [39, 40, 43] },
  { id: 6, name: 'Nike Dunk 2022', brand: 'Nike', description: 'Giày cổ thấp', price: '55,000 đ', oldPrice: '100,000 đ', discount: '45%', image: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-2.jpg', sizes: [39, 40, 43] },

];

const SanPham = () => {
  // const [products, setProducts] = useState([]);//Các sản phẩm của cửa hàng để bán
  const [danhMuc, setDanhMuc] = useState(null); // Giá trị của bộ lọc danh mục
  const [mauSac, setMauSac] = useState(null); // Giá trị của bộ lọc màu sắc
  const [chatLieu, setChatLieu] = useState(null); // Giá trị của bộ lọc chất liệu
  const [kichCo, setKichCo] = useState(null); // Giá trị của bộ lọc sizw
  const [kieuDang, setKieuDang] = useState(null); // Giá trị của bộ lọc kiểu dáng
  const [thuongHieu, setThuongHieu] = useState(null); // Giá trị của bộ lọc thương hiệu
  const [phongCach, setPhongCach] = useState(null); // Giá trị của bộ lọc phong cách
  const [timKiem, setTimKiem] = useState(""); // Giá trị của bộ lọc tìm kiếm sản phẩm
  const [listDanhMuc, setListDanhMuc] = useState([]);
  const [listChatLieu, setListChatLieu] = useState([]);
  const [listKichCo, setListKichCo] = useState([]);
  const [listKieuDang, setListKieuDang] = useState([]);
  const [listMauSac, setListMauSac] = useState([]);
  const [listPhongCach, setListPhongCach] = useState([]);
  const [listThuongHieu, setListThuongHieu] = useState([]);
  const [value, setValue] = useState([100000, 3200000]);//giá trị slider khoảng giá



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
        <Box sx={{ width: 400, padding: 2, bgcolor: "white", borderRadius: 2, boxShadow: 2, height: 510 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Bộ lọc sản phẩm
          </Typography>

          {/* Danh mục sản phẩm */}
          <Accordion
            expanded={Boolean(danhMuc)}
            sx={{ boxShadow: "none", mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Danh mục</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {listDanhMuc?.map((item) => (
                <Typography
                  key={item.id}
                  onClick={() => setDanhMuc(item.id)}
                  sx={{
                    cursor: 'pointer',
                    mb: 1,
                    '&:hover': { fontWeight: 600, color: 'blue' },
                    backgroundColor: danhMuc === item.id ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                    padding: '8px 16px',
                    borderRadius: '4px',
                  }}
                >
                  {item.tenDanhMuc}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Màu sắc sản phẩm */}
          <Accordion
            expanded={Boolean(mauSac)}
            sx={{ boxShadow: "none", mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Màu sắc</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {listMauSac?.map((item) => (
                <Typography
                  key={item.id}
                  onClick={() => setMauSac(item.id)}
                  sx={{
                    cursor: 'pointer',
                    mb: 1,
                    '&:hover': { fontWeight: 600, color: 'blue' },
                    backgroundColor: mauSac === item.id ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                    padding: '8px 16px',
                    borderRadius: '4px',
                  }}
                >
                  {item.tenMauSac}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Chất liệu sản phẩm */}
          <Accordion
            expanded={Boolean(chatLieu)}
            sx={{ boxShadow: "none", mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Chất liệu</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {listChatLieu?.map((item) => (
                <Typography
                  key={item.id}
                  onClick={() => setChatLieu(item.id)}
                  sx={{
                    cursor: 'pointer',
                    mb: 1,
                    '&:hover': { fontWeight: 600, color: 'blue' },
                    backgroundColor: chatLieu === item.id ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                    padding: '8px 16px',
                    borderRadius: '4px',
                  }}
                >
                  {item.tenChatLieu}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Kích cỡ sản phẩm */}
          <Accordion
            expanded={Boolean(kichCo)}
            sx={{ boxShadow: "none", mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Size</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {listKichCo?.map((item) => (
                <Typography
                  key={item.id}
                  onClick={() => setKichCo(item.id)}
                  sx={{
                    cursor: 'pointer',
                    mb: 1,
                    '&:hover': { fontWeight: 600, color: 'blue' },
                    backgroundColor: kichCo === item.id ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                    padding: '8px 16px',
                    borderRadius: '4px',
                  }}
                >
                  {item.tenSize}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Kiểu dáng sản phẩm */}
          <Accordion
            expanded={Boolean(kieuDang)}
            sx={{ boxShadow: "none", mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Kiểu dáng</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {listKieuDang?.map((item) => (
                <Typography
                  key={item.id}
                  onClick={() => setKieuDang(item.id)}
                  sx={{
                    cursor: 'pointer',
                    mb: 1,
                    '&:hover': { fontWeight: 600, color: 'blue' },
                    backgroundColor: kieuDang === item.id ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                    padding: '8px 16px',
                    borderRadius: '4px',
                  }}
                >
                  {item.tenKieuDang}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Thương hiệu sản phẩm */}
          <Accordion
            expanded={Boolean(thuongHieu)}
            sx={{ boxShadow: "none", mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Thương hiệu</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {listThuongHieu?.map((item) => (
                <Typography
                  key={item.id}
                  onClick={() => setThuongHieu(item.id)}
                  sx={{
                    cursor: 'pointer',
                    mb: 1,
                    '&:hover': { fontWeight: 600, color: 'blue' },
                    backgroundColor: thuongHieu === item.id ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                    padding: '8px 16px',
                    borderRadius: '4px',
                  }}
                >
                  {item.tenThuongHieu}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Phong cách sản phẩm */}
          <Accordion
            expanded={Boolean(phongCach)}
            sx={{ boxShadow: "none", mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Phong cách</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {listPhongCach?.map((item) => (
                <Typography
                  key={item.id}
                  onClick={() => setPhongCach(item.id)}
                  sx={{
                    cursor: 'pointer',
                    mb: 1,
                    '&:hover': { fontWeight: 600, color: 'blue' },
                    backgroundColor: phongCach === item.id ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                    padding: '8px 16px',
                    borderRadius: '4px',
                  }}
                >
                  {item.tenPhongCach}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>


          <Typography textAlign="center" fontWeight={500} sx={{ mb: 2 }}>
            {`${value[0].toLocaleString()} đ - ${value[1].toLocaleString()} đ`}
          </Typography>
          <Slider
            value={value}
            onChange={(e, newValue) => setValue(newValue)}
            min={100000}
            max={3200000}
            valueLabelDisplay="off" // Tắt hiển thị mặc định trên hai đầu
            sx={{
              marginBottom: 2,
              '& .MuiSlider-valueLabel': {
                display: 'none', // Ẩn giá trị mặc định của Slider
              }
            }}
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
              value={timKiem}
              placeholder="Tìm kiếm sản phẩm theo tên, mã sản phẩm"
              variant="outlined"
              fullWidth
              size='small'
              sx={{ marginBottom: 2 }}
              onChange={(e) => setTimKiem(e.target.value)}
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
      {/* Quan trọng để hiển thị toast */}
      <ToastContainer />
    </Box >
  );
};

export default SanPham;
