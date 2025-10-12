import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import { Delete, Schedule } from '@mui/icons-material';
import { CourseSelection } from '../types';
import { useAppContext } from '../context/AppContext';

const ScheduleView: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const handleRemoveCourse = (courseId: string) => {
    dispatch({ type: 'REMOVE_COURSE', payload: courseId });
  };

  // 計算有效學分（排除時間衝突的課程）
  const getValidCredits = () => {
    return state.selectedCourses.reduce((sum, sc) => {
      // 檢查是否有時間衝突，並確定是否為第一個選的課程
      const conflictingCourses = state.selectedCourses.filter(otherSc => {
        if (otherSc.course.course_id === sc.course.course_id) return false;
        if (sc.course.time_slot === 'TBA' || otherSc.course.time_slot === 'TBA') return false;
        
        const courseTimeSlots = parseTimeSlot(sc.course.time_slot);
        const otherTimeSlots = parseTimeSlot(otherSc.course.time_slot);
        
        if (!courseTimeSlots || !otherTimeSlots) return false;
        
        return courseTimeSlots.some(courseSlot => 
          otherTimeSlots.some(otherSlot => 
            courseSlot.day === otherSlot.day &&
            (courseSlot.startTime === otherSlot.startTime)
          )
        );
      });
      
      // 如果有衝突，檢查是否為第一個選的課程（時間戳最早）
      if (conflictingCourses.length > 0) {
        const isFirstSelected = conflictingCourses.every(otherSc => 
          sc.timestamp < otherSc.timestamp
        );
        return isFirstSelected ? sum + sc.course.credits : sum;
      }
      
      return sum + sc.course.credits;
    }, 0);
  };

  // 解析時間段
  const parseTimeSlot = (timeSlot: string) => {
    if (timeSlot === 'TBA' || !timeSlot || timeSlot.trim() === '') return null;
    
    const slots = timeSlot.split(', ').filter(slot => slot !== 'TBA' && slot.trim() !== '');
    const schedules = [];
    
    // 調試信息
    console.log('解析時間段:', timeSlot, '分割後:', slots);
    
    for (const slot of slots) {
        // 解析格式如 "三AB" 或 "三ABC" 或 "三ABCD" (星期3的A/B/C/D時段)
        const chineseDayWithLetterMatch = slot.match(/^([一二三四五六日])([ABCD]+)$/);
      
      if (chineseDayWithLetterMatch) {
        const day = chineseDayWithLetterMatch[1];
        const timeStr = chineseDayWithLetterMatch[2];
        
        console.log('解析ABC時間段:', slot, 'day:', day, 'timeStr:', timeStr);
        
        // 將中文星期轉換為英文
        const dayMap: { [key: string]: string } = {
          '一': 'Mon', '二': 'Tue', '三': 'Wed', '四': 'Thu', 
          '五': 'Fri', '六': 'Sat', '日': 'Sun'
        };
        
        // A=18:30, B=19:30, C=20:30, D=21:30 (一節課50分鐘)
        const timeMap: { [key: string]: { start: string, end: string } } = {
          'A': { start: '18:30', end: '19:20' },
          'B': { start: '19:30', end: '20:20' }, 
          'C': { start: '20:30', end: '21:20' },
          'D': { start: '21:30', end: '22:20' }
        };
        
        if (dayMap[day]) {
          // 如果時間字符串長度大於1，表示有多個時間段 (如 "AB")
          if (timeStr.length > 1) {
            for (let i = 0; i < timeStr.length; i++) {
              const timeLetter = timeStr[i];
              if (timeMap[timeLetter]) {
                schedules.push({
                  day: dayMap[day],
                  startTime: timeMap[timeLetter].start,
                  endTime: timeMap[timeLetter].end,
                  fullTime: `${day}${timeLetter}`
                });
              }
            }
          } else {
            if (timeMap[timeStr]) {
              schedules.push({
                day: dayMap[day],
                startTime: timeMap[timeStr].start,
                endTime: timeMap[timeStr].end,
                fullTime: slot
              });
            }
          }
        }
      } else {
        // 解析格式如 "三2" 或 "三234" (星期3第2節 或 星期3第2,3,4節)
        const chineseDayMatch = slot.match(/^([一二三四五六日])(\d+)$/);
        
        if (chineseDayMatch) {
        const day = chineseDayMatch[1];
        const timeStr = chineseDayMatch[2];
        
        // 將中文星期轉換為英文
        const dayMap: { [key: string]: string } = {
          '一': 'Mon', '二': 'Tue', '三': 'Wed', '四': 'Thu', 
          '五': 'Fri', '六': 'Sat', '日': 'Sun'
        };
        
        // 將節次轉換為時間 (一節課50分鐘)
        const timeMap: { [key: string]: { start: string, end: string } } = {
          '1': { start: '08:00', end: '08:50' },
          '2': { start: '09:10', end: '10:00' },
          '3': { start: '10:20', end: '11:10' },
          '4': { start: '11:20', end: '12:10' },
          '5': { start: '13:20', end: '14:10' },
          '6': { start: '14:20', end: '15:10' },
          '7': { start: '15:30', end: '16:20' },
          '8': { start: '16:30', end: '17:20' },
          '9': { start: '17:30', end: '18:20' },
          'A': { start: '18:30', end: '19:20' },
          'B': { start: '19:30', end: '20:20' },
          'C': { start: '20:30', end: '21:20' }
        };
        
        if (dayMap[day]) {
          // 如果時間字符串長度大於1，表示有多個時間段
          if (timeStr.length > 1) {
            for (let i = 0; i < timeStr.length; i++) {
              const timeNum = timeStr[i];
              if (timeMap[timeNum]) {
                schedules.push({
                  day: dayMap[day],
                  startTime: timeMap[timeNum].start,
                  endTime: timeMap[timeNum].end,
                  fullTime: `${day}${timeNum}`
                });
              }
            }
          } else {
            if (timeMap[timeStr]) {
              schedules.push({
                day: dayMap[day],
                startTime: timeMap[timeStr].start,
                endTime: timeMap[timeStr].end,
                fullTime: slot
              });
            }
          }
        }
      } else {
          // 備用：解析格式如 "Mon 08:00-09:00"
          const dayMatch = slot.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/);
          const timeMatch = slot.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
          
          if (dayMatch && timeMatch) {
            schedules.push({
              day: dayMatch[1],
              startTime: timeMatch[1],
              endTime: timeMatch[2],
              fullTime: slot
            });
          }
        }
      }
    }
    
    return schedules;
  };

  // 生成時間表
  const generateSchedule = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const timeSlots = [
      '08:00', '09:10', '10:20', '11:20', '13:20', '14:20', '15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30'
    ];
    
    const schedule: { [key: string]: { [key: string]: CourseSelection } } = {};
    
    // 初始化時間表
    days.forEach(day => {
      schedule[day] = {};
      timeSlots.forEach(time => {
        schedule[day][time] = null as any;
      });
    });
    
    // 填充課程
    state.selectedCourses.forEach(selection => {
      const schedules = parseTimeSlot(selection.course.time_slot);
      if (schedules) {
        schedules.forEach(scheduleItem => {
          if (schedule[scheduleItem.day] && schedule[scheduleItem.day][scheduleItem.startTime]) {
            // 如果該時間段已有課程，檢查是否為時間衝突
            const existingCourse = schedule[scheduleItem.day][scheduleItem.startTime];
            if (existingCourse.course.course_id !== selection.course.course_id) {
              // 時間衝突，但我們仍然顯示兩個課程
              // 這裡可以添加衝突標記邏輯
            }
          } else if (schedule[scheduleItem.day]) {
            schedule[scheduleItem.day][scheduleItem.startTime] = selection;
          }
        });
      }
    });
    
    return schedule;
  };

  const schedule = generateSchedule();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayNames = {
    'Mon': '週一',
    'Tue': '週二', 
    'Wed': '週三',
    'Thu': '週四',
    'Fri': '週五',
    'Sat': '週六',
    'Sun': '週日'
  };

  if (state.selectedCourses.length === 0) {
    return (
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Schedule sx={{ fontSize: 48, color: 'black', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }} gutterBottom>
            時間表為空
          </Typography>
          <Typography variant="body1" sx={{ color: 'black', fontWeight: 500 }}>
            請先選擇課程來查看時間表
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Schedule sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
            選課時間表
          </Typography>
        </Box>
        
        <Paper sx={{ overflow: 'auto' }}>
          <Box sx={{ minWidth: 800 }}>
            {/* 表頭 */}
            <Grid container sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Grid size={{ xs: 2 }} sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
                  時間
                </Typography>
              </Grid>
              {days.map(day => (
                <Grid key={day} size={{ xs: 1.4 }} sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }} align="center">
                    {dayNames[day as keyof typeof dayNames]}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            
            {/* 時間段 */}
            {['08:00', '09:10', '10:20', '11:20', '13:20', '14:20', '15:30', '16:30', '17:30', '18:30', '19:30', '20:30'].map(time => (
              <Grid key={time} container sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Grid size={{ xs: 2 }} sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ color: 'black', fontWeight: 500 }}>
                    {time}
                  </Typography>
                </Grid>
                {days.map(day => (
                  <Grid key={day} size={{ xs: 1.4 }} sx={{ p: 0.5, borderRight: 1, borderColor: 'divider', minHeight: 60 }}>
                    {schedule[day][time] && (
                      <Paper 
                        sx={{ 
                          p: 1, 
                          bgcolor: (() => {
                            const course = schedule[day][time].course;
                            const currentSelection = state.selectedCourses.find(sc => sc.course.course_id === course.course_id);
                            
                            if (!currentSelection) return 'primary.light';
                            
                            // 檢查是否有時間衝突
                            const conflictingCourses = state.selectedCourses.filter(otherSc => {
                              if (otherSc.course.course_id === course.course_id) return false;
                              if (course.time_slot === 'TBA' || otherSc.course.time_slot === 'TBA') return false;
                              
                              const courseTimeSlots = parseTimeSlot(course.time_slot);
                              const otherTimeSlots = parseTimeSlot(otherSc.course.time_slot);
                              
                              if (!courseTimeSlots || !otherTimeSlots) return false;
                              
                              return courseTimeSlots.some(courseSlot => 
                                otherTimeSlots.some(otherSlot => 
                                  courseSlot.day === otherSlot.day &&
                                  (courseSlot.startTime === otherSlot.startTime)
                                )
                              );
                            });
                            
                            // 如果有衝突，檢查是否為第一個選的課程
                            if (conflictingCourses.length > 0) {
                              const isFirstSelected = conflictingCourses.every(otherSc => 
                                currentSelection.timestamp < otherSc.timestamp
                              );
                              console.log(`Course ${course.course_name}: hasConflict=${conflictingCourses.length > 0}, isFirstSelected=${isFirstSelected}`);
                              return isFirstSelected ? 'primary.light' : 'warning.light';
                            }
                            
                            return 'primary.light';
                          })(),
                          color: (() => {
                            const course = schedule[day][time].course;
                            const currentSelection = state.selectedCourses.find(sc => sc.course.course_id === course.course_id);
                            
                            if (!currentSelection) return 'primary.contrastText';
                            
                            // 檢查是否有時間衝突
                            const conflictingCourses = state.selectedCourses.filter(otherSc => {
                              if (otherSc.course.course_id === course.course_id) return false;
                              if (course.time_slot === 'TBA' || otherSc.course.time_slot === 'TBA') return false;
                              
                              const courseTimeSlots = parseTimeSlot(course.time_slot);
                              const otherTimeSlots = parseTimeSlot(otherSc.course.time_slot);
                              
                              if (!courseTimeSlots || !otherTimeSlots) return false;
                              
                              return courseTimeSlots.some(courseSlot => 
                                otherTimeSlots.some(otherSlot => 
                                  courseSlot.day === otherSlot.day &&
                                  (courseSlot.startTime === otherSlot.startTime)
                                )
                              );
                            });
                            
                            // 如果有衝突，檢查是否為第一個選的課程
                            if (conflictingCourses.length > 0) {
                              const isFirstSelected = conflictingCourses.every(otherSc => 
                                currentSelection.timestamp < otherSc.timestamp
                              );
                              return isFirstSelected ? 'primary.contrastText' : 'warning.contrastText';
                            }
                            
                            return 'primary.contrastText';
                          })(),
                          position: 'relative',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'inherit', fontSize: '0.75rem' }}>
                            {schedule[day][time].course.course_name}
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ color: 'inherit', fontSize: '0.7rem', opacity: 0.9 }}>
                            {schedule[day][time].course.instructor}
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ color: 'inherit', fontSize: '0.7rem', opacity: 0.9 }}>
                            {schedule[day][time].course.classroom}
                          </Typography>
                        </Box>
                        
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveCourse(schedule[day][time].course.course_id)}
                          sx={{ 
                            position: 'absolute', 
                            top: 2, 
                            right: 2,
                            color: 'inherit',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Paper>
                    )}
                  </Grid>
                ))}
              </Grid>
            ))}
          </Box>
        </Paper>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`已選 ${state.selectedCourses.length} 門課程`}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              fontWeight: 'bold'
            }}
            size="small"
          />
          <Chip
            label={`有效學分：${getValidCredits()}`}
            sx={{
              background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)',
              color: 'white',
              fontWeight: 'bold'
            }}
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScheduleView;
