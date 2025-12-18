import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytic = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState([]);
    const [trend, setTrend] = useState([]);
    const [period, setPeriod] = useState(30); // 7, 30, 90 ngày

    const USER_ID = 1; // Hardcoded, thay bằng auth thật

    // Màu sắc cho các cảm xúc
    const EMOTION_COLORS = {
        'joy': '#28a745',
        'sadness': '#17a2b8',
        'anger': '#dc3545',
        'fear': '#ffc107',
        'neutral': '#6c757d',
        'suprise': '#fd7e14',
        'disgust': '#6610f2',
        'vui': '#28a745',
        'buồn': '#17a2b8',
        'giận': '#dc3545',
        'lo lắng': '#ffc107',
        'bình thường': '#6c757d',
        'bất ngờ': '#fd7e14',
        "ghê tởm": '#6610f2',
    };

    const getEmotionColor = (emotion) => {
        if (!emotion) return '#6c757d';
        const lower = emotion.toLowerCase();
        return EMOTION_COLORS[lower] || '#6c757d';
    };

    // Load dữ liệu
    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            // Gọi API tổng quan
            const summaryRes = await axios.get(`http://localhost:5000/api/analytics/summary?user_id=${USER_ID}&days=${period}`);
            setSummary(summaryRes.data.data);

            // Gọi API xu hướng
            const trendRes = await axios.get(`http://localhost:5000/api/analytics/trend?user_id=${USER_ID}&days=${period}`);
            setTrend(trendRes.data.data);

        } catch (err) {
            console.error('Lỗi load analytics:', err);
            setError('Không thể tải dữ liệu thống kê');
        } finally {
            setLoading(false);
        }
    };

    // Format data cho Pie Chart
    const pieData = summary.map(item => ({
        name: item.emotion_name,
        value: item.total,
        color: getEmotionColor(item.emotion_name)
    }));

    // Tính phần trăm
    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    pieData.forEach(item => {
        item.percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
    });

    // Custom label cho Pie Chart
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Đang tải thống kê...</p>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <h2 className="mb-4">Thống kê Cảm xúc</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Bộ lọc thời gian */}
            <div className="mb-4">
                <button className={`btn ${period === 7 ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => setPeriod(7)}>
                    7 ngày
                </button>
                <button className={`btn ${period === 30 ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => setPeriod(30)}>
                    30 ngày
                </button>
                <button className={`btn ${period === 90 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPeriod(90)}>
                    90 ngày
                </button>
            </div>

            <Row>
                {/* Biểu đồ tròn - Tỷ lệ cảm xúc */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5" className="bg-primary text-white">
                            Tỷ lệ Cảm xúc ({period} ngày)
                        </Card.Header>
                        <Card.Body>
                            {pieData.length === 0 ? (
                                <p className="text-center text-muted">Chưa có dữ liệu</p>
                            ) : (
                                <>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomLabel}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>

                                    {/* Legend tùy chỉnh */}
                                    <div className="mt-3">
                                        {pieData.map((item, index) => (
                                            <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div style={{ width: 20, height: 20, backgroundColor: item.color, marginRight: 10 }}></div>
                                                    <span>{item.name}</span>
                                                </div>
                                                <span className="fw-bold">{item.value} ({item.percentage}%)</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Biểu đồ đường - Xu hướng theo thời gian */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5" className="bg-primary text-white">
                            Xu hướng Cảm xúc ({period} ngày)
                        </Card.Header>
                        <Card.Body>
                            {trend.length === 0 ? (
                                <p className="text-center text-muted">Chưa có dữ liệu</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={trend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />

                                        {/* Tự động tạo line cho từng cảm xúc có trong data */}
                                        {Object.keys(trend[0] || {})
                                            .filter(key => key !== 'date')
                                            .map((emotion, index) => (
                                                <Line
                                                    key={emotion}
                                                    type="monotone"
                                                    dataKey={emotion}
                                                    stroke={getEmotionColor(emotion)}
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                />
                                            ))
                                        }
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Thống kê tổng quan */}
            <Row>
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Header as="h5" className="bg-primary text-white">
                            Tổng quan {period} ngày qua
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4} className="text-center mb-3">
                                    <h3 className="text-primary">{total}</h3>
                                    <p className="text-muted">Tổng số bản ghi</p>
                                </Col>
                                <Col md={4} className="text-center mb-3">
                                    <h3 className="text-success">{pieData.length}</h3>
                                    <p className="text-muted">Loại cảm xúc</p>
                                </Col>
                                <Col md={4} className="text-center mb-3">
                                    <h3 className="text-warning">
                                        {pieData.length > 0 ? pieData[0].name : 'N/A'}
                                    </h3>
                                    <p className="text-muted">Cảm xúc phổ biến nhất</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Analytic;
