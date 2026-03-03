import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { getCookie } from "cookies-next";
import { CheckIcon, Plus, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";

interface TagType {
  id: string;
  name: string;
  color: string;
}

interface TagSelectorProps {
  ticketId: string;
  initialTags: TagType[];
  onTagsChange?: (tags: TagType[]) => void;
  disabled?: boolean;
}

export default function TagSelector({
  ticketId,
  initialTags,
  onTagsChange,
  disabled = false,
}: TagSelectorProps) {
  const token = getCookie("session");
  const [allTags, setAllTags] = useState<TagType[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagType[]>(initialTags || []);
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    fetchAllTags();
  }, []);

  useEffect(() => {
    setSelectedTags(initialTags || []);
  }, [initialTags]);

  async function fetchAllTags() {
    const res = await fetch("/api/v1/tags/all", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());

    if (res.success) {
      setAllTags(res.tags);
    }
  }

  async function updateTicketTags(tags: TagType[]) {
    const res = await fetch(`/api/v1/ticket/${ticketId}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tagIds: tags.map((t) => t.id) }),
    }).then((r) => r.json());

    if (res.success) {
      setSelectedTags(res.tags);
      onTagsChange?.(res.tags);
    }
  }

  async function createTag(name: string) {
    const res = await fetch("/api/v1/tags/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    }).then((r) => r.json());

    if (res.success) {
      setAllTags((prev) => [...prev, res.tag]);
      const newSelected = [...selectedTags, res.tag];
      setSelectedTags(newSelected);
      await updateTicketTags(newSelected);
      setNewTagName("");
    }
  }

  function toggleTag(tag: TagType) {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    const newTags = isSelected
      ? selectedTags.filter((t) => t.id !== tag.id)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    updateTicketTags(newTags);
  }

  function removeTag(tagId: string) {
    const newTags = selectedTags.filter((t) => t.id !== tagId);
    setSelectedTags(newTags);
    updateTicketTags(newTags);
  }

  return (
    <div className="border-t border-border pt-2">
      <div className="flex flex-row items-center justify-between mb-1">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" />
          Tags
        </span>
        {!disabled && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="text-sm font-medium text-muted-foreground hover:underline">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0" align="end">
              <Command>
                <CommandInput
                  placeholder="Search or create tag..."
                  value={newTagName}
                  onValueChange={setNewTagName}
                />
                <CommandList>
                  <CommandEmpty>
                    {newTagName.trim() && (
                      <button
                        className="w-full px-2 py-1.5 text-sm text-left hover:bg-accent"
                        onClick={() => createTag(newTagName.trim())}
                      >
                        Create "{newTagName.trim()}"
                      </button>
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {allTags.map((tag) => {
                      const isSelected = selectedTags.some(
                        (t) => t.id === tag.id
                      );
                      return (
                        <CommandItem
                          key={tag.id}
                          onSelect={() => toggleTag(tag)}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </div>
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full mr-1.5 shrink-0"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span>{tag.name}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {selectedTags.length === 0 ? (
          <span className="text-xs text-muted-foreground">No tags</span>
        ) : (
          selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-gray-500/10"
              style={{
                backgroundColor: tag.color + "20",
                color: tag.color,
              }}
            >
              {tag.name}
              {!disabled && (
                <button
                  onClick={() => removeTag(tag.id)}
                  className="hover:opacity-75"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
