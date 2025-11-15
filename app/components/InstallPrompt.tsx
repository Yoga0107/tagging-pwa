"use client"

import { useEffect, useState } from "react"

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const userAgent = navigator.userAgent.toLowerCase()
    const isAndroid = userAgent.includes("android")

    if (!isAndroid) return

    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    setShowInstall(false)
  }

  if (!showInstall) return null

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)",
      background: "white",
      padding: "12px 18px",
      borderRadius: 12,
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
    }}>
      <p style={{ marginBottom: 10 }}>Install aplikasi ini?</p>
      <button
        onClick={handleInstall}
        style={{
          background: "#0ea5a4",
          color: "white",
          padding: "8px 14px",
          borderRadius: 8
        }}>
        Install
      </button>
    </div>
  )
}
