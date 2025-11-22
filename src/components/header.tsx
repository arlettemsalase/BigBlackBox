"use client"

import { Link } from "react-router-dom"
import { Box, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWallet } from "@/lib/wallet-context"

export function Header() {
  const { isConnected, address, disconnect } = useWallet()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/discover" className="flex items-center gap-2">
          <Box className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Big Black Box</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/discover"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Discover
          </Link>
          <Link
            to="/artists"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Artists
          </Link>
          <Link
            to="/library"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            My Library
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/library">My Library</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wallet">Wallet</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={disconnect}>Disconnect</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/connect">Connect Wallet</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
