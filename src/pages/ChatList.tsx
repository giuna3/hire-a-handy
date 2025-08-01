import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, MessageCircle, User, X, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const ChatList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine user role from URL or localStorage
  const getUserRole = () => {
    const currentPath = window.location.pathname;
    const referrer = document.referrer;
    
    // Check if coming from client or provider routes
    if (referrer.includes('client') || localStorage.getItem('userRole') === 'client') {
      return 'client';
    }
    return 'provider'; // default to provider
  };

  const userRole = getUserRole();
  
  const getBackPath = () => {
    return userRole === 'client' ? '/client-home' : '/provider-home';
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setConversations([]);
        return;
      }

      // Fetch all unique conversations for the current user
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          message_text,
          created_at,
          profiles!messages_sender_id_fkey(full_name),
          profiles!messages_recipient_id_fkey(full_name)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        setConversations([]);
        return;
      }

      // Group messages by conversation partner
      const conversationMap = new Map();
      
      messagesData?.forEach((message: any) => {
        const isCurrentUserSender = message.sender_id === user.id;
        const partnerId = isCurrentUserSender ? message.recipient_id : message.sender_id;
        const partnerProfile = isCurrentUserSender 
          ? message.profiles_recipient_id_fkey 
          : message.profiles_sender_id_fkey;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            id: partnerId,
            name: partnerProfile?.full_name || 'Unknown User',
            avatar: partnerProfile?.full_name 
              ? partnerProfile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
              : 'U',
            lastMessage: message.message_text,
            time: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: 0, // TODO: Implement unread count
            online: false
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    searchQuery === "" || 
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate(getBackPath())}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold ml-4">Messages</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {userRole === 'client' ? 'Client View' : 'Provider View'}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
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
              {loading ? "Searching..." : `Found ${filteredConversations.length} conversation${filteredConversations.length !== 1 ? 's' : ''}`}
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
        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <>
              {/* Empty State for Search */}
              {searchQuery ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No conversations found</h3>
                    <p className="text-muted-foreground mb-6">
                      No conversations match "{searchQuery}". Try searching for a different name or keyword.
                    </p>
                    <Button variant="outline" onClick={clearSearch}>
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* Empty State for No Conversations */
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      {userRole === 'client' 
                        ? "Start by booking a service or contacting a provider to see your conversations here"
                        : "Start connecting with clients to see your conversations here"
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {userRole === 'client' ? (
                        <>
                          <Button onClick={() => navigate("/client-map")}>
                            <MapPin className="w-4 h-4 mr-2" />
                            Find Providers
                          </Button>
                          <Button variant="outline" onClick={() => navigate("/new-job")}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Post a Job
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => navigate("/job-requests")}>
                          Browse Available Jobs
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            filteredConversations.map((conversation) => (
              <Card 
                key={conversation.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/chat/${conversation.id}`)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm sm:text-base">
                        {conversation.avatar}
                      </div>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-background" />
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;