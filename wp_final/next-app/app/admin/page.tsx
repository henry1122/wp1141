'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timetableMsg, setTimetableMsg] = useState<string | null>(null);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetId, setResetId] = useState('');

  async function handleImportStudents() {
    setImporting(true);
    setError(null);
    setImportResult(null);
    try {
      const res = await fetch('/api/admin/import-students', {
        method: 'GET'
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || '匯入失敗，請稍後再試。');
      } else {
        setImportResult(
          `匯入完成：新增 ${data.imported ?? 0} 筆，略過已存在 ${data.skippedExisting ?? 0} 筆。`
        );
      }
    } catch (e: any) {
      setError(e.message || '發生錯誤，請稍後再試。');
    } finally {
      setImporting(false);
    }
  }

  async function handleImportTimetable() {
    setTimetableMsg(null);
    setError(null);
    try {
      const res = await fetch('/api/admin/import-timetable', {
        method: 'POST'
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || '匯入課表失敗。');
      } else {
        setTimetableMsg(data.message || '課表已更新。');
      }
    } catch (e: any) {
      setError(e.message || '發生錯誤，請稍後再試。');
    }
  }

  async function handleResetPassword() {
    setResetMsg(null);
    setError(null);
    const studentId = resetId.trim();
    if (!studentId) return;
    try {
      const res = await fetch(`/api/admin/reset-password/${encodeURIComponent(studentId)}`, {
        method: 'POST'
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || '重設密碼失敗。');
      } else {
        setResetMsg(
          `已將學號 ${data.studentId ?? studentId} 的密碼重設為學號本身。`
        );
      }
    } catch (e: any) {
      setError(e.message || '發生錯誤，請稍後再試。');
    }
  }

  return (
    <div className="page-root">
      <div className="card">
        <div className="top-bar">
          <div>
            <div className="title">管理者後台</div>
            <div className="subtitle">
              匯入學生帳號、更新課表圖片與重設密碼。此頁面暫時未做權限管控，請勿公開網址。
            </div>
          </div>
        </div>

        {error && (
          <div className="error-text" style={{ marginBottom: '0.75rem' }}>
            {error}
          </div>
        )}

        <div className="form-row">
          <div className="form-column">
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              1. 匯入學生資料（學生資料.csv）
            </h3>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#4b5563',
                marginBottom: '0.5rem'
              }}
            >
              請先在專案根目錄放一份「學生資料.csv」，第一欄為學號、第二欄為姓名，
              之後的欄位（學校、電話、備註…）會一起寫入資料庫。再按下下面按鈕開始匯入。
            </p>
            <button
              className="button-primary"
              type="button"
              onClick={handleImportStudents}
              disabled={importing}
            >
              {importing ? '匯入中…' : '從 CSV 匯入學生帳號'}
            </button>
            {importResult && (
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#065f46'
                }}
              >
                {importResult}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              2. 匯入 / 更新課表圖片
            </h3>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#4b5563',
                marginBottom: '0.5rem'
              }}
            >
              請把最新的「課表.jpg」放在專案根目錄（與 next-app 同一層），
              然後點擊下面按鈕。系統會把檔案複製成 public/timetable.jpg，
              學生端「課表」頁面會顯示最新的圖片。
            </p>
            <button
              className="button-primary"
              type="button"
              onClick={handleImportTimetable}
            >
              更新課表圖片
            </button>
            {timetableMsg && (
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#065f46'
                }}
              >
                {timetableMsg}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              3. 重設單一學生密碼
            </h3>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#4b5563',
                marginBottom: '0.5rem'
              }}
            >
              若學生忘記密碼，可以在這裡輸入學號，系統會把該帳號的密碼重設為「學號本身」。
            </p>
            <div className="input-group">
              <label className="input-label">學號</label>
              <input
                className="input"
                type="text"
                value={resetId}
                onChange={(e) => setResetId(e.target.value)}
              />
            </div>
            <button className="button-primary" type="button" onClick={handleResetPassword}>
              重設該學號密碼
            </button>
            {resetMsg && (
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#065f46'
                }}
              >
                {resetMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





