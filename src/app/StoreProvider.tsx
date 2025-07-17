'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { setupStore, AppStore } from '../lib/store'
import { fetchSolarIntervals, fetchHighWinterIntervals, fetchLowWinterIntervals } from '../lib/thunks/data.thunks'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
    const storeRef = useRef<AppStore | null>(null)
    if (!storeRef.current) {
        storeRef.current = setupStore()
        storeRef.current.dispatch(fetchSolarIntervals());
        storeRef.current.dispatch(fetchHighWinterIntervals());
        storeRef.current.dispatch(fetchLowWinterIntervals());
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}
