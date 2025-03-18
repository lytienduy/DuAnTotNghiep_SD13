import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Slider, Grid, Card, CardMedia, CardContent,
  Button, Accordion, AccordionSummary, AccordionDetails, InputAdornment, TextField, IconButton
} from '@mui/material';
import logo from '../../../img/bannerQuanAu.png';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SanPham = () => {
  const navigate = useNavigate(); // Khai báo navigate
  const [products, setProducts] = useState([]);//Các sản phẩm của cửa hàng để bán
  const [danhMuc, setDanhMuc] = useState(""); // Giá trị của bộ lọc danh mục
  const [mauSac, setMauSac] = useState(""); // Giá trị của bộ lọc màu sắc
  const [chatLieu, setChatLieu] = useState(""); // Giá trị của bộ lọc chất liệu
  const [kichCo, setKichCo] = useState(""); // Giá trị của bộ lọc sizw
  const [kieuDang, setKieuDang] = useState(""); // Giá trị của bộ lọc kiểu dáng
  const [thuongHieu, setThuongHieu] = useState(""); // Giá trị của bộ lọc thương hiệu
  const [phongCach, setPhongCach] = useState(""); // Giá trị của bộ lọc phong cách
  const [timKiem, setTimKiem] = useState(""); // Giá trị của bộ lọc tìm kiếm sản phẩm
  const [listDanhMuc, setListDanhMuc] = useState([]);
  const [listChatLieu, setListChatLieu] = useState([]);
  const [listKichCo, setListKichCo] = useState([]);
  const [listKieuDang, setListKieuDang] = useState([]);
  const [listMauSac, setListMauSac] = useState([]);
  const [listPhongCach, setListPhongCach] = useState([]);
  const [listThuongHieu, setListThuongHieu] = useState([]);
  const [value, setValue] = useState([100000, 3200000]);//giá trị slider khoảng giá
  const [debouncedValue, setDebouncedValue] = useState(value);//giá trị khoảng giá


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
  const getSanPhamHienThi = async () => {
    let apiUrl = "http://localhost:8080/spClient/layListCacSanPhamHienThi";
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
      console.log(`${apiUrl}?${params.toString()}`);
      setProducts(response.data);
      showSuccessToast("ok")
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

  //resetToanBoBoLoc
  const resetFilters = () => {
    setDanhMuc("");
    setMauSac("");
    setChatLieu("");
    setKichCo("");
    setKieuDang("");
    setThuongHieu("");
    setPhongCach("")
  }
  //Hàm xử lý khi đóng mở modal
  useEffect(() => {
    getAndSetToanBoBoLoc();
    getSanPhamHienThi();
  }, []);

  //Tạo độ trễ cho ô tìm kiếm
  useEffect(() => {
    const handler = setTimeout(() => {
      getSanPhamHienThi();
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
    getSanPhamHienThi();
  }, [debouncedValue]);

  //Khi thay đổi bộ lọc
  useEffect(() => {
    getSanPhamHienThi();
  }, [danhMuc, mauSac, chatLieu, kichCo, kieuDang, thuongHieu, phongCach]);


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
        <Box sx={{ width: 450, padding: 2, bgcolor: "white", borderRadius: 2, boxShadow: 2, height: 630 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Bộ lọc sản phẩm
          </Typography>

          <Box
            sx={{
              maxHeight: "600px", // Giới hạn chiều cao
              overflowY: "auto", // Hiển thị thanh cuộn khi cần
              paddingRight: "8px", // Tránh bị cắt mất nội dung do thanh cuộn
            }}
          >
            {/* Danh mục sản phẩm */}
            <Accordion
              expanded={true}
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
              expanded={true}
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
              expanded={true}
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
              expanded={true}
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
              expanded={true}
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
              expanded={true}
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
              expanded={true}
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
                        justifyContent: "space-between",
                        cursor: "pointer", // Biến con trỏ thành hình bàn tay khi trỏ vào
                        transition: "transform 0.2s ease-in-out", // Hiệu ứng mượt mà
                        "&:hover": {
                          transform: "scale(1.05)", // Phóng to nhẹ khi hover
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Hiệu ứng bóng đổ
                        }
                      }}
                      onClick={() => navigate(`/sanPhamChiTiet/${product.id}`)}
                    >
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
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            '&:hover': { opacity: 1 },
                            borderTopLeftRadius: 2,
                            borderTopRightRadius: 2,
                          }}
                        />
                      )}
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
                          {product.ten}
                        </Typography>


                        {/* <Typography variant="body2" color="text.secondary">{product.description}</Typography> */}
                        <Typography variant="h6" sx={{ color: 'red', fontWeight: 'bold' }}>{product.gia?.toLocaleString()}đ</Typography>
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
                                    backgroundColor: item.mauSac.ma, // Giữ màu nền
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
