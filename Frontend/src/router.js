// src/router.js

class Router {
    // ─── Constructor ────────────────────────────────────────────
    constructor() {
        // Mảng lưu tất cả routes đã đăng ký
        // Mỗi phần tử: { pattern: RegExp, paramNames: ['id'], handler: Function }
        this.routes = [];
        
        // Hàm cleanup của component đang hiển thị
        // Khi chuyển trang → gọi hàm này để dọn dẹp event listeners
        this.currentCleanup = null;

        // Lắng nghe nút Back/Forward của browser
        // Khi user bấm Back → URL thay đổi → popstate event → ta render lại
        window.addEventListener('popstate', () => this._handleRouteChange());

        // Chặn click trên tất cả thẻ <a> có attribute "data-link"
        // Thay vì reload trang, ta đổi URL bằng pushState
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();                          // Chặn browser reload
                const href = link.getAttribute('href');
                window.history.pushState(null, '', href);    // Đổi URL (không reload)
                this._handleRouteChange();                   // Render component mới
            }
        });
    }

    // ─── Đăng ký route ──────────────────────────────────────────
    // Gọi: router.on('/products/:id', handler)
    // Chuyển '/products/:id' → RegExp để match URL sau này
    on(path, handler) {
        const paramNames = [];
        
        // Tìm tất cả ":param" trong path
        // '/products/:id/reviews/:reviewId' → paramNames = ['id', 'reviewId']
        const pattern = path.replace(/:(\w+)/g, (_, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';   // Thay :id bằng regex "bắt 1 hoặc nhiều ký tự"
        });

        this.routes.push({
            // ^ và $ để match TOÀN BỘ URL, không phải chỉ một phần
            pattern: new RegExp(`^${pattern}$`),
            paramNames,
            handler,
        });

        return this;  // Cho phép chain: router.on(...).on(...)
    }

    // ─── Điều hướng bằng code ────────────────────────────────────
    // Gọi: router.navigate('/login')
    navigate(path) {
        window.history.pushState(null, '', path);   // Đổi URL
        this._handleRouteChange();                  // Render component
    }

    // ─── Khởi động ──────────────────────────────────────────────
    // Gọi 1 lần khi app start, render component cho URL hiện tại
    init() {
        this._handleRouteChange();
    }

    // ─── Xử lý khi URL thay đổi (CORE) ─────────────────────────
    async _handleRouteChange() {
        const path = window.location.pathname;   // Lấy URL hiện tại, vd: "/products/123"
        const app = document.getElementById('app');

        // Bước 1: Dọn dẹp component cũ
        // Nếu component trước đó có return cleanup function → gọi nó
        // Dọn event listeners, clearInterval, v.v.
        if (this.currentCleanup) {
            this.currentCleanup();
            this.currentCleanup = null;
        }

        // Bước 2: Tìm route match
        for (const route of this.routes) {
            const match = path.match(route.pattern);
            
            if (match) {
                // Bước 3: Extract params
                // Nếu URL = "/products/123" và pattern có paramNames = ['id']
                // → match = ["/products/123", "123"]
                // → params = { id: "123" }
                const params = {};
                route.paramNames.forEach((name, i) => {
                    params[name] = match[i + 1];    // match[0] là full string, [1] trở đi là groups
                });

                // Bước 4: Gọi handler, lưu cleanup function
                // Handler có thể return 1 function dùng để dọn dẹp sau này
                app.innerHTML = '';  // Xoá nội dung cũ
                this.currentCleanup = await route.handler(app, params);
                return;
            }
        }

        // Bước 5: Không match route nào → 404
        app.innerHTML = '<h1>404 — Trang không tồn tại</h1>';
    }
}

// Export 1 instance duy nhất (Singleton)
const router = new Router();
export default router;
