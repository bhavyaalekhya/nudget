'use client';

import Image from "next/image";
import {useRouter} from "next/navigation";

export default function Home () {
    const router = useRouter();

    return (
        <div className="bg-[#D9E4DD] grid justify-items-center min-h-screen sm:p-20 font-[family-name:var(--font-poppins)] text-black">
            <div className="p-10 pb-20 flex flex-col items-center justify-center text-[50px]">
                <Image
                    src= "/currency_exchange.svg"
                    alt= "Logo"
                    width= {75}
                    height= {75}
                />

                <div className="font-bold" onClick={() => router.push('/')}>Nudget</div>
            </div>

            <div className="p-10 pb-20 flex flex-col items-center justify-center h-[1vh]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        router.push('/login');
                    }}
                    className="w-full max-w-md space-y-4 text-[20px]"
                >
                    <div className="text-[24px]">Username</div>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9CB89D] transition"
                    />
                    <div className="text-[24px]">Email</div>
                        <input
                            name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9CB89D] transition"
                    />
                    <div className="text-[24px]">Password</div>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9CB89D] transition"
                    />
                    <div className="text-[24px]">Confirm Password</div>
                        <input
                        name="confirm-password"
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9CB89D] transition"
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#9CB89D] text-black py-3 rounded-md hover:bg-[#7ea185] transition font-semibold"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}