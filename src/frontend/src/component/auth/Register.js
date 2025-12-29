import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function Register({ onRegister, onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            const res = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name: fullName })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại!');
            setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
            if (onRegister) onRegister();
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    // Xử lý đăng ký/đăng nhập Google thành công
    const handleGoogleSuccess = async (credentialResponse) => {
        setError(''); setSuccess('');
        try {
            const res = await fetch('http://localhost:5000/api/users/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Đăng ký Google thất bại!');
            // Nếu có callback onLogin, gọi nó để đăng nhập luôn
            if (onLogin) {
                onLogin(data);
            } else {
                setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
                setTimeout(() => navigate('/login'), 1500);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // Xử lý đăng ký Google thất bại
    const handleGoogleError = () => {
        setError('Đăng ký Google thất bại. Vui lòng thử lại.');
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* CỘT TRÁI: HÌNH ẢNH MINH HỌA */}
                <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center" style={{ backgroundColor: '#cfe2f3' }}>
                    <div className="w-75 text-center">
                        <img
                            src="./img/vechungtoi.png"
                            alt="Illustration"
                            className="img-fluid"
                            style={{ mixBlendMode: 'multiply' }}
                        />
                    </div>
                </div>

                {/* CỘT PHẢI: FORM ĐĂNG KÝ */}
                <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white p-5">
                    <div style={{ maxWidth: '420px', width: '100%' }}>
                        <h2 className="fw-bold mb-1 text-dark">Tạo tài khoản mới</h2>
                        <p className="text-muted mb-4">Tham gia cùng chúng tôi ngay hôm nay</p>

                        <form onSubmit={handleSubmit}>
                            {/* Họ tên */}
                            <div className="mb-3">
                                <label className="form-label fw-bold small mb-1">Họ tên</label>
                                <input
                                    type="text"
                                    className="form-control py-2 shadow-sm"
                                    placeholder="Nhập họ tên của bạn"
                                    style={{ borderRadius: '8px', fontSize: '14px' }}
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email */}
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

                            {/* Mật khẩu */}
                            <div className="mb-4">
                                <label className="form-label fw-bold small mb-1">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control py-2 shadow-sm"
                                    placeholder="Tạo mật khẩu"
                                    style={{ borderRadius: '8px', fontSize: '14px' }}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn w-100 py-2 fw-bold text-white mb-3"
                                style={{ backgroundColor: '#4a76b8', borderRadius: '8px' }}>
                                Đăng ký
                            </button>
                        </form>

                        {/* Thông báo lỗi/thành công */}
                        {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}
                        {success && <div className="alert alert-success py-2 small text-center">{success}</div>}

                        <div className="position-relative my-4 text-center">
                            <hr className="text-muted" />
                            <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">hoặc</span>
                        </div>

                        <div className="d-flex justify-content-center mb-3">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                text="signup_with"
                                shape="rectangular"
                                theme="outline"
                                size="large"
                                width="100%"
                            />
                        </div>

                        <p className="text-center mt-4 small">
                            Đã có tài khoản? <a href="/login" className="text-decoration-none fw-bold" style={{ color: '#4a76b8' }} onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Đăng nhập</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;