import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ViewProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

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
                setProfile(data);
            } else if (res.status === 404) {
                // Chưa có profile - chuyển đến trang chỉnh sửa
                navigate('/profile/edit');
                return;
            }
        } catch (error) {
            console.error('Lỗi tải profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm lấy URL đầy đủ cho avatar
    const getAvatarUrl = (url) => {
        if (!url) return '/default-avatar.png';
        if (url.startsWith('http')) return url;
        return `http://localhost:5000${url}`;
    };

    // Format giới tính
    const formatGender = (gender) => {
        switch (gender) {
            case 'male': return 'Nam';
            case 'female': return 'Nữ';
            case 'other': return 'Khác';
            default: return 'Chưa cập nhật';
        }
    };

    // Format ngày sinh
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Chưa cập nhật';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
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
                                <h4 className="mb-0">Hồ sơ cá nhân</h4>
                            </Card.Header>
                            <Card.Body className="p-4">
                                {/* Avatar */}
                                <div className="text-center mb-4">
                                    <img
                                        src={getAvatarUrl(profile?.avatar_url)}
                                        alt="Avatar"
                                        className="profile-avatar"
                                        onError={(e) => {
                                            e.target.src = '/default-avatar.png';
                                        }}
                                    />
                                    <h5 className="mt-3 mb-1">{user.full_name || user.name}</h5>
                                    <p className="text-muted">{user.email}</p>
                                </div>

                                {/* Thông tin chi tiết */}
                                <div className="profile-info">
                                    <Row className="mb-3">
                                        <Col sm={4} className="text-muted">Ngày sinh:</Col>
                                        <Col sm={8}>{formatDate(profile?.date_of_birth)}</Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col sm={4} className="text-muted">Giới tính:</Col>
                                        <Col sm={8}>{formatGender(profile?.gender)}</Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col sm={4} className="text-muted">Số điện thoại:</Col>
                                        <Col sm={8}>{profile?.phone || 'Chưa cập nhật'}</Col>
                                    </Row>
                                </div>

                                {/* Nút chỉnh sửa */}
                                <div className="d-flex gap-3 mt-4">
                                    <Button
                                        className="btn-save"
                                        onClick={() => navigate('/profile/edit')}
                                    >
                                        Chỉnh sửa hồ sơ
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate('/')}
                                    >
                                        Quay lại trang chủ
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ViewProfile;
