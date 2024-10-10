import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./components/StudentDashboard";
import TutorDashboard from "./components/TutorDashboard";
import CombinedDashboard from "./components/CombinedDashboard";
import TutorList from "./components/TutorList";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("user");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/practice"
                element={
                  <PrivateRoute>
                    <Practice />
                  </PrivateRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <PrivateRoute>
                    <Progress />
                  </PrivateRoute>
                }
              />
              <Route
                path="/student-dashboard"
                element={
                  <PrivateRoute>
                    <StudentDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tutor-dashboard"
                element={
                  <PrivateRoute>
                    <TutorDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/combined-dashboard"
                element={
                  <PrivateRoute>
                    <CombinedDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/find-tutor"
                element={
                  <PrivateRoute>
                    <TutorList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
