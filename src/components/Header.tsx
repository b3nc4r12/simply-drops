import Link from "next/link"
import { useAddress, useCoinbaseWallet, useDisconnect, useMetamask, useWalletConnect } from "@thirdweb-dev/react"
import type { ConnectorData } from "wagmi-core"
import { useState } from "react"
import Image from "next/image"

const Header: React.FunctionComponent = () => {
    const [open, setOpen] = useState<boolean>(false);

    const connectWithMetamask: () => Promise<{
        data?: ConnectorData<any> | undefined,
        error?: Error | undefined
    }> = useMetamask();
    const connectWithWalletConnect: () => Promise<{
        data?: ConnectorData<any> | undefined,
        error?: Error | undefined
    }> = useWalletConnect();
    const connectWithCoinbase: () => Promise<{
        data?: ConnectorData<any> | undefined,
        error?: Error | undefined
    }> = useCoinbaseWallet();
    const address: string | undefined = useAddress();
    const disconnectWallet: () => void = useDisconnect();

    return (
        <header className="p-10 flex flex-col sm:flex-row space-y-6 sm:space-y-0 items-center sm:justify-between">
            <Link href="/" passHref={false}>
                <h1 className="text-white font-light text-xl cursor-pointer">
                    <span className="font-extrabold text-blue-500">SIMPLY</span> DROPS
                </h1>
            </Link>
            <div className="relative flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6 items-center">
                {address && <p className="text-blue-500">
                    You&apos;re logged in with wallet: {address.substring(0, 5)}...{address.substring(address.length - 4)}
                </p>}
                <button
                    onClick={() => address ? disconnectWallet() : open ? setOpen(false) : setOpen(true)}
                    className="box-shadow sm:text-lg font-bold text-white px-3 py-2 rounded-lg"
                >
                    {address ? "Sign Out" : "Connect Wallet"}
                </button>
                {open && (
                    <div className="sm:absolute sm:top-16 sm:right-0 bg-black box-shadow rounded-lg text-white w-48">
                        <button
                            onClick={() => connectWithMetamask().then(() => setOpen(false))}
                            className="py-2 px-3 flex items-center gap-2 hover:bg-blue-900 w-full rounded-t-lg">
                            <Image
                                src="/images/metamask.webp"
                                width={24}
                                height={24}
                                objectFit="contain"
                            />
                            Metamask
                        </button>
                        <button
                            onClick={() => connectWithWalletConnect().then(() => setOpen(false))}
                            className="py-2 px-3 flex items-center gap-2 hover:bg-blue-900 w-full">
                            <Image
                                src="/images/walletconnect.png"
                                width={24}
                                height={24}
                                objectFit="contain"
                            />
                            WalletConnect
                        </button>
                        <button
                            onClick={() => connectWithCoinbase().then(() => setOpen(false))}
                            className="py-2 px-3 flex items-center gap-2 hover:bg-blue-900 w-full rounded-b-lg">
                            <Image
                                src="/images/coinbase.svg"
                                width={24}
                                height={24}
                                objectFit="contain"
                            />
                            Coinbase Wallet
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header