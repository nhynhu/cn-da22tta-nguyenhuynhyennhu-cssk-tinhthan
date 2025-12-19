import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const CollapsibleExample = ({ user, onLogout }) => {
    const isAdmin = user && user.role === 'admin';
    const isExpert = user && user.role === 'expert';
    const isLoggedIn = !!user;

    return (
        <Navbar expand="lg" style={{ backgroundColor: '#043d7d' }}>
            <Container>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
                    <Nav className="me-auto" style={{ gap: '20px' }}>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/chose-chat">Trò chuyện</NavLink>
                        <NavLink to="/diary">Nhật ký</NavLink>
                        <NavLink to="/analytic">Thống kê</NavLink>
                        <NavLink to="/therapy">Trị liệu</NavLink>
                        {isExpert && <NavLink to="/doctor-chat">Chat bệnh nhân</NavLink>}
                        {isAdmin && <NavLink to="/admin">Quản trị</NavLink>}
                    </Nav>
                    <Nav>
                        {!isLoggedIn && (
                            <>
                                <NavLink to="/register">
                                    <Button
                                        variant="light"
                                        style={{
                                            borderRadius: '20px',
                                            padding: '5px 20px',
                                            marginRight: '10px',
                                            fontWeight: '500',
                                        }}
                                    >
                                        Đăng ký
                                    </Button>
                                </NavLink>
                                <NavLink to="/login">
                                    <Button
                                        variant="dark"
                                        style={{
                                            borderRadius: '20px',
                                            padding: '5px 20px',
                                            fontWeight: '500',
                                        }}
                                    >
                                        Đăng nhập
                                    </Button>
                                </NavLink>
                            </>
                        )}
                        {isLoggedIn && (
                            <>
                                <Navbar.Text className="me-3" style={{ color: '#fff' }}>
                                    Xin chào, {user.name || user.full_name || user.email}
                                </Navbar.Text>
                                <Button
                                    variant="outline-light"
                                    style={{
                                        borderRadius: '20px',
                                        padding: '5px 20px',
                                        fontWeight: '500',
                                    }}
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
