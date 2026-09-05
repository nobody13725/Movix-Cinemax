import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../../lib/supabaseClient.js";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [filterReportOnly, setFilterReportOnly] = useState(true);
  const [selectedComment, setSelectedComment] = useState(null);

  const loadData = () => {
    setComments(dbService.getComments());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const handleResolve = (id, action) => {
    // action: 'delete' (duyệt gỡ bình luận) or 'dismiss' (từ chối báo cáo)
    const msg =
      action === "delete"
        ? "Bạn có chắc muốn XÓA bình luận vi phạm này?"
        : "Từ chối báo cáo và giữ lại bình luận này?";

    if (window.confirm(msg)) {
      dbService.resolveCommentReport(id, action);
      setSelectedComment(null);
    }
  };

  const reportedComments = comments.filter((c) => c.report);
  const regularComments = comments.filter((c) => !c.report);

  const displayedList = filterReportOnly ? reportedComments : comments;

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Quản lý bình luận & Báo cáo</h2>
          <p className="admin-subtitle">Kiểm duyệt đánh giá của người dùng và xử lý báo cáo vi phạm (UC17, Hình 38, 39)</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className={`btn btn-sm ${filterReportOnly ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterReportOnly(true)}
          >
            ⚠️ Bị báo cáo ({reportedComments.length})
          </button>
          <button
            className={`btn btn-sm ${!filterReportOnly ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterReportOnly(false)}
          >
            Tất cả bình luận ({comments.length})
          </button>
        </div>
      </div>

      {/* Stats Cards matching Fig 38 */}
      <div className="admin-stat-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }}>
        <div className="stat-card">
          <div className="stat-title">Chờ xử lý báo cáo</div>
          <div className="stat-number" style={{ color: "var(--red-500)" }}>{reportedComments.length}</div>
          <div className="stat-trend negative">Cần can thiệp</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Tổng bình luận</div>
          <div className="stat-number">{comments.length}</div>
          <div className="stat-sub">Đã đăng trên phim</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Đánh giá 5 sao</div>
          <div className="stat-number" style={{ color: "var(--green-500)" }}>
            {comments.filter((c) => c.rate === 5).length}
          </div>
          <div className="stat-sub">Tích cực</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Tỷ lệ hài lòng</div>
          <div className="stat-number" style={{ color: "var(--brand-500)" }}>
            {comments.length > 0
              ? Math.round(
                  (comments.reduce((a, b) => a + (b.rate || 5), 0) / comments.length / 5) * 100
                )
              : 100}
            %
          </div>
          <div className="stat-sub">Dựa trên sao đánh giá</div>
        </div>
      </div>

      {/* Comments Table Section 3.2.17 */}
      <div className="admin-card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Người bình luận</th>
              <th>Bộ phim</th>
              <th>Đánh giá</th>
              <th>Nội dung bình luận</th>
              <th>Lý do báo cáo</th>
              <th>Ngày tạo</th>
              <th style={{ textAlign: "right", width: 140 }}>Xử lý</th>
            </tr>
          </thead>
          <tbody>
            {displayedList.map((cm) => (
              <tr key={cm.id} style={{ background: cm.report ? "rgba(229,72,77,0.03)" : "transparent" }}>
                <td>
                  <div style={{ fontWeight: 700, color: "var(--ink-900)" }}>
                    {cm.userName || cm.userId}
                  </div>
                </td>
                <td style={{ fontSize: 13, color: "var(--ink-700)" }}>{cm.filmTitle || "Phim"}</td>
                <td>
                  <span style={{ color: "var(--amber-500)", fontWeight: 700 }}>
                    {"★".repeat(cm.rate || 5)}
                  </span>
                </td>
                <td style={{ maxWidth: 280 }}>
                  <div
                    style={{
                      fontSize: 13.5,
                      color: "var(--ink-900)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {cm.content}
                  </div>
                </td>
                <td>
                  {cm.report ? (
                    <div>
                      <span className="badge badge-red">Báo cáo: {cm.reportedBy || "Thành viên"}</span>
                      <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 2 }}>
                        {cm.reportReason || "Vi phạm quy tắc cộng đồng"}
                      </div>
                    </div>
                  ) : (
                    <span className="badge badge-green">Hợp lệ</span>
                  )}
                </td>
                <td style={{ fontSize: 12.5, color: "var(--ink-500)" }}>
                  {cm.createdAt ? cm.createdAt.slice(0, 10) : "2026-09-01"}
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <button
                      className="icon-action-btn view"
                      title="Xem toàn bộ nội dung"
                      onClick={() => setSelectedComment(cm)}
                    >
                      👁️
                    </button>
                    {cm.report && (
                      <>
                        <button
                          className="icon-action-btn"
                          style={{ background: "var(--green-100)", color: "#197a55" }}
                          title="Từ chối báo cáo (Giữ bình luận)"
                          onClick={() => handleResolve(cm.id, "dismiss")}
                        >
                          ✓
                        </button>
                        <button
                          className="icon-action-btn delete"
                          title="Duyệt báo cáo (Xóa bình luận vi phạm)"
                          onClick={() => handleResolve(cm.id, "delete")}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                    {!cm.report && (
                      <button
                        className="icon-action-btn delete"
                        title="Xóa bình luận"
                        onClick={() => handleResolve(cm.id, "delete")}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {displayedList.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--ink-500)" }}>
                  Không có bình luận nào cần xử lý.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết bình luận */}
      {selectedComment && (
        <div className="modal-overlay" onClick={() => setSelectedComment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <h3>Chi tiết bình luận & Đánh giá</h3>
            <div style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.6 }}>
              <p><strong>Người viết:</strong> {selectedComment.userName || selectedComment.userId}</p>
              <p><strong>Bộ phim:</strong> {selectedComment.filmTitle}</p>
              <p>
                <strong>Đánh giá:</strong>{" "}
                <span style={{ color: "var(--amber-500)", fontWeight: 700 }}>
                  {"★".repeat(selectedComment.rate || 5)} ({selectedComment.rate}/5)
                </span>
              </p>
              <div style={{ marginTop: 10, padding: 12, background: "var(--ink-50)", borderRadius: 8 }}>
                <strong>Nội dung:</strong>
                <div style={{ marginTop: 4, color: "var(--ink-900)" }}>{selectedComment.content}</div>
              </div>

              {selectedComment.report && (
                <div style={{ marginTop: 12, padding: 12, background: "var(--red-100)", borderRadius: 8, color: "#b3232a" }}>
                  <strong>Cảnh báo báo cáo vi phạm:</strong>
                  <div style={{ fontSize: 12.5, marginTop: 4 }}>
                    Người báo cáo: <strong>{selectedComment.reportedBy || "Người dùng"}</strong>
                  </div>
                  <div style={{ fontSize: 12.5 }}>Lý do: {selectedComment.reportReason}</div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              {selectedComment.report ? (
                <>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleResolve(selectedComment.id, "dismiss")}
                  >
                    Từ chối báo cáo (Giữ lại)
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: "var(--red-500)" }}
                    onClick={() => handleResolve(selectedComment.id, "delete")}
                  >
                    Duyệt báo cáo & Xóa
                  </button>
                </>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={() => setSelectedComment(null)}>
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
