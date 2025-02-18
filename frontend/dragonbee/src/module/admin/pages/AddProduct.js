import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  Modal,
  FormControl,
  Snackbar,
  Alert,
  InputLabel,
  IconButton,
  Paper,
  Typography,
  Grid,
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
  const { control, handleSubmit, getValues } = useForm();
  const navigate = useNavigate();
  // lưu sản phẩm
  const [newProductName, setNewProductName] = useState("");
  const [productStatus, setProductStatus] = useState("Đang bán");
  const [danhMucs, setDanhMucs] = useState([]);
  const [thuongHieus, setThuongHieus] = useState([]);
  const [phongCachs, setPhongCachs] = useState([]);
  const [chatLieus, setChatLieus] = useState([]);
  const [xuatXus, setXuatXus] = useState([]);
  const [kieuDangs, setKieuDangs] = useState([]);
  const [kieuDaiQuans, setKieuDaiQuans] = useState([]);
  const [sanPhamChiTietList, setSanPhamChiTietList] = useState([]);
  const [sanPhamList, setSanPhamList] = useState([]);
  const [colors, setMauSacs] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [tenSanPham, setTenSanPham] = useState("");
  const [moTa, setMoTa] = useState("");
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState({ tenDanhMuc: '', moTa: '' });
  const [newThuongHieu, setNewThuongHieu] = useState({ tenThuongHieu: "", moTa: "" });
  const [newPhongCach, setNewPhongCach] = useState({ tenPhongCach: "", moTa: "" });
  const [newChatLieu, setNewChatLieu] = useState({ tenChatLieu: "", moTa: "" });
  const [newKieuDang, setNewKieuDang] = useState({ tenKieuDang: "", moTa: "" });
  const [newKieuDaiQuan, setNewKieuDaiQuan] = useState({ tenKieuDaiQuan: "", moTa: "" });
  const [newXuatXu, setNewXuatXu] = useState({ tenXuatXu: "", moTa: "" });
  const [openModal, setOpenModal] = useState(null); // Giá trị mặc định là null

  // Khi bạn muốn mở một modal, hãy gọi handleOpenModal với loại modal cụ thể
  const handleOpenModal = (modalType) => {
    setOpenModal(modalType);  // Mở modal theo loại thuộc tính
  };
  
  // Khi đóng modal, đảm bảo đặt openModal về null
  const handleCloseModal = () => {
    setOpenModal(null);
    setError(""); // Reset lỗi
  };
  const [selectedProduct, setSelectedProduct] = useState(
    sanPhamList.length > 0 ? sanPhamList[0].id : ""
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // đổ danh mục
  useEffect(() => {
    axios.get("http://localhost:8080/api/danhmuc")
      .then((res) => {
        console.log("Danh Mục API Response:", res.data); // Kiểm tra dữ liệu API
        if (Array.isArray(res.data)) {
          setDanhMucs(res.data); // Đảm bảo res.data là một mảng
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", res.data);
        }
      })
      .catch((error) => {
        console.error(
          "Lỗi API Danh Mục:",
          error.response ? error.response.data : error.message
        );
      });
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
    axios.get("http://localhost:8080/api/kieudang")
      .then((res) => {
        console.log("Kiểu Dáng APi Response:",res.data);
        setKieuDangs(res.data);  
       // Cập nhật danh sách kiểu dáng
      })
      .catch((error) =>
        console.error(
          "Lỗi API Phong Cách:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // đổ kiểu đai quần
  useEffect(() => {
    axios.get("http://localhost:8080/api/kieudaiquan")
      .then(response => {
        setKieuDaiQuans(response.data);
        console.log(response.data);  // Kiểm tra xem dữ liệu có được tải chính xác không
      })
      .catch(error => {
        console.error("Lỗi khi lấy kiểu đai quần:", error);
      });
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
  // màu sắc
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/mausac")
      .then((res) => {
        console.log("Dữ liệu màu sắc từ API:", res.data);
        setMauSacs(res.data);
      })
      .catch((error) => console.error(error));
  }, []);
  // size
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/size")
      .then((res) => {
        console.log("Dữ liệu kích cỡ từ API:", res.data);
        setSizes(res.data);
      })
      .catch((error) => console.error(error));
  }, []);
  // đổ sản phẩm

  // Fetch danh sách sản phẩm từ server
  useEffect(() => {
    const fetchSanPhamList = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/sanpham/all");
  
        let productList = response.data;
  
        // Sắp xếp danh sách theo ID để đảm bảo sản phẩm mới nhất nằm ở đầu
        productList.sort((a, b) => b.id - a.id);
  
        setSanPhamList(productList);
  
        // Mặc định chọn sản phẩm đầu tiên nếu có sản phẩm
        if (productList.length > 0) {
          setSelectedProduct(productList[0].id);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };
  
    fetchSanPhamList();
  }, []);
  
  // lưu sản phẩm
  const onSubmit = async () => {
    if (sanPhamChiTietList.length === 0) {
      alert("Vui lòng thêm ít nhất một sản phẩm chi tiết!");
      return;
    }

    const requestData = {
      tenSanPham: getValues("tenSanPham"),
      moTa: getValues("moTa"),
      trangThai: getValues("trangThai"),
      nguoiTao: "admin",
      sanPhamChiTietList: sanPhamChiTietList.map((item) => ({
        mauSac: Number(item.mauSac), // ✅ Gửi ID màu sắc
        size: Number(item.size), // ✅ Gửi ID kích cỡ
        soLuong: item.soLuong,
        gia: item.gia,
        moTa: item.moTa || `Màu sắc ${item.tenMauSac}, size ${item.tenSize}`,
        trangThai: "Đang bán",
        nguoiTao: "admin",
      })),
    };

    console.log("Dữ liệu gửi lên API:", requestData);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/sanpham/them",
        requestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert(response.data);
      console.log("API Response:", response.data);

      setSanPhamChiTietList([]);
      setSelectedColors([]);
      setSelectedSizes([]);
    } catch (error) {
      console.error("Lỗi khi gửi API:", error);
      alert(
        "Lỗi khi thêm sản phẩm: " + (error.response?.data || error.message)
      );
    }
  };

  const removeSanPhamChiTiet = (index) => {
    const newList = [...sanPhamChiTietList];
    newList.splice(index, 1);
    setSanPhamChiTietList(newList);
  };

  // Hàm lưu sản phẩm mới
  const handleSaveProduct = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/sanpham/them",
        {
          tenSanPham: newProductName,
          trangThai: productStatus,
        }
      );
      setSanPhamList([response.data, ...sanPhamList]); // Thêm sản phẩm mới vào đầu danh sách
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving new product:", error);
    }
  };


  // Gửi dữ liệu lên backend để thêm sản phẩm mới
  const handleAddProduct = () => {
    if (!tenSanPham.trim()) {
      setError("Tên sản phẩm không được để trống!");
      return;
    }
  
    axios.post("http://localhost:8080/api/sanpham/add/sanpham", {
      tenSanPham: tenSanPham,
      moTa: moTa,
    })
    .then((res) => {
      const newProduct = res.data; // Nhận dữ liệu sản phẩm vừa thêm từ backend
  
      // Cập nhật danh sách sản phẩm ngay lập tức (đưa sản phẩm mới lên đầu)
      setSanPhamList((prevList) => [newProduct, ...prevList]);
  
      // Cập nhật sản phẩm đang chọn thành sản phẩm mới thêm
      setSelectedProduct(newProduct.id);
  
      // Đóng modal và reset form
      handleCloseModal();
  
      // Hiển thị thông báo thành công
      setOpenSnackbar(true);
    })
    .catch((err) => {
      if (err.response && err.response.data) {
        setError(err.response.data); // Hiển thị lỗi từ backend (ví dụ: tên bị trùng)
      } else {
        setError("Lỗi khi thêm sản phẩm!");
      }
    });
  };
  // add nhanh danh mục
  const handleAddDanhMuc = () => {
    if (!newCategory.tenDanhMuc.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }
  
    // Kiểm tra nếu tên danh mục đã tồn tại trong danh sách hiện tại
    const isDuplicate = danhMucs.some(dm => dm.tenDanhMuc === newCategory.tenDanhMuc);
    if (isDuplicate) {
      setError('Tên danh mục đã tồn tại');
      return;
    }
  
    // Gửi yêu cầu thêm danh mục mới
    axios.post('http://localhost:8080/api/danhmuc/add', newCategory)
      .then(response => {
        setDanhMucs([response.data, ...danhMucs]); // Thêm danh mục mới vào đầu danh sách
        setOpenSnackbar(true); // Hiển thị snackbar thông báo thành công
        handleCloseModal(); // Đóng modal sau khi thêm thành công
      })
      .catch(error => {
        // Kiểm tra lỗi từ backend và hiển thị thông báo phù hợp
        if (error.response && error.response.data) {
          setError(error.response.data); // Hiển thị lỗi trả về từ API
        } else {
          setError('Đã có lỗi xảy ra khi thêm danh mục');
        }
      });
  };
  
  // add thương hiệu 
  const handleAddThuongHieu = () => {
    // Kiểm tra nếu tên thương hiệu trống
    if (!newThuongHieu.tenThuongHieu.trim()) {
      setError("Tên thương hiệu không được để trống");
      return;
    }
  
    // Kiểm tra xem tên thương hiệu có bị trùng không
    const isDuplicate = thuongHieus.some(th => th.tenThuongHieu === newThuongHieu.tenThuongHieu);
    if (isDuplicate) {
      setError("Tên thương hiệu đã tồn tại");
      return;
    }
  
    // Gửi yêu cầu thêm thương hiệu mới
    axios.post("http://localhost:8080/api/thuonghieu/add", newThuongHieu)
      .then(response => {
        // Cập nhật danh sách thương hiệu sau khi thêm mới
        setThuongHieus([response.data, ...thuongHieus]);
        
        // Hiển thị snackbar thông báo thành công
        setOpenSnackbar(true);
        
        // Đóng modal sau khi thêm thành công
        handleCloseModal();
      })
      .catch(error => {
        // Kiểm tra lỗi từ API và hiển thị thông báo lỗi chính xác
        if (error.response && error.response.data) {
          setError(error.response.data);  // Lấy lỗi từ backend
        } else {
          setError("Đã có lỗi xảy ra khi thêm thương hiệu");
        }
      });
  };
  
  /// add phong cách
  const handleAddPhongCach = () => {
    // Kiểm tra nếu tên phong cách trống
    if (!newPhongCach.tenPhongCach.trim()) {
      setError("Tên phong cách không được để trống");
      return;
    }
  
    // Kiểm tra xem tên phong cách có bị trùng không
    const isDuplicate = phongCachs.some(pc => pc.tenPhongCach === newPhongCach.tenPhongCach);
    if (isDuplicate) {
      setError("Tên phong cách đã tồn tại");
      return;
    }
  
    // Gửi yêu cầu thêm phong cách mới
    axios.post("http://localhost:8080/api/phongcach/add", newPhongCach)
      .then(response => {
        // Cập nhật danh sách phong cách sau khi thêm mới
        setPhongCachs([response.data, ...phongCachs]);  // Thêm phong cách mới vào đầu danh sách
  
        // Hiển thị snackbar thông báo thành công
        setOpenSnackbar(true);
  
        // Đóng modal sau khi thêm thành công
        handleCloseModal();
      })
      .catch(error => {
        // Kiểm tra lỗi từ API và hiển thị thông báo lỗi chính xác
        if (error.response && error.response.data) {
          setError(error.response.data);  // Lấy lỗi từ backend
        } else {
          setError("Đã có lỗi xảy ra khi thêm phong cách");
        }
      });
  };
  /// add chất liệu 
  const handleAddChatLieu = () => {
    // Kiểm tra nếu tên chất liệu trống
    if (!newChatLieu.tenChatLieu.trim()) {
      setError("Tên chất liệu không được để trống");
      return;
    }
  
    // Kiểm tra xem tên chất liệu có bị trùng không
    const isDuplicate = chatLieus.some(cl => cl.tenChatLieu === newChatLieu.tenChatLieu);
    if (isDuplicate) {
      setError("Tên chất liệu đã tồn tại");
      return;
    }
  
    // Gửi yêu cầu thêm chất liệu mới
    axios.post("http://localhost:8080/api/chatlieu/add", newChatLieu)
      .then(response => {
        // Cập nhật danh sách chất liệu sau khi thêm mới
        setChatLieus([response.data, ...chatLieus]);  // Thêm chất liệu mới vào đầu danh sách
        
        // Hiển thị snackbar thông báo thành công
        setOpenSnackbar(true);
        
        // Đóng modal sau khi thêm thành công
        handleCloseModal();
      })
      .catch(error => {
        // Kiểm tra lỗi từ API và hiển thị thông báo lỗi chính xác
        if (error.response && error.response.data) {
          setError(error.response.data);  // Lấy lỗi từ backend
        } else {
          setError("Đã có lỗi xảy ra khi thêm chất liệu");
        }
      });
  };
  // Thêm kiểu dáng
  const handleAddKieuDang = () => {
    // Kiểm tra nếu tên phong cách trống
    if (!newKieuDang.tenKieuDang.trim()) {
      setError("Tên kiểu dáng không được để trống");
      return;
    }
  
    // Kiểm tra xem tên phong cách có bị trùng không
    const isDuplicate = kieuDangs.some(kd => kd.tenKieuDang === newKieuDang.tenKieuDang);
    if (isDuplicate) {
      setError("Tên kiểu dáng đã tồn tại");
      return;
    }
  
    // Gửi yêu cầu thêm phong cách mới
    axios.post("http://localhost:8080/api/kieudang/add", newKieuDang)
      .then(response => {
        // Cập nhật danh sách phong cách sau khi thêm mới
        setKieuDangs([response.data, ...kieuDangs]);  // Thêm phong cách mới vào đầu danh sách
  
        // Hiển thị snackbar thông báo thành công
        setOpenSnackbar(true);
  
        // Đóng modal sau khi thêm thành công
        handleCloseModal();
      })
      .catch(error => {
        // Kiểm tra lỗi từ API và hiển thị thông báo lỗi chính xác
        if (error.response && error.response.data) {
          setError(error.response.data);  // Lấy lỗi từ backend
        } else {
          setError("Đã có lỗi xảy ra khi thêm kiểu dáng");
        }
      });
  };
// add kiểu đai quần 
const handleAddKieuDaiQuan = () => {
  // Kiểm tra nếu tên kiểu đai quần trống
  if (!newKieuDaiQuan.tenKieuDaiQuan.trim()) {
    setError("Tên kiểu đai quần không được để trống");
    return;
  }
  // kiểm tra tên đã tồn tại hay chưa
  const isDuplicate = kieuDaiQuans.some(kdq => kdq.tenKieuDaiQuan === newKieuDaiQuan.tenKieuDaiQuan);
  if (isDuplicate) {
    setError("Tên kiểu đai quần đã tồn tại");
    return;
  }
  // Gửi yêu cầu thêm kiểu đai quần mới
  axios.post("http://localhost:8080/api/kieudaiquan/add", newKieuDaiQuan)
    .then(response => {
      // Cập nhật danh sách kiểu đai quần sau khi thêm mới
      setKieuDaiQuans([response.data, ...kieuDaiQuans]);  // Thêm kiểu đai quần mới vào đầu danh sách

      // Hiển thị snackbar thông báo thành công
      setOpenSnackbar(true);

      // Đóng modal sau khi thêm thành công
      handleCloseModal();
    })
    .catch(error => {
      // Kiểm tra lỗi từ API và hiển thị thông báo lỗi chính xác
      if (error.response && error.response.data) {
        setError(error.response.data);  // Lấy lỗi từ backend
      } else {
        setError("Đã có lỗi xảy ra khi thêm kiểu đai quần");
      }
    });
};
// add xuất xứ
const handleAddXuatXu = () => {
  // Kiểm tra nếu tên xuất xứ trống
  if (!newXuatXu.tenXuatXu.trim()) {
    setError("Tên xuất xứ không được để trống");
    return;
  }

  // Kiểm tra xem tên xuất xứ có bị trùng không
  const isDuplicate = xuatXus.some(xx => xx.tenXuatXu === newXuatXu.tenXuatXu);
  if (isDuplicate) {
    setError("Tên Xuất xứ đã tồn tại");
    return;
  }

  // Gửi yêu cầu thêm xuất xứ mới
  axios.post("http://localhost:8080/api/xuatxu/add", newXuatXu)
    .then(response => {
      // Cập nhật danh sách xuất xứ sau khi thêm mới
      setXuatXus([response.data, ...xuatXus]);  // Thêm xuất xứ mới vào đầu danh sách

      // Hiển thị snackbar thông báo thành công
      setOpenSnackbar(true);

      // Đóng modal sau khi thêm thành công
      handleCloseModal();
    })
    .catch(error => {
      // Kiểm tra lỗi từ API và hiển thị thông báo lỗi chính xác
      if (error.response && error.response.data) {
        setError(error.response.data);  // Lấy lỗi từ backend
      } else {
        setError("Đã có lỗi xảy ra khi thêm xuất xứ");
      }
    });
};
//add sản phẩm chi tiết

  return (
    <div>
      <Typography variant="h4">Thêm Sản Phẩm</Typography>
      <Paper sx={{ padding: 2, mb: 2 }}>
      <Typography variant="h5">Thuộc Tính</Typography>
      <Grid item xs={12} md={3}>
      <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
        <InputLabel>Tên sản phẩm</InputLabel>
        <Controller
          name="tenSanPham"
          control={control}
          defaultValue={selectedProduct}
          render={({ field }) => (
            <Select
              {...field}
              label="Tên Sản Phẩm"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {sanPhamList.map((sp) => (
                <MenuItem key={sp.id} value={sp.id}>
                  {sp.tenSanPham}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
      <IconButton onClick={handleOpenModal} color="primary">
        <AddIcon />
      </IconButton>

      {/* Modal Thêm Sản Phẩm */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Tên Sản Phẩm"
            value={tenSanPham}
            onChange={(e) => setTenSanPham(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Mô Tả"
            value={moTa}
            onChange={(e) => setMoTa(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleAddProduct} color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo thêm sản phẩm thành công */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Sản phẩm đã được thêm thành công!
        </Alert>
      </Snackbar>
    </Grid>
        <Grid container spacing={2}>
          {/* Danh Mục */}    
  <Grid item xs={12} md={3}>
    <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
      <InputLabel>Danh Mục</InputLabel>
      <Select
        value={danhMucs[0]?.id || ''}
        label="Danh Mục"
        onChange={(e) => console.log(e.target.value)}
      >
        {danhMucs.map((dm) => (
          <MenuItem key={dm.id} value={dm.id}>
            {dm.tenDanhMuc}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <IconButton color="primary" onClick={() => handleOpenModal('danhMuc')}>
  <AddIcon sx={{ fontSize: 30 }} />
</IconButton>
{/* Modal Thêm Danh Mục */}
{openModal === 'danhMuc' && (
  <Dialog open={openModal === 'danhMuc'} onClose={handleCloseModal}>
    <DialogTitle>Thêm Danh Mục Mới</DialogTitle>
    <DialogContent>
      <TextField
        fullWidth
        margin="dense"
        label="Tên Danh Mục"
        value={newCategory.tenDanhMuc}
        onChange={(e) => setNewCategory({ ...newCategory, tenDanhMuc: e.target.value })}
        error={!!error}
        helperText={error}
      />
      <TextField
        fullWidth
        margin="dense"
        label="Mô Tả"
        value={newCategory.moTa}
        onChange={(e) => setNewCategory({ ...newCategory, moTa: e.target.value })}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} color="secondary">Hủy</Button>
      <Button onClick={handleAddDanhMuc} color="primary">Thêm</Button>
    </DialogActions>
  </Dialog>
)}
  {/* Snackbar thông báo thêm danh mục thành công */}
  <Snackbar
    open={openSnackbar}
    autoHideDuration={3000}
    onClose={() => setOpenSnackbar(false)}
    message="Thêm danh mục thành công!"
  />
  </Grid>
          {/* Thương Hiệu */}
          <Grid item xs={12} md={3}>
      <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
        <InputLabel>Thương Hiệu</InputLabel>
        <Select
          label="Thương Hiệu"
          value={thuongHieus[0]?.id || ""}
          onChange={(e) => console.log(e.target.value)} // Bạn có thể xử lý thêm nếu cần
        >
          {thuongHieus.map((th) => (
            <MenuItem key={th.id} value={th.id}>
              {th.tenThuongHieu}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton color="primary" onClick={() => handleOpenModal('thuongHieu')}>
  <AddIcon sx={{ fontSize: 30 }} />
</IconButton>

      {/* Modal thêm thương hiệu */}
      {openModal === 'thuongHieu' && (
  <Dialog open={openModal === 'thuongHieu'} onClose={handleCloseModal}>
    <DialogTitle>Thêm Thương Hiệu Mới</DialogTitle>
    <DialogContent>
      <TextField
        label="Tên Thương Hiệu"
        fullWidth
        value={newThuongHieu.tenThuongHieu}
        onChange={(e) => setNewThuongHieu({ ...newThuongHieu, tenThuongHieu: e.target.value })}
        error={!!error}
        helperText={error}
      />
      <TextField
        label="Mô Tả"
        fullWidth
        multiline
        value={newThuongHieu.moTa}
        onChange={(e) => setNewThuongHieu({ ...newThuongHieu, moTa: e.target.value })}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} color="secondary">Hủy</Button>
      <Button onClick={handleAddThuongHieu} color="primary">Thêm</Button>
    </DialogActions>
  </Dialog>
)}

      {/* Snackbar thông báo thêm thương hiệu thành công */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Thêm thương hiệu thành công!"
      />
    </Grid>
    {/* phong cách */}
    <Grid item xs={12} md={3}>
      <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
        <InputLabel>Phong Cách</InputLabel>
        <Select
          label="Phong Cách"
          value={phongCachs[0]?.id || ""}
          onChange={(e) => console.log(e.target.value)} // Bạn có thể xử lý thêm nếu cần
        >
          {phongCachs.map((pc) => (
            <MenuItem key={pc.id} value={pc.id}>
              {pc.tenPhongCach}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton color="primary" onClick={() => handleOpenModal('phongCach')}>
  <AddIcon sx={{ fontSize: 30 }} />
</IconButton>

      {/* Modal thêm phong cách */}
      {openModal === 'phongCach' && (
  <Dialog open={openModal === 'phongCach'} onClose={handleCloseModal}>
    <DialogTitle>Thêm Phong Cách Mới</DialogTitle>
    <DialogContent>
      <TextField
        label="Tên Phong Cách"
        fullWidth
        value={newPhongCach.tenPhongCach}
        onChange={(e) => setNewPhongCach({ ...newPhongCach, tenPhongCach: e.target.value })}
        error={!!error}
        helperText={error}
      />
      <TextField
        label="Mô Tả"
        fullWidth
        multiline
        value={newPhongCach.moTa}
        onChange={(e) => setNewPhongCach({ ...newPhongCach, moTa: e.target.value })}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} color="secondary">Hủy</Button>
      <Button onClick={handleAddPhongCach} color="primary">Thêm</Button>
    </DialogActions>
  </Dialog>
)}
      {/* Snackbar thông báo thêm phong cách thành công */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Thêm phong cách thành công!"
      />
    </Grid>
          {/* Chất liệu */}
          <Grid item xs={12} md={3}>
      <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
        <InputLabel>Chất Liệu</InputLabel>
        <Select
          label="Chất Liệu"
          value={chatLieus[0]?.id || ""}
          onChange={(e) => console.log(e.target.value)} // Bạn có thể xử lý thêm nếu cần
        >
          {chatLieus.map((cl) => (
            <MenuItem key={cl.id} value={cl.id}>
              {cl.tenChatLieu}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton color="primary" onClick={() => handleOpenModal('chatLieu')}>
  <AddIcon sx={{ fontSize: 30 }} />
</IconButton>


      {/* Modal thêm chất liệu */}
      {openModal === 'chatLieu' && (
  <Dialog open={openModal === 'chatLieu'} onClose={handleCloseModal}>
    <DialogTitle>Thêm Chất Liệu Mới</DialogTitle>
    <DialogContent>
      <TextField label="Tên Chất Liệu" fullWidth value={newChatLieu.tenChatLieu} onChange={(e) => setNewChatLieu({ ...newChatLieu, tenChatLieu: e.target.value })} error={!!error} helperText={error} />
      <TextField label="Mô Tả" fullWidth multiline value={newChatLieu.moTa} onChange={(e) => setNewChatLieu({ ...newChatLieu, moTa: e.target.value })} />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} color="secondary">Hủy</Button>
      <Button onClick={handleAddChatLieu} color="primary">Thêm</Button>
    </DialogActions>
  </Dialog>
)}


      {/* Snackbar thông báo thêm chất liệu thành công */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Thêm chất liệu thành công!"
      />
    </Grid>
          {/* Hàng 2: 3 cột */}
          {/* Kiểu dáng */}
          <Grid item xs={12} md={3}>
      <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
        <InputLabel>Kiểu Dáng</InputLabel>
        <Select
          label="Kiểu Dáng"
          value={kieuDangs[0]?.id || ""}
          onChange={(e) => console.log(e.target.value)} // Bạn có thể xử lý thêm nếu cần
        >
          {kieuDangs.map((kd) => (
            <MenuItem key={kd.id} value={kd.id}>
              {kd.tenKieuDang}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton color="primary" onClick={() => handleOpenModal('kieuDang')}>
  <AddIcon sx={{ fontSize: 30 }} />
</IconButton>

      {/* Modal thêm phong cách */}
      {openModal === 'kieuDang' && (
  <Dialog open={openModal === 'kieuDang'} onClose={handleCloseModal}>
    <DialogTitle>Thêm Kiểu Dáng Mới</DialogTitle>
    <DialogContent>
      <TextField
        label="Tên Kiểu Dáng"
        fullWidth
        value={newKieuDang.tenKieuDang}
        onChange={(e) => setNewKieuDang({ ...newKieuDang, tenKieuDang: e.target.value })}
        error={!!error}
        helperText={error}
      />
      <TextField
        label="Mô Tả"
        fullWidth
        multiline
        value={newKieuDang.moTa}
        onChange={(e) => setNewKieuDang({ ...newKieuDang, moTa: e.target.value })}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} color="secondary">Hủy</Button>
      <Button onClick={handleAddKieuDang} color="primary">Thêm</Button>
    </DialogActions>
  </Dialog>
)}
      {/* Snackbar thông báo thêm phong cách thành công */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Thêm Kiểu dáng thành công!"
      />
    </Grid>
          {/* Kiểu đai quần */}
          <Grid item xs={12} md={3}>
      <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
        <InputLabel>Kiểu Đai Quần</InputLabel>
        <Select
          label="Kiểu Đai Quần"
          value={kieuDaiQuans[0]?.id || ""}
          onChange={(e) => console.log(e.target.value)} // Bạn có thể xử lý thêm nếu cần
        >
          {kieuDaiQuans.map((kdq) => (
            <MenuItem key={kdq.id} value={kdq.id}>
              {kdq.tenKieuDaiQuan}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton color="primary" onClick={() => handleOpenModal('kieuDaiQuan')}>
  <AddIcon sx={{ fontSize: 30 }} />
</IconButton>

      {/* Modal thêm phong cách */}
      {openModal === 'kieuDaiQuan' && (
  <Dialog open={openModal === 'kieuDaiQuan'} onClose={handleCloseModal}>
    <DialogTitle>Thêm Kiểu Đai Quần</DialogTitle>
    <DialogContent>
      <TextField
        label="Kiểu Đai Quần"
        fullWidth
        value={newKieuDaiQuan.tenKieuDaiQuan}
        onChange={(e) => setNewKieuDaiQuan({ ...newKieuDaiQuan, tenKieuDaiQuan: e.target.value })}
        error={!!error}
        helperText={error}
      />
      <TextField
        label="Mô Tả"
        fullWidth
        multiline
        value={newKieuDaiQuan.moTa}
        onChange={(e) => setNewKieuDaiQuan({ ...newKieuDaiQuan, moTa: e.target.value })}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} color="secondary">Hủy</Button>
      <Button onClick={handleAddKieuDaiQuan} color="primary">Thêm</Button>
    </DialogActions>
  </Dialog>
)}
      {/* Snackbar thông báo thêm phong cách thành công */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Thêm kiểu đai quần thành công!"
      />
    </Grid>
          {/* Xuất xứ */}
          <Grid item xs={12} md={3}>
          <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
  <InputLabel>Xuất Xứ</InputLabel>
  <Select
    label="Xuất Xứ"
    value={xuatXus[0]?.id || ""}
    onChange={(e) => console.log(e.target.value)} // Bạn có thể xử lý thêm nếu cần
  >
    {xuatXus.map((xx) => (
      <MenuItem key={xx.id} value={xx.id}>
        {xx.tenXuatXu}
      </MenuItem>
    ))}
  </Select>
</FormControl>

      <IconButton color="primary" onClick={() => handleOpenModal('xuatXu')}>
  <AddIcon sx={{ fontSize: 30 }} />
</IconButton>

      {/* Modal thêm phong cách */}
      {openModal === 'xuatXu' && (
  <Dialog open={openModal === 'xuatXu'} onClose={handleCloseModal}>
    <DialogTitle>Thêm Xuất Xứ Mới</DialogTitle>
    <DialogContent>
      <TextField
        label="Tên Xuất Xứ"
        fullWidth
        value={newXuatXu.tenXuatXu}
        onChange={(e) => setNewXuatXu({ ...newXuatXu, tenXuatXu: e.target.value })}
        error={!!error}
        helperText={error}
      />
      <TextField
        label="Mô Tả"
        fullWidth
        multiline
        value={newXuatXu.moTa}
        onChange={(e) => setNewXuatXu({ ...newXuatXu, moTa: e.target.value })}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} color="secondary">Hủy</Button>
      <Button onClick={handleAddXuatXu} color="primary">Thêm</Button>
    </DialogActions>
  </Dialog>
)}
      {/* Snackbar thông báo thêm phong cách thành công */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Thêm Xuất Xứ thành công!"
      />
    </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="moTa"
              control={control}
              defaultValue="" // Thiết lập giá trị mặc định là chuỗi trống
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mô Tả"
                  fullWidth
                  margin="dense"
                  multiline
                  rows={4}
                  sx={{ width: "60%" }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>
      {/* chọn màu và size */}
      <Paper sx={{ padding: 2, mb: 2 }}>
        <Typography variant="h5">Màu sắc & Kích Cỡ</Typography>
        <FormControl fullWidth margin="normal" sx={{ width: "30%" }}>
          <InputLabel>Màu sắc</InputLabel>
          <Select
            multiple
            value={selectedColors}
            onChange={(e) => setSelectedColors(e.target.value)}
            renderValue={(selected) =>
              selected
                .map((id) => {
                  const color = colors.find((c) => c.id === id);
                  return color ? color.id : "";
                })
                .join(", ")
            }
          >
            {colors.map((color) => (
              <MenuItem key={color.id} value={color.id}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: color.code,
                      marginRight: 10,
                    }}
                  ></div>
                  {color.tenMauSac}
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" sx={{ width: "30%" }}>
          <InputLabel>Kích cỡ</InputLabel>
          <Select
            multiple
            value={selectedSizes}
            onChange={(e) => setSelectedSizes(e.target.value)}
            renderValue={(selected) =>
              selected
                .map((id) => {
                  const size = sizes.find((s) => s.id === id);
                  return size ? size.id : "";
                })
                .join(", ")
            }
          >
            {sizes.map((size) => (
              <MenuItem key={size.id} value={size.id}>
                {size.tenSize}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* bảng hiển thị danh sách */}
        <div>
          {/* <Typography variant="h4">Thêm Sản Phẩm</Typography> */}
          <form onSubmit={handleSubmit(handleSaveProduct)}>
            {/* Existing Fields for Tên Sản Phẩm, Danh Mục, Thương Hiệu, ... */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã Sản Phẩm</TableCell>
                  <TableCell>Tên Sản Phẩm</TableCell>
                  <TableCell>Màu Sắc</TableCell>
                  <TableCell>Kích Cỡ</TableCell>
                  <TableCell>Số Lượng</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Xóa</TableCell>
                  <TableCell>Ảnh</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sanPhamChiTietList.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell></TableCell>
                    <TableCell>{item.tenSanPham}</TableCell>
                    <TableCell>{item.mauSac}</TableCell>
                    <TableCell>{item.kichThuoc}</TableCell>
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

            <Button onClick={onSubmit} variant="contained" color="primary">
              Lưu
            </Button>
          </form>
        </div>
      </form>
    </div>
  );
};

export default AddSanPham;
