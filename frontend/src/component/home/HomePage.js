import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            {/* Hero Section */}
            < div
                style={{
                    background: 'linear-gradient(120deg, #afd2f5ff, #0072abff)',
                    color: 'white',
                    textAlign: 'center',
                    padding: '80px 20px',
                }}
            >
                <h1 style={{ fontWeight: '700', fontSize: '2.5rem' }}>
                    Chăm sóc sức khỏe tinh thần của bạn mỗi ngày
                </h1>
                <Button
                    variant="light"
                    style={{
                        borderRadius: '30px',
                        padding: '10px 30px',
                        fontWeight: '600',
                        marginTop: '25px',
                    }}
                >

                    <NavLink to="/chat">Bắt đầu ngay</NavLink>
                </Button>
            </div >

            {/* Các tính năng chính */}
            < Container style={{ marginTop: '60px', marginBottom: '60px' }}>
                <h2 className="text-center mb-5" style={{ fontWeight: '700', color: '#043d7d' }}>
                    Tính năng nổi bật
                </h2>
                <Row className="text-center">
                    <Col md={4}>
                        <h4> Trò chuyện trị liệu</h4>
                        <p>Kết nối với chuyên gia hoặc AI hỗ trợ tinh thần bất cứ khi nào bạn cần.</p>
                    </Col>
                    <Col md={4}>
                        <h4> Nhật ký cảm xúc</h4>
                        <p>Ghi lại cảm xúc mỗi ngày để hiểu rõ hơn về bản thân.</p>
                    </Col>
                    <Col md={4}>
                        <h4> Thống kê sức khỏe</h4>
                        <p>Theo dõi biểu đồ tâm trạng và tiến trình cải thiện tinh thần của bạn.</p>
                    </Col>
                </Row>
            </Container >

            {/* Footer */}
            < div
                style={{
                    backgroundColor: '#043d7d ',
                    color: 'white',
                    textAlign: 'center',
                    padding: '20px 0',
                }}
            >
                <p>© 2025 </p>
            </div >
        </div >
    );
}

export default HomePage;
