import { type NextPage } from "next";
import { redirect } from "next/navigation";

const Page: NextPage = () => {
  redirect("/app/invest");
};

export default Page;
