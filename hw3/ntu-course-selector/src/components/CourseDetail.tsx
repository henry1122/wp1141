import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Paper,
  IconButton
} from '@mui/material';
import {
  Close,
  Schedule,
  Person,
  School,
  Book,
  People,
  LocationOn,
  Info
} from '@mui/icons-material';
import { Course } from '../types';

interface CourseDetailProps {
  open: boolean;
  onClose: () => void;
  course: Course | null;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ open, onClose, course }) => {
  if (!course) return null;

  // 解析時間段
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
        
        // 如果時間字符串長度大於1，表示有多個時間段
        if (timeStr.length > 1) {
          // 將每個時間段分開處理
          for (let i = 0; i < timeStr.length; i++) {
            const timeNum = timeStr[i];
            parsedSlots.push({
              day: day,
              timeNum: timeNum,
              fullTime: `${day}${timeNum}`
            });
          }
        } else {
          parsedSlots.push({
            day: day,
            timeNum: timeStr,
            fullTime: slot
          });
        }
      } else {
        // 解析格式如 "三A" 或 "三B" 或 "三C" 或 "三D" (星期3的A/B/C/D時段)
        const chineseDayWithLetterMatch = slot.match(/^([一二三四五六日])([ABCD])$/);
        
        if (chineseDayWithLetterMatch) {
          const day = chineseDayWithLetterMatch[1];
          const timeLetter = chineseDayWithLetterMatch[2];
          
          parsedSlots.push({
            day: day,
            timeNum: timeLetter,
            fullTime: slot
          });
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

  // 將同一天的時間合併顯示
  const getGroupedTimeSlots = (timeSlot: string) => {
    const parsedSlots = parseTimeSlot(timeSlot);
    const groupedByDay: { [key: string]: string[] } = {};
    
    parsedSlots.forEach(slot => {
      if (!groupedByDay[slot.day]) {
        groupedByDay[slot.day] = [];
      }
      if (slot.timeNum) {
        // 如果是A、B、C、D，顯示具體時間
        if (['A', 'B', 'C', 'D'].includes(slot.timeNum)) {
          const timeMap: { [key: string]: string } = {
            'A': '18:30',
            'B': '19:30', 
            'C': '20:30',
            'D': '21:30'
          };
          groupedByDay[slot.day].push(`${slot.timeNum}(${timeMap[slot.timeNum]})`);
        } else {
          groupedByDay[slot.day].push(slot.timeNum);
        }
      }
    });
    
    return Object.keys(groupedByDay).map(day => ({
      day,
      times: groupedByDay[day].sort()
    }));
  };

  const groupedTimeSlots = getGroupedTimeSlots(course.time_slot);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 3,
        borderRadius: '12px 12px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            p: 1,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Book sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {course.course_name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              課程詳細資訊
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ 
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* 基本信息 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 2, background: 'rgba(25, 118, 210, 0.05)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                基本信息
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <School sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">學系：</Typography>
                <Chip label={course.department} size="small" color="primary" variant="outlined" />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Book sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">學分：</Typography>
                <Chip label={`${course.credits} 學分`} size="small" color="secondary" variant="filled" />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">授課教師：</Typography>
                <Typography variant="body2" fontWeight="500">{course.instructor}</Typography>
              </Box>
              
              {course.tno > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <People sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">人數限制：</Typography>
                  <Chip 
                    label={`限制${course.tno}人`} 
                    size="small" 
                    color="info" 
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          {/* 時間和地點 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 2, background: 'rgba(25, 118, 210, 0.05)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                時間地點
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Schedule sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">上課時間：</Typography>
                </Box>
                {course.time_slot === 'TBA' || !course.time_slot || course.time_slot.trim() === '' ? (
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                    時間待定
                  </Typography>
                ) : (
                  <Box sx={{ ml: 3 }}>
                    {groupedTimeSlots.length > 0 ? (
                      groupedTimeSlots.map((group, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Chip
                            label={group.day}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              minWidth: 50,
                              fontSize: '0.75rem',
                              height: 24,
                              color: 'primary.main',
                              borderColor: 'primary.main'
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            第{group.times.join('')}節
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {course.time_slot}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationOn sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">教室：</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                  {course.classroom}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* 課程描述 */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, borderRadius: 2, background: 'rgba(25, 118, 210, 0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Info sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  課程描述
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                {course.description.replace(/選課說明/g, '加簽類別')}
              </Typography>
            </Paper>
          </Grid>

          {/* 先修課程 */}
          {course.prerequisites !== '無' && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3, borderRadius: 2, background: 'rgba(255, 152, 0, 0.05)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'warning.main' }}>
                  先修課程
                </Typography>
                <Chip
                  label={course.prerequisites === '先修' ? '先修' : `先修：${course.prerequisites}`}
                  color="warning"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, background: 'rgba(25, 118, 210, 0.05)' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            fontWeight: 600,
            borderWidth: 2,
            '&:hover': { borderWidth: 2 }
          }}
        >
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDetail;
