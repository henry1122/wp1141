import { useState, useEffect } from 'react';
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
        
        // Load courses data
        const coursesResponse = await fetch('/data/courses.csv');
        const coursesText = await coursesResponse.text();
        const coursesData = Papa.parse(coursesText, {
          header: true,
          skipEmptyLines: true,
          transform: (value, field) => {
            if (field === 'credits' || field === 'max_students' || field === 'current_enrollment') {
              return parseInt(value, 10);
            }
            return value;
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

  return { courses, departments, loading, error };
};
