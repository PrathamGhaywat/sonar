"use client";

import { useState } from "react";
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

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#191a1a] px-4">
      {/* Header with Auth Buttons */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-end px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
          >
            Log in
          </Button>
          <Button
            className="bg-white text-black hover:bg-zinc-200 rounded-lg"
          >
            Sign up
          </Button>
        </div>
      </header>

      {/* Logo */}
      <h1 className="mb-8 text-5xl font-serif italic text-zinc-100 tracking-tight">
        sonar
      </h1>

      {/* Search Container */}
      <div className="w-full max-w-2xl">
        {/* Search Input */}
        <div className="relative rounded-2xl bg-[#232627] border border-zinc-700/50 shadow-lg">
          {/* Input Area */}
          <div className="flex items-center px-4 py-3">
            <Input
              type="text"
              placeholder="Ask anything. Type @ for mentions."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
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
                          ? "bg-white/20 text-white hover:bg-white/30 hover:text-white"
                          : "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
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
                          ? "bg-white/20 text-white hover:bg-white/30 hover:text-white"
                          : "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
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
                          ? "bg-white/20 text-white hover:bg-white/30 hover:text-white"
                          : "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
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
                    <p>Attach File</p>
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
