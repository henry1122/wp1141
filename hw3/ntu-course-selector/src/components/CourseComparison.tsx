import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import { Close, Compare, School, Schedule, People, Person } from '@mui/icons-material';
import { Course } from '../types';

interface CourseComparisonProps {
  courses: Course[];
  onRemoveCourse: (courseId: string) => void;
  onClearComparison: () => void;
}

const CourseComparison: React.FC<CourseComparisonProps> = ({
  courses,
  onRemoveCourse,
  onClearComparison
}) => {
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Compare sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            課程比較
          </Typography>
          <Typography variant="body2" color="text.secondary">
            選擇 2-4 門課程進行比較
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const comparisonFields = [
    { key: 'course_name', label: '課程名稱', icon: <School /> },
    { key: 'department', label: '學系', icon: <School /> },
    { key: 'credits', label: '學分', icon: <School /> },
    { key: 'instructor', label: '授課教師', icon: <Person /> },
    { key: 'time_slot', label: '上課時間', icon: <Schedule /> },
    { key: 'classroom', label: '教室', icon: <School /> },
    { key: 'prerequisites', label: '先修課程', icon: <School /> },
    { key: 'enrollment', label: '選課人數', icon: <People /> },
    { key: 'description', label: '課程描述', icon: <School /> }
  ];

  return (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.1) 100%)',
          border: '1px solid rgba(25, 118, 210, 0.2)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compare sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                課程比較 ({courses.length} 門課程)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                並排比較課程詳細資訊
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="outlined"
            color="error"
            onClick={onClearComparison}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            清空比較
          </Button>
        </Box>

        <TableContainer 
          component={Paper} 
          sx={{ 
            maxHeight: 600,
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  minWidth: 120, 
                  fontWeight: 700,
                  backgroundColor: 'rgba(25, 118, 210, 0.05)',
                  borderBottom: '2px solid rgba(25, 118, 210, 0.2)',
                  color: 'text.primary'
                }}>
                  比較項目
                </TableCell>
                {courses.map((course, index) => (
                  <TableCell 
                    key={course.course_id} 
                    sx={{ 
                      minWidth: 200, 
                      position: 'relative',
                      backgroundColor: 'rgba(25, 118, 210, 0.05)',
                      borderBottom: '2px solid rgba(25, 118, 210, 0.2)',
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 1,
                      borderRadius: 1,
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(25, 118, 210, 0.1)'
                    }}>
                      <Typography variant="subtitle2" fontWeight="700" color="primary">
                        課程 {index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => onRemoveCourse(course.course_id)}
                        sx={{ 
                          ml: 1,
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          }
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {comparisonFields.map((field) => (
                <TableRow key={field.key}>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {field.icon}
                      <Typography sx={{ ml: 1 }}>
                        {field.label}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {courses.map((course) => (
                    <TableCell key={`${course.course_id}-${field.key}`}>
                      {field.key === 'enrollment' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={`${course.current_enrollment}/${course.max_students}`}
                            size="small"
                            color={course.current_enrollment >= course.max_students ? 'error' : 'default'}
                          />
                          {course.current_enrollment >= course.max_students && (
                            <Chip label="已滿" size="small" color="error" />
                          )}
                        </Box>
                      ) : field.key === 'prerequisites' && course.prerequisites !== '無' ? (
                        <Chip
                          label={course.prerequisites}
                          size="small"
                          color="warning"
                        />
                      ) : field.key === 'description' ? (
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {course.description.length > 100 
                            ? `${course.description.substring(0, 100)}...` 
                            : course.description
                          }
                        </Typography>
                      ) : (
                        <Typography variant="body2">
                          {course[field.key as keyof Course] || 'N/A'}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`比較 ${courses.length} 門課程`}
            color="primary"
            size="small"
          />
          <Chip
            label={`總學分：${courses.reduce((sum, course) => sum + course.credits, 0)}/25`}
            color="secondary"
            size="small"
          />
          <Chip
            label={`平均學分：${(courses.reduce((sum, course) => sum + course.credits, 0) / courses.length).toFixed(1)}`}
            color="default"
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseComparison;
