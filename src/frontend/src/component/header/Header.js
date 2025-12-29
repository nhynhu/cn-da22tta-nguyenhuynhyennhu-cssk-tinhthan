import { NavLink, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CollapsibleExample = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [recentNotifications, setRecentNotifications] = useState([]);
    const token = localStorage.getItem('token');

    const isAdmin = user && user.role === 'admin';
    const isExpert = user && user.role === 'expert';
    const isUser = user && user.role === 'user';
    const isLoggedIn = !!user;

    // Load notification count
    useEffect(() => {
        if (isLoggedIn && token) {
            loadNotifications();
            // Reload every 30 seconds
            const interval = setInterval(loadNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [isLoggedIn, token]);

    const loadNotifications = async () => {
        try {
            const [countRes, notiRes] = await Promise.all([
                axios.get(`${API_URL}/api/notifications/unread-count`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/notifications?limit=5`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            setUnreadCount(countRes.data.unreadCount || 0);
            setRecentNotifications(notiRes.data.notifications || []);
        } catch (err) {
            console.error('Lỗi tải thông báo:', err);
        }
    };

    const handleNotificationClick = async (notification) => {
        // Mark as read
        if (!notification.is_read) {
            try {
                await axios.patch(`${API_URL}/api/notifications/${notification.notification_id}/read`, {}, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                loadNotifications(); // Reload
            } catch (err) {
                console.error('Lỗi đánh dấu đã đọc:', err);
            }
        }
        // Navigate if has related link
        if (notification.type === 'appointment' && notification.related_id) {
            navigate('/appointment');
        } else if (notification.type === 'message') {
            navigate('/chose-chat');
        }
    };

    const formatTimeAgo = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Vừa xong';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
        return `${Math.floor(seconds / 86400)} ngày trước`;
    };

    return (
        <Navbar expand="lg" className="main-navbar" variant="dark" sticky="top">
            <Container>
                <Navbar.Brand
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <img
                        src="/logo.png"
                        alt="Logo"
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span className="navbar-brand-text">
                        COOL CAT <span className="highlight">COMFORT</span>
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
                    {/* ===== LEFT MENU ===== */}
                    <Nav className="me-auto nav-links">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `nav-link nav-link-custom${isActive ? ' active' : ''}`
                            }
                        >
                            Home
                        </NavLink>
                        {/* MENU CHỈ DÀNH CHO USER */}
                        {isUser && (
                            <>
                                <NavLink
                                    to="/chose-chat"
                                    className={({ isActive }) =>
                                        `nav-link nav-link-custom${isActive ? ' active' : ''}`
                                    }
                                >
                                    Trò chuyện
                                </NavLink>

                                <NavLink
                                    to="/appointment"
                                    className={({ isActive }) =>
                                        `nav-link nav-link-custom${isActive ? ' active' : ''}`
                                    }
                                >
                                    Đặt lịch chuyên gia
                                </NavLink>

                                <NavLink
                                    to="/analytic"
                                    className={({ isActive }) =>
                                        `nav-link nav-link-custom${isActive ? ' active' : ''}`
                                    }
                                >
                                    Thống kê
                                </NavLink>

                            </>
                        )}

                        {/* MENU CHO EXPERT */}
                        {isExpert && (
                            <>
                                <NavLink
                                    to="/doctor-chat"
                                    className={({ isActive }) =>
                                        `nav-link nav-link-custom${isActive ? ' active' : ''}`
                                    }
                                >
                                    Chat với người dùng
                                </NavLink>
                                <NavLink
                                    to="/appointment"
                                    className={({ isActive }) =>
                                        `nav-link nav-link-custom${isActive ? ' active' : ''}`
                                    }
                                >
                                    Quản lý lịch hẹn
                                </NavLink>

                            </>


                        )}

                        {/* MENU CHO ADMIN */}
                        {isAdmin && (
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    `nav-link nav-link-custom${isActive ? ' active' : ''}`
                                }
                            >
                                Quản trị
                            </NavLink>

                        )}
                        <NavLink
                            to="/therapy"
                            className={({ isActive }) =>
                                `nav-link nav-link-custom${isActive ? ' active' : ''}`
                            }
                        >
                            Trị liệu
                        </NavLink>
                    </Nav>

                    {/* ===== RIGHT MENU ===== */}
                    <Nav>
                        {!isLoggedIn && (
                            <>
                                <NavLink to="/register">
                                    <Button variant="light" className="btn-pill me-2">
                                        Đăng ký
                                    </Button>
                                </NavLink>
                                <NavLink to="/login">
                                    <Button variant="dark" className="btn-pill">
                                        Đăng nhập
                                    </Button>
                                </NavLink>
                            </>
                        )}

                        {isLoggedIn && (
                            <>
                                {/* Notification Dropdown */}
                                <NavDropdown
                                    align="end"
                                    id="notification-dropdown"
                                    className="notification-dropdown me-2"
                                    title={
                                        <span style={{ position: 'relative', display: 'inline-block' }}>
                                            <FaBell size={22} color="#fff" />
                                            {unreadCount > 0 && (
                                                <Badge
                                                    bg="danger"
                                                    pill
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-8px',
                                                        right: '-8px',
                                                        fontSize: '10px',
                                                        minWidth: '18px',
                                                        height: '18px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                </Badge>
                                            )}
                                        </span>
                                    }
                                >
                                    <div style={{ minWidth: '320px', maxWidth: '400px' }}>
                                        <div className="px-3 py-2 border-bottom">
                                            <strong>Thông báo</strong>
                                            {unreadCount > 0 && (
                                                <Badge bg="danger" className="ms-2">{unreadCount} mới</Badge>
                                            )}
                                        </div>

                                        {recentNotifications.length === 0 ? (
                                            <div className="text-center py-4 text-muted">
                                                <FaBell size={30} className="mb-2" />
                                                <p className="mb-0">Không có thông báo</p>
                                            </div>
                                        ) : (
                                            <>
                                                {recentNotifications.map((noti) => (
                                                    <NavDropdown.Item
                                                        key={noti.notification_id}
                                                        onClick={() => handleNotificationClick(noti)}
                                                        className={`py-2 ${!noti.is_read ? 'bg-light' : ''}`}
                                                        style={{
                                                            whiteSpace: 'normal',
                                                            borderBottom: '1px solid #eee'
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-start">
                                                            <div className="flex-grow-1">
                                                                <div className="fw-semibold mb-1">
                                                                    {noti.title}
                                                                    {!noti.is_read && (
                                                                        <Badge bg="primary" className="ms-1" style={{ fontSize: '9px' }}>
                                                                            MỚI
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="small text-muted mb-1">
                                                                    {noti.message}
                                                                </div>
                                                                <div className="small text-muted">
                                                                    {formatTimeAgo(noti.created_at)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </NavDropdown.Item>
                                                ))}
                                                <NavDropdown.Divider />
                                                <NavDropdown.Item
                                                    onClick={() => navigate('/notifications')}
                                                    className="text-center text-primary fw-semibold"
                                                >
                                                    Xem tất cả thông báo
                                                </NavDropdown.Item>
                                            </>
                                        )}
                                    </div>
                                </NavDropdown>

                                {/* User Dropdown */}
                                <NavDropdown
                                    align="end"
                                    id="user-dropdown"
                                    className="user-dropdown"
                                    title={
                                        <span className="d-flex align-items-center gap-2">
                                            <FaUserCircle size={26} color="#fff" />
                                            <span className="fw-semibold">
                                                {user.name || user.full_name || user.email}
                                            </span>
                                        </span>
                                    }
                                >
                                    <NavDropdown.Item as={NavLink} to="/profile">
                                        Hồ sơ cá nhân
                                    </NavDropdown.Item>

                                    <NavDropdown.Divider />

                                    <NavDropdown.Item
                                        onClick={onLogout}
                                        className="text-danger fw-semibold"
                                    >
                                        Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CollapsibleExample;