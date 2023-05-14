import { Button, buttonSizes, buttonVariants } from "@/components/ui";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <>
      <div className="flex flex-col items-center p-14 gap-14">
        <h1 className="text-3xl font-bold text-center">Ledgity DApp UI kit</h1>
        <div className="flex w-screen p-8">
          <section>
            <h2 className="text-2xl text-center font-semibold">Buttons</h2>
            <div className="p-2">
              {buttonVariants.map((variant, index1) => (
                <div key={index1} className="flex gap-4 p-2">
                  {buttonSizes.map((size, index2) => (
                    <Button variant={variant} size={size} key={index2}>
                      {variant} {size}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
export default Page;
