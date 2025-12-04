// types/index.ts - TypeScript type definitions

export interface Student {
    id: string;
    name: string;
    email: string;
    grade: string;
    course: string;
    teacher_id?: string;
    latest_cwpm?: number;
    created_at?: string;
}

export interface Assessment {
    id: string;
    student_id: string;
    passage: string;
    cwpm_score: number;
    total_words: number;
    total_correct: number;
    total_missed: number;
    total_incorrect: number;
    total_extras: number;
    assessment_date: string;
    created_at?: string;
}

export interface WordResult {
    id?: string;
    assessment_id: string;
    word_text: string;
    student_answer: string | null;
    word_type: 'correct' | 'missed' | 'extra' | 'incorrect' | 'right';
    word_position: number;
    timestamp_start: number;
    timestamp_end: number;
}

export interface PerformanceData {
    date: string;
    cwpm_score: number;
    total_correct: number;
    total_missed: number;
    total_incorrect: number;
    total_extras: number;
}

export interface StudentData {
    student: Student;
    assessments: Assessment[];
}

export interface AssessmentDetails {
    assessment: Assessment;
    words: WordResult[];
}

export interface JSONWord {
    Word: string;
    Align: string;
    error: string;
    start: number;
    end: number;
}

export interface JSONData {
    cwpm: number;
    words: JSONWord[];
}

export interface AssessmentWord {
    text: string;
    answer: string | null;
    type: 'correct' | 'missed' | 'extra' | 'incorrect';
    timestampStart: number;
    timestampEnd: number;
}

export interface AssessmentData {
    studentId: string;
    studentName: string;
    grade: string;
    passage: string;
    words: AssessmentWord[];
    errors: {
        correct: number;
        missed: number;
        extra: number;
        incorrect: number;
    };
}

export interface StudentFormData {
    name: string;
    email: string;
    password: string;
    grade: string;
    course: string;
}

export interface AssessmentFormData {
    assessmentDate: string;
    passage: string;
    cwpmScore: string;
}

export interface CreateAssessmentData {
    student_id: string;
    passage: string;
    cwpm_score: number;
    words: Array<{
        text: string;
        type: string;
        answer: string | null;
        start: number;
        end: number;
    }>;
    assessment_date: string;
}


