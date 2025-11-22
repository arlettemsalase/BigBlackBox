import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { mockArtists } from "@/lib/mock-artists"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send } from "lucide-react"
import type { Message } from "@/lib/types"

export default function ChatPage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const [messageInput, setMessageInput] = useState("")
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const hasLoadedRef = useRef(false)
  
  const artist = mockArtists.find(a => a.username === `@${username}`)

  // Simulate progressive message appearance - only once
  useEffect(() => {
    console.log('🔵 ChatPage useEffect ejecutado')
    console.log('🔵 hasLoadedRef.current:', hasLoadedRef.current)
    console.log('🔵 artist:', artist)
    
    if (hasLoadedRef.current || !artist) {
      console.log('⚠️ Saliendo early - hasLoaded:', hasLoadedRef.current, 'artist:', !!artist)
      return
    }
    
    console.log('✅ Iniciando carga de mensajes')
    hasLoadedRef.current = true

    const allMessages: Message[] = [
      {
        id: "1",
        senderId: "user",
        senderName: "You",
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        content: "Hello! I love your art. I was wondering if you could do a custom drawing for me?",
        timestamp: "10:30 AM",
        type: "text"
      },
      {
        id: "2",
        senderId: artist.id,
        senderName: artist.displayName,
        senderAvatar: artist.avatar,
        content: "Of course! I'd be happy to. What did you have in mind?",
        timestamp: "10:31 AM",
        type: "text"
      },
      {
        id: "3",
        senderId: "user",
        senderName: "You",
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        content: "Awesome! I'd like a futuristic landscape in your signature style.",
        timestamp: "10:32 AM",
        type: "text"
      },
      {
        id: "4",
        senderId: artist.id,
        senderName: artist.displayName,
        senderAvatar: artist.avatar,
        content: "Great! I've created the product link for you. You can purchase it here to get started:",
        timestamp: "10:35 AM",
        type: "text"
      },
      {
        id: "5",
        senderId: artist.id,
        senderName: artist.displayName,
        senderAvatar: artist.avatar,
        content: "",
        timestamp: "10:35 AM",
        type: "product-link",
        productLink: {
          id: "13",
          title: "Ethereal Dreams",
          thumbnail: "/anime13_blur.png",
          price: 19,
          creator: artist.username
        }
      }
    ]
    
    let currentIndex = 0
    
    const showNextMessage = () => {
      console.log(`📨 Mostrando mensaje ${currentIndex + 1}/${allMessages.length}`)
      if (currentIndex < allMessages.length) {
        const messageToAdd = allMessages[currentIndex]
        console.log('📝 Mensaje a agregar:', messageToAdd)
        
        if (!messageToAdd) {
          console.error('❌ Mensaje undefined en índice:', currentIndex)
          return
        }
        
        setVisibleMessages(prev => {
          // Evitar duplicados
          if (prev.find(m => m.id === messageToAdd.id)) {
            console.warn('⚠️ Mensaje duplicado detectado:', messageToAdd.id)
            return prev
          }
          const newMessages = [...prev, messageToAdd]
          console.log('📊 Mensajes visibles ahora:', newMessages.length)
          return newMessages
        })
        currentIndex++
        
        if (currentIndex < allMessages.length) {
          console.log(`⏰ Programando siguiente mensaje en 1 segundo`)
          setTimeout(showNextMessage, 1000)
        } else {
          console.log('✅ Todos los mensajes cargados')
        }
      }
    }
    
    console.log('⏰ Iniciando primer mensaje en 500ms')
    setTimeout(showNextMessage, 500)
  }, [artist])
  
  console.log('🎨 Render - visibleMessages.length:', visibleMessages.length)

  if (!artist) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Artist not found</p>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message
      console.log("Sending message:", messageInput)
      setMessageInput("")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Chat Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <img
                src={artist.avatar}
                alt={artist.displayName}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold">{artist.username}</h2>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {visibleMessages.filter(m => m && m.id).map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.senderId === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img
                  src={message.senderAvatar}
                  alt={message.senderName}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Message Content */}
              <div
                className={`flex flex-col ${
                  message.senderId === "user" ? "items-end" : "items-start"
                }`}
              >
                {message.type === "text" && message.content && (
                  <div
                    className={`max-w-md rounded-2xl px-4 py-2 ${
                      message.senderId === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                )}

                {message.type === "product-link" && message.productLink && (
                  <Link
                    to={`/content/${message.productLink.id}`}
                    className="block max-w-md overflow-hidden rounded-xl border-2 border-primary bg-gradient-to-br from-primary/20 to-primary/5 transition-all hover:border-primary hover:shadow-lg"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={message.productLink.thumbnail}
                          alt={message.productLink.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase text-primary">
                          Pay to Unlock
                        </p>
                        <h4 className="font-semibold text-foreground line-clamp-1">
                          {message.productLink.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          by {message.productLink.creator}
                        </p>
                      </div>
                    </div>
                  </Link>
                )}

                <span className="mt-1 text-xs text-muted-foreground">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Message Input */}
      <footer className="border-t border-border bg-background p-4">
        <div className="mx-auto flex max-w-3xl gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Write a message..."
            className="flex-1 rounded-full border border-border bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="shrink-0 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
