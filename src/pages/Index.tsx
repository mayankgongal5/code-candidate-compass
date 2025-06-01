
import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, TrendingUp, Star, GitBranch, Search, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [stats] = useState({
    totalCandidates: 156,
    topPerformers: 23,
    pendingReviews: 8,
    recentMatches: 12
  });

  const topCandidates = [
    {
      id: 1,
      username: "johndoe",
      name: "John Doe",
      avatar: "https://github.com/johndoe.png",
      score: 95,
      skills: ["React", "TypeScript", "Node.js"],
      repos: 42,
      stars: 1250,
      followers: 89
    },
    {
      id: 2,
      username: "sarahsmith",
      name: "Sarah Smith",
      avatar: "https://github.com/sarahsmith.png",
      score: 92,
      skills: ["Python", "Machine Learning", "Docker"],
      repos: 38,
      stars: 890,
      followers: 156
    },
    {
      id: 3,
      username: "mikejohnson",
      name: "Mike Johnson",
      avatar: "https://github.com/mikejohnson.png",
      score: 88,
      skills: ["Java", "Spring", "AWS"],
      repos: 35,
      stars: 650,
      followers: 78
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">TalentHub</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-blue-600 font-medium">Dashboard</Link>
              <Link to="/candidates" className="text-gray-600 hover:text-blue-600 transition-colors">Explorer</Link>
              <Link to="/upload" className="text-gray-600 hover:text-blue-600 transition-colors">Job Match</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/candidates">
                  <Search className="w-4 h-4 mr-2" />
                  Search Talent
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's what's happening with your talent pipeline today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalCandidates}</div>
              <p className="text-xs text-gray-600">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.topPerformers}</div>
              <p className="text-xs text-gray-600">Score > 85</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <UserPlus className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</div>
              <p className="text-xs text-gray-600">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Matches</CardTitle>
              <Star className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.recentMatches}</div>
              <p className="text-xs text-gray-600">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Candidates Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Top Candidates This Week
                </CardTitle>
                <CardDescription>
                  Highest scoring candidates based on GitHub activity and skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCandidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.username}`}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Score: {candidate.score}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">@{candidate.username}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <GitBranch className="w-4 h-4" />
                          <span>{candidate.repos}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{candidate.stars}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{candidate.followers}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common recruitment tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/candidates">
                    <Search className="w-4 h-4 mr-2" />
                    Search Candidates
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Job Description
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Candidate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>New candidate analyzed: sarah_dev</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Job match found for React position</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Profile updated: mike_codes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
