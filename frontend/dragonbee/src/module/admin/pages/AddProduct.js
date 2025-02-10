import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Card,
  CardContent,
  Typography,
  Grid,
  Modal,
  Box,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AddSanPham = () => {
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [danhMucs, setDanhMucs] = useState([]);
  const [thuongHieus, setThuongHieus] = useState([]);
  const [phongCachs, setPhongCachs] = useState([]);
  const [chatLieus, setChatLieus] = useState([]);
  const [xuatXus, setXuatXus] = useState([]);
  const [kieuDangs, setKieuDangs] = useState([]);
  const [kieuDaiQuans, setKieuDaiQuans] = useState([]);
  const [sanPhamChiTietList, setSanPhamChiTietList] = useState([]);

  const [colors, setMauSacs] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [openColorSizeModal, setOpenColorSizeModal] = useState(false);
  const [selectedMauSac, setSelectedMauSac] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  // đổ danh mục
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/danhmuc")
      .then((res) => {
        console.log("Danh Mục API Response:", res.data); // Kiểm tra dữ liệu API
        setDanhMucs(res.data);
      })
      .catch((error) =>
        console.error(
          "Lỗi API Danh Mục:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // đổ thương hiệu
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/thuonghieu")
      .then((res) => {
        console.log("Thương Hiệu API Response:", res.data); // Kiểm tra dữ liệu API
        setThuongHieus(res.data);
      })
      .catch((error) =>
        console.error(
          "Lỗi API Thương Hiệu:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // đổ phong cách
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/phongcach")
      .then((res) => {
        console.log("Phong Cách API Response:", res.data); // Kiểm tra dữ liệu API
        setPhongCachs(res.data);
      })
      .catch((error) =>
        console.error(
          "Lỗi API Phong Cách:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // đổ chất liệu
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/chatlieu")
      .then((res) => {
        console.log("Chất Liệu API Response:", res.data); // Kiểm tra dữ liệu API
        setChatLieus(res.data);
      })
      .catch((error) =>
        console.error(
          "Lỗi API Chất Liệu:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // đổ kiểu dáng
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/kieudang")
      .then((res) => {
        console.log("Kiểu Dáng API Response:", res.data); // Kiểm tra dữ liệu API
        setKieuDangs(res.data);
      })
      .catch((error) =>
        console.error(
          "Lỗi API Kiểu Dáng:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // đổ kiểu đai quần
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/kieudaiquan")
      .then((res) => {
        console.log("Phong Cách API Response:", res.data); // Kiểm tra dữ liệu API
        setKieuDaiQuans(res.data);
      })
      .catch((error) =>
        console.error(
          "Lỗi API kiểu  đai quần:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // đổ xuất xứ
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/xuatxu")
      .then((res) => {
        console.log("Xuất Xứ API Response:", res.data); // Kiểm tra dữ liệu API
        setXuatXus(res.data);
      })
      .catch((error) =>
        console.error(
          "Lỗi API Xuất Xứ:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // màu sắc và kích cỡ
  useEffect(() => {
    // API calls for categories and details (Danh mục, Thương hiệu, Phong cách, ...)
    // Add the API for fetching colors and sizes
    axios.get("http://localhost:8080/api/mausac")
      .then((res) => setMauSacs(res.data))
      .catch((error) => console.error(error));
    axios.get("http://localhost:8080/api/size")
      .then((res) => setSizes(res.data))
      .catch((error) => console.error(error));
  }, []);
  const handleColorSizeModal = () => {
    setOpenColorSizeModal(!openColorSizeModal);
  };
  // lưu sản phẩm 
  const onSubmit = (data, event) => {
    event.preventDefault();
  
    if (sanPhamChiTietList.length === 0) {
      alert("Vui lòng thêm ít nhất một chi tiết sản phẩm.");
      return;
    }
  
    const requestData = {
      ...data,
      sanPhamChiTietList: sanPhamChiTietList.map((item) => ({
        ...item,
        mauSac: { id: item.mauSac }, // Định dạng đúng
        size: { id: item.size },
      })),
    };
  
    console.log("Dữ liệu gửi API:", JSON.stringify(requestData, null, 2));
  
    axios.post("http://localhost:8080/api/sanpham/add", requestData)
      .then(() => {
        alert("Thêm sản phẩm thành công!");
        navigate("/sanpham");
      })
      .catch((error) => {
        console.error("Lỗi khi gửi API:", error.response?.data || error.message);
        alert("Lỗi khi thêm sản phẩm. Kiểm tra console.");
      });
  };
  
  // lưu màu sắc và size
  const handleSaveColorSize = () => {
    if (!selectedMauSac || !selectedSize) {
      alert("Vui lòng chọn màu sắc và kích cỡ!");
      return;
    }
  
    // Cập nhật sản phẩm chi tiết cuối cùng
    const updatedList = sanPhamChiTietList.map((item, index) =>
      index === sanPhamChiTietList.length - 1
        ? { ...item, mauSac: selectedMauSac, size: selectedSize }
        : item
    );
  
    setSanPhamChiTietList(updatedList);
    setOpenColorSizeModal(false);
  };
  

    const handleSaveProduct = (data) => {
      // Prepare data to send
      const requestData = { ...data, sanPhamChiTietList };
      axios.post("http://localhost:8080/api/sanpham/add", requestData)
        .then(() => {
          navigate("/sanpham");
        })
        .catch((error) => {
          console.error("Error saving product", error);
        });
    };

  const addSanPhamChiTiet = () => {
    const newItem = {
      ma: `SPCT${sanPhamChiTietList.length + 1}`,
      soLuong: 1,
      gia: 0,
      size: "",
      mauSac: "",
    };
    setSanPhamChiTietList([...sanPhamChiTietList, newItem]);
  };

  const removeSanPhamChiTiet = (index) => {
    if (sanPhamChiTietList.length === 1) {
      alert("Phải có ít nhất một sản phẩm chi tiết!");
      return;
    }
    
    const newList = sanPhamChiTietList.filter((_, i) => i !== index);
    setSanPhamChiTietList(newList);
  };
  


  return (
    <div>
      <Typography variant="h4">Thêm Sản Phẩm</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="tenSanPham"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tên Sản Phẩm"
              fullWidth
              margin="normal"
              sx={{ width: "50%" }}
            />
          )}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Danh Mục</InputLabel>
              <Controller
                name="danhMuc"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Danh Mục">
                    {danhMucs.map((dm) => (
                      <MenuItem key={dm.id} value={dm.id}>
                        {dm.tenDanhMuc}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Thương Hiệu</InputLabel>
              <Controller
                name="thuongHieu"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Thương Hiệu">
                    {thuongHieus.map((th) => (
                      <MenuItem key={th.id} value={th.id}>
                        {th.tenThuongHieu}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Phong Cách</InputLabel>
              <Controller
                name="phongCach"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Phong Cách">
                    {phongCachs.map((pc) => (
                      <MenuItem key={pc.id} value={pc.id}>
                        {pc.tenPhongCach}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Chất Liệu</InputLabel>
              <Controller
                name="chatLieu"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Chất Liệu">
                    {chatLieus.map((cl) => (
                      <MenuItem key={cl.id} value={cl.id}>
                        {cl.tenChatLieu}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          {/* Hàng 2: 3 cột */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Kiểu Dáng</InputLabel>
              <Controller
                name="kieuDang"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Kiểu Dáng" sx={{ width: "60%" }}>
                    {kieuDangs.map((kd) => (
                      <MenuItem key={kd.id} value={kd.id}>
                        {kd.tenKieuDang}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
              <InputLabel>Kiểu Đai Quần</InputLabel>
              <Controller
                name="kieuDaiQuan"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Kiểu Đai Quần">
                    {kieuDaiQuans.map((kdq) => (
                      <MenuItem key={kdq.id} value={kdq.id}>
                        {kdq.tenKieuDaiQuan}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
              <InputLabel>Xuất Xứ</InputLabel>
              <Controller
                name="xuatXu"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Xuất Xứ">
                    {xuatXus.map((xx) => (
                      <MenuItem key={xx.id} value={xx.id}>
                        {xx.tenXuatSu}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
        {/* bảng hiển thị danh sách */}
        <div>
      {/* <Typography variant="h4">Thêm Sản Phẩm</Typography> */}
      <form onSubmit={handleSubmit(handleSaveProduct)}>
        {/* Existing Fields for Tên Sản Phẩm, Danh Mục, Thương Hiệu, ... */}

        <Button
          variant="contained"
          onClick={addSanPhamChiTiet}
          startIcon={<AddCircle />}
        >
          Thêm Chi Tiết
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên Sản Phẩm</TableCell>
              <TableCell>Kích Cỡ</TableCell>
              <TableCell>Số Lượng</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Xóa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sanPhamChiTietList.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    label="Tên Sản Phẩm"
                    fullWidth
                    value={item.tenSanPham || ""}
                    onChange={(e) => {
                      const newList = [...sanPhamChiTietList];
                      newList[index].tenSanPham = e.target.value;
                      setSanPhamChiTietList(newList);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={handleColorSizeModal}>Chọn Kích Cỡ</Button>
                  <div>{item.tenSize}</div>
                  <div>{item.tenMauSac}</div>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.soLuong}
                    onChange={(e) => {
                      const newList = [...sanPhamChiTietList];
                      newList[index].soLuong = e.target.value;
                      setSanPhamChiTietList(newList);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.gia}
                    onChange={(e) => {
                      const newList = [...sanPhamChiTietList];
                      newList[index].gia = e.target.value;
                      setSanPhamChiTietList(newList);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => removeSanPhamChiTiet(index)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button onClick={handleSaveColorSize} variant="contained">
  Lưu
</Button>

      </form>

      {/* Modal for Color and Size Selection */}
      <Modal open={openColorSizeModal} onClose={handleColorSizeModal}>
        <Box sx={{ p: 3, backgroundColor: 'white', maxWidth: 400, margin: 'auto' }}>
          <Typography variant="h6">Chọn Màu và Kích Cỡ</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Màu Sắc</InputLabel>
            <Select
              value={selectedMauSac}
              onChange={(e) => setSelectedMauSac(e.target.value)}
            >
              {colors.map((color) => (
                <MenuItem key={color.id} value={color.id}>
                  {color.tenMauSac}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Kích Cỡ</InputLabel>
            <Select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {sizes.map((size) => (
                <MenuItem key={size.id} value={size.id}>
                  {size.tenSize}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleColorSizeModal} variant="contained">
            Lưu
          </Button>
        </Box>
      </Modal>
    </div>
      </form>
    </div>
  );
};

export default AddSanPham;
