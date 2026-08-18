import './style.css';
import router from './router.js';

// Đăng ký tất cả routes
router
    .on('/register', async (container) => {
        const { RegisterForm } = await import('./features/auth/index.js');
        const form = new RegisterForm(container);
        form.mount();
        return () => form.unmount();
    });

// Khởi động router — render component cho URL hiện tại
router.init();