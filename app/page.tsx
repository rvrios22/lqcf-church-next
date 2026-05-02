"use client";

import HeroImg from "@/components/HeroImg";
import WhatsGoingOnSquare from "@/components/WhatsGoingOnSquare";
import PastorsHeartEditor from "@/components/PastorsHeartEditor";
import { useAdmin } from "@/hooks/useAdmin";
import whatsGoingOnData from "@/public/data/whatsGoingOnData";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const pastorMessage = useQuery(api.pastorMessage.get);
  console.log(pastorMessage);
  const {isAdmin} = useAdmin();
  return (
    <>
      <HeroImg name="lqcfHome" text="La Quinta Christian Fellowship Church" />
      <p className="general-text">
        La Quinta Christian Fellowship Church is a non-denominational
        evangelical church committed to seeing redeemed, transformed individuals
        and community through the story of God's salvation. We gladly invite you
        to join us for Sunday morning worship service.
      </p>
      <p className="bible-text">
        Blessed be the God and Father of our Lord Jesus Christ, who has blessed
        us with every spiritual blessing in the heavenly places in Christ, just
        as He chose us in Him before the foundation of the world, that we would
        be holy and blameless before Him. In love He predestined us to adoption
        as sons through Jesus Christ to Himself, according to the kind intention
        of His will, to the praise of the glory of His grace, which He freely
        bestowed on us in the Beloved. Ephesians 1:3-6
      </p>
      <section className="mx-auto w-[90%] px-4 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {whatsGoingOnData.map(({ title, desc, link, name, alt }, idx) => (
          <WhatsGoingOnSquare
            key={idx}
            title={title}
            desc={desc}
            name={name}
            link={link}
            alt={alt}
          />
        ))}
      </section>

      <section className="mb-4">
        {/* 1. Null Check: If no data exists, don't render anything */}
        {!pastorMessage ? null : isAdmin ? (
          /* 2. User Check: If logged in, show the Editor */
          <PastorsHeartEditor
            message={pastorMessage.message}
            author={pastorMessage.author}
            coramDeo={pastorMessage.coramDeo}
            id={pastorMessage._id} // Using the Convex ID instead of hardcoded 1
          />
        ) : (
          /* 3. Regular Display: Public View */
          <>
            <h3 className="sub-header">From Our Pastors Hearts</h3>
            <p className="general-text text-left whitespace-pre-line">
              {pastorMessage.message}
            </p>
            <p className="w-[90%] text-right font-black">
              - {pastorMessage.author}
            </p>
            <p className="general-text text-left whitespace-pre-line">
              <span className="font-bold">Coram Deo: </span>
              {pastorMessage.coramDeo}
            </p>
          </>
        )}
      </section>
    </>
  );
}
