import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './Analytic.css';

const Analytic = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState([]);
    const [trend, setTrend] = useState([]);
    const [period, setPeriod] = useState(30);
    const [chartView, setChartView] = useState('week');
    const [suggestedCategory, setSuggestedCategory] = useState(null);

    const token = localStorage.getItem('token');

    // Bảng màu & Text thay vì Icon
    const EMOTION_DATA = {
        'joy': { color: '#2c5e2e', label: 'Hân hoan', desc: 'Năng lượng tích cực' },
        'sadness': { color: '#2a4b7c', label: 'Buồn bã', desc: 'Trầm lắng' },
        'anger': { color: '#8a2be2', label: 'Giận dữ', desc: 'Căng thẳng cao' }, // Đổi màu đỏ sang tím đậm cho đỡ gắt
        'fear': { color: '#d97706', label: 'Lo âu', desc: 'Bất an' },
        'neutral': { color: '#525252', label: 'Bình ổn', desc: 'Cân bằng' },
        'vui': { color: '#2c5e2e', label: 'Vui vẻ', desc: 'Tích cực' },
        'buồn': { color: '#2a4b7c', label: 'Buồn', desc: 'Trầm lắng' },
        'giận': { color: '#9f1239', label: 'Giận', desc: 'Nóng nảy' },
        'lo lắng': { color: '#d97706', label: 'Lo lắng', desc: 'Bất an' },
        'bình thường': { color: '#525252', label: 'Bình thường', desc: 'Ổn định' },
    };

    const getEmotionColor = (emotion) => {
        if (!emotion) return '#525252';
        return EMOTION_DATA[emotion.toLowerCase()]?.color || '#525252';
    };

    useEffect(() => {
        if (token) {
            fetchAnalytics();
        } else {
            setLoading(false);
            setError('Vui lòng đăng nhập để xem dữ liệu.');
        }
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            if (!token) return;
            setLoading(true);
            setError(null);

            const summaryRes = await axios.get('http://localhost:5000/api/analytics/summary', {
                params: { days: period },
                headers: { Authorization: `Bearer ${token}` }
            });
            setSummary(summaryRes.data.data);

            const trendRes = await axios.get('http://localhost:5000/api/analytics/trend', {
                params: { days: period },
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrend(trendRes.data.data);

        } catch (err) {
            console.error('Lỗi load analytics:', err);
            setError('Không thể tải dữ liệu.');
        } finally {
            setLoading(false);
        }
    };

    const pieData = summary.map(item => ({
        name: item.emotion_name,
        value: item.total,
        color: getEmotionColor(item.emotion_name)
    }));

    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    pieData.forEach(item => {
        item.percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
    });

    // Logic xử lý dữ liệu biểu đồ (giữ nguyên logic của bạn)
    const getWeekdayData = () => {
        const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const weekdayData = weekdays.map(day => ({ name: day }));
        const emotions = new Set();
        trend.forEach(item => {
            Object.keys(item).filter(key => key !== 'date').forEach(emotion => emotions.add(emotion));
        });
        weekdayData.forEach(day => emotions.forEach(e => day[e] = 0));
        trend.forEach(item => {
            if (item.date) {
                const d = new Date(item.date);
                const dayIndex = d.getDay();
                Object.keys(item).filter(k => k !== 'date').forEach(e => {
                    if (weekdayData[dayIndex]) weekdayData[dayIndex][e] += item[e] || 0;
                });
            }
        });
        return weekdayData;
    };

    const getWeeklyData = () => {
        // (Giữ nguyên logic cũ của bạn ở đây để ngắn gọn)
        const weeklyData = [];
        const emotions = new Set();
        trend.forEach(item => Object.keys(item).filter(k => k !== 'date').forEach(e => emotions.add(e)));

        const weekGroups = {};
        const getWeekNumber = (date) => {
            const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        };

        trend.forEach(item => {
            if (item.date) {
                const date = new Date(item.date);
                const weekKey = `W${getWeekNumber(date)}`; // Viết tắt cho gọn
                if (!weekGroups[weekKey]) {
                    weekGroups[weekKey] = { name: weekKey };
                    emotions.forEach(e => weekGroups[weekKey][e] = 0);
                }
                Object.keys(item).filter(k => k !== 'date').forEach(e => weekGroups[weekKey][e] += item[e] || 0);
            }
        });
        Object.values(weekGroups).forEach(w => weeklyData.push(w));
        return weeklyData.slice(-5);
    };

    const getEmotionsList = () => {
        const emotions = new Set();
        trend.forEach(item => Object.keys(item).filter(k => k !== 'date').forEach(e => emotions.add(e)));
        return Array.from(emotions);
    };

    // --- PHẦN GỢI Ý (Đã bỏ Icon) ---
    const getTips = (emotion) => {
        const tipsMap = {
            'joy': ['Duy trì thói quen hiện tại', 'Ghi lại khoảnh khắc này', 'Lan tỏa năng lượng', 'Chia sẻ niềm vui với người thân', 'Tập thể dục để giữ tinh thần tích cực'],
            'sadness': ['Đi bộ hít thở khí trời', 'Viết nhật ký tâm trạng', 'Nghe nhạc không lời', 'Gọi điện cho người thân yêu', 'Xem phim hoặc đọc sách động lực', 'Thử nấu món ăn yêu thích'],
            'anger': ['Hít thở sâu 10 lần', 'Rời khỏi không gian ồn ào', 'Uống một ly nước lạnh', 'Tập thể dục hoặc chạy bộ', 'Viết ra cảm xúc của bạn', 'Đếm ngược từ 10'],
            'fear': ['Tập trung vào hiện tại', 'Liệt kê điều kiểm soát được', 'Thiền 5 phút', 'Nói chuyện với người tin tưởng', 'Thực hành kỹ thuật thư giãn cơ bắp', 'Nghe nhạc nhẹ nhàng'],
            'neutral': ['Thử học kỹ năng mới', 'Đọc sách', 'Sắp xếp lại bàn làm việc', 'Đi dạo ngoài trời', 'Nghe podcast hoặc audiobook', 'Lên kế hoạch cho tuần mới'],
            'disgust': ['Tắm rửa để cảm thấy sảng khoái', 'Dọn dẹp không gian sống', 'Thay đổi môi trường xung quanh', 'Thực hành thiền chánh niệm', 'Uống trà thảo mộc'],
            'surprise': ['Ghi lại trải nghiệm này', 'Chia sẻ với bạn bè', 'Tìm hiểu thêm về điều bất ngờ', 'Tận hưởng khoảnh khắc', 'Suy ngẫm về cảm xúc của bạn']
        };
        const e = emotion?.toLowerCase();
        return tipsMap[e] || tipsMap['joy'] || tipsMap['vui'] || ['Nghỉ ngơi điều độ', 'Uống đủ nước', 'Tập thể dục nhẹ nhàng'];
    };

    const topEmotion = pieData.length > 0 ? pieData[0].name : null;
    const tips = getTips(topEmotion);
    const topEmotionColor = getEmotionColor(topEmotion);

    // Fetch category matching the dominant emotion
    useEffect(() => {
        const fetchSuggestedCategory = async () => {
            if (!topEmotion || !token) return;
            try {
                const response = await axios.get('http://localhost:5000/api/suggestions/categories', {
                    params: { emotion: topEmotion.toLowerCase() },
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success && response.data.data.length > 0) {
                    setSuggestedCategory(response.data.data[0]);
                }
            } catch (err) {
                console.error('Error fetching category:', err);
            }
        };
        fetchSuggestedCategory();
    }, [topEmotion, token]);

    const handleNavigateToTherapy = () => {
        if (suggestedCategory) {
            navigate('/therapy', { state: { selectedCategoryId: suggestedCategory.category_id } });
        } else {
            navigate('/therapy');
        }
    };

    if (loading) return <div className="loading-container"><Spinner animation="grow" /></div>;

    return (
        <div className="analytic-wrapper">
            <Container className="py-5">
                {/* Header đơn giản, đậm chất báo chí */}
                <div className="header-section mb-5  border-dark pb-3">
                    <Row className="align-items-end">
                        <Col md={8}>
                            <h6 className="text-uppercase text-muted mb-1 ls-2">Báo cáo tâm lý</h6>
                            <h1 className="display-4 fw-bold mb-0">Hồ sơ Cảm xúc</h1>
                        </Col>
                        <Col md={4} className="text-md-end">
                            <div className="filter-group mt-3 mt-md-0">
                                {[7, 30, 90].map(d => (
                                    <button
                                        key={d}
                                        className={`sharp-btn ${period === d ? 'active' : ''}`}
                                        onClick={() => setPeriod(d)}
                                    >
                                        {d} ngày
                                    </button>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </div>

                {error && <Alert variant="danger" className="sharp-alert">{error}</Alert>}


                <Row className="gy-5">
                    {/* Biểu đồ tròn */}
                    <Col lg={5}>
                        <div className="chart-box">
                            <h4 className="section-title">Phân bổ tỷ lệ</h4>
                            <div className="chart-container border border-dark p-3 bg-white">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%" cy="50%"
                                            innerRadius={60} // Donut chart nhìn hiện đại hơn
                                            outerRadius={100}
                                            paddingAngle={2} // Tạo khe hở sắc nét
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: 0, border: '1px solid #000', boxShadow: 'none' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="legend-grid mt-4">
                                    {pieData.map((item, index) => (
                                        <div key={index} className="legend-item">
                                            <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                                            <div className="legend-info">
                                                <span className="fw-bold text-uppercase">{item.name}</span>
                                                <span className="text-muted ms-2">{item.percentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Biểu đồ cột */}
                    <Col lg={7}>
                        <div className="chart-box">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="section-title mb-0">Xu hướng biến động</h4>
                                <div className="view-switch">
                                    <button
                                        className={`switch-btn ${chartView === 'week' ? 'active' : ''}`}
                                        onClick={() => setChartView('week')}
                                    >
                                        Ngày
                                    </button>
                                    <span className="mx-1">/</span>
                                    <button
                                        className={`switch-btn ${chartView === 'month' ? 'active' : ''}`}
                                        onClick={() => setChartView('month')}
                                    >
                                        Tuần
                                    </button>
                                </div>
                            </div>

                            <div className="chart-container border border-dark p-3 bg-white">
                                <ResponsiveContainer width="100%" height={380}>
                                    <BarChart data={chartView === 'week' ? getWeekdayData() : getWeeklyData()}>
                                        <CartesianGrid strokeDasharray="0" stroke="#e5e5e5" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                            contentStyle={{ borderRadius: 0, border: '1px solid #000', boxShadow: 'none' }}
                                        />
                                        <Legend iconType="square" />
                                        {getEmotionsList().map((emotion) => (
                                            <Bar
                                                key={emotion}
                                                dataKey={emotion}
                                                fill={getEmotionColor(emotion)}
                                                barSize={40}
                                                // QUAN TRỌNG: radius 0 để vuông góc
                                                radius={[0, 0, 0, 0]}
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Phần Tổng quan số liệu - Layout lưới */}
                <Row className="mt-5 g-0 border border-dark">
                    <Col md={4} className="border-end border-dark p-4 text-center bg-white">
                        <span className="d-block text-uppercase text-muted small mb-2">Tổng bản ghi</span>
                        <span className="display-3 fw-bold">{total}</span>
                    </Col>
                    <Col md={4} className="border-end border-dark p-4 text-center bg-white">
                        <span className="d-block text-uppercase text-muted small mb-2">Đa dạng cảm xúc</span>
                        <span className="display-3 fw-bold">{pieData.length}</span>
                    </Col>
                    <Col md={4} className="p-4 text-center bg-white" style={{ backgroundColor: `${topEmotionColor}10` }}>
                        <span className="d-block text-uppercase text-muted small mb-2">Trạng thái chủ đạo</span>
                        <span className="display-3 fw-bold" style={{ color: topEmotionColor }}>
                            {topEmotion || "—"}
                        </span>
                    </Col>
                </Row>

                {/* Phần Gợi ý - Thiết kế dạng Ticket/Note */}
                {topEmotion && (
                    <div className="suggestion-section mt-5">
                        <Row>
                            <Col md={12}>
                                <div className="suggestion-box bg-white border border-dark p-0">
                                    <div className="d-flex flex-column flex-md-row">
                                        <div
                                            className="p-4 p-md-5 d-flex flex-column justify-content-center text-white"
                                            style={{ backgroundColor: topEmotionColor, minWidth: '250px' }}
                                        >
                                            <span className="text-uppercase small ls-2 opacity-75">Lời khuyên cho</span>
                                            <h2 className="display-5 fw-bold mb-0">{topEmotion}</h2>
                                        </div>
                                        <div className="p-4 p-md-5 flex-grow-1">
                                            <h5 className="text-uppercase fw-bold mb-4 border-bottom border-dark pb-2 d-inline-block">
                                                Hành động đề xuất
                                            </h5>
                                            <Row>
                                                {tips.map((tip, idx) => (
                                                    <Col md={6} key={idx} className="mb-3">
                                                        <div className="d-flex align-items-start">
                                                            <span className="number-marker me-3">{idx + 1}</span>
                                                            <p className="mb-0 fs-5">{tip}</p>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>

                                            <div className="mt-4 pt-3 border-top border-light-gray">
                                                <button
                                                    onClick={handleNavigateToTherapy}
                                                    className="text-dark fw-bold text-decoration-none d-flex align-items-center arrow-link"
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        padding: 0,
                                                        cursor: 'pointer',
                                                        fontSize: 'inherit'
                                                    }}
                                                >
                                                    ĐẾN PHÒNG TRỊ LIỆU
                                                    <span className="ms-2">→</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Analytic;