import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Earnings = () => {
  const navigate = useNavigate();

  const weeklyEarnings = [
    { week: "This Week", amount: 425, jobs: 6 },
    { week: "Last Week", amount: 380, jobs: 5 },
    { week: "2 Weeks Ago", amount: 520, jobs: 7 },
    { week: "3 Weeks Ago", amount: 290, jobs: 4 }
  ];

  const recentJobs = [
    {
      id: 1,
      title: "House Cleaning",
      client: "Sarah M.",
      date: "Today",
      amount: 75,
      status: "completed"
    },
    {
      id: 2,
      title: "Lawn Mowing",
      client: "Mike R.",
      date: "Yesterday",
      amount: 50,
      status: "completed"
    },
    {
      id: 3,
      title: "Furniture Assembly",
      client: "Emma L.",
      date: "2 days ago",
      amount: 60,
      status: "completed"
    }
  ];

  const stats = {
    totalEarnings: 2847,
    thisMonth: 1615,
    lastPayout: 450,
    pendingPayout: 185
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/provider-home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold ml-4">Earnings</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold">${stats.totalEarnings}</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">${stats.thisMonth}</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Download className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">${stats.lastPayout}</p>
              <p className="text-sm text-muted-foreground">Last Payout</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold">${stats.pendingPayout}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Breakdown */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Breakdown</CardTitle>
                <Select defaultValue="4weeks">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="4weeks">Last 4 Weeks</SelectItem>
                    <SelectItem value="8weeks">Last 8 Weeks</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyEarnings.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{week.week}</p>
                      <p className="text-sm text-muted-foreground">{week.jobs} jobs completed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">${week.amount}</p>
                      <p className="text-sm text-muted-foreground">${(week.amount / week.jobs).toFixed(0)}/job avg</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Jobs */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Recent Completed Jobs</CardTitle>
              <CardDescription>Your latest earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">Client: {job.client}</p>
                      <p className="text-xs text-muted-foreground">{job.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-success">+${job.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payout Section */}
        <Card className="shadow-[var(--shadow-card)] mt-6">
          <CardHeader>
            <CardTitle>Payout Management</CardTitle>
            <CardDescription>Request payouts and manage your earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 bg-muted rounded-lg">
              <div>
                <p className="font-semibold text-lg">Available for Payout</p>
                <p className="text-muted-foreground">Earnings from completed jobs</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-2xl text-success">${stats.pendingPayout}</p>
                <Button className="mt-2">
                  Request Payout
                </Button>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>• Payouts are processed within 1-2 business days</p>
              <p>• Minimum payout amount is $50</p>
              <p>• Transaction fees may apply based on payment method</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Earnings;