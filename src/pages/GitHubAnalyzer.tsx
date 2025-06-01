
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Github, Loader2, User, Star, GitBranch, Calendar, MapPin, Building, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface Repository {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

const GitHubAnalyzer = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [analysis, setAnalysis] = useState("");
  const { toast } = useToast();

  const extractUsername = (url: string) => {
    // Extract username from GitHub URL or return as-is if it's just a username
    const match = url.match(/github\.com\/([^\/]+)/);
    return match ? match[1] : url.trim();
  };

  const fetchGitHubData = async (username: string) => {
    try {
      // Fetch profile
      const profileResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!profileResponse.ok) {
        throw new Error("GitHub user not found");
      }
      const profileData = await profileResponse.json();

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
      const reposData = await reposResponse.json();

      return { profile: profileData, repos: reposData };
    } catch (error) {
      throw new Error("Failed to fetch GitHub data");
    }
  };

  const analyzeWithGemini = async (profileData: GitHubProfile, reposData: Repository[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-github', {
        body: {
          profile: profileData,
          repositories: reposData,
        },
      });

      if (error) {
        throw new Error("Failed to analyze with AI");
      }

      return data.analysis;
    } catch (error) {
      throw new Error("AI analysis failed");
    }
  };

  const handleAnalyze = async () => {
    if (!githubUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a GitHub username or URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProfile(null);
    setRepositories([]);
    setAnalysis("");

    try {
      const username = extractUsername(githubUrl);
      
      // Fetch GitHub data
      const { profile: profileData, repos: reposData } = await fetchGitHubData(username);
      setProfile(profileData);
      setRepositories(reposData);

      // Analyze with Gemini
      const analysisResult = await analyzeWithGemini(profileData, reposData);
      setAnalysis(analysisResult);

      toast({
        title: "Analysis Complete",
        description: "GitHub profile analyzed successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Analysis failed",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatAnalysisText = (text: string) => {
    // Split by double newlines to create paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a heading (starts with #)
      if (paragraph.startsWith('#')) {
        const level = paragraph.match(/^#+/)?.[0].length || 1;
        const title = paragraph.replace(/^#+\s*/, '');
        
        if (level === 1) {
          return (
            <h2 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">
              {title}
            </h2>
          );
        } else if (level === 2) {
          return (
            <h3 key={index} className="text-xl font-semibold text-gray-800 mb-3 mt-5 first:mt-0">
              {title}
            </h3>
          );
        } else {
          return (
            <h4 key={index} className="text-lg font-medium text-gray-700 mb-2 mt-4 first:mt-0">
              {title}
            </h4>
          );
        }
      }
      
      // Check if it's a bullet point
      if (paragraph.startsWith('•') || paragraph.startsWith('-')) {
        const items = paragraph.split('\n').filter(item => item.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-1 mb-4 text-gray-700">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="ml-2">
                {item.replace(/^[•-]\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 mb-4 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="hover:bg-gray-100/50">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Github className="w-6 h-6 text-gray-700" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  GitHub Profile Analyzer
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <Card className="mb-8 border-0 shadow-xl bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Github className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Analyze GitHub Profile
              </span>
            </CardTitle>
            <CardDescription className="text-base text-gray-600 max-w-2xl mx-auto">
              Enter a GitHub username or profile URL to get comprehensive AI-powered insights about the developer's skills, experience, and coding patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="github-url" className="text-sm font-medium text-gray-700">
                GitHub Username or URL
              </Label>
              <Input
                id="github-url"
                placeholder="e.g., octocat or https://github.com/octocat"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Github className="w-5 h-5 mr-2" />
                    Analyze Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {profile && (
          <div className="space-y-8">
            {/* Profile Info */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                      <img
                        src={profile.avatar_url}
                        alt={profile.name || profile.login}
                        className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl font-bold mb-2">
                        {profile.name || profile.login}
                      </h2>
                      <p className="text-blue-100 text-lg mb-3">@{profile.login}</p>
                      {profile.bio && (
                        <p className="text-blue-50 mb-4 max-w-2xl">{profile.bio}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                        {profile.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{profile.location}</span>
                          </div>
                        )}
                        {profile.company && (
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{profile.company}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <div className="flex items-center justify-center mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600 mr-1" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">{profile.public_repos}</div>
                      <div className="text-sm text-blue-700 font-medium">Repositories</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-5 h-5 text-green-600 mr-1" />
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-1">{profile.followers}</div>
                      <div className="text-sm text-green-700 font-medium">Followers</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <div className="flex items-center justify-center mb-2">
                        <User className="w-5 h-5 text-purple-600 mr-1" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-1">{profile.following}</div>
                      <div className="text-sm text-purple-700 font-medium">Following</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Repositories */}
            {repositories.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Recent Repositories</CardTitle>
                  <CardDescription className="text-gray-600">Most recently updated repositories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {repositories.slice(0, 5).map((repo) => (
                    <div key={repo.name} className="border border-gray-200 rounded-xl p-5 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-blue-600 hover:text-blue-700 cursor-pointer">
                          {repo.name}
                        </h3>
                        {repo.language && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">{repo.description}</p>
                      )}
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GitBranch className="w-4 h-4 text-green-500" />
                          <span>{repo.forks_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* AI Analysis */}
            {analysis && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      AI Analysis
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Comprehensive profile insights powered by Gemini AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                    {formatAnalysisText(analysis)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default GitHubAnalyzer;
