import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Alert, Badge } from 'react-bootstrap';

const API_BASE = 'http://localhost:5000';

function Appointment() {
    const [doctors, setDoctors] = useState([]); // danh sách chuyên gia
    const [doctorId, setDoctorId] = useState(''); // id chuyên gia được chọn
    const [appointmentTime, setAppointmentTime] = useState('');
    const [meetingType, setMeetingType] = useState('Online'); // Hình thức: Online/Offline
    const [durationMinutes, setDurationMinutes] = useState('60'); // Thời lượng (phút)
    const [note, setNote] = useState('');
    const [appointments, setAppointments] = useState([]);

    // State cho modal sửa
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [editForm, setEditForm] = useState({
        doctorId: '',
        appointmentTime: '',
        note: ''
    });

    // State cho thông báo
    const [message, setMessage] = useState({ type: '', text: '' });

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'user';
    const isExpert = role === 'doctor' || role === 'expert';

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                // Lấy danh sách chuyên gia từ bảng experts
                const res = await fetch(`${API_BASE}/api/experts`);
                const data = await res.json();
                setDoctors(data.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchAppointments = async () => {
            try {
                if (!token) return;
                const res = await fetch(`${API_BASE}/api/appointments/mine`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setAppointments(data.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchDoctors();
        fetchAppointments();
    }, [token]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!doctorId || !appointmentTime || !token) return;

        try {
            // Chuyển datetime-local (YYYY-MM-DDTHH:mm) sang định dạng MySQL (YYYY-MM-DD HH:mm:00)
            const scheduledAt = appointmentTime.replace('T', ' ') + ':00';

            await fetch(`${API_BASE}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    doctorId,
                    appointmentTime: scheduledAt,
                    meetingType,
                    durationMinutes: parseInt(durationMinutes),
                    note
                }),
            });
            setDoctorId('');
            setAppointmentTime('');
            setMeetingType('Online');
            setDurationMinutes('60');
            setNote('');

            // reload
            const res = await fetch(`${API_BASE}/api/appointments/mine`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setAppointments(data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            if (!token) return;
            await fetch(`${API_BASE}/api/appointments/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            const res = await fetch(`${API_BASE}/api/appointments/mine`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setAppointments(data.data || []);
            setMessage({ type: 'success', text: 'Cập nhật trạng thái thành công!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: 'Có lỗi xảy ra khi cập nhật trạng thái.' });
        }
    };

    // Mở modal sửa
    const handleEdit = (appointment) => {
        setEditingAppointment(appointment);
        // Chuyển đổi scheduled_at sang định dạng datetime-local
        const dateTime = appointment.scheduled_at
            ? new Date(appointment.scheduled_at).toISOString().slice(0, 16)
            : '';
        setEditForm({
            doctorId: appointment.expert_id || '',
            appointmentTime: dateTime,
            note: appointment.meeting_link || ''
        });
        setShowEditModal(true);
    };

    // Xử lý cập nhật lịch hẹn
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingAppointment || !token) return;

        try {
            const scheduledAt = editForm.appointmentTime.replace('T', ' ') + ':00';

            const res = await fetch(`${API_BASE}/api/appointments/${editingAppointment.appointment_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    doctorId: editForm.doctorId,
                    appointmentTime: scheduledAt,
                    note: editForm.note
                }),
            });

            if (res.ok) {
                setShowEditModal(false);
                setEditingAppointment(null);
                setMessage({ type: 'success', text: 'Cập nhật lịch hẹn thành công!' });

                // Reload danh sách
                const reloadRes = await fetch(`${API_BASE}/api/appointments/mine`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await reloadRes.json();
                setAppointments(data.data || []);
            } else {
                const errorData = await res.json();
                setMessage({ type: 'danger', text: errorData.message || 'Có lỗi xảy ra khi cập nhật.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: 'Có lỗi xảy ra khi cập nhật lịch hẹn.' });
        }
    };

    // Xóa lịch hẹn
    const handleDelete = async (appointmentId) => {
        if (!window.confirm('Bạn có chắc muốn xóa lịch hẹn này?')) return;
        if (!token) return;

        try {
            const res = await fetch(`${API_BASE}/api/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Xóa lịch hẹn thành công!' });
                // Reload danh sách
                const reloadRes = await fetch(`${API_BASE}/api/appointments/mine`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await reloadRes.json();
                setAppointments(data.data || []);
            } else {
                const errorData = await res.json();
                setMessage({ type: 'danger', text: errorData.message || 'Có lỗi xảy ra khi xóa.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: 'Có lỗi xảy ra khi xóa lịch hẹn.' });
        }
    };

    // Lấy màu badge theo trạng thái
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <Badge bg="warning" text="dark">Chờ xác nhận</Badge>;
            case 'Confirmed': return <Badge bg="success">Đã xác nhận</Badge>;
            case 'Cancelled': return <Badge bg="danger">Đã hủy</Badge>;
            case 'Completed': return <Badge bg="info">Hoàn thành</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Container className="my-4">
            {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                    {message.text}
                </Alert>
            )}
            {role === 'user' && (
                <Row className="mb-4">
                    <Col md={6}>
                        <h4>Đặt lịch hẹn với chuyên gia</h4>
                        {!token && <p className="text-danger">Bạn cần đăng nhập để đặt lịch.</p>}
                        <Form onSubmit={handleCreate}>
                            <Form.Group className="mb-3">
                                <Form.Label>Chuyên gia</Form.Label>
                                <Form.Select
                                    value={doctorId}
                                    onChange={(e) => setDoctorId(e.target.value)}
                                    required
                                    disabled={!token}
                                >
                                    <option value="">-- Chọn chuyên gia --</option>
                                    {doctors.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name || d.full_name || d.email}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    required
                                    disabled={!token}
                                />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Hình thức</Form.Label>
                                        <Form.Select
                                            value={meetingType}
                                            onChange={(e) => setMeetingType(e.target.value)}
                                            disabled={!token}
                                        >
                                            <option value="Online">🌐 Online (Trực tuyến)</option>
                                            <option value="Offline">🏥 Offline (Trực tiếp)</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Thời lượng</Form.Label>
                                        <Form.Select
                                            value={durationMinutes}
                                            onChange={(e) => setDurationMinutes(e.target.value)}
                                            disabled={!token}
                                        >
                                            <option value="30">30 phút</option>
                                            <option value="45">45 phút</option>
                                            <option value="60">60 phút (1 giờ)</option>
                                            <option value="90">90 phút (1.5 giờ)</option>
                                            <option value="120">120 phút (2 giờ)</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Ghi chú</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    disabled={!token}
                                />
                            </Form.Group>

                            <Button type="submit" disabled={!token}>
                                Đặt lịch
                            </Button>
                        </Form>
                    </Col>
                </Row>
            )}

            <Row>
                <Col>
                    <h4>{isExpert ? 'Lịch hẹn tư vấn của chuyên gia' : 'Lịch hẹn với chuyên gia'}</h4>
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                {isExpert ? <th>Người dùng</th> : <th>Chuyên gia</th>}
                                <th>Thời gian</th>
                                <th>Hình thức</th>
                                <th>Thời lượng</th>
                                <th>Phí tư vấn</th>
                                <th>Ghi chú / Link</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan={isExpert ? 9 : 9} className="text-center text-muted py-4">
                                        Chưa có lịch hẹn nào.
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((a, idx) => (
                                    <tr key={a.appointment_id || idx}>
                                        <td>{idx + 1}</td>
                                        {isExpert ? <td>{a.user_name}</td> : <td>{a.expert_name}</td>}
                                        <td>{a.scheduled_at ? new Date(a.scheduled_at).toLocaleString('vi-VN') : ''}</td>
                                        <td>{a.meeting_type || 'Online'}</td>
                                        <td>{a.duration_minutes || 60} phút</td>
                                        <td>
                                            {typeof a.consultation_fee === 'number'
                                                ? a.consultation_fee.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })
                                                : 'Miễn phí'}
                                        </td>
                                        <td>
                                            {a.meeting_link && a.meeting_link.startsWith('http') ? (
                                                <a href={a.meeting_link} target="_blank" rel="noreferrer">
                                                    🔗 Link cuộc hẹn
                                                </a>
                                            ) : (
                                                a.meeting_link || '-'
                                            )}
                                        </td>
                                        <td>{getStatusBadge(a.status)}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            {isExpert ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="me-1"
                                                        onClick={() => handleStatusChange(a.appointment_id, 'Confirmed')}
                                                        disabled={a.status === 'Confirmed' || a.status === 'Completed'}
                                                    >
                                                        ✓
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="me-1"
                                                        onClick={() => handleStatusChange(a.appointment_id, 'Cancelled')}
                                                        disabled={a.status === 'Cancelled' || a.status === 'Completed'}
                                                    >
                                                        ✕
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="info"
                                                        onClick={() => handleStatusChange(a.appointment_id, 'Completed')}
                                                        disabled={a.status === 'Completed' || a.status === 'Cancelled'}
                                                    >
                                                        ✔
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    {(a.status === 'Pending') && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline-primary"
                                                                className="me-1"
                                                                onClick={() => handleEdit(a)}
                                                            >
                                                                ✏️ Sửa
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                onClick={() => handleDelete(a.appointment_id)}
                                                            >
                                                                🗑️ Xóa
                                                            </Button>
                                                        </>
                                                    )}
                                                    {(a.status === 'Confirmed') && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            onClick={() => handleDelete(a.appointment_id)}
                                                        >
                                                            Hủy lịch
                                                        </Button>
                                                    )}
                                                    {(a.status === 'Completed' || a.status === 'Cancelled') && (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Modal Sửa lịch hẹn */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>✏️ Sửa lịch hẹn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Chuyên gia</Form.Label>
                            <Form.Select
                                value={editForm.doctorId}
                                onChange={(e) => setEditForm({ ...editForm, doctorId: e.target.value })}
                                required
                            >
                                <option value="">-- Chọn chuyên gia --</option>
                                {doctors.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name || d.full_name || d.email}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={editForm.appointmentTime}
                                onChange={(e) => setEditForm({ ...editForm, appointmentTime: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ghi chú</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editForm.note}
                                onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                            />
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button type="submit" variant="primary">
                                💾 Lưu thay đổi
                            </Button>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                Hủy
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default Appointment;
