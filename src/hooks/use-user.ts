import { useCallback, useEffect, useRef, useState } from "react";
import UserWorker from '../data/user.worker?worker'
import type { User } from "../data/types";
import { normalizeUsers, type NormalizedUser } from "../utils/normalize-users";
import { useDidUpdate } from "@mantine/hooks";

interface UseUserProps {
    searchQuery?: string
    filter?: Record<string, unknown>
}

export function useUserList({ searchQuery, filter }: UseUserProps) {
    const workerRef = useRef<Worker | null>(null)

    const [data, setData] = useState<NormalizedUser>({
        userIds: [],
        users: {},
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        workerRef.current = new UserWorker()

        const handleMessage = (event: MessageEvent<User[]>) => {
            const users: User[] = event.data
            setData(normalizeUsers(users))
            setIsLoading(false)
        }

        workerRef.current.addEventListener('message', handleMessage)

        workerRef.current.postMessage({ type: 'initialize' })

        return () => {
            if (workerRef.current) {
                workerRef.current.removeEventListener('message', handleMessage)
                workerRef.current.terminate()
                workerRef.current = null
            }
        }
    }, [])

    useDidUpdate(() => {
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'filter', query: searchQuery, filter })
        }
    }, [searchQuery, filter])

    const updateUser = useCallback((userId: string, value: Partial<User>) => {
        setData((prev) => ({
            ...prev,
            users: {
                ...prev.users, [userId]: {
                    ...data.users[userId],
                    ...value,
                }
            },
        }))
    }, [data.users])


    return {
        data,
        isLoading,
        updateUser,
    }
}
