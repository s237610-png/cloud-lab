const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.MONGODB_URI) {
  console.error('Thiếu MONGODB_URI trong file .env');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('MongoDB Atlas Connected'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err.message));

const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  email: String
});
const Student = mongoose.model('Student', studentSchema);

app.get('/api/hello', (req, res) => res.json({ message: 'Hello from Express Backend!' }));

app.get('/api/students', async (req, res) => {
  try {
    res.json(await Student.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    res.status(201).json(await Student.create(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    res.json(await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
