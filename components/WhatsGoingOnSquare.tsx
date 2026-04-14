"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface WhatsGoingOnSquareTypes {
  title: string;
  desc: string;
  link: string;
  name: string;
  alt: string;
}

function WhatsGoingOnSquare({
  title,
  desc,
  link,
  name,
  alt,
}: WhatsGoingOnSquareTypes) {
  const textRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [textHeight, setTextHeight] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  const { ref: inViewRef, inView } = useInView({ triggerOnce: true });

  // 1. Handle the "Already Cached" scenario
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  // 2. Measure height once loaded
  useEffect(() => {
    if (isLoaded && textRef.current) {
      // Small delay to ensure styles are applied
      setTextHeight(textRef.current.offsetHeight);
    }
  }, [isLoaded]);

  return (
    <figure
      ref={inViewRef}
      className={`relative mx-auto mb-4 max-w-[600px] overflow-hidden rounded-2xl shadow-2xl transition-opacity duration-700 ${
        inView ? "opacity-100" : "opacity-0"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={link}>
        <Image
          width={600}
          height={300}
          ref={imgRef}
          src={`/imgs/${name}.webp`}
          alt={alt}
          className="block w-full object-cover md:min-h-[250px]"
          onLoad={() => setIsLoaded(true)}
        />

        {/* 3. Logic change: We render this ALWAYS but use opacity/transform.
          This allows textRef to always have a measurement.
        */}
        <div
          ref={textRef}
          className="absolute left-0 bottom-0 z-10 w-full p-6 text-center text-white transition-transform duration-500 ease-in-out"
          style={{
            // If not hovered, slide down by the height of the description
            // We subtract a bit to keep the title visible
            transform: isHovered
              ? "translateY(0)"
              : `translateY(${textHeight - 60}px)`,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
          }}
        >
          <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">
            {title}
          </h3>
          <p
            className={`text-sm transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            {desc}
          </p>
        </div>
      </Link>
    </figure>
  );
}

export default WhatsGoingOnSquare;
