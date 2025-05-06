'use client';

import Button from '@/app/components/button';
import Image from "next/image";
import {redirect} from "next/navigation";

export default function Home () {

    return (
        <div className="bg-[#D9E4DD] w-screen grid grid-rows-[75vh] items-center justify-items-center min-h-screen sm:p-20 p-8 pb-20 gap-16 font-[family-name:var(--font-poppins)] text-black text-[100px]">
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <Image
                    src= "/currency_exchange.svg"
                    alt= "Logo"
                    width= {150}
                    height= {150}
                />

                <div className="font-bold" onClick={() => redirect('/')}>Nudget</div>

                <div className="text-[50px] gap-32">
                    <Button lbl="Dashboard" click={() => redirect('/dashboard')}/>
                </div>
            </div>
        </div>
    );
}
