import { useCallback, useEffect, useRef } from 'react'
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store'
import { connect, disconnect } from '@/store/slices/signalRSlice'

type SignalRConfig = {
  eventName: string
  callback: (...args: any[]) => void
}

const useSignalR = (hubUrl: string, events: SignalRConfig[]) => {
  const dispatch = useDispatch()
  const isConnected = useSelector(
    (state: RootState) => state.signalR.connections[hubUrl]
  )

  const connectionRef = useRef<HubConnection | null>(null)

  const connectToHub = useCallback(async () => {
    if (isConnected || connectionRef.current) return

    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}${hubUrl}`)
      .withAutomaticReconnect()
      .build()

    connectionRef.current = connection

    events.forEach(({ eventName, callback }) =>
      connection.on(eventName, (...args: any[]) => callback(...args))
    )

    try {
      await connection.start()

      dispatch(connect(hubUrl))
    } catch {
      setTimeout(connectToHub, 5000)
    }

    return () => connection.stop().then(() => dispatch(disconnect(hubUrl)))
  }, [dispatch, events, hubUrl, isConnected])

  useEffect(() => {
    connectToHub().finally()
  }, [connectToHub])
}

export default useSignalR
