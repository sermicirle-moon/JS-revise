// ====== BÊN TRONG MÃ NGUỒN CỦA EXPRESS (MÔ PHỎNG) ====== //

function createExpressApp() {
    const routes = {}; // Nơi lưu trữ các hàm Controller của bạn

    // Hàm này sẽ được nhét vào http.createServer(app)
    const app = function (req, res) {

        // BƯỚC 1: EXPRESS LẤY REQ, RES TỪ NODE.JS VÀ "NÂNG CẤP" CHÚNG

        // Thêm tính năng json() cho res (Thay vì phải gọi writeHead, end lằng nhằng)
        res.json = function (data) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        };

        // BƯỚC 2: TÌM CONTROLLER VÀ ĐẨY REQ, RES (ĐÃ NÂNG CẤP) VÀO

        // Tìm xem khách đang gọi API nào (VD: 'POST:/register')
        const endpoint = req.method + ':' + req.url;
        const myController = routes[endpoint];

        if (myController) {
            // ĐÂY LÀ LÚC 2 BIẾN ĐÓ ĐƯỢC CHUYỀN VÀO HÀM CỦA BẠN
            myController(req, res);
        }
    };

    // Hàm để bạn đăng ký API (app.post)
    app.post = function (path, controllerFunction) {
        routes['POST:' + path] = controllerFunction;
    };

    return app;
}

// ====== CODE CỦA BẠN (TẦNG ỨNG DỤNG) ====== //

const app = createExpressApp(); // Hoặc const app = express();

// Bạn đang lưu cái hàm (req, res) => {} này vào biến routes của Express
app.post('/register', (req, res) => {

    // Lúc này, req đã có sẵn req.body (nhờ middleware xử lý trước đó)
    const { username, password } = req.body;

    // res đã có sẵn hàm .json() (nhờ Express vừa gắn thêm ở Bước 1 bên trên)
    res.json({ message: "Đăng ký thành công!" });
});