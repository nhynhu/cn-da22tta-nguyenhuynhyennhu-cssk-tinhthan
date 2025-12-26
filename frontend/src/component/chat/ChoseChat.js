import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

const ChoseChat = () => {
    return (
        <div style={{
            container: {
                flex: 1,
                justifyContent: 'center', // Giữ khối nội dung ở giữa màn hình
                alignItems: 'center',
                backgroundColor: '#fff',
            },

            display: 'flex',
            justifyContent: 'space-around',
            margin: '40px',
        }}>
            <Card style={{ width: '18rem' }}>
                <Card.Img
                    variant="top"
                    src="https://via.placeholder.com/286x180.png?text=Chat+v%E1%BB%9Bi+chuy%C3%AAn+gia"
                    alt="Chat với chuyên gia"
                />
                <Card.Body>
                    <Card.Title>Trao đổi với chuyên gia</Card.Title>
                    <Card.Text>
                        Trò chuyện trực tiếp với chuyên gia để được tư vấn chuyên sâu về sức khỏe tinh thần.
                    </Card.Text>
                    <Nav>
                        <NavLink to="/experts">
                            <Button variant="primary">Bắt đầu chat</Button>
                        </NavLink>
                    </Nav>
                </Card.Body>
            </Card>

            <Card style={{ width: '18rem' }}>
                <Card.Img
                    variant="top"
                    src="https://via.placeholder.com/286x180.png?text=Chat+v%E1%BB%9Bi+tr%E1%BB%A3+l%C3%BD+%E1%BA%A3o"
                    alt="Chat với trợ lý ảo"
                />
                <Card.Body>
                    <Card.Title>Trợ lý ảo lắng nghe</Card.Title>
                    <Card.Text>
                        Tâm sự cùng trợ lý ảo 24/7 để giải tỏa cảm xúc và nhận gợi ý phù hợp.
                    </Card.Text>
                    <Nav>
                        <NavLink to="/chat">
                            <Button variant="outline-primary">Chat với trợ lý ảo</Button>
                        </NavLink>
                    </Nav>
                </Card.Body>
            </Card>

            <Card style={{ width: '18rem' }}>
                <Card.Img
                    variant="top"
                    src="https://via.placeholder.com/286x180.png?text=Chat+v%E1%BB%9Bi+tr%E1%BB%A3+l%C3%BD+%E1%BA%A3o"
                    alt="Chat với trợ lý ảo"
                />
                <Card.Body>
                    <Card.Title>Trợ lý ảo lắng nghe</Card.Title>
                    <Card.Text>
                        Đặt lịch hẹn khám trực tiếp với chuyên gia.
                    </Card.Text>
                    <Nav>
                        <NavLink to="/appointment">
                            <Button variant="outline-primary">Đặt lịch hẹn</Button>
                        </NavLink>
                    </Nav>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ChoseChat;