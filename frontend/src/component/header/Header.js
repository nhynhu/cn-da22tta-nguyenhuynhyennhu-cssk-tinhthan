import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';

const CollapsibleExample = () => {
    return (
        <Navbar expand="lg" style={{ backgroundColor: '#043d7d' }}>
            <Container>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
                    <Nav className="me-auto" style={{ gap: '20px' }}>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/chat">Trò chuyện</NavLink>
                        <NavLink to="/diary">Nhật ký</NavLink>
                        <NavLink to="/analytic">Thống kê</NavLink>
                        <NavLink to="/therapy">Trị liệu</NavLink>

                    </Nav>
                    <Nav>
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
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CollapsibleExample;
