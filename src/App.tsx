import { Routes, Route, Navigate } from "react-router-dom"
import { WalletProvider, useWallet } from "@/lib/wallet-context"
import { Toaster } from "@/components/ui/sonner"
import { FreighterModal } from "@/components/freighter-modal"
import { KYCModal } from "@/components/kyc-modal"
import ConnectPage from "@/pages/ConnectPage"
import DiscoverPage from "@/pages/DiscoverPage"
import ContentDetailPage from "@/pages/ContentDetailPage"
import LibraryPage from "@/pages/LibraryPage"
import LibraryContentPage from "@/pages/LibraryContentPage"
import ArtistsPage from "@/pages/ArtistsPage"
import ArtistProfilePage from "@/pages/ArtistProfilePage"
import ChatPage from "@/pages/ChatPage"

function AppContent() {
  const { 
    showFreighterModal, 
    setShowFreighterModal, 
    freighterMode, 
    handleFreighterConnect,
    showKYCModal,
    setShowKYCModal,
    handleKYCComplete
  } = useWallet()

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/discover" replace />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/content/:id" element={<ContentDetailPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/library/:id" element={<LibraryContentPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/artists/:username" element={<ArtistProfilePage />} />
        <Route path="/chat/:username" element={<ChatPage />} />
      </Routes>
      <Toaster />
      {showFreighterModal && (
        <FreighterModal
          mode={freighterMode}
          onClose={() => setShowFreighterModal(false)}
          onConnect={handleFreighterConnect}
        />
      )}
      {showKYCModal && (
        <KYCModal
          onComplete={handleKYCComplete}
          onCancel={() => {
            setShowKYCModal(false)
            setShowFreighterModal(false)
          }}
        />
      )}
    </>
  )
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  )
}

export default App
