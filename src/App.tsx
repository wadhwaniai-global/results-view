import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherView from './components/TeacherView';
import ResultsView from './components/ResultsView';

function App(): JSX.Element {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TeacherView />} />
                <Route path="/results/:studentId" element={<ResultsView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;


