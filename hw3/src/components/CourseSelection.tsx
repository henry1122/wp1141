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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import { Delete, Schedule, School, Person } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

const CourseSelection: React.FC = () => {
  const { state, dispatch } = useAppContext();

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

  const totalCredits = state.selectedCourses.reduce((sum, sc) => sum + sc.course.credits, 0);

  // Check for time conflicts
  const timeSlots = state.selectedCourses.map(sc => sc.course.time_slot);
  const hasTimeConflict = timeSlots.some((slot, index) => 
    timeSlots.slice(index + 1).some(otherSlot => 
      slot.split(' ')[1] === otherSlot.split(' ')[1] && // Same day
      slot.split(' ')[2] === otherSlot.split(' ')[2]    // Same time
    )
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">
            選課清單
          </Typography>
          
          <Box>
            <Button
              variant="outlined"
              onClick={handleBackToBrowsing}
              sx={{ mr: 1 }}
            >
              繼續瀏覽課程
            </Button>
            
            {state.selectedCourses.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearAll}
              >
                清空清單
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip
            icon={<School />}
            label={`已選 ${state.selectedCourses.length} 門課程`}
            color="primary"
          />
          <Chip
            icon={<Schedule />}
            label={`總學分：${totalCredits}`}
            color="secondary"
          />
        </Box>

        {hasTimeConflict && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            注意：您的選課清單中有時間衝突的課程，請檢查後再提交。
          </Alert>
        )}
      </Paper>

      {state.selectedCourses.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              選課清單為空
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
          <Grid container spacing={2}>
            {state.selectedCourses.map((selection, index) => (
              <Grid item xs={12} md={6} key={selection.course.course_id}>
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
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
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
                      <Typography variant="body2">
                        {selection.course.time_slot}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      教室：{selection.course.classroom}
                    </Typography>
                    
                    {selection.course.prerequisites !== '無' && (
                      <Chip
                        label={`先修：${selection.course.prerequisites}`}
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

          <Paper sx={{ p: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">
                  選課摘要
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  共 {state.selectedCourses.length} 門課程，總計 {totalCredits} 學分
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmitSelection}
                disabled={hasTimeConflict}
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

