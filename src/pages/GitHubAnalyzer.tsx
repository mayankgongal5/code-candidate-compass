
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Github, Loader2, User, Star, GitBranch, Calendar } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-gray-900">GitHub Profile Analyzer</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Github className="w-5 h-5" />
              <span>Analyze GitHub Profile</span>
            </CardTitle>
            <CardDescription>
              Enter a GitHub username or profile URL to get AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub Username or URL</Label>
              <Input
                id="github-url"
                placeholder="e.g., octocat or https://github.com/octocat"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full sm:w-auto"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Github className="w-4 h-4 mr-2" />
                  Analyze Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {profile && (
          <div className="space-y-6">
            {/* Profile Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                  <img
                    src={profile.avatar_url}
                    alt={profile.name || profile.login}
                    className="w-24 h-24 rounded-full mx-auto md:mx-0"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {profile.name || profile.login}
                    </h2>
                    <p className="text-gray-600 mb-4">@{profile.login}</p>
                    {profile.bio && (
                      <p className="text-gray-700 mb-4">{profile.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {profile.location && (
                        <span>{profile.location}</span>
                      )}
                      {profile.company && (
                        <span>{profile.company}</span>
                      )}
                      <span>
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{profile.public_repos}</div>
                    <div className="text-sm text-gray-600">Repositories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{profile.followers}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{profile.following}</div>
                    <div className="text-sm text-gray-600">Following</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Repositories */}
            {repositories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Repositories</CardTitle>
                  <CardDescription>Most recently updated repositories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {repositories.slice(0, 5).map((repo) => (
                    <div key={repo.name} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-blue-600">{repo.name}</h3>
                        {repo.language && (
                          <Badge variant="outline">{repo.language}</Badge>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-gray-600 text-sm mb-2">{repo.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GitBranch className="w-4 h-4" />
                          <span>{repo.forks_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
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
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis</CardTitle>
                  <CardDescription>Comprehensive profile insights powered by Gemini AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700">{analysis}</div>
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
