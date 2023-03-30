import { faker } from "@faker-js/faker"
import { BaseFactory } from "../src"
import { db } from "./db"
import { Dog } from "./types"

type NewDog = Omit<Dog, "id" | "createdAt" | "updatedAt">

export class DogFactory extends BaseFactory<NewDog, Dog> {
  protected async save(data: NewDog): Promise<Dog> {
    const dog: Dog = {
      ...data,
      id: "123",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    db.dogs.push(dog)
    return await Promise.resolve(dog)
  }

  protected generate(): NewDog {
    return {
      name: faker.name.firstName(),
      breed: faker.lorem.word(),
      age: faker.datatype.number({ min: 0, max: 15 }),
      weight: faker.datatype.number({ min: 10, max: 20 }),
      isFriendly: faker.datatype.boolean(),
    }
  }
}
