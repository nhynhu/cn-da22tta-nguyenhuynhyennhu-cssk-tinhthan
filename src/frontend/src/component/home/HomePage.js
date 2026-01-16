import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            setGreeting('Chào buổi sáng');
        } else if (hour >= 12 && hour < 18) {
            setGreeting('Chào buổi chiều');
        } else {
            setGreeting('Chào buổi tối');
        }
    }, []);

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero" style={{ backgroundImage: 'url(./img/bg.png)' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <p className="hero-greeting">{greeting}</p>
                            <h1 className="hero-heading" style={{ fontSize: '3.5rem', fontWeight: '800' }}>
                                Hôm nay bạn thế nào?
                            </h1>
                            <p className="hero-desc" style={{ fontSize: '1.2rem' }}>
                                Chúng tôi ở đây,
                                sẵn sàng đồng hành cùng bạn qua những ngày khó khăn
                                hay đơn giản là trò chuyện về cuộc sống.
                            </p>
                            <div className="hero-buttons">
                                <Button
                                    className="btn-main"
                                    onClick={() => navigate('/chose-chat')}
                                    style={{ fontSize: '1.1rem', padding: '12px 32px' }}
                                >
                                    Bắt đầu trò chuyện
                                </Button>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="hero-image">
                                <img src="/img/slide1.webp" alt="Chăm sóc sức khỏe tinh thần" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Feature Hover Cards - Lật hình thành chữ */}
            <Container fluid className="feature-hover-section">
                <Container>
                    <div className="feature-hover-grid">
                        {/* Hoa tiêu */}
                        <div className="feature-hover-card">
                            <div className="feature-hover-inner">
                                <div className="feature-hover-image">
                                    <img src="./img/slide2.jpg" alt="Hoa tiêu" />
                                </div>
                                <div className="feature-hover-content">
                                <h3>Chia sẻ tâm trạng</h3>
                                <p>Hãy kể cho chúng tôi nghe hôm nay bạn cảm thấy thế nào. Không cần phải đúng hay sai, chỉ cần thật lòng.</p>
                                </div>
                            </div>
                        </div>

                        {/* Cổng */}
                        <div className="feature-hover-card">
                            <div className="feature-hover-inner">
                                <div className="feature-hover-image">
                                    <img src="./img/slide4.png" alt="Cổng" />
                                </div>
                                <div className="feature-hover-content">
                                     <h3>Nhận gợi ý phù hợp</h3>
                                <p>Dựa trên chia sẻ của bạn, chúng tôi sẽ đề xuất các hoạt động, bài tập hoặc kết nối với chuyên gia.</p>
                                </div>
                            </div>
                        </div>

                        {/* Tự trợ giúp bằng AI */}
                        <div className="feature-hover-card">
                            <div className="feature-hover-inner">
                                <div className="feature-hover-image">
                                    <img src="./img/slide5.png" alt="Tự trợ giúp bằng AI" />
                                </div>
                                <div className="feature-hover-content">
                                  <h3>Theo dõi tiến trình</h3>
                                <p>Xem lại hành trình của bạn, nhận ra những thay đổi tích cực dù là nhỏ nhất.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Container>

            
            {/* About */}
            <section className="about">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={5}>
                            <div className="about-image">
                                <img src="./img/vechungtoi2.png" alt="Về chúng tôi" />
                            </div>
                        </Col>
                        <Col lg={7}>
                            <div className="about-content">
                                <h2>Tại sao chọn Cool Cat Comfort?</h2>
                                <p>
                                    Chúng tôi hiểu rằng cuộc sống đôi khi không dễ dàng. Áp lực công việc,
                                    học tập, các mối quan hệ... tất cả đều có thể khiến bạn cảm thấy mệt mỏi.
                                </p>
                                <p>
                                    Cool Cat Comfort được tạo ra để trở thành người bạn đồng hành của bạn.
                                    Không phán xét, không vội vàng - chỉ đơn giản là lắng nghe và hỗ trợ
                                    bạn theo cách riêng của mình.
                                </p>
                                <ul className="about-list">
                                    <li>Trò chuyện với AI 24/7, bất cứ lúc nào bạn cần</li>
                                    <li>Đội ngũ chuyên gia tâm lý giàu kinh nghiệm</li>
                                    <li>Các bài tập thiền và thư giãn được thiết kế khoa học</li>
                                    <li>Theo dõi cảm xúc và sức khỏe tinh thần cá nhân</li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
               {/* Services */}
            <section className="services">
                <Container>
                    <h2 className="experts-title">Bạn có thể làm gì ở đây?</h2>
                    <Row>
                        <Col md={6} lg={3}>
                            <div className="service-card" onClick={() => navigate('/chose-chat')}>
                                <div className="service-icon">
                                    <i className="bi bi-chat-dots-fill" style={{ fontSize: '3rem', color: '#ffffff' }}></i>
                                </div>
                                <h3>Trò chuyện</h3>
                                <p>Chia sẻ tâm sự với AI hoặc kết nối với chuyên gia tâm lý</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className="service-card" onClick={() => navigate('/diary')}>
                                <div className="service-icon">
                                    <i className="bi bi-journal-text" style={{ fontSize: '3rem', color: '#ffffff' }}></i>
                                </div>
                                <h3>Viết nhật ký</h3>
                                <p>Ghi lại cảm xúc, suy nghĩ và theo dõi tâm trạng mỗi ngày</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className="service-card" onClick={() => navigate('/therapy')}>
                                <div className="service-icon">
                                    <i className="bi bi-hearts" style={{ fontSize: '3rem', color: '#ffffff' }}></i>
                                </div>
                                <h3>Bài tập trị liệu</h3>
                                <p>Thiền, hít thở, yoga và các bài tập giúp thư giãn tinh thần</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className="service-card" onClick={() => navigate('/appointment')}>
                                <div className="service-icon">
                                    <i className="bi bi-calendar-check-fill" style={{ fontSize: '3rem', color: '#ffffff' }}></i>
                                </div>
                                <h3>Đặt lịch hẹn</h3>
                                <p>Gặp gỡ chuyên gia tâm lý để được tư vấn trực tiếp</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>


            {/* Expert Auto Slider */}
            <Container fluid className="experts-section">
                <Container>
                    <h2 className="experts-title">Đồng hành cùng đội ngũ chuyên gia</h2>
                    <p className="experts-subtitle">
                        Những người hướng dẫn, nhà trị liệu và huấn luyện viên chánh niệm luôn sẵn sàng hỗ trợ bạn.
                    </p>
                    <div className="experts-slider">
                        <div className="experts-track">
                            {[
                                {
                                    name: 'Nguyễn Thị Lan',
                                    role: 'Chuyên gia sức khỏe tinh thần',
                                    image: './img/Lan.png',
                                    color: '#ab7ae3',
                                },
                                {
                                    name: 'Thạch Văn Dũng',
                                    role: 'Bác sĩ tâm thần và Giám đốc y khoa',
                                    image: './img/Dung.png',
                                    color: '#02113d',
                                },
                                {
                                    name: 'Cao Thị Hồng',
                                    role: 'Giảng viên thiền và chánh niệm',
                                    image: './img/Hong.png',
                                    color: '#c9a8f0',
                                },
                                {
                                    name: 'Trần Minh Như',
                                    role: 'Giảng viên thiền và chánh niệm',
                                    image: './img/Nhu.png',
                                    color: '#1a3a6e',
                                },
                                {
                                    name: 'Lê Thị Hương',
                                    role: 'Giảng viên thiền và huấn luyện viên',
                                    image: './img/Huong.png',
                                    color: '#ab7ae3',
                                },
                                {
                                    name: 'Nguyễn Chí Hùng',
                                    role: 'Nhà trị liệu hôn nhân và gia đình',
                                    image: './img/Hung.png',
                                    color: '#02113d',
                                },
                            ]
                                .concat([
                                    {
                                        name: 'Nguyễn Thị Lan',
                                        role: 'Chuyên gia sức khỏe tinh thần',
                                        image: './img/Lan.png',
                                        color: '#ab7ae3',
                                    },
                                    {
                                        name: 'Thạch Văn Dũng',
                                        role: 'Bác sĩ tâm thần và Giám đốc y khoa',
                                        image: './img/Dung.png',
                                        color: '#02113d',
                                    },
                                    {
                                        name: 'Cao Thị Hồng',
                                        role: 'Giảng viên thiền và chánh niệm',
                                        image: './img/Hong.png',
                                        color: '#c9a8f0',
                                    },
                                    {
                                        name: 'Trần Minh Như',
                                        role: 'Giảng viên thiền và chánh niệm',
                                        image: './img/Nhu.png',
                                        color: '#1a3a6e',
                                    },
                                    {
                                        name: 'Lê Thị Hương',
                                        role: 'Giảng viên thiền và huấn luyện viên',
                                        image: './img/Huong.png',
                                        color: '#ab7ae3',
                                    },
                                    {
                                        name: 'Nguyễn Chí Hùng',
                                        role: 'Nhà trị liệu hôn nhân và gia đình',
                                        image: './img/Hung.png',
                                        color: '#02113d',
                                    },
                                ])
                                .map((expert, index) => (
                                    <div
                                        key={index}
                                        className="expert-card"
                                        style={{ background: expert.color }}
                                    >
                                        <div className="expert-photo">
                                            <img src={expert.image} alt={expert.name} />
                                        </div>
                                        <div className="expert-name">{expert.name}</div>
                                        <div className="expert-role">{expert.role}</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </Container>
            </Container>


            {/* Footer */}
            <footer className="footer">
                <Container>
                    <Row>
                        <Col lg={4}>
                            <div className="footer-links">
                                <h4>Cool Cat Comfort</h4>
                                <p>Đồng hành cùng bạn mỗi ngày</p>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="footer-links">
                                <h4>Tính năng</h4>
                                <NavLink to="/chose-chat">Trò chuyện</NavLink>
                                <NavLink to="/diary">Nhật ký</NavLink>
                                <NavLink to="/therapy">Trị liệu</NavLink>
                                <NavLink to="/chose-app">Đặt lịch hẹn</NavLink>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="footer-links">
                                <h4>Liên hệ</h4>
                                <p style={{ marginBottom: '8px' }}>
                                    <i className="bi bi-geo-alt-fill" style={{ marginRight: '8px' }}></i>
                                    123 Đường ABC, phường XYZ, Trà Vinh
                                </p>
                                <p style={{ marginBottom: '8px' }}>
                                    <i className="bi bi-telephone-fill" style={{ marginRight: '8px' }}></i>
                                    0123 456 789
                                </p>
                                <p style={{ marginBottom: '8px' }}>
                                    <i className="bi bi-envelope-fill" style={{ marginRight: '8px' }}></i>
                                    contact@coolcatcomfort.vn
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <div className="footer-bottom">
                        <p>© 2025 Cool Cat Comfort</p>
                    </div>
                </Container>
            </footer>
        </div>
    );
}

export default HomePage;
