package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.entity.GioHang;
import com.example.shopdragonbee.entity.GioHangChiTiet;
import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class GioHangService {
    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;
    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;
    @Autowired
    private GioHangRepository gioHangRepository;
    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private GioHangChiTietRepository gioHangChiTietRepository;


    //P
    public List<SPCTDTO.SanPhamCart> getListDanhSachCapNhatSoLuongSanPhamGioHang(Integer idKhachHang, List<SPCTDTO.SanPhamCart> listDanhSachSanPhamCart) {
        //Nếu có khách hàng
        if (idKhachHang != null) {
            List<SPCTDTO.SanPhamCart> listDanhSachSanPhamCartKhachHang = new ArrayList<>();
            List<GioHangChiTiet> listGioHangChiTiet = gioHangChiTietRepository.findByGioHangOrderByNgayTaoDesc(gioHangRepository.getGioHangByKhachHang(khachHangRepository.findById(idKhachHang).get()));
            for (GioHangChiTiet gioHangChiTiet : listGioHangChiTiet
            ) {
                SanPhamChiTiet sanPhamChiTiet = gioHangChiTiet.getSanPhamChiTiet();
                SPCTDTO.SanPhamCart sanPhamCart = new SPCTDTO.SanPhamCart();
                sanPhamCart.setId(sanPhamChiTiet.getSanPham().getId());
                sanPhamCart.setIdSPCT(sanPhamChiTiet.getId());
                if (sanPhamChiTiet.getListAnh().isEmpty() == false) {
                    sanPhamCart.setAnhSPCT(sanPhamChiTiet.getListAnh().get(0).getAnhUrl());
                }
                sanPhamCart.setTenSPCT(sanPhamChiTiet.getSanPham().getTenSanPham() + " " + sanPhamChiTiet.getChatLieu().getTenChatLieu() + " " + sanPhamChiTiet.getThuongHieu().getTenThuongHieu() + " " + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang());
                sanPhamCart.setTenMauSac(sanPhamChiTiet.getMauSac().getTenMauSac());
                sanPhamCart.setTenSize(sanPhamChiTiet.getSize().getTenSize());
                sanPhamCart.setGia(sanPhamChiTiet.getGia());
                sanPhamCart.setQuantity(gioHangChiTiet.getSoLuong());
                //Trừ đi số lượng sản phẩm có trong hd chờ xác nhận của khách hàng
                Integer soLuongTrongHDChoXacNhan = hoaDonChiTietRepository.getSoLuongSanPhamTheoCacHoaDonChoXacNhanCuaKhachHang(sanPhamChiTiet, "Hoạt động", "Chờ xác nhận", khachHangRepository.findById(idKhachHang).get());
                if (sanPhamChiTiet.getSoLuong() - gioHangChiTiet.getSoLuong() - soLuongTrongHDChoXacNhan <= 0) {
                    if (sanPhamChiTiet.getSoLuong() <= 0) {
                        sanPhamCart.setQuantity(0);
                        //Lưu số lượng
                        gioHangChiTiet.setSoLuong(0);
                    } else {
                        //Trừ đi số lượng sản phẩm có trong hd chờ xác nhận của khách hàng
                        sanPhamCart.setQuantity(sanPhamChiTiet.getSoLuong() - soLuongTrongHDChoXacNhan);
                        gioHangChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong() - soLuongTrongHDChoXacNhan);
                    }
                }
                //save sản phẩm cart
                gioHangChiTietRepository.save(gioHangChiTiet);
                listDanhSachSanPhamCartKhachHang.add(sanPhamCart);
            }
            return listDanhSachSanPhamCartKhachHang;
        }

        //Nếu không có khách hàng mà phụ thuộc vào listDanhSachSanPhamCart
        for (SPCTDTO.SanPhamCart sanPhamCart : listDanhSachSanPhamCart
        ) {
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepositoryP.findById(sanPhamCart.getIdSPCT()).get();
            if (sanPhamChiTiet.getSoLuong() - sanPhamCart.getQuantity() <= 0) {
                if (sanPhamChiTiet.getSoLuong() <= 0) {
                    sanPhamCart.setQuantity(0);
                } else {
                    sanPhamCart.setQuantity(sanPhamChiTiet.getSoLuong());
                }
            }
            //Cập nhật giá
            if (sanPhamChiTiet.getGia() != sanPhamCart.getGia()) {
                sanPhamCart.setGia(sanPhamChiTiet.getGia());
            }
        }
        return listDanhSachSanPhamCart;
    }

    public List<SPCTDTO.SanPhamCart> layDuLieuCartVaXoaSanPhamSoLuong0(Integer idKhachHang) {
        try {
            List<SPCTDTO.SanPhamCart> listDanhSachSanPhamCartKhachHang = new ArrayList<>();
            List<GioHangChiTiet> listGioHangChiTiet = gioHangChiTietRepository.findByGioHangOrderByNgayTaoDesc(gioHangRepository.getGioHangByKhachHang(khachHangRepository.findById(idKhachHang).get()));
            for (GioHangChiTiet gioHangChiTiet : listGioHangChiTiet
            ) {
                if (gioHangChiTiet.getSoLuong() <= 0) {
                    gioHangChiTietRepository.delete(gioHangChiTiet);
                } else {
                    SanPhamChiTiet sanPhamChiTiet = gioHangChiTiet.getSanPhamChiTiet();
                    SPCTDTO.SanPhamCart sanPhamCart = new SPCTDTO.SanPhamCart();
                    sanPhamCart.setId(sanPhamChiTiet.getSanPham().getId());
                    sanPhamCart.setIdSPCT(sanPhamChiTiet.getId());
                    if (sanPhamChiTiet.getListAnh().isEmpty() == false) {
                        sanPhamCart.setAnhSPCT(sanPhamChiTiet.getListAnh().get(0).getAnhUrl());
                    }
                    sanPhamCart.setTenSPCT(sanPhamChiTiet.getSanPham().getTenSanPham() + " " + sanPhamChiTiet.getChatLieu().getTenChatLieu() + " " + sanPhamChiTiet.getThuongHieu().getTenThuongHieu() + " " + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang());
                    sanPhamCart.setTenMauSac(sanPhamChiTiet.getMauSac().getTenMauSac());
                    sanPhamCart.setTenSize(sanPhamChiTiet.getSize().getTenSize());
                    sanPhamCart.setGia(sanPhamChiTiet.getGia());//Cập nhật giá rồi
                    sanPhamCart.setQuantity(gioHangChiTiet.getSoLuong());
                    listDanhSachSanPhamCartKhachHang.add(sanPhamCart);
                }
            }
            return listDanhSachSanPhamCartKhachHang;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //P
    public List<SPCTDTO.SanPhamCart> getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang(Integer idKhachHang, List<SPCTDTO.SanPhamCart> listDanhSachSanPhamCart) {
        //Nếu co đăng nhập
        if (idKhachHang != null) {
            List<SPCTDTO.SanPhamCart> listDanhSachSanPhamCartKhachHang = new ArrayList<>();
            List<GioHangChiTiet> listGioHangChiTiet = gioHangChiTietRepository.findByGioHangOrderByNgayTaoDesc(gioHangRepository.getGioHangByKhachHang(khachHangRepository.findById(idKhachHang).get()));

            for (GioHangChiTiet gioHangChiTiet : listGioHangChiTiet
            ) {
                //Viết thêm truy vấn tống sô lượng sản phẩm trong hdct của hóa đơn trạng thái chờ xác nhận theo khách hàng
                SanPhamChiTiet sanPhamChiTiet = gioHangChiTiet.getSanPhamChiTiet();
                SPCTDTO.SanPhamCart sanPhamCart = new SPCTDTO.SanPhamCart();
                sanPhamCart.setId(sanPhamChiTiet.getSanPham().getId());
                sanPhamCart.setIdSPCT(sanPhamChiTiet.getId());
                if (sanPhamChiTiet.getListAnh().isEmpty() == false) {
                    sanPhamCart.setAnhSPCT(sanPhamChiTiet.getListAnh().get(0).getAnhUrl());
                }
                sanPhamCart.setTenSPCT(sanPhamChiTiet.getSanPham().getTenSanPham() + " " + sanPhamChiTiet.getChatLieu().getTenChatLieu() + " " + sanPhamChiTiet.getThuongHieu().getTenThuongHieu() + " " + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang());
                sanPhamCart.setTenMauSac(sanPhamChiTiet.getMauSac().getTenMauSac());
                sanPhamCart.setTenSize(sanPhamChiTiet.getSize().getTenSize());
                sanPhamCart.setGia(sanPhamChiTiet.getGia());
                //Trừ đi số lượng sản phẩm có trong hd chờ xác nhận của khách hàng
                Integer soLuongTrongHDChoXacNhan = hoaDonChiTietRepository.getSoLuongSanPhamTheoCacHoaDonChoXacNhanCuaKhachHang(sanPhamChiTiet, "Hoạt động", "Chờ xác nhận", khachHangRepository.findById(idKhachHang).get());
                sanPhamCart.setQuantity(sanPhamChiTiet.getSoLuong() - gioHangChiTiet.getSoLuong() - soLuongTrongHDChoXacNhan);
                listDanhSachSanPhamCartKhachHang.add(sanPhamCart);
            }
            return listDanhSachSanPhamCartKhachHang;
        }
        //Nếu không có đăng nhập
        for (SPCTDTO.SanPhamCart sanPhamCart : listDanhSachSanPhamCart
        ) {
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepositoryP.findById(sanPhamCart.getIdSPCT()).get();
            sanPhamCart.setQuantity(sanPhamChiTiet.getSoLuong() - sanPhamCart.getQuantity());
        }
        return listDanhSachSanPhamCart;
    }

    public Boolean addVaoGioHangCoDangNhap(Integer idSanPhamChiTiet, Integer soLuong, Double gia, Integer idKhachHang) {
        try {
            KhachHang khachHang = khachHangRepository.findById(idKhachHang).get();
            //Kiểm tra khách hàng đã có giỏ hàng chưa
            GioHang gioHang = gioHangRepository.getGioHangByKhachHang(khachHang);
            if (gioHang == null) {//Nếu chưa thì tạo
                GioHang gioHangKhoiTao = new GioHang();
                gioHangKhoiTao.setMa("GH" + (System.currentTimeMillis() % 100000));
                gioHangKhoiTao.setKhachHang(khachHang);
                gioHangKhoiTao.setNgayTao(LocalDateTime.now());
                gioHangRepository.save(gioHangKhoiTao);
                gioHang = gioHangRepository.getGioHangByKhachHang(khachHang);//set với giỏ hàng mới
            }
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepositoryP.findById(idSanPhamChiTiet).get();
            //Kiểm tra đã có sản phẩm trong giỏ hàng chưa
            GioHangChiTiet gioHangChiTiet = gioHangChiTietRepository.findBySanPhamChiTietAndGioHang(sanPhamChiTiet, gioHang);
            if (gioHangChiTiet == null) {//Nếu chưa thì tạo
                GioHangChiTiet gioHangChiTiet1 = new GioHangChiTiet();
                gioHangChiTiet1.setMa("GHCT" + (System.currentTimeMillis() % 100000));
                gioHangChiTiet1.setGioHang(gioHang);
                gioHangChiTiet1.setSanPhamChiTiet(sanPhamChiTiet);
                gioHangChiTiet1.setSoLuong(soLuong);
                gioHangChiTiet1.setGia(gia);
                gioHangChiTiet1.setNgayTao(LocalDateTime.now());
                gioHangChiTietRepository.save(gioHangChiTiet1);
            } else {//Nếu có rồi thì cộng thêm số lượng
                gioHangChiTiet.setSoLuong(gioHangChiTiet.getSoLuong() + soLuong);
                gioHangChiTietRepository.save(gioHangChiTiet);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Boolean xoaSanPhamKhoiGioHangCoDangNhap(Integer idSanPhamChiTiet, Integer idKhachHang) {
        GioHangChiTiet gioHangChiTiet = gioHangChiTietRepository.findBySanPhamChiTietAndGioHang(
                sanPhamChiTietRepositoryP.findById(idSanPhamChiTiet).get(), gioHangRepository.getGioHangByKhachHang(khachHangRepository.findById(idKhachHang).get())
        );
        if (gioHangChiTiet != null) {
            gioHangChiTietRepository.delete(gioHangChiTiet);
            return true;
        }
        return false;

    }

    public Boolean tangSoLuongSanPhamCoDangNhap(Integer idSanPhamChiTiet, Integer idKhachHang) {
        GioHangChiTiet gioHangChiTiet = gioHangChiTietRepository.findBySanPhamChiTietAndGioHang(
                sanPhamChiTietRepositoryP.findById(idSanPhamChiTiet).get(), gioHangRepository.getGioHangByKhachHang(khachHangRepository.findById(idKhachHang).get())
        );
        if (gioHangChiTiet != null) {
            gioHangChiTiet.setSoLuong(gioHangChiTiet.getSoLuong() + 1);
            gioHangChiTietRepository.save(gioHangChiTiet);
            return true;
        }
        return false;

    }

    public Boolean giamSoLuongSanPhamCoDangNhap(Integer idSanPhamChiTiet, Integer idKhachHang) {
        GioHangChiTiet gioHangChiTiet = gioHangChiTietRepository.findBySanPhamChiTietAndGioHang(
                sanPhamChiTietRepositoryP.findById(idSanPhamChiTiet).get(), gioHangRepository.getGioHangByKhachHang(khachHangRepository.findById(idKhachHang).get())
        );
        if (gioHangChiTiet != null) {
            gioHangChiTiet.setSoLuong(gioHangChiTiet.getSoLuong() - 1);
            gioHangChiTietRepository.save(gioHangChiTiet);
            return true;
        }
        return false;

    }


}
