import {
  Button,
  buttonSizes,
  buttonVariants,
  Card,
  cardRadiuses,
} from "@/components/ui";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <>
      <div className="flex flex-col items-center p-14">
        <h1 className="text-3xl font-bold text-center mb-12">
          Ledgity DApp UI kit
        </h1>
        <div className="flex w-screen p-12 gap-12">
          <section>
            <h2 className="text-2xl text-center font-semibold mb-4">Buttons</h2>
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
          <section>
            <h2 className="text-2xl text-center font-semibold mb-4">Cards</h2>
            <div className="p-2 flex flex-col gap-8">
              {cardRadiuses.map((radius, index) => (
                <Card key={index} radius={radius} className="max-w-lg p-12">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
export default Page;
