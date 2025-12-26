import React, { useEffect, useState } from 'react';
import { Card, Table, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

function AdminExperts({ user }) {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/experts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle both { data: [...] } and direct array response
            const data = res.data?.data || res.data;
            setExperts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Không thể tải danh sách chuyên gia.');
        }
        setLoading(false);
    };

    const isAdmin = user && user.role === 'admin';

    if (!isAdmin) {
        return (
            <Alert variant="danger" className="m-4">
                Bạn không có quyền truy cập trang này!
            </Alert>
        );
    }

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                    <i className="bi bi-people-fill me-2"></i>
                    Danh sách chuyên gia
                </h5>
            </Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th style={{ width: '60px' }}>#</th>
                                <th>Họ tên</th>
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
                                    <td colSpan={4} className="text-center text-muted py-4">
                                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                        Chưa có chuyên gia nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
                <div className="text-muted small mt-2">
                    Tổng số chuyên gia: <strong>{experts.length}</strong>
                </div>
            </Card.Body>
        </Card>
    );
}

export default AdminExperts;
