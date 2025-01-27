CREATE DATABASE ShopDragonBee;
GO

USE ShopDragonBee;
GO

-- Bảng thuong_hieu
CREATE TABLE thuong_hieu (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã thương hiệu
    ten_thuong_hieu NVARCHAR(255) NOT NULL, -- Tên thương hiệu
    mo_ta NVARCHAR(500),                    -- Mô tả thương hiệu
    trang_thai NVARCHAR(50)                 -- Trạng thái thương hiệu
);

-- Bảng mau_sac
CREATE TABLE mau_sac (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã màu sắc
    ten_mau_sac NVARCHAR(100) NOT NULL,         -- Tên màu
    mo_ta NVARCHAR(500),                    -- Mô tả màu
    trang_thai NVARCHAR(50)                 -- Trạng thái màu sắc
);

-- Bảng danh_muc
CREATE TABLE danh_muc (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã danh mục
    ten_danh_muc NVARCHAR(255) NOT NULL,             -- Tên danh mục
    mo_ta NVARCHAR(500),                    -- Mô tả danh mục
    trang_thai NVARCHAR(50)                 -- Trạng thái danh mục
);

-- Bảng size
CREATE TABLE size (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã kích thước
    ten_size NVARCHAR(50) NOT NULL,              -- Tên kích thước
	mo_ta NVARCHAR(500),                    -- Mô tả Kích thước
    trang_thai NVARCHAR(50)                 -- Trạng thái kích thước
);

-- Bảng chat_lieu
CREATE TABLE chat_lieu (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã chất liệu
    ten_chat_lieu NVARCHAR(100) NOT NULL,             -- Tên chất liệu
    mo_ta NVARCHAR(500),                    -- Mô tả chất liệu
    trang_thai NVARCHAR(50)                 -- Trạng thái chất liệu
);

-- Bảng phong_cach
CREATE TABLE phong_cach (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã phong cách
    ten_phong_cach NVARCHAR(100) NOT NULL,             -- Tên phong cách
    mo_ta NVARCHAR(500),                    -- Mô tả phong cách
    trang_thai NVARCHAR(50)                 -- Trạng thái phong cách
);

-- Bảng kieu_dang
CREATE TABLE kieu_dang (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã kiểu dáng
    ten_kieu_dang NVARCHAR(100) NOT NULL,             -- Tên kiểu dáng
    mo_ta NVARCHAR(500),                    -- Mô tả kiểu dáng
    trang_thai NVARCHAR(50)                 -- Trạng thái kiểu dáng
);

-- Bảng kieu_dai_quan
CREATE TABLE kieu_dai_quan (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã kiểu dài quần
    ten_kieu_dai_quan NVARCHAR(100) NOT NULL,             -- Tên kiểu dài quần
    mo_ta NVARCHAR(500),                    -- Mô tả kiểu dài quần
    trang_thai NVARCHAR(50)                 -- Trạng thái kiểu dài quần
);

-- Bảng xuat_xu
CREATE TABLE xuat_xu (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã xuất xứ
    ten_xuat_xu NVARCHAR(100) NOT NULL,             -- Tên quốc gia/xuất xứ
    mo_ta NVARCHAR(500),                    -- Mô tả xuất xứ
    trang_thai NVARCHAR(50)                 -- Trạng thái xuất xứ
);

-- Bảng san_pham
CREATE TABLE san_pham (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã sản phẩm
    ten_san_pham NVARCHAR(255) NOT NULL,    -- Tên sản phẩm
    mo_ta NVARCHAR(500),                    -- Mô tả sản phẩm
    trang_thai NVARCHAR(50),                -- Trạng thái sản phẩm
    ngay_tao DATETIME DEFAULT GETDATE(),    -- Ngày tạo sản phẩm
    ngay_sua DATETIME,                      -- Ngày sửa sản phẩm
    nguoi_tao NVARCHAR(50),                 -- Người tạo bản ghi
    nguoi_sua NVARCHAR(50)                  -- Người sửa bản ghi
);

-- Bảng san_pham_chi_tiet
CREATE TABLE san_pham_chi_tiet (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã sản phẩm chi tiết
    so_luong INT NOT NULL,                  -- Số lượng tồn
    mo_ta NVARCHAR(500),                    -- Mô tả sản phẩm chi tiết
    trang_thai NVARCHAR(50),                -- Trạng thái sản phẩm
    gia FLOAT NOT NULL,                     -- Giá sản phẩm
    id_san_pham INT NOT NULL,               -- FK liên kết với bảng san_pham
    id_mau_sac INT,                         -- FK liên kết với bảng mau_sac
    id_chat_lieu INT,                       -- FK liên kết với bảng chat_lieu
    id_danh_muc INT,                        -- FK liên kết với bảng danh_muc
    id_size INT,                            -- FK liên kết với bảng size
    id_thuong_hieu INT,                     -- FK liên kết với bảng thuong_hieu
    id_kieu_dang INT,                       -- FK liên kết với bảng kieu_dang
    id_kieu_dai_quan INT,                   -- FK liên kết với bảng kieu_dai_quan
    id_xuat_xu INT,                         -- FK liên kết với bảng xuat_xu
    id_phong_cach INT,                      -- FK liên kết với bảng phong_cach
    ngay_tao DATETIME DEFAULT GETDATE(),    -- Ngày tạo
    ngay_sua DATETIME,                      -- Ngày sửa
    nguoi_tao NVARCHAR(50),                 -- Người tạo bản ghi
    nguoi_sua NVARCHAR(50),                 -- Người sửa bản ghi
    FOREIGN KEY (id_san_pham) REFERENCES san_pham(id), -- FK liên kết san_pham
    FOREIGN KEY (id_mau_sac) REFERENCES mau_sac(id),   -- FK liên kết mau_sac
    FOREIGN KEY (id_chat_lieu) REFERENCES chat_lieu(id), -- FK liên kết chat_lieu
    FOREIGN KEY (id_danh_muc) REFERENCES danh_muc(id), -- FK liên kết danh_muc
    FOREIGN KEY (id_size) REFERENCES size(id),         -- FK liên kết size
    FOREIGN KEY (id_thuong_hieu) REFERENCES thuong_hieu(id), -- FK liên kết thuong_hieu
    FOREIGN KEY (id_kieu_dang) REFERENCES kieu_dang(id), -- FK liên kết kieu_dang
    FOREIGN KEY (id_kieu_dai_quan) REFERENCES kieu_dai_quan(id), -- FK liên kết kieu_dai_quan
    FOREIGN KEY (id_xuat_xu) REFERENCES xuat_xu(id),   -- FK liên kết xuat_xu
    FOREIGN KEY (id_phong_cach) REFERENCES phong_cach(id) -- FK liên kết phong_cach
);

-- Bảng ảnh sản phẩm
CREATE TABLE anh_san_pham (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã ảnh sản phẩm
    anh_url NVARCHAR(255) NOT NULL,         -- Đường dẫn ảnh
    mo_ta NVARCHAR(500),                    -- Mô tả ảnh
    trang_thai NVARCHAR(50),                -- Trạng thái ảnh
    id_san_pham_chi_tiet INT NOT NULL,      -- FK liên kết với bảng san_pham_chi_tiet
    FOREIGN KEY (id_san_pham_chi_tiet) REFERENCES san_pham_chi_tiet(id) -- Khóa ngoại
);

-- Bảng vai_tro
CREATE TABLE vai_tro (
    id INT PRIMARY KEY IDENTITY,        -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,    -- Mã vai trò
    ten_vai_tro NVARCHAR(100) NOT NULL, -- Tên vai trò
    trang_thai NVARCHAR(50),            -- Trạng thái vai trò
    ngay_tao DATETIME DEFAULT GETDATE(),-- Ngày tạo vai trò
    ngay_sua DATETIME                   -- Ngày sửa vai trò
);

-- Bảng tai_khoan
CREATE TABLE tai_khoan (
    id INT PRIMARY KEY IDENTITY,                -- ID chính của bảng
    id_vai_tro INT NOT NULL,                    -- FK liên kết với bảng vai_tro
    ten_nguoi_dung NVARCHAR(50) NOT NULL UNIQUE,-- Tên người dùng
    mat_khau NVARCHAR(100) NOT NULL,            -- Mật khẩu
    trang_thai NVARCHAR(50),                    -- Trạng thái tài khoản
    ngay_tao DATETIME DEFAULT GETDATE(),        -- Ngày tạo tài khoản
    ngay_sua DATETIME,                          -- Ngày sửa tài khoản
    nguoi_tao NVARCHAR(50),                     -- Người tạo
    nguoi_sua NVARCHAR(50),                     -- Người sửa
    FOREIGN KEY (id_vai_tro) REFERENCES vai_tro(id) -- Ràng buộc khóa ngoại
);

-- Bảng khach_hang
CREATE TABLE khach_hang (
    id INT PRIMARY KEY IDENTITY,        -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,    -- Mã khách hàng
    ten_khach_hang NVARCHAR(100) NOT NULL, -- Tên khách hàng
    ngay_sinh DATE,                     -- Ngày sinh
    gioi_tinh NVARCHAR(10),             -- Giới tính
    sdt NVARCHAR(15),                   -- Số điện thoại
    email NVARCHAR(100) UNIQUE,         -- Email
    trang_thai NVARCHAR(50),            -- Trạng thái
    ngay_tao DATETIME DEFAULT GETDATE(),-- Ngày tạo
    ngay_sua DATETIME,                  -- Ngày sửa
    nguoi_tao NVARCHAR(50),             -- Người tạo
    nguoi_sua NVARCHAR(50),             -- Người sửa
    id_tai_khoan INT NOT NULL,                   -- FK liên kết với bảng tai_khoan
    FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id) -- Ràng buộc khóa ngoại
);

-- Bảng dia_chi
CREATE TABLE dia_chi (
    id INT PRIMARY KEY IDENTITY,        -- ID chính của bảng
    id_khach_hang INT NOT NULL,         -- FK liên kết với bảng khach_hang
    so_nha NVARCHAR(50),                -- Số nhà
    duong NVARCHAR(100),                -- Đường
    xa NVARCHAR(100),                   -- Xã/Phường
    huyen NVARCHAR(100),                -- Huyện/Quận
    thanh_pho NVARCHAR(100),            -- Thành phố/Tỉnh
    mo_ta NVARCHAR(255),                -- Mô tả địa chỉ
    trang_thai NVARCHAR(50),            -- Trạng thái địa chỉ
    mac_dinh BIT DEFAULT 0,             -- Địa chỉ mặc định (0: không, 1: có)
    ngay_tao DATETIME DEFAULT GETDATE(),-- Ngày tạo
    ngay_sua DATETIME,                  -- Ngày sửa
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id) -- Ràng buộc khóa ngoại
);

-- Bảng nhan_vien
CREATE TABLE nhan_vien (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã nhân viên
    id_tai_khoan INT NOT NULL,              -- FK liên kết với bảng tai_khoan
    ten_nhan_vien NVARCHAR(100) NOT NULL,   -- Tên nhân viên
    ngay_sinh DATE,                         -- Ngày sinh
    gioi_tinh NVARCHAR(10),                 -- Giới tính
    sdt NVARCHAR(15),                       -- Số điện thoại
    email NVARCHAR(100),                    -- Email
    dia_chi NVARCHAR(255),                  -- Địa chỉ
    trang_thai NVARCHAR(50),                -- Trạng thái
    ngay_tao DATETIME DEFAULT GETDATE(),    -- Ngày tạo
    ngay_sua DATETIME,                      -- Ngày sửa
    nguoi_tao NVARCHAR(50),                 -- Người tạo
    nguoi_sua NVARCHAR(50),                 -- Người sửa
    FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id) -- Ràng buộc khóa ngoại
);

-- Bảng gio_hang
CREATE TABLE gio_hang (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã giỏ hàng
    id_khach_hang INT NOT NULL,             -- FK liên kết với bảng khach_hang
    ngay_tao DATETIME DEFAULT GETDATE(),    -- Ngày tạo giỏ hàng
    ngay_sua DATETIME,                      -- Ngày sửa giỏ hàng
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id) -- Ràng buộc khóa ngoại
);

-- Bảng gio_hang_chi_tiet
CREATE TABLE gio_hang_chi_tiet (
    id INT PRIMARY KEY IDENTITY,            -- ID chính của bảng
    ma NVARCHAR(50) NOT NULL UNIQUE,        -- Mã chi tiết giỏ hàng
    id_san_pham_chi_tiet INT NOT NULL,      -- FK liên kết với bảng san_pham_chi_tiet
    id_gio_hang INT NOT NULL,               -- FK liên kết với bảng gio_hang
    so_luong INT NOT NULL,                  -- Số lượng sản phẩm
    gia FLOAT NOT NULL,                     -- Giá sản phẩm
    ngay_tao DATETIME DEFAULT GETDATE(),    -- Ngày tạo
    ngay_sua DATETIME,                      -- Ngày sửa
    FOREIGN KEY (id_san_pham_chi_tiet) REFERENCES san_pham_chi_tiet(id), -- FK sản phẩm chi tiết
    FOREIGN KEY (id_gio_hang) REFERENCES gio_hang(id) -- FK giỏ hàng
);

-- Bảng phieu_giam_gia
CREATE TABLE phieu_giam_gia (
    id INT PRIMARY KEY IDENTITY,             -- ID chính
    ma NVARCHAR(50) NOT NULL UNIQUE,         -- Mã phiếu giảm giá
    ten_phieu_giam_gia NVARCHAR(100),        -- Tên phiếu giảm giá
    loai_phieu_giam_gia NVARCHAR(50),        -- Loại phiếu giảm giá ( loại giảm theo %, hay giá cố định )
    kieu_giam_gia NVARCHAR(50),              -- Kiểu giảm giá (Công khai_cá nhân)
    gia_tri_giam FLOAT,                      -- Giá trị giảm (Nhập giá trị giảm)
    so_tien_toi_thieu FLOAT,                 -- Số tiền tối thiểu để áp dụng
    so_tien_giam_toi_da FLOAT,               -- Số tiền giảm tối đa
    ngay_bat_dau DATETIME,                   -- Ngày bắt đầu áp dụng
    ngay_ket_thuc DATETIME,                  -- Ngày kết thúc áp dụng
    so_luong INT,                            -- Số lượng phiếu
    mo_ta NVARCHAR(255),                     -- Mô tả phiếu
    trang_thai NVARCHAR(50),                 -- Trạng thái phiếu
    ngay_tao DATETIME DEFAULT GETDATE(),     -- Ngày tạo phiếu
    ngay_sua DATETIME,                       -- Ngày sửa phiếu
    nguoi_tao NVARCHAR(50),                  -- Người tạo
    nguoi_sua NVARCHAR(50)                   -- Người sửa
);

-- Bảng phieu_giam_gia_khach_hang
CREATE TABLE phieu_giam_gia_khach_hang (
    id INT PRIMARY KEY IDENTITY,             -- ID chính
    id_khach_hang INT NOT NULL,              -- FK liên kết với bảng khach_hang
    id_phieu_giam_gia INT NOT NULL,          -- FK liên kết với bảng phieu_giam_gia
    trang_thai NVARCHAR(50),                 -- Trạng thái
    ngay_tao DATETIME DEFAULT GETDATE(),     -- Ngày tạo
    ngay_sua DATETIME,                       -- Ngày sửa
    nguoi_tao NVARCHAR(50),                  -- Người tạo
    nguoi_sua NVARCHAR(50),                  -- Người sửa
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id), -- Khóa ngoại
    FOREIGN KEY (id_phieu_giam_gia) REFERENCES phieu_giam_gia(id) -- Khóa ngoại
);


-- Bảng hoa_don
CREATE TABLE hoa_don (
    id INT PRIMARY KEY IDENTITY,             -- ID chính
    ma NVARCHAR(50) NOT NULL UNIQUE,         -- Mã hóa đơn
    id_phieu_giam_gia INT,                   -- FK liên kết với bảng phieu_giam_gia
    id_nhan_vien INT,                        -- FK liên kết với bảng nhan_vien
    id_khach_hang INT NOT NULL,              -- FK liên kết với bảng khach_hang
    loai_don NVARCHAR(50),                   -- Loại đơn hàng
    ghi_chu NVARCHAR(255),                   -- Ghi chú
    ten_nguoi_nhan NVARCHAR(100),            -- Tên người nhận
    sdt NVARCHAR(15),                        -- Số điện thoại người nhận
    email_nguoi_nhan NVARCHAR(100),          -- Email người nhận
    dia_chi_nhan_hang NVARCHAR(255),         -- Địa chỉ nhận hàng
    ngay_nhan_hang DATETIME,                 -- Ngày nhận hàng
    phi_ship FLOAT,                          -- Phí ship
    tong_tien FLOAT NOT NULL,                -- Tổng tiền
    trang_thai NVARCHAR(50),                 -- Trạng thái hóa đơn
    ngay_tao DATETIME DEFAULT GETDATE(),     -- Ngày tạo hóa đơn
    ngay_sua DATETIME,                       -- Ngày sửa hóa đơn
    nguoi_tao NVARCHAR(50),                  -- Người tạo
    nguoi_sua NVARCHAR(50),                  -- Người sửa
    FOREIGN KEY (id_phieu_giam_gia) REFERENCES phieu_giam_gia(id), -- Khóa ngoại
    FOREIGN KEY (id_nhan_vien) REFERENCES nhan_vien(id),           -- Khóa ngoại
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id)          -- Khóa ngoại
);

-- Bảng hoa_don_chi_tiet
CREATE TABLE hoa_don_chi_tiet (
    id INT PRIMARY KEY IDENTITY,             -- ID chính
    ma NVARCHAR(50) NOT NULL UNIQUE,         -- Mã chi tiết hóa đơn
    id_hoa_don INT NOT NULL,                 -- FK liên kết với bảng hoa_don
    id_san_pham_chi_tiet INT NOT NULL,       -- FK liên kết với bảng san_pham_chi_tiet
    so_luong INT NOT NULL,                   -- Số lượng
    don_gia FLOAT NOT NULL,                  -- Đơn giá
    trang_thai NVARCHAR(50),                 -- Trạng thái
    ngay_tao DATETIME DEFAULT GETDATE(),     -- Ngày tạo
    ngay_sua DATETIME,                       -- Ngày sửa
    nguoi_tao NVARCHAR(50),                  -- Người tạo
    nguoi_sua NVARCHAR(50),                  -- Người sửa
    FOREIGN KEY (id_hoa_don) REFERENCES hoa_don(id),               -- Khóa ngoại
    FOREIGN KEY (id_san_pham_chi_tiet) REFERENCES san_pham_chi_tiet(id) -- Khóa ngoại
);

-- Bảng phuong_thuc_thanh_toan
CREATE TABLE phuong_thuc_thanh_toan (
    id INT PRIMARY KEY IDENTITY,             -- ID chính
    ma NVARCHAR(50) NOT NULL UNIQUE,         -- Mã phương thức thanh toán
    ten_phuong_thuc NVARCHAR(100) NOT NULL,  -- Tên phương thức
    trang_thai NVARCHAR(50),                 -- Trạng thái
    ngay_tao DATETIME DEFAULT GETDATE(),     -- Ngày tạo
    ngay_sua DATETIME,                       -- Ngày sửa
    nguoi_tao NVARCHAR(50),                  -- Người tạo
    nguoi_sua NVARCHAR(50)                   -- Người sửa
);

-- Bảng thanh_toan_hoa_don
CREATE TABLE thanh_toan_hoa_don (
    id INT PRIMARY KEY IDENTITY,             -- ID chính
    ma NVARCHAR(50) NOT NULL UNIQUE,         -- Mã thanh toán
    id_hoa_don INT NOT NULL,                 -- FK liên kết với bảng hoa_don
    id_phuong_thuc_thanh_toan INT NOT NULL,  -- FK liên kết với bảng phuong_thuc_thanh_toan
    so_tien_thanh_toan FLOAT NOT NULL,       -- Số tiền thanh toán
    ngay_tao DATETIME DEFAULT GETDATE(),     -- Ngày tạo
    ngay_sua DATETIME,                       -- Ngày sửa
    nguoi_tao NVARCHAR(50),                  -- Người tạo
    nguoi_sua NVARCHAR(50),                  -- Người sửa
    trang_thai NVARCHAR(50),                 -- Trạng thái thanh toán
    ghi_chu NVARCHAR(255),                   -- Ghi chú
    FOREIGN KEY (id_hoa_don) REFERENCES hoa_don(id),               -- Khóa ngoại
    FOREIGN KEY (id_phuong_thuc_thanh_toan) REFERENCES phuong_thuc_thanh_toan(id) -- Khóa ngoại
);

-- Bảng lich_su_hoa_don
CREATE TABLE lich_su_hoa_don (
    id INT PRIMARY KEY IDENTITY,             -- ID chính
    id_hoa_don INT NOT NULL,                 -- FK liên kết với bảng hoa_don
    hanh_dong NVARCHAR(255) NOT NULL,        -- Hành động
    ghi_chu NVARCHAR(255),                   -- Ghi chú
    ngay_tao DATETIME DEFAULT GETDATE(),     -- Ngày tạo
    ngay_sua DATETIME,                       -- Ngày sửa
    nguoi_tao NVARCHAR(50),                  -- Người tạo
    nguoi_sua NVARCHAR(50),                  -- Người sửa
    FOREIGN KEY (id_hoa_don) REFERENCES hoa_don(id) -- Khóa ngoại
);

-- Tạo bảng dot_giam_gia
CREATE TABLE dot_giam_gia (
    id INT PRIMARY KEY IDENTITY(1,1),
    ma_dot_giam_gia NVARCHAR(50) NOT NULL,
    loai_dot_giam_gia NVARCHAR(50),
    ten_dot_giam_gia NVARCHAR(100),
    gia_tri_giam DECIMAL(10, 2),
	trang_thai NVARCHAR(20),
    ngay_bat_dau DATE,
    ngay_ket_thuc DATE,
    ngay_tao DATETIME DEFAULT GETDATE(),
    ngay_sua DATETIME,
    nguoi_tao NVARCHAR(50),
    nguoi_sua NVARCHAR(50)
);

-- Tạo bảng dot_giam_gia_chi_tiet
CREATE TABLE dot_giam_gia_chi_tiet (
    id INT PRIMARY KEY IDENTITY(1,1),
    id_dot_giam_gia INT NOT NULL FOREIGN KEY REFERENCES dot_giam_gia(id),
    id_chi_tiet_san_pham INT NOT NULL,
    trang_thai NVARCHAR(20),
    ngay_tao DATETIME DEFAULT GETDATE(),
    ngay_sua DATETIME,
    nguoi_tao NVARCHAR(50),
    nguoi_sua NVARCHAR(50)
);

-- Bảng thuong_hieu
INSERT INTO thuong_hieu (ma, ten_thuong_hieu, mo_ta, trang_thai)
VALUES 
('TH001', 'Uniqlo', 'Thương hiệu thời trang Nhật Bản', 'Hoạt động'),
('TH002', 'Zara', 'Thương hiệu thời trang Tây Ban Nha', 'Hoạt động'),
('TH003', 'H&M', 'Thương hiệu thời trang Thụy Điển', 'Hoạt động'),
('TH004', 'Levi', 'Thương hiệu quần âu nổi tiếng', 'Hoạt động'),
('TH005', 'Gap', 'Thương hiệu thời trang Mỹ', 'Hoạt động');

-- Bảng mau_sac
INSERT INTO mau_sac (ma, ten_mau_sac, mo_ta, trang_thai)
VALUES 
('MS001', 'Đen', 'Quần âu màu đen cổ điển', 'Hoạt động'),
('MS002', 'Xám', 'Quần âu màu xám hiện đại', 'Hoạt động'),
('MS003', 'Xanh Đậm', 'Quần âu màu xanh đậm thời thượng', 'Hoạt động'),
('MS004', 'Be', 'Quần âu màu be nhã nhặn', 'Hoạt động'),
('MS005', 'Nâu', 'Quần âu màu nâu sang trọng', 'Hoạt động');

-- Bảng danh_muc
INSERT INTO danh_muc (ma, ten_danh_muc, mo_ta, trang_thai)
VALUES 
('DM001', 'Quần Âu', 'Danh mục các loại quần âu', 'Hoạt động'),
('DM002', 'Áo Sơ Mi', 'Danh mục áo sơ mi phối với quần âu', 'Hoạt động'),
('DM003', 'Giày Tây', 'Danh mục giày tây cho nam', 'Hoạt động'),
('DM004', 'Phụ Kiện Nam', 'Danh mục phụ kiện thời trang nam', 'Hoạt động'),
('DM005', 'Thắt Lưng', 'Danh mục thắt lưng phối với quần âu', 'Hoạt động');

-- Bảng size
INSERT INTO size (ma, ten_size, mo_ta, trang_thai)
VALUES 
('SZ001', '28', 'Size quần âu nhỏ 28', 'Hoạt động'),
('SZ002', '30', 'Size quần âu vừa 30', 'Hoạt động'),
('SZ003', '32', 'Size quần âu lớn 32', 'Hoạt động'),
('SZ004', '34', 'Size quần âu rất lớn 34', 'Hoạt động'),
('SZ005', '36', 'Size quần âu ngoại cỡ 36', 'Hoạt động');

-- Bảng chat_lieu
INSERT INTO chat_lieu (ma, ten_chat_lieu, mo_ta, trang_thai)
VALUES 
('CL001', 'Len', 'Chất liệu len ấm áp', 'Hoạt động'),
('CL002', 'Cotton', 'Chất liệu cotton mềm mại', 'Hoạt động'),
('CL003', 'Polyester', 'Chất liệu polyester bền đẹp', 'Hoạt động'),
('CL004', 'Wool', 'Chất liệu wool cao cấp', 'Hoạt động'),
('CL005', 'Lụa', 'Chất liệu lụa mịn màng', 'Hoạt động');

-- Bảng phong_cach
INSERT INTO phong_cach (ma, ten_phong_cach, mo_ta, trang_thai)
VALUES 
('PC001', 'Công Sở', 'Phong cách công sở lịch lãm', 'Hoạt động'),
('PC002', 'Casual', 'Phong cách casual năng động', 'Hoạt động'),
('PC003', 'Thời Trang', 'Phong cách thời trang hiện đại', 'Hoạt động'),
('PC004', 'Dự Tiệc', 'Phong cách dự tiệc sang trọng', 'Hoạt động'),
('PC005', 'Cổ Điển', 'Phong cách cổ điển lịch lãm', 'Hoạt động');

-- Bảng kieu_dai_quan (Kiểu cạp quần)
INSERT INTO kieu_dai_quan (ma, ten_kieu_dai_quan, mo_ta, trang_thai)
VALUES 
('KD001', 'Cạp Cao', 'Kiểu quần cạp cao', 'Hoạt động'),
('KD002', 'Cạp Trung', 'Kiểu quần cạp trung bình', 'Hoạt động'),
('KD003', 'Cạp Thấp', 'Kiểu quần cạp thấp', 'Hoạt động'),
('KD004', 'Co Giãn', 'Kiểu quần cạp co giãn', 'Hoạt động'),
('KD005', 'Cạp Bản To', 'Kiểu quần cạp bản to', 'Hoạt động');

-- Bảng xuat_xu
INSERT INTO xuat_xu (ma, ten_xuat_xu, mo_ta, trang_thai)
VALUES 
('XX001', 'Việt Nam', 'Sản xuất tại Việt Nam', 'Hoạt động'),
('XX002', 'Trung Quốc', 'Sản xuất tại Trung Quốc', 'Hoạt động'),
('XX003', 'Thái Lan', 'Sản xuất tại Thái Lan', 'Hoạt động'),
('XX004', 'Nhật Bản', 'Sản xuất tại Nhật Bản', 'Hoạt động'),
('XX005', 'Hàn Quốc', 'Sản xuất tại Hàn Quốc', 'Hoạt động');

-- Bảng san_pham
INSERT INTO san_pham (ma, ten_san_pham, mo_ta, trang_thai, ngay_tao, nguoi_tao)
VALUES 
('SP001', 'Quần Âu Nam Đen', 'Quần âu nam màu đen', 'Hoạt động', GETDATE(), 'Admin'),
('SP002', 'Quần Âu Nam Xám', 'Quần âu nam màu xám', 'Hoạt động', GETDATE(), 'Admin'),
('SP003', 'Quần Âu Nam Xanh', 'Quần âu nam màu xanh đậm', 'Hoạt động', GETDATE(), 'Admin'),
('SP004', 'Quần Âu Nam Be', 'Quần âu nam màu be', 'Hoạt động', GETDATE(), 'Admin'),
('SP005', 'Quần Âu Nam Nâu', 'Quần âu nam màu nâu', 'Hoạt động', GETDATE(), 'Admin');

-- Bảng kieu_dang
INSERT INTO kieu_dang (ma, ten_kieu_dang, mo_ta, trang_thai)
VALUES 
('KD001', 'Quần Âu Ôm', 'Kiểu quần âu dáng ôm', 'Hoạt động'),
('KD002', 'Quần Âu Rộng', 'Kiểu quần âu dáng rộng', 'Hoạt động'),
('KD003', 'Quần Âu Cổ Điển', 'Kiểu quần âu phong cách cổ điển', 'Hoạt động'),
('KD004', 'Quần Âu Lưng Cao', 'Kiểu quần âu lưng cao thời trang', 'Hoạt động'),
('KD005', 'Quần Âu Xếp Ly', 'Kiểu quần âu có xếp ly', 'Hoạt động');

-- Bảng san_pham_chi_tiet
INSERT INTO san_pham_chi_tiet (ma, so_luong, mo_ta, trang_thai, gia, id_san_pham, id_mau_sac, id_chat_lieu, id_danh_muc, id_size, id_thuong_hieu, id_kieu_dang, id_kieu_dai_quan, id_xuat_xu, id_phong_cach, ngay_tao, nguoi_tao)
VALUES 
('SPCT001', 50, 'Quần âu nam đen size 30', 'Hoạt động', 500000, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, GETDATE(), 'Admin'),
('SPCT002', 30, 'Quần âu nam xám size 32', 'Hoạt động', 550000, 2, 2, 3, 1, 3, 2, 1, 2, 2, 1, GETDATE(), 'Admin'),
('SPCT003', 40, 'Quần âu nam xanh size 34', 'Hoạt động', 600000, 3, 3, 4, 1, 4, 3, 2, 3, 3, 1, GETDATE(), 'Admin'),
('SPCT004', 25, 'Quần âu nam be size 28', 'Hoạt động', 520000, 4, 4, 2, 1, 1, 4, 3, 4, 4, 1, GETDATE(), 'Admin'),
('SPCT005', 20, 'Quần âu nam nâu size 36', 'Hoạt động', 580000, 5, 5, 3, 1, 5, 5, 2, 5, 5, 1, GETDATE(), 'Admin');

-- Bảng anh_san_pham
INSERT INTO anh_san_pham (ma, anh_url, mo_ta, trang_thai, id_san_pham_chi_tiet)
VALUES 
('IMG001', 'https://example.com/quandau_den.jpg', 'Ảnh quần âu nam màu đen', 'Hoạt động', 1),
('IMG002', 'https://example.com/quandau_xam.jpg', 'Ảnh quần âu nam màu xám', 'Hoạt động', 2),
('IMG003', 'https://example.com/quandau_xanh.jpg', 'Ảnh quần âu nam màu xanh đậm', 'Hoạt động', 3),
('IMG004', 'https://example.com/quandau_be.jpg', 'Ảnh quần âu nam màu be', 'Hoạt động', 4),
('IMG005', 'https://example.com/quandau_nau.jpg', 'Ảnh quần âu nam màu nâu', 'Hoạt động', 5);

--Bảng vai trò
INSERT INTO vai_tro (ma, ten_vai_tro, trang_thai, ngay_tao)
VALUES 
('VT001', 'Admin', 'Hoạt động', GETDATE()),
('VT002', 'Nhân viên', 'Hoạt động', GETDATE()),
('VT003', 'Khách hàng', 'Hoạt động', GETDATE());

-- Bảng tài khoản
INSERT INTO tai_khoan (id_vai_tro, ten_nguoi_dung, mat_khau, trang_thai, ngay_tao, nguoi_tao)
VALUES 
(1, 'admin01', 'password1', 'Hoạt động', GETDATE(), 'System'),
(2, 'employee01', 'password2', 'Hoạt động', GETDATE(), 'System'),
(2, 'employee02', 'password3', 'Hoạt động', GETDATE(), 'System'),
(3, 'customer02', 'password4', 'Hoạt động', GETDATE(), 'System'),
(3, 'customer03', 'password5', 'Tạm ngưng', GETDATE(), 'System'),
(2, 'employee03', 'password3', 'Hoạt động', GETDATE(), 'System'),
(2, 'employee04', 'password3', 'Hoạt động', GETDATE(), 'System'),
(2, 'employee05', 'password3', 'Hoạt động', GETDATE(), 'System'),
(3, 'customer04', 'password5', 'Tạm ngưng', GETDATE(), 'System'),
(3, 'customer05', 'password5', 'Tạm ngưng', GETDATE(), 'System'),
(3, 'customer06', 'password5', 'Tạm ngưng', GETDATE(), 'System');

-- Bảng khách hàng
INSERT INTO khach_hang (ma, ten_khach_hang, ngay_sinh, gioi_tinh, sdt, email, trang_thai, ngay_tao, nguoi_tao, id_tai_khoan)
VALUES 
('KH001', 'Nguyễn Văn A', '1990-05-20', 'Nam', '0123456789', 'customer1@example.com', 'Hoạt động', GETDATE(), 'System', 9),
('KH002', 'Trần Thị B', '1992-07-15', 'Nữ', '0987654321', 'customer2@example.com', 'Hoạt động', GETDATE(), 'System', 4),
('KH003', 'Lê Văn C', '1985-10-10', 'Nam', '0912345678', 'customer3@example.com', 'Tạm ngưng', GETDATE(), 'System', 5),
('KH004', 'Phạm Thị D', '1998-02-25', 'Nữ', '0901234567', 'customer4@example.com', 'Hoạt động', GETDATE(), 'System', 10),
('KH005', 'Hoàng Văn E', '1995-08-30', 'Nam', '0923456789', 'customer5@example.com', 'Hoạt động', GETDATE(), 'System', 11);

-- Bảng địa chỉ
INSERT INTO dia_chi (id_khach_hang, so_nha, duong, xa, huyen, thanh_pho, mo_ta, trang_thai, mac_dinh, ngay_tao)
VALUES 
(1, '123', 'Nguyễn Trãi', 'Phường 1', 'Quận 1', 'Hồ Chí Minh', 'Địa chỉ chính', 'Hoạt động', 1, GETDATE()),
(2, '456', 'Trần Hưng Đạo', 'Phường 2', 'Quận 2', 'Hà Nội', 'Địa chỉ giao hàng', 'Hoạt động', 0, GETDATE()),
(3, '789', 'Lê Lợi', 'Phường 3', 'Quận 3', 'Đà Nẵng', 'Địa chỉ tạm thời', 'Tạm ngưng', 0, GETDATE()),
(4, '111', 'Hai Bà Trưng', 'Phường 4', 'Quận 4', 'Hải Phòng', 'Địa chỉ phụ', 'Hoạt động', 0, GETDATE()),
(5, '222', 'Điện Biên Phủ', 'Phường 5', 'Quận 5', 'Cần Thơ', 'Địa chỉ chính', 'Hoạt động', 1, GETDATE());

-- Bảng nhân viên
INSERT INTO nhan_vien (ma, id_tai_khoan, ten_nhan_vien, ngay_sinh, gioi_tinh, sdt, email, dia_chi, trang_thai, ngay_tao, nguoi_tao)
VALUES 
('NV001', 2, 'Nguyễn Thị Nhân', '1985-03-10', 'Nữ', '0911111111', 'nhanvien1@example.com', '123 Nguyễn Văn Linh, Đà Nẵng', 'Hoạt động', GETDATE(), 'Admin'),
('NV002', 6, 'Trần Văn Quản', '1990-06-15', 'Nam', '0922222222', 'nhanvien2@example.com', '45 Lý Tự Trọng, Hồ Chí Minh', 'Tạm ngưng', GETDATE(), 'Admin'),
('NV003', 7, 'Lê Văn Nghĩa', '1995-11-20', 'Nam', '0933333333', 'nhanvien3@example.com', '67 Trần Phú, Hà Nội', 'Hoạt động', GETDATE(), 'Admin'),
('NV004', 3, 'Hoàng Thị Yến', '1988-01-25', 'Nữ', '0944444444', 'nhanvien4@example.com', '89 Pasteur, Cần Thơ', 'Hoạt động', GETDATE(), 'Admin'),
('NV005', 8, 'Phạm Văn Bình', '1992-08-10', 'Nam', '0955555555', 'nhanvien5@example.com', '12 Lê Hồng Phong, Hải Phòng', 'Hoạt động', GETDATE(), 'Admin');

-- Bảng gio_hang
INSERT INTO gio_hang (ma, id_khach_hang) VALUES 
('GH001', 1),
('GH002', 2),
('GH003', 3);

-- Bảng gio_hang_chi_tiet
INSERT INTO gio_hang_chi_tiet (ma, id_san_pham_chi_tiet, id_gio_hang, so_luong, gia) VALUES 
('CTGH001', 1, 1, 2, 500000),
('CTGH002', 2, 2, 1, 450000),
('CTGH003', 3, 3, 3, 400000);

-- Bảng phieu_giam_gia
INSERT INTO phieu_giam_gia (ma, ten_phieu_giam_gia, loai_phieu_giam_gia, kieu_giam_gia, gia_tri_giam, so_tien_toi_thieu, so_tien_giam_toi_da, ngay_bat_dau, ngay_ket_thuc, so_luong, mo_ta, trang_thai, nguoi_tao) VALUES 
('PGG001', 'Giảm 10%', 'Phần trăm', 'Công khai', 10, 100000, 50000, '2025-01-01', '2025-01-31', 100, 'Giảm giá quần âu mùa đông', 'Hoạt động', 'Admin'),
('PGG002', 'Giảm 50K', 'Cố định', 'Cá nhân', 50000, 300000, NULL, '2025-01-15', '2025-02-15', 50, 'Giảm giá cho khách hàng thân thiết', 'Hoạt động', 'Admin'),
('PGG003', 'Giảm VIP', 'Cố định', 'Đợt giảm giá', 100000, 500000, NULL, '2025-02-01', '2025-02-28', 20, 'Ưu đãi VIP cho quần âu cao cấp', 'Đang chờ', 'Admin');

-- Bảng phieu_giam_gia_khach_hang
INSERT INTO phieu_giam_gia_khach_hang (id_khach_hang, id_phieu_giam_gia, trang_thai, nguoi_tao) VALUES 
(1, 1, 'Sử dụng', 'Admin'),
(2, 2, 'Chưa sử dụng', 'Admin'),
(3, 3, 'Hết hạn', 'Admin');

-- Bảng hoa_don
INSERT INTO hoa_don (ma, id_phieu_giam_gia, id_nhan_vien, id_khach_hang, loai_don, ghi_chu, ten_nguoi_nhan, sdt, email_nguoi_nhan, dia_chi_nhan_hang, ngay_nhan_hang, phi_ship, tong_tien, trang_thai, nguoi_tao) VALUES 
('HD001', 1, 1, 1, 'Online', 'Khách yêu cầu giao sớm', 'Nguyễn Văn A', '0912345678', 'nguyenvana@gmail.com', '123 Hoàng Hoa Thám, Hà Nội', '2025-01-20', 30000, 900000, 'Hoàn tất', 'Admin'),
('HD002', 2, 2, 2, 'Tại cửa hàng', 'Khách tự nhận tại shop', 'Trần Thị B', '0987654321', 'tranthib@gmail.com', '456 Lê Lợi, TP.HCM', NULL, 0, 450000, 'Đã thanh toán', 'Admin'),
('HD003', NULL, 3, 3, 'Online', 'Giao hàng trong giờ hành chính', 'Phạm Văn C', '0971112223', 'phamvanc@gmail.com', '789 Nguyễn Trãi, Đà Nẵng', '2025-01-25', 40000, 1400000, 'Chưa giao', 'Admin');

-- Bảng hoa_don_chi_tiet
INSERT INTO hoa_don_chi_tiet (ma, id_hoa_don, id_san_pham_chi_tiet, so_luong, don_gia, trang_thai, nguoi_tao) VALUES 
('HDCT001', 1, 1, 2, 450000, 'Hoàn tất', 'Admin'),
('HDCT002', 2, 2, 1, 450000, 'Hoàn tất', 'Admin'),
('HDCT003', 3, 3, 3, 400000, 'Chưa giao', 'Admin');

-- Bảng phuong_thuc_thanh_toan
INSERT INTO phuong_thuc_thanh_toan (ma, ten_phuong_thuc, trang_thai, nguoi_tao) VALUES 
('PTTT001', 'Thanh toán tiền mặt', 'Hoạt động', 'Admin'),
('PTTT002', 'Chuyển khoản ngân hàng', 'Hoạt động', 'Admin'),
('PTTT003', 'Ví điện tử', 'Hoạt động', 'Admin');

-- Bảng thanh_toan_hoa_don
INSERT INTO thanh_toan_hoa_don (ma, id_hoa_don, id_phuong_thuc_thanh_toan, so_tien_thanh_toan, trang_thai, ghi_chu, nguoi_tao) VALUES 
('TT001', 1, 1, 900000, 'Hoàn tất', 'Thanh toán bằng tiền mặt', 'Admin'),
('TT002', 2, 2, 450000, 'Hoàn tất', 'Khách chuyển khoản qua ngân hàng', 'Admin'),
('TT003', 3, 3, 1400000, 'Đang chờ', 'Khách dùng ví điện tử', 'Admin');

-- Bảng lich_su_hoa_don
INSERT INTO lich_su_hoa_don (id_hoa_don, hanh_dong, ghi_chu, nguoi_tao) VALUES 
(1, 'Tạo hóa đơn', 'Hóa đơn được tạo thành công', 'Admin'),
(1, 'Giao hàng', 'Hàng đã giao cho khách', 'Admin'),
(3, 'Đợi giao', 'Chờ nhân viên giao hàng', 'Admin');

-- Bảng dot_giam_gia
INSERT INTO dot_giam_gia (ma_dot_giam_gia, loai_dot_giam_gia, ten_dot_giam_gia, gia_tri_giam, trang_thai, ngay_bat_dau, ngay_ket_thuc, nguoi_tao) VALUES 
('DGG001', 'Theo %', 'Giảm giá mùa đông', 10.00, 'Hoạt động', '2025-01-01', '2025-01-31', 'Admin'),
('DGG002', 'Cố định', 'Giảm giá cuối mùa', 50000, 'Hoạt động', '2025-02-01', '2025-02-28', 'Admin'),
('DGG003', 'Cố định', 'Giảm giá VIP', 100000, 'Đang chờ', '2025-03-01', '2025-03-31', 'Admin');

-- Bảng dot_giam_gia_chi_tiet
INSERT INTO dot_giam_gia_chi_tiet (id_dot_giam_gia, id_chi_tiet_san_pham, trang_thai, nguoi_tao) VALUES 
(1, 101, 'Hoạt động', 'Admin'),
(2, 102, 'Hoạt động', 'Admin'),
(3, 103, 'Đang chờ', 'Admin');
