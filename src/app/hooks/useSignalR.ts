import { useEffect, useState, useCallback } from 'react'
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr'

type UseSignalRProps = {
  path: string
  onMessageReceived: (message: any) => void
}

const useSignalR = ({ path, onMessageReceived }: UseSignalRProps) => {
  const [connection, setConnection] = useState<HubConnection | null>(null)

  const onMessageReceivedMemo = useCallback(onMessageReceived, [
    onMessageReceived
  ])

  useEffect(() => {
    const hubUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`

    const connectSignalR = async () => {
      const connection = new HubConnectionBuilder().withUrl(hubUrl).build()

      connection.on('ReceiveOrderStatusUpdate', (message: any) => {
        onMessageReceivedMemo(message)
      })

      try {
        await connection.start()
        console.log('Connected to SignalR hub')
        setConnection(connection)
      } catch (error) {
        console.error('Error connecting to SignalR hub', error)
      }
    }

    if (!connection) connectSignalR()

    return () => {
      if (connection) {
        connection.stop()
        setConnection(null)
      }
    }
  }, [path, onMessageReceivedMemo, connection])

  return { connection }
}

export default useSignalR
