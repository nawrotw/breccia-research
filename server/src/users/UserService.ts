import { faker } from "@faker-js/faker";
import type { User } from "@shared";

export const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    age: faker.number.int({ min: 18, max: 80 }),
    isAdmin: faker.datatype.boolean(),
  }))
}
