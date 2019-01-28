export const locale = {
    lang: 'vi-VN',
    data: {
        'NAV': {
            'APPLICATIONS': 'Danh Mục',
            'DASHBOARD': 'Trang Chủ',
            'ADMIN': 'Quản Lý Thông Tin',
            'USER': 'Danh Sách Người Dùng',
            'COMPANY': 'Quản Lý Công Ty',
            'WAREHOUSE': 'Danh Sách Kho Hàng',
            'WAREHOUSE_MANAGEMENT': 'Quản Lý Kho Hàng',
            'WAREHOUSE_IMPORT': 'Quản Lý Nhập Kho',
            'WAREHOUSE_EXPORT': 'Quản Lý Xuất Kho',
            'PRODUCT_MANAGEMENT': 'Quản Lý Sản Phẩm',
            'APPROVER_MANAGEMENT': 'Quản lý đơn',
            'APPROVER': 'Duyệt đơn',
            'APPROVER_INPUT': 'Duyệt đơn nhập kho',
            'APPROVER_OUTPUT': 'Duyệt đơn xuất kho',

        },
        'USER': {
            'FORM_NEW_TITLE': 'Thêm Người Dùng Mới',
            'FORM_EDIT_TITLE': 'Thay Đổi Thông Tin Người Dùng',
            'FORM_EDIT_PROFILE_TITLE': 'Thay Đổi Thông Tin Cá Nhân',
            'CHANGE_PASSWORD_HINT': 'Để Trắng Nếu Không Muốn Đổi Mật Khẩu',
            'NEW': 'Thêm Người Dùng',
            'ID': 'ID',
            'NAME': 'Họ Tên',
            'USERNAME': 'Tài Khoản',
            'EMAIL': 'Email',
            'PASSWORD': 'Mật Khẩu',
            'PASSWORD_CONFIRM': 'Nhập Lại Mật Khẩu',
            'ROLE': 'Quyền',
            'JOINED_AT': 'Ngày Tham Gia',
            'WAREHOUSE': 'Kho Hàng',
            'ROLES': {
                'ADMIN': 'Quản Trị Viên',
                'REPAIR': 'Quản Lý Sửa Chữa',
                'TECHNICAL': 'Quản Lý Kỹ Thuật',
                'STOCKER': 'Quản Kho',
                'USER': 'Người Dùng Thường',
            },
            'BUTTONS': {
                'ADD': 'Thêm',
                'SAVE': 'Lưu',
                'CHANGE_PROFILE': 'Thay Đổi Thông Tin',
            },
            'MESSAGES': {
                'CONFIRM_DELETE': 'Bạn có chắc chắn muốn xóa người dùng này?',
            },
            'TITLES': {
                'PAGE': 'Quản Lý Người Dùng',
            },
        },
        'COMMON': {
            'CONFIRM_DIALOG': {
                'TITLE': 'Xác Nhận Xóa',
                'CONFIRM': 'Xóa',
                'CANCEL': 'Hủy',
            },
            'BUTTONS': {
                'EDIT': 'Sửa',
                'DELETE': 'Xóa',
                'SEARCH': 'Tìm Kiếm',
                'SAVE_SEARCH': 'Tìm Kiếm',
                'CLEAR_SEARCH': 'Xóa',
            },
            'MESSAGES': {
                'SEARCH_PLACEHOLDER': 'Nhập từ khóa muốn tìm kiếm...',
                'MORE_SEARCH_TOOLTIP': 'Tìm Kiếm Nâng Cao',
            },
            'TITLES': {
                'FORM_PURCHASE_ORDER_SEARCH': 'Tìm Kiếm Nâng Cao',
            },
        },
        'AUTH': {
            'LOGIN': {
                'PAGE_TITLE': 'Đăng Nhập Tài Khoản',
                'USERNAME': 'Tài Khoản',
                'PASSWORD': 'Mật Khẩu',
                'FORGOT_PASSWORD': 'Quên Mật Khẩu?',
                'SUBMIT': 'Đăng Nhập',
                'FAILED': 'Tài Khoản Hoặc Mật Khẩu Không Đúng.',
                'SUCCEEDED': 'Đăng Nhập Thành Công. Vui Lòng Chờ Chút Để Được Chuyển Trang.',
            },
        },
        'VALIDATION': {
            'EMAIL': 'Trường {{attribute}} phải là một địa chỉ email hợp lệ.',
            'REQUIRED': 'Trường {{attribute}} không được bỏ trống.',
            'UNIQUE': 'Trường {{attribute}} đã có trong cơ sở dữ liệu.',
            'MIN': {
                'STRING': 'Trường {{attribute}} phải có tối thiểu {{min}} ký tự.',
            },
            'CONFIRMED': 'Giá trị xác nhận trong trường {{attribute}} không khớp.',
        },
        'WAREHOUSE': {
            'ID': 'ID',
            'NAME': 'Tên Kho Hàng',
            'BUTTONS': {
                'NEW': 'Thêm Kho Hàng Mới',
                'SAVE': 'Lưu',
                'DELETE': 'Xóa',
                'ADD': 'Thêm',
            },
            'TITLES': {
                'PAGE': 'Danh Sách Kho Hàng',
                'FORM_EDIT': 'Sửa Thông Tin Kho Hàng',
                'FORM_CREATE': 'Thêm Kho Hàng Mới',
            },
            'MESSAGES': {
                'CONFIRM_DELETE': 'Bạn có chắc chắn muốn xóa kho hàng này?',
            },
        },

        'PRODUCT': {
            'ID': 'ID',
            'CODE': 'Mã Vật Tư',
            'NAME': 'Tên Vật Tư',
            'MANUFACTURER': 'Nhà Sản Xuất',
            'PRODUCT_TYPE': 'Loại Vật Tư',
            'TYPES': {
                'NEW': 'Vật Tư Mới',
                'RECOVERY': 'Phục Hồi',
                'GUARANTEE': 'Bảo Hành',
            },
            'MACHINE_PART': 'Thiết Bị Sử Dụng',
            'PRICE': 'Đơn Giá',
            'SUBTOTAL': 'Tổng Tiền',
            'QUANTITY': 'Số Lượng',
            'AMOUNT': 'Thành Tiền',

            'DESCRIPTION': 'Miêu Tả Vật Tư',
        },

        'PRODUCTS': {
            'TITLES': {
                'PAGE': 'Quản Lý Vật Tư',
                'NEW_FORM': 'Thêm Vật Tư Mới',
                'EDIT_FORM': 'Thay Đổi Thông Tin',
            },
            'BUTTONS': {
                'ADD': 'Thêm',
                'SAVE': 'Lưu',
                'NEW': 'Thêm Vật Tư Mới',
            },
            'MESSAGES': {
                'SEARCH_PLACEHOLDER': 'Nhập từ khóa cần tìm kiếm....',
                'CREATED': 'Đã thêm vật tư mới thành công.',
                'UPDATED': 'Đã thay đổi thông tin vật tư thành công.',
                'DELETED': 'Đã xóa vật tư thành công.',
                'CONFIRM_DELETE': 'Bạn có chắc chắn muốn xóa vật tư này?',
            },
        },

        'PURCHASE_ORDER': {
            'ID': 'Mã Đơn',
            'AREAS': 'Khu Vực',
            'LOCATION': 'Vị Trí',
            'MANAGER_DEPARTMENT': 'Đơn Vị Quản Lý',
            'INPUT_DATE': 'Ngày Nhập Kho',
            'OUTPUT_DATE': 'Ngày Xuất Kho',
            'SUBTOTAL': 'Tổng Tiền',
            'CREATED_BY': 'Người Tạo Đơn',
            'UPDATED_BY': 'Chỉnh Sửa Lần Cuối',
            'CREATED_AT': 'Thời Gian Tạo Đơn',
            'UPDATED_AT': 'Chỉnh Sửa Lần Cuối Lúc',
            'STATUS': 'Trạng Thái',
            'STATUSES': {
                'PENDING': 'Chờ Xử Lý',
                'ACCEPTED': 'Chấp Nhận',
                'REJECTED': 'Từ Chối',
            },
            'BUTTONS': {
                'ADD_PRODUCT': 'Thêm Vật Tư',
                'NEW_IMPORT': 'Nhập Kho',
                'NEW_EXPORT': 'Xuất Kho',
                'SAVE': 'Lưu Đơn',
            },
            'TABS': {
                'BASIC_INFO': 'Thông Tin Đơn',
                'PRODUCTS': 'Danh Sách Vật Tư'
            },
            'TITLES': {
                'ORDER_DETAIL': 'Chi Tiết Đơn',
                'FORM_IMPORT': 'Đơn Nhập Kho',
                'FORM_EXPORT': 'Đơn Xuất Kho',
                'PAGE_IMPORT': 'Quản Lý Nhập Kho',
                'PAGE_EXPORT': 'Quản Lý Xuất Kho',
                'DETAIL_IMPORT': 'Chi Tiết Đơn Nhập Kho',
                'DETAIL_EXPORT': 'Chi Tiết Đơn Xuất Kho',
                'APPROVER': 'Người duyệt đơn'
            },
            'MESSAGES': {
                'EMPTY_PRODUCT': 'Không Có Vật Tư',
                'CREATED': 'Đã thêm đơn mới thành công.',
                'EDITED': 'Đã sửa đơn thành công',
                'DELETED': 'Đã xóa đơn thành công',
                'CONFIRM_DELETE': 'Bạn có chắc xoá đơn hàng này không?'
            },
        },

        'PRODUCT_SEARCH_DIALOG': {
            'PAGE_TITLE': 'Tìm Kiếm Vật Tư',
            'KEYWORD_LABEL': 'Tìm Kiếm Vật Tư',
            'KEYWORD_PLACEHOLDER': 'Nhập từ khóa muốn tìm kiếm...',
            'EMPTY': 'Không Tìm Thấy Vật Tư Nào!',
            'BUTTONS': {
                'ADD': 'Thêm',
            },
        },
    },
};
