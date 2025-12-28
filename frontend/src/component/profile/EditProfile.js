import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // State form
    const [formData, setFormData] = useState({
        full_name: user.full_name || user.name || '',
        email: user.email || '',
        date_of_birth: '',
        gender: '',
        phone: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (!user.id) {
            navigate('/login');
            return;
        }
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/profiles/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    date_of_birth: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
                    gender: data.gender || '',
                    phone: data.phone || '',
                    avatar_url: data.avatar_url || ''
                }));
                if (data.avatar_url) {
                    setPreviewUrl(getAvatarUrl(data.avatar_url));
                }
            }
        } catch (error) {
            console.error('Lỗi tải profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAvatarUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `http://localhost:5000${url}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setMessage({ type: 'danger', text: 'Vui lòng chọn file ảnh!' });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'danger', text: 'File ảnh không được vượt quá 5MB!' });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadAvatar = async () => {
        const file = fileInputRef.current?.files[0];
        if (!file) {
            setMessage({ type: 'warning', text: 'Vui lòng chọn ảnh để tải lên!' });
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('avatar', file);

            const res = await fetch(`http://localhost:5000/api/profiles/${user.id}/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataUpload
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    avatar_url: data.avatar_url
                }));
                setPreviewUrl(getAvatarUrl(data.avatar_url));
                setMessage({ type: 'success', text: 'Tải ảnh lên thành công!' });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                const errData = await res.json();
                setMessage({ type: 'danger', text: errData.message || 'Lỗi tải ảnh lên.' });
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Lỗi kết nối server.' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch(`http://localhost:5000/api/profiles/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    date_of_birth: formData.date_of_birth || null,
                    gender: formData.gender || null,
                    phone: formData.phone || null,
                    avatar_url: formData.avatar_url || null
                })
            });

            if (res.ok) {
                // Chuyển đến trang xem profile sau khi lưu thành công
                navigate('/profile');
            } else {
                setMessage({ type: 'danger', text: 'Lỗi cập nhật hồ sơ.' });
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Lỗi kết nối server.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Đang tải thông tin...</p>
            </Container>
        );
    }

    return (
        <div className="profile-page">
            <Container className="py-4">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="profile-card">
                            <Card.Header className="profile-header">
                                <h4 className="mb-0">Chỉnh sửa hồ sơ</h4>
                            </Card.Header>
                            <Card.Body className="p-4">
                                {message && (
                                    <Alert
                                        variant={message.type}
                                        dismissible
                                        onClose={() => setMessage(null)}
                                    >
                                        {message.text}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    {/* Thông tin tài khoản (chỉ đọc) */}
                                    <div className="mb-4">
                                        <h6 className="section-title mb-3">Thông tin tài khoản</h6>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Họ và tên</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={formData.full_name}
                                                        disabled
                                                        className="bg-light"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        value={formData.email}
                                                        disabled
                                                        className="bg-light"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    {/* Thông tin cá nhân */}
                                    <div className="mb-4">
                                        <h6 className="section-title mb-3">Thông tin cá nhân</h6>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Ngày sinh</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        name="date_of_birth"
                                                        value={formData.date_of_birth}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Giới tính</Form.Label>
                                                    <Form.Select
                                                        name="gender"
                                                        value={formData.gender}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">-- Chọn --</option>
                                                        <option value="male">Nam</option>
                                                        <option value="female">Nữ</option>
                                                        <option value="other">Khác</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Số điện thoại</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="Nhập số điện thoại"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Ảnh đại diện</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        ref={fileInputRef}
                                                        accept="image/*"
                                                        onChange={handleFileSelect}
                                                    />
                                                    <Form.Text className="text-muted">
                                                        Chấp nhận: JPG, PNG, GIF, WEBP. Tối đa 5MB
                                                    </Form.Text>
                                                </Form.Group>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={handleUploadAvatar}
                                                    disabled={uploading}
                                                    className="mb-3"
                                                >
                                                    {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>

                                    {/* Preview avatar */}
                                    {previewUrl && (
                                        <div className="mb-4 text-center">
                                            <p className="text-muted small mb-2">Ảnh đại diện:</p>
                                            <img
                                                src={previewUrl}
                                                alt="Avatar preview"
                                                className="profile-avatar-preview"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}

                                    <div className="d-flex gap-3">
                                        <Button
                                            type="submit"
                                            className="btn-save"
                                            disabled={saving}
                                        >
                                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => navigate('/profile')}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default EditProfile;
