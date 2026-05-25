const pool = require('../config/db');

// [READ] Lấy danh sách khóa học
const getAllSubjects = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM subjects');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// [CREATE] Tạo khóa học mới
const createSubject = async (req, res) => {
    try {
        const { name, thumbnail, category_id, is_featured, owner_id, status, description } = req.body;
        const [result] = await pool.query(
            'INSERT INTO subjects (name, thumbnail, category_id, is_featured, owner_id, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, thumbnail, category_id, is_featured, owner_id, status, description]
        );
        res.status(201).json({ success: true, message: 'Tạo thành công!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ trên thanh địa chỉ URL xuống
        await pool.query('DELETE FROM subjects WHERE id = ?', [id]);
        res.json({ success: true, message: 'Xóa thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
// [UPDATE] Cập nhật khóa học
const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, thumbnail, category_id, is_featured, owner_id, status, description } = req.body;
        
        await pool.query(
            'UPDATE subjects SET name=?, thumbnail=?, category_id=?, is_featured=?, owner_id=?, status=?, description=? WHERE id=?',
            [name, thumbnail, category_id, is_featured, owner_id, status, description, id]
        );
        res.json({ success: true, message: 'Cập nhật thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    getAllSubjects,
    createSubject,
    deleteSubject, updateSubject
};