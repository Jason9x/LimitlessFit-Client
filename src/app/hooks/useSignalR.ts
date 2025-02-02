import { useCallback, useEffect, useRef } from 'react'
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr'
import { useDispatch } from 'react-redux'

import { connect, disconnect } from '@/store/slices/signalRSlice'

type SignalRConfig = {
  eventName: string
  callback: (...args: any[]) => void
}

const useSignalR = (hubUrl: string, events: SignalRConfig[]) => {
  const dispatch = useDispatch()
  const connectionRef = useRef<HubConnection | null>(null)

  const connectToHub = useCallback(async () => {
    if (connectionRef.current) return // Only check local connection

    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}${hubUrl}`, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build()

    connectionRef.current = connection

    events.forEach(({ eventName, callback }) =>
      connection.on(eventName, callback)
    )

    try {
      await connection.start()
      dispatch(connect(hubUrl))
    } catch {
      setTimeout(connectToHub, 5000)
    }

    return () => {
      connection.stop().then(() => dispatch(disconnect(hubUrl)))
    }
  }, [dispatch, events, hubUrl])

  useEffect(() => {
    connectToHub().then()
  }, [connectToHub])
}

export default useSignalR
