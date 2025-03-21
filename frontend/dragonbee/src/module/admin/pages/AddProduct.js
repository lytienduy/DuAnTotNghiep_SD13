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
  Checkbox,
  FormControl,
  Snackbar,
  Alert,
  Modal,
  TableContainer,
  InputLabel,
  IconButton,
  Paper,
  Typography,
  Grid,
  Box,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Add from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import { Cloudinary } from "cloudinary-core";
import { SketchPicker } from "react-color"; // Thêm thư viện chọn màu

/* global cloudinary */

const AddSanPham = ({ sanPhamChiTietId }) => {
  const { control, handleSubmit, getValues } = useForm();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [cloudinaryImages, setCloudinaryImages] = useState([]); // Dùng toán tử optional chaining để tránh lỗi khi result là undefined
  const [openModalAnh, setOpenModalAnh] = useState(false);
  const [cloudImages, setCloudImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]); // Lưu trữ ảnh đã tải lên
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false); // State để kiểm tra "Chọn tất cả"
 
  // lưu sản phẩm
  const [openColorModal, setOpenColorModal] = useState(false);
  const [openAddColorModal, setOpenAddColorModal] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false); // Open Color Picker
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState({
    tenMauSac: "",
    maMau: "",
  });
  const [openSizeModal, setOpenSizeModal] = useState(false); // Modal chọn size
  const [openAddSizeModal, setOpenAddSizeModal] = useState(false); // Modal thêm size
  const [sizes, setSizes] = useState([]); // Danh sách các size có sẵn
  const [newSize, setNewSize] = useState({ tenSize: "", moTa: "" }); // Dữ liệu cho size mới
  const [selectedSizes, setSelectedSizes] = useState([]); // Các size đã chọn
  const [selectedMauSacs, setSelectedMauSacs] = useState([]); // Màu sắc đã chọn
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
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0); // Khởi tạo với giá trị số hợp lệ
  const [price, setPrice] = useState(0);
  // Khởi tạo với giá trị số hợp lệ
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [commonQuantity, setCommonQuantity] = useState("");
  const [commonPrice, setCommonPrice] = useState("");
  const [productDetails, setProductDetails] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [tenSanPham, setTenSanPham] = useState("");
  const [moTa, setMoTa] = useState("");
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState({
    tenDanhMuc: "",
    moTa: "",
  });
  const [newThuongHieu, setNewThuongHieu] = useState({
    tenThuongHieu: "",
    moTa: "",
  });
  const [newPhongCach, setNewPhongCach] = useState({
    tenPhongCach: "",
    moTa: "",
  });
  const [newChatLieu, setNewChatLieu] = useState({ tenChatLieu: "", moTa: "" });
  const [newKieuDang, setNewKieuDang] = useState({ tenKieuDang: "", moTa: "" });
  const [newKieuDaiQuan, setNewKieuDaiQuan] = useState({
    tenKieuDaiQuan: "",
    moTa: "",
  });
  const [newXuatXu, setNewXuatXu] = useState({ tenXuatXu: "", moTa: "" });
  const [openModal, setOpenModal] = useState(null); // Giá trị mặc định là null
  const [openSnackbarXoa, setOpenSnackbarXoa] = useState(false); // Điều khiển Snackbar
  const [snackbarMessageXoa, setSnackbarMessageXoa] = useState(""); // Thông báo hiển thị trong Snackbar
  const [openSnackbarDM, setOpenSnackbarDM] = useState(false); // Điều khiển Snackbar
  const [snackbarMessageDM, setSnackbarMessageDM] = useState(""); // Thông báo hiển thị trong Snackbar
  const [openSnackbarTH, setOpenSnackbarTH] = useState(false); // Điều khiển Snackbar
  const [snackbarMessageTH, setSnackbarMessageTH] = useState(""); // Thông báo hiển thị trong Snackbar
  const [openSnackbarPC, setOpenSnackbarPC] = useState(false); // Điều khiển Snackbar
  const [snackbarMessagePC, setSnackbarMessagePC] = useState(""); // Thông báo hiển thị trong Snackbar
  const [openSnackbarCL, setOpenSnackbarCL] = useState(false); // Điều khiển Snackbar
  const [snackbarMessageCL, setSnackbarMessageCL] = useState(""); // Thông báo hiển thị trong Snackbar
  const [openSnackbarKD, setOpenSnackbarKD] = useState(false); // Điều khiển Snackbar
  const [snackbarMessageKD, setSnackbarMessageKD] = useState(""); // Thông báo hiển thị trong Snackbar
  const [openSnackbarKDQ, setOpenSnackbarKDQ] = useState(false); // Điều khiển Snackbar
  const [snackbarMessageKDQ, setSnackbarMessageKDQ] = useState(""); // Thông báo hiển thị trong Snackbar
  const [openSnackbarXX, setOpenSnackbarXX] = useState(false); // Điều khiển Snackbar
  const [snackbarMessageXX, setSnackbarMessageXX] = useState(""); // Thông báo hiển thị trong Snackbar

  // Khi bạn muốn mở một modal, hãy gọi handleOpenModal với loại modal cụ thể
  const handleOpenModal = (modalType) => {
    setOpenModal(modalType); // Mở modal theo loại thuộc tính
  };

  // Khi đóng modal, đảm bảo đặt openModal về null
  const handleCloseModal = () => {
    setOpenModal(null);
    setTenSanPham("");
    setMoTa("");
    setNewCategory({ tenDanhMuc: "", moTa: "" }); // Reset lại form
    setNewThuongHieu({ tenThuongHieu: "", moTa: "" });
    setNewChatLieu({ tenChatLieu: "", moTa: "" });
    setNewPhongCach({ tenPhongCach: "", moTa: "" });
    setNewKieuDaiQuan({ tenKieuDaiQuan: "", moTa: "" });
    setNewKieuDang({ tenKieuDang: "", moTa: "" });
    setNewXuatXu({ tenXuatXu: "", moTa: "" });
    setError(""); // Reset lỗi
  };
  const [selectedProduct, setSelectedProduct] = useState(
    sanPhamList.length > 0 ? sanPhamList[0].id : ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    danhMucs.length > 0 ? danhMucs[0].id : ""
  );
  const [selectedThuongHieu, setSelectedThuongHieu] = useState(
    thuongHieus.length > 0 ? thuongHieus[0].id : ""
  ); // Lưu thương hiệu đã chọn
  const [selectedPhongCach, setSelectedPhongCach] = useState(
    phongCachs.length > 0 ? phongCachs[0].id : ""
  );
  const [selectedChatLieu, setSelectedChatLieu] = useState(
    chatLieus.length > 0 ? chatLieus[0].id : ""
  );
  const [selectedKieuDang, setSelectedKieuDang] = useState(
    kieuDangs.length > 0 ? kieuDangs[0].id : ""
  );
  const [selectedKieuDaiQuan, setSelectedKieuDaiQuan] = useState(
    kieuDaiQuans.length > 0 ? kieuDaiQuans[0].id : ""
  );
  const [selectedXuatXus, setSelectedXuatXus] = useState(
    xuatXus.length > 0 ? xuatXus[0].id : ""
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // đổ danh mục
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/danhmuc/danh-muc/hoat-dong")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const sortedDanhMucs = res.data.sort((a, b) => b.id - a.id);
          setDanhMucs(sortedDanhMucs); // Cập nhật lại danh sách danh mục từ API
          setSelectedCategory(sortedDanhMucs[0]?.id || ""); // Lấy danh mục mới nhất (hoặc default là không có)
        }
      })
      .catch((error) => {
        console.error("Lỗi API Danh Mục:", error);
      });
  }, []); // Chạy một lần khi component mount

  // đổ thương hiệu
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/thuonghieu/thuong-hieu/hoat-dong")
      .then((res) => {
        console.log("Thương Hiệu API Response:", res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const sortedThuongHieus = res.data.sort((a, b) => b.id - a.id); // Sắp xếp theo ID giảm dần
          setThuongHieus(sortedThuongHieus);
          setSelectedThuongHieu(sortedThuongHieus[0].id); // Lưu ID của thương hiệu mới nhất
        }
      })
      .catch((error) =>
        console.error(
          "Lỗi API Thương Hiệu:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);

  // Đổ Phong Cách
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/phongcach/phong-cach/hoat-dong")
      .then((res) => {
        console.log("Phong Cách API Response:", res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const sortedPhongCachs = res.data.sort((a, b) => b.id - a.id); // Sắp xếp theo ID giảm dần
          setPhongCachs(sortedPhongCachs);
          setSelectedPhongCach(sortedPhongCachs[0].id); // Lưu ID của phong cách mới nhất
        }
      })
      .catch((error) =>
        console.error(
          "Lỗi API Phong Cách:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);

  // Đổ Chất Liệu

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/chatlieu/chat-lieu/hoat-dong")
      .then((res) => {
        console.log("Chất Liệu API Response:", res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const sortedChatLieus = res.data.sort((a, b) => b.id - a.id); // Sắp xếp theo ID giảm dần
          setChatLieus(sortedChatLieus);
          setSelectedChatLieu(sortedChatLieus[0].id); // Lưu ID của chất liệu mới nhất
        }
      })
      .catch((error) =>
        console.error(
          "Lỗi API Chất Liệu:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);

  // Đổ Kiểu Dáng
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/kieudang/kieu-dang/hoat-dong")
      .then((res) => {
        console.log("Kiểu dáng API Response:", res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const sortedkieuDangs = res.data.sort((a, b) => b.id - a.id); // Sắp xếp theo ID giảm dần
          setKieuDangs(sortedkieuDangs);
          setSelectedKieuDang(sortedkieuDangs[0].id); // Lưu ID của xuất xứ mới nhất
        }
      })
      .catch((error) =>
        console.error(
          "Lỗi API kiểu dáng:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);

  // Đổ Kiểu Đai Quần
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/kieudaiquan/kieu-dai-quan/hoat-dong")
      .then((res) => {
        console.log("Kiểu Đai Quần API Response:", res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const sortedKieuDaiQuans = res.data.sort((a, b) => b.id - a.id); // Sắp xếp theo ID giảm dần
          setKieuDaiQuans(sortedKieuDaiQuans);
          setSelectedKieuDaiQuan(sortedKieuDaiQuans[0].id); // Lưu ID của kiểu đai quần mới nhất
        }
      })
      .catch((error) =>
        console.error(
          "Lỗi API Kiểu Đai Quần:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);

  // Đổ Xuất Xứ
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/xuatxu/xuat-xu/hoat-dong")
      .then((res) => {
        console.log("Xuất Xứ API Response:", res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const sortedXuatXus = res.data.sort((a, b) => b.id - a.id); // Sắp xếp theo ID giảm dần
          setXuatXus(sortedXuatXus);
          setSelectedXuatXus(sortedXuatXus[0].id); // Lưu ID của xuất xứ mới nhất
        }
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
      .get("http://localhost:8080/api/mausac/mau-sac/hoat-dong")
      .then((res) => {
        console.log("Dữ liệu màu sắc từ API:", res.data);
        setColors(res.data);
      })
      .catch((error) => console.error(error));
  }, []);
  // size
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/size/hoat-dong")
      .then((res) => {
        console.log("Dữ liệu kích cỡ từ API:", res.data);
        setSizes(res.data);
      })
      .catch((error) => console.error(error));
  }, []);
  // Fetch danh sách sản phẩm từ server
  useEffect(() => {
    const fetchSanPhamList = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/sanpham/all"
        );

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
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value); // Cập nhật mô tả khi nhập
  };

  const handleAddToTable = () => {
    if (
      !selectedProduct ||
      selectedMauSacs.length === 0 ||
      selectedSizes.length === 0
    ) {
      alert("Vui lòng chọn đầy đủ sản phẩm, màu sắc và kích thước.");
      return;
    }

    const selectedProductName = sanPhamList.find(
      (sp) => sp.id === selectedProduct
    )?.tenSanPham;
    if (!selectedProductName) {
      alert("Sản phẩm không hợp lệ.");
      return;
    }

    const newDetails = [];
    let tempId =
      productDetails.length > 0
        ? Math.max(...productDetails.map((p) => p.id), 0) + 1
        : 1; // Tạo ID tạm

    selectedMauSacs.forEach((color) => {
      selectedSizes.forEach((size) => {
        if (!color || !size) {
          alert("Màu sắc hoặc kích thước không hợp lệ.");
          return;
        }

        newDetails.push({
          id: tempId++, // Gán ID tạm
          productCode: `SPCT-${tempId}`,
          productName: `${selectedProductName} - ${color.tenMauSac} - ${size.tenSize}`,
          tenMauSac: color.tenMauSac,
          tenSize: size.tenSize,
          quantity: 0,
          price: 0,
          images: [],
        });
      });
    });

    setProductDetails((prevDetails) => [...prevDetails, ...newDetails]);
  };

  // add sản phẩm chi tiết
  const handleSave = async () => {
    console.log("selectedImages before saving:", selectedImages); // Debug selectedImages

    if (!selectedProduct) {
      alert("Vui lòng chọn sản phẩm.");
      return;
    }

    // Kiểm tra xem có ảnh hợp lệ trong selectedImages không
    if (selectedImages.length === 0) {
      alert("Vui lòng chọn ít nhất một ảnh.");
      return;
    }

    const validImages = selectedImages.filter((image) => image.secure_url);
    console.log("validImages:", validImages); // Debug validImages

    if (validImages.length === 0) {
      alert("Vui lòng chọn ít nhất một ảnh hợp lệ.");
      return;
    }

    // Tạo danh sách sản phẩm chi tiết để gửi lên backend
    const requestDataList = productDetails.map((detail) => ({
      sanPhamId: selectedProduct,
      soLuong: detail.quantity || 0,
      gia: detail.price || 0,
      moTa: detail.moTa || "Không có mô tả",
      trangThai: "Hoạt động",
      danhMucId: selectedCategory,
      thuongHieuId: selectedThuongHieu,
      phongCachId: selectedPhongCach,
      chatLieuId: selectedChatLieu,
      mauSacId:
        colors.find((c) => c.tenMauSac === detail.tenMauSac)?.id || null,
      sizeId: sizes.find((s) => s.tenSize === detail.tenSize)?.id || null,
      kieuDangId: selectedKieuDang,
      kieuDaiQuanId: selectedKieuDaiQuan,
      xuatXuId: selectedXuatXus,
      anhUrls: validImages.map((image) => image.secure_url),
    }));

    try {
      const response = await axios.post(
        "http://localhost:8080/api/san-pham-chi-tiet/add/chi-tiet",
        requestDataList,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Sản phẩm chi tiết đã được lưu", response.data);

        setSnackMessage("Thêm sản phẩm thành công!");
        setSnackOpen(true);
        navigate("/admin/sanpham", { replace: true });
      }
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
      alert("Có lỗi xảy ra khi lưu sản phẩm.");
    }
  };
  // Khi mở modal, gọi API để lấy ảnh từ Cloudinary
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "upload_QL_AnhDATN");
      formData.append("folder", "anh");

      fetch("https://api.cloudinary.com/v1_1/dy095esr7/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Cập nhật danh sách ảnh đã tải lên
          setUploadedImages((prev) => [...prev, data]);
          setCloudinaryImages((prev) => [...prev, data]); // Kết hợp ảnh mới vào danh sách hiện tại
        })
        .catch((error) => {
          console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
        });
    }
  };
  const handleOpenModalAnh = async (id) => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/anh-san-pham/cloudinary-images"
      );

      if (!response.ok) {
        throw new Error("Không thể lấy ảnh từ backend");
      }

      const data = await response.json();
      console.log("Dữ liệu ảnh từ API:", data); // Kiểm tra dữ liệu ảnh

      if (data && Array.isArray(data.resources)) {
        setCloudinaryImages(data.resources); // Cập nhật ảnh từ API
      }

      setSelectedProductId(id);
      setOpenModalAnh(true); // Mở modal sau khi tải ảnh
    } catch (error) {
      console.error("Lỗi khi lấy ảnh từ backend", error);
      alert("Có lỗi khi tải ảnh, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModalAnh = () => {
    setOpenModalAnh(false); // Đóng modal
  };

  const handleAddProductImages = (selectedImages) => {
    console.log("Danh sách ảnh đã chọn:", selectedImages); // Kiểm tra xem ảnh có được chọn hay không

    if (selectedImages.length === 0) {
      alert("Vui lòng chọn ít nhất một ảnh.");
      return;
    }

    const imageUrls = selectedImages.map((image) => image.secure_url);
    console.log("Ảnh đã chọn:", imageUrls); // Kiểm tra ảnh đã chọn

    // Cập nhật danh sách sản phẩm chi tiết với các ảnh đã chọn
    const updatedProductDetails = productDetails.map((detail) => {
      if (detail.id === selectedProductId) {
        return { ...detail, images: imageUrls }; // Gán các ảnh cho sản phẩm chi tiết
      }
      return detail;
    });

    setProductDetails(updatedProductDetails); // Cập nhật lại danh sách sản phẩm chi tiết

    setOpenModalAnh(false); // Đóng modal sau khi lưu ảnh
  };
// Hàm chọn ảnh
  const handleSelectImage = (e, image) => {
    const checked = e.target.checked;

    if (checked) {
      console.log("Thêm ảnh:", image); // Debug: Kiểm tra ảnh được thêm vào
      setSelectedImages((prevImages) => [...prevImages, image]); // Đảm bảo cập nhật đúng selectedImages
    } else {
      console.log("Xóa ảnh:", image); // Debug: Kiểm tra ảnh bị xóa
      setSelectedImages(
        (prevImages) =>
          prevImages.filter((img) => img.public_id !== image.public_id) // Loại bỏ ảnh khỏi danh sách đã chọn
      );
    }
  };
  // xóa spct
  const removeSanPhamChiTiet = (index) => {
    const newList = productDetails.filter((_, i) => i !== index); // Loại bỏ sản phẩm tại index
    setProductDetails(newList); // Cập nhật lại state

    // Hiển thị Snackbar khi xóa sản phẩm thành công
    setSnackbarMessageXoa("Sản phẩm đã được xóa thành công!");
    setOpenSnackbarXoa(true); // Mở Snackbar
  };
  // Hàm đóng Snackbar xóa
  const handleCloseSnackbarXoa = () => {
    setOpenSnackbarXoa(false);
  };
  // Hàm đóng Snackbar Dm
  const handleCloseSnackbarDM = () => {
    setOpenSnackbarDM(false);
  };
  // Hàm đóng Snackbar TH
  const handleCloseSnackbarTH = () => {
    setOpenSnackbarTH(false);
  };
  // Hàm đóng Snackbar PC
  const handleCloseSnackbarPC = () => {
    setOpenSnackbarPC(false);
  };
  // Hàm đóng Snackbar CL
  const handleCloseSnackbarCL = () => {
    setOpenSnackbarCL(false);
  };
  // Hàm đóng Snackbar KD
  const handleCloseSnackbarKD = () => {
    setOpenSnackbarKD(false);
  };
  // Hàm đóng Snackbar KDQ
  const handleCloseSnackbarKDQ = () => {
    setOpenSnackbarKDQ(false);
  };
  // Hàm đóng Snackbar XX
  const handleCloseSnackbarXX = () => {
    setOpenSnackbarXX(false);
  };

  // add sản phẩm
  const handleAddProduct = () => {
    if (!tenSanPham.trim()) {
        setError("Tên sản phẩm không được để trống!");
        return;
    }

    axios.post("http://localhost:8080/api/sanpham/add/sanpham", {
        tenSanPham: tenSanPham,
        moTa: moTa,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((res) => {
        const newProduct = res.data; // Nhận dữ liệu sản phẩm vừa thêm từ backend
        setSanPhamList((prevList) => [newProduct, ...prevList]);
        setSelectedProduct(newProduct.id);
        handleCloseModal();
        setOpenSnackbar(true);
    })
    .catch((err) => {
        console.error(err); // Log lỗi chi tiết
        if (err.response && err.response.data) {
            setError(err.response.data); // Hiển thị lỗi từ backend
        } else {
            setError("Lỗi khi thêm sản phẩm!");
        }
    });
};
  // add nhanh danh mục
  const handleAddDanhMuc = () => {
    if (!newCategory.tenDanhMuc.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }

    const isDuplicate = danhMucs.some(
      (dm) => dm.tenDanhMuc === newCategory.tenDanhMuc
    );
    if (isDuplicate) {
      setError("Tên danh mục đã tồn tại");
      return;
    }

    axios
      .post("http://localhost:8080/api/danhmuc/add", newCategory)
      .then(() => {
        // Gọi lại API để lấy danh sách danh mục mới nhất
        axios
          .get("http://localhost:8080/api/danhmuc/danh-muc/hoat-dong")
          .then((res) => {
            if (Array.isArray(res.data) && res.data.length > 0) {
              const sortedDanhMucs = res.data.sort((a, b) => b.id - a.id); // Sắp xếp danh mục theo ID giảm dần
              setDanhMucs(sortedDanhMucs); // Cập nhật lại danh sách danh mục từ API
              setSelectedCategory(sortedDanhMucs[0]?.id || ""); // Lấy danh mục mới nhất (hoặc default là không có)
            }
          })
          .catch((error) => {
            console.error("Lỗi khi gọi lại API danh mục:", error);
          });

        // Hiển thị thông báo thành công
        setSnackbarMessageDM("Thêm danh mục thành công");
        setOpenSnackbarDM(true);

        handleCloseModal(); // Đóng modal
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setError(error.response.data);
        } else {
          setError("Đã có lỗi xảy ra khi thêm danh mục");
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
    const isDuplicate = thuongHieus.some(
      (th) => th.tenThuongHieu === newThuongHieu.tenThuongHieu
    );
    if (isDuplicate) {
      setError("Tên thương hiệu đã tồn tại");
      return;
    }

    // Gửi yêu cầu thêm thương hiệu mới
    axios
      .post("http://localhost:8080/api/thuonghieu/add", newThuongHieu)
      .then(() => {
        // Gọi lại API để lấy danh sách thương hiệu mới nhất
        axios
          .get("http://localhost:8080/api/thuonghieu/thuong-hieu/hoat-dong")
          .then((res) => {
            const sortedThuongHieus = res.data.sort((a, b) => b.id - a.id);
            setThuongHieus(sortedThuongHieus);
            setSelectedThuongHieu(sortedThuongHieus[0]?.id || "");
          })
          .catch((error) =>
            console.error("Lỗi khi gọi lại API thương hiệu:", error)
          );

        // Hiển thị snackbar thông báo thành công
        setSnackbarMessageTH("Thêm thương hiệu thành công");
        setOpenSnackbarTH(true);

        // Đóng modal sau khi thêm thành công
        handleCloseModal();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setError(error.response.data);
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
    const isDuplicate = phongCachs.some(
      (pc) => pc.tenPhongCach === newPhongCach.tenPhongCach
    );
    if (isDuplicate) {
      setError("Tên phong cách đã tồn tại");
      return;
    }

    // Gửi yêu cầu thêm phong cách mới
    axios
      .post("http://localhost:8080/api/phongcach/add", newPhongCach)
      .then(() => {
        // Gọi lại API để lấy danh sách phong cách mới nhất
        axios
          .get("http://localhost:8080/api/phongcach/phong-cach/hoat-dong")
          .then((res) => {
            const sortedPhongCachs = res.data.sort((a, b) => b.id - a.id);
            setPhongCachs(sortedPhongCachs);
            setSelectedPhongCach(sortedPhongCachs[0]?.id || "");
          })
          .catch((error) =>
            console.error("Lỗi khi gọi lại API phong cách:", error)
          );

        // Hiển thị snackbar thông báo thành công
        setSnackbarMessagePC("Thêm phong cách thành công");
        setOpenSnackbarPC(true);

        // Đóng modal sau khi thêm thành công
        handleCloseModal();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setError(error.response.data);
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
    const isDuplicate = chatLieus.some(
      (cl) => cl.tenChatLieu === newChatLieu.tenChatLieu
    );
    if (isDuplicate) {
      setError("Tên chất liệu đã tồn tại");
      return;
    }

    // Gửi yêu cầu thêm chất liệu mới
    axios
      .post("http://localhost:8080/api/chatlieu/add", newChatLieu)
      .then(() => {
        // Gọi lại API để lấy danh sách chất liệu mới nhất
        axios
          .get("http://localhost:8080/api/chatlieu/chat-lieu/hoat-dong")
          .then((res) => {
            const sortedChatLieus = res.data.sort((a, b) => b.id - a.id);
            setChatLieus(sortedChatLieus);
            setSelectedChatLieu(sortedChatLieus[0]?.id || "");
          })
          .catch((error) =>
            console.error("Lỗi khi gọi lại API chất liệu:", error)
          );

        // Hiển thị snackbar thông báo thành công
        setSnackbarMessageCL("Thêm chất liệu thành công");
        setOpenSnackbarCL(true);

        // Đóng modal sau khi thêm thành công
        handleCloseModal();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setError(error.response.data);
        } else {
          setError("Đã có lỗi xảy ra khi thêm chất liệu");
        }
      });
  };

  // Thêm kiểu dáng
  // Thêm kiểu dáng
  const handleAddKieuDang = () => {
    // Kiểm tra nếu tên chất liệu trống
    if (!newKieuDang.tenKieuDang.trim()) {
      setError("Tên kiểu dáng không được để trống");
      return;
    }

    // Kiểm tra xem tên chất liệu có bị trùng không
    const isDuplicate = kieuDangs.some(
      (kd) => kd.tenKieuDang === newKieuDang.tenKieuDang
    );
    if (isDuplicate) {
      setError("Tên kiểu dáng đã tồn tại");
      return;
    }

    // Gửi yêu cầu thêm chất liệu mới
    axios
      .post("http://localhost:8080/api/kieudang/add", newKieuDang)
      .then(() => {
        // Gọi lại API để lấy danh sách kiểu dáng mới nhất
        axios
          .get("http://localhost:8080/api/kieudang/kieu-dang/hoat-dong")
          .then((res) => {
            console.log("Kiểu dáng API Response:", res.data);
            const sortedkieuDangs = res.data.sort((a, b) => b.id - a.id); // Sắp xếp theo ID giảm dần
            setKieuDangs(sortedkieuDangs);
            setSelectedKieuDang(sortedkieuDangs[0].id); // Lưu ID của kiểu dáng mới nhất
          })
          .catch((error) =>
            console.error(
              "Lỗi API kiểu dáng:",
              error.response ? error.response.data : error.message
            )
          );

        // Hiển thị snackbar thông báo thành công
        setSnackbarMessageKD("Thêm kiểu dáng thành công");
        setOpenSnackbarKD(true);

        // Đóng modal sau khi thêm thành công
        handleCloseModal();
      })
      .catch((error) => {
        // Kiểm tra lỗi từ API và hiển thị thông báo lỗi chính xác
        if (error.response && error.response.data) {
          setError(error.response.data); // Lấy lỗi từ backend
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

    // Kiểm tra xem tên kiểu đai quần có bị trùng không
    const isDuplicate = kieuDaiQuans.some(
      (kdq) => kdq.tenKieuDaiQuan === newKieuDaiQuan.tenKieuDaiQuan
    );
    if (isDuplicate) {
      setError("Tên kiểu đai quần đã tồn tại");
      return;
    }

    // Gửi yêu cầu thêm kiểu đai quần mới
    axios
      .post("http://localhost:8080/api/kieudaiquan/add", newKieuDaiQuan)
      .then(() => {
        // Gọi lại API để lấy danh sách kiểu đai quần mới nhất
        axios
          .get("http://localhost:8080/api/kieudaiquan/kieu-dai-quan/hoat-dong")
          .then((res) => {
            const sortedKieuDaiQuans = res.data.sort((a, b) => b.id - a.id);
            setKieuDaiQuans(sortedKieuDaiQuans);
            setSelectedKieuDaiQuan(sortedKieuDaiQuans[0]?.id || "");
          })
          .catch((error) =>
            console.error("Lỗi khi gọi lại API kiểu đai quần:", error)
          );

        // Hiển thị snackbar thông báo thành công
        setSnackbarMessageKDQ("Thêm kiểu đai quần thành công");
        setOpenSnackbarKDQ(true);

        // Đóng modal sau khi thêm thành công
        handleCloseModal();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setError(error.response.data);
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
    const isDuplicate = xuatXus.some(
      (xx) => xx.tenXuatXu === newXuatXu.tenXuatXu
    );
    if (isDuplicate) {
      setError("Tên xuất xứ đã tồn tại");
      return;
    }

    // Gửi yêu cầu thêm xuất xứ mới
    axios
      .post("http://localhost:8080/api/xuatxu/add", newXuatXu)
      .then(() => {
        // Gọi lại API để lấy danh sách xuất xứ mới nhất
        axios
          .get("http://localhost:8080/api/xuatxu/xuat-xu/hoat-dong")
          .then((res) => {
            const sortedXuatXus = res.data.sort((a, b) => b.id - a.id);
            setXuatXus(sortedXuatXus);
            setSelectedXuatXus(sortedXuatXus[0]?.id || "");
          })
          .catch((error) =>
            console.error("Lỗi khi gọi lại API xuất xứ:", error)
          );

        // Hiển thị snackbar thông báo thành công
        setSnackbarMessageXX("Thêm xuất xứ thành công");
        setOpenSnackbarXX(true);

        // Đóng modal sau khi thêm thành công
        handleCloseModal();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setError(error.response.data);
        } else {
          setError("Đã có lỗi xảy ra khi thêm xuất xứ");
        }
      });
  };

  //add màu sắc
  useEffect(() => {
    // Fetch all colors on page load
    axios
      .get("http://localhost:8080/api/mausac/mau-sac/hoat-dong")
      .then((response) => {
        setColors(response.data); // Assuming response.data is an array of colors
      })
      .catch((error) => {
        console.error("Error fetching colors:", error);
      });
  }, []);

  const handleOpenColorModal = () => {
    setOpenColorModal(true);
  };

  const handleCloseColorModal = () => {
    setOpenColorModal(false);
  };

  const handleOpenAddColorModal = () => {
    setOpenAddColorModal(true);
  };

  const handleCloseAddColorModal = () => {
    setOpenAddColorModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewColor({
      ...newColor,
      [name]: value,
    });
  };

  const handleAddColor = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/api/mausac/add-mau", newColor)
      .then((response) => {
        alert("Màu sắc đã được thêm!");
        setColors([...colors, response.data]); // Add the new color to the color list
        setNewColor({ tenMauSac: "", maMau: "" }); // Clear form inputs
        setOpenAddColorModal(false);
      })
      .catch((error) => {
        console.error("Error adding color:", error);
      });
  };

  // Cập nhật giá trị của selectedMauSacs (màu sắc đã chọn)
  const handleColorSelect = (color) => {
    if (
      selectedMauSacs.length < 3 &&
      !selectedMauSacs.some((existingColor) => existingColor.id === color.id)
    ) {
      setSelectedMauSacs([...selectedMauSacs, color]);
    }
  };

  // Xóa màu đã chọn
  const handleRemoveColor = (colorToRemove) => {
    setSelectedMauSacs(
      selectedMauSacs.filter((color) => color !== colorToRemove)
    );
  };

  const handleOpenColorPicker = () => {
    setOpenColorPicker(true); // Open the color picker modal
  };

  const handleCloseColorPicker = () => {
    setOpenColorPicker(false); // Close the color picker modal
  };

  // Cập nhật giá trị của selectedMauSacs (màu sắc đã chọn)
  const handleColorChange = (event) => {
    setSelectedMauSacs(event.target.value); // Chỉ lưu trữ ID của màu sắc
  };
  // Hàm xử lý khi màu thay đổi
  const handleColorChangeMau = (color) => {
    if (color && color.hex) {
      setNewColor({
        ...newColor,
        maMau: color.hex, // Cập nhật màu khi chọn
      });
    }
  };
  // add size
  // Lấy danh sách size từ API
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/size/hoat-dong")
      .then((response) => {
        setSizes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sizes:", error);
      });
  }, []);

  const handleOpenSizeModal = () => {
    setOpenSizeModal(true);
  };

  const handleCloseSizeModal = () => {
    setOpenSizeModal(false);
  };

  const handleOpenAddSizeModal = () => {
    setOpenAddSizeModal(true);
  };

  const handleCloseAddSizeModal = () => {
    setOpenAddSizeModal(false);
  };

  const handleChangeSize = (e) => {
    const { name, value } = e.target;
    setNewSize({
      ...newSize,
      [name]: value,
    });
  };

  const handleAddSize = (e) => {
    e.preventDefault();
    // Gọi API POST để thêm size
    axios
      .post("http://localhost:8080/api/size/add-size", newSize)
      .then((response) => {
        alert("Size đã được thêm!");
        setSizes([...sizes, response.data]); // Cập nhật danh sách size
        setNewSize({ tenSize: "", moTa: "" }); // Reset form input
        setOpenAddSizeModal(false); // Đóng modal thêm size
      })
      .catch((error) => {
        console.error("Error adding size:", error);
      });
  };

  const handleSizeSelect = (size) => {
    if (
      selectedSizes.length < 3 &&
      !selectedSizes.some((existingSize) => existingSize.id === size.id)
    ) {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleSizeRemove = (sizeToRemove) => {
    setSelectedSizes(
      selectedSizes.filter((size) => size.id !== sizeToRemove.id)
    );
  };

  // Hàm để xử lý chọn tất cả sản phẩm
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedProducts(productDetails.map((_, index) => index)); // Chọn tất cả sản phẩm
    } else {
      setSelectedProducts([]); // Bỏ chọn tất cả
    }
    setSelectAll(event.target.checked); // Cập nhật trạng thái "Chọn tất cả"
  };
  const handleCheckboxChange = (index) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  // Xử lý thay đổi số lượng chung và giá chung
  const handleCommonChange = (field, value) => {
    if (field === "quantity") setCommonQuantity(value);
    if (field === "price") setCommonPrice(value);

    // Cập nhật tất cả sản phẩm được chọn bằng cách tái sử dụng handleInputChange
    selectedProducts.forEach((index) => {
      handleInputChange(index, field, value);
    });
  };

  // Hàm cập nhật số lượng hoặc giá của một sản phẩm
  const handleInputChange = (index, field, value) => {
    setProductDetails((prevDetails) =>
      prevDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      )
    );
  };
  return (
    <div>
      <Typography variant="h4">Thêm Sản Phẩm</Typography>
      <Paper sx={{ padding: 2, mb: 2 }}>
        <Typography variant="h5">Thuộc Tính</Typography>
        {/* Sản phẩm */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
            <InputLabel>Tên sản phẩm</InputLabel>
            <Controller
              name="tenSanPham"
              control={control}
              defaultValue={selectedProduct} // Đảm bảo defaultValue là selectedProduct
              render={({ field }) => (
                <Select
                  {...field}
                  label="Tên Sản Phẩm"
                  value={selectedProduct} // Đảm bảo value được cập nhật đúng
                  onChange={
                    (e) => {
                      console.log("Product selected:", e.target.value); // Log giá trị khi chọn
                      setSelectedProduct(e.target.value);
                    } // Cập nhật giá trị sản phẩm
                  }
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
                value={selectedCategory || ""} // Đảm bảo rằng selectedCategory là giá trị hợp lệ
                label="Danh Mục"
                onChange={(e) => {
                  setSelectedCategory(e.target.value); // Cập nhật selectedCategory khi người dùng chọn
                }}
              >
                {danhMucs.length > 0 ? (
                  danhMucs.map((dm) => (
                    <MenuItem key={dm.id} value={dm.id}>
                      {dm.tenDanhMuc}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Không có danh mục</MenuItem> // Hiển thị nếu danh mục trống
                )}
              </Select>
            </FormControl>

            <IconButton
              color="primary"
              onClick={() => handleOpenModal("danhMuc")}
            >
              <AddIcon sx={{ fontSize: 30 }} />
            </IconButton>
            {/* Modal Thêm Danh Mục */}
            {openModal === "danhMuc" && (
              <Dialog open={openModal === "danhMuc"} onClose={handleCloseModal}>
                <DialogTitle>Thêm Danh Mục Mới</DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Tên Danh Mục"
                    value={newCategory.tenDanhMuc}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        tenDanhMuc: e.target.value,
                      })
                    }
                    error={!!error}
                    helperText={error}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Mô Tả"
                    value={newCategory.moTa}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, moTa: e.target.value })
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="secondary">
                    Hủy
                  </Button>
                  <Button onClick={handleAddDanhMuc} color="primary">
                    Thêm
                  </Button>
                </DialogActions>
              </Dialog>
            )}
            {/* Snackbar để hiển thị thông báo */}
            <Snackbar
              open={openSnackbarDM}
              autoHideDuration={3000} // Thời gian tự động đóng sau 3 giây
              onClose={handleCloseSnackbarDM}
              anchorOrigin={{ vertical: "top", horizontal: "right" }} // Đặt vị trí thông báo
            >
              <Alert
                onClose={handleCloseSnackbarDM}
                severity="success"
                sx={{ width: "100%" }}
              >
                {snackbarMessageDM}
              </Alert>
            </Snackbar>
          </Grid>
          {/* Thương Hiệu */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
              <InputLabel>Thương Hiệu</InputLabel>
              <Select
                label="Thương Hiệu"
                value={selectedThuongHieu || ""} // Kiểm tra giá trị đã chọn
                onChange={(e) => {
                  setSelectedThuongHieu(e.target.value); // Lưu giá trị thương hiệu đã chọn
                }}
              >
                {thuongHieus.length > 0 ? (
                  thuongHieus.map((th) => (
                    <MenuItem key={th.id} value={th.id}>
                      {th.tenThuongHieu}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Không có thương hiệu</MenuItem> // Hiển thị khi không có thương hiệu
                )}
              </Select>
            </FormControl>
            <IconButton
              color="primary"
              onClick={() => handleOpenModal("thuongHieu")}
            >
              <AddIcon sx={{ fontSize: 30 }} />
            </IconButton>

            {/* Modal thêm thương hiệu */}
            {openModal === "thuongHieu" && (
              <Dialog
                open={openModal === "thuongHieu"}
                onClose={handleCloseModal}
              >
                <DialogTitle>Thêm Thương Hiệu Mới</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Tên Thương Hiệu"
                    fullWidth
                    value={newThuongHieu.tenThuongHieu}
                    onChange={(e) =>
                      setNewThuongHieu({
                        ...newThuongHieu,
                        tenThuongHieu: e.target.value,
                      })
                    }
                    error={!!error}
                    helperText={error}
                  />
                  <TextField
                    label="Mô Tả"
                    fullWidth
                    multiline
                    value={newThuongHieu.moTa}
                    onChange={(e) =>
                      setNewThuongHieu({
                        ...newThuongHieu,
                        moTa: e.target.value,
                      })
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="secondary">
                    Hủy
                  </Button>
                  <Button onClick={handleAddThuongHieu} color="primary">
                    Thêm
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {/* Snackbar thông báo thêm thương hiệu thành công */}
            <Snackbar
              open={openSnackbarTH}
              autoHideDuration={3000} // Thời gian tự động đóng sau 3 giây
              onClose={handleCloseSnackbarTH}
              anchorOrigin={{ vertical: "top", horizontal: "right" }} // Đặt vị trí thông báo
            >
              <Alert
                onClose={handleCloseSnackbarTH}
                severity="success"
                sx={{ width: "100%" }}
              >
                {snackbarMessageTH}
              </Alert>
            </Snackbar>
          </Grid>
          {/* phong cách */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
              <InputLabel>Phong Cách</InputLabel>
              <Select
                label="Phong Cách"
                value={selectedPhongCach || ""} // Kiểm tra giá trị đã chọn
                onChange={(e) => {
                  setSelectedPhongCach(e.target.value); // Lưu giá trị phong cách đã chọn
                }}
              >
                {phongCachs.length > 0 ? (
                  phongCachs.map((pc) => (
                    <MenuItem key={pc.id} value={pc.id}>
                      {pc.tenPhongCach}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Không có phong cách</MenuItem> // Hiển thị khi không có phong cách
                )}
              </Select>
            </FormControl>
            <IconButton
              color="primary"
              onClick={() => handleOpenModal("phongCach")}
            >
              <AddIcon sx={{ fontSize: 30 }} />
            </IconButton>

            {/* Modal thêm phong cách */}
            {openModal === "phongCach" && (
              <Dialog
                open={openModal === "phongCach"}
                onClose={handleCloseModal}
              >
                <DialogTitle>Thêm Phong Cách Mới</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Tên Phong Cách"
                    fullWidth
                    value={newPhongCach.tenPhongCach}
                    onChange={(e) =>
                      setNewPhongCach({
                        ...newPhongCach,
                        tenPhongCach: e.target.value,
                      })
                    }
                    error={!!error}
                    helperText={error}
                  />
                  <TextField
                    label="Mô Tả"
                    fullWidth
                    multiline
                    value={newPhongCach.moTa}
                    onChange={(e) =>
                      setNewPhongCach({ ...newPhongCach, moTa: e.target.value })
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="secondary">
                    Hủy
                  </Button>
                  <Button onClick={handleAddPhongCach} color="primary">
                    Thêm
                  </Button>
                </DialogActions>
              </Dialog>
            )}
            {/* Snackbar thông báo thêm phong cách thành công */}
            <Snackbar
              open={openSnackbarPC}
              autoHideDuration={3000} // Thời gian tự động đóng sau 3 giây
              onClose={handleCloseSnackbarPC}
              anchorOrigin={{ vertical: "top", horizontal: "right" }} // Đặt vị trí thông báo
            >
              <Alert
                onClose={handleCloseSnackbarPC}
                severity="success"
                sx={{ width: "100%" }}
              >
                {snackbarMessagePC}
              </Alert>
            </Snackbar>
          </Grid>
          {/* Chất liệu */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
              <InputLabel>Chất Liệu</InputLabel>
              <Select
                label="Chất Liệu"
                value={selectedChatLieu || ""} // Kiểm tra giá trị đã chọn
                onChange={(e) => {
                  setSelectedChatLieu(e.target.value); // Lưu giá trị chất liệu đã chọn
                }}
              >
                {chatLieus.length > 0 ? (
                  chatLieus.map((cl) => (
                    <MenuItem key={cl.id} value={cl.id}>
                      {cl.tenChatLieu}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Không có chất liệu</MenuItem> // Hiển thị khi không có chất liệu
                )}
              </Select>
            </FormControl>
            <IconButton
              color="primary"
              onClick={() => handleOpenModal("chatLieu")}
            >
              <AddIcon sx={{ fontSize: 30 }} />
            </IconButton>

            {/* Modal thêm chất liệu */}
            {openModal === "chatLieu" && (
              <Dialog
                open={openModal === "chatLieu"}
                onClose={handleCloseModal}
              >
                <DialogTitle>Thêm Chất Liệu Mới</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Tên Chất Liệu"
                    fullWidth
                    value={newChatLieu.tenChatLieu}
                    onChange={(e) =>
                      setNewChatLieu({
                        ...newChatLieu,
                        tenChatLieu: e.target.value,
                      })
                    }
                    error={!!error}
                    helperText={error}
                  />
                  <TextField
                    label="Mô Tả"
                    fullWidth
                    multiline
                    value={newChatLieu.moTa}
                    onChange={(e) =>
                      setNewChatLieu({ ...newChatLieu, moTa: e.target.value })
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="secondary">
                    Hủy
                  </Button>
                  <Button onClick={handleAddChatLieu} color="primary">
                    Thêm
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {/* Snackbar thông báo thêm chất liệu thành công */}
            <Snackbar
              open={openSnackbarCL}
              autoHideDuration={3000} // Thời gian tự động đóng sau 3 giây
              onClose={handleCloseSnackbarCL}
              anchorOrigin={{ vertical: "top", horizontal: "right" }} // Đặt vị trí thông báo
            >
              <Alert
                onClose={handleCloseSnackbarCL}
                severity="success"
                sx={{ width: "100%" }}
              >
                {snackbarMessageCL}
              </Alert>
            </Snackbar>
          </Grid>
          {/* Hàng 2: 3 cột */}
          {/* Kiểu dáng */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
              <InputLabel>Kiểu Dáng</InputLabel>
              <Select
                label="Kiểu Dáng"
                value={selectedKieuDang || ""} // Kiểm tra giá trị đã chọn
                onChange={(e) => setSelectedKieuDang(e.target.value)} // Lưu giá trị kiểu dáng đã chọn
              >
                {kieuDangs.length > 0 ? (
                  kieuDangs.map((kd) => (
                    <MenuItem key={kd.id} value={kd.id}>
                      {kd.tenKieuDang}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Không có kiểu dáng</MenuItem> // Hiển thị khi không có kiểu dáng
                )}
              </Select>
            </FormControl>

            <IconButton
              color="primary"
              onClick={() => handleOpenModal("kieuDang")}
            >
              <AddIcon sx={{ fontSize: 30 }} />
            </IconButton>

            {/* Modal thêm phong cách */}
            {openModal === "kieuDang" && (
              <Dialog
                open={openModal === "kieuDang"}
                onClose={handleCloseModal}
              >
                <DialogTitle>Thêm Kiểu Dáng Mới</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Tên Kiểu Dáng"
                    fullWidth
                    value={newKieuDang.tenKieuDang}
                    onChange={(e) =>
                      setNewKieuDang({
                        ...newKieuDang,
                        tenKieuDang: e.target.value,
                      })
                    }
                    error={!!error}
                    helperText={error}
                  />
                  <TextField
                    label="Mô Tả"
                    fullWidth
                    multiline
                    value={newKieuDang.moTa}
                    onChange={(e) =>
                      setNewKieuDang({ ...newKieuDang, moTa: e.target.value })
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="secondary">
                    Hủy
                  </Button>
                  <Button onClick={handleAddKieuDang} color="primary">
                    Thêm
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {/* Snackbar thông báo thêm phong cách thành công */}
            <Snackbar
              open={openSnackbarKD}
              autoHideDuration={3000} // Thời gian tự động đóng sau 3 giây
              onClose={handleCloseSnackbarKD}
              anchorOrigin={{ vertical: "top", horizontal: "right" }} // Đặt vị trí thông báo
            >
              <Alert
                onClose={handleCloseSnackbarKD}
                severity="success"
                sx={{ width: "100%" }}
              >
                {snackbarMessageKD}
              </Alert>
            </Snackbar>
          </Grid>

          {/* Kiểu đai quần */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
              <InputLabel>Kiểu Đai Quần</InputLabel>
              <Select
                label="Kiểu Đai Quần"
                value={selectedKieuDaiQuan || ""} // Kiểm tra giá trị đã chọn
                onChange={(e) => setSelectedKieuDaiQuan(e.target.value)} // Lưu giá trị kiểu đai quần đã chọn
              >
                {kieuDaiQuans.length > 0 ? (
                  kieuDaiQuans.map((kdq) => (
                    <MenuItem key={kdq.id} value={kdq.id}>
                      {kdq.tenKieuDaiQuan}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Không có kiểu đai quần</MenuItem> // Hiển thị khi không có kiểu đai quần
                )}
              </Select>
            </FormControl>

            <IconButton
              color="primary"
              onClick={() => handleOpenModal("kieuDaiQuan")}
            >
              <AddIcon sx={{ fontSize: 30 }} />
            </IconButton>

            {/* Modal thêm phong cách */}
            {openModal === "kieuDaiQuan" && (
              <Dialog
                open={openModal === "kieuDaiQuan"}
                onClose={handleCloseModal}
              >
                <DialogTitle>Thêm Kiểu Đai Quần</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Kiểu Đai Quần"
                    fullWidth
                    value={newKieuDaiQuan.tenKieuDaiQuan}
                    onChange={(e) =>
                      setNewKieuDaiQuan({
                        ...newKieuDaiQuan,
                        tenKieuDaiQuan: e.target.value,
                      })
                    }
                    error={!!error}
                    helperText={error}
                  />
                  <TextField
                    label="Mô Tả"
                    fullWidth
                    multiline
                    value={newKieuDaiQuan.moTa}
                    onChange={(e) =>
                      setNewKieuDaiQuan({
                        ...newKieuDaiQuan,
                        moTa: e.target.value,
                      })
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="secondary">
                    Hủy
                  </Button>
                  <Button onClick={handleAddKieuDaiQuan} color="primary">
                    Thêm
                  </Button>
                </DialogActions>
              </Dialog>
            )}
            {/* Snackbar thông báo thêm phong cách thành công */}
            <Snackbar
              open={openSnackbarKDQ}
              autoHideDuration={3000} // Thời gian tự động đóng sau 3 giây
              onClose={handleCloseSnackbarKDQ}
              anchorOrigin={{ vertical: "top", horizontal: "right" }} // Đặt vị trí thông báo
            >
              <Alert
                onClose={handleCloseSnackbarKDQ}
                severity="success"
                sx={{ width: "100%" }}
              >
                {snackbarMessageKDQ}
              </Alert>
            </Snackbar>
          </Grid>
          {/* Xuất xứ */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal" sx={{ width: "60%" }}>
              <InputLabel>Xuất Xứ</InputLabel>
              <Select
                label="Xuất Xứ"
                value={selectedXuatXus || ""} // Kiểm tra giá trị đã chọn
                onChange={(e) => setSelectedXuatXus(e.target.value)} // Lưu giá trị xuất xứ đã chọn
              >
                {xuatXus.length > 0 ? (
                  xuatXus.map((xx) => (
                    <MenuItem key={xx.id} value={xx.id}>
                      {xx.tenXuatXu}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Không có xuất xứ</MenuItem> // Hiển thị khi không có xuất xứ
                )}
              </Select>
            </FormControl>

            <IconButton
              color="primary"
              onClick={() => handleOpenModal("xuatXu")}
            >
              <AddIcon sx={{ fontSize: 30 }} />
            </IconButton>

            {openModal === "xuatXu" && (
              <Dialog open={openModal === "xuatXu"} onClose={handleCloseModal}>
                <DialogTitle>Thêm Xuất Xứ Mới</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Tên Xuất Xứ"
                    fullWidth
                    value={newXuatXu.tenXuatXu}
                    onChange={(e) =>
                      setNewXuatXu({ ...newXuatXu, tenXuatXu: e.target.value })
                    }
                    error={!!error}
                    helperText={error}
                  />
                  <TextField
                    label="Mô Tả"
                    fullWidth
                    multiline
                    value={newXuatXu.moTa}
                    onChange={(e) =>
                      setNewXuatXu({ ...newXuatXu, moTa: e.target.value })
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="secondary">
                    Hủy
                  </Button>
                  <Button onClick={handleAddXuatXu} color="primary">
                    Thêm
                  </Button>
                </DialogActions>
              </Dialog>
            )}
            {/* Snackbar thông báo thêm phong cách thành công */}
            <Snackbar
              open={openSnackbarXX}
              autoHideDuration={3000} // Thời gian tự động đóng sau 3 giây
              onClose={handleCloseSnackbarXX}
              anchorOrigin={{ vertical: "top", horizontal: "right" }} // Đặt vị trí thông báo
            >
              <Alert
                onClose={handleCloseSnackbarXX}
                severity="success"
                sx={{ width: "100%" }}
              >
                {snackbarMessageXX}
              </Alert>
            </Snackbar>
          </Grid>
          {/* Mô tả */}
          <Grid item xs={12} md={6}>
            <Controller
              name="moTa"
              control={control}
              defaultValue=""
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              // Thiết lập giá trị mặc định là chuỗi trống
              render={({ field }) => (
                <TextField
                  label="Mô Tả"
                  fullWidth
                  margin="dense"
                  multiline
                  rows={4}
                  sx={{ width: "60%" }}
                  value={description} // ✅ Đảm bảo giá trị đồng bộ với state
                  onChange={handleDescriptionChange} // ✅ Cập nhật khi nhập
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>
      {/* chọn màu và size */}
      <Paper sx={{ padding: 2, mb: 2, position: "relative" }}>
        <Typography variant="h5">Màu sắc & Kích Cỡ</Typography>

        <div>
          {/* Màu Sắc */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h5 style={{ margin: 0 }}>Màu Sắc:</h5>
            {/* Button to open color modal */}
            <Button
              variant="contained"
              style={{ marginLeft: "10px", height: "30px", width: "30px" }}
              onClick={handleOpenColorModal}
            >
              +
            </Button>
          </div>

          {/* Display selected colors below the button */}
          <div style={{ marginTop: "10px", display: "flex" }}>
            {selectedMauSacs.map((color) => (
              <div
                key={color.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "10px",
                  width: "30px",
                  height: "10px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: color.maMau,
                  color: "white",
                }}
              >
                <span style={{ fontSize: "8px" }}>{color.tenMauSac}</span>
                <Button
                  onClick={() => handleRemoveColor(color)}
                  style={{ color: "red", width: "2px" }}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
          {/* Color Modal */}
          <Modal
            open={openColorModal}
            onClose={handleCloseColorModal}
            aria-labelledby="choose-color-modal"
          >
            <Box sx={colorModalStyle}>
              <Typography variant="h6">Chọn Màu Sắc</Typography>
              <div
                style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}
              >
                {colors.map((color) => (
                  <div
                    key={color.ma}
                    style={{
                      margin: "10px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "40px", // Adjusted size for rectangular look
                      height: "40px", // Rectangular size
                      borderRadius: "4px", // Optional rounded corners for a nicer look
                    }}
                    onClick={() => handleColorSelect(color)}
                  >
                    <div
                      style={{
                        backgroundColor: color.maMau,
                        width: "20px", // Slightly smaller width for color box
                        height: "20px", // Slightly smaller height
                        marginBottom: "5px",
                        borderRadius: "50%",
                      }}
                    />
                    <p style={{ fontSize: "9px", margin: "0" }}>
                      {color.tenMauSac}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outlined" onClick={handleCloseColorModal}>
                Đóng
              </Button>
              <Button variant="contained" onClick={handleOpenAddColorModal}>
                Thêm Màu
              </Button>
            </Box>
          </Modal>

          {/* Add Color Modal */}
          <Modal
            open={openAddColorModal}
            onClose={handleCloseAddColorModal}
            aria-labelledby="add-color-modal"
          >
            <Box sx={addColorModalStyle}>
              <Typography variant="h6">Thêm Màu Mới</Typography>
              <form onSubmit={handleAddColor}>
                <TextField
                  label="Tên Màu"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="tenMauSac"
                  value={newColor.tenMauSac}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Mã Màu"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="maMau"
                  value={newColor.maMau}
                  onChange={handleChange}
                  required
                  onClick={handleOpenColorPicker} // Open color picker when clicked
                />
                <Button type="submit" variant="contained" fullWidth>
                  Thêm Màu
                </Button>
              </form>
              <Button variant="outlined" onClick={handleCloseAddColorModal}>
                Hủy
              </Button>
            </Box>
          </Modal>

          {/* Color Picker Modal */}
          <Modal
            open={openColorPicker}
            onClose={handleCloseColorPicker}
            aria-labelledby="color-picker-modal"
          >
            <Box sx={colorPickerModalStyle}>
              <Typography variant="h6">Chọn Mã Màu</Typography>
              <SketchPicker
                color={newColor.maMau || "#fff"} // Set the current color
                onChange={handleColorChangeMau} // Update the color when selected
              />
              <Button variant="outlined" onClick={handleCloseColorPicker}>
                Đóng
              </Button>
            </Box>
          </Modal>

          {/* Kích cỡ */}
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            <h5 style={{ margin: 0 }}>Kích cỡ:</h5>
            {/* Button to open size modal */}
            <Button
              variant="contained"
              style={{ marginLeft: "10px", height: "30px", width: "30px" }}
              onClick={handleOpenSizeModal}
            >
              +
            </Button>
          </div>

          {/* Display selected sizes */}
          <div style={{ marginTop: "10px", margin: "10px", display: "flex" }}>
            {selectedSizes.map((size) => (
              <div
                key={size.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "10px",
                  padding: "5px",
                  border: "1px solid black",
                  width: "30px",
                  height: "20px",
                  borderRadius: "5px",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <span style={{ fontSize: "10px" }}>{size.tenSize}</span>
                <Button
                  onClick={() => handleSizeRemove(size)}
                  style={{ color: "red", fontSize: "12px" }}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
          {/* Size Modal */}
          <Modal
            open={openSizeModal}
            onClose={handleCloseSizeModal}
            aria-labelledby="choose-size-modal"
          >
            <Box sx={modalStyle}>
              <Typography variant="h6">Chọn Kích Cỡ</Typography>
              <div
                style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}
              >
                {sizes.map((size) => (
                  <div
                    key={size.id}
                    style={{
                      margin: "10px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "30px", // Size box width
                      height: "20px", // Size box height
                      border: "1px solid black",
                      borderRadius: "4px",
                    }}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {/* <div style={{ backgroundColor: '#e0e0e0', width: '50px', height: '50px' }} /> */}
                    <p style={{ fontSize: "10px", margin: "5px" }}>
                      {size.tenSize}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outlined" onClick={handleCloseSizeModal}>
                Đóng
              </Button>
              <Button variant="contained" onClick={handleOpenAddSizeModal}>
                Thêm Size
              </Button>
            </Box>
          </Modal>

          {/* Add Size Modal */}
          <Modal
            open={openAddSizeModal}
            onClose={handleCloseAddSizeModal}
            aria-labelledby="add-size-modal"
          >
            <Box sx={addSizeModalStyle}>
              <Typography variant="h6">Thêm Kích Cỡ Mới</Typography>
              <form onSubmit={handleAddSize}>
                <TextField
                  label="Tên Size"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="tenSize"
                  value={newSize.tenSize}
                  onChange={handleChangeSize}
                  required
                  sx={inputStyle} // Apply smaller size for text input
                />
                <TextField
                  label="Mô Tả"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="moTa"
                  value={newSize.moTa}
                  onChange={handleChangeSize}
                  required
                  sx={inputStyle} // Apply smaller size for text input
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={buttonStyle}
                >
                  Thêm Size
                </Button>
              </form>
              <Button
                variant="outlined"
                onClick={handleCloseAddSizeModal}
                sx={buttonStyle}
              >
                Hủy
              </Button>
            </Box>
          </Modal>
        </div>

        {/* Ô nhập số lượng chung và giá chung - đặt góc phải */}
        <div
          style={{
            display: "flex",
            gap: "10px", // Khoảng cách nhỏ giữa 2 ô
            position: "absolute",
            bottom: "10px",
            right: "10px",
          }}
        >
          <TextField
            label="Số lượng chung"
            type="number"
            value={commonQuantity}
            onChange={(e) => handleCommonChange("quantity", e.target.value)}
            size="small"
          />
          <TextField
            label="Giá chung"
            type="number"
            value={commonPrice}
            onChange={(e) => handleCommonChange("price", e.target.value)}
            size="small"
          />
        </div>
      </Paper>

      <Button
        variant="outlined" // Kiểu nút với viền
        sx={{
          color: "primary", // Màu chữ xanh nhạt
          backgroundColor: "white", // Màu nền trắng
          borderColor: "lightblue", // Màu viền xanh nhạt
          "&:hover": {
            backgroundColor: "lightblue", // Màu nền khi hover
            color: "white", // Màu chữ khi hover
            borderColor: "primary", // Màu viền khi hover
          },
          marginBottom: "20px",
        }}
        startIcon={<Add sx={{ color: "primary" }} />} // Màu của biểu tượng dấu "+"
        onClick={handleAddToTable} // Gọi hàm thêm vào bảng
      >
        Thêm vào bảng
      </Button>

      {/* bảng hiển thị danh sách */}

      {/* Existing Fields for Tên Sản Phẩm, Danh Mục, Thương Hiệu, ... */}
      <Paper sx={{ padding: 2, mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectAll} // Kiểm tra nếu chọn tất cả
                    onChange={handleSelectAll} // Xử lý khi chọn tất cả
                  />
                </TableCell>
                <TableCell>Mã Sản Phẩm Chi Tiết</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Màu sắc</TableCell>
                <TableCell>Kích thước</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Hành Động</TableCell>
                <TableCell>Ảnh</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(index)} // Kiểm tra sản phẩm có được chọn hay không
                      onChange={() => handleCheckboxChange(index)} // Thay đổi trạng thái của checkbox
                    />
                  </TableCell>
                  <TableCell>{detail.productCode}</TableCell>
                  <TableCell>{detail.productName}</TableCell>
                  <TableCell>{detail.tenMauSac}</TableCell>
                  <TableCell>{detail.tenSize}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={detail.quantity}
                      onChange={(e) => {
                        const newProductDetails = [...productDetails];
                        newProductDetails[index].quantity = e.target.value;
                        setProductDetails(newProductDetails);
                      }}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={detail.price}
                      onChange={(e) => {
                        const newProductDetails = [...productDetails];
                        newProductDetails[index].price = e.target.value;
                        setProductDetails(newProductDetails);
                      }}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => removeSanPhamChiTiet(index)}
                      color="black"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {detail.images && detail.images.length > 0 ? (
                        detail.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`product-${imgIndex}`}
                            width={40}
                            height={40}
                            style={{ borderRadius: "5px" }}
                          />
                        ))
                      ) : (
                        <p>Chưa có ảnh</p>
                      )}
                      <Button onClick={() => handleOpenModalAnh(detail.id)}>
                        Chọn ảnh
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Snackbar để hiển thị thông báo */}
        <Snackbar
          open={openSnackbarXoa}
          autoHideDuration={3000} // Thời gian tự động đóng sau 3 giây
          onClose={handleCloseSnackbarXoa}
          anchorOrigin={{ vertical: "top", horizontal: "right" }} // Đặt vị trí thông báo
        >
          <Alert
            onClose={handleCloseSnackbarXoa}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessageXoa}
          </Alert>
        </Snackbar>

        <Modal open={openModalAnh} onClose={() => setOpenModalAnh(false)}>
          <div
            style={{
              width: "850px",
              height: "550px",
              background: "white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0px 4px 10px rgba(104, 101, 101, 0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start", // Căn lề trái cho tiêu đề
              justifyContent: "flex-start",
              margin: "auto",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h3 style={{ marginBottom: "10px", textAlign: "left" }}>
              Danh sách ảnh
            </h3>

            <div
              style={{
                overflowY: "auto",
                maxHeight: "350px", // Giới hạn chiều cao của phần ảnh
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)", // Chia thành 6 cột
                gap: "10px", // Khoảng cách giữa các ảnh
                textAlign: "center",
              }}
            >
              {cloudinaryImages.length > 0 ? (
                cloudinaryImages.map((image, index) => (
                  <div key={index} style={{ cursor: "pointer" }}>
                    <img
                      src={image.secure_url} // Sử dụng secure_url để hiển thị ảnh
                      alt={`image-${index}`}
                      width={100} // Tăng kích thước ảnh
                      height={100} // Tăng kích thước ảnh
                      style={{ borderRadius: "5px" }}
                    />
                    <div>
                      <input
                        type="checkbox"
                        onChange={(e) => handleSelectImage(e, image)} // Xử lý chọn ảnh
                        checked={selectedImages.some(
                          (img) => img.public_id === image.public_id
                        )} // Chỉ check nếu ảnh đã được chọn
                        disabled={
                          selectedImages.length >= 6 &&
                          !selectedImages.some(
                            (img) => img.public_id === image.public_id
                          )
                        } // Giới hạn tối đa 6 ảnh
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có ảnh để hiển thị.</p>
              )}
            </div>

            <h3 style={{ marginBottom: "10px", textAlign: "left" }}>
              Danh sách ảnh đã chọn
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {selectedImages.length > 0 ? (
                selectedImages.map((image, index) => (
                  <div key={index} style={{ marginBottom: "5px" }}>
                    <img
                      src={image.secure_url}
                      alt={`selected-image-${index}`}
                      width={80}
                      height={80}
                      style={{ borderRadius: "5px" }}
                    />
                  </div>
                ))
              ) : (
                <p>Chưa có ảnh nào được chọn.</p>
              )}
            </div>

            {selectedImages.length > 6 && (
              <p style={{ color: "red" }}>Bạn chỉ có thể chọn tối đa 6 ảnh.</p>
            )}

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              {/* Nút Đóng ở giữa */}
              <div
                style={{ flex: 1, display: "flex", justifyContent: "center" }}
              >
                <Button
                  onClick={handleCloseModalAnh}
                  variant="contained"
                  style={{ backgroundColor: "white", color: "black" }}
                >
                  Đóng
                </Button>
              </div>

              {/* Nút Thêm ảnh và Lưu bên phải */}
              <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
                <Button
                  onClick={() => document.getElementById("file-input").click()}
                >
                  Thêm ảnh
                </Button>
                <input
                  id="file-input"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />

                <Button onClick={() => handleAddProductImages(selectedImages)}>
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        <Button onClick={handleSave}>Lưu</Button>
      </Paper>
    </div>
  );
};
// Style for Color Modal (Smaller and rectangular)

// Style for Color Modal (Smaller and rectangular)
const colorModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  boxShadow: 24,
  width: "300px", // Smaller width
  height: "200px", // Adjust height
  maxWidth: "100%", // Ensure it fits on all screen sizes
};

// Style for Add Color Modal (Smaller)
const addColorModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  boxShadow: 24,
  width: "200px", // Smaller width
};

// Style for Color Picker Modal (Smaller)
const colorPickerModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  boxShadow: 24,
  width: "300px", // Smaller width for picker
};
// Style for modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  boxShadow: 24,
  width: "300px", // Smaller width
  height: "200px", // Adjust height
  maxWidth: "100%", // Ensure it fits on all screen sizes
};
// Style for Add Size Modal (smaller inputs and buttons)
const addSizeModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  boxShadow: 24,
  width: "300px", // Smaller width
};

// Style for input fields (smaller size)
const inputStyle = {
  marginBottom: "10px",
  fontSize: "14px", // Smaller font size for inputs
};

// Style for buttons (smaller size)
const buttonStyle = {
  fontSize: "14px", // Smaller font size for buttons
  marginTop: "10px", // Space between buttons
};
export default AddSanPham;
