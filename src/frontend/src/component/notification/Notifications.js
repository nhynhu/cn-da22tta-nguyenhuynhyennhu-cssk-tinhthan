import React, { useState, useEffect } from 'react';
import { Container, Alert, ListGroup, Badge, Spinner, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await axios.get(`${API_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount);
            }
            setLoading(false);
        } catch (err) {
            console.error('Lỗi tải thông báo:', err);
            setError('Không thể tải thông báo');
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');

            await axios.patch(
                `${API_URL}/api/notifications/${notificationId}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Cập nhật UI
            setNotifications(notifications.map(notif =>
                notif.notification_id === notificationId
                    ? { ...notif, is_read: 1 }
                    : notif
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Lỗi đánh dấu đã đọc:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');

            await axios.patch(
                `${API_URL}/api/notifications/read-all`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Cập nhật UI
            setNotifications(notifications.map(notif => ({ ...notif, is_read: 1 })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Lỗi đánh dấu tất cả:', err);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');

            await axios.delete(`${API_URL}/api/notifications/${notificationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Cập nhật UI
            setNotifications(notifications.filter(notif => notif.notification_id !== notificationId));
        } catch (err) {
            console.error('Lỗi xóa thông báo:', err);
        }
    };

    const deleteReadNotifications = async () => {
        try {
            const token = localStorage.getItem('token');

            await axios.delete(`${API_URL}/api/notifications/read`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Cập nhật UI
            setNotifications(notifications.filter(notif => notif.is_read === 0));
        } catch (err) {
            console.error('Lỗi xóa thông báo đã đọc:', err);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'appointment':
                return '📅';
            case 'message':
                return '💬';
            case 'suggestion':
                return '💡';
            case 'system':
                return '🔔';
            default:
                return '📢';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;

        return date.toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <Container className="my-4 text-center">
                <Spinner animation="border" />
                <p>Đang tải thông báo...</p>
            </Container>
        );
    }

    return (
        <Container className="notifications-container my-4">
            <Row className="mb-3">
                <Col>
                    <h2>
                        Thông báo
                        {unreadCount > 0 && (
                            <Badge bg="danger" className="ms-2">{unreadCount}</Badge>
                        )}
                    </h2>
                </Col>
                <Col className="text-end">
                    {unreadCount > 0 && (
                        <Button variant="outline-primary" size="sm" onClick={markAllAsRead} className="me-2">
                            Đánh dấu tất cả đã đọc
                        </Button>
                    )}
                    <Button variant="outline-danger" size="sm" onClick={deleteReadNotifications}>
                        Xóa đã đọc
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            {notifications.length === 0 ? (
                <Alert variant="info">Bạn không có thông báo nào.</Alert>
            ) : (
                <ListGroup>
                    {notifications.map(notif => (
                        <ListGroup.Item
                            key={notif.notification_id}
                            className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="notification-content flex-grow-1" onClick={() => !notif.is_read && markAsRead(notif.notification_id)}>
                                    <span className="notification-icon me-2">
                                        {getNotificationIcon(notif.type)}
                                    </span>
                                    <div className="notification-text">
                                        <strong>{notif.title}</strong>
                                        <p className="mb-1">{notif.message}</p>
                                        <small className="text-muted">{formatDate(notif.created_at)}</small>
                                    </div>
                                </div>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-danger"
                                    onClick={() => deleteNotification(notif.notification_id)}
                                >
                                    ✕
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default Notifications;
