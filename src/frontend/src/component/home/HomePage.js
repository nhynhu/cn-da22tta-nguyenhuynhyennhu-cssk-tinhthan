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
                            <h1 className="hero-heading">
                                Hôm nay bạn thế nào?
                            </h1>
                            <p className="hero-desc">
                                Chúng tôi ở đây,
                                sẵn sàng đồng hành cùng bạn qua những ngày khó khăn
                                hay đơn giản là trò chuyện về cuộc sống.
                            </p>
                            <div className="hero-buttons">
                                <Button
                                    className="btn-main"
                                    onClick={() => navigate('/chose-chat')}
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
                                    <p>
                                        Một khu vực giúp bạn định hướng: nên viết nhật ký, trò chuyện, hay thử một
                                        bài tập thư giãn vào lúc này.
                                    </p>
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
                                    <p>
                                        Từ một nơi, bạn có thể đi đến nhật ký, trị liệu, thống kê hoặc cuộc hẹn với
                                        chuyên gia chỉ bằng vài cú chạm.
                                    </p>
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
                                    <p>
                                        Một người bạn ảo lắng nghe 24/7, phản hồi dịu dàng và gợi ý bài tập phù hợp
                                        với cảm xúc của bạn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Container>

            {/* Services */}
            <section className="services">
                <Container>
                    <h2 className="experts-title">Bạn có thể làm gì ở đây?</h2>
                    <Row>
                        <Col md={6} lg={3}>
                            <div className="service-card" onClick={() => navigate('/chose-chat')}>
                                <div className="service-icon">
                                    <img src="/img/icon-chat.svg" alt="" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <h3>Trò chuyện</h3>
                                <p>Chia sẻ tâm sự với AI hoặc kết nối với chuyên gia tâm lý</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className="service-card" onClick={() => navigate('/diary')}>
                                <div className="service-icon">
                                    <img src="/img/icon-diary.svg" alt="" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <h3>Viết nhật ký</h3>
                                <p>Ghi lại cảm xúc, suy nghĩ và theo dõi tâm trạng mỗi ngày</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className="service-card" onClick={() => navigate('/therapy')}>
                                <div className="service-icon">
                                    <img src="/img/icon-therapy.svg" alt="" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <h3>Bài tập trị liệu</h3>
                                <p>Thiền, hít thở, yoga và các bài tập giúp thư giãn tinh thần</p>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className="service-card" onClick={() => navigate('/appointment')}>
                                <div className="service-icon">
                                    <img src="/img/icon-calendar.svg" alt="" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <h3>Đặt lịch hẹn</h3>
                                <p>Gặp gỡ chuyên gia tâm lý để được tư vấn trực tiếp</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

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

            {/* How it works */}
            <section className="how-works">
                <Container>
                    <h2 className="experts-title">Bắt đầu như thế nào?</h2>
                    <p className="section-desc">Chỉ cần 3 bước đơn giản để bắt đầu hành trình chăm sóc bản thân</p>
                    <Row>
                        <Col md={4}>
                            <div className="step">
                                <div className="step-num">1</div>
                                <h3>Chia sẻ tâm trạng</h3>
                                <p>Hãy kể cho chúng tôi nghe hôm nay bạn cảm thấy thế nào. Không cần phải đúng hay sai, chỉ cần thật lòng.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="step">
                                <div className="step-num">2</div>
                                <h3>Nhận gợi ý phù hợp</h3>
                                <p>Dựa trên chia sẻ của bạn, chúng tôi sẽ đề xuất các hoạt động, bài tập hoặc kết nối với chuyên gia.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="step">
                                <div className="step-num">3</div>
                                <h3>Theo dõi tiến trình</h3>
                                <p>Xem lại hành trình của bạn, nhận ra những thay đổi tích cực dù là nhỏ nhất.</p>
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

            {/* Testimonials */}
            <section className="testimonials">
                <Container>
                    <h2 className="section-title">Mọi người nói gì?</h2>
                    <Row>
                        <Col lg={4}>
                            <div className="testimonial">
                                <p className="testimonial-text">
                                    "Lúc đầu tôi cũng ngại, không biết nói gì. Nhưng càng trò chuyện càng thấy nhẹ lòng.
                                    Cảm ơn vì đã lắng nghe."
                                </p>
                                <div className="testimonial-author">
                                    <strong>Minh Anh</strong>
                                    <span>Sinh viên năm 3</span>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="testimonial">
                                <p className="testimonial-text">
                                    "Công việc stress quá, tôi hay mất ngủ. Mấy bài tập thở ở đây giúp tôi dễ ngủ hơn nhiều."
                                </p>
                                <div className="testimonial-author">
                                    <strong>Hoàng Nam</strong>
                                    <span>Nhân viên văn phòng</span>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="testimonial">
                                <p className="testimonial-text">
                                    "Tôi thích viết nhật ký ở đây. Nhìn lại mới thấy mình đã thay đổi nhiều theo hướng tích cực."
                                </p>
                                <div className="testimonial-author">
                                    <strong>Thu Hà</strong>
                                    <span>Giáo viên</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Footer */}
            <footer className="footer">
                <Container>
                    <Row>
                        <Col lg={4}>
                            <div className="footer-brand">
                                <h3>Cool Cat Comfort</h3>
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
                                <h4>Khác</h4>
                                <NavLink to="/analytic">Thống kê</NavLink>
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
