import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Sai email hoặc mật khẩu!');
            onLogin(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Xử lý đăng nhập Google thành công
    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/users/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Đăng nhập Google thất bại!');
            onLogin(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Xử lý đăng nhập Google thất bại
    const handleGoogleError = () => {
        setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* CỘT TRÁI: HÌNH ẢNH MINH HỌA */}
                <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center" style={{ backgroundColor: '#cfe2f3' }}>
                    <div className="w-75">
                        <img
                            src="./img/vechungtoi.png"
                            alt="Illustration"
                            className="img-fluid"
                            style={{ mixBlendMode: 'multiply' }}
                        />
                    </div>
                </div>

                {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
                <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white p-5">
                    <div style={{ maxWidth: '420px', width: '100%' }}>
                        <h2 className="fw-bold mb-1 text-dark">Chào mừng bạn trở lại!</h2>
                        <p className="text-muted mb-5">Nhập thông tin của bạn</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small mb-1">Địa chỉ Email</label>
                                <input
                                    type="email"
                                    className="form-control py-2 shadow-sm"
                                    placeholder="Nhập email của bạn"
                                    style={{ borderRadius: '8px', fontSize: '14px' }}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-2">
                                <div className="d-flex justify-content-between">
                                    <label className="form-label fw-bold small mb-1">Mật khẩu</label>
                                    <a href="/forgot-password" className="text-decoration-none small fw-semibold" style={{ color: '#4a76b8' }} onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Quên mật khẩu</a>
                                </div>
                                <input
                                    type="password"
                                    className="form-control py-2 shadow-sm"
                                    placeholder="Mật khẩu"
                                    style={{ borderRadius: '8px', fontSize: '14px' }}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4 form-check">
                                <input type="checkbox" className="form-check-input" id="remember" />
                                <label className="form-check-label small text-muted" htmlFor="remember">Nhớ mật khẩu</label>
                            </div>

                            <button type="submit" className="btn w-100 py-2 fw-bold text-white mb-3"
                                style={{ backgroundColor: '#4a76b8', borderRadius: '8px' }}>
                                Đăng nhập
                            </button>
                        </form>

                        {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

                        <div className="position-relative my-4 text-center">
                            <hr className="text-muted" />
                            <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">hoặc</span>
                        </div>

                        <div className="d-flex justify-content-center mb-3">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                text="signin_with"
                                shape="rectangular"
                                theme="outline"
                                size="large"
                                width="100%"
                            />
                        </div>

                        <p className="text-center mt-4 small">
                            Chưa có tài khoản? <a href="/register" className="text-decoration-none fw-bold" style={{ color: '#4a76b8' }} onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Đăng ký</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;