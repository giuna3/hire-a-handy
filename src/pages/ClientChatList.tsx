import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, MessageCircle, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ClientChatList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Client-focused conversations - these would be with providers they've hired or contacted
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      profession: "House Cleaner",
      avatar: "SJ",
      lastMessage: "I'll be there at 2 PM for the cleaning service!",
      time: "5m ago",
      unread: 1,
      online: true,
      jobType: "House Cleaning",
      status: "confirmed"
    },
    {
      id: 2,
      name: "Mike Chen",
      profession: "Handyman",
      avatar: "MC",
      lastMessage: "The repair work has been completed successfully.",
      time: "2h ago",
      unread: 0,
      online: false,
      jobType: "Home Repair",
      status: "completed"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      profession: "Math Tutor",
      avatar: "ER",
      lastMessage: "Ready for tomorrow's tutoring session?",
      time: "1d ago",
      unread: 0,
      online: true,
      jobType: "Math Tutoring",
      status: "scheduled"
    },
    {
      id: 4,
      name: "David Wilson",
      profession: "Gardener",
      avatar: "DW",
      lastMessage: "I can start the garden work this weekend.",
      time: "2d ago",
      unread: 2,
      online: false,
      jobType: "Garden Maintenance",
      status: "pending"
    },
    {
      id: 5,
      name: "Lisa Parker",
      profession: "Pet Sitter",
      avatar: "LP",
      lastMessage: "Your pet is doing great! Sending photos.",
      time: "3d ago",
      unread: 0,
      online: true,
      jobType: "Pet Sitting",
      status: "active"
    }
  ];

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    searchQuery === "" || 
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.jobType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "active": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/client-home")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold ml-4">My Conversations</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Client View
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers, services, or messages..."
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={clearSearch}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''} 
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            {filteredConversations.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearSearch}>
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Conversations List */}
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className="cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow"
              onClick={() => navigate(`/client-chat/${conversation.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center text-primary font-semibold text-base">
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-base">{conversation.name}</h3>
                        <p className="text-sm text-muted-foreground">{conversation.profession}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{conversation.time}</span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(conversation.status)}`}>
                        {conversation.jobType} • {conversation.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/provider-profile/${conversation.id}`);
                          }}
                        >
                          View Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // For demo purposes, using mock service and provider IDs
                            const providerId = "550e8400-e29b-41d4-a716-446655440001"; // Mock provider ID
                            const serviceId = "660e8400-e29b-41d4-a716-446655440001"; // Mock service ID
                            navigate(`/booking-payment?serviceId=${serviceId}&providerId=${providerId}`);
                          }}
                        >
                          Book Again
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        {conversation.unread > 0 && (
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {conversation.unread}
                          </div>
                        )}
                        <MessageCircle className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for Search */}
        {searchQuery && filteredConversations.length === 0 && (
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No conversations found</h3>
              <p className="text-muted-foreground mb-6">
                No conversations match "{searchQuery}". Try searching for a different provider or service.
              </p>
              <Button variant="outline" onClick={clearSearch}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State for No Conversations */}
        {!searchQuery && filteredConversations.length === 0 && (
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Conversations Yet</h3>
              <p className="text-muted-foreground mb-6">
                Once you start hiring providers, your conversations will appear here
              </p>
              <Button onClick={() => navigate("/client-home")}>
                Find Providers
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientChatList;