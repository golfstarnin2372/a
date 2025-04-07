const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());  // รองรับ JSON payload

// เก็บคำสั่งไว้ใน memory (จะเก็บคำสั่งที่ส่งไปให้แต่ละเครื่อง)
const commands = {};

// หน้าแรก ทดสอบว่าเซิร์ฟเวอร์ทำงาน
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// รับคำสั่งจากโปรแกรมหลักแล้วส่งไปที่เครื่องลูก
app.post('/send-command', (req, res) => {
  const { client, command } = req.body;

  if (!client || !command) {
    return res.status(400).json({ error: 'Missing client or command' });
  }

  // เก็บคำสั่งไว้ใน memory
  commands[client] = command;
  res.json({ message: `Command '${command}' sent to ${client}` });
});

// เครื่องลูกเช็คคำสั่งจาก Server
app.get('/get-command', (req, res) => {
  const client = req.query.client;

  if (!client) {
    return res.status(400).json({ error: 'Missing client name' });
  }

  const command = commands[client] || null;
  res.json({ command });
});

// แจ้งว่าเครื่องลูกทำเสร็จแล้ว
app.post('/command-done', (req, res) => {
  const { client } = req.body;

  if (!client) {
    return res.status(400).json({ error: 'Missing client name' });
  }

  // ลบคำสั่งหลังจากที่ทำเสร็จ
  if (commands[client]) {
    delete commands[client];
  }

  res.json({ message: `Command for ${client} cleared` });
});

// เริ่ม Server
app.listen(PORT, () => {
  console.log(`Server is running oกดหดกหดกหn port ${PORT}`);
});
