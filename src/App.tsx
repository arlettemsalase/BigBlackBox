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
import HomePage from "@/pages/HomePage"

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
        <Route path="/" element={<HomePage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/content/:id" element={<ContentDetailPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/library/:id" element={<LibraryContentPage />} />
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
