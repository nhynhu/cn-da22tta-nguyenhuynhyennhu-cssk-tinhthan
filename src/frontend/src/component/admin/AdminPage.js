import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, ListGroup, Badge, Spinner } from 'react-bootstrap';
import AdminExperts from './AdminExperts';
import AdminCategories from './AdminCategories';
import AdminExercises from './AdminExercises';
import AdminUsers from './AdminUsers';

function AdminPage({ user }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const isAdmin = user && user.role === 'admin';
    const [stats, setStats] = useState({ users: 0, experts: 0, categories: 0, exercises: 0 });
    const [loadingStats, setLoadingStats] = useState(true);
    const [errorStats, setErrorStats] = useState('');

    useEffect(() => {
        // Fetch thống kê từ API
        async function fetchStats() {
            setLoadingStats(true);
            setErrorStats('');
            try {
                const response = await fetch('http://localhost:5000/api/admin/stats');
                const data = await response.json();
                setStats(data);
                setLoadingStats(false);
            } catch (err) {
                setErrorStats('Không thể tải thống kê.');
                setLoadingStats(false);
            }
        }
        fetchStats();
    }, []);

    if (!isAdmin) {
        return (
            <Container className="my-4">
                <Alert variant="danger">Bạn không có quyền truy cập trang quản trị.</Alert>
            </Container>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <Row className="g-4 mb-4">
                        <Col md={3} sm={6} xs={12}>
                            <Card className="shadow-sm text-center">
                                <Card.Body>
                                    <h5><i className="bi bi-people-fill me-2"></i>Người dùng</h5>
                                    {loadingStats ? <Spinner animation="border" size="sm" /> : <h2><Badge bg="primary">{stats.users}</Badge></h2>}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} xs={12}>
                            <Card className="shadow-sm text-center">
                                <Card.Body>
                                    <h5><i className="bi bi-person-workspace me-2"></i>Chuyên gia</h5>
                                    {loadingStats ? <Spinner animation="border" size="sm" /> : <h2><Badge bg="success">{stats.experts}</Badge></h2>}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} xs={12}>
                            <Card className="shadow-sm text-center">
                                <Card.Body>
                                    <h5><i className="bi bi-folder-fill me-2"></i>Danh mục</h5>
                                    {loadingStats ? <Spinner animation="border" size="sm" /> : <h2><Badge bg="warning" text="dark">{stats.categories}</Badge></h2>}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} xs={12}>
                            <Card className="shadow-sm text-center">
                                <Card.Body>
                                    <h5><i className="bi bi-journal-richtext me-2"></i>Bài tập</h5>
                                    {loadingStats ? <Spinner animation="border" size="sm" /> : <h2><Badge bg="info">{stats.exercises}</Badge></h2>}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                );
            case 'users':
                return <AdminUsers user={user} />;
            case 'experts':
                return <AdminExperts user={user} />;
            case 'categories':
                return <AdminCategories user={user} />;
            case 'exercises':
                return <AdminExercises user={user} />;
            default:
                return null;
        }
    };

    return (
        <Container fluid className="my-4">
            <Row>
                {/* Sidebar */}
                <Col md={2} className="mb-3">
                    <Card className="shadow-sm h-100" style={{ background: '#02113d', color: 'white', border: 'none' }}>
                        <Card.Body className="p-0">
                            <div className="text-center py-4" style={{ background: '#02113d', color: 'white' }}>
                                <i className="bi bi-gear-fill" style={{ fontSize: 32, color: '#fff' }}></i>
                                <div className="mt-2 fw-bold">Quản trị</div>
                                <div style={{ fontSize: 13 }}>Xin chào <strong>{user?.name || user?.full_name || user?.email}</strong></div>
                                <span className="badge bg-light text-dark mt-2">{user?.role}</span>
                            </div>
                            <ListGroup variant="flush">
                                <ListGroup.Item action active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer', background: activeTab === 'dashboard' ? '#16306e' : 'transparent', color: 'white', border: 'none' }}>
                                    <i className="bi bi-bar-chart-fill me-2"></i> Dashboard
                                </ListGroup.Item>
                                <ListGroup.Item action active={activeTab === 'users'} onClick={() => setActiveTab('users')} style={{ cursor: 'pointer', background: activeTab === 'users' ? '#16306e' : 'transparent', color: 'white', border: 'none' }}>
                                    <i className="bi bi-people-fill me-2"></i> Người dùng
                                </ListGroup.Item>
                                <ListGroup.Item action active={activeTab === 'experts'} onClick={() => setActiveTab('experts')} style={{ cursor: 'pointer', background: activeTab === 'experts' ? '#16306e' : 'transparent', color: 'white', border: 'none' }}>
                                    <i className="bi bi-person-workspace me-2"></i> Chuyên gia
                                </ListGroup.Item>
                                <ListGroup.Item action active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} style={{ cursor: 'pointer', background: activeTab === 'categories' ? '#16306e' : 'transparent', color: 'white', border: 'none' }}>
                                    <i className="bi bi-folder-fill me-2"></i> Danh mục
                                </ListGroup.Item>
                                <ListGroup.Item action active={activeTab === 'exercises'} onClick={() => setActiveTab('exercises')} style={{ cursor: 'pointer', background: activeTab === 'exercises' ? '#16306e' : 'transparent', color: 'white', border: 'none' }}>
                                    <i className="bi bi-journal-richtext me-2"></i> Bài tập
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                {/* Main content */}
                <Col md={10}>
                    {errorStats && <Alert variant="danger">{errorStats}</Alert>}
                    <div style={{ minHeight: 200 }}>
                        {activeTab === 'dashboard' && (
                            <Row className="g-4 mb-4">
                                <Col md={3} sm={6} xs={12}>
                                    <Card className="shadow-sm text-center" style={{ background: '#16306e', color: 'white' }}>
                                        <Card.Body>
                                            <h5><i className="bi bi-people-fill me-2"></i>Người dùng</h5>
                                            {loadingStats ? <Spinner animation="border" size="sm" /> : <h2><Badge bg="light" text="dark">{stats.users}</Badge></h2>}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3} sm={6} xs={12}>
                                    <Card className="shadow-sm text-center" style={{ background: '#16306e', color: 'white' }}>
                                        <Card.Body>
                                            <h5><i className="bi bi-person-workspace me-2"></i>Chuyên gia</h5>
                                            {loadingStats ? <Spinner animation="border" size="sm" /> : <h2><Badge bg="light" text="dark">{stats.experts}</Badge></h2>}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3} sm={6} xs={12}>
                                    <Card className="shadow-sm text-center" style={{ background: '#16306e', color: 'white' }}>
                                        <Card.Body>
                                            <h5><i className="bi bi-folder-fill me-2"></i>Danh mục</h5>
                                            {loadingStats ? <Spinner animation="border" size="sm" /> : <h2><Badge bg="light" text="dark">{stats.categories}</Badge></h2>}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3} sm={6} xs={12}>
                                    <Card className="shadow-sm text-center" style={{ background: '#16306e', color: 'white' }}>
                                        <Card.Body>
                                            <h5><i className="bi bi-journal-richtext me-2"></i>Bài tập</h5>
                                            {loadingStats ? <Spinner animation="border" size="sm" /> : <h2><Badge bg="light" text="dark">{stats.exercises}</Badge></h2>}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                        {renderContent && activeTab !== 'dashboard' && renderContent()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminPage;
