import { useEffect, useState } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Câu 47: Gọi API lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Câu 49: Gửi dữ liệu sinh viên mới lên Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, email }),
      });
      if (response.ok) {
        setStudentId('');
        setName('');
        setEmail('');
        fetchStudents(); // Cập nhật lại danh sách ngay sau khi thêm
      }
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Quản Lý Sinh Viên</h2>

      {/* Câu 48: Form nhập thông tin sinh viên */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <h3>Thêm Sinh Viên Mới</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Mã sinh viên (MSSV)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            type="text"
            placeholder="Họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button type="submit" style={{ padding: '5px 15px', cursor: 'pointer' }}>
            Thêm
          </button>
        </div>
      </form>

      <hr />

      {/* Câu 47: Danh sách sinh viên */}
      <h3>Danh Sách Sinh Viên</h3>
      <ul>
        {students.map((student) => (
          <li key={student._id} style={{ marginBottom: '5px' }}>
            <strong>{student.studentId}</strong> - {student.name} ({student.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
