import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';

const API_BASE = 'http://localhost:5000';

function AdminPage({ user }) {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isAdmin = user && user.role === 'admin';

    useEffect(() => {
        const fetchExperts = async () => {
            if (!isAdmin) return;
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${API_BASE}/api/experts`);
                const data = await res.json();
                setExperts(data.data || []);
            } catch (err) {
                console.error('Lỗi tải danh sách chuyên gia:', err);
                setError('Không tải được danh sách chuyên gia.');
            } finally {
                setLoading(false);
            }
        };

        fetchExperts();
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <Container className="my-4">
                <Alert variant="danger">Bạn không có quyền truy cập trang quản trị.</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <Row className="mb-4">
                <Col>
                    <h3>Trang quản trị</h3>
                    <p>
                        Xin chào <strong>{user?.name || user?.full_name || user?.email}</strong> (vai trò: {user?.role})
                    </p>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card className="mb-4">
                        <Card.Header>Danh sách chuyên gia</Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {loading ? (
                                <p>Đang tải...</p>
                            ) : (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Tên chuyên gia</th>
                                            <th>Email</th>
                                            <th>Chuyên môn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {experts.map((e, idx) => (
                                            <tr key={e.id || idx}>
                                                <td>{idx + 1}</td>
                                                <td>{e.name || e.full_name || 'Chuyên gia'}</td>
                                                <td>{e.email}</td>
                                                <td>{e.specialization || '-'}</td>
                                            </tr>
                                        ))}
                                        {experts.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan={4} className="text-center">
                                                    Chưa có chuyên gia nào.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminPage;
