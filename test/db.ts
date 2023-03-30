import { DB, Dog } from "./types"

export const db: DB = { dogs: [] as Dog[] }
export function clearDb() {
  db.dogs = [] as Dog[]
}
