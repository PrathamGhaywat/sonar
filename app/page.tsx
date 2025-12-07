"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

const suggestionButtons = [
  { icon: Sparkles, label: "Learn" },
  { icon: FileText, label: "Summarize" },
  { icon: CalendarDays, label: "Plan" },
  { icon: Trophy, label: "Sports" },
  { icon: Newspaper, label: "Latest News" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [focusMode, setFocusMode] = useState<"search" | "deep" | "reason">("search");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

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

  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-center px-4 ${
        theme === "dark" ? "bg-[#191a1a] text-zinc-100" : "bg-white text-zinc-900"
      }`}
    >
      {/* Header with Auth Buttons */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-end px-6 py-4">
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

      {/* Logo */}
      <h1
        className={`mb-8 text-5xl font-serif italic tracking-tight ${
          theme === "dark" ? "text-zinc-100" : "text-zinc-900"
        }`}
      >
        sonar
      </h1>

      {/* Search Container */}
      <div className="w-full max-w-2xl">
        {/* Search Input */}
        <div
          className={`relative rounded-2xl shadow-lg ${
            theme === "dark"
              ? "bg-[#232627] border border-zinc-700/50"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Input Area */}
          <div className="flex items-center px-6 py-4">
            <Input
              type="text"
              placeholder="Ask anything. Type @ for mentions."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`flex-1 border-0 bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none px-0 py-0 h-auto text-base ${
                theme === "dark"
                  ? "text-zinc-200 placeholder:text-zinc-500"
                  : "text-zinc-900 placeholder:text-zinc-400"
              }`}
            />
          </div>

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
                      className="h-9 w-9 rounded-full text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
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
                      className="h-9 w-9 rounded-full text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
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
                      className="h-9 w-9 rounded-full text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
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
                      className="h-9 w-9 rounded-full text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
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
                      className="ml-1 h-9 w-9 rounded-full bg-white text-black hover:bg-zinc-200"
                    >
                      <AudioLines className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Audio</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Suggestion Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {suggestionButtons.map((item) => (
            <Button
              key={item.label}
              variant="outline"
              size="sm"
              className="h-9 rounded-full border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
