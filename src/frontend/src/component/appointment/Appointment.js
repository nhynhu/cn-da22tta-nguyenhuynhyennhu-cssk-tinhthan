import React, { useEffect, useState } from 'react';
import {
    Container, Row, Col, Form, Button,
    Table, Alert, Card, Badge
} from 'react-bootstrap';
import './Appointment.css';

const API_BASE = 'http://localhost:5000';

function Appointment() {
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [note, setNote] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' }); // Thêm state thông báo
    const [meetingType, setMeetingType] = useState('Online');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'user';
    const isExpert = role === 'doctor' || role === 'expert';

    useEffect(() => {
        fetchDoctors();
        fetchAppointments();
    }, [token]);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/experts`);
            const data = await res.json();
            setDoctors(data.data || []);
        } catch (err) { console.error(err); }
    };

    const fetchAppointments = async () => {
        try {
            if (!token) return;
            const res = await fetch(`${API_BASE}/api/appointments/mine`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setAppointments(data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!doctorId || !appointmentTime || !token) return;

        try {
            const scheduledAt = appointmentTime.replace('T', ' ') + ':00';
            const body = {
                expertId: doctorId,
                appointmentTime: scheduledAt,
                note,
                meetingType,
            };
            const res = await fetch(`${API_BASE}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Đặt lịch thành công!' });
                setDoctorId('');
                setAppointmentTime('');
                setNote('');
                setMeetingType('Online');
                fetchAppointments();
            } else {
                setMessage({ type: 'danger', text: 'Đặt lịch thất bại.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: 'Lỗi kết nối.' });
        }
    };

    const handleStatusChange = async (id, status) => {
        if (!window.confirm(`Bạn có chắc muốn chuyển trạng thái thành "${status}"?`)) return;

        try {
            if (!token) return;
            const res = await fetch(`${API_BASE}/api/appointments/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                fetchAppointments();
                setMessage({ type: 'success', text: 'Cập nhật trạng thái thành công!' });
            }
        } catch (err) { console.error(err); }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <span className="status-badge status-pending">⏳ Chờ xác nhận</span>;
            case 'Confirmed': return <span className="status-badge status-confirmed">📅 Đã xác nhận</span>;
            case 'Completed': return <span className="status-badge status-completed">✅ Hoàn thành</span>;
            case 'Cancelled': return <span className="status-badge status-cancelled">❌ Đã hủy</span>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    // === LOGIC QUAN TRỌNG: HIỂN THỊ NÚT THEO TRẠNG THÁI ===
    const renderActions = (a) => {
        // Chỉ chuyên gia mới có quyền thao tác
        if (!isExpert) return null;

        // Nếu đang chờ (Pending) -> Hiện: Xác nhận | Hủy
        if (a.status === 'Pending') {
            return (
                <div className="d-flex">
                    <Button
                        className="btn-action btn-approve"
                        onClick={() => handleStatusChange(a.appointment_id, 'Confirmed')}
                        title="Chấp nhận lịch hẹn"
                    >
                        ✓ Xác nhận
                    </Button>
                    <Button
                        className="btn-action btn-reject"
                        onClick={() => handleStatusChange(a.appointment_id, 'Cancelled')}
                        title="Từ chối lịch hẹn"
                    >
                        ✕ Hủy
                    </Button>
                </div>
            );
        }

        // Nếu đã xác nhận (Confirmed) -> Hiện: Hoàn tất | Hủy (nếu khách không đến)
        if (a.status === 'Confirmed') {
            return (
                <div className="d-flex">
                    <Button
                        className="btn-action btn-complete"
                        onClick={() => handleStatusChange(a.appointment_id, 'Completed')}
                        title="Đánh dấu đã tư vấn xong"
                    >
                        🏁 Hoàn tất
                    </Button>
                    <Button
                        className="btn-action btn-reject"
                        onClick={() => handleStatusChange(a.appointment_id, 'Cancelled')}
                        title="Hủy lịch hẹn"
                    >
                        ✕ Hủy
                    </Button>
                </div>
            );
        }

        // Các trạng thái kết thúc -> Không hiện nút
        return <span className="text-muted fst-italic" style={{ fontSize: '0.85rem' }}>Đã kết thúc</span>;
    };

    return (
        <Container className="py-5">
            {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })} className="shadow-sm">
                    {message.text}
                </Alert>
            )}

            {/* FORM ĐẶT LỊCH (Chỉ User thấy) */}
            {role === 'user' && (
                <Card className="appointment-card mb-5">
                    <div className="header-gradient">
                        <h4 className="header-title">📅 Đặt lịch tư vấn mới</h4>
                    </div>
                    <Card.Body className="p-4">
                        {!token ? (
                            <p className="text-danger text-center">Vui lòng đăng nhập để đặt lịch.</p>
                        ) : (
                            <Form onSubmit={handleCreate}>
                                <Row className="g-4">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Chọn chuyên gia</Form.Label>
                                            <Form.Select
                                                value={doctorId}
                                                onChange={(e) => setDoctorId(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Danh sách chuyên gia --</option>
                                                {doctors.map((d) => (
                                                    <option key={d.id} value={d.id}>{d.name || d.full_name || d.email}</option>
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
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Hình thức tư vấn</Form.Label>
                                            <Form.Select
                                                value={meetingType}
                                                onChange={(e) => setMeetingType(e.target.value)}
                                                required
                                            >
                                                <option value="Online">Online</option>
                                                <option value="Gặp trực tiếp">Gặp trực tiếp</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="h-100">
                                            <Form.Label>Ghi chú cho chuyên gia</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={5}
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="Mô tả sơ qua vấn đề của bạn..."
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="text-end mt-4">
                                    <button type="submit" className="btn-gradient">Xác nhận đặt lịch</button>
                                </div>
                            </Form>
                        )}
                    </Card.Body>
                </Card>
            )}

            {/* DANH SÁCH LỊCH HẸN */}
            <Card className="appointment-card">
                <div className="header-light d-flex justify-content-between align-items-center">
                    <h4 className="header-title" style={{ color: '#2d3748' }}>
                        📋 {isExpert ? 'Lịch hẹn cần xử lý' : 'Lịch hẹn của bạn'}
                    </h4>
                    <Badge bg="light" text="dark" className="border">Tổng: {appointments.length}</Badge>
                </div>
                <Card.Body className="p-0">
                    <Table responsive hover className="table-custom mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{isExpert ? 'Người dùng' : 'Chuyên gia'}</th>
                                <th>Thời gian</th>
                                <th>Hình thức</th>
                                <th>Ghi chú</th>
                                <th className="text-center">Trạng thái</th>
                                {isExpert && <th className="text-center">Hành động</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan={isExpert ? 7 : 6} className="text-center py-5 text-muted">
                                        Chưa có lịch hẹn nào
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((a, idx) => (
                                    <tr key={a.appointment_id || idx}>
                                        <td>{idx + 1}</td>
                                        <td className="fw-bold">{isExpert ? a.user_name : a.expert_name}</td>
                                        <td>
                                            <div>{a.scheduled_at ? new Date(a.scheduled_at).toLocaleDateString('vi-VN') : ''}</div>
                                            <small className="text-muted">{a.scheduled_at ? new Date(a.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</small>
                                        </td>
                                        <td>{a.meeting_type || 'Online'}</td>
                                        <td className="text-truncate" style={{ maxWidth: '200px' }} title={a.note}>{a.note || '--'}</td>
                                        <td className="text-center">{getStatusBadge(a.status)}</td>

                                        {/* Cột Hành động dành riêng cho Expert */}
                                        {isExpert && (
                                            <td className="text-center" style={{ minWidth: '180px' }}>
                                                {renderActions(a)}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Appointment;