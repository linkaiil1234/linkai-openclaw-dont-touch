import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/marquee";
import Image from "next/image";

const logos = [
  "https://cdn.brandfetch.io/id6O2oGzv-/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1731911497387",
  "https://cdn.brandfetch.io/ideyyfT0Lp/theme/dark/idO6r-bq1D.svg?c=1bxid64Mup7aczewSAYMX&t=1758984115169",
  "https://cdn.brandfetch.io/id2alue-rx/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1714556231750",
  "https://cdn.brandfetch.io/idchmboHEZ/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1727706672983",
  "https://cdn.brandfetch.io/idDpCfN4VD/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1759982666477",
  "https://cdn.brandfetch.io/id8LeMTX5r/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1696085448760",
];

export const LogoStrip = () => {
  return (
    <section className="my-20 flex flex-col items-center gap-10">
      <p className="text-muted-foreground">
        Trusted by 7,000+ top startups, freelancers and studios
      </p>
      <Marquee className="max-w-7xl mx-auto w-full">
        <MarqueeFade side="left" className="from-muted" />
        <MarqueeFade side="right" className="from-muted" />
        <MarqueeContent>
          {logos.map((logo, index) => (
            <MarqueeItem
              className="h-32 w-auto mx-10 grayscale opacity-70"
              key={index}
            >
              <Image
                alt={`Placeholder ${index}`}
                width={100}
                height={200}
                src={logo}
              />
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </section>
  );
};
