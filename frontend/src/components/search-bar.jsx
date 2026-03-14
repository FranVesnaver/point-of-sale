import { Search } from "lucide-react";
import { Input } from "./ui/input.jsx";

export function SearchBar({searchTerm, setSearchTerm, placeholder}) {
    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base bg-card"
            />
        </div>
    )
}
