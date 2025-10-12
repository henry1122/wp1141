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
  Divider,
  IconButton,
  Collapse
} from '@mui/material';
import { 
  ArrowBack, 
  Schedule, 
  School, 
  Assignment,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

const AllRecords: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [expandedRecords, setExpandedRecords] = React.useState<Set<string>>(new Set());

  const handleBackToSubmission = () => {
    dispatch({ type: 'SET_STEP', payload: 'submission' });
  };

  const handleBackToBrowsing = () => {
    dispatch({ type: 'SET_STEP', payload: 'browsing' });
  };

  const toggleRecordExpansion = (recordId: string) => {
    const newExpanded = new Set(expandedRecords);
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId);
    } else {
      newExpanded.add(recordId);
    }
    setExpandedRecords(newExpanded);
  };

  const getTotalCredits = (courses: any[]) => {
    return courses.reduce((sum, course) => sum + course.credits, 0);
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
      {/* 標題和返回按鈕 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        position: 'relative',
        zIndex: 1
      }}>
        <IconButton 
          onClick={handleBackToSubmission}
          sx={{ 
            mr: 2, 
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold', 
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          background: 'linear-gradient(45deg, #fff, #f0f0f0)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          所有提交記錄
        </Typography>
      </Box>

      {/* 統計信息 */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)'
        }
      }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ 
              textAlign: 'center',
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <Typography variant="h2" sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                {state.submittedRecords.length}
              </Typography>
              <Typography variant="h6" sx={{ 
                opacity: 0.95,
                fontWeight: 500
              }}>
                總提交次數
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ 
              textAlign: 'center',
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <Typography variant="h2" sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                {state.submittedRecords.length > 0 ? state.submittedRecords[state.submittedRecords.length - 1].courses.length : 0}
              </Typography>
              <Typography variant="h6" sx={{ 
                opacity: 0.95,
                fontWeight: 500
              }}>
                最新選課數
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ 
              textAlign: 'center',
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <Typography variant="h2" sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                {state.submittedRecords.length > 0 ? getTotalCredits(state.submittedRecords[state.submittedRecords.length - 1].courses) : 0}
              </Typography>
              <Typography variant="h6" sx={{ 
                opacity: 0.95,
                fontWeight: 500
              }}>
                最新學分數
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 記錄列表 */}
      {state.submittedRecords.length === 0 ? (
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1
        }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" sx={{ 
              color: 'black', 
              fontWeight: 'bold',
              mb: 2
            }}>
              尚無提交記錄
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'black',
              mb: 3
            }}>
              您還沒有提交過任何選課記錄
            </Typography>
            <Button
              variant="contained"
              onClick={handleBackToBrowsing}
              sx={{ 
                mt: 2,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              開始選課
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'relative', zIndex: 1 }}>
          {state.submittedRecords
            .slice()
            .reverse()
            .map((record, index) => {
              const isExpanded = expandedRecords.has(record.id);
              const totalCredits = getTotalCredits(record.courses);
              
              return (
                <Card key={record.id} sx={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    transform: 'translateY(-4px)',
                  },
                  transition: 'all 0.3s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${index % 3 === 0 ? '#667eea, #764ba2' : index % 3 === 1 ? '#f093fb, #f5576c' : '#4facfe, #00f2fe'})`
                  }
                }}>
                  <CardContent>
                    {/* 記錄標題 */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={`第 ${state.submittedRecords.length - index} 次提交`}
                          color="primary"
                          size="small"
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {record.submittedAt.toLocaleString()}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => toggleRecordExpansion(record.id)}
                        sx={{ 
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <ExpandMore />
                      </IconButton>
                    </Box>

                    {/* 記錄摘要 */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<School />}
                        label={`${record.courses.length} 門課程`}
                        sx={{
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          color: 'white',
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                      />
                      <Chip
                        icon={<Schedule />}
                        label={`${totalCredits} 學分`}
                        sx={{
                          background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)',
                          color: 'white',
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                      />
                      <Chip
                        icon={<Assignment />}
                        label={record.status === 'submitted' ? '已提交' : '待處理'}
                        sx={{
                          background: record.status === 'submitted' 
                            ? 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)'
                            : 'linear-gradient(45deg, #ff9800 30%, #ffc107 90%)',
                          color: 'white',
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                      />
                    </Box>

                    {/* 課程詳情 */}
                    <Collapse in={isExpanded}>
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                          課程詳情
                        </Typography>
                        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                          {record.courses.map((course, courseIndex) => (
                            <React.Fragment key={course.course_id}>
                              <ListItem sx={{ py: 1.5 }}>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {course.course_name}
                                      </Typography>
                                      <Chip 
                                        label={`${course.credits}學分`} 
                                        size="small" 
                                        color="primary" 
                                        variant="outlined"
                                      />
                                    </Box>
                                  }
                                  secondary={
                                    <Box sx={{ mt: 0.5 }}>
                                      <Typography variant="body2" color="black">
                                        學系：{course.department} | 教師：{course.instructor}
                                      </Typography>
                                      <Typography variant="body2" color="black">
                                        時間：{course.time_slot} | 教室：{course.classroom}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </ListItem>
                              {courseIndex < record.courses.length - 1 && <Divider />}
                            </React.Fragment>
                          ))}
                        </List>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              );
            })}
        </Box>
      )}

      {/* 底部按鈕 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 3, 
        mt: 6,
        position: 'relative',
        zIndex: 1
      }}>
        <Button
          variant="outlined"
          onClick={handleBackToSubmission}
          sx={{ 
            minWidth: 140,
            py: 1.5,
            px: 3,
            borderRadius: 3,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            fontSize: '1rem',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          返回提交結果
        </Button>
        <Button
          variant="contained"
          onClick={handleBackToBrowsing}
          sx={{ 
            minWidth: 140,
            py: 1.5,
            px: 3,
            borderRadius: 3,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
              background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          繼續瀏覽課程
        </Button>
      </Box>
    </Box>
  );
};

export default AllRecords;
