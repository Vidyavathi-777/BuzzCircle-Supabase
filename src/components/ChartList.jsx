import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { MessageCircle, ChevronLeft } from 'lucide-react';
import {  useNavigate } from 'react-router';

const ChatList = ({ onSelectChatPartner, selectedChatPartnerId }) => {
    const { user, loading: authLoading } = useAuth();
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from("users")
                    .select('id, name, avatar_url')
                    .neq('id', user.id)

                if (error) throw error;
                setAllUsers(data);
            } catch (err) {
                // console.error("Error fetching users:", err.message);
                setError("Failed to load users: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchUsers();
        } else if (!authLoading && !user) {
            setLoading(false);
            setError("You must be logged in to see chat partners.");
        }
    }, [user, authLoading]);

    if (authLoading || loading) return <div className="p-4 text-center text-gray-600">Loading users...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
    if (!user) return <div className="p-4 text-center text-gray-500">Please log in to chat.</div>;

    return (
        <div className='p-4 h-full flex flex-col'>
            <div className='flex items-center '>
            <button onClick={() => navigate(-1)} className="p-2 pt-0 rounded-full hover:bg-gray-100    transition-colors duration-200">
                <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className='text-xl font-bold mb-4 text-gray-800'>Start a New Chat</h2>
            </div> 
            {allUsers.length === 0 ? (
                <p className='text-gray-500 text-center flex-grow flex items-center justify-center'>No Other Users Found</p>
            ) : (
                <ul className='space-y-3 overflow-y-auto flex-grow'>
                    {allUsers.map((otherUser) => {
                        return (
                            <li
                                key={otherUser.id}
                                className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${selectedChatPartnerId === otherUser.id ? 'bg-purple-200' : 'bg-gray-50'
                                    }`}

                                onClick={() => onSelectChatPartner({
                                    id: otherUser.id,
                                    name: otherUser.name || otherUser.username || 'Unknown User',
                                    avatar_url: otherUser.avatar_url
                                })}
                            >
                                <div className='flex items-center gap-3'>
                                    <img
                                        src={otherUser.avatar_url}
                                        alt={otherUser.name || 'User Avatar'}
                                        className='w-10 h-10 rounded-full object-cover'
                                    />
                                    <div>
                                        <p className='font-semibold text-gray-800'>{otherUser.name}</p>
                                    </div>
                                </div>
                                <MessageCircle size={20} className="text-blue-500" />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default ChatList;