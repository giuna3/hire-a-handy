import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, X, Calendar, MapPin, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Conversation {
  id: string;
  name: string;
  profession: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: string;
}

const ClientChatList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch messages where current user is sender or recipient
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load conversations');
        return;
      }

      if (!messages || messages.length === 0) {
        setConversations([]);
        return;
      }

      // Get unique user IDs for conversation partners
      const partnerIds = new Set<string>();
      messages.forEach((message: any) => {
        const partnerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        partnerIds.add(partnerId);
      });

      // Fetch profiles for all conversation partners
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url, skills')
        .in('user_id', Array.from(partnerIds));

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast.error('Failed to load conversation details');
        return;
      }

      // Create a map of user profiles for quick lookup
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      // Group messages by conversation partner and get latest message
      const conversationMap = new Map<string, any>();
      
      messages.forEach((message: any) => {
        const isCurrentUserSender = message.sender_id === user.id;
        const partnerId = isCurrentUserSender ? message.recipient_id : message.sender_id;
        const partnerProfile = profileMap.get(partnerId);
        
        if (!conversationMap.has(partnerId) && partnerProfile) {
          conversationMap.set(partnerId, {
            id: partnerId,
            name: partnerProfile.full_name || 'Unknown User',
            profession: partnerProfile.skills?.[0] || 'Service Provider',
            avatar: partnerProfile.avatar_url || partnerProfile.full_name?.charAt(0) || 'U',
            lastMessage: message.message_text,
            time: new Date(message.created_at).toLocaleDateString(),
            unread: 0, // TODO: Implement unread count
            status: 'offline'
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

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getBackPath = () => {
    const referrer = searchParams.get('from');
    if (referrer === 'provider') {
      return '/provider-home';
    }
    return '/client-home';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(getBackPath())}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Your conversations with service providers</p>
          </div>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Results Count */}
        {searchQuery && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? "Searching..." : `${filteredConversations.length} conversations found`}
            </p>
            <Button variant="outline" size="sm" onClick={clearSearch}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Conversations List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
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
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No conversations found" : "No messages yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No conversations match your search for "${searchQuery}"` 
                  : "Start by booking a service or contacting a provider"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/client-map')}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Providers
                </Button>
                <Button variant="outline" onClick={() => navigate('/new-job')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Post a Job
                </Button>
              </div>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <Card 
                key={conversation.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/client-chat/${conversation.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg flex-shrink-0">
                        {conversation.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{conversation.name}</h3>
                          <Badge variant="secondary" className="text-xs">{conversation.profession}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                const providerId = "550e8400-e29b-41d4-a716-446655440001";
                                const serviceId = "660e8400-e29b-41d4-a716-446655440001";
                                navigate(`/booking-payment?serviceId=${serviceId}&providerId=${providerId}`);
                              }}
                            >
                              Book Again
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {conversation.unread > 0 && (
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
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

export default ClientChatList;