
import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Mail, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, handle authentication here
      console.log("Login attempted with:", { email, password });
    }, 2000);
  };

  const handleGitHubLogin = () => {
    // In a real app, this would redirect to GitHub OAuth
    console.log("GitHub OAuth login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome to TalentHub</CardTitle>
            <CardDescription>
              Sign in to access your recruitment dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* GitHub OAuth Button */}
            <Button 
              onClick={handleGitHubLogin}
              variant="outline" 
              className="w-full h-12 border-2 hover:bg-gray-50"
            >
              <Github className="w-5 h-5 mr-3" />
              Continue with GitHub
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Sign in with Email
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Sign up for free
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Why choose TalentHub?</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>AI-powered candidate matching</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Real-time GitHub data analysis</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Comprehensive skill assessment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
