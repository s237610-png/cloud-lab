import React, { useEffect, useState } from 'react';

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Cập nhật sinh viên
      fetch(`http://localhost:5000/api/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then(() => {
        fetchStudents();
        handleCancel();
      });
    } else {
      // Thêm mới sinh viên
      fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then(() => {
        fetchStudents();
        setForm({ studentId: '', name: '', email: '' });
      });
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE'
      }).then(() => fetchStudents());
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ studentId: '', name: '', email: '' });
  };

  return (
    <div style={{ backgroundColor: '#121214', color: '#ffffff', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>Quản Lý Sinh Viên</h1>

        {/* Khung Form nhập dữ liệu */}
        <div style={{ border: '1px solid #2d2d32', borderRadius: '8px', padding: '25px', backgroundColor: '#18181c', marginBottom: '30px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#e1e1e6' }}>
            {editingId ? 'Cập Nhật Thông Tin Sinh Viên' : 'Thêm Sinh Viên Mới'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input 
                placeholder="MSSV" 
                value={form.studentId} 
                onChange={e => setForm({...form, studentId: e.target.value})} 
                required 
                style={{ flex: 1, padding: '10px 12px', backgroundColor: '#29292e', border: '1px solid #323238', borderRadius: '4px', color: '#fff', outline: 'none' }}
              />
              <input 
                placeholder="Họ Và tên" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
                style={{ flex: 1.5, padding: '10px 12px', backgroundColor: '#29292e', border: '1px solid #323238', borderRadius: '4px', color: '#fff', outline: 'none' }}
              />
              <input 
                placeholder="Email" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                required 
                style={{ flex: 1.5, padding: '10px 12px', backgroundColor: '#29292e', border: '1px solid #323238', borderRadius: '4px', color: '#fff', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button 
                type="submit" 
                style={{ backgroundColor: editingId ? '#00b37e' : '#00875f', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {editingId ? 'Lưu Cập Nhật' : 'Thêm Sinh Viên'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  style={{ backgroundColor: '#7c7c8a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        <hr style={{ borderColor: '#29292e', marginBottom: '30px' }} />

        {/* Danh sách sinh viên */}
        <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#e1e1e6' }}>Danh Sách Sinh Viên</h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {students.map(s => (
            <div 
              key={s._id} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #29292e' }}
            >
              <div style={{ fontSize: '15px' }}>
                <strong style={{ color: '#fff' }}>{s.studentId}</strong> - <span style={{ color: '#c4c4cc' }}>{s.name} ({s.email})</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleEdit(s)} 
                  style={{ backgroundColor: '#fba94c', color: '#000', border: 'none', padding: '5px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(s._id)} 
                  style={{ backgroundColor: '#f75a68', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
