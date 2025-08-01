import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Paperclip, Phone, Video, MoreVertical, Image, FileText, X, Check, CheckCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ChatDetail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [message, setMessage] = useState("");

  // Determine user role (same logic as ChatList)
  const getUserRole = () => {
    const referrer = document.referrer;
    if (referrer.includes('client') || localStorage.getItem('userRole') === 'client') {
      return 'client';
    }
    return 'provider';
  };

  const userRole = getUserRole();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm interested in your cleaning services. Are you available this weekend?",
      sender: "client",
      time: "10:30 AM",
      type: "text",
      status: "read"
    },
    {
      id: 2,
      text: "Hello! Yes, I'm available this weekend. What type of cleaning do you need?",
      sender: "provider",
      time: "10:32 AM",
      type: "text",
      status: "read"
    },
    {
      id: 3,
      text: "I need a deep clean for my 2-bedroom apartment. Kitchen and bathrooms especially.",
      sender: "client",
      time: "10:35 AM",
      type: "text",
      status: "read"
    },
    {
      id: 4,
      text: "Perfect! I can do that for you. For a 2-bedroom deep clean, my rate is $120. Would Saturday at 2 PM work?",
      sender: "provider",
      time: "10:37 AM",
      type: "text",
      status: "read"
    },
    {
      id: 5,
      text: "That sounds great! Saturday at 2 PM works perfectly. Should I prepare anything beforehand?",
      sender: "client",
      time: "10:40 AM",
      type: "text",
      status: "delivered"
    },
    {
      id: 6,
      text: "Just make sure I have access to all rooms and clear any personal items you don't want moved. I'll bring all cleaning supplies!",
      sender: "provider",
      time: "10:42 AM",
      type: "text",
      status: "sent"
    }
  ]);

  // Auto-update message status for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => {
          if (msg.sender === userRole) {
            // Simulate message status progression for user's own messages
            if (msg.status === "sending") return { ...msg, status: "sent" };
            if (msg.status === "sent" && Math.random() > 0.7) return { ...msg, status: "delivered" };
            if (msg.status === "delivered" && Math.random() > 0.8) return { ...msg, status: "read" };
          }
          return msg;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [userRole]);

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: userRole, // Dynamic sender based on user role
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text",
        status: "sending"
      };
      setMessages([...messages, newMessage]);
      setMessage("");
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
        const fileMessage = {
          id: messages.length + selectedFiles.length + 1,
          text: file.name,
          sender: userRole,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mock contact info
  const contact = {
    name: "Sarah Johnson",
    avatar: "SJ",
    online: true,
    lastSeen: "Active now"
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/chat-list")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3 ml-4">
              <div className="relative">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-semibold">
                  {contact.avatar}
                </div>
                {contact.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <h1 className="font-semibold">{contact.name}</h1>
                <p className="text-sm text-muted-foreground">{contact.lastSeen}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === userRole ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender === userRole
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
                  <p className="text-xs opacity-70">{formatFileSize(msg.fileSize)}</p>
                </div>
              )}
              
              {msg.type === 'file' && (
                <div className="flex items-center space-x-3 p-2 bg-black/10 rounded-lg">
                  <FileText className="w-8 h-8 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{msg.text}</p>
                    <p className="text-xs opacity-70">{formatFileSize(msg.fileSize)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex-shrink-0 h-8 w-8 p-0"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = msg.fileUrl;
                      link.download = msg.text;
                      link.click();
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                </div>
              )}
              
              <div className={`flex items-center justify-between mt-1 ${
                msg.sender === userRole 
                  ? 'text-primary-foreground/70' 
                  : 'text-muted-foreground'
              }`}>
                <p className="text-xs">{msg.time}</p>
                {msg.sender === userRole && (
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(msg.status)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
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

export default ChatDetail;