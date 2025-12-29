import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

// Trang chọn chuyên gia
function ExpertList() {
    const [experts, setExperts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/experts`);
                const data = await res.json();
                setExperts(data.data || []);
            } catch (err) {
                console.error('Lỗi tải danh sách chuyên gia:', err);
            }
        };

        fetchExperts();
    }, []);

    const handleStartChat = (expert) => {
        navigate(`/doctor-chat/${expert.id}`, { state: { expert } });
    };

    return (
        <Container className="my-4">
            <h3 className="mb-4">Chọn chuyên gia để bắt đầu chat</h3>
            <Row>
                {experts.map((e) => (
                    <Col md={4} key={e.id} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{e.name || e.full_name || 'Chuyên gia'}</Card.Title>
                                {e.specialization && <Card.Subtitle className="mb-2 text-muted">{e.specialization}</Card.Subtitle>}
                                <Card.Text>{e.email}</Card.Text>
                                <Button variant="primary" onClick={() => handleStartChat(e)}>
                                    Bắt đầu chat
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                {experts.length === 0 && (
                    <Col>
                        <p>Chưa có chuyên gia nào.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default ExpertList;
