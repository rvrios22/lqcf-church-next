import Image from "next/image";

interface ElderTypes {
  name: string;
  bio: string;
  img: string;
}
function Elder({ name, bio, img }: ElderTypes) {
  return (
    <figure className="mb-4 md:grid md:grid-cols-2">
      <div>
        <Image
          src={`/imgs/${img}.webp`}
          alt={name}
          className="m-auto h-[500px] w-[90%] rounded-2xl object-cover shadow-lg"
          width={200}
          height={500}
        />
        <h2 className="sub-header">{name}</h2>
      </div>
      <p className="general-text no-scrollbar overflow-y-scroll md:h-[500px]">
        {bio}
      </p>
    </figure>
  );
}

export default Elder;
