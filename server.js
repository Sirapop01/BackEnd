const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// LINE Notify endpoint
app.post('/send-to-line', async (req, res) => {
  const { formData } = req.body;
  const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN;

  try {
    // สร้างข้อความที่จะส่งไป LINE ให้ตรงกับฟิลด์ในฟอร์ม
    const message = `
🌸 มีคนกรอกฟอร์มใหม่! 🌸
------------------------
👤 ชื่อ-นามสกุล: ${formData["ชื่อ-นามสกุล"]}
💝 ชื่อเล่น: ${formData["ชื่อเล่น"]}
🎂 อายุ: ${formData["อายุ"]}
📱 เบอร์โทรศัพท์: ${formData["เบอร์โทรศัพท์"]}
🐾 สัตว์ที่ชอบ: ${formData["สัตว์ที่ชอบ"]}
🌺 ดอกไม้ที่ชอบ: ${formData["ดอกไม้ที่ชอบ"]}
🎨 สีที่ชอบ: ${formData["สีที่ชอบ"]}
🌎 อยากไปเที่ยวที่: ${formData["ถ้าได้ไปเที่ยวด้วยกัน อยากไปที่ไหน"]}
💭 ข้อความเพิ่มเติม: ${formData["มีอะไรอยากบอกกันไหม"]}
------------------------`;

    console.log('กำลังส่งข้อความ:', message); // log เพื่อเช็คข้อความ

    const response = await axios({
      method: 'post',
      url: 'https://notify-api.line.me/api/notify',
      headers: {
        'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `message=${encodeURIComponent(message)}`
    });

    console.log('ส่งข้อความสำเร็จ:', response.data);
    res.json({ success: true });

  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'เกิดข้อผิดพลาดในการส่งข้อความ',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
