// import { Button, buttonSizes, buttonVariants } from "@/components/ui/button";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <>
      <header className="relative p-8">
        <h1 className="text-3xl font-bold text-center">Ledgity DApp UI kit</h1>

        {/* Theme switcher */}
        <div className="absolute right-8 top-8">X</div>
      </header>

      <main className="flex items-center p-14 gap-14">
        <section>
          <h2 className="text-2xl text-center font-semibold">Buttons</h2>
          {/* <div className="p-2">
            {buttonVariants.map((variant, index1) => (
              <div key={index1} className="flex gap-4 p-2">
                {buttonSizes.map((size, index2) => (
                  <Button variant={variant} size={size as any} key={index2}>
                    {variant} {size}
                  </Button>
                ))}
              </div>
            ))}
          </div> */}
        </section>
      </main>
    </>
  );
};
export default Page;
