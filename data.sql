-- Supabase Reading Assessment Database - Complete Reset
-- This will DROP ALL EXISTING TABLES and create fresh ones

-- Drop existing tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS word_results CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP VIEW IF EXISTS student_performance CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teachers table
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    course VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments table
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    passage TEXT NOT NULL,
    cwpm_score DECIMAL(5,2) NOT NULL,
    total_words INT NOT NULL,
    total_correct INT DEFAULT 0,
    total_missed INT DEFAULT 0,
    total_incorrect INT DEFAULT 0,
    total_extras INT DEFAULT 0,
    assessment_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Word results table (stores individual word performance)
CREATE TABLE word_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    word_text VARCHAR(100) NOT NULL,
    student_answer VARCHAR(100),
    word_type VARCHAR(10) NOT NULL CHECK (word_type IN ('correct', 'missed', 'extra', 'incorrect', 'right')),
    word_position INT NOT NULL,
    timestamp_start DECIMAL(5,2) DEFAULT 0,
    timestamp_end DECIMAL(5,2) DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_students_teacher ON students(teacher_id);
CREATE INDEX idx_assessments_student ON assessments(student_id);
CREATE INDEX idx_assessments_date ON assessments(assessment_date);
CREATE INDEX idx_word_results_assessment ON word_results(assessment_id);

-- Insert sample teacher
INSERT INTO teachers (id, name, email, password) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Ms. Anderson', 'anderson@school.com', 'password123');

-- Insert sample students
INSERT INTO students (id, teacher_id, name, email, password, grade, course) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Emma Johnson', 'emma.j@school.com', 'student123', '3', 'Reading A'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Liam Smith', 'liam.s@school.com', 'student123', '3', 'Reading A'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Olivia Davis', 'olivia.d@school.com', 'student123', '4', 'Reading B');

-- Insert sample assessments for Emma with specific IDs
INSERT INTO assessments (id, student_id, passage, cwpm_score, total_words, total_correct, total_missed, total_incorrect, total_extras, assessment_date) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'The quick brown fox jumps over the lazy dog.', 45, 9, 7, 1, 1, 0, '2024-11-01'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'She sells seashells by the seashore.', 52, 6, 5, 0, 1, 0, '2024-11-02'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'Peter Piper picked a peck of pickled peppers.', 58, 8, 7, 0, 1, 0, '2024-11-03'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', 'How much wood would a woodchuck chuck.', 65, 7, 6, 0, 1, 0, '2024-11-04'),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', 'the quick brown fox jumps over the lazy dog', 49.14, 9, 7, 0, 2, 0, '2024-11-05');

-- Insert sample assessments for Liam with specific IDs
INSERT INTO assessments (id, student_id, passage, cwpm_score, total_words, total_correct, total_missed, total_incorrect, total_extras, assessment_date) VALUES
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440002', 'The cat in the hat came back.', 40, 7, 6, 0, 1, 0, '2024-11-01'),
('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440002', 'Green eggs and ham are so good.', 48, 6, 5, 0, 1, 0, '2024-11-03'),
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440002', 'One fish two fish red fish blue fish.', 55, 8, 7, 0, 1, 0, '2024-11-05'),
('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440002', 'The sun did not shine it was too wet to play.', 65, 11, 9, 1, 1, 0, '2024-11-07');

-- Insert sample assessments for Olivia with specific IDs
INSERT INTO assessments (id, student_id, passage, cwpm_score, total_words, total_correct, total_missed, total_incorrect, total_extras, assessment_date) VALUES
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440003', 'Where the wild things are is a great book.', 50, 8, 7, 0, 1, 0, '2024-11-02'),
('750e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440003', 'The very hungry caterpillar ate lots of food.', 56, 8, 7, 0, 1, 0, '2024-11-04'),
('750e8400-e29b-41d4-a716-446655440012', '650e8400-e29b-41d4-a716-446655440003', 'Goodnight moon is a classic bedtime story.', 58, 7, 6, 0, 1, 0, '2024-11-06');

-- Insert word results for Emma's latest assessment (from test_input.json)
INSERT INTO word_results (assessment_id, word_text, student_answer, word_type, word_position, timestamp_start, timestamp_end) VALUES
('750e8400-e29b-41d4-a716-446655440005', 'the', 'the', 'right', 1, 0.0, 0.3),
('750e8400-e29b-41d4-a716-446655440005', 'quick', 'quik', 'incorrect', 2, 0.3, 0.6),
('750e8400-e29b-41d4-a716-446655440005', 'brown', 'brown', 'right', 3, 0.6, 0.9),
('750e8400-e29b-41d4-a716-446655440005', 'fox', 'fox', 'right', 4, 0.9, 1.1),
('750e8400-e29b-41d4-a716-446655440005', 'jumps', 'jmps', 'incorrect', 5, 1.1, 1.4),
('750e8400-e29b-41d4-a716-446655440005', 'over', 'over', 'right', 6, 1.4, 1.6),
('750e8400-e29b-41d4-a716-446655440005', 'the', 'the', 'right', 7, 1.6, 1.8),
('750e8400-e29b-41d4-a716-446655440005', 'lazy', 'lazy', 'right', 8, 1.8, 2.1),
('750e8400-e29b-41d4-a716-446655440005', 'dog', 'dog', 'right', 9, 2.1, 2.4);

-- Insert sample word results for Liam's latest assessment
INSERT INTO word_results (assessment_id, word_text, student_answer, word_type, word_position, timestamp_start, timestamp_end) VALUES
('750e8400-e29b-41d4-a716-446655440009', 'The', 'The', 'correct', 1, 0.0, 0.3),
('750e8400-e29b-41d4-a716-446655440009', 'sun', 'sun', 'correct', 2, 0.5, 0.8),
('750e8400-e29b-41d4-a716-446655440009', 'did', 'did', 'correct', 3, 1.0, 1.3),
('750e8400-e29b-41d4-a716-446655440009', 'not', NULL, 'missed', 4, 1.5, 1.5),
('750e8400-e29b-41d4-a716-446655440009', 'shine', 'shine', 'correct', 5, 2.0, 2.3),
('750e8400-e29b-41d4-a716-446655440009', 'it', 'it', 'correct', 6, 2.5, 2.7),
('750e8400-e29b-41d4-a716-446655440009', 'was', 'was', 'correct', 7, 3.0, 3.2),
('750e8400-e29b-41d4-a716-446655440009', 'too', 'too', 'correct', 8, 3.5, 3.7),
('750e8400-e29b-41d4-a716-446655440009', 'wet', 'wett', 'incorrect', 9, 4.0, 4.3),
('750e8400-e29b-41d4-a716-446655440009', 'to', 'to', 'correct', 10, 4.5, 4.7),
('750e8400-e29b-41d4-a716-446655440009', 'play', 'play', 'correct', 11, 5.0, 5.3);

-- Insert sample word results for Olivia's latest assessment
INSERT INTO word_results (assessment_id, word_text, student_answer, word_type, word_position, timestamp_start, timestamp_end) VALUES
('750e8400-e29b-41d4-a716-446655440012', 'Goodnight', 'Goodnight', 'correct', 1, 0.0, 0.4),
('750e8400-e29b-41d4-a716-446655440012', 'moon', 'moon', 'correct', 2, 0.5, 0.8),
('750e8400-e29b-41d4-a716-446655440012', 'is', 'is', 'correct', 3, 1.0, 1.2),
('750e8400-e29b-41d4-a716-446655440012', 'a', 'a', 'correct', 4, 1.5, 1.6),
('750e8400-e29b-41d4-a716-446655440012', 'classic', 'classik', 'incorrect', 5, 2.0, 2.4),
('750e8400-e29b-41d4-a716-446655440012', 'bedtime', 'bedtime', 'correct', 6, 2.5, 2.9),
('750e8400-e29b-41d4-a716-446655440012', 'story', 'story', 'correct', 7, 3.0, 3.3);

-- Create view for student performance with LATEST CWPM (most recent by date)
-- This replaces the old MAX() approach with getting the most recent assessment
CREATE OR REPLACE VIEW student_performance AS
SELECT 
    s.id,
    s.name,
    s.email,
    s.grade,
    s.course,
    s.teacher_id,
    COALESCE(
        (SELECT a.cwpm_score 
         FROM assessments a 
         WHERE a.student_id = s.id 
         ORDER BY a.assessment_date DESC, a.created_at DESC 
         LIMIT 1), 
        0
    ) as latest_cwpm,
    s.created_at
FROM students s
GROUP BY s.id, s.name, s.email, s.grade, s.course, s.teacher_id, s.created_at;

-- Enable Row Level Security (RLS)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_results ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
-- For now, allowing all authenticated users to read/write
CREATE POLICY "Allow all operations for authenticated users" ON teachers
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON students
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON assessments
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON word_results
    FOR ALL USING (true);

-- Verify the view is working correctly
SELECT 
    name, 
    grade, 
    course, 
    latest_cwpm,
    (SELECT assessment_date FROM assessments WHERE student_id = student_performance.id ORDER BY assessment_date DESC LIMIT 1) as last_assessment_date
FROM student_performance 
ORDER BY name;