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
      <main className="flex flex-col min-h-screen justify-between bg-[#f9fafb]">
        <Navbar />
        <Toaster richColors />
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
        <Footer />
      </main>
    </BrowserRouter>
  );
};

export default App;
