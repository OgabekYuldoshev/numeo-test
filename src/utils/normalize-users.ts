import type { User } from "../data/types"

export interface NormalizedUser {
    userIds: string[]
    users: Record<string, User>
}

export function normalizeUsers(users: User[]): NormalizedUser {
    const data: NormalizedUser = {
        userIds: [],
        users: {},
    }

    users.forEach((user) => {
        data.userIds.push(user.id)
        data.users[user.id] = user
    })

    return data
}