import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeLayout from "./hoc/HomeLayout.jsx";
import AdminLayout from "./hoc/AdminLayout.jsx";
import SignUpExam from "./pages/SignUpExam.jsx";
import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CreateQuestion from "./pages/CreateQuestion.jsx";
import CreateExam from "./pages/CreateExam.jsx";
import ExamManagement from "./pages/ExamManagement.jsx";
import ExamListUser from "./pages/ExamListUser.jsx";
import ExamTaking from "./pages/ExamTaking.jsx";
import ExamResult from "./pages/ExamResult.jsx";
import ExamDetail from "./pages/ExamDetail.jsx";
import EditExam from "./pages/EditExam.jsx";
import QuestionDetail from "./pages/QuestionDetail.jsx";
import EditQuestion from "./pages/EditQuestion.jsx";
import AdminReports from "./pages/AdminReports.jsx";
import UserManagement from "./pages/UserManagement.jsx";
import ExamResultsAdmin from "./pages/ExamResultsAdmin.jsx";
import Register from "./pages/Register.jsx";
import DemoAccounts from "./pages/DemoAccounts.jsx";
import AntiCheat from "./components/AntiCheat.jsx";

import AuthLayout from "./hoc/AuthLayout.jsx";
import ExamList from "./pages/ExamList.jsx";
import Exam1 from "./pages/Exam1.jsx";
import Exam2 from "./pages/Exam2.jsx";
import Result from "./pages/Result.jsx";
import RouteComponent from "./hoc/RouteComponent.jsx";
import AdminRouteComponent from "./hoc/AdminRouteComponent.jsx";

function App() {
  return (
    <BrowserRouter>
      <AntiCheat />
      <Routes>
        <Route path="*" element={<Navigate to="/"></Navigate>} />
        <Route path="/" element={<DemoAccounts />}></Route>

        <Route path="/dk" element={<AuthLayout />}>
          <Route
            path="/dk"
            element={<RouteComponent isLogin={false} Component={ExamList} />}
          ></Route>
        </Route>
        <Route path="/dang-ky" element={<Register />}></Route>
        <Route path="/dang-nhap" element={<AuthLayout />}>
          <Route
            path="/dang-nhap"
            element={
              <RouteComponent
                isAuth={true}
                Component={SignIn}
                redirectPath={"/dashboard"}
              />
            }
          ></Route>
        </Route>
        <Route path="/quen-mat-khau" element={<AuthLayout />}>
          <Route path="/quen-mat-khau" element={<ForgotPassword />}></Route>
        </Route>
        <Route path="/dat-lai-mat-khau" element={<AuthLayout />}>
          <Route path="/dat-lai-mat-khau" element={<ResetPassword />}></Route>
        </Route>
        <Route path="/dashboard" element={<HomeLayout />}>
          <Route
            path="/dashboard"
            element={
              <RouteComponent
                isLogin={true}
                Component={Dashboard}
                redirectPath={"/dang-nhap"}
              />
            }
          ></Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AuthLayout />}>
          <Route path="/admin/login" element={<AdminLogin />}></Route>
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <AdminRouteComponent
                Component={AdminDashboard}
                redirectPath={"/admin/login"}
              />
            }
          ></Route>
          <Route
            path="/admin/questions/create"
            element={
              <AdminRouteComponent
                Component={CreateQuestion}
                redirectPath={"/admin/login"}
              />
            }
          ></Route>
          <Route
            path="/admin/exams"
            element={
              <AdminRouteComponent
                Component={ExamManagement}
                redirectPath={"/admin/login"}
              />
            }
          ></Route>
          <Route
            path="/admin/exams/create"
            element={
              <AdminRouteComponent
                Component={CreateExam}
                redirectPath={"/admin/login"}
              />
            }
          ></Route>
          <Route
            path="/admin/exams/:examId"
            element={
              <AdminRouteComponent
                Component={ExamDetail}
                redirectPath={"/admin/login"}
              />
            }
          ></Route>
          <Route
            path="/admin/exams/:examId/edit"
            element={
              <AdminRouteComponent
                Component={EditExam}
                redirectPath={"/admin/login"}
              />
            }
          ></Route>
          <Route
            path="/admin/questions/:questionId"
            element={
              <AdminRouteComponent
                Component={QuestionDetail}
                redirectPath={"/admin/login"}
              />
            }
          ></Route>
          <Route
            path="/admin/questions/:questionId/edit"
            element={
              <AdminRouteComponent
                Component={EditQuestion}
                redirectPath={"/admin/login"}
              />
            }
          ></Route>
          <Route
            path="/admin/reports"
            element={
              <AdminRouteComponent
                Component={AdminReports}
                redirectPath={"/admin/login"}
              />
            }
          ></Route>
          <Route
            path="/admin/users"
            element={
              <AdminRouteComponent
                Component={UserManagement}
                redirectPath={"/admin/login"}
              />
            }
          ></Route>
          <Route
            path="/admin/results"
            element={
              <AdminRouteComponent
                Component={ExamResultsAdmin}
                redirectPath={"/admin/login"}
              />
            }
          ></Route>
        </Route>
        <Route path="/dang-ky-thi" element={<HomeLayout />}>
          <Route
            path="/dang-ky-thi"
            element={
              <RouteComponent
                isLogin={true}
                Component={SignUpExam}
                redirectPath={"/dang-nhap"}
              />
            }
          ></Route>
        </Route>

        {/* User Exam Routes */}
        <Route
          path="/exams"
          element={
            <RouteComponent
              isLogin={true}
              Component={ExamListUser}
              redirectPath={"/dang-nhap"}
            />
          }
        ></Route>

        <Route
          path="/exam/:examId"
          element={
            <RouteComponent
              isLogin={true}
              Component={ExamTaking}
              redirectPath={"/dang-nhap"}
            />
          }
        ></Route>

        <Route
          path="/exam-result/:examId"
          element={
            <RouteComponent
              isLogin={true}
              Component={ExamResult}
              redirectPath={"/dang-nhap"}
            />
          }
        ></Route>
        <Route path="/tai-khoan" element={<HomeLayout />}>
          <Route
            path="/tai-khoan"
            element={
              <RouteComponent
                isLogin={true}
                Component={Profile}
                redirectPath={"/dang-nhap"}
              />
            }
          ></Route>
        </Route>
        <Route
          path="/e1"
          element={
            <RouteComponent
              isLogin={true}
              Component={Exam1}
              redirectPath={"/dang-nhap"}
            />
          }
        ></Route>
        <Route
          path="/e2-tu-luan"
          element={
            <RouteComponent
              isLogin={true}
              Component={Exam2}
              redirectPath={"/dang-nhap"}
            />
          }
        ></Route>{" "}
        <Route
          path="/ket-qua"
          element={
            <RouteComponent
              isLogin={true}
              Component={Result}
              redirectPath={"/dang-nhap"}
            />
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
