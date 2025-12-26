import React from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
    const navigate = useNavigate();
    const slides = [
        '/img/slide1.webp',
        '/img/slide2.jpg',
        '/img/slide3.jpg',
    ];
    return (
        <div>
            {/* Hero Carousel */}
            <Carousel fade interval={4000} pause="hover">
                {slides.map((src, index) => (
                    <Carousel.Item key={index}>
                        <div
                            style={{
                                height: '520px',
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.5)), url(${src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: 'white',
                                padding: '0 20px',
                            }}
                        >
                            <h1 style={{ fontWeight: '700', fontSize: '2.5rem' }}>
                                Chăm sóc sức khỏe tinh thần của bạn mỗi ngày
                            </h1>
                            <p style={{ maxWidth: '650px', marginTop: '10px', opacity: 0.9 }}>
                                Trò chuyện cùng người bạn đồng hành ngay bạn nhé!
                            </p>
                            <Button
                                variant="light"
                                style={{
                                    borderRadius: '30px',
                                    padding: '10px 30px',
                                    fontWeight: '600',
                                    marginTop: '25px',
                                }}
                            >
                                <NavLink to="/chose-chat" style={{ textDecoration: 'none', color: '#1f2937' }}>
                                    Bắt đầu ngay
                                </NavLink>
                            </Button>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>

            {/* Lưới thẻ đổi hình thành chữ khi hover */}
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
            {/* Section kiểu "cổng" / navigator hai cột */}
            <Container fluid className="navigator-section">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10}>
                            <div className="navigator-card">
                                <Row className="g-4 align-items-center">
                                    <Col md={6}>
                                        <h3 className="navigator-title mb-3">
                                            Hướng bạn tới bước tiếp theo phù hợp
                                        </h3>
                                        <p style={{ color: '#374151', lineHeight: 1.7 }}>
                                            COOL CAT COMFORT giống như một "cổng" hướng dẫn mềm mại: dựa trên cảm
                                            xúc và thói quen của bạn, ứng dụng gợi ý những việc nhỏ nhưng thiết
                                            thực để bạn bắt đầu chăm sóc sức khỏe tinh thần.
                                        </p>
                                        <p style={{ color: '#374151', lineHeight: 1.7 }}>
                                            Dù bạn muốn chỉ ghi vài dòng nhật ký, thử một bài thở thư giãn hay đặt
                                            lịch với chuyên gia, hệ thống đều giúp bạn chọn lựa dễ dàng và an toàn.
                                        </p>
                                        <small style={{ color: '#6b7280' }}>
                                            Dành cho sinh viên, người đi làm hoặc bất kỳ ai muốn quan tâm tới chính
                                            mình nhiều hơn.
                                        </small>
                                        <div className="mt-4">
                                            <Button
                                                variant="outline-warning"
                                                style={{ borderRadius: 999, padding: '8px 24px', fontWeight: 600 }}
                                                onClick={() => navigate('/diary')}
                                            >
                                                Tìm hiểu thêm
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md={6} className="navigator-image-col">
                                        <div className="navigator-image-wrapper">
                                            <img
                                                src="/img/navigator-person.jpg"
                                                alt="Người dùng đang sử dụng ứng dụng trên điện thoại"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
            {/* Slider chuyên gia - auto scroll giống video */}
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
                                    color: '#facc15',
                                },
                                {
                                    name: 'Dr. Jon Kole',
                                    role: 'Bác sĩ tâm thần & Giám đốc y khoa',
                                    image: '/img/expert2.jpg',
                                    color: '#38bdf8',
                                },
                                {
                                    name: 'Eve Lewis',
                                    role: 'Giảng viên thiền & chánh niệm',
                                    image: '/img/expert3.jpg',
                                    color: '#fb7185',
                                },
                                {
                                    name: 'Kessonga Giscombe',
                                    role: 'Giảng viên thiền và chánh niệm',
                                    image: '/img/expert4.jpg',
                                    color: '#22c55e',
                                },
                                {
                                    name: 'Rosie Acosta',
                                    role: 'Giảng viên thiền & huấn luyện viên',
                                    image: '/img/expert5.jpg',
                                    color: '#f97316',
                                },
                                {
                                    name: 'Arturo Morales',
                                    role: 'Nhà trị liệu hôn nhân & gia đình',
                                    image: '/img/expert6.jpg',
                                    color: '#eab308',
                                },
                            ]
                                .concat([
                                    {
                                        name: 'Neca Smith',
                                        role: 'Chuyên gia sức khỏe tinh thần',
                                        image: '/img/expert1.jpg',
                                        color: '#facc15',
                                    },
                                    {
                                        name: 'Dr. Jon Kole',
                                        role: 'Bác sĩ tâm thần & Giám đốc y khoa',
                                        image: '/img/expert2.jpg',
                                        color: '#38bdf8',
                                    },
                                    {
                                        name: 'Eve Lewis',
                                        role: 'Giảng viên thiền & chánh niệm',
                                        image: '/img/expert3.jpg',
                                        color: '#fb7185',
                                    },
                                    {
                                        name: 'Kessonga Giscombe',
                                        role: 'Giảng viên thiền và chánh niệm',
                                        image: '/img/expert4.jpg',
                                        color: '#22c55e',
                                    },
                                    {
                                        name: 'Rosie Acosta',
                                        role: 'Giảng viên thiền & huấn luyện viên',
                                        image: '/img/expert5.jpg',
                                        color: '#f97316',
                                    },
                                    {
                                        name: 'Arturo Morales',
                                        role: 'Nhà trị liệu hôn nhân & gia đình',
                                        image: '/img/expert6.jpg',
                                        color: '#eab308',
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
            <div
                style={{
                    backgroundColor: '#02113d ',
                    color: 'white',
                    textAlign: 'center',
                    padding: '20px 0',
                }}
            >
                <p>© 2025 </p>
            </div>
        </div >
    );
}

export default HomePage;
