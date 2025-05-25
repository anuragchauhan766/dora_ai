"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chats, messages } from "@/db/schema";
import { copyToClipboard } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { Bot, Copy, RefreshCw, RotateCcw, Send, StopCircle, UploadCloud } from "lucide-react";
import { useParams } from "next/navigation";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface ProjectChatProps {
  id: string;
  chat:
    | (typeof chats.$inferSelect & {
        messages: (typeof messages.$inferSelect)[];
      })
    | undefined;
}

const ProjectChat = ({ id, chat }: ProjectChatProps) => {
  const { projectId } = useParams();
  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, stop } = useChat({
    api: "/api/chat",
    initialMessages: chat
      ? chat.messages.map((message) => ({
          content: message.content,
          role: message.role as "user" | "system" | "assistant",
          id: message.id,
        }))
      : [],
    id,
    sendExtraMessageFields: true,
    generateId: () => crypto.randomUUID().toString(),
    body: {
      projectId: projectId,
    },
  });

  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-md"
          {...(props as SyntaxHighlighterProps)}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className="rounded bg-muted px-1.5 py-0.5" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Welcome to Your AI Assistant</h2>
                <p className="mt-2 text-muted-foreground">
                  Start a conversation by typing your message below. I&apos;m here to help!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full w-full px-2 sm:px-0">
            <div className="mx-auto flex max-w-screen-lg flex-col gap-2 py-6">
              {messages.map((message, idx) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={cn("flex w-full items-start gap-2", isUser ? "justify-end" : "justify-start")}
                  >
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <Bot className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      {/* Message Bubble */}
                      <div
                        className={cn(
                          "relative max-w-[80vw] break-words rounded-3xl px-4 py-3 text-base shadow-sm sm:max-w-[80%]",
                          isUser
                            ? "ml-8 bg-primary text-primary-foreground sm:ml-12"
                            : "mr-8 rounded-tl-md border border-gray-200 bg-white text-black sm:mr-12"
                        )}
                      >
                        {" "}
                        {isLoading && idx === messages.length - 1 && !isUser ? (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]"></div>
                          </div>
                        ) : (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                            components={components}
                          >
                            {message.content}
                          </ReactMarkdown>
                        )}
                        {/* Action Bar for Assistant */}
                      </div>
                      {!isUser && messages.length > 1 && idx === messages.length - 1 && !isLoading && (
                        <div className="flex gap-1 text-xs text-gray-400">
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(message.content)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => reload({ body: { lastAiMessageId: message.id } })}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
      {/* Input Area */}
      <div className="sticky bottom-0 z-10 w-full bg-background p-4">
        <div className="mx-auto max-w-screen-lg">
          <form className="flex items-end gap-2" onSubmit={handleSubmit}>
            <div className="flex-1">
              <Input
                placeholder="Type your message..."
                className="h-12 rounded-full"
                value={input}
                onChange={handleInputChange}
                autoFocus
              />
            </div>
            {isLoading ? (
              <Button className="flex size-12 items-center justify-center rounded-full" onClick={stop} type="button">
                <StopCircle className="h-6 w-6" />
              </Button>
            ) : (
              <Button className="flex size-12 items-center justify-center rounded-full" type="submit">
                <Send className="h-6 w-6" />
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
  );
};

export default ProjectChat;
