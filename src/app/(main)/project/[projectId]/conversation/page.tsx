import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Calendar,
  Filter,
  MoreVertical,
  Star,
  Share2,
  Trash2,
  MessageSquare,
  Download,
  FileText,
  ArrowUpDown,
} from "lucide-react";
import { format } from "date-fns";

const ConversationHistory = () => {
  return (
    <div className="space-y-6 p-4">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Chats</p>
                <p className="text-2xl font-bold">256</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Shared</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Share2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Starred</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="relative md:col-span-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-10" />
        </div>
        <div className="flex flex-wrap gap-2 md:col-span-6">
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
              <SelectItem value="starred">Starred</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex-grow md:flex-grow-0">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop View */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium">
                    <Button variant="ghost" className="flex items-center gap-1">
                      Title <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </th>
                  <th className="p-4 text-left font-medium">Messages</th>
                  <th className="p-4 text-left font-medium">Created</th>
                  <th className="p-4 text-left font-medium">Last Active</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conv) => (
                  <tr key={conv.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {conv.starred && <Star className="h-4 w-4 text-yellow-500" />}
                        <span className="font-medium">{conv.title}</span>
                      </div>
                    </td>
                    <td className="p-4">{conv.messages}</td>
                    <td className="p-4">{format(conv.created, "MMM d, yyyy")}</td>
                    <td className="p-4">{conv.lastActive}</td>
                    <td className="p-4 text-right">
                      <ConversationActions />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="divide-y md:hidden">
            {conversations.map((conv) => (
              <div key={conv.id} className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {conv.starred && <Star className="h-4 w-4 text-yellow-500" />}
                    <span className="font-medium">{conv.title}</span>
                  </div>
                  <ConversationActions />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>Messages: {conv.messages}</div>
                  <div>Created: {format(conv.created, "MMM d")}</div>
                  <div className="col-span-2">Last active: {conv.lastActive}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Conversation Actions Component
const ConversationActions = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <Star className="mr-2 h-4 w-4" /> Star
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Share2 className="mr-2 h-4 w-4" /> Share
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Download className="mr-2 h-4 w-4" /> Export
      </DropdownMenuItem>
      <DropdownMenuItem>
        <FileText className="mr-2 h-4 w-4" /> View
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-destructive">
        <Trash2 className="mr-2 h-4 w-4" /> Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Sample data
const conversations = [
  {
    id: 1,
    title: "Product Requirements Discussion",
    messages: 45,
    created: new Date("2024-12-01"),
    lastActive: "2 hours ago",
    starred: true,
  },
  {
    id: 2,
    title: "User Research Analysis",
    messages: 28,
    created: new Date("2024-12-03"),
    lastActive: "1 day ago",
    starred: false,
  },
  // Add more conversations...
];

export default ConversationHistory;
