import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { Search } from "lucide-react";
import LoginWidget from "./login-widget";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="text-2xl font-bold">
          <span className=" bg-gradient-to-r from-white to-reddit text-transparent bg-clip-text">
            RedditClone
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-64"
            />
          </div>
          <LoginWidget />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
