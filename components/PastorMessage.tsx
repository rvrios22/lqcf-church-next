"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

function PastorMessage() {
  const message = useQuery(api.pastorMessage.getMessage.get);
  if(message === undefined) return <p>Loading...</p>
  if(message === null) return null
  return (
    <section>
      <h3 className="sub-header">From Our Pastors Hearts</h3>
      <p className="general-text text-left whitespace-pre-line">{message.message}</p>
      <p className="w-[90%] text-right font-black">- {message.author}</p>
      <p className="general-text text-left whitespace-pre-line">
        <span className="font-bold">Coram Deo: </span>
        {message.coramDeo}
      </p>
    </section>
  );
}

export default PastorMessage;
