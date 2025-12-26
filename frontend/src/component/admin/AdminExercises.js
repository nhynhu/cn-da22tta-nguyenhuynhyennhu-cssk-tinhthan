import React, { useEffect, useState } from 'react';
import { Card, Table, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

function AdminExercises({ user }) {
    const [categories, setCategories] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingExerciseId, setEditingExerciseId] = useState(null);
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const [catRes, exRes] = await Promise.all([
                axios.get('http://localhost:5000/api/mind/categories', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/mind/exercises', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setCategories(catRes.data);
            setExercises(exRes.data);
        } catch (err) {
            setError('Không thể tải dữ liệu.');
        }
        setLoading(false);
    };

    const handleExSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (editingExerciseId) {
                await axios.put(
                    `http://localhost:5000/api/mind/exercises/${editingExerciseId}`,
                    exForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    'http://localhost:5000/api/mind/exercises',
                    exForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
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
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Lỗi khi lưu bài tập');
        }
    };

    const handleExEdit = (ex) => {
        setEditingExerciseId(ex.exercise_id);
        setExForm({
            category_id: ex.category_id || '',
            title: ex.title || '',
            description: ex.description || '',
            duration_minutes: ex.duration_minutes || '',
            difficulty_level: ex.difficulty_level || '',
            media_type: ex.media_type || '',
            media_url: ex.media_url || '',
            instructions: ex.instructions || ''
        });
    };

    const handleExDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa bài tập này?')) return;
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/mind/exercises/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Lỗi khi xóa bài tập');
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

    const getDifficultyBadge = (level) => {
        switch (level?.toLowerCase()) {
            case 'easy':
                return <span className="badge bg-success">🟢 Easy</span>;
            case 'medium':
                return <span className="badge bg-warning text-dark">🟡 Medium</span>;
            case 'hard':
                return <span className="badge bg-danger">🔴 Hard</span>;
            default:
                return <span className="badge bg-secondary">{level || '-'}</span>;
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                    <i className="bi bi-journal-richtext me-2"></i>
                    Quản lý bài tập thiền/tâm lý
                </h5>
            </Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Form thêm/sửa bài tập */}
                <Card className="mb-4 border-info">
                    <Card.Header className="bg-light">
                        <strong>{editingExerciseId ? '✏️ Chỉnh sửa bài tập' : '➕ Thêm bài tập mới'}</strong>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleExSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Danh mục <span className="text-danger">*</span></Form.Label>
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
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tiêu đề bài tập <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            value={exForm.title}
                                            onChange={e => setExForm({ ...exForm, title: e.target.value })}
                                            placeholder="Nhập tiêu đề bài tập"
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả ngắn</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={exForm.description}
                                    onChange={e => setExForm({ ...exForm, description: e.target.value })}
                                    placeholder="Nhập mô tả ngắn về bài tập"
                                />
                            </Form.Group>

                            <div className="row">
                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Thời lượng (phút)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={exForm.duration_minutes}
                                            onChange={e => setExForm({ ...exForm, duration_minutes: e.target.value })}
                                            placeholder="VD: 10, 15, 30"
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Độ khó</Form.Label>
                                        <Form.Select
                                            value={exForm.difficulty_level}
                                            onChange={e => setExForm({ ...exForm, difficulty_level: e.target.value })}
                                        >
                                            <option value="">-- Chọn độ khó --</option>
                                            <option value="Easy">🟢 Easy (Dễ)</option>
                                            <option value="Medium">🟡 Medium (Trung bình)</option>
                                            <option value="Hard">🔴 Hard (Khó)</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Loại nội dung</Form.Label>
                                        <Form.Select
                                            value={exForm.media_type}
                                            onChange={e => setExForm({ ...exForm, media_type: e.target.value })}
                                        >
                                            <option value="">-- Chọn loại --</option>
                                            <option value="Audio">🎵 Audio</option>
                                            <option value="Video">🎬 Video</option>
                                            <option value="Text">📝 Text</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label>Media URL (YouTube, mp3, ...)</Form.Label>
                                <Form.Control
                                    value={exForm.media_url}
                                    onChange={e => setExForm({ ...exForm, media_url: e.target.value })}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Hướng dẫn chi tiết</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={exForm.instructions}
                                    onChange={e => setExForm({ ...exForm, instructions: e.target.value })}
                                    placeholder="Nhập hướng dẫn chi tiết cách thực hiện bài tập"
                                />
                            </Form.Group>

                            <div className="d-flex gap-2">
                                <Button type="submit" variant="info" disabled={loading}>
                                    {editingExerciseId ? '💾 Cập nhật bài tập' : '➕ Thêm bài tập'}
                                </Button>
                                {editingExerciseId && (
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
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
                                        ❌ Hủy
                                    </Button>
                                )}
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Bảng danh sách bài tập */}
                <h6 className="mb-3">📋 Danh sách bài tập ({exercises.length})</h6>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="info" />
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-info">
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Tiêu đề</th>
                                <th style={{ width: '150px' }}>Danh mục</th>
                                <th style={{ width: '100px' }}>Thời lượng</th>
                                <th style={{ width: '100px' }}>Độ khó</th>
                                <th style={{ width: '80px' }}>Loại</th>
                                <th style={{ width: '150px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercises.map((ex, idx) => (
                                <tr key={ex.exercise_id}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <strong>{ex.title}</strong>
                                        {ex.description && (
                                            <div className="text-muted small">{ex.description.substring(0, 50)}...</div>
                                        )}
                                    </td>
                                    <td>{ex.category_name}</td>
                                    <td className="text-center">
                                        {ex.duration_minutes ? `${ex.duration_minutes} phút` : '-'}
                                    </td>
                                    <td>{getDifficultyBadge(ex.difficulty_level)}</td>
                                    <td>
                                        {ex.media_type === 'Audio' ? '🎵' :
                                            ex.media_type === 'Video' ? '🎬' :
                                                ex.media_type === 'Text' ? '📝' : '-'}
                                    </td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="me-1"
                                            onClick={() => handleExEdit(ex)}
                                        >
                                            ✏️ Sửa
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => handleExDelete(ex.exercise_id)}
                                        >
                                            🗑️ Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {exercises.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center text-muted py-4">
                                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                        Chưa có bài tập nào. Hãy thêm bài tập đầu tiên!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
}

export default AdminExercises;
