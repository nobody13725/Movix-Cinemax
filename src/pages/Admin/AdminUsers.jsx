import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../../lib/supabaseClient.js";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    role: "member",
    status: "Hoạt động",
    address: "",
  });

  const loadData = () => {
    setUsers(dbService.getUsers());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      fullName: "",
      email: "",
      phone: "",
      role: "member",
      status: "Hoạt động",
      address: "",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      username: u.username || "",
      fullName: u.fullName || "",
      email: u.email || "",
      phone: u.phone || "",
      role: u.role || "member",
      status: u.status || "Hoạt động",
      address: u.address || "",
    });
    setShowModal(true);
  };

  const handleToggleLock = (u) => {
    const action = u.status === "Tạm khóa" ? "mở khóa" : "khóa";
    if (window.confirm(`Bạn có chắc muốn ${action} tài khoản "${u.fullName || u.username}"?`)) {
      dbService.toggleLockUser(u.id);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn tài khoản "${name}"?`)) {
      dbService.deleteUser(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return;

    if (editingUser) {
      dbService.updateUser(editingUser.id, formData);
    } else {
      dbService.addUser(formData);
    }
    setShowModal(false);
  };

  const activeCount = users.filter((u) => u.status === "Hoạt động").length;
  const lockedCount = users.filter((u) => u.status === "Tạm khóa").length;

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  });

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Quản lý thành viên</h2>
          <p className="admin-subtitle">Danh sách người dùng và phân quyền hệ thống (UC16, Hình 36, 37)</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          + Thêm thành viên mới
        </button>
      </div>

      {/* Stats Cards matching Fig 36 */}
      <div className="admin-stat-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 }}>
        <div className="stat-card">
          <div className="stat-title">Tổng thành viên</div>
          <div className="stat-number">{users.length}</div>
          <div className="stat-trend positive">Toàn hệ thống</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Đang hoạt động</div>
          <div className="stat-number" style={{ color: "var(--green-500)" }}>{activeCount}</div>
          <div className="stat-sub">Có thể đặt vé & bình luận</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Tạm khóa</div>
          <div className="stat-number" style={{ color: "var(--red-500)" }}>{lockedCount}</div>
          <div className="stat-sub">Vi phạm hoặc spam</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-card" style={{ marginTop: 16, padding: "12px 18px" }}>
        <input
          type="text"
          className="input-control"
          placeholder="🔍 Tìm kiếm thành viên theo Tên, Username, Email hoặc SĐT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8 }}
        />
      </div>

      {/* Table Section 3.2.16 */}
      <div className="admin-card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Họ tên & Avatar</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Quyền</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "right", width: 140 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const initials = (u.fullName || u.username || "U")
                .split(" ")
                .map((n) => n[0])
                .slice(-2)
                .join("")
                .toUpperCase();

              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: u.role === "admin" ? "var(--brand-500)" : "var(--brand-100)",
                          color: u.role === "admin" ? "white" : "var(--brand-700)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {u.avatar?.length === 2 ? u.avatar : initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--ink-900)" }}>
                          {u.fullName || u.username}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--ink-500)" }}>{u.address || "Việt Nam"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: 13 }}>{u.username || "—"}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "—"}</td>
                  <td>
                    <span
                      className={`badge ${u.role === "admin" ? "badge-purple" : "badge-gray"}`}
                    >
                      {u.role === "admin" ? "Admin" : "Thành viên"}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: "var(--ink-500)" }}>
                    {u.createdAt ? u.createdAt.slice(0, 10) : "2026-01-01"}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        u.status === "Hoạt động" ? "badge-green" : "badge-red"
                      }`}
                    >
                      {u.status || "Hoạt động"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <button
                        className="icon-action-btn edit"
                        title="Sửa thành viên"
                        onClick={() => handleOpenEdit(u)}
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-action-btn"
                        title={u.status === "Tạm khóa" ? "Mở khóa tài khoản" : "Tạm khóa tài khoản"}
                        onClick={() => handleToggleLock(u)}
                        style={{
                          background: u.status === "Tạm khóa" ? "var(--green-100)" : "var(--amber-100)",
                        }}
                      >
                        {u.status === "Tạm khóa" ? "🔓" : "🔒"}
                      </button>
                      {u.role !== "admin" && (
                        <button
                          className="icon-action-btn delete"
                          title="Xóa thành viên"
                          onClick={() => handleDelete(u.id, u.fullName || u.username)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--ink-500)" }}>
                  Không tìm thấy thành viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa Thành viên */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <h3>{editingUser ? "Sửa thông tin thành viên" : "Thêm thành viên mới"}</h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
              <div>
                <label className="form-label">Họ và tên *</label>
                <input
                  required
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Tên đăng nhập</label>
                  <input
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Số điện thoại</label>
                  <input
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  required
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Phân quyền</label>
                  <select
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="member">Thành viên (Member)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Tạm khóa">Tạm khóa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Khu vực / Địa chỉ</label>
                <input
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="TP. Hồ Chí Minh, Hà Nội..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? "Cập nhật" : "Lưu thành viên"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
