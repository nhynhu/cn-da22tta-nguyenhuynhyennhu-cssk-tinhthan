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
            <section className="hero">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <p className="hero-greeting">{greeting}</p>
                            <h1 className="hero-heading">
                                Bạn có khỏe không hôm nay?
                            </h1>
                            <p className="hero-desc">
                                Đôi khi chỉ cần một người lắng nghe. Chúng tôi ở đây,
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
                                <Button
                                    className="btn-ghost"
                                    onClick={() => navigate('/therapy')}
                                >
                                    Xem bài tập thư giãn
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
                                    <img src="/img/guide-1.jpg" alt="Hoa tiêu" />
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
                                    <img src="/img/guide-2.jpg" alt="Cổng" />
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
                                    <img src="/img/guide-3.jpg" alt="Tự trợ giúp bằng AI" />
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
                    <h2 className="section-title">Bạn có thể làm gì ở đây?</h2>
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
                            <div className="service-card" onClick={() => navigate('/chose-app')}>
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
                                <img src="/img/guide-1.jpg" alt="Về chúng tôi" />
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
                    <h2 className="section-title">Bắt đầu như thế nào?</h2>
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
                                    name: 'Neca Smith',
                                    role: 'Chuyên gia sức khỏe tinh thần',
                                    image: '/img/expert1.png',
                                    color: '#ab7ae3',
                                },
                                {
                                    name: 'Dr. Jon Kole',
                                    role: 'Bác sĩ tâm thần & Giám đốc y khoa',
                                    image: '/img/expert2.jpg',
                                    color: '#02113d',
                                },
                                {
                                    name: 'Eve Lewis',
                                    role: 'Giảng viên thiền & chánh niệm',
                                    image: '/img/expert3.jpg',
                                    color: '#c9a8f0',
                                },
                                {
                                    name: 'Kessonga Giscombe',
                                    role: 'Giảng viên thiền và chánh niệm',
                                    image: '/img/expert4.jpg',
                                    color: '#1a3a6e',
                                },
                                {
                                    name: 'Rosie Acosta',
                                    role: 'Giảng viên thiền & huấn luyện viên',
                                    image: '/img/expert5.jpg',
                                    color: '#ab7ae3',
                                },
                                {
                                    name: 'Arturo Morales',
                                    role: 'Nhà trị liệu hôn nhân & gia đình',
                                    image: '/img/expert6.jpg',
                                    color: '#02113d',
                                },
                            ]
                                .concat([
                                    {
                                        name: 'Neca Smith',
                                        role: 'Chuyên gia sức khỏe tinh thần',
                                        image: '/img/expert1.png',
                                        color: '#ab7ae3',
                                    },
                                    {
                                        name: 'Dr. Jon Kole',
                                        role: 'Bác sĩ tâm thần & Giám đốc y khoa',
                                        image: '/img/expert2.jpg',
                                        color: '#02113d',
                                    },
                                    {
                                        name: 'Eve Lewis',
                                        role: 'Giảng viên thiền & chánh niệm',
                                        image: '/img/expert3.jpg',
                                        color: '#c9a8f0',
                                    },
                                    {
                                        name: 'Kessonga Giscombe',
                                        role: 'Giảng viên thiền và chánh niệm',
                                        image: '/img/expert4.jpg',
                                        color: '#1a3a6e',
                                    },
                                    {
                                        name: 'Rosie Acosta',
                                        role: 'Giảng viên thiền & huấn luyện viên',
                                        image: '/img/expert5.jpg',
                                        color: '#ab7ae3',
                                    },
                                    {
                                        name: 'Arturo Morales',
                                        role: 'Nhà trị liệu hôn nhân & gia đình',
                                        image: '/img/expert6.jpg',
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

            {/* FAQ */}
            <section className="faq">
                <Container>
                    <h2 className="section-title">Câu hỏi thường gặp</h2>
                    <p className="section-desc">Giải đáp những thắc mắc phổ biến</p>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="faq-item">
                                <h4>Cool Cat Comfort có miễn phí không?</h4>
                                <p>Có, tất cả các tính năng cơ bản như trò chuyện AI, viết nhật ký, bài tập thiền đều hoàn toàn miễn phí.</p>
                            </div>
                            <div className="faq-item">
                                <h4>Thông tin của tôi có được bảo mật không?</h4>
                                <p>Tuyệt đối. Chúng tôi cam kết bảo mật 100% thông tin cá nhân và nội dung nhật ký của bạn.</p>
                            </div>
                            <div className="faq-item">
                                <h4>Tôi có thể đặt lịch với chuyên gia thật không?</h4>
                                <p>Có, bạn có thể đặt lịch hẹn trực tiếp với đội ngũ chuyên gia tâm lý của chúng tôi qua tính năng Đặt lịch hẹn.</p>
                            </div>
                            <div className="faq-item">
                                <h4>AI có thể thay thế chuyên gia tâm lý không?</h4>
                                <p>AI là người bạn lắng nghe và hỗ trợ ban đầu. Với những vấn đề nghiêm trọng, chúng tôi khuyên bạn nên gặp chuyên gia.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CTA */}
            <section className="cta">
                <Container>
                    <div className="cta-box">
                        <h2>Bạn đã sẵn sàng chưa?</h2>
                        <p>Không cần phải hoàn hảo. Chỉ cần bắt đầu từ hôm nay.</p>
                        <Button className="btn-main btn-lg" onClick={() => navigate('/chose-chat')}>
                            Bắt đầu ngay
                        </Button>
                    </div>
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
