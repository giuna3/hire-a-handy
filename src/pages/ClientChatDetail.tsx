import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Paperclip, MoreVertical, Image, FileText, X, Check, CheckCheck, Star, MapPin, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
  type: string;
  status: string;
  fileUrl?: string;
  fileSize?: number;
}

interface Provider {
  name: string;
  profession: string;
  avatar: string;
  online: boolean;
  lastSeen: string;
  rating: number;
  reviews: number;
  verified: boolean;
}

const ClientChatDetail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchChatData();
  }, [id]);

  const fetchChatData = async () => {
    try {
      setLoading(true);
      
      if (!id) {
        setProvider(null);
        setMessages([]);
        return;
      }

      // Fetch provider profile based on the ID
      const { data: profile, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching provider:', error);
        setProvider(null);
        setMessages([]);
        return;
      }

      if (profile) {
        // Set provider data
        setProvider({
          name: profile.full_name || 'Provider',
          profession: profile.skills?.[0] || 'Service Provider',
          avatar: profile.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'P',
          online: false,
          lastSeen: '',
          rating: 0,
          reviews: 0,
          verified: false
        });
        
        // For now, start with empty messages - in a real app, fetch existing chat history
        setMessages([]);
      } else {
        setProvider(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching chat data:', error);
      toast.error('Failed to load chat');
      setProvider(null);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sending":
        return <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />;
      case "sent":
        return <Check className="w-3 h-3" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        text: message,
        sender: "client",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text",
        status: "sending"
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...selectedFileArray]);
      
      // Create file messages
      selectedFileArray.forEach(file => {
        const fileMessage: Message = {
          id: (messages.length + selectedFiles.length + 1).toString(),
          text: file.name,
          sender: "client",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: file.type.startsWith('image/') ? 'image' : 'file',
          fileUrl: URL.createObjectURL(file),
          fileSize: file.size,
          status: "sending"
        };
        setMessages(prev => [...prev, fileMessage]);
      });
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chat not found</h3>
          <p className="text-muted-foreground mb-4">
            This conversation doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate("/client-chat-list")}>
            Back to Messages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/client-chat-list")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3 ml-4">
              <div className="relative">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                  {provider.avatar}
                </div>
                {provider.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-semibold">{provider.name}</h1>
                  {provider.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{provider.profession}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{provider.rating}</span>
                    <span>({provider.reviews})</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{provider.lastSeen}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(`/provider-profile/${id}`)}
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Provider Actions Bar */}
      <div className="bg-card border-b p-3">
        <div className="flex items-center justify-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/provider-profile/${id}`)}
          >
            View Profile
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/client-map')}
          >
            <MapPin className="w-4 h-4 mr-1" />
            View Location
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start the conversation</h3>
            <p className="text-muted-foreground">
              Send a message to begin your conversation with {provider.name}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender === 'client'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {msg.type === 'text' && (
                  <p className="text-sm">{msg.text}</p>
                )}
                
                {msg.type === 'image' && (
                  <div className="space-y-2">
                    <img 
                      src={msg.fileUrl} 
                      alt={msg.text}
                      className="max-w-full h-auto rounded-lg"
                      style={{ maxHeight: '200px' }}
                    />
                    <p className="text-xs">{msg.text}</p>
                    <p className="text-xs opacity-70">{formatFileSize(msg.fileSize!)}</p>
                  </div>
                )}
                
                {msg.type === 'file' && (
                  <div className="flex items-center space-x-3 p-2 bg-black/10 rounded-lg">
                    <FileText className="w-8 h-8 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{msg.text}</p>
                      <p className="text-xs opacity-70">{formatFileSize(msg.fileSize!)}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex-shrink-0 h-8 w-8 p-0"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = msg.fileUrl!;
                        link.download = msg.text;
                        link.click();
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  </div>
                )}
                
                <div className={`flex items-center justify-between mt-1 ${
                  msg.sender === 'client' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  <p className="text-xs">{msg.time}</p>
                  {msg.sender === 'client' && (
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(msg.status)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t bg-card p-4">
        {/* File Preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center bg-muted p-2 rounded-lg">
                <div className="flex items-center space-x-2 flex-1">
                  {file.type.startsWith('image/') ? (
                    <Image className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-2"
                  onClick={() => removeSelectedFile(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,application/pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleFileSelect}>
            <Paperclip className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-12"
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientChatDetail;