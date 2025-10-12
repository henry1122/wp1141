import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Course, Department } from '../types';

export const useDataLoader = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load courses data with streaming for large files
        const coursesResponse = await fetch('/data/courses.csv');
        const coursesText = await coursesResponse.text();
        
        const coursesData = Papa.parse(coursesText, {
          header: true,
          skipEmptyLines: true,
          transform: (value, field) => {
            if (field === 'credits' || field === 'max_students' || field === 'current_enrollment') {
              // 處理空字符串和無效值
              const numValue = parseInt(value, 10);
              return isNaN(numValue) ? 0 : numValue;
            }
            return value;
          },
          // 添加進度回調來顯示載入進度
          complete: (results) => {
            console.log('Courses loaded:', results.data.length);
          }
        });
        
        // Load departments data
        const departmentsResponse = await fetch('/data/departments.csv');
        const departmentsText = await departmentsResponse.text();
        const departmentsData = Papa.parse(departmentsText, {
          header: true,
          skipEmptyLines: true
        });

        setCourses(coursesData.data as Course[]);
        setDepartments(departmentsData.data as Department[]);
        setError(null);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 記憶化處理後的數據，避免重複計算
  const processedCourses = useMemo(() => {
    return courses.filter(course => 
      course.course_name && 
      course.course_name.trim() !== '' &&
      course.course_id
    );
  }, [courses]);

  return { 
    courses: processedCourses, 
    departments, 
    loading, 
    error,
    totalCourses: courses.length 
  };
};
