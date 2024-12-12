import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const channels = [
  { value: "channel1", label: "Channel 1" },
  { value: "channel2", label: "Channel 2" },
  { value: "channel3", label: "Channel 3" },
]

export function ChannelSelector({ selectedChannels, onChannelSelect }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selectedChannels.length > 0
            ? `${selectedChannels.length} channels selected`
            : "Select channels"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search channels..." />
          <CommandEmpty>No channel found.</CommandEmpty>
          <CommandGroup>
            {channels.map((channel) => (
              <CommandItem
                key={channel.value}
                onSelect={() => {
                  onChannelSelect((prev) =>
                    prev.includes(channel.value)
                      ? prev.filter((c) => c !== channel.value)
                      : [...prev, channel.value]
                  )
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedChannels.includes(channel.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {channel.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

