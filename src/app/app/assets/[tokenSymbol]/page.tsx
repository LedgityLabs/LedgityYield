import { type NextPage } from "next";

interface Props {
  params: {
    tokenSymbol: string;
  };
}

const Page: NextPage<Props> = (props) => {
  return (
    <main className=" bg-green-200">
      &quot;{props.params.tokenSymbol}&quot; page
    </main>
  );
};

export default Page;
