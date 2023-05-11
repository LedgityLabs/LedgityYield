import { type NextPage } from "next";

interface Props {
  params: {
    tokenSymbol: string;
  };
}

const Page: NextPage<Props> = (props) => {
  return (
    <main className=" bg-green-200">"{props.params.tokenSymbol}" page</main>
  );
};
export default Page;
