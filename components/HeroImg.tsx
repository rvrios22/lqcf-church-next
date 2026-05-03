import Image from "next/image";

interface HeroImgTypes {
  name: string;
  text: string;
}

function HeroImg({ name, text }: HeroImgTypes) {
  return (
    <div className="relative max-w-4/5 mx-auto my-6  overflow-clip">
      <Image
        className="m-auto h-[350px] object-cover lg:h-auto transition-opacity duration-1000 opacity-100 rounded-2xl shadow-md [@starting-style]:opacity-0"
        src={`/imgs/${name}.webp`}
        alt={`${name} header`}
        width={1000}
        height={350}
        priority
      />
      <h1 className="absolute left-1/2 top-1/2 z-11 -translate-x-1/2 -translate-y-1/2 text-center font-sans text-xl text-white transition-all duration-1000 [text-shadow:3px_2px_3px_rgb(0,0,0)] md:text-2xl lg:text-5xl opacity-100 [@starting-style]:top-[60%] [@starting-style]:opacity-0">
        {text}
      </h1>
    </div>
  );
}

export default HeroImg;
