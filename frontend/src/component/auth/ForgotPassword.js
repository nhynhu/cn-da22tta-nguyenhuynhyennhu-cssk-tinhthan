import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập mật khẩu mới
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Bước 1: Kiểm tra email có tồn tại không
    const handleCheckEmail = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/users/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Email không tồn tại trong hệ thống!');

            setStep(2); // Chuyển sang bước nhập mật khẩu mới
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Bước 2: Đặt lại mật khẩu mới
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        // Kiểm tra mật khẩu xác nhận
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Đặt lại mật khẩu thất bại!');

            setSuccess('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* CỘT TRÁI: HÌNH ẢNH MINH HỌA */}
                <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center" style={{ backgroundColor: '#cfe2f3' }}>
                    <div className="w-75 text-center">
                        <img
                            src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg"
                            alt="Forgot Password Illustration"
                            className="img-fluid"
                            style={{ mixBlendMode: 'multiply', maxHeight: '400px' }}
                        />
                    </div>
                </div>

                {/* CỘT PHẢI: FORM QUÊN MẬT KHẨU */}
                <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white p-5">
                    <div style={{ maxWidth: '420px', width: '100%' }}>
                        {/* Nút quay lại */}
                        <button
                            className="btn btn-link text-decoration-none p-0 mb-4"
                            onClick={() => step === 1 ? navigate('/login') : setStep(1)}
                            style={{ color: '#4a76b8' }}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            ← {step === 1 ? 'Quay lại đăng nhập' : 'Quay lại'}
                        </button>

                        <h2 className="fw-bold mb-1 text-dark">
                            {step === 1 ? 'Quên mật khẩu?' : 'Đặt mật khẩu mới'}
                        </h2>
                        <p className="text-muted mb-4">
                            {step === 1
                                ? 'Nhập email của bạn để đặt lại mật khẩu'
                                : 'Nhập mật khẩu mới cho tài khoản của bạn'}
                        </p>

                        {/* BƯỚC 1: NHẬP EMAIL */}
                        {step === 1 && (
                            <form onSubmit={handleCheckEmail}>
                                <div className="mb-4">
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

                                <button
                                    type="submit"
                                    className="btn w-100 py-2 fw-bold text-white mb-3"
                                    style={{ backgroundColor: '#4a76b8', borderRadius: '8px' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang kiểm tra...' : 'Tiếp tục'}
                                </button>
                            </form>
                        )}

                        {/* BƯỚC 2: NHẬP MẬT KHẨU MỚI */}
                        {step === 2 && (
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="form-control py-2 shadow-sm bg-light"
                                        style={{ borderRadius: '8px', fontSize: '14px' }}
                                        value={email}
                                        disabled
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold small mb-1">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className="form-control py-2 shadow-sm"
                                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                        style={{ borderRadius: '8px', fontSize: '14px' }}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold small mb-1">Xác nhận mật khẩu</label>
                                    <input
                                        type="password"
                                        className="form-control py-2 shadow-sm"
                                        placeholder="Nhập lại mật khẩu mới"
                                        style={{ borderRadius: '8px', fontSize: '14px' }}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn w-100 py-2 fw-bold text-white mb-3"
                                    style={{ backgroundColor: '#4a76b8', borderRadius: '8px' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                                </button>
                            </form>
                        )}

                        {/* Thông báo lỗi/thành công */}
                        {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}
                        {success && <div className="alert alert-success py-2 small text-center">{success}</div>}

                        <p className="text-center mt-4 small">
                            Đã nhớ mật khẩu? <a
                                href="/login"
                                className="text-decoration-none fw-bold"
                                style={{ color: '#4a76b8' }}
                                onClick={(e) => { e.preventDefault(); navigate('/login'); }}
                            >
                                Đăng nhập
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
