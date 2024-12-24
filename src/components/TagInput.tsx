import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface TagInputProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagInput = ({ selectedTags, onTagsChange }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const { data, error } = await supabase
      .from("tags")
      .select("name")
      .ilike("name", `${query}%`)
      .limit(5);

    if (error) {
      console.error("Error fetching tags:", error);
      return;
    }

    setSuggestions(data.map(tag => tag.name));
  };

  const addTag = async (tagName: string) => {
    const normalizedTag = tagName.toLowerCase().trim();
    
    if (!normalizedTag || selectedTags.includes(normalizedTag)) {
      return;
    }

    // First, try to create the tag if it doesn't exist
    const { data: existingTag, error: fetchError } = await supabase
      .from("tags")
      .select("name")
      .eq("name", normalizedTag)
      .single();

    if (!existingTag && !fetchError) {
      const { error: insertError } = await supabase
        .from("tags")
        .insert([{ name: normalizedTag }]);

      if (insertError) {
        toast({
          title: "Error",
          description: "Failed to create tag",
          variant: "destructive",
        });
        return;
      }
    }

    onTagsChange([...selectedTags, normalizedTag]);
    setInputValue("");
    setSuggestions([]);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  useEffect(() => {
    fetchSuggestions(inputValue);
  }, [inputValue]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags (press Enter)"
          className="w-full"
        />
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
            {suggestions.map(suggestion => (
              <div
                key={suggestion}
                className="px-4 py-2 hover:bg-accent cursor-pointer"
                onClick={() => addTag(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};