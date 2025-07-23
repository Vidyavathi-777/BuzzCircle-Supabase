import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { ChevronLeft, Send } from 'lucide-react'
import { format } from 'date-fns'

const ChatWindow = ({ chatPartnerId, chatPartnerName, onBack }) => {
    const { user, profile } = useAuth()
    const [messages, setMessages] = useState([])
    const [newMessageContent, setNewMessageContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [chatPartner, setChatPartner] = useState(null)

    const messagesEndRef = useRef(null)
    const channelRef = useRef(null) 

    const chatPairId = chatPartnerId && user?.id ? [user.id, chatPartnerId].sort().join('_') : null

    useEffect(() => {
        if (!user || !chatPartnerId || !chatPairId) {
            setLoading(true)
            setError(null)
            setMessages([])
            return
        }

        setLoading(true)
        setError(null)

        const fetchAndSubscribeMessages = async () => {
            try {
                
                const { data: partnerData, error: partnerError } = await supabase
                    .from('users')
                    .select('id, name, avatar_url')
                    .eq('id', chatPartnerId)
                    .single()

                if (partnerError) throw partnerError
                setChatPartner(partnerData)

                
                const { data, error } = await supabase
                    .from("direct_messages")
                    .select(`
                        *,
                        sender:sender_id(id, name, avatar_url),
                        receiver:receiver_id(id, name, avatar_url)
                    `)
                    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${chatPartnerId}),and(sender_id.eq.${chatPartnerId},receiver_id.eq.${user.id})`)
                    .order('created_at', { ascending: true });

                if (error) throw error
                // console.log("fetched messages:", data)
                setMessages(data || [])
            } catch (err) {
                // console.error("Error fetching messages:", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }

            
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
            }

            
            channelRef.current = supabase
                .channel(`chat_messages_${chatPairId}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'direct_messages',
                    
                }, async (payload) => {
                    // console.log("Real-time payload:", payload)
                    
                    
                    const newMessage = payload.new
                    const isRelevantMessage = 
                        (newMessage.sender_id === user.id && newMessage.receiver_id === chatPartnerId) ||
                        (newMessage.sender_id === chatPartnerId && newMessage.receiver_id === user.id)
                    
                    if (!isRelevantMessage) {
                        return 
                    }

                    try {
                        
                        const { data: message, error: messageError } = await supabase
                            .from('direct_messages')
                            .select(`
                                *,
                                sender:sender_id(id, name, avatar_url),
                                receiver:receiver_id(id, name, avatar_url)
                            `)
                            .eq('id', newMessage.id)
                            .single()

                        if (messageError) {
                            // console.error("Error hydrating new message:", messageError)
                            
                            setMessages((prev) => [...prev, newMessage])
                        } else {
                            // console.log("Adding new message:", message)
                            setMessages((prev) => [...prev, message])
                        }
                    } catch (err) {
                        // console.error("Error processing real-time message:", err)
                        
                        setMessages((prev) => [...prev, newMessage])
                    }
                })
                .subscribe((status) => {
                    // console.log("Channel subscription status:", status)
                })
        }

        fetchAndSubscribeMessages()

        
        return () => {
            if (channelRef.current) {
                // console.log("Cleaning up channel")
                supabase.removeChannel(channelRef.current)
                channelRef.current = null
            }
        }

    }, [user, chatPairId, chatPartnerId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessageContent.trim() || !user || !chatPartnerId) return

        try {
            // console.log("Sending message:", {
            //     sender_id: user.id,
            //     receiver_id: chatPartnerId,
            //     content: newMessageContent.trim()
            // })

            const { data, error } = await supabase.from("direct_messages").insert({
                sender_id: user.id,
                receiver_id: chatPartnerId,
                content: newMessageContent.trim(),
                is_read: false
            }).select()

            if (error) throw error
            
            // console.log("Message sent successfully:", data)
            setNewMessageContent("")
        } catch (err) {
            // console.error("Error sending message:", err)
            setError(err.message)
        }
    }

    if (loading) return <div className="flex flex-col flex-1 items-center justify-center bg-gray-50"><p>Loading chat...</p></div>;
    if (error) return <div className="flex flex-col flex-1 items-center justify-center bg-gray-50 text-red-500"><p>{error}</p></div>;
    if (!user) return <div className="flex flex-col flex-1 items-center justify-center bg-gray-50 text-gray-600"><p>Please log in to chat.</p></div>;
    if (!chatPartnerId) return <div className="flex flex-col flex-1 items-center justify-center bg-gray-50 text-gray-600"><p>Select a user to chat with.</p></div>;

    return (
        <div className='flex flex-col flex-1 h-full bg-white border-l border-gray-200'>
            <div className='p-4 border-b border-gray-200 bg-gray-50 flex items-center shadow-sm'>
                <button onClick={onBack} className="md:hidden p-2 rounded-full hover:bg-gray-200 mr-2">
                    <ChevronLeft size={24} />
                </button>
                <img
                    src={chatPartner?.avatar_url }
                    alt={chatPartner?.name || chatPartnerName}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <h3 className="text-lg font-semibold text-gray-800">{chatPartner?.name || chatPartnerName}</h3>
            </div>
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No messages yet. Say hello!</div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id}
                            className={`flex items-start gap-3 ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender_id !== user.id && (
                                <img
                                    src={msg.sender?.avatar_url }
                                    alt={msg.sender?.name || 'User'}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                            )}
                            <div
                                className={`p-3 rounded-lg max-w-[75%] ${msg.sender_id === user.id
                                    ? 'bg-purple-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                <p className="text-sm break-words">{msg.content}</p>
                                <span className="text-xs mt-1 block text-right opacity-75">
                                    {format(new Date(msg.created_at), 'hh:mm a')}
                                </span>
                            </div>
                            {msg.sender_id === user.id && (
                                <img
                                    src={profile?.avatar_url }
                                    alt={profile?.name || user?.email || 'You'}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50 flex items-center gap-2">
                <input
                    type="text"
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!user || !chatPartnerId}
                />
                <button
                    type="submit"
                    className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newMessageContent.trim() || !user || !chatPartnerId}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    )
}

export default ChatWindow