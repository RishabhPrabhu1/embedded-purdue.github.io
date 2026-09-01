import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Github, Linkedin } from "lucide-react"
import { DiscordIcon } from "@/components/icons/discord-icon"
import Image from "next/image"
export function Footer() {
  return (
    <footer className="bg-muted/50 py-12 px-4 mt-24">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <div className="flex justify-center items-center gap-2">
        <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Embedded Systems @ Purdue logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />

          </Link>
          <span className="text-2xl font-bold">Embedded Systems @ Purdue</span>
        </div>

        <p className="text-muted-foreground">
          Building the future of embedded technology, one project at a time.
        </p>

        <div className="flex justify-center gap-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="mailto:embedded@purdue.edu">
              <Mail className="w-4 h-4 mr-2" />Contact
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="https://github.com/embedded-purdue" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />GitHub
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="https://www.linkedin.com/company/embedded-purdue"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-4 h-4 mr-2" />LinkedIn
            </Link>
          </Button>

          <Button
            variant="ghost"
            asChild
            className="flex items-center justify-start space-x-3 py-3 px-4 text-lg"
          >
            <Link
              href="https://discord.gg/MkPv9s9cj3"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Discord"
              className="flex items-center"
            >
              {/* Modern Discord SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 127.14 96.36"
                className="w-6 h-6 mr-3 fill-current text-indigo-500"
              >
                <path d="M107.7 8.07A105.15 105.15 0 0 0 81.54 0a72.06 72.06 0 0 0-3.36 6.91 97.68 97.68 0 0 0-29.22 0A72.06 72.06 0 0 0 45.6 0 105.15 105.15 0 0 0 19.44 8.09C2.82 32.65-1.7 56.6.54 80.21a105.73 105.73 0 0 0 31.82 16.15 77.7 77.7 0 0 0 6.85-11.1 68.42 68.42 0 0 1-10.8-5.15c.9-.65 1.77-1.33 2.62-2a69.86 69.86 0 0 0 60.5 0c.85.7 1.72 1.38 2.62 2a68.68 68.68 0 0 1-10.8 5.15 77.7 77.7 0 0 0 6.85 11.1 105.73 105.73 0 0 0 31.82-16.15c2.45-25.46-4.19-49.33-21.3-72.14ZM42.7 65.44c-5.16 0-9.4-4.82-9.4-10.74s4.15-10.74 9.4-10.74S52.1 49 52.1 54.7c0 5.92-4.15 10.74-9.4 10.74Zm41.74 0c-5.16 0-9.4-4.82-9.4-10.74s4.15-10.74 9.4-10.74S93.84 49 93.84 54.7c0 5.92-4.15 10.74-9.4 10.74Z" />
              </svg>
              <span className="font-medium">Discord</span>
            </Link>
          </Button>

        </div>

        <p className="text-sm text-muted-foreground">Last updated: Sep 16, 2025</p>
      </div>
    </footer>
  )
}
