const fs = require('fs');
const csv = require('csv-parser');

console.log('開始優化課程數據...');

const courses = [];
const seen = new Set();

fs.createReadStream('hw3-ntucourse-data-1002.csv')
  .pipe(csv())
  .on('data', (row) => {
    // 只處理有效的課程數據
    if (row.cou_cname && row.cou_cname.trim() !== '') {
      const courseId = `${row.cou_code}_${row.class || '01'}`;
      
      // 避免重複數據
      if (!seen.has(courseId)) {
        seen.add(courseId);
        
        const course = {
          course_id: courseId,
          course_name: row.cou_cname.trim(),
          department: row.dpt_abbr || 'Unknown',
          credits: parseInt(row.credit) || 0,
          time_slot: formatTimeSlot(row),
          classroom: formatClassroom(row),
          instructor: (row.tea_cname || row.tea_ename || 'TBA').trim(),
          description: generateDescription(row),
          prerequisites: row.pre_course || '無',
          max_students: parseInt(row.limit) || 0,
          current_enrollment: parseInt(row.eno) || 0
        };
        
        courses.push(course);
      }
    }
  })
  .on('end', () => {
    console.log(`優化完成！從原始數據中提取了 ${courses.length} 門唯一課程`);
    
    // 生成優化後的課程 CSV
    const coursesCSV = generateCoursesCSV(courses);
    fs.writeFileSync('ntu-course-selector/public/data/courses-optimized.csv', coursesCSV, 'utf8');
    
    console.log(`優化後的課程數據已保存到: ntu-course-selector/public/data/courses-optimized.csv`);
    console.log(`文件大小減少約 ${Math.round((1 - courses.length / 10000) * 100)}%`);
  })
  .on('error', (err) => {
    console.error('處理數據時發生錯誤:', err);
  });

function formatTimeSlot(row) {
  const timeSlots = [];
  
  // 處理多個時間段
  for (let i = 1; i <= 6; i++) {
    const st = row[`st${i}`];
    const day = row[`day${i}`];
    
    if (st && day && st !== '' && day !== '') {
      const dayNames = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const timeStr = formatTime(st);
      if (dayNames[day] && timeStr) {
        timeSlots.push(`${dayNames[day]} ${timeStr}`);
      }
    }
  }
  
  return timeSlots.length > 0 ? timeSlots.join(', ') : 'TBA';
}

function formatTime(st) {
  // 將時間代碼轉換為實際時間
  const timeMap = {
    '1': '08:00-09:00',
    '2': '09:10-10:00',
    '3': '10:20-11:10',
    '4': '11:20-12:10',
    '5': '13:20-14:10',
    '6': '14:20-15:10',
    '7': '15:30-16:20',
    '8': '16:30-17:20',
    '9': '17:30-18:20',
    'A': '18:30-19:20',
    'B': '19:30-20:20',
    'C': '20:30-21:20'
  };
  
  return timeMap[st] || st;
}

function formatClassroom(row) {
  const classrooms = [];
  
  for (let i = 1; i <= 6; i++) {
    const classroom = row[`clsrom_${i}`];
    if (classroom && classroom.trim() !== '') {
      classrooms.push(classroom.trim());
    }
  }
  
  return classrooms.length > 0 ? classrooms.join(', ') : 'TBA';
}

function generateDescription(row) {
  const parts = [];
  
  if (row.cou_ename && row.cou_ename.trim() !== '') {
    parts.push(`英文名稱: ${row.cou_ename.trim()}`);
  }
  
  if (row.co_select && row.co_select.trim() !== '') {
    parts.push(`選課說明: ${row.co_select.trim()}`);
  }
  
  if (row.co_rep && row.co_rep.trim() !== '') {
    parts.push(`備註: ${row.co_rep.trim()}`);
  }
  
  return parts.length > 0 ? parts.join(' | ') : '課程詳細資訊請參考課程大綱';
}

function generateCoursesCSV(courses) {
  const headers = [
    'course_id', 'course_name', 'department', 'credits', 'time_slot',
    'classroom', 'instructor', 'description', 'prerequisites', 'max_students', 'current_enrollment'
  ];
  
  let csv = headers.join(',') + '\n';
  
  courses.forEach(course => {
    const row = headers.map(header => {
      const value = course[header] || '';
      // 處理包含逗號的值
      return `"${value.toString().replace(/"/g, '""')}"`;
    });
    csv += row.join(',') + '\n';
  });
  
  return csv;
}
