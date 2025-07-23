import React, { useState } from 'react'
import ChatList from '../components/ChartList'
import ChatWindow from '../components/ChatWindow'

const ChatPage = () => {
    const [selectedChatPartner, setSelectedChatPartner] = useState(null)
    return (
        <div className="flex h-[calc(100vh-60px)]  bg-gray-100"> 

            <div className={`w-full md:w-1/3 border-r border-gray-200 bg-white shadow-lg ${selectedChatPartner ? 'hidden md:block' : 'block'}`}>
                <ChatList
                    onSelectChatPartner={setSelectedChatPartner}
                    selectedChatPartnerId={selectedChatPartner?.id} 
                />
            </div>

            <div className={`w-full md:w-2/3 ${selectedChatPartner ? 'block' : 'hidden md:block'}`}>
                {selectedChatPartner ? (
                    <ChatWindow
                        chatPartnerId={selectedChatPartner.id}
                        chatPartnerName={selectedChatPartner.name}
                        chatPartnerAvatar={selectedChatPartner.avatar_url}
                        onBack={() => setSelectedChatPartner(null)} 
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a user from the left to start chatting.
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatPage
// const ChatPage = () => {
//     const [selectedChatPartner, setSelectedChatPartner] = useState(null)
//     return (
//         <div className="flex h-full max-h-[94vh]  bg-gray-100 "> 

//             <div className={`w-full md:w-1/3 border-r border-gray-200 bg-white shadow-lg ${selectedChatPartner ? 'hidden md:block' : 'block'}`}>
//                 <ChatList
//                     onSelectChatPartner={setSelectedChatPartner}
//                     selectedChatPartnerId={selectedChatPartner?.id} 
//                 />
//             </div>

//             <div className={`w-full md:w-2/3 ${selectedChatPartner ? 'block' : 'hidden md:block'}`}>
//                 {selectedChatPartner ? (
//                     <ChatWindow
//                         chatPartnerId={selectedChatPartner.id}
//                         chatPartnerName={selectedChatPartner.name}
//                         chatPartnerAvatar={selectedChatPartner.avatar_url}
//                         onBack={() => setSelectedChatPartner(null)} 
//                     />
//                 ) : (
//                     <div className="flex items-center justify-center h-full text-gray-500">
//                         Select a user from the left to start chatting.
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default ChatPage