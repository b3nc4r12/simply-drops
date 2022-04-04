import type { NextPage } from "next"
import Head from "next/head"
import Header from "@components/Header"

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Home | Simply Drops</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="bg-gradient-to-bl from-black to-blue-800 h-screen">
                <Header />
            </main>
        </>
    )
}

export default Home