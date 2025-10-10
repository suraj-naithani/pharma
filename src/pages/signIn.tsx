import { useState } from "react";
import { useUserLoginMutation } from "@/redux/api/authApi";
import { useDispatch } from "react-redux";
import { userExists } from "@/redux/reducers/authReducer";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [signIn, { isLoading }] = useUserLoginMutation();

    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await signIn({ email, password }).unwrap();
            console.log("Login success:", res);

            localStorage.setItem("token", res.token);
            localStorage.setItem("sessionId", res.sessionId);
            console.log(res.user)
            dispatch(userExists(res.user));

            // Success toast
            toast.success("Login successful!", {
                description: "Welcome back! Redirecting to dashboard...",
                duration: 3000,
            });
        } catch (err: unknown) {
            console.error("Login failed:", err);

            // Error toast
            toast.error("Login failed", {
                description: "Invalid email or password. Please try again.",
                duration: 4000,
            });
        }
    };

    return (
        <section className="bg-[#EEF2FF] min-h-screen">
            <div className="flex flex-col items-center justify-center px-4 py-6 mx-auto md:h-screen lg:py-0">
                <div className="w-full rounded-lg shadow-lg md:mt-0 sm:max-w-sm xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-5 sm:p-8 bg-white rounded-lg border border-[#C7D2FE]">
                        <h1 className="text-lg font-bold leading-tight tracking-tight text-[#1E293B] md:text-xl">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-[#1E293B]"
                                >
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="name@company.com"
                                    className="bg-[#EEF2FF] border border-[#C7D2FE] text-[#1E293B] text-sm rounded-lg focus:ring-[#3B82F6] focus:border-[#3B82F6] block w-full p-2 transition-colors duration-200"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-[#1E293B]"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-[#EEF2FF] border border-[#C7D2FE] text-[#1E293B] text-sm rounded-lg focus:ring-[#3B82F6] focus:border-[#3B82F6] block w-full p-2 pr-12 transition-colors duration-200"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#64748B] hover:text-[#3B82F6] transition-colors duration-200"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="remember"
                                            aria-describedby="remember"
                                            type="checkbox"
                                            className="w-4 h-4 border border-[#C7D2FE] rounded outline-none focus-visible:text-[#3B82F6] focus:outline-none accent-[#3B82F6]"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="remember"
                                            className="text-[#1E293B]"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-[#3B82F6] hover:text-[#60A5FA] hover:underline transition-colors duration-200"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="btn w-full bg-[#3B82F6] hover:bg-[#60A5FA] rounded-lg py-2 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign in"}
                            </button>
                            <p className="text-sm font-light text-[#1E293B]">
                                Don't have an account yet?{" "}
                                <a
                                    href="#"
                                    className="font-medium text-[#3B82F6] hover:text-[#60A5FA] hover:underline transition-colors duration-200"
                                >
                                    Sign up
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
