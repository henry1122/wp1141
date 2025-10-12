import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Paper,
  IconButton,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { Delete, Schedule, School, Person, ViewList, CalendarToday } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import ScheduleView from './ScheduleView';

const CourseSelection: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [tabValue, setTabValue] = React.useState(0);

  // 解析時間段並格式化顯示
  const parseTimeSlot = (timeSlot: string) => {
    if (timeSlot === 'TBA' || !timeSlot || timeSlot.trim() === '') return [];
    
    const slots = timeSlot.split(', ').filter(slot => slot !== 'TBA' && slot.trim() !== '');
    const parsedSlots = [];
    
    for (const slot of slots) {
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
          '9': { start: '17:30', end: '18:20' }
        };
        
        if (dayMap[day]) {
          // 如果時間字符串長度大於1，表示有多個時間段
          if (timeStr.length > 1) {
            for (let i = 0; i < timeStr.length; i++) {
              const timeNum = timeStr[i];
              if (timeMap[timeNum]) {
                parsedSlots.push({
                  day: dayMap[day],
                  startTime: timeMap[timeNum].start,
                  endTime: timeMap[timeNum].end,
                  fullTime: `${day}${timeNum}`
                });
              }
            }
          } else {
            if (timeMap[timeStr]) {
              parsedSlots.push({
                day: dayMap[day],
                startTime: timeMap[timeStr].start,
                endTime: timeMap[timeStr].end,
                fullTime: slot
              });
            }
          }
        }
      } else {
        // 解析格式如 "三AB" 或 "三ABC" 或 "三ABCD" (星期3的A/B/C/D時段)
        const chineseDayWithLetterMatch = slot.match(/^([一二三四五六日])([ABCD]+)$/);
        
        if (chineseDayWithLetterMatch) {
          const day = chineseDayWithLetterMatch[1];
          const timeStr = chineseDayWithLetterMatch[2];
          
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
                  parsedSlots.push({
                    day: dayMap[day],
                    startTime: timeMap[timeLetter].start,
                    endTime: timeMap[timeLetter].end,
                    fullTime: `${day}${timeLetter}`
                  });
                }
              }
            } else {
              if (timeMap[timeStr]) {
                parsedSlots.push({
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
            parsedSlots.push({
              day: dayMatch[1],
              startTime: timeMatch[1],
              endTime: timeMatch[2],
              fullTime: slot
            });
          }
        }
      }
    }
    
    return parsedSlots;
  };

  // 格式化時間段顯示
  const getFormattedTimeSlots = (timeSlot: string) => {
    const parsedSlots = parseTimeSlot(timeSlot);
    if (parsedSlots.length === 0) return ['時間待定'];
    
    return parsedSlots.map(slot => `${slot.day} ${slot.startTime}-${slot.endTime}`);
  };

  const handleRemoveCourse = (courseId: string) => {
    dispatch({ type: 'REMOVE_COURSE', payload: courseId });
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_SELECTION' });
  };

  const handleSubmitSelection = () => {
    dispatch({ type: 'SUBMIT_SELECTION' });
  };

  const handleBackToBrowsing = () => {
    dispatch({ type: 'SET_STEP', payload: 'browsing' });
  };

  // 計算總學分
  const getTotalCredits = () => {
    return state.selectedCourses.reduce((sum, sc) => sum + sc.course.credits, 0);
  };

  const totalCredits = getTotalCredits();

  // 檢查是否有選課
  const hasSelectedCourses = state.selectedCourses.length > 0;

  return (
    <Box sx={{ 
      p: 4,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #9b59b6 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        zIndex: 0
      }
    }}>
      <Paper sx={{ 
        p: 4, 
        mb: 4,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.1) 100%)',
            border: '1px solid rgba(25, 118, 210, 0.2)'
          }}>
            <Box sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ViewList sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ 
                mb: 0,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
            選課清單
          </Typography>
              <Typography variant="body2" color="black" sx={{ mt: 0.5 }}>
                檢視和管理您已選擇的課程
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBackToBrowsing}
              sx={{ 
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              繼續瀏覽課程
            </Button>
            
            {state.selectedCourses.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearAll}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  }
                }}
              >
                清空清單
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip
            icon={<School />}
            label={`已選 ${state.selectedCourses.length} 門課程`}
            color="primary"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<Schedule />}
            label={`總學分：${totalCredits}/25`}
            color="secondary"
            sx={{ fontWeight: 600 }}
          />
        </Box>

      </Paper>

      {state.selectedCourses.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="black" gutterBottom>
              選課清單為空
            </Typography>
            <Typography variant="body2" color="black" sx={{ mb: 2 }}>
              請先瀏覽課程並加入您想選的課程
            </Typography>
            <Button
              variant="contained"
              onClick={handleBackToBrowsing}
            >
              開始瀏覽課程
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab 
                icon={<ViewList />} 
                label="課程清單" 
                iconPosition="start"
                sx={{ color: 'black' }}
              />
              <Tab 
                icon={<CalendarToday />} 
                label="時間表" 
                iconPosition="start"
                sx={{ color: 'black' }}
              />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Grid container spacing={2}>
              {state.selectedCourses.map((selection, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={selection.course.course_id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">
                          {selection.course.course_name}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveCourse(selection.course.course_id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="black" gutterBottom>
                        {selection.course.department} • {selection.course.credits} 學分
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Person sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          {selection.course.instructor}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Schedule sx={{ mr: 1, fontSize: 16 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2">
                            上課時間
                          </Typography>
                          {getFormattedTimeSlots(selection.course.time_slot).map((timeSlot, idx) => (
                            <Typography key={idx} variant="body2" color="black" sx={{ fontSize: '0.8rem' }}>
                              {timeSlot}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="black">
                        教室：{selection.course.classroom}
                      </Typography>
                      
                      {selection.course.prerequisites !== '無' && (
                        <Chip
                          label="先修"
                          size="small"
                          color="warning"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tabValue === 1 && (
            <ScheduleView />
          )}

          <Paper sx={{ p: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">
                  選課摘要
                </Typography>
                <Typography variant="body2" color="black">
                  共 {state.selectedCourses.length} 門課程，總計 {totalCredits} 學分
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmitSelection}
                disabled={!hasSelectedCourses}
                sx={{ minWidth: 120 }}
              >
                確認選課
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default CourseSelection;