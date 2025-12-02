'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';

type Lang = 'zh' | 'en';
type TabKey =
  | 'profile'
  | 'courses'
  | 'assignments'
  | 'subjects'
  | 'quiz'
  | 'tutoring';

interface User {
  id: number;
  studentId: string;
  name?: string;
}

interface StudentProfile {
  studentId: string;
  name: string;
  juniorHigh?: string;
  seniorHigh?: string;
  className?: string;
  seatNo?: string;
  phone1?: string;
  fatherPhone?: string;
  motherPhone?: string;
  studentPhone?: string;
  notifySms?: string;
  enrollDate?: string;
  quitDate?: string;
}

interface ClassItem {
  id: number;
  title: string;
  teacher?: string;
  room?: string;
  weekday: number;
  startTime: string;
  endTime: string;
}

interface TutoringSlot {
  id: number;
  weekday: number;
  time: string; // '19:00'
  studentId: string;
  studentName?: string;
}

const weekdaysZh = ['一', '二', '三', '四', '五', '六', '日'];

interface AssignmentItem {
  id: number;
  course: string;
  title: string;
  dueLabelZh: string;
  dueLabelEn: string;
  points?: number;
  status: 'open' | 'submitted' | 'closed';
}

interface SubjectCourse {
  id: number;
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
}

const assignmentsToday: AssignmentItem[] = [
  {
    id: 1,
    course: '網路服務程式設計',
    title: '期末專題分組名單確認',
    dueLabelZh: '今天・23:59 截止',
    dueLabelEn: 'Today · due 23:59',
    points: 0,
    status: 'open'
  }
];

const assignmentsUpcoming: AssignmentItem[] = [
  {
    id: 2,
    course: '英文',
    title: 'Assignment 9 閱讀練習',
    dueLabelZh: '明天・23:59 截止',
    dueLabelEn: 'Tomorrow · due 23:59',
    points: 10,
    status: 'open'
  },
  {
    id: 3,
    course: '數學',
    title: '一次函數練習卷',
    dueLabelZh: '本週五・上課前繳交',
    dueLabelEn: 'Friday · before class',
    points: 20,
    status: 'open'
  }
];

const subjects: SubjectCourse[] = [
  {
    id: 1,
    nameZh: '國文',
    nameEn: 'Chinese',
    descriptionZh: '閱讀理解、寫作與國學常識，加強段落結構與閱讀速度。',
    descriptionEn: 'Reading, composition, and classical Chinese basics.'
  },
  {
    id: 2,
    nameZh: '英文',
    nameEn: 'English',
    descriptionZh: '字彙、文法、克漏字與閱讀測驗，對接學測與指考題型。',
    descriptionEn: 'Vocabulary, grammar, cloze tests, and reading for exams.'
  },
  {
    id: 3,
    nameZh: '數學',
    nameEn: 'Math',
    descriptionZh: '一次函數、二次函數、機率與幾何，強調觀念與題型整理。',
    descriptionEn: 'Functions, probability, and geometry with problem drills.'
  },
  {
    id: 4,
    nameZh: '物理',
    nameEn: 'Physics',
    descriptionZh: '力學、波動與電學，結合理解與計算練習。',
    descriptionEn: 'Mechanics, waves, and electricity with calculations.'
  },
  {
    id: 5,
    nameZh: '化學',
    nameEn: 'Chemistry',
    descriptionZh: '化學反應式、酸鹼與氧化還原，搭配實驗觀念。',
    descriptionEn: 'Reactions, acids-bases, and redox concepts.'
  },
  {
    id: 6,
    nameZh: '地科',
    nameEn: 'Earth Science',
    descriptionZh: '地球結構、氣象與天文，搭配圖表與實例說明。',
    descriptionEn: 'Earth structure, weather, and astronomy.'
  },
  {
    id: 7,
    nameZh: '生物',
    nameEn: 'Biology',
    descriptionZh: '細胞、生理與遺傳基礎，強調圖像與概念連結。',
    descriptionEn: 'Cells, physiology, and basic genetics.'
  }
];

const quizSets = [
  {
    id: 1,
    zhTitle: '基礎一次方程式',
    enTitle: 'Basic equations',
    questionsZh: [
      '若 2x + 3 = 11，x 等於多少？',
      '一支鉛筆 12 元，買 5 支要多少錢？',
      '若 3x - 5 = 16，x 等於多少？'
    ],
    questionsEn: [
      'If 2x + 3 = 11, what is x?',
      'A pencil costs 12 dollars. How much for 5 pencils?',
      'If 3x - 5 = 16, what is x?'
    ]
  },
  {
    id: 2,
    zhTitle: '時間與行程',
    enTitle: 'Time & schedule',
    questionsZh: [
      '一堂課 50 分鐘，連上兩堂中間休息 10 分鐘，總共花多少時間？',
      '上課時間為 18:30～20:10，總共上課幾分鐘？',
      '今天是週三，你每週一與週四有補習，下一次上課是星期幾？'
    ],
    questionsEn: [
      'One class is 50 minutes, with 10 minutes break between two classes. Total time?',
      'Class is from 18:30 to 20:10. How many minutes long is it?',
      'Today is Wednesday; you have classes on Monday and Thursday. What is the next class day?'
    ]
  },
  {
    id: 3,
    zhTitle: '比例與百分比',
    enTitle: 'Ratio & percentage',
    questionsZh: [
      '一張考卷共有 25 題，每題 4 分，要拿到 80 分至少要答對幾題？',
      '一個班有 40 人，其中 10 人沒交作業，沒交作業佔全班的幾分之幾？幾％？',
      '一件外套原價 1,600 元，打 8 折後多少錢？'
    ],
    questionsEn: [
      'A test has 25 questions, 4 points each. How many correct answers are needed for 80 points?',
      'In a class of 40 students, 10 did not hand in homework. What fraction and percentage is that?',
      'A jacket costs 1,600. After 20% off, how much does it cost?'
    ]
  },
  {
    id: 4,
    zhTitle: '生活應用題',
    enTitle: 'Word problems',
    questionsZh: [
      '某數除以 5 的商是 18 餘數是 3，這個數是多少？',
      '小明每天花 30 分鐘寫功課，5 天共花多少時間？',
      '一間教室可以坐 28 人，補習班共有 6 間教室，最多可容納幾人？'
    ],
    questionsEn: [
      'A number divided by 5 gives quotient 18 and remainder 3. What is the number?',
      'Ming spends 30 minutes on homework every day. How long in total for 5 days?',
      'A classroom seats 28 students. The cram school has 6 classrooms. What is the maximum capacity?'
    ]
  }
];

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('zh');
  const [tab, setTab] = useState<TabKey>('profile');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [pwOld, setPwOld] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [tutoringSlots, setTutoringSlots] = useState<TutoringSlot[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);

  async function fetchMe() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch {}
  }

  async function fetchData() {
    if (!user) return;
    const [pRes, cRes, tRes] = await Promise.all([
      fetch('/api/profile/me', { credentials: 'include' }),
      fetch('/api/classes', { credentials: 'include' }),
      fetch('/api/tutoring', { credentials: 'include' })
    ]);
    if (pRes.ok) {
      const p: StudentProfile = await pRes.json();
      setProfile(p);
    }
    if (cRes.ok) setClasses(await cRes.json());
    if (tRes.ok) setTutoringSlots(await tRes.json());
  }

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const t = {
    title: lang === 'zh' ? '補習班管理系統' : 'Cram School Manager',
    subtitle:
      lang === 'zh'
        ? '學號登入，查看個人資訊與課表。'
        : 'Login with student ID to see your info and classes.',
    login: lang === 'zh' ? '登入' : 'Login',
    email: lang === 'zh' ? '學號' : 'Student ID',
    password: lang === 'zh' ? '密碼' : 'Password',
    name: lang === 'zh' ? '姓名（選填）' : 'Name (optional)',
    logout: lang === 'zh' ? '登出' : 'Logout',
    langLabel: lang === 'zh' ? '中文 / English' : 'English / 中文',
    classesCount: lang === 'zh' ? '目前班級數' : 'Classes count',
    tabProfile: lang === 'zh' ? '個人資料' : 'Profile',
    tabCourses: lang === 'zh' ? '課表' : 'Timetable',
    tabAssignments: lang === 'zh' ? '課程作業' : 'Assignments',
    tabSubjects: lang === 'zh' ? '課程內容' : 'Subjects',
    tabQuiz: lang === 'zh' ? '小測驗' : 'Quiz',
    tabTutoring: lang === 'zh' ? '輔導時間' : 'Tutoring'
  };

  async function handleAuthSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const body = { studentId, password };
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Request failed');
      } else {
        const data = await res.json();
        setUser(data);
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
    setClasses([]);
  }

  async function handleChangePassword() {
    setPwMessage(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPassword: pwOld, newPassword: pwNew })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setPwMessage(data.message || 'Failed to change password');
      } else {
        setPwMessage(
          lang === 'zh'
            ? '密碼已更新，下次登入請使用新密碼。'
            : 'Password updated. Use it next time you log in.'
        );
        setPwOld('');
        setPwNew('');
      }
    } catch (e: any) {
      setPwMessage(e.message || 'Network error');
    }
  }

  const weekdayLabels = weekdaysZh;

  if (!user) {
    return (
      <div className="page-root">
        <div className="card">
          <div className="top-bar">
            <div>
              <div className="title">{t.title}</div>
              <div className="subtitle">{t.subtitle}</div>
            </div>
            <div className="top-actions">
              <span
                className="lang-toggle"
                onClick={() => setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))}
              >
                {t.langLabel}
              </span>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit}>
            <div className="input-group">
              <label className="input-label">{t.email}</label>
              <input
                className="input"
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">{t.password}</label>
              <input
                className="input"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                marginBottom: '0.75rem'
              }}
            >
              {lang === 'zh'
                ? '初始密碼 = 學號。第一次登入後請到個人頁面更新密碼。'
                : 'Initial password is your Student ID. Please change it after first login.'}
            </div>

            {error && <div className="error-text">{error}</div>}

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="button-primary" type="submit" disabled={loading}>
                {loading ? '...' : t.login}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-root">
      <div className="card">
        <div className="top-bar">
          <div>
            <div className="title">
              {lang === 'zh' ? '個人頁面' : 'My page'} – {user.name || user.studentId}
            </div>
            <div className="subtitle">
              {lang === 'zh'
                ? `學號：${user.studentId}`
                : `Student ID: ${user.studentId}`}
            </div>
          </div>
          <div className="top-actions">
            <span
              className="lang-toggle"
              onClick={() => setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))}
            >
              {t.langLabel}
            </span>
            <span className="chip">{lang === 'zh' ? '已登入' : 'Signed in'}</span>
            <button className="pill-button" onClick={handleLogout}>
              {t.logout}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <div className="tabs-nav">
            <button
              className={`tab ${tab === 'profile' ? 'tab-active' : ''}`}
              onClick={() => setTab('profile')}
            >
              {t.tabProfile}
            </button>
            <button
              className={`tab ${tab === 'courses' ? 'tab-active' : ''}`}
              onClick={() => setTab('courses')}
            >
              {t.tabCourses}
            </button>
            <button
              className={`tab ${tab === 'assignments' ? 'tab-active' : ''}`}
              onClick={() => setTab('assignments')}
            >
              {t.tabAssignments}
            </button>
            <button
              className={`tab ${tab === 'subjects' ? 'tab-active' : ''}`}
              onClick={() => setTab('subjects')}
            >
              {t.tabSubjects}
            </button>
            <button
              className={`tab ${tab === 'quiz' ? 'tab-active' : ''}`}
              onClick={() => setTab('quiz')}
            >
              {t.tabQuiz}
            </button>
            <button
              className={`tab ${tab === 'tutoring' ? 'tab-active' : ''}`}
              onClick={() => setTab('tutoring')}
            >
              {t.tabTutoring}
            </button>
          </div>
        </div>

        {tab === 'profile' && (
          <div className="form-row">
            <div className="form-column">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                {lang === 'zh' ? '個人資料' : 'Profile'}
              </h3>
              <div className="stat-card">
                <div className="stat-label">
                  {lang === 'zh' ? '姓名' : 'Name'}
                </div>
                <div className="stat-value">{profile?.name || user.name || '-'}</div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '學號' : 'Student ID'}
                </div>
                <div className="stat-value">{user.studentId}</div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '國中' : 'Junior high'}
                </div>
                <div className="stat-value">{profile?.juniorHigh || '-'}</div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '高中' : 'Senior high'}
                </div>
                <div className="stat-value">{profile?.seniorHigh || '-'}</div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '班別' : 'Class'}
                </div>
                <div className="stat-value">{profile?.className || '-'}</div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '座號' : 'Seat no.'}
                </div>
                <div className="stat-value">{profile?.seatNo || '-'}</div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '電話1' : 'Phone'}
                </div>
                <div className="stat-value">{profile?.phone1 || '-'}</div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '爸爸手機' : 'Father'}
                </div>
                <div className="stat-value">{profile?.fatherPhone || '-'}</div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '媽媽手機' : 'Mother'}
                </div>
                <div className="stat-value">{profile?.motherPhone || '-'}</div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '學生手機' : 'Student mobile'}
                </div>
                <div className="stat-value">
                  {profile?.studentPhone || '-'}
                </div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '上課發簡訊' : 'Notify by SMS'}
                </div>
                <div className="stat-value">{profile?.notifySms || '-'}</div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '報名日期' : 'Enroll date'}
                </div>
                <div className="stat-value">{profile?.enrollDate || '-'}</div>
              </div>
              <div className="stat-card" style={{ marginTop: '0.75rem' }}>
                <div className="stat-label">
                  {lang === 'zh' ? '不上了日期' : 'Quit date'}
                </div>
                <div className="stat-value">{profile?.quitDate || '-'}</div>
              </div>
            </div>

            <div className="form-column">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                {lang === 'zh' ? '修改密碼' : 'Change password'}
              </h3>
              <div className="input-group">
                <label className="input-label">
                  {lang === 'zh' ? '舊密碼' : 'Current password'}
                </label>
                <input
                  className="input"
                  type="password"
                  value={pwOld}
                  onChange={(e) => setPwOld(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">
                  {lang === 'zh' ? '新密碼' : 'New password'}
                </label>
                <input
                  className="input"
                  type="password"
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                />
              </div>
              {pwMessage && <div className="error-text">{pwMessage}</div>}
              <button
                className="button-primary"
                type="button"
                onClick={handleChangePassword}
              >
                {lang === 'zh' ? '更新密碼' : 'Update password'}
              </button>
            </div>
          </div>
        )}

        {tab === 'courses' && (
          <div className="form-row">
            <div className="form-column">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                {lang === 'zh' ? '班級課表' : 'Timetable'}
              </h3>
              <div
                style={{
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  border: '1px solid #bbf7d0',
                  background: '#ecfdf3'
                }}
              >
                <Image
                  src="/timetable.jpg"
                  alt="課表"
                  width={900}
                  height={600}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  unoptimized
                />
              </div>
            </div>
          </div>
        )}

        {tab === 'assignments' && (
          <div className="form-row">
            <div className="form-column">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                {lang === 'zh' ? '課程作業總覽' : 'Assignments overview'}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#4b5563',
                  marginBottom: '0.75rem'
                }}
              >
                {lang === 'zh'
                  ? '依時間列出近期作業與公告，方便同學掌握 deadline 與分數。'
                  : 'See upcoming assignments with deadlines and points.'}
              </p>

              <div className="students-list">
                <div className="student-row student-header">
                  <div>{lang === 'zh' ? '日期 / 課程' : 'Date / Course'}</div>
                  <div>{lang === 'zh' ? '作業' : 'Assignment'}</div>
                  <div>{lang === 'zh' ? '截止 / 分數' : 'Due / Points'}</div>
                  <div>{lang === 'zh' ? '狀態' : 'Status'}</div>
                </div>

                {assignmentsToday.map((a) => (
                  <div key={a.id} className="student-row">
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {lang === 'zh' ? '今天' : 'Today'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                        {a.course}
                      </div>
                    </div>
                    <div>{a.title}</div>
                    <div>{lang === 'zh' ? a.dueLabelZh : a.dueLabelEn}</div>
                    <div>{lang === 'zh' ? '未交' : 'Open'}</div>
                  </div>
                ))}

                {assignmentsUpcoming.map((a) => (
                  <div key={a.id} className="student-row">
                    <div>
                      <div style={{ fontWeight: 600, color: '#374151' }}>
                        {a.id === 2
                          ? lang === 'zh'
                            ? '明天'
                            : 'Tomorrow'
                          : lang === 'zh'
                            ? '本週'
                            : 'This week'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                        {a.course}
                      </div>
                    </div>
                    <div>{a.title}</div>
                    <div>{lang === 'zh' ? a.dueLabelZh : a.dueLabelEn}</div>
                    <div>{lang === 'zh' ? '未交' : 'Open'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'subjects' && (
          <div className="form-row">
            <div className="form-column">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                {lang === 'zh' ? '課程內容介紹' : 'Subjects'}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#4b5563',
                  marginBottom: '0.75rem'
                }}
              >
                {lang === 'zh'
                  ? '目前開課科目與簡要說明，老師可在此補充各科上課重點與進度。'
                  : 'Overview of subjects currently offered and what they cover.'}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem'
                }}
              >
                {subjects.map((s) => (
                  <div key={s.id} className="stat-card">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}
                    >
                      <div className="stat-value" style={{ fontSize: '1.1rem' }}>
                        {s.nameZh}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          fontWeight: 500
                        }}
                      >
                        {s.nameEn}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#4b5563',
                        lineHeight: 1.5
                      }}
                    >
                      {lang === 'zh' ? s.descriptionZh : s.descriptionEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <div className="form-row">
            <div className="form-column">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                {lang === 'zh' ? '課後小測驗' : 'After-class quiz'}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#4b5563',
                  marginBottom: '0.75rem'
                }}
              >
                {lang === 'zh'
                  ? '系統會隨機顯示一組題目，按「下一題」可以換一組。'
                  : 'The system shows a random set of practice questions. Click "Next" for another set.'}
              </p>
              <div className="students-list">
                <div className="student-row">
                  <div style={{ gridColumn: '1 / -1' }}>
                    {(() => {
                      const set = quizSets[quizIndex % quizSets.length];
                      const qs =
                        lang === 'zh' ? set.questionsZh : set.questionsEn;
                      return (
                        <>
                          <div
                            style={{
                              fontWeight: 600,
                              marginBottom: '0.5rem'
                            }}
                          >
                            {lang === 'zh' ? set.zhTitle : set.enTitle}
                          </div>
                          <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
                            {qs.map((q) => (
                              <li key={q}>{q}</li>
                            ))}
                          </ol>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <button
                className="button-primary"
                type="button"
                style={{ marginTop: '0.75rem' }}
                onClick={() => setQuizIndex((i) => i + 1)}
              >
                {lang === 'zh' ? '下一組題目' : 'Next questions'}
              </button>
            </div>
          </div>
        )}

        {tab === 'tutoring' && (
          <div className="form-row">
            <div className="form-column">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                {lang === 'zh' ? '可預約輔導時間' : 'Tutoring slots'}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#4b5563',
                  marginBottom: '0.75rem'
                }}
              >
                {lang === 'zh'
                  ? '點選綠色「可預約」即可預約該時段；若顯示紅色「已預約」，只有該同學本人可以取消。'
                  : 'Click the green "Available" button to reserve; red "Reserved" slots can only be cancelled by the student who reserved them.'}
              </p>
              <div className="students-list">
                <div className="student-row student-header">
                  <div>{lang === 'zh' ? '星期' : 'Day'}</div>
                  <div>{lang === 'zh' ? '時間' : 'Time'}</div>
                  <div>{lang === 'zh' ? '內容' : 'Type'}</div>
                  <div>{lang === 'zh' ? '狀態' : 'Status'}</div>
                </div>
                {weekdayLabels.slice(0, 5).map((w, idx) => {
                  const dayIndex = idx + 1; // 1~5
                  const time = '19:00';
                  const slot = tutoringSlots.find(
                    (s) => s.weekday === dayIndex && s.time === time
                  );
                  const reservedByMe =
                    slot && slot.studentId === user.studentId;
                  const reservedByOther =
                    slot && slot.studentId !== user.studentId;
                  const label = lang === 'zh' ? `週${w}` : `Day ${dayIndex}`;
                  return (
                    <div key={dayIndex} className="student-row">
                      <div>{label}</div>
                      <div>19:00 – 20:00</div>
                      <div>{lang === 'zh' ? '個別輔導' : '1:1 tutoring'}</div>
                      <div>
                        {reservedByOther ? (
                          <span
                            style={{
                              color: '#b91c1c',
                              fontSize: '0.85rem',
                              fontWeight: 600
                            }}
                          >
                            {lang === 'zh' ? '已預約' : 'Reserved'}
                          </span>
                        ) : (
                          <button
                            className={`pill-button ${
                              reservedByMe ? 'pill-button-danger' : ''
                            }`}
                            type="button"
                            style={{
                              background: reservedByMe ? '#fee2e2' : '#dcfce7',
                              color: reservedByMe ? '#b91c1c' : '#166534'
                            }}
                            onClick={async () => {
                              if (reservedByMe) {
                                // cancel
                                const res = await fetch('/api/tutoring', {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  credentials: 'include',
                                  body: JSON.stringify({
                                    weekday: dayIndex,
                                    time
                                  })
                                });
                                if (res.ok || res.status === 204) {
                                  setTutoringSlots((prev) =>
                                    prev.filter(
                                      (s) =>
                                        !(
                                          s.weekday === dayIndex &&
                                          s.time === time
                                        )
                                    )
                                  );
                                }
                              } else {
                                // reserve
                                const res = await fetch('/api/tutoring', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  credentials: 'include',
                                  body: JSON.stringify({
                                    weekday: dayIndex,
                                    time
                                  })
                                });
                                if (res.ok) {
                                  const slotCreated: TutoringSlot =
                                    await res.json();
                                  setTutoringSlots((prev) => [
                                    ...prev.filter(
                                      (s) =>
                                        !(
                                          s.weekday === dayIndex &&
                                          s.time === time
                                        )
                                    ),
                                    slotCreated
                                  ]);
                                }
                              }
                            }}
                          >
                            {reservedByMe
                              ? lang === 'zh'
                                ? '已預約（點擊取消）'
                                : 'Reserved (click to cancel)'
                              : lang === 'zh'
                                ? '可預約'
                                : 'Available'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}