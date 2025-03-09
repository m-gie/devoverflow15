import { auth } from "@/auth";

const Home = async () => {
  const session = await auth();
  console.log(session);
  return (
    <div>
      <div className="text-3xl font-black ">Hello!</div>
      <div className="font-space-grotesk text-3xl ">Hello!</div>
      <div className="text-3xl ">{session?.user?.name}</div>

      {/* <form
        className="px-10 pt-[100px]"
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <Button type="submit"> Log Out</Button>
      </form> */}
    </div>
  );
};

export default Home;
