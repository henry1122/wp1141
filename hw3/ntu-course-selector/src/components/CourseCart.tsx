import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Chip,
  Alert,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemSecondaryAction
} from '@mui/material';
import {
  ShoppingCart,
  Delete,
  CheckCircle,
  Warning,
  School,
  Schedule,
  Person
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import { Course } from '../types';

interface CourseCartProps {
  onViewCart: () => void;
}

const CourseCart: React.FC<CourseCartProps> = ({ onViewCart }) => {
  const { state, dispatch } = useAppContext();
  const [open, setOpen] = React.useState(false);

  // 解析時間段為更詳細的格式
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

  // 計算總學分
  const getTotalCredits = () => {
    return state.selectedCourses.reduce((sum, sc) => sum + sc.course.credits, 0);
  };

  const totalCredits = getTotalCredits();
  const totalCourses = state.selectedCourses.length;

  // 檢查時間衝突
  const timeConflicts = React.useMemo(() => {
    const conflicts: { course1: Course; course2: Course; timeSlot: string }[] = [];
    
    for (let i = 0; i < state.selectedCourses.length; i++) {
      for (let j = i + 1; j < state.selectedCourses.length; j++) {
        const course1 = state.selectedCourses[i].course;
        const course2 = state.selectedCourses[j].course;
        
        // 解析時間段
        const timeSlots1 = parseTimeSlot(course1.time_slot);
        const timeSlots2 = parseTimeSlot(course2.time_slot);
        
        // 檢查是否有重疊的時間段
        for (const slot1 of timeSlots1) {
          for (const slot2 of timeSlots2) {
            if (slot1.day === slot2.day && slot1.startTime === slot2.startTime) {
              conflicts.push({ course1, course2, timeSlot: slot1.fullTime });
            }
          }
        }
      }
    }
    
    return conflicts;
  }, [state.selectedCourses]);

  const hasTimeConflicts = timeConflicts.length > 0;

  const handleRemoveCourse = (courseId: string) => {
    dispatch({ type: 'REMOVE_COURSE', payload: courseId });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_SELECTION' });
  };


  const formatTimeSlot = (timeSlot: string) => {
    if (timeSlot === 'TBA') return '時間待定';
    return timeSlot;
  };

  return (
    <>
      {/* 購物車按鈕 */}
      <Box sx={{ 
        position: 'fixed', 
        top: { xs: 16, sm: 20 }, 
        right: { xs: 16, sm: 20 }, 
        zIndex: 1000 
      }}>
        <Badge 
          badgeContent={totalCourses} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.75rem',
              fontWeight: 700,
              minWidth: 24,
              height: 24,
              borderRadius: 12,
              animation: totalCourses > 0 ? 'pulse 2s infinite' : 'none',
            }
          }}
        >
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 4,
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontWeight: 600,
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              },
              '&:active': {
                transform: 'translateY(0)',
              }
            }}
          >
            已選的課
            {totalCredits > 0 && (
              <Typography variant="body2" sx={{ 
                ml: 1, 
                opacity: 0.9,
                fontWeight: 500
              }}>
                ({totalCredits}/25 學分)
              </Typography>
            )}
          </Button>
        </Badge>
      </Box>

      {/* 購物車彈出視窗 */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            maxHeight: '85vh',
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
          gap: 2,
          p: 3,
          borderRadius: '16px 16px 0 0'
        }}>
          <Box sx={{
            p: 1,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShoppingCart sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              已選的課清單
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              管理您的選課清單，確認課程安排
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {state.selectedCourses.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <School sx={{ fontSize: 64, color: 'black', mb: 2 }} />
              <Typography variant="h6" color="black" gutterBottom>
                還沒有選課
              </Typography>
              <Typography variant="body2" color="black">
                開始瀏覽課程並加入您想選的課程吧！
              </Typography>
            </Box>
          ) : (
            <>
              {/* 時間衝突警告 */}
              {hasTimeConflicts && (
                <Alert 
                  severity="warning" 
                  sx={{ m: 2, mb: 1 }}
                  icon={<Warning />}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    發現時間衝突！
                  </Typography>
                  {timeConflicts.map((conflict, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ⚠️ 時間衝突
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        • {conflict.course1.course_name}
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        • {conflict.course2.course_name}
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 2, color: 'warning.main' }}>
                        衝突時間：{conflict.timeSlot}
                      </Typography>
                    </Box>
                  ))}
                </Alert>
              )}

              {/* 課程清單 */}
              <List sx={{ p: 0 }}>
                {state.selectedCourses.map((selection, index) => (
                  <React.Fragment key={selection.course.course_id}>
                    <ListItem sx={{ 
                      px: 3, 
                      py: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ color: 'black' }}>
                            {selection.course.course_name}
                          </Typography>
                          <Chip
                            label={`${selection.course.credits} 學分`}
                            size="small"
                            color="primary"
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                          />
                          <Chip
                            label={selection.course.department}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Person sx={{ fontSize: 16, color: 'black' }} />
                            <Typography variant="body2" color="black" fontWeight="500">
                              {selection.course.instructor}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Schedule sx={{ fontSize: 16, color: 'black' }} />
                            <Typography variant="body2" color="black" fontWeight="500">
                              上課時間
                            </Typography>
                          </Box>
                          {selection.course.time_slot === 'TBA' ? (
                            <Typography variant="body2" color="black" sx={{ ml: 3 }}>
                              時間待定
                            </Typography>
                          ) : (
                            <Box sx={{ ml: 3 }}>
                              {parseTimeSlot(selection.course.time_slot).map((slot, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Chip
                                    label={slot.day}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      minWidth: 40,
                                      fontSize: '0.7rem',
                                      height: 20
                                    }}
                                  />
                                  <Typography variant="body2" color="black" sx={{ fontSize: '0.8rem' }}>
                                    {slot.startTime}-{slot.endTime}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Box>
                      
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleRemoveCourse(selection.course.course_id)}
                          sx={{ 
                            ml: 1,
                            borderRadius: 2,
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < state.selectedCourses.length - 1 && (
                      <Divider sx={{ mx: 3, opacity: 0.3 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </DialogContent>

        {state.selectedCourses.length > 0 && (
          <>
            <Divider sx={{ opacity: 0.3 }} />
            <Box sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)',
              borderRadius: '0 0 16px 16px'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    選課摘要
                  </Typography>
                  <Typography variant="body2" color="black">
                    共 {totalCourses} 門課程
                  </Typography>
                </Box>
                <Box sx={{ 
                  textAlign: 'right',
                  p: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  color: 'white'
                }}>
                  <Typography variant="h4" fontWeight="700">
                    {totalCredits}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    總學分
                  </Typography>
                </Box>
              </Box>

              <DialogActions sx={{ p: 0, gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpen(false)}
                  sx={{ 
                    flex: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  繼續選課
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearCart}
                  sx={{ 
                    flex: 1,
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
                <Button
                  variant="contained"
                  onClick={onViewCart}
                  disabled={hasTimeConflicts}
                  startIcon={<CheckCircle />}
                  sx={{ 
                    flex: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    background: hasTimeConflicts 
                      ? 'grey.400' 
                      : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    '&:hover': {
                      background: hasTimeConflicts 
                        ? 'grey.400' 
                        : 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    }
                  }}
                >
                  確認選課
                </Button>
              </DialogActions>
            </Box>
          </>
        )}
      </Dialog>
    </>
  );
};

export default CourseCart;
