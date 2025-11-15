'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showButton, setShowButton] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.includes('android')) {
      setIsAndroid(true)
    }

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  if (!isAndroid || !showButton) return null

  const installApp = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    await deferredPrompt.userChoice

    setDeferredPrompt(null)
    setShowButton(false)
  }

  return (
    <button
      onClick={installApp}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '14px 22px',
        background: '#0ea5a4',
        color: '#fff',
        borderRadius: '12px',
        fontSize: '15px',
        zIndex: 9999,
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      Install App
    </button>
  )
}
