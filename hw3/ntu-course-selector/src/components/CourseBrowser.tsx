import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Button,
  Paper,
  Slider,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
  Pagination,
  CircularProgress,
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  ExpandMore, 
  Schedule, 
  People, 
  Compare, 
  AddShoppingCart,
  RemoveShoppingCart,
  Warning,
  CheckCircle,
  School,
  Person,
  Info,
  Clear
} from '@mui/icons-material';
import { Course, Department } from '../types';
import { useAppContext } from '../context/AppContext';
import CourseComparison from './CourseComparison';
import CourseCart from './CourseCart';
import CourseDetail from './CourseDetail';

interface CourseBrowserProps {
  courses: Course[];
  departments: Department[];
}

const CourseBrowser: React.FC<CourseBrowserProps> = ({ courses, departments }) => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [creditRange, setCreditRange] = useState<number[]>([0, 6]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'credits' | 'department'>('name');
  
  // 搜尋相關狀態
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [activeDepartment, setActiveDepartment] = useState('');
  const [activeCollege, setActiveCollege] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [comparisonCourses, setComparisonCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  const COURSES_PER_PAGE = 20; // 每頁顯示20門課程

  // 計算總學分
  const getTotalCredits = () => {
    return state.selectedCourses.reduce((sum, sc) => sum + sc.course.credits, 0);
  };

  const filteredCourses = useMemo(() => {
    setIsLoading(true);
    
    // 如果沒有搜尋過，返回空數組
    if (!hasSearched) {
      setIsLoading(false);
      return [];
    }
    
    let filtered = courses.filter(course => {
      // 搜尋條件：如果搜尋詞不為空，則必須匹配
      const matchesSearch = !activeSearchTerm || 
                           course.course_name.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(activeSearchTerm.toLowerCase());
      
      // 學系條件：如果選擇了學系，則必須匹配
      const matchesDepartment = !activeDepartment || activeDepartment === '' || course.department === activeDepartment;
      
      // 學院條件：如果選擇了學院，則必須匹配
      const department = departments.find(d => d.department_name === course.department);
      const matchesCollege = !activeCollege || activeCollege === '' || (department && department.college === activeCollege);
      
      // 學分範圍條件
      const matchesCreditRange = course.credits >= creditRange[0] && course.credits <= creditRange[1];
      
      // 可用性條件
      const matchesAvailability = !showAvailableOnly || course.current_enrollment < course.max_students;
      
      return matchesSearch && matchesDepartment && matchesCollege && matchesCreditRange && matchesAvailability;
    });

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.course_name.localeCompare(b.course_name);
        case 'credits':
          return b.credits - a.credits;
        case 'department':
          return a.department.localeCompare(b.department);
        default:
          return 0;
      }
    });

    console.log('搜尋結果:', { 
      activeSearchTerm, 
      activeDepartment, 
      activeCollege, 
      filteredCount: filtered.length,
      totalCourses: courses.length,
      sampleCourses: filtered.slice(0, 3).map(c => ({ name: c.course_name, dept: c.department }))
    });
    
    setIsLoading(false);
    return filtered;
  }, [courses, departments, activeSearchTerm, activeDepartment, activeCollege, creditRange, showAvailableOnly, sortBy, hasSearched]);

  // 分頁邏輯
  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const endIndex = startIndex + COURSES_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

  // 開始搜尋函數
  const handleStartSearch = useCallback(() => {
    console.log('開始搜尋:', { searchTerm, selectedDepartment, selectedCollege });
    setActiveSearchTerm(searchTerm);
    setActiveDepartment(selectedDepartment);
    setActiveCollege(selectedCollege);
    setHasSearched(true);
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedCollege]);

  // 清除搜尋函數
  const handleClearSearch = useCallback(() => {
    console.log('清除搜尋');
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedCollege('');
    setActiveSearchTerm('');
    setActiveDepartment('');
    setActiveCollege('');
    setHasSearched(false);
    setCurrentPage(1);
  }, []);


  // 當篩選條件改變時重置到第一頁
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // 當篩選條件改變時觸發重置
  React.useEffect(() => {
    handleFilterChange();
  }, [creditRange, showAvailableOnly, sortBy, handleFilterChange]);

  const colleges = useMemo(() => {
    return Array.from(new Set(departments.map(d => d.college)));
  }, [departments]);

  const isCourseSelected = (courseId: string) => {
    return state.selectedCourses.some(sc => sc.course.course_id === courseId);
  };

  // 解析時間段為更詳細的格式
  const parseTimeSlot = (timeSlot: string) => {
    if (timeSlot === 'TBA' || !timeSlot || timeSlot.trim() === '') return [];
    
    const slots = timeSlot.split(', ').filter(slot => slot !== 'TBA' && slot.trim() !== '');
    const parsedSlots = [];
    
    for (const slot of slots) {
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
        
        // A=18:30, B=19:30, C=20:30, D=21:30
        const timeMap: { [key: string]: string } = {
          'A': '18:30',
          'B': '19:30', 
          'C': '20:30',
          'D': '21:30'
        };
        
        if (dayMap[day]) {
          // 如果時間字符串長度大於1，表示有多個時間段 (如 "AB")
          if (timeStr.length > 1) {
            for (let i = 0; i < timeStr.length; i++) {
              const timeLetter = timeStr[i];
              if (timeMap[timeLetter]) {
                parsedSlots.push({
                  day: day,
                  timeNum: timeLetter,
                  startTime: timeMap[timeLetter],
                  fullTime: `${day}${timeLetter}`
                });
              }
            }
          } else {
            if (timeMap[timeStr]) {
              parsedSlots.push({
                day: day,
                timeNum: timeStr,
                startTime: timeMap[timeStr],
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
        // 如果是A、B、C，顯示具體時間
        if (['A', 'B', 'C'].includes(slot.timeNum)) {
          const timeMap: { [key: string]: string } = {
            'A': '18:30',
            'B': '19:30', 
            'C': '20:30'
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

  // 檢查課程是否與已選課程時間衝突
  const hasTimeConflict = (course: Course) => {
    if (course.time_slot === 'TBA') return false;
    
    const courseTimeSlots = parseTimeSlot(course.time_slot);
    
    return state.selectedCourses.some(selected => {
      if (selected.course.time_slot === 'TBA') return false;
      
      const selectedTimeSlots = parseTimeSlot(selected.course.time_slot);
      
      return courseTimeSlots.some(courseSlot => 
        selectedTimeSlots.some(selectedSlot => 
          courseSlot.day === selectedSlot.day &&
          (courseSlot.timeNum === selectedSlot.timeNum || 
           courseSlot.startTime === selectedSlot.startTime)
        )
      );
    });
  };

  // 獲取衝突的課程信息
  const getConflictInfo = (course: Course) => {
    if (course.time_slot === 'TBA') return null;
    
    const courseTimeSlots = parseTimeSlot(course.time_slot);
    
    for (const selected of state.selectedCourses) {
      if (selected.course.time_slot === 'TBA') continue;
      
      const selectedTimeSlots = parseTimeSlot(selected.course.time_slot);
      
      for (const courseSlot of courseTimeSlots) {
        for (const selectedSlot of selectedTimeSlots) {
          if (courseSlot.day === selectedSlot.day && 
              (courseSlot.timeNum === selectedSlot.timeNum || 
               courseSlot.startTime === selectedSlot.startTime)) {
            return {
              conflictingCourse: selected.course,
              timeSlot: courseSlot.fullTime
            };
          }
        }
      }
    }
    
    return null;
  };

  const handleAddCourse = (course: Course) => {
    dispatch({ type: 'ADD_COURSE', payload: course });
  };

  const handleRemoveCourse = (courseId: string) => {
    dispatch({ type: 'REMOVE_COURSE', payload: courseId });
  };

  const handleOpenDetail = (course: Course) => {
    setSelectedCourseDetail(course);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedCourseDetail(null);
  };

  const handleViewSelection = () => {
    dispatch({ type: 'SET_STEP', payload: 'selection' });
  };

  const handleAddToComparison = (course: Course) => {
    if (comparisonCourses.length < 4 && !comparisonCourses.find(c => c.course_id === course.course_id)) {
      setComparisonCourses([...comparisonCourses, course]);
    }
  };

  const handleRemoveFromComparison = (courseId: string) => {
    setComparisonCourses(comparisonCourses.filter(c => c.course_id !== courseId));
  };

  const handleClearComparison = () => {
    setComparisonCourses([]);
  };

  const isInComparison = (courseId: string) => {
    return comparisonCourses.some(c => c.course_id === courseId);
  };

  return (
    <Box sx={{ 
      p: 3,
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
      {/* 購物車組件 */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <CourseCart onViewCart={handleViewSelection} />
      </Box>
      
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
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
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
            <School sx={{ fontSize: 28 }} />
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
              課程瀏覽
            </Typography>
            <Typography variant="body2" color="black" sx={{ mt: 0.5 }}>
              探索台大豐富的課程資源，找到最適合您的學習選擇
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'black' }}>
            快速篩選
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="搜尋課程、教師或描述"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <Search sx={{ color: 'primary.main' }} />
                    </Box>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>學系</InputLabel>
                <Select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  disabled={hasSearched}
                  sx={{
                    backgroundColor: hasSearched ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: hasSearched ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: hasSearched ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <MenuItem value="">全部學系</MenuItem>
                  {departments.map(dept => (
                    <MenuItem key={dept.department_id} value={dept.department_name}>
                      {dept.department_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>學院</InputLabel>
                <Select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  disabled={hasSearched}
                  sx={{
                    backgroundColor: hasSearched ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: hasSearched ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: hasSearched ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <MenuItem value="">全部學院</MenuItem>
                  {colleges.map(college => (
                    <MenuItem key={college} value={college}>
                      {college}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* 搜尋/清除按鈕 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            {!hasSearched ? (
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={handleStartSearch}
                disabled={!selectedDepartment && !selectedCollege && !searchTerm}
                sx={{
                  background: 'linear-gradient(45deg, #42a5f5 30%, #66bb6a 90%)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(66, 165, 245, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976d2 30%, #4caf50 90%)',
                    boxShadow: '0 6px 20px rgba(66, 165, 245, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'grey.400',
                    color: 'grey.600',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                開始搜尋
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClearSearch}
                sx={{
                  borderColor: '#f44336',
                  color: '#f44336',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#d32f2f',
                    backgroundColor: 'rgba(244, 67, 54, 0.04)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                清除搜尋
              </Button>
            )}
          </Box>
        </Box>

        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterList sx={{ mr: 1 }} />
              <Typography>進階篩選</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography gutterBottom>學分範圍</Typography>
                <Slider
                  value={creditRange}
                  onChange={(_, newValue) => setCreditRange(newValue as number[])}
                  valueLabelDisplay="auto"
                  min={0}
                  max={6}
                  step={1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 2, label: '2' },
                    { value: 4, label: '4' },
                    { value: 6, label: '6' }
                  ]}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>排序方式</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'credits' | 'department')}
                  >
                    <MenuItem value="name">課程名稱</MenuItem>
                    <MenuItem value="credits">學分數</MenuItem>
                    <MenuItem value="department">學系</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showAvailableOnly}
                      onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    />
                  }
                  label="只顯示有選課名額的課程"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {hasSearched ? (
                <>找到 {filteredCourses.length} 門課程{totalPages > 1 && ` (第 ${currentPage}/${totalPages} 頁)`}</>
              ) : (
                <>請設定搜尋條件並點擊「開始搜尋」</>
              )}
            </Typography>
            
            
            {state.selectedCourses.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={<CheckCircle />}
                  label={`已選 ${state.selectedCourses.length} 門課程`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<School />}
                  label={`總學分：${getTotalCredits()}/25`}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
          
          {state.selectedCourses.length > 0 && (
            <Button
              variant="contained"
              onClick={handleViewSelection}
              sx={{ ml: 2 }}
            >
              查看選課清單 ({state.selectedCourses.length})
            </Button>
          )}
        </Box>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : !hasSearched ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          py: 8,
          textAlign: 'center'
        }}>
          <Search sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            開始搜尋課程
          </Typography>
          <Typography variant="body1" color="text.secondary">
            請在上方設定搜尋條件，然後點擊「開始搜尋」按鈕
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedCourses.map(course => (
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }} key={course.course_id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: hasTimeConflict(course) 
                ? '2px solid #ff9800' 
                : '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 3,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                '&::before': {
                  opacity: 1,
                },
              }
            }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    color: 'text.primary',
                    lineHeight: 1.3
                  }}>
                    {course.course_name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Chip
                      label={course.department}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                    <Chip
                      label={`${course.credits} 學分`}
                      size="small"
                      color="secondary"
                      variant="filled"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  {/* 時間和教室信息顯示在上方 */}
                  <Box sx={{ 
                    p: 1.5, 
                    mb: 1.5, 
                    borderRadius: 2, 
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)',
                    border: '1px solid rgba(25, 118, 210, 0.1)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="body2" color="primary.main" fontWeight="600">
                        上課時間
                      </Typography>
                    </Box>
                    {course.time_slot === 'TBA' || !course.time_slot || course.time_slot.trim() === '' ? (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                        時間待定
                      </Typography>
                    ) : (
                      <Box sx={{ ml: 3 }}>
                        {getGroupedTimeSlots(course.time_slot).length > 0 ? (
                          getGroupedTimeSlots(course.time_slot).map((group, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Chip
                                label={group.day}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  minWidth: 40,
                                  fontSize: '0.7rem',
                                  height: 20,
                                  color: 'primary.main',
                                  borderColor: 'primary.main'
                                }}
                              />
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                {group.times.some(time => time.includes('A(') || time.includes('B(') || time.includes('C(')) 
                                  ? group.times.join(', ') 
                                  : `第${group.times.join('')}節`
                                }
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {course.time_slot}
                          </Typography>
                        )}
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="caption" sx={{ color: 'white', fontSize: '0.6rem' }}>室</Typography>
                      </Box>
                      <Typography variant="body2" color="primary.main" fontWeight="600">
                        教室
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                      {course.classroom}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ 
                  mb: 2, 
                  color: 'text.secondary',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {course.description.replace(/選課說明/g, '加簽類別')}
                </Typography>
                
                {course.prerequisites !== '無' && (
                  <Chip
                    label={course.prerequisites === '先修' ? '先修' : `先修：${course.prerequisites}`}
                    size="small"
                    color="warning"
                    sx={{ mb: 1 }}
                  />
                )}
                
                <Box sx={{ 
                  mt: 'auto',
                  pt: 2,
                  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {course.tno > 0 && (
                        <Tooltip title="人數限制">
                          <Chip
                            icon={<People />}
                            label={`限制${course.tno}人`}
                            size="small"
                            variant="outlined"
                            color="info"
                            sx={{ fontWeight: 500 }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                    
                    {/* 時間衝突警告 */}
                    {hasTimeConflict(course) && (
                      <Tooltip 
                        title={
                          (() => {
                            const conflictInfo = getConflictInfo(course);
                            return conflictInfo 
                              ? `與「${conflictInfo.conflictingCourse.course_name}」在 ${conflictInfo.timeSlot} 時間衝突`
                              : '此課程與已選課程時間衝突';
                          })()
                        }
                      >
                        <Warning color="warning" fontSize="small" />
                      </Tooltip>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {/* 詳情按鈕 */}
                    <Tooltip title="查看課程詳情">
                      <IconButton
                        onClick={() => handleOpenDetail(course)}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          background: 'linear-gradient(45deg, #42a5f5 30%, #66bb6a 90%)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1976d2 30%, #4caf50 90%)',
                          }
                        }}
                      >
                        <Info fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* 購物車按鈕 */}
                    {isCourseSelected(course.course_id) ? (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<RemoveShoppingCart />}
                        onClick={() => handleRemoveCourse(course.course_id)}
                        size="small"
                        sx={{ 
                          borderRadius: 2,
                          flex: 1,
                          fontWeight: 600,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                          }
                        }}
                      >
                        移除
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<AddShoppingCart />}
                        onClick={() => handleAddCourse(course)}
                        disabled={
                          (course.max_students > 0 && course.current_enrollment >= course.max_students) ||
                          hasTimeConflict(course) ||
                          (state.selectedCourses.reduce((sum, sc) => sum + sc.course.credits, 0) + course.credits > 25)
                        }
                        size="small"
                        sx={{ 
                          borderRadius: 2,
                          flex: 1,
                          fontWeight: 600,
                          background: hasTimeConflict(course) 
                            ? 'grey.400' 
                            : (state.selectedCourses.reduce((sum, sc) => sum + sc.course.credits, 0) + course.credits > 25)
                            ? 'grey.400'
                            : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                          '&:hover': {
                            background: hasTimeConflict(course) 
                              ? 'grey.400' 
                              : (state.selectedCourses.reduce((sum, sc) => sum + sc.course.credits, 0) + course.credits > 25)
                              ? 'grey.400'
                              : 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                          },
                          cursor: hasTimeConflict(course) || (state.selectedCourses.reduce((sum, sc) => sum + sc.course.credits, 0) + course.credits > 25) ? 'not-allowed' : 'pointer',
                          pointerEvents: 'auto'
                        }}
                      >
                        {hasTimeConflict(course) ? '時間衝突' : 
                         (state.selectedCourses.reduce((sum, sc) => sum + sc.course.credits, 0) + course.credits > 25) ? '學分超限' : '加入選課'}
                      </Button>
                    )}
                    
                    {/* 比較按鈕 */}
                    <Tooltip title={isInComparison(course.course_id) ? "已加入比較" : "加入比較"}>
                      <IconButton
                        size="small"
                        onClick={() => isInComparison(course.course_id) 
                          ? handleRemoveFromComparison(course.course_id)
                          : handleAddToComparison(course)
                        }
                        color={isInComparison(course.course_id) ? "primary" : "default"}
                        disabled={!isInComparison(course.course_id) && comparisonCourses.length >= 4}
                        sx={{ 
                          borderRadius: 2,
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                          }
                        }}
                      >
                        <Compare fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
          </Grid>
          
          {/* 分頁組件 */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {comparisonCourses.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <CourseComparison
            courses={comparisonCourses}
            onRemoveCourse={handleRemoveFromComparison}
            onClearComparison={handleClearComparison}
          />
        </Box>
      )}

      {/* 課程詳情彈窗 */}
      <CourseDetail
        open={detailOpen}
        onClose={handleCloseDetail}
        course={selectedCourseDetail}
      />
    </Box>
  );
};

export default CourseBrowser;
