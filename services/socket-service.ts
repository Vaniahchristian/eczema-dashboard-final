import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null
  private static instance: SocketService

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
    }
    return SocketService.instance
  }

  connect(token: string) {
    if (this.socket?.connected) return this.socket

    this.socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    this.setupEventHandlers()
    return this.socket
  }

  private setupEventHandlers() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Socket connected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.socket?.connect()
      }
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  emit(event: string, data: any) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }
    this.socket.emit(event, data)
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }
    this.socket.on(event, callback)
  }

  off(event: string, callback?: (data: any) => void) {
    if (!this.socket) return
    this.socket.off(event, callback)
  }

  joinRoom(roomId: string) {
    if (!this.socket) return
    this.socket.emit('join', roomId)
  }

  leaveRoom(roomId: string) {
    if (!this.socket) return
    this.socket.emit('leave', roomId)
  }

  // Messaging specific methods
  sendMessage(conversationId: string, content: string, attachments?: any[]) {
    this.emit('message', {
      conversationId,
      content,
      attachments
    })
  }

  markAsRead(conversationId: string, messageIds: string[]) {
    this.emit('markAsRead', {
      conversationId,
      messageIds
    })
  }

  setTyping(conversationId: string, isTyping: boolean) {
    this.emit('typing', {
      conversationId,
      isTyping
    })
  }

  // Get the socket instance
  getSocket() {
    return this.socket
  }

  // Check if socket is connected
  isConnected() {
    return this.socket?.connected || false
  }
}

export const socketService = SocketService.getInstance()
