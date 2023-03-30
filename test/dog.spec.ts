import { afterEach, describe, expect, it } from "vitest"
import { db, clearDb } from "./db"
import { DogFactory } from "./dog.factory"

describe("DogFactory", () => {
  const dogFactory = new DogFactory()
  afterEach(clearDb)

  describe("#build", () => {
    it("generates a random dog", () => {
      const dog = dogFactory.build()
      expect(dog).not.toHaveProperty("id")
      expect(dog).toHaveProperty("name")
      expect(dog).toHaveProperty("breed")
      expect(dog).toHaveProperty("age")
      expect(dog).toHaveProperty("weight")
      expect(dog).toHaveProperty("isFriendly")
      expect(dog).not.toHaveProperty("createdAt")
      expect(dog).not.toHaveProperty("updatedAt")
    })

    it("generates a random dog with the given attribute", () => {
      const dog = dogFactory.build({ name: "Zappa" })
      expect(dog).toHaveProperty("name", "Zappa")
    })
  })

  describe("#buildMany", () => {
    it("generates multiple random dogs", () => {
      const dogs = dogFactory.buildMany(3)
      expect(dogs).toHaveLength(3)
      for (const dog of dogs) {
        expect(dog).not.toHaveProperty("id")
        expect(dog).toHaveProperty("name")
        expect(dog).toHaveProperty("breed")
        expect(dog).toHaveProperty("age")
        expect(dog).toHaveProperty("weight")
        expect(dog).toHaveProperty("isFriendly")
        expect(dog).not.toHaveProperty("createdAt")
        expect(dog).not.toHaveProperty("updatedAt")
      }
    })

    it("generates multiple random dogs with the given attribute", () => {
      const dogs = dogFactory.buildMany(3, { weight: 14 })
      for (const dog of dogs) {
        expect(dog).toHaveProperty("weight", 14)
      }
    })
  })

  describe("#create", () => {
    it("creates a dog in the db", async () => {
      await dogFactory.create()
      expect(db.dogs).toHaveLength(1)
    })
  })

  describe("#createMany", () => {
    it("creates multiple dogs", async () => {
      await dogFactory.createMany(4)
      expect(db.dogs).toHaveLength(4)
    })
  })
})
