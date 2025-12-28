import { NavLink, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
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
                        src="/logo.png" // Đặt file logo.png trong thư mục public
                        alt="Logo"
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span className="navbar-brand-text">
                        COOL CAT <span className="highlight">COMFORT</span>
                    </span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
                    <Nav className="me-auto nav-links">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `nav-link nav-link-custom${isActive ? ' active' : ''}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/chose-chat"
                            className={({ isActive }) =>
                                `nav-link nav-link-custom${isActive ? ' active' : ''}`
                            }
                        >
                            Trò chuyện
                        </NavLink>
                        <NavLink
                            to="/diary"
                            className={({ isActive }) =>
                                `nav-link nav-link-custom${isActive ? ' active' : ''}`
                            }
                        >
                            Nhật ký
                        </NavLink>
                        <NavLink
                            to="/analytic"
                            className={({ isActive }) =>
                                `nav-link nav-link-custom${isActive ? ' active' : ''}`
                            }
                        >
                            Thống kê
                        </NavLink>
                        <NavLink
                            to="/therapy"
                            className={({ isActive }) =>
                                `nav-link nav-link-custom${isActive ? ' active' : ''}`
                            }
                        >
                            Trị liệu
                        </NavLink>
                        {isExpert && (
                            <NavLink
                                to="/doctor-chat"
                                className={({ isActive }) =>
                                    `nav-link nav-link-custom${isActive ? ' active' : ''}`
                                }
                            >
                                Chat bệnh nhân
                            </NavLink>
                        )}
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
                    </Nav>
                    <Nav>
                        {!isLoggedIn && (
                            <>
                                <NavLink to="/register">
                                    <Button
                                        variant="light"
                                        className="btn-pill me-2"
                                    >
                                        Đăng ký
                                    </Button>
                                </NavLink>
                                <NavLink to="/login">
                                    <Button
                                        variant="dark"
                                        className="btn-pill"
                                    >
                                        Đăng nhập
                                    </Button>
                                </NavLink>
                            </>
                        )}
                        {isLoggedIn && (
                            <>
                                <NavLink
                                    to="/profile"
                                    className="nav-link nav-link-custom me-2"
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    Xin chào, {user.name || user.full_name || user.email}
                                </NavLink>
                                <Button
                                    variant="outline-light"
                                    className="btn-pill"
                                    onClick={onLogout}
                                >
                                    Đăng xuất
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CollapsibleExample;
