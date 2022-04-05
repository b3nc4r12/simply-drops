import Head from "next/head"
import { sanityClient, urlFor } from "@/sanity"
import type { Collection } from "@/types"
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next"
import Header from "@components/Header"
import Image from "next/image"
import { useAddress, useNFTDrop } from "@thirdweb-dev/react"
import type { NFTDrop, NFTMetadataOwner } from "@thirdweb-dev/sdk"
import { ArrowLeftIcon } from "@heroicons/react/solid"
import { BanIcon, DownloadIcon } from "@heroicons/react/outline"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { BigNumber } from "ethers"
import toast, { Toaster } from "react-hot-toast"

interface Props {
    collection: Collection
}

const NFTDropPage: NextPage<Props> = ({ collection }) => {
    const [claimedSupply, setClaimedSupply] = useState<number>(0);
    const [totalSupply, setTotalSupply] = useState<BigNumber>();
    const [priceInEth, setPriceInEth] = useState<string>("");
    const [supplyLoading, setSupplyLoading] = useState<boolean>(true);
    const [minting, setMinting] = useState<boolean>(false);

    const address: string | undefined = useAddress();
    const nftDrop: NFTDrop | undefined = useNFTDrop(collection.address);

    useEffect(() => {
        if (!nftDrop) return

        const fetchNFTDropData = async () => {
            setSupplyLoading(true);

            const claimed: NFTMetadataOwner[] = await nftDrop.getAllClaimed();
            const total: BigNumber = await nftDrop.totalSupply();

            setClaimedSupply(claimed.length);
            setTotalSupply(total);
            setSupplyLoading(false);
        }

        fetchNFTDropData();
    }, [nftDrop])

    useEffect(() => {
        const fetchPrice = async () => {
            const claimConditions = await nftDrop?.claimConditions.getAll();
            setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue!);
        }

        fetchPrice();
    }, [nftDrop])

    const mintNFT = () => {
        if (!nftDrop || !address) return

        setMinting(true);
        const notification = toast.loading(`Minting NFT...`, {
            style: {
                background: "white",
                color: "green",
                fontWeight: "bolder",
                fontSize: "17",
                padding: "20px"
            }
        })

        const quantity = 1

        nftDrop.claimTo(address, quantity)
            .then(async (tx) => {
                const claimed: NFTMetadataOwner[] = await nftDrop.getAllClaimed();
                setClaimedSupply(claimed.length);

                toast("Hooray! You've successfully minted!", {
                    duration: 8000,
                    style: {
                        background: "green",
                        color: "white",
                        fontWeight: "bolder",
                        fontSize: "17",
                        padding: "20px"
                    }
                })
            })
            .catch(() => toast("Whoops! Something went wrong!", {
                style: {
                    background: "red",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "17",
                    padding: "20px"
                }
            }))
            .finally(() => {
                setMinting(false);
                toast.dismiss(notification);
            })
    }

    return (
        <>
            <Head>
                <title>{collection.title}</title>
                <link rel="icon" href={urlFor(collection.previewImage).url()} />
                <meta name="description" content={collection.description} />
            </Head>

            <main className="bg-gradient-to-bl from-black to-blue-800 min-h-screen px-10 pb-10">
                <Toaster position="bottom-center" />

                <Header />
                <section className="flex flex-col space-y-5 md:space-y-0 md:space-x-8 md:flex-row box-shadow max-w-7xl mx-auto rounded-xl p-10 mt-8">
                    <Image
                        src={urlFor(collection.previewImage).url()}
                        height={400}
                        width={400}
                        objectFit="cover"
                        alt={collection.nftCollectionName}
                        className="rounded-xl"
                    />
                    <div className="flex flex-col md:self-center w-full">
                        <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold text-white text-center md:text-left">{collection.title}</h1>
                        <p className="text-lg font-semibold mt-3 text-center md:text-left text-gray-200">{collection.description}</p>
                        <span className="bg-black rounded-md box-shadow py-2 px-3 text-blue-500 text-center mt-4 max-w-[200px] mx-auto md:mx-0 font-bold">
                            {supplyLoading ? "Loading..." : `${claimedSupply} / ${totalSupply?.toString()} NFTs Claimed`}
                        </span>
                        <hr className="mt-4 bg-blue-500 border-none h-0.5" />
                        <div className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row justify-center lg:space-x-5 mt-10">
                            <button
                                onClick={mintNFT}
                                disabled={minting || supplyLoading || claimedSupply === totalSupply?.toNumber() || !address}
                                className={`box-shadow text-white font-bold text-lg rounded-lg py-2 w-full flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {
                                    supplyLoading ? "Loading..."
                                        : minting ? "Minting..."
                                            : claimedSupply === totalSupply?.toNumber() ? (
                                                <>
                                                    <BanIcon className="h-6" />
                                                    Sold Out
                                                </>
                                            )
                                                : !address ? "Connect Wallet to Mint"
                                                    : (
                                                        <>
                                                            <DownloadIcon className="h-6" />
                                                            Mint ({priceInEth} ETH)
                                                        </>
                                                    )
                                }
                            </button>
                            <Link href="/" passHref={false}>
                                <button className="box-shadow text-white font-bold text-lg rounded-lg py-2 w-full flex items-center justify-center gap-4">
                                    <ArrowLeftIcon className="h-6" />
                                    Return Home
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const query: string = `*[_type == "collection" && slug.current == $slug][0]{
        _id,
        title,
        address,
        description,
        nftCollectionName,
        previewImage {
            asset
        },
        slug {
            current
        }
    }`

    const collection: Collection = await sanityClient.fetch(query, { slug: params?.slug });

    if (!collection) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            collection
        }
    }
}