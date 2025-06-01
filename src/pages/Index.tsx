import { Link } from "react-router-dom";
import { Users, Zap, Shield, BarChart3, Search, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">TalentHub</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/analyzer" className="text-gray-600 hover:text-blue-600 font-medium">
                Analyze
              </Link>
              <Link to="/candidates" className="text-gray-600 hover:text-blue-600 font-medium">
                Candidates
              </Link>
              <Link to="/upload" className="text-gray-600 hover:text-blue-600 font-medium">
                Job Matching
              </Link>
            </nav>
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered
            <span className="text-blue-600"> GitHub</span>
            <br />
            Profile Analysis
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Analyze any GitHub profile with AI to discover skills, coding patterns, and developer insights in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="px-8 py-4 text-lg">
              <Link to="/analyzer">
                <Search className="w-5 h-5 mr-2" />
                Analyze Profile
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 py-4 text-lg">
              <Link to="/candidates">
                <Code className="w-5 h-5 mr-2" />
                Browse Candidates
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Instant Analysis</CardTitle>
              <CardDescription>
                Get comprehensive GitHub profile analysis in seconds using advanced AI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>
                Discover programming languages, frameworks, and technical expertise automatically
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Code Quality Insights</CardTitle>
              <CardDescription>
                Evaluate coding patterns, contribution consistency, and project quality
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to analyze GitHub profiles?
          </h2>
          <p className="text-gray-600 mb-6">
            Just paste any GitHub username or URL and get instant AI-powered insights
          </p>
          <Button size="lg" asChild>
            <Link to="/analyzer">Get Started Now</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
