import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Header from "@components/Header"
import { sanityClient } from "@/sanity"
import type { Collection } from "@/types"
import CollectionComponent from "@components/Collection"

interface Props {
    collections: Collection[]
}

const Home: NextPage<Props> = ({ collections }) => {
    return (
        <>
            <Head>
                <title>Home | Simply Drops</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="Your #1 spot for exclusive NFT Drops!" />
            </Head>

            <main className="bg-gradient-to-bl from-black to-blue-800 min-h-screen">
                <Header />
                <section className="flex flex-col gap-8 lg:grid lg:grid-cols-2 max-w-7xl mx-auto p-10">
                    {collections.map((collection) => (
                        <CollectionComponent key={collection._id} {...collection} />
                    ))}
                </section>
            </main>
        </>
    )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
    const query: string = `*[_type == "collection"]{
        _id,
        description,
        nftCollectionName,
        mainImage {
            asset
        },
        slug {
            current
        }
    }`

    const collections: Collection[] = await sanityClient.fetch(query);

    return {
        props: {
            collections
        }
    }
}