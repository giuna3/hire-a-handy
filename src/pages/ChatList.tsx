import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, MessageCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ChatList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "SJ",
      lastMessage: "Thank you for the excellent cleaning service!",
      time: "2m ago",
      unread: 0,
      online: true
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "MC",
      lastMessage: "Can we reschedule for tomorrow?",
      time: "1h ago",
      unread: 2,
      online: false
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      avatar: "ER",
      lastMessage: "Perfect! See you at 3 PM",
      time: "3h ago",
      unread: 0,
      online: true
    },
    {
      id: 4,
      name: "Robert Davis",
      avatar: "RD",
      lastMessage: "How long will the job take?",
      time: "1d ago",
      unread: 1,
      online: false
    },
    {
      id: 5,
      name: "Lisa Thompson",
      avatar: "LT",
      lastMessage: "Thanks for the quick response!",
      time: "2d ago",
      unread: 0,
      online: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/provider-home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg sm:text-xl font-semibold ml-4">Messages</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className="cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow"
              onClick={() => navigate(`/chat/${conversation.id}`)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-light rounded-full flex items-center justify-center text-primary font-semibold text-sm sm:text-base">
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-success rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate text-sm sm:text-base">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conversation.time}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {conversation.unread > 0 && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {conversation.unread}
                      </div>
                    )}
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {conversations.length === 0 && (
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start connecting with clients to see your conversations here
              </p>
              <Button onClick={() => navigate("/job-requests")}>
                Browse Available Jobs
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatList;