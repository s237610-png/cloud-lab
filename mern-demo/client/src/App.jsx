import { useEffect, useState } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // State quản lý sinh viên đang được chọn để Sửa
  const [editingId, setEditingId] = useState(null);

  // Câu 47: Lấy danh sách sinh viên từ Backend API (GET /api/students)
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

  // Xử lý Thêm mới (POST) hoặc Cập nhật (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // CÂU 61: Cập nhật thông tin sinh viên (PUT /api/students/:id)
        const response = await fetch(`/api/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, name, email }),
        });

        if (response.ok) {
          setEditingId(null); // Thoát chế độ sửa
        }
      } else {
        // CÂU 49: Thêm sinh viên mới (POST /api/students)
        await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, name, email }),
        });
      }

      // Reset form nhập
      setStudentId('');
      setName('');
      setEmail('');
      
      // CÂU 63: Cập nhật lại danh sách sinh viên
      fetchStudents();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  // CÂU 62: Xóa sinh viên (DELETE /api/students/:id)
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        const response = await fetch(`/api/students/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchStudents(); // Cập nhật lại danh sách sau khi xóa
        }
      } catch (error) {
        console.error('Lỗi khi xóa sinh viên:', error);
      }
    }
  };

  // Đưa dữ liệu sinh viên lên Form để chỉnh sửa
  const handleEditClick = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  // Hủy chế độ chỉnh sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setStudentId('');
    setName('');
    setEmail('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Quản Lý Sinh Viên</h2>

      {/* Form thêm / cập nhật sinh viên */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #444', borderRadius: '8px' }}>
        <h3>{editingId ? 'Cập Nhật Thông Tin Sinh Viên' : 'Thêm Sinh Viên Mới'}</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Mã sinh viên (MSSV)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            style={{ marginRight: '10px', padding: '6px' }}
          />
          <input
            type="text"
            placeholder="Họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginRight: '10px', padding: '6px' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginRight: '10px', padding: '6px' }}
          />
          <button 
            type="submit" 
            style={{ 
              padding: '6px 15px', 
              cursor: 'pointer', 
              backgroundColor: editingId ? '#28a745' : '#007bff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px' 
            }}
          >
            {editingId ? 'Lưu Cập Nhật' : 'Thêm'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{ marginLeft: '8px', padding: '6px 12px', cursor: 'pointer' }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <hr />

      {/* Danh sách sinh viên hiển thị nút Sửa và Xóa */}
      <h3>Danh Sách Sinh Viên</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {students.map((student) => (
          <li
            key={student._id}
            style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #333'
            }}
          >
            <span>
              <strong>{student.studentId}</strong> - {student.name} ({student.email})
            </span>
            <div>
              <button
                onClick={() => handleEditClick(student)}
                style={{
                  marginRight: '8px',
                  padding: '4px 10px',
                  backgroundColor: '#ffc107',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(student._id)}
                style={{
                  padding: '4px 10px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
