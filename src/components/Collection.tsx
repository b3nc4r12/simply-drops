import { Collection } from "@/types"
import Image from "next/image"
import { urlFor } from "@/sanity"
import Link from "next/link"

const Collection: React.FC<Collection> = ({ description, nftCollectionName, mainImage, slug }) => {
    return (
        <Link href={`/nft/${slug.current}`} passHref={false}>
            <div className="box-shadow rounded-xl p-5 flex space-x-6 hover:scale-[102%] transition transform ease-out">
                <Image
                    src={urlFor(mainImage).url()}
                    width={200}
                    height={200}
                    objectFit="cover"
                />
                <div className="flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl text-white font-bold">{nftCollectionName}</h3>
                        <p className="text-gray-300 font-semibold text-sm">{description}</p>
                    </div>
                    <button className="hidden sm:inline box-shadow py-2 w-32 text-white rounded-lg">View Drop</button>
                </div>
            </div>
        </Link>
    )
}

export default Collection