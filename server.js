import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Cấu hình cổng cho Google App Hosting
const PORT = process.env.PORT || 8080;

// 2. Phục vụ các file giao diện sau khi Vite build xong
app.use(express.static(path.join(__dirname, 'dist')));

// 3. API xử lý đặt phòng (Thay bằng logic của Huy vào đây)
app.post('/api/booking', (req, res) => {
    // Logic gửi mail Nodemailer sẽ nằm ở đây
    res.json({ message: "Ocena đã nhận yêu cầu của bạn!" });
});

// 4. Mở cửa đón khách (BẮT BUỘC dùng 0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Ocena Living Backend is live on port ${PORT}`);
});