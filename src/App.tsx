import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from 'sonner';
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useFetchUserProfileQuery } from "./redux/api/authApi";
import { userExists, userNotExist } from "./redux/reducers/authReducer";
import type { RootState } from "./redux/store";

const Home = lazy(() => import("./pages/home"));
const About = lazy(() => import("./pages/about"));
const Contact = lazy(() => import("./pages/contact"));
const Countries = lazy(() => import("./pages/countries"));
const IndianPorts = lazy(() => import("./pages/indianPorts"));
const SignIn = lazy(() => import("./pages/signIn"));
// const SignUp = lazy(() => import("./pages/signUp"));
const Dashboard = lazy(() => import("./pages/dashboard"));

// Admin Pages
const AdminHomePage = lazy(() => import("./pages/admin/home"));
const AdminUsersPage = lazy(() => import("./pages/admin/users"));
const AdminUploadPage = lazy(() => import("./pages/admin/upload"));

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const { data, isSuccess, isError } = useFetchUserProfileQuery(undefined, {
    skip: !!user,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(userExists(data));
    } else if (isError) {
      dispatch(userNotExist());
    }
  }, [isSuccess, isError, data, dispatch]);

  useEffect(() => {
    if (user) {
      import("./pages/dashboard");
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Toaster richColors />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Admin routes without main layout */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute user={user ?? null} redirect="/signin" requireAuth={true}>
                <AdminHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/users"
            element={
              <ProtectedRoute user={user ?? null} redirect="/signin" requireAuth={true}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/upload"
            element={
              <ProtectedRoute user={user ?? null} redirect="/signin" requireAuth={true}>
                <AdminUploadPage />
              </ProtectedRoute>
            }
          />

          {/* All other routes with main layout */}
          <Route path="/*" element={
            <main className="flex flex-col min-h-screen justify-between bg-[#f9fafb]">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/countries" element={<Countries />} />
                <Route path="/indian-ports" element={<IndianPorts />} />
                <Route
                  path="/signin"
                  element={
                    <ProtectedRoute user={user ?? null} redirect="/dashboard" requireAuth={false}>
                      <SignIn />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute user={user ?? null} redirect="/signin" requireAuth={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Footer />
            </main>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
