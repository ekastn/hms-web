import type React from "react";
import { Input } from "../atoms/Input";
import { Search } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = "Search...",
    className,
}) => {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="pl-8"
            />
        </div>
    );
};
