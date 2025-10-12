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
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { CheckCircle, Schedule, School, Assignment } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

const SubmissionResult: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const handleBackToBrowsing = () => {
    dispatch({ type: 'SET_STEP', payload: 'browsing' });
  };

  const handleViewRecords = () => {
    // This could navigate to a records view or show a modal
    console.log('View all records');
  };

  const latestRecord = state.submittedRecords[state.submittedRecords.length - 1];

  if (!latestRecord) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          沒有找到提交記錄
        </Alert>
        <Button
          variant="contained"
          onClick={handleBackToBrowsing}
          sx={{ mt: 2 }}
        >
          返回課程瀏覽
        </Button>
      </Box>
    );
  }

  const totalCredits = latestRecord.courses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircle color="success" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4">
            選課提交成功！
          </Typography>
        </Box>
        
        <Alert severity="success" sx={{ mb: 2 }}>
          您的選課申請已成功提交，記錄編號：{latestRecord.id}
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip
            icon={<School />}
            label={`已選 ${latestRecord.courses.length} 門課程`}
            color="primary"
          />
          <Chip
            icon={<Schedule />}
            label={`總學分：${totalCredits}`}
            color="secondary"
          />
          <Chip
            icon={<Assignment />}
            label={`提交時間：${latestRecord.submittedAt.toLocaleString()}`}
            color="default"
          />
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                已選課程清單
              </Typography>
              
              <List>
                {latestRecord.courses.map((course, index) => (
                  <React.Fragment key={course.course_id}>
                    <ListItem>
                      <ListItemText
                        primary={course.course_name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {course.department} • {course.credits} 學分 • {course.instructor}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {course.time_slot} • {course.classroom}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < latestRecord.courses.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                選課摘要
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  課程數量
                </Typography>
                <Typography variant="h6">
                  {latestRecord.courses.length} 門
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  總學分數
                </Typography>
                <Typography variant="h6">
                  {totalCredits} 學分
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  提交時間
                </Typography>
                <Typography variant="body2">
                  {latestRecord.submittedAt.toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  記錄狀態
                </Typography>
                <Chip
                  label={latestRecord.status === 'submitted' ? '已提交' : '已確認'}
                  color={latestRecord.status === 'submitted' ? 'warning' : 'success'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">
              下一步
            </Typography>
            <Typography variant="body2" color="text.secondary">
              您可以繼續瀏覽其他課程或查看您的選課記錄
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleViewRecords}
            >
              查看所有記錄
            </Button>
            <Button
              variant="contained"
              onClick={handleBackToBrowsing}
            >
              繼續瀏覽課程
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SubmissionResult;









