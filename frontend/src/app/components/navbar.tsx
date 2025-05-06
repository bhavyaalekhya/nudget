import React from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    return (
        <div className="w-full h-20 bg-[#9CB89D] sticky top-0 z-50 shadow rounded">
            <div className="flex items-center justify-between h-full px-6">

                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/dashboard")}>
                    <Image src="/currency_exchange.svg" alt="Logo" width={50} height={50}/>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-8 text-lg font-bold text-black">
                    <a className="cursor-pointer hover:underline" onClick={() => router.push('/dashboard')}>Dashboard</a>
                    <a className="cursor-pointer hover:underline" onClick={() => router.push('/history')}>History</a>
                </div>
            </div>
        </div>
    );
}