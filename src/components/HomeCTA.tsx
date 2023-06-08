import { FC } from "react";
import { Button, Card, Cube, FadeIn } from "./ui";

const HomeCTA: FC = () => {
  return (
    <FadeIn>
      <section className="relative pb-64 flex flex-col items-center">
        <Cube size="large" className="right-48 bottom-[10%]" />
        <h3 className="text-center font-semibold text-4xl pb-16 px-10 font-heading ">
          Ready to get <span className="whitespace-nowrap">started ?</span>
        </h3>
        {/* <Link href="/app"> */}
        <Button
          data-tf-popup="J2ENFK9t"
          data-tf-opacity="100"
          data-tf-size="100"
          data-tf-iframe-props="title=Subscribe to app release"
          data-tf-transitive-search-params
          data-tf-medium="snippet"
          size="large"
        >
          Take me to the app
        </Button>
        {/* </Link> */}
      </section>
    </FadeIn>
  );
};
export default HomeCTA;
