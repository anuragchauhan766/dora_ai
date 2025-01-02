"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Copy,
  RefreshCw,
  RotateCcw,
  Send,
  StopCircle,
  ThumbsDown,
  ThumbsUp,
  UploadCloud,
  User,
} from "lucide-react";
import { useChat } from "ai/react";
import { copyToClipboard } from "@/lib/chat";
import { cn } from "@/lib/utils";
const ProjectChat = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, stop } = useChat({
    api: "/api/chat",
    initialMessages: [{ content: "Hello, how can I help you today?", role: "assistant", id: "1" }],
    onFinish: (message, options) => {
      console.log("onFinish", message, options);
    },
  });

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <Card className="bg-muted/50" key={message.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        message.role === "user" ? "" : "bg-primary"
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-sm text-muted-foreground">
                        {message.role === "user" ? "You" : "AI Assistant"}
                      </p>
                      <div className="prose prose-sm">{message.content}</div>
                    </div>
                  </div>
                  {message.role === "assistant" && !isLoading && messages.length > 1 ? (
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(message.content)}>
                        <Copy className="mr-1 h-4 w-4" />
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => reload()}>
                        <RefreshCw className="mr-1 h-4 w-4" />
                        Regenerate
                      </Button>
                      <div className="ml-auto flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
            {isLoading ? (
              <Card className="bg-muted/50">
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-sm text-muted-foreground">AI Assistant</p>
                      <div className="prose prose-sm">Loading...</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-background p-4">
          <div className="mx-auto max-w-3xl">
            <form className="flex items-end gap-2" onSubmit={handleSubmit}>
              <div className="flex-1">
                <Input
                  placeholder="Type your message..."
                  className="min-h-[3rem]"
                  value={input}
                  onChange={handleInputChange}
                />
              </div>
              {isLoading ? (
                <Button className="flex items-center gap-2" onClick={stop}>
                  <StopCircle className="h-4 w-4" />
                  Stop
                </Button>
              ) : (
                <Button className="flex items-center gap-2" type="submit">
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              )}
            </form>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm">
                <UploadCloud className="mr-1 h-4 w-4" />
                Upload File
              </Button>
              <Button variant="ghost" size="sm">
                <RotateCcw className="mr-1 h-4 w-4" />
                Clear Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Context Sidebar */}
      <div className="hidden w-80 border-l bg-muted/10 p-4 lg:block">
        <h3 className="mb-4 font-medium">Context & Settings</h3>

        {/* Document Context */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="mb-2 text-sm font-medium">Active Documents</h4>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <p>• Product Specs.pdf</p>
                  <p>• Requirements.doc</p>
                  <p>• Research Notes.txt</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="mb-2 text-sm font-medium">Chat Settings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Temperature</span>
                  <span>0.7</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Length</span>
                  <span>1000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectChat;
