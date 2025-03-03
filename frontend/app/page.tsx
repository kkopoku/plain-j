"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type Response = {
  success: boolean
  message: string
  transfer?: {
    to: string
    mno: string
    amount: number
  }
}

export default function TransactionProcessor() {
  const [inputText, setInputText] = useState("")
  const [apiUrl, setApiUrl] = useState("http://localhost:8000/process-text/")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [response, setResponse] = useState<Response | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    setIsLoading(true)
    setError("")
    setResponse(null)

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await res.json()
      setResponse(data.response)
    } catch (err) {
      setError("Failed to process request. Please check your API endpoint and try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Transaction Processor</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Enter Transaction Request</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  API Endpoint
                </label>
                <Input
                  id="apiUrl"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8000/process-text/"
                />
              </div>
              <div>
                <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Command
                </label>
                <Input
                  id="inputText"
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="send 50 to Daddy on MTN"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Process Transaction
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          )}

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {response && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant={response.success ? "default" : "destructive"}>
                  {response.success ? "Success" : "Failed"}
                </Badge>
                <span>{response.message}</span>
              </div>

              {response.transfer && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Transfer Details</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Recipient</p>
                      <p className="font-medium">{response.transfer.to}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Provider</p>
                      <p className="font-medium">{response.transfer.mno}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-medium">{response.transfer.amount / 100} GHS</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">Raw Response</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}