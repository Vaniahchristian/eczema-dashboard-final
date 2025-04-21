import MessagesPage from "@/components/messages/messages-page"
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Messages | Eczema Dashboard',
  description: 'Chat with your healthcare providers',
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1
}

export default function Messages() {
  return <MessagesPage />
}
