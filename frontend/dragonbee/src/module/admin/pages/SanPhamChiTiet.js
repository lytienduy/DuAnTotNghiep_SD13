import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowBack,
  Visibility,
  VisibilityOff,
  ChevronLeft,
  ChevronRight,
  Edit,
  Add,
} from "@mui/icons-material";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  Pagination,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Modal,
  MenuItem,
  InputLabel,
  Select,
  IconButton,
  FormControl,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const SanPhamChiTiet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [chiTietList, setChiTietList] = useState([]); // Khởi tạo mặc định là mảng trống
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Mở đóng Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarMessage1, setSnackbarMessage1] = useState(""); // Nội dung thông báo
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [cloudinaryImages, setCloudinaryImages] = useState([]); // Dùng toán tử optional chaining để tránh lỗi khi result là undefined
  const [openModalAnh, setOpenModalAnh] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    trangThai: "",
    thuongHieu: "",
    danhMuc: "",
    phongCach: "",
    chatLieu: "",
    xuatXu: "",
    mauSac: "",
    size: "",
    kieuDang: "",
    kieuDaiQuan: "",
    priceRange: [100000, 5000000],
  });
  const [size, setSize] = useState(5); // Hoặc giá trị mặc định phù hợp
  const [commonPrice, setCommonPrice] = useState("");
  const [commonQuantity, setCommonQuantity] = useState("");
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Mặc định là 5 item mỗi trang
  const [selectedItems, setSelectedItems] = useState([]); // Dùng để lưu trữ các sản phẩm được chọn
  const [danhMucs, setDanhMucs] = useState("");
  const [thuongHieus, setThuongHieus] = useState("");
  const [phongCachs, setPhongCachs] = useState("");
  const [chatLieus, setChatLieus] = useState("");
  const [kieuDangs, setKieuDangs] = useState("");
  const [kieuDaiQuans, setKieuDaiQuans] = useState("");
  const [xuatXus, setXuatXus] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [openSnackbarUpdate, setOpenSnackbarUpdate] = useState(false); // Điều khiển Snackbar
  const [snackbarMessageUpdate, setSnackbarMessageUpdate] = useState(""); // Thông báo hiển thị trong Snackbar
  // Hàm tải mã QR cho sản phẩm chi tiết
  const handleDownloadQRCode = async (productDetailId) => {
    try {
      // Kiểm tra nếu sản phẩm chi tiết đã có trong chiTietList
      const productDetail = chiTietList.find(
        (item) => item.id === productDetailId
      );
      if (!productDetail) {
        alert("Sản phẩm chi tiết không tồn tại.");
        return;
      }

      // Lấy mã sản phẩm chi tiết
      const response = await axios.get(
        `http://localhost:8080/api/qr-code/${productDetailId}`,
        {
          responseType: "arraybuffer", // Để nhận dữ liệu hình ảnh dưới dạng binary
        }
      );

      const blob = new Blob([response.data], { type: "image/png" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${productDetail.ma}.png`; // Tên file là mã sản phẩm
      link.click();
    } catch (error) {
      console.error("Lỗi khi tải mã QR:", error);
      alert("Có lỗi khi tải mã QR.");
    }
  };
  const fetchSanPhamChiTietById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/sanpham/by-san-pham/${id}`,
        {
          params: {
            page: page - 1,
            size: itemsPerPage,
          },
        }
      );
      setChiTietList(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết theo ID:", error);
    }
  };

  // Hàm lấy tất cả sản phẩm chi tiết
  const fetchAllSanPhamChiTiet = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/sanpham/chi-tiet/all",
        {
          params: {
            page: page - 1,
            size: itemsPerPage,
          },
        }
      );
      setChiTietList(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết:", error);
    }
  };

  // useEffect để gọi API khi id, page, hoặc itemsPerPage thay đổi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!showAllDetails) {
          // Nếu không hiển thị toàn bộ sản phẩm, lấy theo ID sản phẩm cha
          await fetchSanPhamChiTietById(id);
        } else {
          // Nếu hiển thị toàn bộ, lấy tất cả sản phẩm chi tiết
          await fetchAllSanPhamChiTiet();
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết:", error);
        setChiTietList([]);
      } finally {
        setLoading(false);
      }
    };
    console.log("danh sách:", chiTietList);
    fetchData();
  }, [id, page, itemsPerPage, showAllDetails]); // Gọi lại khi id, page, itemsPerPage, showAllDetails thay đổi

  const handleShowAllToggle = () => {
    setShowAllDetails(!showAllDetails);
    setPage(1); // Khi đổi trạng thái, reset lại trang về 1

    setSnackbarMessage(
      !showAllDetails
        ? "Đang hiển thị toàn bộ sản phẩm chi tiết."
        : "Đã ẩn sản phẩm chi tiết."
    );
    setOpenSnackbar(true);
  };
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const fieldLabels = {
    thuongHieu: "Thương Hiệu",
    danhMuc: "Danh Mục",
    phongCach: "Phong Cách",
    chatLieu: "Chất Liệu",
    xuatXu: "Xuất Xứ",
    mauSac: "Màu Sắc",
    size: "Kích Cỡ",
    kieuDang: "Kiểu Dáng",
    kieuDaiQuan: "Kiểu Đai Quần",
  };
  // đổ danh mục
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/danhmuc")
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
      .get("http://localhost:8080/api/chatlieu/all")
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
        console.log("Kiểu Dáng APi Response:", res.data);
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
    axios
      .get("http://localhost:8080/api/kieudaiquan")
      .then((response) => {
        setKieuDaiQuans(response.data);
        console.log(response.data); // Kiểm tra xem dữ liệu có được tải chính xác không
      })
      .catch((error) => {
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
        setColors(res.data);
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

  // update
  const handlePriceChange = (event, newValue) => {
    setFilters({ ...filters, priceRange: newValue });
    setPage(1);
  };
  // Hàm xử lý thay đổi số lượng và giá
  // Hàm xử lý khi thay đổi checkbox "Chọn tất cả"
  const handleSelectAllChange = (event) => {
    if (event.target.checked) {
      // Chọn tất cả các item
      const allItemIds = chiTietList.map((item) => item.id);
      setSelectedItems(allItemIds);
    } else {
      // Bỏ chọn tất cả các item
      setSelectedItems([]);
    }
    setSelectAll(event.target.checked); // Cập nhật trạng thái "Chọn tất cả"
  };

  // Hàm xử lý khi thay đổi checkbox của một item cụ thể
  const handleCheckboxChange = (itemId) => {
    const newSelectedItems = [...selectedItems];
    if (newSelectedItems.includes(itemId)) {
      // Nếu đã chọn, bỏ chọn
      const index = newSelectedItems.indexOf(itemId);
      newSelectedItems.splice(index, 1);
    } else {
      // Nếu chưa chọn, chọn
      newSelectedItems.push(itemId);
    }
    setSelectedItems(newSelectedItems);
  };
  const isAllSelected = selectedItems.length === chiTietList.length;
  // Hàm xử lý thay đổi số lượng hoặc giá của từng sản phẩm
  const handleInputChange = (e, itemId, field) => {
    const value = e.target.value;

    setChiTietList((prevList) =>
      prevList.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };

          // Kiểm tra nếu trường thay đổi là số lượng
          if (field === "soLuong") {
            if (value == 0) {
              // Nếu số lượng = 0, cập nhật trạng thái thành "Hết hàng"
              updatedItem.trangThai = "Hết hàng";
            } else {
              // Nếu số lượng > 0, trạng thái sẽ trở lại trạng thái của sản phẩm cha hoặc trạng thái "Hoạt động"
              updatedItem.trangThai =
                item.trangThai !== "Ngừng bán" ? "Hoạt động" : "Ngừng bán";
            }
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
        pages.push(
          <Button
            key={i}
            variant={i === page ? "contained" : "text"}
            onClick={() => setPage(i)}
            sx={{
              minWidth: "36px",
              height: "38px",
              borderRadius: "55%",
              mx: 0.5,
              "&:hover": { backgroundColor: "#ddd" },
            }}
          >
            {i}
          </Button>
        );
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  // Hàm để xử lý sự kiện khi thay đổi số lượng và giá chung
  const handleCommonInputChange = (e, type) => {
    const value = e.target.value;
    if (type === "quantity") {
      setCommonQuantity(value);
      // Cập nhật số lượng của các sản phẩm đã chọn
      selectedItems.forEach((itemId) => {
        setChiTietList((prevList) =>
          prevList.map((item) =>
            item.id === itemId ? { ...item, soLuong: value } : item
          )
        );
      });
    } else if (type === "price") {
      setCommonPrice(value);
      // Cập nhật giá của các sản phẩm đã chọn
      selectedItems.forEach((itemId) => {
        setChiTietList((prevList) =>
          prevList.map((item) =>
            item.id === itemId ? { ...item, gia: value } : item
          )
        );
      });
    }
  };
  const handleEdit = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/san-pham-chi-tiet/${id}`
      );

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Phản hồi không phải JSON: ${contentType}`);
      }

      const productDetails = await response.json();
      console.log("Dữ liệu sản phẩm:", productDetails);

      setSelectedItem({
        ...productDetails,
        anhUrlsOriginal: productDetails.anhUrls || [],
        anhSanPhams: productDetails.anhSanPhams || [], // cần API trả về trường này
      });

      setOpen(true);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setSnackbarMessage("Không thể lấy dữ liệu sản phẩm!");
      setOpenSnackbar(true);
    }
  };

  const handleSave = async () => {
    const anhUrlsCurrent = selectedItem.anhUrls || [];
    const anhUrlsOriginal = selectedItem.anhUrlsOriginal || [];
    const anhSanPhamList = selectedItem.anhSanPhams || [];

    // Ảnh mới được thêm
    const anhUrlsToAdd = anhUrlsCurrent.filter(
      (url) => !anhUrlsOriginal.includes(url)
    );

    // Ảnh bị xóa
    const anhUrlsToDelete = anhUrlsOriginal.filter(
      (url) => !anhUrlsCurrent.includes(url)
    );

    // Lấy danh sách ID ảnh cần xóa (nếu có danh sách ảnh đầy đủ trong selectedItem)
    const anhIdsToDelete = anhSanPhamList
      .filter(
        (anh) =>
          anhUrlsToDelete.includes(anh.anhUrl) &&
          anh.sanPhamChiTietId === selectedItem.id
      )
      .map((anh) => anh.id);

    const payload = {
      ...selectedItem,
      anhUrlsToAdd,
      anhIdsToDelete,
    };

    console.log("Payload gửi lên:", payload);

    try {
      // Gọi API cập nhật
      await axios.put(
        `http://localhost:8080/api/san-pham-chi-tiet/update/${selectedItem.id}`,
        payload
      );

      // Gọi API lấy lại chi tiết sản phẩm vừa cập nhật
      const detailResponse = await axios.get(
        `http://localhost:8080/api/san-pham-chi-tiet/${selectedItem.id}`
      );

      const updatedDetail = detailResponse.data;

      // Cập nhật danh sách sản phẩm chi tiết
      setChiTietList((prevList) =>
        prevList.map((item) =>
          item.id === selectedItem.id ? { ...item, ...updatedDetail } : item
        )
      );

      handleClose();
      setSnackbarMessage1("Cập nhật sản phẩm chi tiết thành công!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      setSnackbarMessage1("Cập nhật sản phẩm chi tiết thất bại!");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedAnhUrls = selectedItem.anhUrls.filter((_, i) => i !== index);
    setSelectedItem((prev) => ({
      ...prev,
      anhUrls: updatedAnhUrls,
    }));
  };

  const handleCloseModalAnh = () => {
    setOpenModalAnh(false); // Đóng modal
  };

  const handleAddProductImages = (selectedImages) => {
    // Lấy danh sách ảnh mới từ selectedImages
    const imageUrls = selectedImages.map((image) => image.secure_url);

    // Cập nhật lại danh sách ảnh cho sản phẩm chi tiết mà không thay thế ảnh cũ
    setSelectedItem((prevState) => ({
      ...prevState,
      anhUrls: [...prevState.anhUrls, ...imageUrls], // Thêm các ảnh mới vào danh sách ảnh cũ
    }));

    // Cập nhật danh sách sản phẩm chi tiết với các ảnh đã chọn (bao gồm ảnh cũ và mới)
    const updatedProductDetails = productDetails.map((detail) => {
      if (detail.id === selectedProductId) {
        return { ...detail, anhUrls: [...detail.anhUrls, ...imageUrls] }; // Thêm ảnh mới vào ảnh cũ
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
      setSelectedImages((prevImages) => [...prevImages, image]); // Thêm ảnh vào selectedImages
    } else {
      console.log("Xóa ảnh:", image); // Debug: Kiểm tra ảnh bị xóa
      setSelectedImages(
        (prevImages) =>
          prevImages.filter((img) => img.public_id !== image.public_id) // Loại bỏ ảnh khỏi selectedImages
      );
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
  const handleClose = () => {
    setOpen(false); // Chỉ đóng khi người dùng nhấn "Hủy"
  };
  // tìm kiếm
  // Gọi API khi tìm kiếm
  const handleSearch = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    // Tìm kiếm trong toàn bộ danh sách sản phẩm chi tiết
    const filtered = chiTietList.filter((item) =>
      item.tenSanPham.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredList(filtered);
 
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!showAllDetails) {
          // Nếu không hiển thị toàn bộ sản phẩm, lấy theo ID sản phẩm cha
          await fetchSanPhamChiTietById(id);
        } else {
          // Nếu hiển thị toàn bộ, lấy tất cả sản phẩm chi tiết
          await fetchAllSanPhamChiTiet();
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết:", error);
        setChiTietList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, page, itemsPerPage, showAllDetails]); // Gọi lại khi id, page, itemsPerPage, showAllDetails thay đổi
  
  // useEffect để gọi hàm tìm kiếm mỗi khi searchTerm thay đổi
  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setFilteredList(chiTietList); // Nếu không có tìm kiếm, hiển thị toàn bộ sản phẩm
    }
  }, [searchTerm, chiTietList]); // Thay đổi khi tìm kiếm hoặc danh sách sản phẩm chi tiết thay đổi
  
  // Phân trang các kết quả tìm kiếm
  const paginatedList = filteredList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  

  // cập nhật số lượng và giá
  const handleUpdateProducts = async () => {
    // Khởi tạo đối tượng updatedProducts chỉ chứa các trường thay đổi
    const updatedProducts = selectedItems.map((id) => {
      let updatedProduct = { id };

      // Chỉ thêm soLuong nếu nó khác giá trị ban đầu
      if (commonQuantity !== 0) {
        updatedProduct.soLuong = commonQuantity;
      }

      // Chỉ thêm gia nếu nó khác giá trị ban đầu
      if (commonPrice !== 0) {
        updatedProduct.gia = commonPrice;
      }

      return updatedProduct;
    });

    try {
      const response = await fetch(
        "http://localhost:8080/api/san-pham-chi-tiet/batch",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProducts),
        }
      );

      if (response.ok) {
        setSnackbarMessageUpdate("Cập nhật số lượng và/hoặc giá thành công");
        setOpenSnackbarUpdate(true);

        // Reload lại trang sau khi cập nhật thành công
        window.location.reload();
      } else {
        setSnackbarMessageUpdate("Cập nhật thất bại, vui lòng thử lại!");
        setOpenSnackbarUpdate(true);
      }
    } catch (error) {
      setSnackbarMessageUpdate("Đã xảy ra lỗi khi cập nhật sản phẩm");
      setOpenSnackbarUpdate(true);
    }
  };

  const handleCloseSnackbarUpate = () => {
    setOpenSnackbarUpdate(false);
  };
  return (
    <Container maxWidth="lg">
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Chi Tiết Sản Phẩm</Typography>
      </Grid>
      <Button
        color="black"
        sx={{ mr: 2 }}
        onClick={() => navigate("/admin/sanpham")}
      >
        <ArrowBack />
      </Button>

      {/* Bộ lọc */}
      <Paper sx={{ padding: 2, mb: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={3}>
            {/* Thêm ô tìm kiếm */}
            <TextField
              label="Tìm kiếm sản phẩm"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>

          {Object.keys(fieldLabels).map((field) => (
            <Grid item xs={6} md={2} key={field}>
              <FormControl fullWidth size="small">
                <Typography variant="caption">{fieldLabels[field]}</Typography>
                <Select
                  name={field}
                  value={filters[field]}
                  onChange={handleFilterChange}
                  displayEmpty
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {Array.isArray(chiTietList) &&
                    chiTietList.length > 0 &&
                    Array.from(
                      new Set(chiTietList.map((item) => item[field]))
                    ).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          ))}

          <Grid item xs={5} md={3}>
            <Typography variant="body2">
              Khoảng giá: {filters.priceRange[0].toLocaleString()} VNĐ -{" "}
              {filters.priceRange[1].toLocaleString()} VNĐ
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={100000}
              max={5000000}
              step={100000}
              sx={{ mt: -1 }}
            />
          </Grid>
        </Grid>
      </Paper>
      {/* Toggle Button */}
      <Paper sx={{ padding: 2, mb: 2 }}>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <TextField
            label="Số Lượng Chung"
            type="number"
            value={commonQuantity}
            onChange={(e) => handleCommonInputChange(e, "quantity")}
            sx={{ width: "150px", height: "20px" }}
          />
          <TextField
            label="Giá Chung"
            type="number"
            value={commonPrice}
            onChange={(e) => handleCommonInputChange(e, "price")}
            sx={{ width: "150px", height: "20px" }}
          />
        </div>

        {/* Sắp xếp các nút thẳng hàng và cách nhau */}
        <Grid container justifyContent="flex-start" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => setShowAllDetails(!showAllDetails)}
              sx={{
                backgroundColor: "lightblue",
                "&:hover": { backgroundColor: "lightblue" },
              }}
              startIcon={showAllDetails ? <VisibilityOff /> : <Visibility />}
            >
              {showAllDetails ? "Ẩn chi tiết" : "Hiển thị toàn bộ"}
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
              onClick={handleUpdateProducts}
            >
              Sửa
            </Button>
          </Grid>
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={openSnackbarUpdate}
          autoHideDuration={3000} // Thời gian tự động đóng sau 3 giây
          onClose={handleCloseSnackbarUpate}
          anchorOrigin={{ vertical: "top", horizontal: "right" }} // Đặt vị trí thông báo
        >
          <Alert
            onClose={handleCloseSnackbarUpate}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessageUpdate}
          </Alert>
        </Snackbar>
      </Paper>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div>
            {/* Bảng hiển thị sản phẩm */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isAllSelected} // Đảm bảo checkbox "Chọn tất cả" được chọn nếu tất cả các item được chọn
                        onChange={handleSelectAllChange} // Gọi hàm xử lý "Chọn tất cả"
                      />
                    </TableCell>
                    <TableCell>
                      <strong>STT</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Mã SP Chi Tiết</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Tên Sản Phẩm</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Danh Mục</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Thương Hiệu</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Phong Cách</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Chất Liệu</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Màu Sắc</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Kích Cỡ</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Kiểu Dáng</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Kiểu Đai Quần</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Xuất Xứ</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Số Lượng</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Giá</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Trạng Thái</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Ảnh</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Hành Dộng</strong>
                    </TableCell>
                    <TableCell>Download QR</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={17} align="center">
                        Không có dữ liệu phù hợp
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredList.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                        </TableCell>
                        <TableCell>{(page - 1) * 5 + index + 1}</TableCell>
                        <TableCell>{item.ma}</TableCell>
                        <TableCell>
                          {item.tenSanPham || "Chưa có tên sản phẩm"}
                        </TableCell>
                        <TableCell>
                          {item.danhMuc?.tenDanhMuc || "Chưa có danh mục"}
                        </TableCell>
                        <TableCell>
                          {item.thuongHieu?.tenThuongHieu ||
                            "Chưa có thương hiệu"}
                        </TableCell>
                        <TableCell>
                          {item.phongCach?.tenPhongCach || "Chưa có phong cách"}
                        </TableCell>
                        <TableCell>
                          {item.chatLieu?.tenChatLieu || "Chưa có chất liệu"}
                        </TableCell>
                        <TableCell>
                          {item.mauSac?.tenMauSac || "Chưa có màu sắc"}
                        </TableCell>
                        <TableCell>
                          {item.size?.tenSize || "Chưa có kích cỡ"}
                        </TableCell>
                        <TableCell>
                          {item.kieuDang?.tenKieuDang || "Chưa có kiểu dáng"}
                        </TableCell>
                        <TableCell>
                          {item.kieuDaiQuan?.tenKieuDaiQuan ||
                            "Chưa có kiểu đai quần"}
                        </TableCell>
                        <TableCell>
                          {item.xuatXu?.tenXuatXu || "Chưa có xuất xứ"}
                        </TableCell>

                        <TableCell>
                          <input
                            type="number"
                            value={item.soLuong}
                            onChange={(e) =>
                              handleInputChange(e, item.id, "soLuong")
                            }
                            style={{ width: "70px", padding: "4px" }}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="number"
                            value={item.gia}
                            onChange={(e) =>
                              handleInputChange(e, item.id, "gia")
                            }
                            style={{ width: "90px", padding: "4px" }}
                          />
                        </TableCell>
                        <TableCell>
                          {item.trangThai ||
                            item.sanPhamTrangThai ||
                            "Không xác định"}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            {item.anhUrls?.slice(0, 3).map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt={`Ảnh ${i + 1}`}
                                style={{
                                  width: 50,
                                  height: 50,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                  border: "1px solid #ccc",
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Edit />}
                            onClick={() => handleEdit(item.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDownloadQRCode(item.id)}
                          >
                            Download QR
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Modal chỉnh sửa */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
              <DialogTitle>Chỉnh Sửa Sản Phẩm</DialogTitle>
              <DialogTitle>
                Sản phẩm chi tiết-Mã: {selectedItem?.ma || "Chưa có mã"}
              </DialogTitle>
              <DialogContent>
                {selectedItem && (
                  <>
                    {/* Hàng 1: Danh Mục, Thương Hiệu, Phong Cách, Chất Liệu */}
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Danh Mục</InputLabel>
                          <Select
                            value={selectedItem?.danhMucId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                danhMucId: e.target.value,
                              }))
                            }
                          >
                            {danhMucs.map((dm) => (
                              <MenuItem key={dm.id} value={dm.id}>
                                {dm.tenDanhMuc}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Thương Hiệu</InputLabel>
                          <Select
                            value={selectedItem?.thuongHieuId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                thuongHieuId: e.target.value,
                              }))
                            }
                          >
                            {thuongHieus.map((th) => (
                              <MenuItem key={th.id} value={th.id}>
                                {th.tenThuongHieu}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Phong Cách</InputLabel>
                          <Select
                            value={selectedItem?.phongCachId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                phongCachId: e.target.value,
                              }))
                            }
                          >
                            {phongCachs.map((pc) => (
                              <MenuItem key={pc.id} value={pc.id}>
                                {pc.tenPhongCach}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Chất Liệu</InputLabel>
                          <Select
                            value={selectedItem?.chatLieuId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                chatLieuId: e.target.value,
                              }))
                            }
                          >
                            {chatLieus.map((cl) => (
                              <MenuItem key={cl.id} value={cl.id}>
                                {cl.tenChatLieu}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* Hàng 2: Kiểu Dáng, Kiểu Đai Quần, Xuất Xứ */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>Kiểu Dáng</InputLabel>
                          <Select
                            value={selectedItem?.kieuDangId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                kieuDangId: e.target.value,
                              }))
                            }
                          >
                            {kieuDangs.map((kd) => (
                              <MenuItem key={kd.id} value={kd.id}>
                                {kd.tenKieuDang}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>Kiểu Đai Quần</InputLabel>
                          <Select
                            value={selectedItem?.kieuDaiQuanId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                kieuDaiQuanId: e.target.value,
                              }))
                            }
                          >
                            {kieuDaiQuans.map((kdq) => (
                              <MenuItem key={kdq.id} value={kdq.id}>
                                {kdq.tenKieuDaiQuan}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>Xuất Xứ</InputLabel>
                          <Select
                            value={selectedItem?.xuatXuId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                xuatXuId: e.target.value,
                              }))
                            }
                          >
                            {xuatXus.map((xx) => (
                              <MenuItem key={xx.id} value={xx.id}>
                                {xx.tenXuatXu}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* Hàng 3: Màu Sắc, Kích Cỡ, Số Lượng, Giá */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Màu Sắc</InputLabel>
                          <Select
                            value={selectedItem?.mauSacId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                mauSacId: e.target.value,
                              }))
                            }
                          >
                            {colors.map((mauSac) => (
                              <MenuItem key={mauSac.id} value={mauSac.id}>
                                {mauSac.tenMauSac}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Kích Cỡ</InputLabel>
                          <Select
                            value={selectedItem?.sizeId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                sizeId: e.target.value,
                              }))
                            }
                          >
                            {sizes.map((s) => (
                              <MenuItem key={s.id} value={s.id}>
                                {s.tenSize}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Số Lượng"
                          type="number"
                          value={selectedItem.soLuong}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              soLuong: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Giá Bán"
                          type="number"
                          value={selectedItem.gia}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              gia: e.target.value,
                            })
                          }
                        />
                      </Grid>
                    </Grid>

                    {/* Hàng 4: Mô Tả */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Mô Tả"
                          multiline
                          rows={3}
                          value={selectedItem.moTa}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              moTa: e.target.value,
                            })
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {/* ảnh sản phẩm  */}

                      <Grid item xs={12}>
                        <Typography variant="h6">
                          Ảnh Sản Phẩm Chi Tiết
                        </Typography>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)", // 5 ảnh trên mỗi hàng
                            gap: 2,
                          }}
                        >
                          {selectedItem.anhUrls &&
                            selectedItem.anhUrls.map((url, index) => (
                              <Box
                                key={index}
                                sx={{
                                  position: "relative",
                                  width: "100px",
                                  height: "100px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={url}
                                  alt={`Ảnh ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <IconButton
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                    color: "white",
                                    "&:hover": {
                                      backgroundColor: "rgba(255,0,0,0.7)",
                                    },
                                  }}
                                  onClick={() => handleDeleteImage(index)}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            ))}

                          {/* Nút Chọn Ảnh nếu chưa đủ 5 ảnh trên hàng */}
                          {selectedItem.anhUrls &&
                            selectedItem.anhUrls.length % 5 !== 0 && (
                              <Box
                                sx={{
                                  width: "100px",
                                  height: "100px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "8px",
                                  border: "1px dashed #ccc",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleOpenModalAnh(id)}
                              >
                                <AddIcon />
                              </Box>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Hủy
                </Button>
                <Button
                  onClick={handleSave}
                  color="primary"
                  variant="contained"
                >
                  Lưu
                </Button>
              </DialogActions>
            </Dialog>

            {/* Modal chọn ảnh */}
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
                  <p style={{ color: "red" }}>
                    Bạn chỉ có thể chọn tối đa 6 ảnh.
                  </p>
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
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
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
                  <div
                    style={{ display: "flex", gap: "10px", marginLeft: "auto" }}
                  >
                    <Button
                      onClick={() => handleAddProductImages(selectedImages)}
                    >
                      Lưu
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={() => setOpenSnackbar(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert severity="success">{snackbarMessage1}</Alert>
            </Snackbar>
          </div>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            mt={2}
          >
            <Box display="flex" alignItems="center">
              <Typography mr={2}>Xem</Typography>
              <Select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(e.target.value)}
                sx={{
                  height: "32px", // Giảm chiều cao
                  minWidth: "60px",
                  borderRadius: "8px",
                  "&.Mui-focused": {
                    borderColor: "#1976D2", // Màu xanh dương khi chọn
                    borderWidth: "2px",
                  },
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>

              <Typography ml={2}>Sản phẩm chi tiết</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft />
              </IconButton>
              {renderPageNumbers()}
              <IconButton
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
        </>
      )}

      {/* Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Hiển thị ở góc phải trên
      >
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default SanPhamChiTiet;
