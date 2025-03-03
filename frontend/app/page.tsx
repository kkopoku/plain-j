"use client";

import type React from "react";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PlainJ() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const API = process.env.NEXT_PUBLIC_SERVER_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`${API}/process-text/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await res.json();

      if (!data.response.success){
        toast.info(data.response.message)
      }

      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
      setResponse(
        JSON.stringify({ error: "Failed to process request" }, null, 2)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-[#333333] h-12 flex items-center px-6">
        <div className="flex items-center gap-6 h-full">
          <span className="font-semibold">PlainJ</span>
          <a
            href="#"
            className="text-sm text-gray-400 hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-white"
          >
            Documentation
          </a>
          <a
            href="#"
            className="text-sm text-gray-400 hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-white"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[800px] mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Convert Money Transfer Instructions to JSON
          </h1>
          <p className="text-gray-200 text-extralight max-w-[600px]">
            Convert plain text instructions into structured JSON objects for executing Ghana MoMo transactions.
          </p>
        </div>

        <div className="space-y-8">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative">
            <>
              <Input
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  setResponse("")
                }}
                placeholder="send 50 to Daddy on his MTN number: 0256619388"
                className="w-full bg-[#111111] border-[#333333] text-white placeholder-gray-500 h-12 pr-12 focus:border-gray-400 transition-colors"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 bottom-1 text-gray-400 hover:text-black hover:cursor-pointer bg-transparent h-10 w-10 p-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </>
          </form>

          {/* Response */}
          {response && (
            <div
              className={cn(
                "rounded-lg overflow-hidden transition-all duration-500",
                "border border-[#333333]",
                response ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#333333] bg-[#111111]">
                <span className="text-sm text-gray-400">Response</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-black hover:cursor-pointer h-7 px-2"
                  onClick={() => navigator.clipboard.writeText(response)}
                >
                  Copy
                </Button>
              </div>
              <pre className="p-4 text-sm bg-[#111111] overflow-x-auto">
                <code className="text-gray-300">{response}</code>
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
