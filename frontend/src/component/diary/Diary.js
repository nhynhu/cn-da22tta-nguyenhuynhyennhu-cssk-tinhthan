import React, { useState } from 'react';
import {
    Container,
    Card,
    Form,
    Button,
    ToggleButton,
    ToggleButtonGroup
} from 'react-bootstrap';

const HomePage = () => {
    // State để lưu cảm xúc và nội dung nhật ký
    const [mood, setMood] = useState(null);
    const [entry, setEntry] = useState('');

    // Lấy ngày hôm nay
    const today = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Hàm xử lý khi nhấn nút Lưu
    const handleSave = () => {
        if (!mood) {
            alert('Vui lòng chọn cảm xúc của bạn');
            return;
        }
        if (entry.trim() === '') {
            alert('Bạn chưa viết gì cả');
            return;
        }

        console.log('Cảm xúc:', mood);
        console.log('Nội dung:', entry);
        alert('Đã lưu nhật ký!');

        // Xóa form sau khi lưu
        setMood(null);
        setEntry('');
    };

    return (
        <Container className="my-4" style={{ maxWidth: '800px' }}>
            <Card className="shadow-sm">
                <Card.Header as="h3" className="text-center p-3">
                    Nhật ký hôm nay
                </Card.Header>
                <Card.Body className="p-4">
                    {/* Hiển thị ngày tháng */}
                    <p className="text-center text-muted">{today}</p>

                    <hr />

                    {/* Phần chọn cảm xúc */}
                    <Form.Group className="mb-4 text-center">
                        <Form.Label as="h5" className="mb-3">
                            Hôm nay bạn cảm thấy thế nào?
                        </Form.Label>
                        <br />
                        <ToggleButtonGroup
                            type="radio"
                            name="mood"
                            value={mood}
                            onChange={(val) => setMood(val)}
                            className="d-flex flex-wrap justify-content-center"
                            style={{ gap: '10px' }}
                        >
                            <ToggleButton id="mood-happy" value="vui" variant="outline-success">
                                😊 Vui vẻ
                            </ToggleButton>
                            <ToggleButton id="mood-calm" value="binh-yen" variant="outline-primary">
                                😌 Bình yên
                            </ToggleButton>
                            <ToggleButton id="mood-neutral" value="binh-thuong" variant="outline-secondary">
                                😐 Bình thường
                            </ToggleButton>
                            <ToggleButton id="mood-sad" value="buon" variant="outline-info">
                                😢 Buồn
                            </ToggleButton>
                            <ToggleButton id="mood-angry" value="tuc-gian" variant="outline-danger">
                                😠 Tức giận
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Form.Group>

                    {/* Phần viết nhật ký */}
                    <Form.Group>
                        <Form.Label as="h5" className="mb-3">
                            Viết chi tiết về ngày của bạn:
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={10}
                            placeholder="Hôm nay có chuyện gì xảy ra..."
                            value={entry}
                            onChange={(e) => setEntry(e.target.value)}
                        />
                    </Form.Group>

                    {/* Nút Lưu */}
                    <div className="text-end mt-4">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleSave}
                        >
                            Lưu nhật ký
                        </Button>
                    </div>

                </Card.Body>
            </Card>
        </Container>
    );
};

export default HomePage;