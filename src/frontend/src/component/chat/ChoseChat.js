import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChoseChat = () => {
    // Dữ liệu hiển thị
    const options = [
        {
            img: "./img/chatAI.png",
            link: "/chat",
            btnText: "Trò chuyện với trợ lý ảo",
            isPrimary: false
        },
        {
            img: "./img/chatBS2.jpg",
            link: "/choseapp",
            btnText: "Trò chuyện với chuyên gia",
            isPrimary: true
        },
        {
            img: "./img/nhatky.jpg",
            link: "/diary",
            btnText: "Viết nhật ký",
            isPrimary: false
        }
    ];

    return (
        <div className="chose-chat-specific">
            <Container className="py-5 h-100 d-flex flex-column justify-content-center">

                <Row className="g-4 justify-content-center">
                    {options.map((item, index) => (
                        <Col key={index} md={6} lg={4}>
                            {/* Full Card Image Wrapper */}
                            <Card className="full-img-card h-100 border-0 text-white overflow-hidden">
                                <Card.Img
                                    src={item.img}
                                    alt={item.title}
                                    className="full-card-bg"
                                    onError={(e) => { e.target.src = 'https://placehold.co/600x800?text=Image'; }}
                                />
                                {/* Overlay Gradient để làm tối ảnh giúp chữ dễ đọc */}
                                <div className="card-img-overlay d-flex flex-column justify-content-end p-4">
                                    <div className="card-content-wrapper">
                                        <Card.Title className="fw-bold mb-2 fs-4">{item.title}</Card.Title>
                                        <Card.Text className="mb-4 opacity-75">
                                            {item.text}
                                        </Card.Text>
                                        <NavLink to={item.link} className="text-decoration-none w-100 d-block">
                                            <Button
                                                className={`w-100 py-2 fw-bold btn-overlay`}
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

export default ChoseChat;