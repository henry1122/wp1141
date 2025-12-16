'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type Lang = 'zh' | 'en';
type TabKey =
  | 'profile'
  | 'courses'
  | 'assignments'
  | 'subjects'
  | 'quiz' // 改為「錯題回顧」
  | 'grades' // 新增成績總覽
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
  teacherZh: string;
  teacherEn: string;
  scheduleZh: string;
  scheduleEn: string;
  progressZh: string;
  progressEn: string;
}

interface QuizScore {
  date: string;
  subject: string;
  title: string;
  score: number;
  total: number;
  file?: string;
  seatNo?: string;
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
    descriptionEn: 'Reading, composition, and classical Chinese basics.',
    teacherZh: '王老師',
    teacherEn: 'Ms. Wang',
    scheduleZh: '每週一、四晚間 19:00–21:00',
    scheduleEn: 'Mon & Thu 19:00–21:00',
    progressZh: '目前進度：閱讀測驗第 3 冊，作文側重段落練習與修辭。',
    progressEn: 'Now: Reading Book 3, focusing on paragraph structure and writing style.'
  },
  {
    id: 2,
    nameZh: '英文',
    nameEn: 'English',
    descriptionZh: '字彙、文法、克漏字與閱讀測驗，對接學測與指考題型。',
    descriptionEn: 'Vocabulary, grammar, cloze tests, and reading for exams.',
    teacherZh: '林老師',
    teacherEn: 'Mr. Lin',
    scheduleZh: '每週二晚間 19:00–21:00',
    scheduleEn: 'Tue 19:00–21:00',
    progressZh: '目前進度：時態總複習，準備進入閱讀測驗練習。',
    progressEn: 'Now: Tense review, moving into reading comprehension drills.'
  },
  {
    id: 3,
    nameZh: '數學',
    nameEn: 'Math',
    descriptionZh: '一次函數、二次函數、機率與幾何，強調觀念與題型整理。',
    descriptionEn: 'Functions, probability, and geometry with problem drills.',
    teacherZh: '曾老師',
    teacherEn: 'Mr. Tseng',
    scheduleZh: '每週三、六晚間 19:00–21:00',
    scheduleEn: 'Wed & Sat 19:00–21:00',
    progressZh: '目前進度：一次函數小考完成，準備進入比例與百分比單元。',
    progressEn: 'Now: Finished linear equations quiz, moving to ratio & percentage.'
  },
  {
    id: 4,
    nameZh: '物理',
    nameEn: 'Physics',
    descriptionZh: '力學、波動與電學，結合理解與計算練習。',
    descriptionEn: 'Mechanics, waves, and electricity with calculations.',
    teacherZh: '黃老師',
    teacherEn: 'Mr. Huang',
    scheduleZh: '每週五晚間 19:00–21:00',
    scheduleEn: 'Fri 19:00–21:00',
    progressZh: '目前進度：力學基礎收尾，下一階段進入簡單電路。',
    progressEn: 'Now: Wrapping up basic mechanics, next topic is simple circuits.'
  },
  {
    id: 5,
    nameZh: '化學',
    nameEn: 'Chemistry',
    descriptionZh: '化學反應式、酸鹼與氧化還原，搭配實驗觀念。',
    descriptionEn: 'Reactions, acids-bases, and redox concepts.',
    teacherZh: '邱老師',
    teacherEn: 'Ms. Chiu',
    scheduleZh: '每週日早上 09:00–11:00',
    scheduleEn: 'Sun 09:00–11:00',
    progressZh: '目前進度：化學式與配平，之後會開始酸鹼中和反應。',
    progressEn: 'Now: Chemical formulas & balancing, next is acid-base reactions.'
  },
  {
    id: 6,
    nameZh: '地科',
    nameEn: 'Earth Science',
    descriptionZh: '地球結構、氣象與天文，搭配圖表與實例說明。',
    descriptionEn: 'Earth structure, weather, and astronomy.',
    teacherZh: '簡老師',
    teacherEn: 'Ms. Chien',
    scheduleZh: '不定期加開複習班',
    scheduleEn: 'Review classes on demand',
    progressZh: '目前進度：板塊構造與地震，下一次會複習天氣圖判讀。',
    progressEn: 'Now: Plate tectonics & earthquakes, next up: reading weather maps.'
  },
  {
    id: 7,
    nameZh: '生物',
    nameEn: 'Biology',
    descriptionZh: '細胞、生理與遺傳基礎，強調圖像與概念連結。',
    descriptionEn: 'Cells, physiology, and basic genetics.',
    teacherZh: '賴老師',
    teacherEn: 'Ms. Lai',
    scheduleZh: '每週六下午 14:00–16:00',
    scheduleEn: 'Sat 14:00–16:00',
    progressZh: '目前進度：細胞構造與能量，下一單元是人體消化與循環。',
    progressEn: 'Now: Cell structure & energy, next unit: human digestion and circulation.'
  }
];

const studyTipsZh: string[] = [
  '寫完一份小考後，先標記「為什麼會錯」，比只記答案更重要。',
  '不要只看訂正，請把易錯題隔天再做一次，確認真的懂了。',
  '錯題本重點不在「抄題目」，而是把自己的想法與盲點寫下來。',
  '每次考完試，先挑出 3 題最關鍵的錯題，深度分析就好，不必全部看完。',
  '如果同一個單元錯 3 題以上，就代表觀念需要從課本或講義重新整理。'
];

const studyTipsEn: string[] = [
  'After each quiz, write down WHY you made mistakes instead of only the correct answer.',
  'Redo your wrong questions the next day to make sure the concept truly sticks.',
  'A good “error notebook” explains your thinking process, not just the model solution.',
  'After a test, pick the top 3 key mistakes and analyze them deeply rather than skimming all questions.',
  'If you have more than 3 mistakes in the same topic, go back to the textbook and rebuild the concept.'
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
  const [tab, setTab] = useState<TabKey>('subjects'); // 登入後預設顯示「課程內容」
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
  const [quizScores, setQuizScores] = useState<QuizScore[]>([]);
  const [gradesSummary, setGradesSummary] = useState<{
    overallAverage: number;
    subjectSummaries: { subject: string; count: number; average: number }[];
  } | null>(null);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [gradesError, setGradesError] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(subjects[0]?.id ?? 1);

  const todayTip = useMemo(() => {
    const tips = lang === 'zh' ? studyTipsZh : studyTipsEn;
    if (tips.length === 0) return '';
    const idx = new Date().getDate() % tips.length;
    return tips[idx];
  }, [lang]);

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

  useEffect(() => {
    async function fetchQuizScores() {
      if (!user) return;
      setGradesLoading(true);
      setGradesError(null);
      try {
        const res = await fetch('/api/quiz-scores/me', {
          credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) {
          setGradesError(data.message || '讀取小考成績失敗。');
          setQuizScores([]);
          setGradesSummary(null);
        } else {
          setQuizScores(data.scores || []);
          setGradesSummary(data.summary || null);
        }
      } catch (e: any) {
        setGradesError(e.message || '讀取小考成績時發生錯誤。');
        setQuizScores([]);
        setGradesSummary(null);
      } finally {
        setGradesLoading(false);
      }
    }

    if (user && (tab === 'grades' || tab === 'quiz')) {
      fetchQuizScores();
    }
  }, [user, tab]);

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
    tabQuiz: lang === 'zh' ? '錯題回顧' : 'Review',
    tabGrades: lang === 'zh' ? '成績分析' : 'Grades',
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

        {/* 今日小 tip */}
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            background:
              'linear-gradient(135deg, rgba(187, 247, 208, 0.4), rgba(191, 219, 254, 0.4))',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            fontSize: '0.85rem',
            color: '#065f46',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-start'
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: '0.8rem',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              background: 'rgba(22, 163, 74, 0.12)'
            }}
          >
            {lang === 'zh' ? '今日小 tip' : 'Today’s tip'}
          </span>
          <span>{todayTip}</span>
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
              className={`tab ${tab === 'grades' ? 'tab-active' : ''}`}
              onClick={() => setTab('grades')}
            >
              {t.tabGrades}
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
                {subjects.map((s) => {
                  const selected = s.id === selectedSubjectId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSubjectId(s.id)}
                      className="stat-card"
                      style={{
                        textAlign: 'left',
                        cursor: 'pointer',
                        border: selected ? '1px solid #22c55e' : undefined,
                        boxShadow: selected
                          ? '0 0 0 1px rgba(34,197,94,0.3)'
                          : undefined,
                        background: selected ? '#ecfdf3' : undefined
                      }}
                    >
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
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="form-column">
              {(() => {
                const current = subjects.find((s) => s.id === selectedSubjectId) ?? subjects[0];
                if (!current) return null;
                return (
                  <div>
                    <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                      {lang === 'zh' ? '課程細節與進度' : 'Course details & progress'}
                    </h3>
                    <div className="stat-card" style={{ marginBottom: '0.75rem' }}>
                      <div className="stat-label">
                        {lang === 'zh' ? '授課老師' : 'Teacher'}
                      </div>
                      <div className="stat-value" style={{ fontSize: '1rem' }}>
                        {lang === 'zh' ? current.teacherZh : current.teacherEn}
                      </div>
                    </div>
                    <div className="stat-card" style={{ marginBottom: '0.75rem' }}>
                      <div className="stat-label">
                        {lang === 'zh' ? '上課時間' : 'Schedule'}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                        {lang === 'zh' ? current.scheduleZh : current.scheduleEn}
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">
                        {lang === 'zh' ? '目前進度' : 'Current progress'}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.6 }}>
                        {lang === 'zh' ? current.progressZh : current.progressEn}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <div className="form-row">
            <div className="form-column">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                {lang === 'zh' ? '錯題回顧' : 'Wrong-question review'}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#4b5563',
                  marginBottom: '0.75rem'
                }}
              >
                {lang === 'zh'
                  ? '下面依照每一次小考的得分，幫你標記出「容易失分」的場次，當作錯題回顧的重點清單。資料直接從 week6_test 裡的小考 CSV 匯入。'
                  : 'Each quiz below is marked to highlight where you lost more points, based on real CSV score data.'}
              </p>
              {gradesLoading && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}
                >
                  {lang === 'zh' ? '小考成績載入中…' : 'Loading quiz scores...'}
                </div>
              )}
              {gradesError && (
                <div className="error-text" style={{ marginBottom: '0.75rem' }}>
                  {gradesError}
                </div>
              )}
              {!gradesLoading && quizScores.length === 0 && !gradesError && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    marginBottom: '0.75rem'
                  }}
                >
                  {lang === 'zh'
                    ? '目前找不到任何小考成績。請確認 week6_test 中的 CSV 是否已放在專案根目錄。'
                    : 'No quiz scores found. Please check that CSV files in week6_test are available.'}
                </div>
              )}
              {quizScores.length > 0 && (
                <div className="students-list">
                  <div className="student-row student-header">
                    <div>{lang === 'zh' ? '日期' : 'Date'}</div>
                    <div>{lang === 'zh' ? '科目 / 測驗' : 'Subject / Quiz'}</div>
                    <div>{lang === 'zh' ? '得分' : 'Score'}</div>
                    <div>{lang === 'zh' ? '錯題重點 / 建議' : 'Focus / Suggestion'}</div>
                  </div>
                  {quizScores.map((s, idx) => {
                    const rate = s.score / s.total;
                    let suggestionZh: string;
                    let suggestionEn: string;
                    if (rate >= 0.9) {
                      suggestionZh = '這次幾乎沒失分，可以把題目當成考前複習題庫。';
                      suggestionEn =
                        'Very few mistakes; treat this quiz as a review question bank.';
                    } else if (rate >= 0.75) {
                      suggestionZh =
                        '有一些粗心或觀念小洞，建議把錯題依「題型」整理，找出共通盲點。';
                      suggestionEn =
                        'Some careless or small concept gaps; group wrong questions by type and look for patterns.';
                    } else {
                      suggestionZh =
                        '這次屬於「錯題核心清單」，下次考前務必重做同單元題目，並在錯題本寫下為什麼會錯。';
                      suggestionEn =
                        'This quiz should go into your core error list; redo similar questions before the next exam and write down WHY you missed them.';
                    }
                    return (
                      <div key={`${s.title}-${idx}`} className="student-row">
                        <div>{s.date || '-'}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{s.subject}</div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#6b7280'
                            }}
                          >
                            {s.title}
                          </div>
                        </div>
                        <div>
                          <span style={{ fontWeight: 600 }}>
                            {s.score}/{s.total}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                          {lang === 'zh' ? suggestionZh : suggestionEn}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'grades' && (
          <div className="form-row">
            <div className="form-column">
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                {lang === 'zh' ? '小考成績與趨勢' : 'Quiz scores & trend'}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#4b5563',
                  marginBottom: '0.75rem'
                }}
              >
                {lang === 'zh'
                  ? '這裡從 week6_test 裡的小考 CSV 把你的成績全部抓出來，幫你看平均表現與各科弱點。'
                  : 'This view reads all your quiz scores from the CSV files and summarizes trends and weak spots.'}
              </p>
              {gradesLoading && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}
                >
                  {lang === 'zh' ? '小考成績載入中…' : 'Loading quiz scores...'}
                </div>
              )}
              {gradesError && (
                <div className="error-text" style={{ marginBottom: '0.75rem' }}>
                  {gradesError}
                </div>
              )}
              {!gradesLoading && quizScores.length === 0 && !gradesError && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    marginBottom: '0.75rem'
                  }}
                >
                  {lang === 'zh'
                    ? '目前沒有讀到任何小考成績，老師可以把 CSV 放到專案根目錄的 week6_test 資料夾。'
                    : 'No quiz scores found. Please place CSV files into the week6_test folder at project root.'}
                </div>
              )}
              {quizScores.length > 0 && (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 2fr)',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                      alignItems: 'center'
                    }}
                  >
                    {/* 大圓形平均得分率 */}
                    <div
                      className="stat-card"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.25rem'
                      }}
                    >
                      {(() => {
                        const pct = gradesSummary?.overallAverage ?? 0;
                        const angle = pct * 3.6;
                        return (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <div
                              style={{
                                width: 140,
                                height: 140,
                                borderRadius: '50%',
                                background: `conic-gradient(#22c55e ${angle}deg, #e5e7eb 0deg)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                              }}
                            >
                              <div
                                style={{
                                  width: 100,
                                  height: 100,
                                  borderRadius: '50%',
                                  background: 'white',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: 'inset 0 0 0 1px #e5e7eb'
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '0.8rem',
                                    color: '#6b7280',
                                    marginBottom: '0.15rem'
                                  }}
                                >
                                  {lang === 'zh' ? '平均得分率' : 'Average'}
                                </div>
                                <div
                                  style={{
                                    fontSize: '1.6rem',
                                    fontWeight: 700,
                                    color: '#16a34a'
                                  }}
                                >
                                  {pct}
                                  <span style={{ fontSize: '0.85rem' }}>%</span>
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: '0.8rem',
                                color: '#4b5563',
                                textAlign: 'center'
                              }}
                            >
                              {lang === 'zh'
                                ? '這個圓圈代表你在所有小考中的整體表現。綠色越滿，離目標越近。'
                                : 'This circle shows your overall performance across all quizzes.'}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* 各科平均卡片 */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '0.75rem'
                      }}
                    >
                      {gradesSummary?.subjectSummaries?.map((s) => (
                        <div key={s.subject} className="stat-card">
                          <div className="stat-label">
                            {lang === 'zh' ? `${s.subject} 平均` : `Avg ${s.subject}`}
                          </div>
                          <div
                            className="stat-value"
                            style={{ fontSize: '0.95rem', marginBottom: '0.15rem' }}
                          >
                            {s.average}
                            <span style={{ fontSize: '0.8rem' }}>%</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {lang === 'zh'
                              ? `共 ${s.count} 次小考`
                              : `${s.count} quizzes`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                    <div className="students-list">
                      <div className="student-row student-header">
                        <div>{lang === 'zh' ? '日期' : 'Date'}</div>
                        <div>{lang === 'zh' ? '科目 / 測驗' : 'Subject / Quiz'}</div>
                        <div>{lang === 'zh' ? '得分' : 'Score'}</div>
                        <div>{lang === 'zh' ? '備註' : 'Note'}</div>
                      </div>
                      {quizScores.map((s, idx) => (
                        <div key={`${s.title}-${idx}`} className="student-row">
                          <div>{s.date}</div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{s.subject}</div>
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: '#6b7280'
                              }}
                            >
                              {s.title}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontWeight: 600 }}>
                              {s.score}/{s.total}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                            {(() => {
                              const rate = s.score / s.total;
                              if (rate >= 0.9) {
                                return lang === 'zh'
                                  ? '表現很好，維持複習節奏即可。'
                                  : 'Great performance, just keep your review pace.';
                              }
                              if (rate >= 0.75) {
                                return lang === 'zh'
                                  ? '略有小失誤，可以從錯題中找出共通觀念。'
                                  : 'A few mistakes; look for common concepts among wrong questions.';
                              }
                              return lang === 'zh'
                                ? '這次可以特別整理錯題，建議下次考前多做一次同類型題目。'
                                : 'Use this quiz to build your error list and redo similar questions before the next test.';
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
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