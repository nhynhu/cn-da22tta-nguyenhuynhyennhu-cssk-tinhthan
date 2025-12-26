import React, { useEffect, useState } from 'react';
import { Card, Table, Form, Button, Spinner, Alert, Badge, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

function AdminUsers({ user }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    // State cho modal thêm user
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/api/users/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data?.data || res.data;
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Không thể tải danh sách người dùng.');
        }
        setLoading(false);
    };

    // Thêm user mới
    const handleAddUser = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/api/users/create`, addForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddModal(false);
            setAddForm({ full_name: '', email: '', password: '', role: 'user' });
            setMessage({ type: 'success', text: 'Thêm người dùng thành công!' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi thêm người dùng');
        }
    };

    // Cập nhật role
    const handleUpdateRole = async (userId, newRole) => {
        if (!window.confirm(`Bạn có chắc muốn đổi role thành "${newRole}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_BASE}/api/users/${userId}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'Cập nhật role thành công!' });
            fetchUsers();
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Lỗi khi cập nhật role' });
        }
    };

    // Xóa user
    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE}/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Xóa người dùng thành công!' });
            fetchUsers();
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Lỗi khi xóa người dùng' });
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return <Badge bg="danger">Admin</Badge>;
            case 'expert': return <Badge bg="success">Chuyên gia</Badge>;
            case 'doctor': return <Badge bg="info">Bác sĩ</Badge>;
            default: return <Badge bg="secondary">Người dùng</Badge>;
        }
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
        <>
            <Card className="shadow-sm">
                <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <i className="bi bi-person-badge me-2"></i>
                        Quản lý người dùng
                    </h5>
                    <Button variant="dark" size="sm" onClick={() => setShowAddModal(true)}>
                        ➕ Thêm người dùng
                    </Button>
                </Card.Header>
                <Card.Body>
                    {message.text && (
                        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                            {message.text}
                        </Alert>
                    )}
                    {error && <Alert variant="danger">{error}</Alert>}

                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="warning" />
                            <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-3 text-muted">
                                Tổng số: <strong>{users.length}</strong> người dùng
                            </div>
                            <Table striped bordered hover responsive>
                                <thead className="table-warning">
                                    <tr>
                                        <th style={{ width: '50px' }}>#</th>
                                        <th>Họ tên</th>
                                        <th>Email</th>
                                        <th style={{ width: '120px' }}>Role</th>
                                        <th style={{ width: '200px' }}>Đổi Role</th>
                                        <th style={{ width: '100px' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, idx) => (
                                        <tr key={u.user_id || u.id || idx}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <strong>{u.full_name || 'Chưa có tên'}</strong>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>{getRoleBadge(u.role)}</td>
                                            <td>
                                                <Form.Select
                                                    size="sm"
                                                    value={u.role}
                                                    onChange={(e) => handleUpdateRole(u.user_id || u.id, e.target.value)}
                                                    disabled={u.role === 'admin'}
                                                >
                                                    <option value="user">👤 User</option>
                                                    <option value="expert">🎓 Expert</option>
                                                    <option value="doctor">🩺 Doctor</option>
                                                    <option value="admin">👑 Admin</option>
                                                </Form.Select>
                                            </td>
                                            <td>
                                                {u.role !== 'admin' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        onClick={() => handleDeleteUser(u.user_id || u.id)}
                                                    >
                                                        🗑️
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center text-muted py-4">
                                                Chưa có người dùng nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Modal Thêm người dùng */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton className="bg-warning">
                    <Modal.Title>➕ Thêm người dùng mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddUser}>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ tên <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={addForm.full_name}
                                onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })}
                                placeholder="Nhập họ tên"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                value={addForm.email}
                                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                placeholder="example@email.com"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="password"
                                value={addForm.password}
                                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                placeholder="Nhập mật khẩu"
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={addForm.role}
                                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                            >
                                <option value="user">👤 User (Người dùng)</option>
                                <option value="expert">🎓 Expert (Chuyên gia)</option>
                                <option value="doctor">🩺 Doctor (Bác sĩ)</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button type="submit" variant="warning">
                                ✅ Thêm người dùng
                            </Button>
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                                Hủy
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AdminUsers;
