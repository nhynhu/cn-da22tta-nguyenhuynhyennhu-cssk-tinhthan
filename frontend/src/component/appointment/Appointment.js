import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';

const API_BASE = 'http://localhost:5000';

function Appointment() {
    const [doctors, setDoctors] = useState([]); // danh sách chuyên gia
    const [doctorId, setDoctorId] = useState(''); // id chuyên gia được chọn
    const [appointmentTime, setAppointmentTime] = useState('');
    const [note, setNote] = useState('');
    const [appointments, setAppointments] = useState([]);

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
                body: JSON.stringify({ doctorId, appointmentTime: scheduledAt, note }),
            });
            setDoctorId('');
            setAppointmentTime('');
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
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container className="my-4">
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
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                {isExpert ? <th>Người dùng</th> : <th>Chuyên gia</th>}
                                <th>Thời gian</th>
                                <th>Hình thức</th>
                                <th>Thời lượng (phút)</th>
                                <th>Phí tư vấn</th>
                                <th>Ghi chú / Link</th>
                                <th>Trạng thái</th>
                                {isExpert && <th>Hành động</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((a, idx) => (
                                <tr key={a.appointment_id || idx}>
                                    <td>{idx + 1}</td>
                                    {isExpert ? <td>{a.user_name}</td> : <td>{a.expert_name}</td>}
                                    <td>{a.scheduled_at ? new Date(a.scheduled_at).toLocaleString() : ''}</td>
                                    <td>{a.meeting_type || 'Online'}</td>
                                    <td>{a.duration_minutes || 60}</td>
                                    <td>
                                        {typeof a.consultation_fee === 'number'
                                            ? a.consultation_fee.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })
                                            : ''}
                                    </td>
                                    <td>
                                        {a.meeting_link && a.meeting_link.startsWith('http') ? (
                                            <a href={a.meeting_link} target="_blank" rel="noreferrer">
                                                Link cuộc hẹn
                                            </a>
                                        ) : (
                                            a.meeting_link
                                        )}
                                    </td>
                                    <td>{a.status}</td>
                                    {isExpert && (
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="success"
                                                className="me-1"
                                                onClick={() => handleStatusChange(a.appointment_id, 'Confirmed')}
                                            >
                                                Xác nhận
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                className="me-1"
                                                onClick={() => handleStatusChange(a.appointment_id, 'Cancelled')}
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleStatusChange(a.appointment_id, 'Completed')}
                                            >
                                                Hoàn tất
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default Appointment;
