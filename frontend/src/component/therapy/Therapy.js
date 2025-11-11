import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const videoData = [
    {
        id: 1,
        title: 'Thiền 10 phút để Giảm Căng Thẳng',
        description: 'Một bài tập thiền có hướng dẫn, giúp bạn thư giãn tâm trí và cơ thể chỉ trong 10 phút.',
        thumbnail: 'https://via.placeholder.com/300x200?text=Video+Thien',
        videoUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM' // Link video YouTube
    },
    {
        id: 2,
        title: 'Bài tập Hít Thở Sâu (Kỹ thuật 4-7-8)',
        description: 'Học kỹ thuật hít thở 4-7-8 nổi tiếng để nhanh chóng giảm lo âu và cải thiện giấc ngủ.',
        thumbnail: 'https://via.placeholder.com/300x200?text=Video+Hit+Tho',
        videoUrl: 'https://www.youtube.com/watch?v=pdd-91S-dYc'
    },
    {
        id: 3,
        title: 'Yoga Nhẹ Nhàng cho Người Mới Bắt Đầu',
        description: 'Một bài tập yoga 15 phút nhẹ nhàng, tập trung vào việc thả lỏng cơ thể và giải tỏa căng thẳng.',
        thumbnail: 'https://via.placeholder.com/300x200?text=Video+Yoga',
        videoUrl: 'https://www.youtube.com/watch?v=VaoV1PrYft4'
    },
    {
        id: 4,
        title: 'Hiểu về Liệu pháp Nhận thức Hành vi (CBT)',
        description: 'Video này giải thích các khái niệm cơ bản của CBT và cách nó giúp bạn thay đổi suy nghĩ tiêu cực.',
        thumbnail: 'https://via.placeholder.com/300x200?text=Video+CBT',
        videoUrl: 'https://www.youtube.com/watch?v=0_fANmfsdG4'
    }
];

const TherapyPage = () => {
    return (
        <Container className="my-4">
            <h2 className="mb-4">Trung tâm Video Hỗ Trợ</h2>
            <p className="lead text-muted mb-4">
            </p>

            {/* Sử dụng Row và Col để tạo lưới video 
                - xs={1}: 1 cột trên màn hình nhỏ (điện thoại)
                - md={2}: 2 cột trên màn hình trung bình (máy tính bảng)
                - lg={3}: 3 cột trên màn hình lớn
                - g-4: Thêm khoảng cách (gap) giữa các card
            */}
            <Row xs={1} md={2} lg={3} className="g-4">
                {videoData.map((video) => (
                    <Col key={video.id}>

                        <Card className="h-100 shadow-sm">
                            <Card.Img
                                variant="top"
                                src={video.thumbnail}
                                alt={video.title}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title as="h5">{video.title}</Card.Title>
                                <Card.Text className="flex-grow-1">
                                    {video.description}
                                </Card.Text>
                                <Button
                                    variant="primary"
                                    href={video.videoUrl}
                                    target="_blank" // Mở link trong tab mới
                                    rel="noopener noreferrer" // Bảo mật khi dùng target="_blank"
                                >
                                    Xem Video
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default TherapyPage;