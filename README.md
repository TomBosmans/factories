## What is this?
This is a TypeScript class named BaseFactory which serves as a base class for other factory classes to be extended from. The class has two generic type parameters, BuildAttributes and CreateAttributes, which are used to define the types of the attributes that can be built and created by the factory respectively.

The class has four public methods:
  - build: This method accepts an optional parameter params of type Partial<BuildAttributes> and returns an object of type BuildAttributes. The method generates a new object using the generate() method, and merges it with the params object (if provided) using the spread operator.
  - buildMany: This method accepts two parameters, times of type number and params of type Partial<BuildAttributes> which is optional. It returns an array of objects of type BuildAttributes. This method generates an array of length times and maps each element to a new object using the build() method.
  - create: This method accepts an optional parameter params of type Partial<BuildAttributes> and returns a promise that resolves to an object of type CreateAttributes. This method generates a new object using the build() method and passes it to the save() method to persist the object.
  - createMany: This method accepts two parameters, times of type number and params of type Partial<BuildAttributes> which is optional. It returns a promise that resolves to an array of objects of type CreateAttributes. This method generates an array of length times using the buildMany() method and saves each object using the save() method.

The class also has two protected methods:
  - save: This method accepts an object of type BuildAttributes and returns a promise that resolves to an object of type CreateAttributes. This method is responsible for persisting the object.
  - generate: This method returns an object of type BuildAttributes. This method is used to generate a new object when the build() method is called without any parameters. The default implementation returns an empty object of type BuildAttributes.

## Example in nestjs with prisma and faker:
```ts
type BuildAttr = Prisma.UserUncheckedCreateInput
type CreateAttr = User

@Injectable()
export class UserFactory extends BaseFactory<BuildAttr, CreateAttr> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRoleFactory: UserRoleFactory,
  ) {}

  protected async save(data: BuildAttr): Promise<CreateAttr> {
    await this.handleRole(data.userRoleId)
    const user = await this.prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        password: await hash(data.password, 10),
      },
    })

    return user
  }

  // generate random data
  protected generate(): BuildAttr {
    return {
      id: faker.datatype.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(5),
      firstName: faker.internet.userName(),
      lastName: faker.internet.userName(),
      userRoleId: faker.datatype.uuid(),
      blocked: false,
    }
  }

  // handle relations like for example a role
  private async handleRole(id: UserRole["id"]) {
    const userRole = await this.prisma.userRole.findFirst({ where: { id } })
    if (!userRole) await this.userRoleFactory.create({ id })
  }
}
```

Now in a spec you can do the following:
```ts
describe("", () => {
  let module: TestingModule
  let userFactory

  beforeEach(async () => {
    module = // create your testing module
    userFactory = await module.resolve(UserFactory)
  })

  it("does stuff", async () => {
    const user = await userFactory.create({
      email: "john.doe@email.com",
    })
  
    const users = await userFactory.createMany(4, {
      blocked: true
    })
  
    const newUser = userFactory.build()
    const newUsers = userFactory.buildMany()
  })
})
```
