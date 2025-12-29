import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Lấy token từ URL query parameter
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
            setError('Link không hợp lệ. Vui lòng kiểm tra lại email của bạn.');
        } else {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

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
                body: JSON.stringify({ token, newPassword })
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
                            src="https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7876.jpg"
                            alt="Reset Password Illustration"
                            className="img-fluid"
                            style={{ mixBlendMode: 'multiply', maxHeight: '400px' }}
                        />
                    </div>
                </div>

                {/* CỘT PHẢI: FORM ĐẶT LẠI MẬT KHẨU */}
                <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white p-5">
                    <div style={{ maxWidth: '420px', width: '100%' }}>
                        {/* Nút quay lại */}
                        <button
                            className="btn btn-link text-decoration-none p-0 mb-4"
                            onClick={() => navigate('/login')}
                            style={{ color: '#4a76b8' }}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            ← Quay lại đăng nhập
                        </button>

                        <h2 className="fw-bold mb-1 text-dark">Đặt mật khẩu mới</h2>
                        <p className="text-muted mb-4">
                            Nhập mật khẩu mới cho tài khoản của bạn
                        </p>

                        {!token ? (
                            <div className="alert alert-danger">
                                Link không hợp lệ. Vui lòng kiểm tra lại email của bạn.
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword}>
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

export default ResetPassword;
