import { useCallback, useEffect, useRef } from 'react'

import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr'

import Cookies from 'js-cookie'

type SignalRConfig = {
  eventName: string
  callback: (...args: any[]) => void
}

const useSignalR = (hubUrl: string, events: SignalRConfig[]) => {
  const connectionRef = useRef<HubConnection | null>(null)

  const connectToHub = useCallback(async () => {
    if (connectionRef.current) return

    const token = Cookies.get('jwtToken')

    if (!token) return

    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}${hubUrl}`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build()

    connectionRef.current = connection

    events.forEach(({ eventName, callback }) =>
      connection.on(eventName, callback)
    )

    try {
      await connection.start()
    } catch {
      setTimeout(connectToHub, 5000)
    }

    return () => {
      connection.stop().then()
    }
  }, [events, hubUrl])

  useEffect(() => {
    connectToHub().then()
  }, [connectToHub])
}

export default useSignalR
