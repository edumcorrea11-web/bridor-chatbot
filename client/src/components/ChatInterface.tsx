import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { nanoid } from "nanoid";

interface Message {
  id: number;
  sender: "bot" | "customer" | "agent";
  content: string;
  messageType: "text" | "catalog" | "menu" | "system";
  createdAt: Date;
}

export default function ChatInterface() {
  const [sessionId] = useState(() => nanoid());
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startConversation = trpc.chat.startConversation.useMutation();
  const sendMessage = trpc.chat.sendMessage.useMutation();

  useEffect(() => {
    // Iniciar conversa automaticamente
    startConversation.mutate(
      { sessionId },
      {
        onSuccess: (data) => {
          setMessages([data.welcomeMessage as Message]);
        },
      }
    );
  }, [sessionId]);

  useEffect(() => {
    // Auto-scroll para última mensagem
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "customer",
      content: inputValue,
      messageType: "text",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await sendMessage.mutateAsync({
        sessionId,
        content: inputValue,
      });

      setIsTyping(false);
      // Criar objeto Message a partir da string retornada
      const botMessage: Message = {
        id: Date.now(),
        sender: "bot",
        content: response.message,
        messageType: "text",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setIsTyping(false);
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header estilo WhatsApp */}
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3 shadow-md">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-semibold">
            B
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-base">Bridor Atendimento</h1>
            <p className="text-xs opacity-90">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Área de mensagens */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-[#e5ddd5]"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h100v100H0z\" fill=\"%23e5ddd5\"/%3E%3Cpath d=\"M20 20h60v60H20z\" fill=\"%23d9d0c7\" opacity=\".1\"/%3E%3C/svg%3E')",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"} animate-slide-up`}
          >
            <div
              className={
                msg.sender === "customer"
                  ? "chat-bubble-sent"
                  : "chat-bubble-received"
              }
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {msg.content}
              </p>
              <span
                className={`text-[10px] mt-1 block ${
                  msg.sender === "customer"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="chat-bubble-received">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input de mensagem */}
      <div className="bg-card border-t px-4 py-3 flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite uma mensagem..."
          className="flex-1 rounded-full"
          disabled={isTyping}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          size="icon"
          className="rounded-full h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
