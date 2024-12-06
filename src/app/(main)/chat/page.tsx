import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Globe, Lock, MessageSquare, MoreVertical, Search, Share2, Star, Trash2, Users } from "lucide-react";

const ChatHistory = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Chat History Sidebar */}
      <div className="flex w-full flex-col border-r bg-muted/10 sm:w-80 lg:w-96">
        <div className="border-b p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input placeholder="Search conversations..." className="flex-1" prefix={<Search className="h-4 w-4" />} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Star className="mr-2 h-4 w-4" /> Starred
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" /> Shared
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Globe className="mr-2 h-4 w-4" /> Public
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Chats</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-auto">
          {chats.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} />
          ))}
        </div>
      </div>

      {/* Selected Chat Preview (shows on larger screens) */}
      <div className="hidden flex-1 items-center justify-center bg-muted/5 lg:flex">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Select a conversation</h3>
          <p className="text-sm text-muted-foreground">Choose a chat from the sidebar to view its contents</p>
        </div>
      </div>
    </div>
  );
};

// Chat List Item Component
const ChatListItem = ({ chat }) => (
  <div className="cursor-pointer border-b p-4 hover:bg-muted/5">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="line-clamp-1 font-medium">{chat.title}</h4>
          {chat.shared && <Users className="h-4 w-4 text-muted-foreground" />}
          {chat.public && <Globe className="h-4 w-4 text-muted-foreground" />}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{chat.lastMessage}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{chat.project}</span>
          <span>•</span>
          <span>{chat.date}</span>
        </div>
      </div>

      <ShareButton chat={chat} />
    </div>
  </div>
);

// Share Button & Dialog
const ShareButton = ({ chat }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Share2 className="h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Share Chat</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Access Type</label>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Lock className="mr-2 h-4 w-4" /> Private
            </Button>
            <Button variant="outline" className="flex-1">
              <Users className="mr-2 h-4 w-4" /> Shared
            </Button>
            <Button variant="outline" className="flex-1">
              <Globe className="mr-2 h-4 w-4" /> Public
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Share Link</label>
          <div className="flex gap-2">
            <Input value="https://dora.ai/chat/abc123" readOnly />
            <Button variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Add People</label>
          <Input placeholder="Enter email addresses..." />
          <p className="text-sm text-muted-foreground">Separate multiple emails with commas</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Current Access</label>
          {chat.sharedWith?.map((user, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border p-2">
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

// Sample data
const chats = [
  {
    id: 1,
    title: "Product Analysis Discussion",
    lastMessage: "The key findings from the document analysis show...",
    project: "Startup Idea",
    date: "2h ago",
    shared: true,
    public: false,
    sharedWith: [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" },
    ],
  },
  // Add more chat items...
];

export default ChatHistory;
