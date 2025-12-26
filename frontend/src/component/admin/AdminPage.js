import React, { useState } from 'react';
import { Container, Nav, Alert, Card } from 'react-bootstrap';
import AdminExperts from './AdminExperts';
import AdminCategories from './AdminCategories';
import AdminExercises from './AdminExercises';
import AdminUsers from './AdminUsers';

function AdminPage({ user }) {
    const [activeTab, setActiveTab] = useState('users');

    const isAdmin = user && user.role === 'admin';

    if (!isAdmin) {
        return (
            <Container className="my-4">
                <Alert variant="danger">Bạn không có quyền truy cập trang quản trị.</Alert>
            </Container>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <AdminUsers user={user} />;
            case 'experts':
                return <AdminExperts user={user} />;
            case 'categories':
                return <AdminCategories user={user} />;
            case 'exercises':
                return <AdminExercises user={user} />;
            default:
                return <AdminUsers user={user} />;
        }
    };

    return (
        <Container className="my-4">
            {/* Header */}
            <Card className="mb-4 shadow-sm">
                <Card.Body className="bg-gradient" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '0.375rem'
                }}>
                    <h3 className="mb-2">
                        <i className="bi bi-gear-fill me-2"></i>
                        Trang quản trị
                    </h3>
                    <p className="mb-0">
                        Xin chào <strong>{user?.name || user?.full_name || user?.email}</strong>
                        <span className="badge bg-light text-dark ms-2">{user?.role}</span>
                    </p>
                </Card.Body>
            </Card>

            {/* Navigation Tabs */}
            <Card className="mb-4 shadow-sm">
                <Card.Body className="p-0">
                    <Nav variant="tabs" className="nav-fill">
                        <Nav.Item>
                            <Nav.Link
                                active={activeTab === 'users'}
                                onClick={() => setActiveTab('users')}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: 0,
                                    padding: '15px 20px',
                                    fontWeight: activeTab === 'users' ? 'bold' : 'normal',
                                    backgroundColor: activeTab === 'users' ? '#ffc107' : 'transparent',
                                    color: activeTab === 'users' ? '#000' : '#333'
                                }}
                            >
                                <i className="bi bi-person-badge me-2"></i>
                                Quản lý người dùng
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                active={activeTab === 'experts'}
                                onClick={() => setActiveTab('experts')}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: 0,
                                    padding: '15px 20px',
                                    fontWeight: activeTab === 'experts' ? 'bold' : 'normal',
                                    backgroundColor: activeTab === 'experts' ? '#0d6efd' : 'transparent',
                                    color: activeTab === 'experts' ? 'white' : '#333'
                                }}
                            >
                                <i className="bi bi-people-fill me-2"></i>
                                Quản lý chuyên gia
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                active={activeTab === 'categories'}
                                onClick={() => setActiveTab('categories')}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: 0,
                                    padding: '15px 20px',
                                    fontWeight: activeTab === 'categories' ? 'bold' : 'normal',
                                    backgroundColor: activeTab === 'categories' ? '#198754' : 'transparent',
                                    color: activeTab === 'categories' ? 'white' : '#333'
                                }}
                            >
                                <i className="bi bi-folder-fill me-2"></i>
                                Quản lý danh mục
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                active={activeTab === 'exercises'}
                                onClick={() => setActiveTab('exercises')}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: 0,
                                    padding: '15px 20px',
                                    fontWeight: activeTab === 'exercises' ? 'bold' : 'normal',
                                    backgroundColor: activeTab === 'exercises' ? '#0dcaf0' : 'transparent',
                                    color: activeTab === 'exercises' ? 'white' : '#333'
                                }}
                            >
                                <i className="bi bi-journal-richtext me-2"></i>
                                Quản lý bài tập
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Card.Body>
            </Card>

            {/* Content */}
            <div className="admin-content">
                {renderContent()}
            </div>
        </Container>
    );
}

export default AdminPage;
