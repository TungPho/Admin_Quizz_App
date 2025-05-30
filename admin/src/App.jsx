import React from "react";
import { Route, Routes } from "react-router-dom";
import TeacherList from "./pages/Teachers";
import StudentList from "./pages/Students";
import UserList from "./pages/Users";
import AdminLogin from "./pages/Login";
import ProtectedLayout from "./components/ProtectedLayout";
import PendingTeacherList from "./pages/PendingTeacherList";
import QuizzTest from "./pages/QuizzTest";
import Dashboard from "./pages/Dashboard";
const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/" element={<AdminLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/users" element={<UserList />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/pending_teachers" element={<PendingTeacherList />} />
          <Route path="/submissions" element={<QuizzTest />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
