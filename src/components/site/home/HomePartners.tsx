import Image from "next/image";
import { FC } from "react";
import { Cube, FadeIn } from "@/components/ui";
import Link from "next/link";
import foundersoneLogo from "~/assets/partners/foundersone.png";
import delubacLogo from "~/assets/partners/delubac.png";
import risepartnersLogo from "~/assets/partners/risepartners.png";
import adanLogo from "~/assets/partners/adan.svg";
import circleLogo from "~/assets/partners/circle.png";

const HomePartners: FC = () => {
  return (
    <FadeIn>
      <section className="relative  flex flex-col items-center pb-56">
        <Cube size="medium" className="bottom-2 left-16" />

        <h3 className="pb-16 text-center font-heading text-4xl font-bold text-fg/90">
          Our partners
        </h3>
        <ul className="flex flex-wrap justify-center gap-16 px-16">
          <li>
            <Link
              href="https://www.circle.com"
              target="_blank"
              className="bg-gradient-radial inline-flex min-h-[60px] items-center justify-center rounded-2xl from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={circleLogo} alt="Circle Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.risepartners.org"
              target="_blank"
              className="bg-gradient-radial inline-flex min-h-[60px] items-center justify-center rounded-2xl from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={risepartnersLogo} alt="Rise Partners Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.adan.eu"
              target="_blank"
              className="bg-gradient-radial inline-flex min-h-[60px] items-center justify-center rounded-2xl from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={adanLogo} alt="ADAN Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://foundersdao.io/"
              target="_blank"
              className="bg-gradient-radial inline-flex min-h-[60px] items-center justify-center rounded-2xl from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={foundersoneLogo} alt="Founders One Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.delubac.com/"
              target="_blank"
              className="bg-gradient-radial inline-flex min-h-[60px] items-center justify-center rounded-2xl from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={delubacLogo} alt="Delubac Logo" height={40} />
            </Link>
          </li>
        </ul>
      </section>
    </FadeIn>
  );
};
export default HomePartners;
