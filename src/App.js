import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux"; // ✅ Import Redux Provider
import store from "./store/index"; // ✅ Import Redux store
import SignIn from "./pages/SignIn/SignIn";
import Dashboard from "./pages/Dashboard/Dashboard";
import AssignmentSubmissionsPage from './pages//AssignmentSubmissionsPage/AssignmentSubmissionsPage';
import AssignmentsTable from "./components/AssignmentsTable/AssignmentsTable";
import CourseAssignments from "./components/CourseAssignments/CourseAssignmentsTable"
import Courses from "./components/Courses/Courses"
import { useAuth } from './context/AuthContext';
import UserContext from "./context/UserContext";

function App() {
  const { isAuthenticated, user,setUser, handleLogout, handleSignIn } = useAuth();
  return (
      <Provider store={store}> 
      <UserContext.Provider value={{ user, setUser }}>
      <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                user?.role === "Teacher" ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/courses" replace />
                )
              ) : (
                <SignIn onSignInSuccess={handleSignIn} />
              )
            }
          />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard user={user} onLogout={handleLogout}>
                <AssignmentsTable />
              </Dashboard>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
          <Route
          path="/courses"
          element={
            isAuthenticated ? (
              <Dashboard user={user} onLogout={handleLogout}>
                <Courses />
              </Dashboard>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/courses/:teacherId/:courseName"
          element={
              isAuthenticated ? (
                <Dashboard user={user} onLogout={handleLogout}>
                  <CourseAssignments />
                </Dashboard>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/assignments/:assignmentId/submissions"
            element={
              isAuthenticated ? (
                <Dashboard user={user} onLogout={handleLogout}>
                  <AssignmentSubmissionsPage />
                </Dashboard>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        {/* <Route
          path="/reports/api"
          element={
            isAuthenticated ? (
              <Dashboard user={user} onLogout={handleLogout}>
                <ReportPage />
              </Dashboard>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/reports/api/v1"
          element={
            isAuthenticated ? (
              <Dashboard user={user} onLogout={handleLogout}>
                <ResolvedCommentsReport />
              </Dashboard>
            ) : (
              <Navigate to="/" replace />
            )
          }
        /> */}
      </Routes>
      </UserContext.Provider>
    </Provider>
  );
}

export default App;
