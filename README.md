# Reading Assessment Dashboard - React

A React-based reading assessment dashboard for monitoring student progress and managing assessments, powered by Supabase.

## Features

- **Teacher Dashboard**: View all students with performance overview charts
- **Student Results**: Detailed assessment results with word-by-word analysis
- **Dynamic JSON Data**: Load assessment data from JSON files for Emma, Liam, and Olivia
- **Assessment Creation**: Add new assessments with automatic error assignment
- **Performance Tracking**: Track CWPM scores and error distribution over time

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Supabase (already configured in `src/config.js`):
   - The Supabase URL and anon key are already set up
   - Make sure your Supabase database matches the schema in `data.sql`

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
  ├── components/
  │   ├── TeacherView.js          # Main teacher dashboard
  │   ├── ResultsView.js          # Student results view
  │   ├── AddStudentModal.js      # Modal for adding students
  │   ├── AssessmentModal.js      # Modal for creating assessments
  │   └── WordDetailModal.js      # Modal for word details
  ├── utils/
  │   └── supabaseApi.js          # Supabase API utilities
  ├── App.js                      # Main app component with routing
  ├── App.css                     # Global styles
  ├── index.js                    # Entry point
  └── config.js                   # Supabase configuration

public/
  ├── test_input.json             # Emma's assessment data
  ├── test_input2.json            # Olivia's assessment data
  ├── test_input3.json            # Liam's assessment data
  └── index.html                  # HTML template
```

## Usage

1. **View Dashboard**: Navigate to `/` to see all students and their performance
2. **View Student Results**: Click on any student card to view their detailed assessment results
3. **Add Student**: Click "Add Student" to add a new student
4. **Create Assessment**: Click "Enter New Assessment" on a student's results page to add a new assessment
5. **Export Data**: Click "Export CSV" to download all student data

## JSON Data Files

The app automatically loads assessment data from JSON files for:
- **Emma Johnson** (`test_input.json`)
- **Olivia Davis** (`test_input2.json`)
- **Liam Smith** (`test_input3.json`)

These files are loaded dynamically, so any changes will be reflected after a page refresh.

## Technologies

- React 18
- React Router v6
- Chart.js with react-chartjs-2
- Bootstrap 5 with react-bootstrap
- Supabase JS Client

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.


