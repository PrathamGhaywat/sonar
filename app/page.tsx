"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Brain,
  Lightbulb,
  Globe,
  Image as ImageIcon,
  Paperclip,
  Mic,
  AudioLines,
  Sparkles,
  FileText,
  CalendarDays,
  Trophy,
  Newspaper,
  Sun,
  Moon,
  Loader2,
  ExternalLink,
} from "lucide-react";

const suggestionButtons = [
  { icon: Sparkles, label: "Learn" },
  { icon: FileText, label: "Summarize" },
  { icon: CalendarDays, label: "Plan" },
  { icon: Trophy, label: "Sports" },
  { icon: Newspaper, label: "Latest News" },
];

type Source = {
  title: string;
  url: string;
  description?: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [focusMode, setFocusMode] = useState<"search" | "deep" | "reason">("search");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
      if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
      }
    } catch (e) {
      /* ignore */
    }
    return "dark";
  });

  useEffect(() => {
    try {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* ignore */
    }
  }, [theme]);

  // Update favicon dynamically based on theme.
  useEffect(() => {
    try {
      const iconUrl = theme === "dark" ? "/sonar-white.svg" : "/sonar-black.svg";
      const cacheBustedUrl = `${iconUrl}?v=${Date.now()}`;

      // Remove any existing favicon links (e.g. icon, shortcut icon, apple-touch-icon)
      const faviconSelectors = [
        "link[rel='icon']",
        "link[rel='shortcut icon']",
        "link[rel='apple-touch-icon']",
        "link[rel='mask-icon']",
      ];
      faviconSelectors.forEach((sel) => {
        const nodes = Array.from(document.querySelectorAll(sel));
        nodes.forEach((n) => n.parentNode?.removeChild(n));
      });

      // Create a new favicon (SVG) link and append it
      const newIcon = document.createElement("link");
      newIcon.rel = "icon";
      newIcon.href = cacheBustedUrl;
      newIcon.type = "image/svg+xml";
      document.head.appendChild(newIcon);

      // Add apple-touch-icon as well
      const apple = document.createElement("link");
      apple.rel = "apple-touch-icon";
      apple.href = cacheBustedUrl;
      document.head.appendChild(apple);
    } catch (e) {
      /* ignore */
    }
  }, [theme]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);
    setHasSearched(true);

    try {
      // Step 1: Search for relevant sources
      const searchRes = await fetch(`/api/search?q=${encodeURIComponent(userMessage.content)}&count=10`);
      const searchData = await searchRes.json();

      if (searchData.error) {
        throw new Error(searchData.error);
      }

      const sources: Source[] = searchData.results || [];

      // Add assistant message placeholder
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        sources,
        isStreaming: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Step 2: Get AI response grounded in search results
      const aiRes = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage.content,
          results: sources,
        }),
      });

      const aiData = await aiRes.json();

      if (aiData.error) {
        throw new Error(aiData.error);
      }

      // Update the assistant message with the AI response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content: aiData.answer || "No response generated.", isStreaming: false }
            : msg
        )
      );
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `Error: ${err instanceof Error ? err.message : String(err)}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`relative flex min-h-screen flex-col ${
        theme === "dark" ? "bg-[#191a1a] text-zinc-100" : "bg-white text-zinc-900"
      }`}
    >
      {/* Header with Auth Buttons */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm border-zinc-800/50">
        <h1
          className={`text-2xl font-serif italic tracking-tight ${
            theme === "dark" ? "text-zinc-100" : "text-zinc-900"
          }`}
        >
          sonar
        </h1>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className={`${theme === "dark" ? "text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800" : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"}`}
          >
            Log in
          </Button>
          <Button
            className={`${theme === "dark" ? "bg-white text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-zinc-800"} rounded-lg`}
          >
            Sign up
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`ml-2 h-9 w-9 rounded-full ${
              theme === "dark" ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-700 hover:bg-zinc-100"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ${
          hasSearched ? "pt-24 px-4" : "items-center justify-center px-4"
        }`}
      >
        {/* Initial State - Centered */}
        {!hasSearched && (
          <div className="w-full max-w-2xl">
            {/* Logo */}
            <h1
              className={`mb-3 text-5xl font-serif italic tracking-tight text-center ${
                theme === "dark" ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              sonar
            </h1>

            {/* Short descriptive paragraph for SEO */}
            <p className={`max-w-3xl text-center mb-8 ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
              the <a href="https://github.com/PrathamGhaywat/sonar" className="underline">opensource</a> AI Search that doesn&apos;t deliver BS
            </p>
          </div>
        )}

        {/* Chat Messages */}
        {hasSearched && (
          <div className="w-full max-w-3xl mx-auto mb-6 pb-32 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                {message.role === "user" ? (
                  <div className="flex justify-end">
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        theme === "dark"
                          ? "bg-white/10 text-zinc-100"
                          : "bg-zinc-100 text-zinc-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="space-y-2">
                        <p className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                          Sources
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.slice(0, 5).map((source, idx) => (
                            <a
                              key={idx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                                theme === "dark"
                                  ? "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50"
                                  : "border-zinc-300 bg-zinc-50 hover:bg-zinc-100"
                              }`}
                            >
                              <span className="flex-1 truncate max-w-[200px]">{source.title}</span>
                              <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Response */}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        theme === "dark"
                          ? "bg-zinc-800/50 text-zinc-100"
                          : "bg-zinc-100 text-zinc-900"
                      }`}
                    >
                      {message.isStreaming ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <p className="text-sm">Generating response...</p>
                        </div>
                      ) : (
                        <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Search Container - Fixed at bottom of screen when chatting */}
      <div className={`${hasSearched ? "fixed bottom-0 left-0 right-0 z-40 pb-6" : "w-full max-w-2xl"}`}>
        <div className={`${hasSearched ? "max-w-3xl mx-auto px-4" : ""}`}>
          {/* Search Input */}
          <div
            className={`relative rounded-2xl shadow-lg ${
              theme === "dark"
                ? "bg-[#232627] border border-zinc-700/50"
                : "bg-white border border-gray-200"
            }`}
          >
          {/* Input Area - semantic form for accessibility */}
          <form className="flex items-center w-full" role="search" aria-label="Site search" onSubmit={handleSearch}>
              <div className="flex items-center flex-1 px-6 py-4">
                <Input
                  id="search-input"
                  name="q"
                  type="text"
                  placeholder="Ask anything. Type @ for mentions."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                  className={`flex-1 border-0 bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none px-0 py-0 h-auto text-base ${
                    theme === "dark"
                      ? "text-zinc-200 placeholder:text-zinc-500"
                      : "text-zinc-900 placeholder:text-zinc-400"
                  }`}
                />
            </div>
          </form>

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-3 pb-3">
            {/* Left Side - Mode Toggle */}
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFocusMode("search")}
                      className={`h-9 rounded-full px-3 ${
                        focusMode === "search"
                          ? theme === "dark"
                            ? "bg-white/20 text-white hover:bg-white/30 hover:text-white"
                            : "bg-black/5 text-zinc-900 hover:bg-black/10"
                          : theme === "dark"
                          ? "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      }`}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFocusMode("deep")}
                      className={`h-9 rounded-full px-3 ${
                        focusMode === "deep"
                          ? theme === "dark"
                            ? "bg-white/20 text-white hover:bg-white/30 hover:text-white"
                            : "bg-black/5 text-zinc-900 hover:bg-black/10"
                          : theme === "dark"
                          ? "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      }`}
                    >
                      <Brain className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Deep Research</p>
                  </TooltipContent>
                </Tooltip>

                <div className="mx-1 h-5 w-px bg-zinc-700" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFocusMode("reason")}
                      className={`h-9 rounded-full px-3 ${
                        focusMode === "reason"
                          ? theme === "dark"
                            ? "bg-white/20 text-white hover:bg-white/30 hover:text-white"
                            : "bg-black/5 text-zinc-900 hover:bg-black/10"
                          : theme === "dark"
                          ? "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      }`}
                    >
                      <Lightbulb className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reasoning</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-9 w-9 rounded-full ${theme === "dark" ? "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"}`}
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                  <TooltipContent>
                    <p>Web Search</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-9 w-9 rounded-full ${theme === "dark" ? "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"}`}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                  <TooltipContent>
                    <p>Image Search</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-9 w-9 rounded-full ${theme === "dark" ? "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"}`}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                  <TooltipContent>
                    <p>Attach File (max 20 MB)</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-9 w-9 rounded-full ${theme === "dark" ? "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"}`}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                  <TooltipContent>
                    <p>Voice Input</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        type="submit"
                        disabled={loading || !query.trim()}
                        onClick={handleSearch}
                        className={`ml-1 h-9 w-9 rounded-full ${
                          theme === "dark"
                            ? "bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500"
                            : "bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400"
                        }`}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <AudioLines className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{loading ? "Searching..." : "Submit"}</p>
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Suggestion Pills - Only show when not searched */}
        {!hasSearched && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {suggestionButtons.map((item) => (
              <Button
                key={item.label}
                variant="outline"
                size="sm"
                className={`h-9 rounded-full border ${
                  theme === "dark"
                    ? "border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    : "border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
