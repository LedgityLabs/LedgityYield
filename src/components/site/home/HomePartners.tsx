import Image from "next/image";
import { FC } from "react";
import { Cube, FadeIn } from "@/components/ui";
import Link from "next/link";
import adanLogo from "~/assets/partners/adan.svg";
import arbitrumLogo from "~/assets/partners/arbitrum.svg";
import circleLogo from "~/assets/partners/circle.png";
import delubacLogo from "~/assets/partners/delubac.png";
import foundersDAOLogo from "~/assets/partners/founders-dao.png";
import geniusXLogo from "~/assets/partners/genius-x.png";
import hederaLogo from "~/assets/partners/hedera.png";
import lineaLogo from "~/assets/partners/linea.png";
import offchainLabsLogo from "~/assets/partners/offchain-labs.svg";
import risepartnersLogo from "~/assets/partners/risepartners.png";

const HomePartners: FC = () => {
  return (
    <FadeIn>
      <section className="relative  flex flex-col items-center pb-56">
        <Cube size="medium" className="bottom-2 left-16" />

        <h3 className="pb-16 text-center font-heading text-4xl font-bold text-fg/90">
          Our partners
        </h3>
        <ul className="flex flex-wrap justify-center items-center gap-16 px-16 [max-width:50vw]">
          <li>
            <Link
              href="https://arbitrum.io/"
              target="_blank"
              className="inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-gradient-radial from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={arbitrumLogo} alt="Arbitrum Logo" height={45} />
            </Link>
          </li>
          <li>
            <Link
              href="https://linea.build/"
              target="_blank"
              className="inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-gradient-radial from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={lineaLogo} alt="Linea Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://hedera.com/"
              target="_blank"
              className="inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-gradient-radial from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={hederaLogo} alt="Hedera Logo" height={45} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.circle.com"
              target="_blank"
              className="inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-gradient-radial from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={circleLogo} alt="Circle Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://offchainlabs.com/"
              target="_blank"
              className="inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-gradient-radial from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={offchainLabsLogo} alt="Offchain Labs Logo" height={45} />
            </Link>
          </li>

          <li>
            <Link
              href="https://www.risepartners.org"
              target="_blank"
              className="inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-gradient-radial from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={risepartnersLogo} alt="Rise Partners Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://foundersdao.io/"
              target="_blank"
              className="inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-gradient-radial from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={foundersDAOLogo} alt="Founders DAO Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.delubac.com/"
              target="_blank"
              className="inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-gradient-radial from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={delubacLogo} alt="Delubac Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.genius-x.co/"
              target="_blank"
              className="inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-gradient-radial from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={geniusXLogo} alt="GeniusX Logo" height={40} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.adan.eu"
              target="_blank"
              className="inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-gradient-radial from-bg/50 to-transparent opacity-80 backdrop-blur-md transition hover:opacity-100"
            >
              <Image src={adanLogo} alt="ADAN Logo" height={35} />
            </Link>
          </li>
        </ul>
      </section>
    </FadeIn>
  );
};
export default HomePartners;
