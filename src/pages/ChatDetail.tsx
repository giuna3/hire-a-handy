import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Paperclip, Phone, Video, MoreVertical } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ChatDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm interested in your cleaning services. Are you available this weekend?",
      sender: "client",
      time: "10:30 AM"
    },
    {
      id: 2,
      text: "Hello! Yes, I'm available this weekend. What type of cleaning do you need?",
      sender: "provider",
      time: "10:32 AM"
    },
    {
      id: 3,
      text: "I need a deep clean for my 2-bedroom apartment. Kitchen and bathrooms especially.",
      sender: "client",
      time: "10:35 AM"
    },
    {
      id: 4,
      text: "Perfect! I can do that for you. For a 2-bedroom deep clean, my rate is $120. Would Saturday at 2 PM work?",
      sender: "provider",
      time: "10:37 AM"
    },
    {
      id: 5,
      text: "That sounds great! Saturday at 2 PM works perfectly. Should I prepare anything beforehand?",
      sender: "client",
      time: "10:40 AM"
    },
    {
      id: 6,
      text: "Just make sure I have access to all rooms and clear any personal items you don't want moved. I'll bring all cleaning supplies!",
      sender: "provider",
      time: "10:42 AM"
    }
  ]);

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
        sender: "provider",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'provider' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender === 'provider'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'provider' 
                  ? 'text-primary-foreground/70' 
                  : 'text-muted-foreground'
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t bg-card p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
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