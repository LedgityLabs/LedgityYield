import Image from "next/image";
import { FC } from "react";
import { Cube, FadeIn } from "./ui";
import Link from "next/link";
import foundersoneLogo from "~/assets/partners/foundersone.png";
import delubacLogo from "~/assets/partners/delubac.png";
import risepartnersLogo from "~/assets/partners/risepartners.png";
import adanLogo from "~/assets/partners/adan.svg";
import circleLogo from "~/assets/partners/circle.png";

const HomePartners: FC = () => {
  return (
    <FadeIn>
      <section className="relative  pb-36 flex flex-col items-center">
        <Cube size="medium" className="left-16 -bottom-40" />

        <h3 className="text-center font-semibold text-4xl pb-16 font-heading ">Our partners</h3>
        <ul className="flex flex-wrap justify-center gap-16 px-16">
          <li>
            <Link
              href="https://www.circle.com"
              target="_blank"
              className="opacity-80 hover:opacity-100 transition min-h-[60px]"
            >
              <Image src={circleLogo} alt="Circle Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.risepartners.org"
              target="_blank"
              className="opacity-80 hover:opacity-100 transition min-h-[60px]"
            >
              <Image src={risepartnersLogo} alt="Rise Partners Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.adan.eu"
              target="_blank"
              className="opacity-80 hover:opacity-100 transition min-h-[60px]"
            >
              <Image src={adanLogo} alt="ADAN Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://foundersdao.io/"
              target="_blank"
              className="opacity-80 hover:opacity-100 transition min-h-[60px]"
            >
              <Image src={foundersoneLogo} alt="Founders One Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.delubac.com/"
              target="_blank"
              className="opacity-80 hover:opacity-100 transition min-h-[60px]"
            >
              <Image src={delubacLogo} alt="Founders One Logo" height={40} />
            </Link>
          </li>
        </ul>
      </section>
    </FadeIn>
  );
};
export default HomePartners;
