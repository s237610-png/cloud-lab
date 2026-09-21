import { useEffect, useState } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  const fetchStudents = () => {
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    }).then(() => {
      fetchStudents();
      setForm({ studentId: '', name: '', email: '' });
    });
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1>Quản Lý Sinh Viên (MERN Docker)</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input placeholder="MSSV" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} required />
        <input placeholder="Họ tên" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <button type="submit">Thêm sinh viên</button>
      </form>
      <h3>Danh sách sinh viên:</h3>
      <ul>
        {students.map(s => (
          <li key={s._id}><strong>{s.studentId}</strong> - {s.name} ({s.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
