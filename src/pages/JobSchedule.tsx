import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const JobSchedule = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const todayJobs: any[] = []; // Empty array - no mock data

  const upcomingJobs: any[] = []; // Empty array - no mock data

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "default";
      case "pending": return "secondary";
      case "completed": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/provider-home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('jobSchedule.back')}
          </Button>
          <h1 className="text-xl font-semibold ml-4">{t('jobSchedule.title')}</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1 shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                {t('jobSchedule.calendar')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Schedule */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Jobs */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle>{t('jobSchedule.todaysJobs')}</CardTitle>
              </CardHeader>
              <CardContent>
                {todayJobs.length > 0 ? (
                  <div className="space-y-4">
                    {todayJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">{job.title}</h4>
                            <Badge variant={getStatusColor(job.status)}>
                              {t(`jobSchedule.${job.status}`)}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              {job.client}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {job.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {job.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">${job.price}</p>
                          <Button size="sm" className="mt-2">
                            {t('jobSchedule.viewDetails')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">{t('jobSchedule.noJobsToday')}</p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Jobs */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle>{t('jobSchedule.upcomingJobs')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{job.title}</h4>
                          <Badge variant={getStatusColor(job.status)}>
                            {t(`jobSchedule.${job.status}`)}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {job.client}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {job.date}, {job.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {job.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">${job.price}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          {t('jobSchedule.reschedule')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSchedule;