import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from 'sonner';
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useFetchUserProfileQuery } from "./redux/api/authApi";
import { userExists, userNotExist, setLoading } from "./redux/reducers/authReducer";
import type { RootState } from "./redux/store";
import Loading from "./components/ui/loading";

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
const AdminSubscriptionsPage = lazy(() => import("./pages/admin/subscriptions"));
const AdminUploadPage = lazy(() => import("./pages/admin/upload"));

const App = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isSuccess, isError, isLoading: queryLoading } = useFetchUserProfileQuery(undefined, {
    skip: !!user,
  });

  useEffect(() => {
    // Set loading when query starts
    if (queryLoading) {
      dispatch(setLoading(true));
    } else if (isSuccess && data) {
      dispatch(userExists(data));
    } else if (isError) {
      dispatch(userNotExist());
    }
  }, [isSuccess, isError, data, dispatch, queryLoading]);

  useEffect(() => {
    if (user) {
      import("./pages/dashboard");
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Toaster richColors />
      <Suspense fallback={<Loading />}>
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
            path="/admin-dashboard/subscriptions"
            element={
              <ProtectedRoute user={user ?? null} redirect="/signin" requireAuth={true}>
                <AdminSubscriptionsPage />
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
