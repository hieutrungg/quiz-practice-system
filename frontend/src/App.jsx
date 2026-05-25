import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false); 
  const [editId, setEditId] = useState(null); // Cờ đánh dấu xem đang Sửa hay Thêm mới

  const [formData, setFormData] = useState({
    name: '',
    thumbnail: '',
    category_id: 1,
    is_featured: 0,
    owner_id: 1,
    status: 'Published',
    description: ''
  });

  useEffect(() => {
    fetchSubjects();
    // Dòng dưới đây để tắt cảnh báo gạch đỏ của ESLint
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subjects');
      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Nút bấm mở form để Thêm mới
  const handleOpenAddForm = () => {
    setEditId(null); // Đảm bảo không dính ID cũ
    setFormData({ name: '', thumbnail: '', category_id: 1, is_featured: 0, owner_id: 1, status: 'Published', description: '' });
    setShowForm(!showForm);
  };

  // Nút bấm Sửa trên từng dòng
  const handleEdit = (sub) => {
    setEditId(sub.id); // Đánh dấu đang sửa dòng này
    setFormData({
      name: sub.name,
      thumbnail: sub.thumbnail,
      category_id: sub.category_id,
      is_featured: sub.is_featured,
      owner_id: sub.owner_id,
      status: sub.status,
      description: sub.description
    });
    setShowForm(true); // Mở form ra
    window.scrollTo(0, 0); // Cuộn mượt lên đầu trang để điền form
  };

  // Gộp chung hàm Submit (Xử lý cả Thêm và Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Nếu có editId -> Gọi API Sửa (PUT)
        const response = await axios.put(`http://localhost:5000/api/subjects/${editId}`, formData);
        if (response.data.success) alert('Cập nhật môn học thành công!');
      } else {
        // Nếu không có editId -> Gọi API Thêm mới (POST)
        const response = await axios.post('http://localhost:5000/api/subjects', formData);
        if (response.data.success) alert('Thêm môn học thành công!');
      }
      
      // Thành công thì dọn dẹp form và load lại bảng
      setShowForm(false);
      setEditId(null);
      fetchSubjects();
      setFormData({ name: '', thumbnail: '', category_id: 1, is_featured: 0, owner_id: 1, status: 'Published', description: '' });
    } catch (error) {
      console.error("Lỗi khi lưu: ", error);
      alert('Đã xảy ra lỗi khi lưu!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này không?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/subjects/${id}`);
        if (response.data.success) {
          alert('Đã xóa thành công!');
          fetchSubjects(); 
        }
      } catch (error) {
        console.error("Lỗi khi xóa: ", error);
        alert('Đã xảy ra lỗi khi xóa!');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Quản lý Khóa học (Subjects)</h1>
      
      <button 
        onClick={handleOpenAddForm} 
        style={{ marginBottom: '20px', background: showForm ? '#ff9800' : '#4CAF50', color: 'white' }}
      >
        {showForm ? 'Đóng Form' : '+ Thêm Môn Học Mới'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', background: '#f9f9f9' }}>
          <h3 style={{ marginTop: 0 }}>{editId ? 'Sửa thông tin môn học:' : 'Điền thông tin môn học mới:'}</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Tên khóa học: </label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Trạng thái: </label>
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="Published">Published</option>
              <option value="Unpublished">Unpublished</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Mô tả: </label>
            <textarea 
              name="description" 
              value={formData.description || ''} 
              onChange={handleInputChange} 
              rows="3" 
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" style={{ background: 'blue', color: 'white' }}>
            {editId ? 'Cập nhật thay đổi' : 'Lưu vào Database'}
          </button>
        </form>
      )}

      <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f2f2f2', color: 'black' }}>
          <tr>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Tên Khóa Học</th>
            <th style={{ padding: '10px' }}>Trạng Thái</th>
            <th style={{ padding: '10px' }}>Mô Tả</th>
            <th style={{ padding: '10px' }}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((sub) => (
            <tr key={sub.id}>
              <td style={{ padding: '10px' }}>{sub.id}</td>
              <td style={{ padding: '10px' }}>{sub.name}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ color: sub.status === 'Published' ? 'green' : 'gray', fontWeight: 'bold' }}>
                  {sub.status}
                </span>
              </td>
              <td style={{ padding: '10px' }}>{sub.description}</td>
              <td style={{ padding: '10px' }}>
                {/* Gắn sự kiện Sửa */}
                <button onClick={() => handleEdit(sub)} style={{ marginRight: '10px', background: '#2196F3', color: 'white' }}>
                  Sửa
                </button>
                <button onClick={() => handleDelete(sub.id)} style={{ background: 'red', color: 'white' }}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;