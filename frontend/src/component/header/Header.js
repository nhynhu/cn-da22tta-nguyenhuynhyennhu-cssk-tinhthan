import { NavLink, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const CollapsibleExample = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const isAdmin = user && user.role === 'admin';
    const isExpert = user && user.role === 'expert';
    const isUser = user && user.role === 'user';
    const isLoggedIn = !!user;

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
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CollapsibleExample;
