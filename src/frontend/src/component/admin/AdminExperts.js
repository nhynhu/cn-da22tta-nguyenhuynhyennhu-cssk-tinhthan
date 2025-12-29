import React, { useEffect, useState } from 'react';
import { Card, Table, Spinner, Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

function AdminExperts({ user }) {
    const [experts, setExperts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    // State cho modal thêm chuyên gia
    const [showAddModal, setShowAddModal] = useState(false);
    const [userSearchText, setUserSearchText] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [addForm, setAddForm] = useState({
        user_id: '',
        specialization: '',
        qualification: '',
        experience_years: '',
        bio: ''
    });

    useEffect(() => {
        fetchExperts();
        fetchUsers();
    }, []);

    const fetchExperts = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/api/experts`, {
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

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/api/users/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data?.data || res.data;
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Lỗi tải danh sách user:', err);
        }
    };

    // Thêm chuyên gia mới
    const handleAddExpert = async (e) => {
        e.preventDefault();
        setError('');

        if (!addForm.user_id) {
            setError('Vui lòng chọn người dùng');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/api/experts`, {
                user_id: addForm.user_id,
                specialization: addForm.specialization,
                qualification: addForm.qualification,
                experience_years: addForm.experience_years,
                bio: addForm.bio
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowAddModal(false);
            setAddForm({ user_id: '', specialization: '', qualification: '', experience_years: '', bio: '' });
            setUserSearchText('');
            setShowUserDropdown(false);
            setMessage({ type: 'success', text: 'Thêm chuyên gia thành công!' });
            fetchExperts();
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi thêm chuyên gia');
        }
    };

    // Xóa chuyên gia
    const handleDeleteExpert = async (expertId) => {
        if (!window.confirm('Bạn có chắc muốn xóa chuyên gia này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE}/api/experts/${expertId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Xóa chuyên gia thành công!' });
            fetchExperts();
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Lỗi khi xóa chuyên gia' });
        }
    };

    // Lọc user chưa phải chuyên gia
    const availableUsers = users.filter(u =>
        !experts.some(e => e.user_id === u.user_id)
    );

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
            <Card className="shadow-sm" style={{ background: '#f8f9fa', border: 'none' }}>
                <Card.Header style={{ background: '#02113d', color: 'white' }} className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <i className="bi bi-people-fill me-2"></i>
                        Danh sách chuyên gia
                    </h5>
                    <Button variant="light" size="sm" style={{ color: '#02113d', fontWeight: 600 }} onClick={() => setShowAddModal(true)}>
                        ➕ Thêm chuyên gia
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
                            <Spinner animation="border" style={{ color: '#02113d' }} />
                            <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <Table bordered hover responsive style={{ background: 'white' }}>
                            <thead style={{ background: '#16306e', color: 'white' }}>
                                <tr>
                                    <th style={{ width: '50px' }}>#</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Chuyên môn</th>
                                    <th>Bằng cấp</th>
                                    <th style={{ width: '80px' }}>Kinh nghiệm</th>
                                    <th style={{ width: '100px' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {experts.map((e, idx) => (
                                    <tr key={e.expert_id || e.id || idx}>
                                        <td>{idx + 1}</td>
                                        <td><strong>{e.name || e.full_name || 'Chuyên gia'}</strong></td>
                                        <td>{e.email}</td>
                                        <td>{e.specialization || '-'}</td>
                                        <td>{e.qualification || '-'}</td>
                                        <td className="text-center">{e.experience_years ? `${e.experience_years} năm` : '-'}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => handleDeleteExpert(e.expert_id || e.id)}
                                            >
                                                🗑️ Xóa
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {experts.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={7} className="text-center text-muted py-4">
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

            {/* Modal Thêm chuyên gia */}
            <Modal show={showAddModal} onHide={() => {
                setShowAddModal(false);
                setUserSearchText('');
                setShowUserDropdown(false);
                setError('');
            }} size="lg">
                <Modal.Header closeButton style={{ background: '#02113d', color: 'white' }}>
                    <Modal.Title>➕ Thêm chuyên gia mới</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: '#f8f9fa' }}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleAddExpert}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tìm và chọn người dùng <span className="text-danger">*</span></Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type="text"
                                    value={userSearchText}
                                    onChange={(e) => {
                                        setUserSearchText(e.target.value);
                                        setShowUserDropdown(true);
                                        if (!e.target.value) {
                                            setAddForm({ ...addForm, user_id: '' });
                                        }
                                    }}
                                    onFocus={() => setShowUserDropdown(true)}
                                    placeholder="Nhập tên hoặc email để tìm kiếm..."
                                    autoComplete="off"
                                    style={{ borderColor: '#16306e' }}
                                />
                                {showUserDropdown && (
                                    <div
                                        className="position-absolute w-100 bg-white border rounded shadow-sm mt-1"
                                        style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1050 }}
                                    >
                                        {availableUsers
                                            .filter(u => {
                                                const search = userSearchText.toLowerCase();
                                                return (
                                                    (u.full_name && u.full_name.toLowerCase().includes(search)) ||
                                                    (u.email && u.email.toLowerCase().includes(search))
                                                );
                                            })
                                            .map((u) => (
                                                <div
                                                    key={u.user_id}
                                                    className="px-3 py-2 border-bottom"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        setAddForm({ ...addForm, user_id: u.user_id });
                                                        setUserSearchText(`${u.full_name || ''} (${u.email})`);
                                                        setShowUserDropdown(false);
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                                >
                                                    <strong>{u.full_name || '(Chưa có tên)'}</strong>
                                                    <br />
                                                    <small className="text-muted">{u.email} - {u.role}</small>
                                                </div>
                                            ))
                                        }
                                        {availableUsers.filter(u => {
                                            const search = userSearchText.toLowerCase();
                                            return (
                                                (u.full_name && u.full_name.toLowerCase().includes(search)) ||
                                                (u.email && u.email.toLowerCase().includes(search))
                                            );
                                        }).length === 0 && (
                                                <div className="px-3 py-2 text-muted text-center">
                                                    Không tìm thấy người dùng
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>
                            {addForm.user_id && (
                                <Form.Text className="text-success">
                                    ✅ Đã chọn người dùng
                                </Form.Text>
                            )}
                            <Form.Text className="text-muted d-block">
                                Chỉ hiện những người dùng chưa là chuyên gia ({availableUsers.length} người)
                            </Form.Text>
                        </Form.Group>

                        <hr />

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Chuyên môn <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={addForm.specialization}
                                        onChange={(e) => setAddForm({ ...addForm, specialization: e.target.value })}
                                        placeholder="VD: Tâm lý học lâm sàng"
                                        required
                                        style={{ borderColor: '#16306e' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Bằng cấp</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={addForm.qualification}
                                        onChange={(e) => setAddForm({ ...addForm, qualification: e.target.value })}
                                        placeholder="VD: Thạc sĩ Tâm lý học"
                                        style={{ borderColor: '#16306e' }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Số năm kinh nghiệm</Form.Label>
                            <Form.Control
                                type="number"
                                value={addForm.experience_years}
                                onChange={(e) => setAddForm({ ...addForm, experience_years: e.target.value })}
                                placeholder="VD: 5"
                                min="0"
                                style={{ borderColor: '#16306e' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Giới thiệu bản thân</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={addForm.bio}
                                onChange={(e) => setAddForm({ ...addForm, bio: e.target.value })}
                                placeholder="Mô tả ngắn về chuyên gia..."
                                style={{ borderColor: '#16306e' }}
                            />
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button type="submit" style={{ background: '#02113d', border: 'none' }}>
                                ✅ Thêm chuyên gia
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

export default AdminExperts;
