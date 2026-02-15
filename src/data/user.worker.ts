/// <reference lib="webworker" />

import { faker } from '@faker-js/faker'
import type { User, UserWorkerEvent } from './types';

const USER_COUNT = 100_000;

const generateUsers = (count: number): User[] => {
    return Array.from({ length: count }, () => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 80 }),
        country: faker.location.country(),
    }))
}

let cachedUsers: User[] = []

self.onmessage = (event: MessageEvent<UserWorkerEvent>) => {
    const { type } = event.data

    switch (type) {
        case 'initialize':
            {
                cachedUsers = generateUsers(USER_COUNT)
                self.postMessage(cachedUsers)
                break
            }

        case 'filter':
            {
                const { query, filter } = event.data

                let filteredUsers = cachedUsers.filter(user =>
                    user.name.toLowerCase().includes(query.toLowerCase().trim()) ||
                    user.email.toLowerCase().includes(query.toLowerCase().trim())
                )

                if (filter?.ageRange) {
                    const [min, max] = filter.ageRange.split('-').map(Number)
                    filteredUsers = filteredUsers.filter(user => user.age >= min && user.age <= max)
                }

                self.postMessage(query.length > 0 || filter ? filteredUsers : cachedUsers)
                break
            }
    }
}
