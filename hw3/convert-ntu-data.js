const fs = require('fs');
const csv = require('csv-parser');

// 讀取原始 NTU 課程數據
const courses = [];
const departments = new Set();

console.log('開始處理 NTU 課程數據...');

fs.createReadStream('hw3-ntucourse-data-1002.csv')
  .pipe(csv())
  .on('data', (row) => {
    // 只處理有效的課程數據
    if (row.cou_cname && row.cou_cname.trim() !== '') {
      const course = {
        course_id: `${row.cou_code}_${row.class || '01'}`,
        course_name: row.cou_cname.trim(),
        department: row.dpt_abbr || 'Unknown',
        credits: parseInt(row.credit) || 0,
        time_slot: formatTimeSlot(row),
        classroom: formatClassroom(row),
        instructor: (row.tea_cname || row.tea_ename || 'TBA').trim(),
        description: generateDescription(row),
        prerequisites: formatPrerequisites(row.pre_course),
        max_students: parseInt(row.limit) || 0,
        current_enrollment: parseInt(row.eno) || 0,
        tno: parseInt(row.tno) || 0  // 添加tno欄位
      };
      
      courses.push(course);
      departments.add(course.department);
    }
  })
  .on('end', () => {
    console.log(`處理完成！共找到 ${courses.length} 門課程`);
    
    // 生成課程 CSV
    const coursesCSV = generateCoursesCSV(courses);
    fs.writeFileSync('ntu-course-selector/public/data/courses.csv', coursesCSV, 'utf8');
    
    // 生成學系 CSV
    const departmentsCSV = generateDepartmentsCSV(Array.from(departments));
    fs.writeFileSync('ntu-course-selector/public/data/departments.csv', departmentsCSV, 'utf8');
    
    console.log(`轉換完成！`);
    console.log(`- 課程數據已保存到: public/data/courses.csv`);
    console.log(`- 學系數據已保存到: public/data/departments.csv`);
    console.log(`- 共處理 ${courses.length} 門課程，${departments.size} 個學系`);
  })
  .on('error', (err) => {
    console.error('處理數據時發生錯誤:', err);
  });

function formatTimeSlot(row) {
  const timeSlots = [];
  
  
  // 處理多個時間段 (st1,day1,st2,day2,st3,day3,st4,day4,st5,day5,st6,day6)
  for (let i = 1; i <= 6; i++) {
    const st = row[`st${i}`];  // 第幾節課
    const day = row[`day${i}`]; // 星期幾
    
    if (day && day !== '') {
      const dayNames = ['', '一', '二', '三', '四', '五', '六', '日'];
      
      // 情況1: day包含節次信息 (如 "9", "34", "AB")
      if (day.length >= 1 && /^[0-9A-Z]+$/.test(day)) {
        // 處理如 "34" 的情況，表示第3,4節
        if (/^\d+$/.test(day)) {
          for (let j = 0; j < day.length; j++) {
            const period = day[j];
            if (period && period !== '0') {
              timeSlots.push(`${dayNames[i]}${period}`);
            }
          }
        } else {
          // 處理如 "AB" 的情況
          timeSlots.push(`${dayNames[i]}${day}`);
        }
      }
      // 情況2: 正常的st和day分離格式
      else if (st && st !== '' && dayNames[day]) {
        timeSlots.push(`${dayNames[day]}${st}`);
      }
      // 情況3: day是數字，表示星期幾，st是節次
      else if (dayNames[day] && st && st !== '') {
        timeSlots.push(`${dayNames[day]}${st}`);
      }
    }
  }
  
  if (timeSlots.length === 0) return 'TBA';
  
  // 整合相同日子的時間
  const dayGroups = {};
  timeSlots.forEach(slot => {
    const day = slot[0]; // 第一個字符是星期
    const time = slot.slice(1); // 其餘是時間
    if (!dayGroups[day]) {
      dayGroups[day] = [];
    }
    dayGroups[day].push(time);
  });
  
  // 將相同日子的時間合併
  const mergedSlots = [];
  Object.keys(dayGroups).forEach(day => {
    const times = dayGroups[day].sort(); // 排序時間
    mergedSlots.push(day + times.join(''));
  });
  
  return mergedSlots.join(', ');
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

function formatPrerequisites(preCourse) {
  if (!preCourse || preCourse.trim() === '') {
    return '無';
  }
  
  // 如果值就是"Y"，表示有先修要求
  if (preCourse.trim() === 'Y') {
    return '先修';
  }
  
  // 如果包含"先修:Y"，替換為"先修"
  if (preCourse.includes('先修:Y')) {
    return preCourse.replace(/先修:Y/g, '先修');
  }
  
  return preCourse;
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
    'classroom', 'instructor', 'description', 'prerequisites', 'max_students', 'current_enrollment', 'tno'
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

function generateDepartmentsCSV(departments) {
  const headers = ['department_id', 'department_name', 'college', 'description'];
  let csv = headers.join(',') + '\n';
  
  departments.forEach(dept => {
    const row = [
      dept,
      dept,
      'Unknown College',
      `${dept} 相關課程`
    ].map(value => `"${value}"`);
    csv += row.join(',') + '\n';
  });
  
  return csv;
}