"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Users, FolderOpen, Mail, UserSquare2 } from "lucide-react"
import { DiscordIcon } from "@/components/icons/discord-icon"
import Image from "next/image"
import { FaDiscord } from "react-icons/fa";


const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Users },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Workshops", href: "/workshops", icon: Mail },
  { name: "Team", href: "/team", icon: UserSquare2 },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* allow height to grow instead of hard-capping at h-16 */}
        <div className="flex justify-between items-center min-h-16 py-2">
          {/* Logo + brand */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Embedded Systems @ Purdue logo"
              width={70}
              height={40}
              className="object-contain"
              priority
            />
            {/* Short label on xs, full on md+; prevent wrap on small to avoid overlap */}
            {/* <span className="font-bold text-lg text-foreground lg:hidden">
              ES@P
            </span> */}
            <span className="hidden lg:inline font-bold text-lg text-foreground whitespace-nowrap">
              Embedded Systems at Purdue
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {item.name}
                </Link>
              )
            })}
            <Button
              variant="ghost"
              size="lg" // larger touch target
              asChild
              className="flex items-center justify-start space-x-3 py-3 px-4 text-lg"
            >
              <Link
                href="https://discord.gg/MkPv9s9cj3"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="flex items-center"
              >
                <span className="font-medium">Discord</span>

                <FaDiscord className="w-6 h-6 mr-3 text-indigo-500" />
              </Link>
            </Button>
          </div>

          {/* Mobile nav */}
          <div className="flex items-center md:hidden">
            <Button asChild variant="ghost" size="icon" aria-label="Join our Discord">
              <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                <FaDiscord className="w-6 h-6 mr-3 text-indigo-500" />
              </Link>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const active = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${active ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    )
                  })}
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href="https://discord.gg/MkPv9s9cj3"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Join our Discord"
                    >
                    <FaDiscord className="w-6 h-6 mr-3 text-indigo-500" />
                      <span>Discord</span>
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
