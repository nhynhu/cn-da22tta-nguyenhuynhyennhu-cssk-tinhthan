import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Nav } from 'react-bootstrap';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytic = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState([]);
    const [trend, setTrend] = useState([]);
    const [period, setPeriod] = useState(30); // 7, 30, 90 ngày
    const [chartView, setChartView] = useState('week'); // 'week' hoặc 'month'

    // Lấy token từ localStorage (đã lưu sau khi login)
    const token = localStorage.getItem('token');

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
        if (token) {
            fetchAnalytics();
        } else {
            setLoading(false);
            setError('Bạn cần đăng nhập để xem thống kê cảm xúc.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            if (!token) {
                setError('Bạn cần đăng nhập để xem thống kê cảm xúc.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            // Gọi API tổng quan
            const summaryRes = await axios.get('http://localhost:5000/api/analytics/summary', {
                params: { days: period },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSummary(summaryRes.data.data);

            // Gọi API xu hướng
            const trendRes = await axios.get('http://localhost:5000/api/analytics/trend', {
                params: { days: period },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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

    // Gợi ý theo cảm xúc phổ biến nhất
    const getEmotionSuggestions = (emotion) => {
        if (!emotion) return null;
        const lower = emotion.toLowerCase();

        const suggestions = {
            'joy': {
                icon: '😊',
                title: 'Bạn đang rất tích cực!',
                tips: [
                    '🎯 Tiếp tục duy trì thói quen tốt hiện tại',
                    '📝 Ghi lại những khoảnh khắc vui vẻ để nhìn lại sau',
                    '🤝 Chia sẻ niềm vui với người thân và bạn bè',
                    '🎨 Thử những hoạt động sáng tạo mới'
                ],
                color: '#28a745'
            },
            'vui': {
                icon: '😊',
                title: 'Bạn đang rất tích cực!',
                tips: [
                    '🎯 Tiếp tục duy trì thói quen tốt hiện tại',
                    '📝 Ghi lại những khoảnh khắc vui vẻ để nhìn lại sau',
                    '🤝 Chia sẻ niềm vui với người thân và bạn bè',
                    '🎨 Thử những hoạt động sáng tạo mới'
                ],
                color: '#28a745'
            },
            'sadness': {
                icon: '😢',
                title: 'Bạn có vẻ đang buồn...',
                tips: [
                    '💬 Hãy trò chuyện với người bạn tin tưởng',
                    '🧘 Thử các bài tập thiền và hít thở sâu',
                    '🚶 Đi dạo ngoài trời, tiếp xúc với thiên nhiên',
                    '📖 Đọc sách hoặc nghe nhạc nhẹ nhàng',
                    '🛌 Đảm bảo ngủ đủ giấc và ăn uống điều độ'
                ],
                color: '#17a2b8'
            },
            'buồn': {
                icon: '😢',
                title: 'Bạn có vẻ đang buồn...',
                tips: [
                    '💬 Hãy trò chuyện với người bạn tin tưởng',
                    '🧘 Thử các bài tập thiền và hít thở sâu',
                    '🚶 Đi dạo ngoài trời, tiếp xúc với thiên nhiên',
                    '📖 Đọc sách hoặc nghe nhạc nhẹ nhàng',
                    '🛌 Đảm bảo ngủ đủ giấc và ăn uống điều độ'
                ],
                color: '#17a2b8'
            },
            'anger': {
                icon: '😠',
                title: 'Bạn đang cảm thấy tức giận',
                tips: [
                    '🌬️ Hít thở sâu 10 lần trước khi phản ứng',
                    '🏃 Tập thể dục để giải phóng năng lượng tiêu cực',
                    '✍️ Viết ra những suy nghĩ để xả stress',
                    '🎵 Nghe nhạc thư giãn hoặc nhạc yêu thích',
                    '🧊 Rửa mặt bằng nước lạnh để bình tĩnh lại'
                ],
                color: '#dc3545'
            },
            'giận': {
                icon: '😠',
                title: 'Bạn đang cảm thấy tức giận',
                tips: [
                    '🌬️ Hít thở sâu 10 lần trước khi phản ứng',
                    '🏃 Tập thể dục để giải phóng năng lượng tiêu cực',
                    '✍️ Viết ra những suy nghĩ để xả stress',
                    '🎵 Nghe nhạc thư giãn hoặc nhạc yêu thích',
                    '🧊 Rửa mặt bằng nước lạnh để bình tĩnh lại'
                ],
                color: '#dc3545'
            },
            'fear': {
                icon: '😰',
                title: 'Bạn đang lo lắng về điều gì đó',
                tips: [
                    '📋 Liệt kê những lo lắng và phân tích thực tế',
                    '🧘 Thực hành thiền chánh niệm 5-10 phút mỗi ngày',
                    '👥 Chia sẻ với người thân hoặc chuyên gia',
                    '🎯 Tập trung vào những gì bạn có thể kiểm soát',
                    '☕ Giảm caffeine và đảm bảo ngủ đủ giấc'
                ],
                color: '#ffc107'
            },
            'lo lắng': {
                icon: '😰',
                title: 'Bạn đang lo lắng về điều gì đó',
                tips: [
                    '📋 Liệt kê những lo lắng và phân tích thực tế',
                    '🧘 Thực hành thiền chánh niệm 5-10 phút mỗi ngày',
                    '👥 Chia sẻ với người thân hoặc chuyên gia',
                    '🎯 Tập trung vào những gì bạn có thể kiểm soát',
                    '☕ Giảm caffeine và đảm bảo ngủ đủ giấc'
                ],
                color: '#ffc107'
            },
            'neutral': {
                icon: '😐',
                title: 'Trạng thái cảm xúc ổn định',
                tips: [
                    '🌟 Thử những hoạt động mới để khám phá bản thân',
                    '📚 Học một kỹ năng hoặc sở thích mới',
                    '🤝 Kết nối với bạn bè và người thân',
                    '🎯 Đặt mục tiêu nhỏ và thực hiện từng bước'
                ],
                color: '#6c757d'
            },
            'bình thường': {
                icon: '😐',
                title: 'Trạng thái cảm xúc ổn định',
                tips: [
                    '🌟 Thử những hoạt động mới để khám phá bản thân',
                    '📚 Học một kỹ năng hoặc sở thích mới',
                    '🤝 Kết nối với bạn bè và người thân',
                    '🎯 Đặt mục tiêu nhỏ và thực hiện từng bước'
                ],
                color: '#6c757d'
            }
        };

        return suggestions[lower] || {
            icon: '💡',
            title: 'Gợi ý cho bạn',
            tips: [
                '🧘 Dành thời gian cho bản thân mỗi ngày',
                '📝 Viết nhật ký cảm xúc thường xuyên',
                '🏃 Tập thể dục đều đặn',
                '😴 Ngủ đủ giấc và ăn uống lành mạnh'
            ],
            color: '#6c757d'
        };
    };

    // Lấy gợi ý cho cảm xúc phổ biến nhất
    const topEmotion = pieData.length > 0 ? pieData[0].name : null;
    const emotionSuggestion = getEmotionSuggestions(topEmotion);

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

    // Chuyển đổi dữ liệu trend thành dữ liệu theo ngày trong tuần
    const getWeekdayData = () => {
        const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const weekdayData = weekdays.map(day => ({ name: day }));

        // Lấy tất cả các loại cảm xúc có trong data
        const emotions = new Set();
        trend.forEach(item => {
            Object.keys(item).filter(key => key !== 'date').forEach(emotion => emotions.add(emotion));
        });

        // Khởi tạo giá trị 0 cho mỗi cảm xúc
        weekdayData.forEach(day => {
            emotions.forEach(emotion => {
                day[emotion] = 0;
            });
        });

        // Tính tổng cảm xúc theo ngày trong tuần
        trend.forEach(item => {
            if (item.date) {
                const date = new Date(item.date);
                const dayIndex = date.getDay(); // 0 = CN, 1 = T2, ...
                Object.keys(item).filter(key => key !== 'date').forEach(emotion => {
                    if (weekdayData[dayIndex]) {
                        weekdayData[dayIndex][emotion] += item[emotion] || 0;
                    }
                });
            }
        });

        return weekdayData;
    };

    // Chuyển đổi dữ liệu trend thành dữ liệu theo tuần trong tháng
    const getWeeklyData = () => {
        const weeklyData = [];

        // Lấy tất cả các loại cảm xúc có trong data
        const emotions = new Set();
        trend.forEach(item => {
            Object.keys(item).filter(key => key !== 'date').forEach(emotion => emotions.add(emotion));
        });

        // Nhóm theo tuần
        const weekGroups = {};
        trend.forEach(item => {
            if (item.date) {
                const date = new Date(item.date);
                const weekNum = getWeekNumber(date);
                const weekKey = `Tuần ${weekNum}`;

                if (!weekGroups[weekKey]) {
                    weekGroups[weekKey] = { name: weekKey };
                    emotions.forEach(emotion => {
                        weekGroups[weekKey][emotion] = 0;
                    });
                }

                Object.keys(item).filter(key => key !== 'date').forEach(emotion => {
                    weekGroups[weekKey][emotion] += item[emotion] || 0;
                });
            }
        });

        // Chuyển thành mảng và sắp xếp
        Object.values(weekGroups).forEach(week => weeklyData.push(week));
        return weeklyData.slice(-5); // Lấy 5 tuần gần nhất
    };

    // Hàm lấy số tuần trong năm
    const getWeekNumber = (date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    };

    // Lấy danh sách cảm xúc từ trend data
    const getEmotionsList = () => {
        const emotions = new Set();
        trend.forEach(item => {
            Object.keys(item).filter(key => key !== 'date').forEach(emotion => emotions.add(emotion));
        });
        return Array.from(emotions);
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

                {/* Biểu đồ cột - Cảm xúc theo ngày/tuần */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5" className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <span>Phân bố Cảm xúc</span>
                            <Nav variant="pills" className="ms-auto">
                                <Nav.Item>
                                    <Nav.Link
                                        active={chartView === 'week'}
                                        onClick={() => setChartView('week')}
                                        style={{
                                            padding: '4px 12px',
                                            fontSize: '12px',
                                            backgroundColor: chartView === 'week' ? 'white' : 'transparent',
                                            color: chartView === 'week' ? '#0d6efd' : 'white'
                                        }}
                                    >
                                        Theo ngày
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        active={chartView === 'month'}
                                        onClick={() => setChartView('month')}
                                        style={{
                                            padding: '4px 12px',
                                            fontSize: '12px',
                                            backgroundColor: chartView === 'month' ? 'white' : 'transparent',
                                            color: chartView === 'month' ? '#0d6efd' : 'white'
                                        }}
                                    >
                                        Theo tuần
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            {trend.length === 0 ? (
                                <p className="text-center text-muted">Chưa có dữ liệu</p>
                            ) : (
                                <>
                                    <p className="text-center text-muted small mb-3">
                                        {chartView === 'week'
                                            ? '📅 Cảm xúc theo các ngày trong tuần'
                                            : '📆 Cảm xúc theo các tuần trong tháng'}
                                    </p>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart
                                            data={chartView === 'week' ? getWeekdayData() : getWeeklyData()}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255,255,255,0.95)',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Legend />

                                            {/* Tự động tạo bar cho từng cảm xúc */}
                                            {getEmotionsList().map((emotion) => (
                                                <Bar
                                                    key={emotion}
                                                    dataKey={emotion}
                                                    fill={getEmotionColor(emotion)}
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            ))}
                                        </BarChart>
                                    </ResponsiveContainer>
                                </>
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

            {/* Gợi ý theo cảm xúc phổ biến nhất */}
            {topEmotion && emotionSuggestion && (
                <Row className="mt-4">
                    <Col md={12}>
                        <Card className="shadow-sm" style={{ borderLeft: `5px solid ${emotionSuggestion.color}` }}>
                            <Card.Header
                                className="d-flex align-items-center"
                                style={{ backgroundColor: `${emotionSuggestion.color}20` }}
                            >
                                <span style={{ fontSize: '2rem', marginRight: '12px' }}>{emotionSuggestion.icon}</span>
                                <div>
                                    <h5 className="mb-0">{emotionSuggestion.title}</h5>
                                    <small className="text-muted">
                                        Dựa trên cảm xúc phổ biến nhất của bạn: <strong>{topEmotion}</strong> ({pieData[0]?.percentage}%)
                                    </small>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <h6 className="mb-3">💡 Gợi ý dành cho bạn:</h6>
                                <Row>
                                    {emotionSuggestion.tips.map((tip, index) => (
                                        <Col md={6} key={index} className="mb-2">
                                            <div
                                                className="p-3 rounded h-100"
                                                style={{
                                                    backgroundColor: '#f8f9fa',
                                                    borderLeft: `3px solid ${emotionSuggestion.color}`,
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = `${emotionSuggestion.color}15`;
                                                    e.currentTarget.style.transform = 'translateX(5px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                    e.currentTarget.style.transform = 'translateX(0)';
                                                }}
                                            >
                                                {tip}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                                <div className="mt-4 text-center">
                                    <a
                                        href="/therapy"
                                        className="btn btn-outline-primary rounded-pill px-4"
                                    >
                                        🧘 Xem các bài tập trị liệu phù hợp
                                    </a>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Analytic;
