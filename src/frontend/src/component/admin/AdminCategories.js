import React, { useEffect, useState } from 'react';
import { Card, Table, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const INTENT_OPTIONS = ['anger', 'sadness', 'joy', 'fear', 'disgust'];

function AdminCategories({ user }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [catForm, setCatForm] = useState({
        category_name: '',
        description: '',
        icon_url: '',
        intent: '',
        display_order: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/mind/categories', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data);
        } catch (err) {
            setError('Không thể tải danh sách danh mục.');
        }
        setLoading(false);
    };

    const handleCatSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (editingCategoryId) {
                await axios.put(
                    `http://localhost:5000/api/mind/categories/${editingCategoryId}`,
                    catForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    'http://localhost:5000/api/mind/categories',
                    catForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            setCatForm({ category_name: '', description: '', icon_url: '', intent: '', display_order: '' });
            setEditingCategoryId(null);
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.error || 'Lỗi khi lưu danh mục');
        }
    };

    const handleCatEdit = (cat) => {
        setEditingCategoryId(cat.category_id);
        setCatForm({
            category_name: cat.category_name || '',
            description: cat.description || '',
            icon_url: cat.icon_url || '',
            intent: cat.intent || '',
            display_order: cat.display_order || ''
        });
    };

    const handleCatDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return;
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/mind/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.error || 'Lỗi khi xóa danh mục');
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
        <Card className="shadow-sm" style={{ background: '#f8f9fa', border: 'none' }}>
            <Card.Header style={{ background: '#02113d', color: 'white' }}>
                <h5 className="mb-0">
                    <i className="bi bi-folder-fill me-2"></i>
                    Quản lý danh mục bài tập
                </h5>
            </Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Form thêm/sửa danh mục */}
                <Card className="mb-4" style={{ borderColor: '#16306e' }}>
                    <Card.Header style={{ background: '#16306e', color: 'white' }}>
                        <strong>{editingCategoryId ? '✏️ Chỉnh sửa danh mục' : '➕ Thêm danh mục mới'}</strong>
                    </Card.Header>
                    <Card.Body style={{ background: '#f8f9fa' }}>
                        <Form onSubmit={handleCatSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên danh mục <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            value={catForm.category_name}
                                            onChange={e => setCatForm({ ...catForm, category_name: e.target.value })}
                                            placeholder="Nhập tên danh mục"
                                            required
                                            style={{ borderColor: '#16306e' }}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Intent (liên kết cảm xúc) <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={catForm.intent}
                                            onChange={e => setCatForm({ ...catForm, intent: e.target.value })}
                                            required
                                            style={{ borderColor: '#16306e' }}
                                        >
                                            <option value="">-- Chọn intent --</option>
                                            {INTENT_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>
                                                    {opt === 'anger' ? '😠 Anger (Tức giận)' :
                                                        opt === 'sadness' ? '😢 Sadness (Buồn bã)' :
                                                            opt === 'joy' ? '😊 Joy (Vui vẻ)' :
                                                                opt === 'fear' ? '😨 Fear (Sợ hãi)' :
                                                                    '🤢 Disgust (Ghê tởm)'}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>
                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={catForm.description}
                                    onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                                    placeholder="Nhập mô tả cho danh mục"
                                    style={{ borderColor: '#16306e' }}
                                />
                            </Form.Group>
                            <div className="row">
                                <div className="col-md-8">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Icon URL</Form.Label>
                                        <Form.Control
                                            value={catForm.icon_url}
                                            onChange={e => setCatForm({ ...catForm, icon_url: e.target.value })}
                                            placeholder="URL hình ảnh icon"
                                            style={{ borderColor: '#16306e' }}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Thứ tự hiển thị</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={catForm.display_order}
                                            onChange={e => setCatForm({ ...catForm, display_order: e.target.value })}
                                            placeholder="1, 2, 3..."
                                            style={{ borderColor: '#16306e' }}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <Button type="submit" style={{ background: '#02113d', border: 'none' }} disabled={loading}>
                                    {editingCategoryId ? '💾 Cập nhật danh mục' : '➕ Thêm danh mục'}
                                </Button>
                                {editingCategoryId && (
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={() => {
                                            setEditingCategoryId(null);
                                            setCatForm({ category_name: '', description: '', icon_url: '', intent: '', display_order: '' });
                                        }}
                                    >
                                        ❌ Hủy
                                    </Button>
                                )}
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Bảng danh sách danh mục */}
                <h6 className="mb-3">📋 Danh sách danh mục ({categories.length})</h6>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" style={{ color: '#02113d' }} />
                    </div>
                ) : (
                    <Table bordered hover responsive style={{ background: 'white' }}>
                        <thead style={{ background: '#16306e', color: 'white' }}>
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Tên danh mục</th>
                                <th style={{ width: '120px' }}>Intent</th>
                                <th style={{ width: '100px' }}>Thứ tự</th>
                                <th style={{ width: '150px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c, idx) => (
                                <tr key={c.category_id}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <strong>{c.category_name}</strong>
                                        {c.description && (
                                            <div className="text-muted small">{c.description}</div>
                                        )}
                                    </td>
                                    <td>
                                        <span className="badge" style={{ background: '#02113d', color: 'white' }}>
                                            {c.intent}
                                        </span>
                                    </td>
                                    <td className="text-center">{c.display_order}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            style={{ background: '#16306e', color: 'white', border: 'none' }} className="me-1"
                                            onClick={() => handleCatEdit(c)}
                                        >
                                            ✏️ Sửa
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => handleCatDelete(c.category_id)}
                                        >
                                            🗑️ Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                        Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!
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

export default AdminCategories;
