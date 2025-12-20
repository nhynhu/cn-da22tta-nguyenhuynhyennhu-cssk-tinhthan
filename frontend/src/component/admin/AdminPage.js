import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Alert, Form, Button } from 'react-bootstrap';

const API_BASE = 'http://localhost:5000';
const INTENT_OPTIONS = ['anger', 'sadness', 'joy', 'fear', 'disgust'];

function AdminPage({ user }) {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [categories, setCategories] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [mindLoading, setMindLoading] = useState(false);
    const [catError, setCatError] = useState('');
    const [exError, setExError] = useState('');

    const [catForm, setCatForm] = useState({
        category_name: '',
        description: '',
        icon_url: '',
        intent: '',
        display_order: ''
    });
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const [exForm, setExForm] = useState({
        category_id: '',
        title: '',
        description: '',
        duration_minutes: '',
        difficulty_level: '',
        media_type: '',
        media_url: '',
        instructions: ''
    });
    const [editingExerciseId, setEditingExerciseId] = useState(null);

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

        const fetchMindData = async () => {
            if (!isAdmin) return;
            setMindLoading(true);
            setCatError('');
            setExError('');
            try {
                const [catRes, exRes] = await Promise.all([
                    fetch(`${API_BASE}/api/mind/categories`),
                    fetch(`${API_BASE}/api/mind/exercises`)
                ]);
                const cats = await catRes.json();
                const exs = await exRes.json();
                setCategories(Array.isArray(cats) ? cats : []);
                setExercises(Array.isArray(exs) ? exs : []);
            } catch (err) {
                console.error('Lỗi tải danh mục/bài tập:', err);
                setCatError('Không tải được danh mục bài tập.');
                setExError('Không tải được danh sách bài tập.');
            } finally {
                setMindLoading(false);
            }
        };

        fetchExperts();
        fetchMindData();
    }, [isAdmin]);

    const adminToken = localStorage.getItem('token');

    const authHeaders = () => ({
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
    });

    // --- CRUD Danh mục ---
    const handleCatSubmit = async (e) => {
        e.preventDefault();
        setCatError('');
        if (!catForm.category_name.trim()) {
            setCatError('Tên danh mục là bắt buộc.');
            return;
        }
        if (!adminToken) {
            setCatError('Phiên đăng nhập đã hết, hãy đăng nhập lại.');
            return;
        }
        try {
            const method = editingCategoryId ? 'PUT' : 'POST';
            const url = editingCategoryId
                ? `${API_BASE}/api/mind/categories/${editingCategoryId}`
                : `${API_BASE}/api/mind/categories`;

            const res = await fetch(url, {
                method,
                headers: authHeaders(),
                body: JSON.stringify({
                    ...catForm,
                    display_order: catForm.display_order ? Number(catForm.display_order) : 0,
                    is_active: 1
                })
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Lỗi lưu danh mục.');
            }
            const saved = await res.json();
            if (editingCategoryId) {
                setCategories(prev => prev.map(c => (c.category_id === saved.category_id ? saved : c)));
            } else {
                setCategories(prev => [...prev, saved]);
            }
            setCatForm({ category_name: '', description: '', icon_url: '', intent: '', display_order: '' });
            setEditingCategoryId(null);
        } catch (err) {
            console.error('Lỗi lưu danh mục:', err);
            setCatError(err.message);
        }
    };

    const handleCatEdit = (cat) => {
        setEditingCategoryId(cat.category_id);
        setCatForm({
            category_name: cat.category_name || '',
            description: cat.description || '',
            icon_url: cat.icon_url || '',
            intent: cat.intent || '',
            display_order: cat.display_order ?? ''
        });
    };

    const handleCatDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa (ẩn) danh mục này?')) return;
        setCatError('');
        if (!adminToken) {
            setCatError('Phiên đăng nhập đã hết, hãy đăng nhập lại.');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/api/mind/categories/${id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Lỗi xóa danh mục.');
            }
            setCategories(prev => prev.filter(c => c.category_id !== id));
        } catch (err) {
            console.error('Lỗi xóa danh mục:', err);
            setCatError(err.message);
        }
    };

    // --- CRUD Bài tập ---
    const handleExSubmit = async (e) => {
        e.preventDefault();
        setExError('');
        if (!exForm.category_id || !exForm.title.trim()) {
            setExError('Cần chọn danh mục và nhập tiêu đề.');
            return;
        }
        if (!adminToken) {
            setExError('Phiên đăng nhập đã hết, hãy đăng nhập lại.');
            return;
        }
        try {
            const method = editingExerciseId ? 'PUT' : 'POST';
            const url = editingExerciseId
                ? `${API_BASE}/api/mind/exercises/${editingExerciseId}`
                : `${API_BASE}/api/mind/exercises`;

            const res = await fetch(url, {
                method,
                headers: authHeaders(),
                body: JSON.stringify({
                    ...exForm,
                    category_id: Number(exForm.category_id),
                    duration_minutes: exForm.duration_minutes ? Number(exForm.duration_minutes) : null,
                    is_active: 1
                })
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Lỗi lưu bài tập.');
            }
            const saved = await res.json();
            if (editingExerciseId) {
                setExercises(prev => prev.map(ex => (ex.exercise_id === saved.exercise_id ? saved : ex)));
            } else {
                setExercises(prev => [...prev, saved]);
            }
            setExForm({
                category_id: '',
                title: '',
                description: '',
                duration_minutes: '',
                difficulty_level: '',
                media_type: '',
                media_url: '',
                instructions: ''
            });
            setEditingExerciseId(null);
        } catch (err) {
            console.error('Lỗi lưu bài tập:', err);
            setExError(err.message);
        }
    };

    const handleExEdit = (ex) => {
        setEditingExerciseId(ex.exercise_id);
        setExForm({
            category_id: ex.category_id || '',
            title: ex.title || '',
            description: ex.description || '',
            duration_minutes: ex.duration_minutes ?? '',
            difficulty_level: ex.difficulty_level || '',
            media_type: ex.media_type || '',
            media_url: ex.media_url || '',
            instructions: ex.instructions || ''
        });
    };

    const handleExDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa (ẩn) bài tập này?')) return;
        setExError('');
        if (!adminToken) {
            setExError('Phiên đăng nhập đã hết, hãy đăng nhập lại.');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/api/mind/exercises/${id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Lỗi xóa bài tập.');
            }
            setExercises(prev => prev.filter(ex => ex.exercise_id !== id));
        } catch (err) {
            console.error('Lỗi xóa bài tập:', err);
            setExError(err.message);
        }
    };

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

            {/* Quản lý danh mục & bài tập thiền/tâm lý */}
            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>Quản lý danh mục bài tập</Card.Header>
                        <Card.Body>
                            {catError && <Alert variant="danger">{catError}</Alert>}
                            <Form onSubmit={handleCatSubmit} className="mb-3">
                                <Form.Group className="mb-2">
                                    <Form.Label>Tên danh mục</Form.Label>
                                    <Form.Control
                                        value={catForm.category_name}
                                        onChange={e => setCatForm({ ...catForm, category_name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Mô tả</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={catForm.description}
                                        onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Icon URL</Form.Label>
                                    <Form.Control
                                        value={catForm.icon_url}
                                        onChange={e => setCatForm({ ...catForm, icon_url: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Intent (liên kết cảm xúc)</Form.Label>
                                    <Form.Select
                                        value={catForm.intent}
                                        onChange={e => setCatForm({ ...catForm, intent: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Chọn intent --</option>
                                        {INTENT_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Thứ tự hiển thị</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={catForm.display_order}
                                        onChange={e => setCatForm({ ...catForm, display_order: e.target.value })}
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary" disabled={mindLoading}>
                                    {editingCategoryId ? 'Cập nhật danh mục' : 'Thêm danh mục'}
                                </Button>{' '}
                                {editingCategoryId && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setEditingCategoryId(null);
                                            setCatForm({ category_name: '', description: '', icon_url: '', intent: '', display_order: '' });
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                )}
                            </Form>

                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên</th>
                                        <th>Intent</th>
                                        <th>Thứ tự</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((c, idx) => (
                                        <tr key={c.category_id}>
                                            <td>{idx + 1}</td>
                                            <td>{c.category_name}</td>
                                            <td>{c.intent}</td>
                                            <td>{c.display_order}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    className="me-1"
                                                    onClick={() => handleCatEdit(c)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => handleCatDelete(c.category_id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center">
                                                Chưa có danh mục nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>Quản lý bài tập thiền/tâm lý</Card.Header>
                        <Card.Body>
                            {exError && <Alert variant="danger">{exError}</Alert>}
                            <Form onSubmit={handleExSubmit} className="mb-3">
                                <Form.Group className="mb-2">
                                    <Form.Label>Danh mục</Form.Label>
                                    <Form.Select
                                        value={exForm.category_id}
                                        onChange={e => setExForm({ ...exForm, category_id: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(c => (
                                            <option key={c.category_id} value={c.category_id}>
                                                {c.category_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Tiêu đề bài tập</Form.Label>
                                    <Form.Control
                                        value={exForm.title}
                                        onChange={e => setExForm({ ...exForm, title: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Mô tả ngắn</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={exForm.description}
                                        onChange={e => setExForm({ ...exForm, description: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Thời lượng (phút)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={exForm.duration_minutes}
                                        onChange={e => setExForm({ ...exForm, duration_minutes: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Độ khó (Easy/Medium/Hard)</Form.Label>
                                    <Form.Control
                                        value={exForm.difficulty_level}
                                        onChange={e => setExForm({ ...exForm, difficulty_level: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Loại nội dung (Audio/Video)</Form.Label>
                                    <Form.Control
                                        value={exForm.media_type}
                                        onChange={e => setExForm({ ...exForm, media_type: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Media URL (YouTube, mp3, ...)</Form.Label>
                                    <Form.Control
                                        value={exForm.media_url}
                                        onChange={e => setExForm({ ...exForm, media_url: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Hướng dẫn chi tiết</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={exForm.instructions}
                                        onChange={e => setExForm({ ...exForm, instructions: e.target.value })}
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary" disabled={mindLoading}>
                                    {editingExerciseId ? 'Cập nhật bài tập' : 'Thêm bài tập'}
                                </Button>{' '}
                                {editingExerciseId && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setEditingExerciseId(null);
                                            setExForm({
                                                category_id: '',
                                                title: '',
                                                description: '',
                                                duration_minutes: '',
                                                difficulty_level: '',
                                                media_type: '',
                                                media_url: '',
                                                instructions: ''
                                            });
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                )}
                            </Form>

                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tiêu đề</th>
                                        <th>Danh mục</th>
                                        <th>Độ khó</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exercises.map((ex, idx) => (
                                        <tr key={ex.exercise_id}>
                                            <td>{idx + 1}</td>
                                            <td>{ex.title}</td>
                                            <td>{ex.category_name}</td>
                                            <td>{ex.difficulty_level}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    className="me-1"
                                                    onClick={() => handleExEdit(ex)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => handleExDelete(ex.exercise_id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {exercises.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center">
                                                Chưa có bài tập nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminPage;
