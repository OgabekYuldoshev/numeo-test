import type { User } from "@/data/types"

export function heavyComputation(user: User) {
    let sum = 0
    const str = user.name + user.email
    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i) ** 3
    }
    return sum % 1000
}
