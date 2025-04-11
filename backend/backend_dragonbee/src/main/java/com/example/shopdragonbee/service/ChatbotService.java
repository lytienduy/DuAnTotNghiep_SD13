package com.example.shopdragonbee.service;

import com.example.shopdragonbee.entity.PhieuGiamGia;
import com.example.shopdragonbee.entity.PhieuGiamGiaKhachHang;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.PhieuGiamGiaKhachHangRepository;
import com.example.shopdragonbee.repository.PhieuGiamGiaRepository;
import com.example.shopdragonbee.repository.SanPhamRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.shopdragonbee.repository.SanPhamChiTietRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import okhttp3.*;

import java.io.IOException;
import java.text.NumberFormat;
import java.util.*;

@Service
public class ChatbotService {
    private static final String API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String API_KEY = ""; // Replace with actual API key

    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

    @Autowired
    private PhieuGiamGiaKhachHangRepository phieuGiamGiaKhachHangRepository;

    public String chatWithBot(String userMessage) throws IOException {
        OkHttpClient client = new OkHttpClient();
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, "{"
                + "\"model\":\"gpt-4o-mini\","
                + "\"messages\":[{\"role\":\"user\",\"content\":\"" + userMessage + "\"}]"
                + "}");
        Request request = new Request.Builder()
                .url(API_URL)
                .post(body)
                .addHeader("Authorization", "Bearer " + API_KEY)
                .addHeader("Content-Type", "application/json")
                .build();

        Response response = client.newCall(request).execute();
        String jsonResponse = response.body().string();

        // Phân tích nội dung phản hồi từ GPT-4o mini
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        String botResponseContent = rootNode
                .path("choices")
                .get(0)
                .path("message")
                .path("content")
                .asText();

        // Phân tích câu hỏi của người dùng và trích xuất các thuộc tính
        Map<String, String> attributes = analyzeUserMessage(userMessage);

        // Truy vấn CSDL để lấy sản phẩm liên quan
        List<SanPhamChiTiet> productDetails = queryProducts(attributes);

// Nếu user hỏi về voucher/khuyến mãi
        if (attributes.containsKey("voucher")) {
            return buildVoucherResponse(userMessage);  // Viết riêng hàm này ở dưới
        }

        String productResponse = buildBotResponse(productDetails, attributes);

        return productResponse;

    }

    private Map<String, String> analyzeUserMessage(String message) {
        Map<String, String> attributes = new HashMap<>();

        // Convert to lowercase to make parsing easier
        String lowerMessage = message.toLowerCase();

        // Danh sách ví dụ các màu
        if (lowerMessage.contains("đen")) attributes.put("color", "Đen");
        if (lowerMessage.contains("trắng")) attributes.put("color", "Trắng");
        if (lowerMessage.contains("xanh")) attributes.put("color", "Xanh");
        if (lowerMessage.contains("đỏ")) attributes.put("color", "Đỏ");
        if (lowerMessage.contains("be")) attributes.put("color", "Be");
        if (lowerMessage.contains("ghi")) attributes.put("color", "Ghi");

        // Danh sách ví dụ các size
        if (lowerMessage.contains("size 28") || lowerMessage.contains("sz 28")) attributes.put("size", "28");
        if (lowerMessage.contains("size 30") || lowerMessage.contains("sz 30")) attributes.put("size", "30");
        if (lowerMessage.contains("size 32") || lowerMessage.contains("sz 32")) attributes.put("size", "32");
        if (lowerMessage.contains("size 34") || lowerMessage.contains("sz 34")) attributes.put("size", "34");
        if (lowerMessage.contains("size 36") || lowerMessage.contains("sz 36")) attributes.put("size", "36");

        // Danh mục
        if (lowerMessage.contains("business")) attributes.put("category", "Business");
        if (lowerMessage.contains("golf")) attributes.put("category", "Golf");
        if (lowerMessage.contains("casual")) attributes.put("category", "Casual");

        // Thương hiệu (ví dụ)
        if (lowerMessage.contains("uniqlo")) attributes.put("brand", "Uniqlo");
        if (lowerMessage.contains("zara")) attributes.put("brand", "Zara");
        if (lowerMessage.contains("h&m")) attributes.put("brand", "H&M");
        if (lowerMessage.contains("levi")) attributes.put("brand", "Levi");
        if (lowerMessage.contains("gap")) attributes.put("brand", "Gap");

        // Xuất xứ
        if (lowerMessage.contains("việt nam")) attributes.put("origin", "Việt Nam");
        if (lowerMessage.contains("hàn quốc")) attributes.put("origin", "Hàn Quốc");
        if (lowerMessage.contains("trung quốc")) attributes.put("origin", "Trung Quốc");
        if (lowerMessage.contains("thái lan")) attributes.put("origin", "Thái Lan");
        if (lowerMessage.contains("nhật bản")) attributes.put("origin", "Nhật Bản");

        // Chất liệu
        if (lowerMessage.contains("cotton")) attributes.put("material", "Cotton");
        if (lowerMessage.contains("polyester")) attributes.put("material", "Polyester");
        if (lowerMessage.contains("poly")) attributes.put("material", "Polyester");
        if (lowerMessage.contains("wool")) attributes.put("material", "Wool");
        if (lowerMessage.contains("lụa")) attributes.put("material", "Lụa");

        // Kiểu dáng
        if (lowerMessage.contains("ôm")) attributes.put("style", "Quần Âu Ôm");
        if (lowerMessage.contains("rộng")) attributes.put("style", "Quần Âu Rộng");
        if (lowerMessage.contains("cổ điển")) attributes.put("style", "Quần Âu Cổ Điển");
        if (lowerMessage.contains("classic")) attributes.put("style", "Quần Âu Cổ Điển");
        if (lowerMessage.contains("lưng cao")) attributes.put("style", "Quần Âu Lưng Cao");
        if (lowerMessage.contains("xếp ly")) attributes.put("style", "Quần Âu Xếp Ly");

        // Sản phẩm mới
        if (lowerMessage.contains("mới") || lowerMessage.contains("sản phẩm mới")) {
            attributes.put("newest", "true");
        }

        // Sản phẩm bán chạy
        if (lowerMessage.contains("bán chạy") || lowerMessage.contains("hot") || lowerMessage.contains("phổ biến") || lowerMessage.contains("Quần âu bán chạy")) {
            attributes.put("bestSeller", "true");
        }

        // Truy vấn liên quan đến khuyến mãi / voucher
        if (lowerMessage.contains("khuyến mãi") || lowerMessage.contains("khuyến mại") || lowerMessage.contains("voucher") || lowerMessage.contains("phiếu giảm giá")) {
            attributes.put("voucher", "true");
        }

        return attributes;
    }

    private List<SanPhamChiTiet> queryProducts(Map<String, String> attributes) {
        Set<SanPhamChiTiet> resultSet = null;

        for (Map.Entry<String, String> entry : attributes.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            List<SanPhamChiTiet> tempResult = new ArrayList<>();

            switch (key) {
                case "color":
                    tempResult = sanPhamChiTietRepository.findByMauSac_TenMauSac(value);
                    break;
                case "size":
                    tempResult = sanPhamChiTietRepository.findBySize_TenSize(value);
                    break;
                case "brand":
                    tempResult = sanPhamChiTietRepository.findByThuongHieu_TenThuongHieu(value);
                    break;
                case "material":
                    tempResult = sanPhamChiTietRepository.findByChatLieu_TenChatLieu(value);
                    break;
                case "origin":
                    tempResult = sanPhamChiTietRepository.findByXuatXu_TenXuatXu(value);
                    break;
                case "category":
                    tempResult = sanPhamChiTietRepository.findByDanhMuc_TenDanhMuc(value);
                    break;
                case "style":
                    tempResult = sanPhamChiTietRepository.findByPhongCach_TenPhongCach(value);
                    break;
                case "kieuDang":
                    tempResult = sanPhamChiTietRepository.findByKieuDang_TenKieuDang(value);
                    break;
                case "kieuDaiQuan":
                    tempResult = sanPhamChiTietRepository.findByKieuDaiQuan_TenKieuDaiQuan(value);
                    break;
                case "newest":
                    if (attributes.size() == 1) {
                        List<SanPham> newestSanPhams = sanPhamRepository.findTop3ByOrderByNgayTaoDesc();

                        List<SanPhamChiTiet> result = new ArrayList<>();
                        for (SanPham sp : newestSanPhams) {
                            List<SanPhamChiTiet> chiTiets = sp.getSanPhamChiTiets();
                            if (!chiTiets.isEmpty()) {
                                result.add(chiTiets.get(0)); // lấy chi tiết đầu tiên
                            }
                        }
                        return result;
                    }
                    break;
                case "bestSeller":
                    if (attributes.size() == 1) {
                        Pageable topThree = PageRequest.of(0, 3);
                        List<Object[]> topSelling = sanPhamChiTietRepository.findTopBestSellingProducts(topThree);

                        List<SanPhamChiTiet> result = new ArrayList<>();
                        for (Object[] row : topSelling) {
                            SanPhamChiTiet spct = (SanPhamChiTiet) row[0];
                            result.add(spct);
                        }

                        return result;
                    }
                    break;
                case "voucher":
                    // Xử lý riêng, không trả về danh sách sản phẩm
                    return null;  // Trả về null để xử lý đặc biệt trong `chatWithBot`

                default:
                    break;
            }

            if (!tempResult.isEmpty()) {
                if (resultSet == null) {
                    resultSet = new HashSet<>(tempResult);
                } else {
                    resultSet.retainAll(tempResult); // giao các kết quả
                }
            }
        }

        return resultSet != null ? new ArrayList<>(resultSet) : new ArrayList<>();
    }

    private String buildBotResponse(List<SanPhamChiTiet> products, Map<String, String> attributes) {
        if (products.isEmpty()) {
            return "Xin lỗi, không tìm thấy sản phẩm phù hợp với yêu cầu của bạn.";
        }

        StringBuilder response = new StringBuilder("Đây là những chiếc quần âu");
        if (attributes.containsKey("color")) response.append(" màu ").append(attributes.get("color"));
        if (attributes.containsKey("size")) response.append(", size ").append(attributes.get("size"));
        if (attributes.containsKey("brand")) response.append(", thương hiệu ").append(attributes.get("brand"));
        if (attributes.containsKey("material")) response.append(", chất liệu ").append(attributes.get("material"));
        if (attributes.containsKey("origin")) response.append(", xuất xứ ").append(attributes.get("origin"));
        response.append(" mà bạn quan tâm:\n");

        // Set để theo dõi các sản phẩm cha đã được hiển thị
        Set<Integer> displayedParentIds = new HashSet<>();

        for (SanPhamChiTiet p : products) {
            Integer parentId = p.getSanPham().getId();  // Lấy ID của sản phẩm cha

            // Nếu sản phẩm cha đã được hiển thị rồi thì bỏ qua
            if (displayedParentIds.contains(parentId)) {
                continue;
            }

            // Thêm ID của sản phẩm cha vào Set để đánh dấu đã hiển thị
            displayedParentIds.add(parentId);

            // Xây dựng response cho sản phẩm chi tiết đầu tiên của sản phẩm cha
            response.append("[SP]").append(p.getSanPham().getTenSanPham())  // Đánh dấu để React biết đây là sản phẩm
                    .append("|").append(p.getGia())
                    .append("|").append(p.getListAnh().get(0).getAnhUrl()) // ảnh chính
                    .append("|").append(parentId)  // ID của sản phẩm cha
                    .append("\n");
        }

        return response.toString();
    }

    private String buildVoucherResponse(String userMessage) {
        // Giả sử bạn truyền userId vào cuối message theo định dạng: "voucher <userId>" hoặc "voucher null"
        // Bạn có thể thay bằng cách truyền vào parameter thực sự khi gọi API

        String userIdExtracted = null;
        if (userMessage.contains("userKH=")) {
            userIdExtracted = userMessage.split("userKH=")[1].trim();
        }

        List<PhieuGiamGia> vouchers = new ArrayList<>();

        if (userIdExtracted == null || userIdExtracted.equals("null")) {
            // Người dùng chưa đăng nhập → chỉ lấy phiếu giảm giá công khai
            vouchers = phieuGiamGiaRepository.findByKieuGiamGiaAndTrangThai("Công khai", "Đang diễn ra");
        } else {
            Integer userId = Integer.valueOf(userIdExtracted);

            // Lấy phiếu giảm giá "Cá nhân" của người dùng
            List<PhieuGiamGia> caNhan = phieuGiamGiaKhachHangRepository.findByKhachHang_Id(userId)
                    .stream()
                    .map(PhieuGiamGiaKhachHang::getPhieuGiamGia)
                    .filter(pgg -> "Đang diễn ra".equals(pgg.getTrangThai()))
                    .toList();

            // Lấy phiếu giảm giá công khai
            List<PhieuGiamGia> congKhai = phieuGiamGiaRepository.findByKieuGiamGiaAndTrangThai("Công khai", "Đang diễn ra");

            vouchers.addAll(congKhai);
            vouchers.addAll(caNhan);
        }

        if (vouchers.isEmpty()) {
            return "Hiện tại không có phiếu giảm giá nào đang diễn ra.";
        }

        StringBuilder res = new StringBuilder("Dưới đây là các phiếu giảm giá bạn có thể sử dụng:\n");

        for (PhieuGiamGia pgg : vouchers) {
            StringBuilder line = new StringBuilder();
            line.append("- ").append(pgg.getTenPhieuGiamGia()).append(" (")
                    .append(pgg.getMa()).append("): Giảm ");

            if ("Phần trăm".equalsIgnoreCase(pgg.getLoaiPhieuGiamGia())) {
                line.append(String.format("%.0f", pgg.getGiaTriGiam())) // làm tròn và bỏ .0
                        .append("% (cho đơn từ ")
                        .append(formatCurrency(pgg.getSoTienToiThieu()))
                        .append(" trở lên, tối đa ")
                        .append(formatCurrency(pgg.getSoTienGiamToiDa()))
                        .append(")");
            } else {
                line.append(formatCurrency(pgg.getGiaTriGiam()))
                        .append(" (cho đơn từ ")
                        .append(formatCurrency(pgg.getSoTienToiThieu()))
                        .append(" trở lên)");
            }

            res.append(line).append("\n");
        }


        return res.toString();
    }

    private static String formatCurrency(float amount) {
        NumberFormat formatter = NumberFormat.getInstance(new Locale("vi", "VN"));
        return formatter.format(amount) + " VNĐ";
    }

}
