export type Dog = {
  id: string
  name: string
  breed: string
  age: number
  weight: number
  isFriendly: boolean
  createdAt: Date
  updatedAt: Date
}

export type DB = {
  dogs: Dog[]
}
