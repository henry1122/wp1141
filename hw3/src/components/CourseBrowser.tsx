import React, { useState, useMemo } from 'react';
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
  Divider
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { Course, Department } from '../types';
import { useAppContext } from '../context/AppContext';

interface CourseBrowserProps {
  courses: Course[];
  departments: Department[];
}

const CourseBrowser: React.FC<CourseBrowserProps> = ({ courses, departments }) => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = !selectedDepartment || course.department === selectedDepartment;
      
      const department = departments.find(d => d.department_name === course.department);
      const matchesCollege = !selectedCollege || (department && department.college === selectedCollege);
      
      return matchesSearch && matchesDepartment && matchesCollege;
    });
  }, [courses, departments, searchTerm, selectedDepartment, selectedCollege]);

  const colleges = useMemo(() => {
    return [...new Set(departments.map(d => d.college))];
  }, [departments]);

  const isCourseSelected = (courseId: string) => {
    return state.selectedCourses.some(sc => sc.course.course_id === courseId);
  };

  const handleAddCourse = (course: Course) => {
    dispatch({ type: 'ADD_COURSE', payload: course });
  };

  const handleRemoveCourse = (courseId: string) => {
    dispatch({ type: 'REMOVE_COURSE', payload: courseId });
  };

  const handleViewSelection = () => {
    dispatch({ type: 'SET_STEP', payload: 'selection' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          課程瀏覽
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="搜尋課程"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>學系</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
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
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>學院</InputLabel>
              <Select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            找到 {filteredCourses.length} 門課程
          </Typography>
          
          {state.selectedCourses.length > 0 && (
            <Button
              variant="contained"
              onClick={handleViewSelection}
              sx={{ ml: 2 }}
            >
              查看已選課程 ({state.selectedCourses.length})
            </Button>
          )}
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {filteredCourses.map(course => (
          <Grid item xs={12} md={6} lg={4} key={course.course_id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {course.course_name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {course.department} • {course.credits} 學分
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  授課教師：{course.instructor}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  時間：{course.time_slot}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  教室：{course.classroom}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {course.description}
                </Typography>
                
                {course.prerequisites !== '無' && (
                  <Chip
                    label={`先修：${course.prerequisites}`}
                    size="small"
                    color="warning"
                    sx={{ mb: 1 }}
                  />
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    選課人數：{course.current_enrollment}/{course.max_students}
                  </Typography>
                  
                  {isCourseSelected(course.course_id) ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveCourse(course.course_id)}
                    >
                      移除
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleAddCourse(course)}
                      disabled={course.current_enrollment >= course.max_students}
                    >
                      加入選課清單
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseBrowser;

