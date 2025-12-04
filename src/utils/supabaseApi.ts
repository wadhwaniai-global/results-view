// supabaseApi.ts - Supabase API utilities for React
import { supabaseClient } from '../config';
import type { JSONData, AssessmentDetails, Student, StudentData, PerformanceData, Assessment, WordResult, CreateAssessmentData } from '../types';

// Student IDs and names (from data.sql)
const EMMA_JOHNSON_ID = '650e8400-e29b-41d4-a716-446655440001';
const EMMA_JOHNSON_NAME = 'Emma Johnson';
const LIAM_SMITH_ID = '650e8400-e29b-41d4-a716-446655440002';
const LIAM_SMITH_NAME = 'Liam Smith';
const OLIVIA_DAVIS_ID = '650e8400-e29b-41d4-a716-446655440003';
const OLIVIA_DAVIS_NAME = 'Olivia Davis';

interface StudentJSONMap {
    [key: string]: { name: string; file: string };
}

// Mapping of students to their JSON files
const STUDENT_JSON_MAP: StudentJSONMap = {
    [EMMA_JOHNSON_ID]: { name: EMMA_JOHNSON_NAME, file: 'test_input.json' },
    [LIAM_SMITH_ID]: { name: LIAM_SMITH_NAME, file: 'test_input3.json' },
    [OLIVIA_DAVIS_ID]: { name: OLIVIA_DAVIS_NAME, file: 'test_input2.json' }
};

// Cache for JSON data
const jsonDataCache: Record<string, JSONData> = {};

// Load JSON data from specified file (always fresh, no caching)
export async function loadJSONData(filename: string): Promise<JSONData | null> {
    try {
        const response = await fetch(`/${filename}?t=${Date.now()}`);
        if (!response.ok) {
            console.warn(`Could not load ${filename}`);
            return null;
        }
        const data = await response.json() as JSONData;
        jsonDataCache[filename] = data;
        return data;
    } catch (error) {
        console.error(`Error loading JSON data from ${filename}:`, error);
        return null;
    }
}

// Get JSON file for a student
export function getStudentJSONFile(studentId: string, studentName: string | null): string | null {
    // Check by ID first
    if (STUDENT_JSON_MAP[studentId]) {
        return STUDENT_JSON_MAP[studentId].file;
    }
    
    // Check by name
    for (const [id, info] of Object.entries(STUDENT_JSON_MAP)) {
        if (studentName && (studentName === info.name || 
            (typeof studentName === 'string' && 
             studentName.toLowerCase().includes(info.name.split(' ')[0].toLowerCase()) &&
             studentName.toLowerCase().includes(info.name.split(' ')[1]?.toLowerCase())))) {
            return info.file;
        }
    }
    
    return null;
}

// Transform JSON data to assessment format
export function transformJSONToAssessment(jsonData: JSONData, studentId: string): AssessmentDetails | null {
    if (!jsonData || !jsonData.words || !Array.isArray(jsonData.words)) {
        return null;
    }

    const words = jsonData.words;
    const passage = words.map(w => w.Word).join(' ');
    
    // Count error types
    let total_correct = 0;
    let total_missed = 0;
    let total_incorrect = 0;
    let total_extras = 0;
    
    words.forEach(word => {
        const errorType = word.error?.toLowerCase();
        if (errorType === 'right' || errorType === 'correct') {
            total_correct++;
        } else if (errorType === 'missed') {
            total_missed++;
        } else if (errorType === 'incorrect') {
            total_incorrect++;
        } else if (errorType === 'extra') {
            total_extras++;
        }
    });

    // Create assessment object
    const studentInfo = STUDENT_JSON_MAP[studentId];
    const studentKey = studentInfo ? studentInfo.name.toLowerCase().replace(/\s+/g, '-') : 'student';
    const assessment: Assessment = {
        id: `json-assessment-${studentKey}`,
        student_id: studentId,
        passage: passage,
        cwpm_score: parseFloat(String(jsonData.cwpm)) || 0,
        total_words: words.length,
        total_correct: total_correct,
        total_missed: total_missed,
        total_incorrect: total_incorrect,
        total_extras: total_extras,
        assessment_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
    };

    // Transform words to expected format
    const transformedWords: WordResult[] = words.map((word, index) => {
        let wordType = word.error?.toLowerCase();
        if (wordType === 'right') {
            wordType = 'correct';
        }
        
        return {
            id: 'json-word-' + index,
            assessment_id: assessment.id,
            word_text: word.Word || '',
            student_answer: word.Align || null,
            word_type: (wordType || 'correct') as WordResult['word_type'],
            word_position: index + 1,
            timestamp_start: parseFloat(String(word.start)) || 0,
            timestamp_end: parseFloat(String(word.end)) || 0
        };
    });

    return {
        assessment: assessment,
        words: transformedWords
    };
}

interface StudentFormData {
    name: string;
    email: string;
    password: string;
    grade: string;
    course: string;
}

// Supabase API functions
export const supabaseApi = {
    // Get all students with latest CWPM
    getStudents: async (): Promise<Student[]> => {
        try {
            const { data, error } = await supabaseClient
                .from('student_performance')
                .select('*')
                .order('name');
            
            if (error) throw error;
            
            let students: Student[] = (data || []) as Student[];
            
            // Update students' latest CWPM from JSON if available
            for (let i = 0; i < students.length; i++) {
                const student = students[i];
                const jsonFile = getStudentJSONFile(student.id, student.name);
                
                if (jsonFile) {
                    const jsonData = await loadJSONData(jsonFile);
                    if (jsonData && jsonData.cwpm !== undefined) {
                        students[i].latest_cwpm = parseFloat(String(jsonData.cwpm));
                    }
                }
            }
            
            return students;
        } catch (error) {
            console.error('Error fetching students:', error);
            return [];
        }
    },
    
    // Add new student
    addStudent: async (studentData: StudentFormData): Promise<Student> => {
        try {
            const { data: teachers } = await supabaseClient
                .from('teachers')
                .select('id')
                .limit(1);
            
            if (!teachers || teachers.length === 0) {
                throw new Error('No teacher found');
            }
            
            const { data, error } = await supabaseClient
                .from('students')
                .insert([{
                    teacher_id: teachers[0].id,
                    name: studentData.name,
                    email: studentData.email,
                    password: studentData.password,
                    grade: studentData.grade,
                    course: studentData.course
                }])
                .select()
                .single();
            
            if (error) throw error;
            return data as Student;
        } catch (error) {
            console.error('Error adding student:', error);
            throw error;
        }
    },
    
    // Get student with all assessments
    getStudent: async (studentId: string): Promise<StudentData> => {
        try {
            const { data: student, error: studentError } = await supabaseClient
                .from('students')
                .select('*')
                .eq('id', studentId)
                .single();
            
            if (studentError) throw studentError;
            
            // Check if this student has JSON data and load it
            let jsonAssessment: Assessment | null = null;
            const jsonFile = getStudentJSONFile(studentId, student.name);
            if (jsonFile) {
                const jsonData = await loadJSONData(jsonFile);
                if (jsonData) {
                    const transformed = transformJSONToAssessment(jsonData, studentId);
                    if (transformed) {
                        jsonAssessment = transformed.assessment;
                    }
                }
            }
            
            // Get all assessments for this student
            const { data: assessments, error: assessmentsError } = await supabaseClient
                .from('assessments')
                .select('*')
                .eq('student_id', studentId)
                .order('assessment_date');
            
            if (assessmentsError) throw assessmentsError;
            
            // Combine assessments: include JSON assessment for demo data
            let allAssessments: Assessment[] = (assessments || []) as Assessment[];
            if (jsonAssessment) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                jsonAssessment.assessment_date = yesterday.toISOString().split('T')[0];
                allAssessments.push(jsonAssessment);
            }
            
            // Sort all assessments by date
            allAssessments.sort((a, b) => {
                const dateA = new Date(a.assessment_date);
                const dateB = new Date(b.assessment_date);
                if (dateA.getTime() === dateB.getTime()) {
                    const createdA = a.created_at ? new Date(a.created_at) : new Date(0);
                    const createdB = b.created_at ? new Date(b.created_at) : new Date(0);
                    return createdA.getTime() - createdB.getTime();
                }
                return dateA.getTime() - dateB.getTime();
            });
            
            return {
                student: student as Student,
                assessments: allAssessments
            };
        } catch (error) {
            console.error('Error fetching student:', error);
            throw error;
        }
    },
    
    // Get student performance history
    getPerformance: async (studentId: string): Promise<PerformanceData[]> => {
        try {
            const { data: student } = await supabaseClient
                .from('students')
                .select('name')
                .eq('id', studentId)
                .single();
            
            const { data, error } = await supabaseClient
                .from('assessments')
                .select('assessment_date, cwpm_score, total_correct, total_missed, total_incorrect, total_extras')
                .eq('student_id', studentId)
                .order('assessment_date');
            
            if (error) throw error;
            
            let allData: any[] = data || [];
            if (student) {
                const jsonFile = getStudentJSONFile(studentId, student.name);
                if (jsonFile) {
                    const jsonData = await loadJSONData(jsonFile);
                    if (jsonData) {
                        const transformed = transformJSONToAssessment(jsonData, studentId);
                        if (transformed && transformed.assessment) {
                            const jsonPerf = {
                                assessment_date: transformed.assessment.assessment_date,
                                cwpm_score: transformed.assessment.cwpm_score,
                                total_correct: transformed.assessment.total_correct,
                                total_missed: transformed.assessment.total_missed,
                                total_incorrect: transformed.assessment.total_incorrect,
                                total_extras: transformed.assessment.total_extras
                            };
                            allData.push(jsonPerf);
                            allData.sort((a, b) => {
                                const dateA = new Date(a.assessment_date);
                                const dateB = new Date(b.assessment_date);
                                return dateA.getTime() - dateB.getTime();
                            });
                        }
                    }
                }
            }
            
            return allData.map(assessment => ({
                date: new Date(assessment.assessment_date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                }),
                cwpm_score: assessment.cwpm_score,
                total_correct: assessment.total_correct,
                total_missed: assessment.total_missed,
                total_incorrect: assessment.total_incorrect,
                total_extras: assessment.total_extras
            })) as PerformanceData[];
        } catch (error) {
            console.error('Error fetching performance:', error);
            return [];
        }
    },
    
    // Get specific assessment with word results
    getAssessment: async (assessmentId: string): Promise<AssessmentDetails> => {
        try {
            if (assessmentId && assessmentId.toString().startsWith('json-assessment-')) {
                const studentKey = assessmentId.toString().replace('json-assessment-', '');
                
                let studentId: string | null = null;
                let jsonFile: string | null = null;
                
                for (const [id, info] of Object.entries(STUDENT_JSON_MAP)) {
                    const keyFromName = info.name.toLowerCase().replace(/\s+/g, '-');
                    if (keyFromName === studentKey) {
                        studentId = id;
                        jsonFile = info.file;
                        break;
                    }
                }
                
                if (studentId && jsonFile) {
                    const jsonData = await loadJSONData(jsonFile);
                    if (jsonData) {
                        const transformed = transformJSONToAssessment(jsonData, studentId);
                        if (transformed) {
                            return transformed;
                        }
                    }
                }
                
                throw new Error('JSON assessment not found');
            }
            
            const { data: assessment, error: assessmentError } = await supabaseClient
                .from('assessments')
                .select('*')
                .eq('id', assessmentId)
                .single();
            
            if (assessmentError) throw assessmentError;
            
            const { data: words, error: wordsError } = await supabaseClient
                .from('word_results')
                .select('*')
                .eq('assessment_id', assessmentId)
                .order('word_position');
            
            if (wordsError) throw wordsError;
            
            return {
                assessment: assessment as Assessment,
                words: (words || []) as WordResult[]
            };
        } catch (error) {
            console.error('Error fetching assessment:', error);
            throw error;
        }
    },
    
    // Create new assessment
    createAssessment: async (assessmentData: CreateAssessmentData): Promise<{ id: string; message: string }> => {
        try {
            const { student_id, passage, cwpm_score, words, assessment_date } = assessmentData;
            
            const total_words = passage.split(/\s+/).length;
            const total_correct = words ? words.filter(w => w.type === 'correct' || w.type === 'right').length : Math.floor(total_words * 0.7);
            const total_missed = words ? words.filter(w => w.type === 'missed').length : Math.floor(total_words * 0.1);
            const total_incorrect = words ? words.filter(w => w.type === 'incorrect').length : Math.floor(total_words * 0.1);
            const total_extras = words ? words.filter(w => w.type === 'extra').length : Math.floor(total_words * 0.1);
            
            const assessmentDate = assessment_date || new Date().toISOString().split('T')[0];
            
            const { data: assessment, error: assessmentError } = await supabaseClient
                .from('assessments')
                .insert([{
                    student_id,
                    passage,
                    cwpm_score,
                    total_words,
                    total_correct,
                    total_missed,
                    total_incorrect,
                    total_extras,
                    assessment_date: assessmentDate
                }])
                .select()
                .single();
            
            if (assessmentError) throw assessmentError;
            
            if (words && words.length > 0) {
                const wordRecords = words.map((word, index) => ({
                    assessment_id: assessment.id,
                    word_text: word.text || '',
                    student_answer: word.answer || null,
                    word_type: word.type || 'correct',
                    word_position: index + 1,
                    timestamp_start: word.start !== undefined ? word.start : index * 0.5,
                    timestamp_end: word.end !== undefined ? word.end : (index * 0.5 + 0.3)
                }));
                
                const { error: wordsError } = await supabaseClient
                    .from('word_results')
                    .insert(wordRecords);
                
                if (wordsError) throw wordsError;
            }
            
            return { id: assessment.id, message: 'Assessment created successfully' };
        } catch (error) {
            console.error('Error creating assessment:', error);
            throw error;
        }
    }
};

// Export students to CSV
export async function exportAllStudentsToCSV(): Promise<void> {
    try {
        const students = await supabaseApi.getStudents();
        
        let csv = 'Student Name,Email,Grade,Course,Latest CWPM\n';
        
        students.forEach(student => {
            csv += `${student.name},${student.email},${student.grade},${student.course},${student.latest_cwpm || 0}\n`;
        });
        
        downloadCSV(csv, 'all_students.csv');
    } catch (error) {
        console.error('Error exporting CSV:', error);
        alert('Failed to export CSV');
    }
}

// Helper to download CSV
function downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}


