// features/auth/components/RegisterForm.js

import { authService } from '../services/authenService.js';
import router from '../../../router.js';

export class RegisterForm {
    constructor(container) {
        this.container = container;
    }

    mount() {
        this.container.innerHTML = `
            <form id="register-form">
                <h1>Đăng ký</h1>
                <input name="username" placeholder="Username" required>
                <input name="password" type="password" placeholder="Password" required>
                <button type="submit">Đăng ký</button>
                <p id="error" style="color: red"></p>
                <a href="/login" data-link>Đã có tài khoản? Đăng nhập</a>
            </form>
        `;

        this.container.querySelector('#register-form')
            .addEventListener('submit', (e) => this._handleSubmit(e));
    }

    async _handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value.trim();
        const password = form.password.value;

        try {
            await authService.register(username, password);
            router.navigate('/login');  // Thành công → chuyển trang
        } catch (error) {
            document.getElementById('error').textContent = 
                error.error || error.errors?.join(', ') || 'Đăng ký thất bại';
        }
    }

    unmount() {
        this.container.innerHTML = '';
    }
}
