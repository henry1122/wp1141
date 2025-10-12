import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Course, CourseSelection, SubmittedRecord } from '../types';

interface AppState {
  selectedCourses: CourseSelection[];
  submittedRecords: SubmittedRecord[];
  currentStep: 'browsing' | 'selection' | 'submission' | 'allRecords';
}

type AppAction =
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'REMOVE_COURSE'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SUBMIT_SELECTION' }
  | { type: 'SET_STEP'; payload: 'browsing' | 'selection' | 'submission' | 'allRecords' }
  | { type: 'CONFIRM_RECORD'; payload: string };

const initialState: AppState = {
  selectedCourses: [],
  submittedRecords: [],
  currentStep: 'browsing'
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_COURSE':
      const existingIndex = state.selectedCourses.findIndex(
        sc => sc.course.course_id === action.payload.course_id
      );
      if (existingIndex === -1) {
        return {
          ...state,
          selectedCourses: [
            ...state.selectedCourses,
            { course: action.payload, timestamp: new Date() }
          ]
        };
      }
      return state;

    case 'REMOVE_COURSE':
      return {
        ...state,
        selectedCourses: state.selectedCourses.filter(
          sc => sc.course.course_id !== action.payload
        )
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedCourses: []
      };

    case 'SUBMIT_SELECTION':
      const newRecord: SubmittedRecord = {
        id: Date.now().toString(),
        courses: state.selectedCourses.map(sc => sc.course),
        submittedAt: new Date(),
        status: 'submitted'
      };
      return {
        ...state,
        submittedRecords: [...state.submittedRecords, newRecord],
        selectedCourses: [],
        currentStep: 'submission'
      };

    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload
      };

    case 'CONFIRM_RECORD':
      return {
        ...state,
        submittedRecords: state.submittedRecords.map(record =>
          record.id === action.payload
            ? { ...record, status: 'confirmed' }
            : record
        )
      };

    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
