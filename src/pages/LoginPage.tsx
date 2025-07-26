import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Eye, EyeOff } from "lucide-react";

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to login. Please check your credentials.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="min-h-screen grid lg:grid-cols-2">
                <div className="hidden lg:flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center p-8">
                        <img
                            src="/login.jpg"
                            alt="Medical professionals with healthcare icons - Hospital Management System"
                            width={600}
                            height={600}
                            className="w-full h-auto max-w-lg object-contain"
                        />
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="flex items-center justify-center p-8">
                    <Card className="w-full max-w-md shadow-2xl border-0">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl font-bold text-center text-gray-900">
                                Welcome
                            </CardTitle>
                            <CardDescription className="text-center text-gray-600">
                                Enter your credentials to access the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@hospital.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <Button type="submit" className="w-full h-11 hover:bg-blue-700 text-white font-medium" disabled={isLoading}>
                                    {isLoading ? "Logging in..." : "Login"}
                                </Button>
                            </form>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-center text-gray-500">
                                    Contact admin support for assistance.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
