import { Routes, Route, Navigate } from "react-router-dom"
import { WalletProvider } from "@/lib/wallet-context"
import { Toaster } from "@/components/ui/sonner"
import ConnectPage from "@/pages/ConnectPage"
import DiscoverPage from "@/pages/DiscoverPage"
import ContentDetailPage from "@/pages/ContentDetailPage"
import LibraryPage from "@/pages/LibraryPage"
import LibraryContentPage from "@/pages/LibraryContentPage"
import ReviewPage from "@/pages/ReviewPage"

function App() {
  return (
    <WalletProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/discover" replace />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/content/:id" element={<ContentDetailPage />} />
        <Route path="/content/:id/review" element={<ReviewPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/library/:id" element={<LibraryContentPage />} />
      </Routes>
      <Toaster />
    </WalletProvider>
  )
}

export default App
