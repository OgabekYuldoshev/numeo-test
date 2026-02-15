export interface User {
    id: string
    name: string
    email: string
    age: number
    country: string
}


type InitializeEvent = {
    type: 'initialize'
}

type SearchEvent = {
    type: 'filter'
    query: string
    filter?: {
        ageRange?: string
    }
}


export type UserWorkerEvent = InitializeEvent | SearchEvent