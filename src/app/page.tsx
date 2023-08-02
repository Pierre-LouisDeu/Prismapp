import db from "@/modules/db";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const users = await db.user.findMany({ orderBy: { updatedAt: "desc" } });

  const generatePosts = async () => {
    "use server";

    await db.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
      },
    });
    revalidatePath("/");
  };

  const editUser = async (id: string) => {
    "use server";

    await db.user.update({
      where: { id },
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
      },
    });
    revalidatePath("/");
  };

  return (
    <main className="flex min-h-screen flex-col items-start p-24 items-center">
      <form action={generatePosts} className="w-1/2">
        <button className="bg-indigo-900 text-white p-5 mb-5 rounded-lg hover:bg-indigo-800 w-full">
          Generate user
        </button>
      </form>

      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white mb-3 px-5 py-3 rounded-md w-1/2 gap-4"
        >
          <div>Name : {user.name}</div>
          <div>Email : {user.email}</div>
          <div>Number : {user.phoneNumber}</div>
          <div>
            Created at : {dayjs(user.createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </div>
          {/* <form action={() => {editUser(user.id)}} className="w-1/2">
            <input
              type="hidden"
              name="id"
              value={user.id}
              className="bg-indigo-900 text-white p-5 mb-5 rounded-lg hover:bg-indigo-800 w-full"
            />
            <button className="bg-indigo-900 text-white p-5 mb-5 rounded-lg hover:bg-indigo-800 w-full">
              Edit name
            </button>
          </form> */}
        </div>
      ))}
    </main>
  );
}
