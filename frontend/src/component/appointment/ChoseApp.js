import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChoseApp = () => {
    // Dữ liệu hiển thị cho trang chọn lịch hẹn
    const options = [
        {
            title: "Trao đổi ngay",
            text: "Kết nối trực tuyến với chuyên gia tâm lý để được tư vấn và giải tỏa kịp thời.",
            img: "./img/chatBS2.jpg", // Đảm bảo bạn có hình này hoặc thay link khác
            link: "/experts",
            btnText: "Bắt đầu Chat",
            isPrimary: true
        },
        {
            title: "Đặt lịch hẹn",
            text: "Lên lịch gặp mặt trực tiếp hoặc online vào thời gian phù hợp nhất với bạn.",
            img: "./img/calendar.jpg", // Bạn có thể thêm hình lịch hoặc dùng placeholder
            link: "/appointment",
            btnText: "Đặt lịch ngay",
            isPrimary: false
        }
    ];

    return (
        // Sử dụng chung class style hoặc tạo class mới tương tự
        <div className="chose-app-specific">
            <Container className="py-5 h-100 d-flex flex-column justify-content-center">
                {/* Grid Cards */}
                <Row className="g-4 justify-content-center">
                    {options.map((item, index) => (
                        <Col key={index} md={6} lg={5} className="d-flex align-items-stretch">
                            {/* Full Card Image Wrapper */}
                            <Card className="full-img-card h-100 border-0 text-white overflow-hidden">
                                <Card.Img
                                    src={item.img}
                                    alt={item.title}
                                    className="full-card-bg"
                                    // Fallback nếu ảnh lỗi thì hiện placeholder màu
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/600x400/1e3a8a/ffffff?text=Image';
                                    }}
                                />

                                {/* Overlay Gradient */}
                                <div className="card-img-overlay d-flex flex-column justify-content-end p-4">
                                    <div className="card-content-wrapper">
                                        <Card.Title className="fw-bold mb-2 fs-3">{item.title}</Card.Title>
                                        <Card.Text className="mb-4 opacity-90 fs-6">
                                            {item.text}
                                        </Card.Text>
                                        <NavLink to={item.link} className="text-decoration-none w-100 d-block">
                                            <Button
                                                className="w-100 py-3 fw-bold btn-overlay"
                                            >
                                                {item.btnText}
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default ChoseApp;