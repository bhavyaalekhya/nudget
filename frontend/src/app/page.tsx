'use client';

import Button from '@/app/components/button';
import Image from "next/image";
import {redirect} from "next/navigation";
import { useTheme } from "@/app/context/themecontext";

export default function Home () {
    const { theme } = useTheme();

    return (
        <div
            className="w-screen grid grid-rows-[75vh] items-center justify-items-center min-h-screen sm:p-20 p-8 pb-20 gap-16 text-[100px]"
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                fontFamily: theme.fontFamily,
                transition: 'all 0.3s ease',
            }}
        >
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <Image
                    src="/currency_exchange.svg"
                    alt="Logo"
                    width={150}
                    height={150}
                />

                <div className="font-bold" onClick={() => redirect('/')}>Nudget</div>

                <div className="text-[50px] gap-32">
                    <Button lbl="Dashboard" click={() => redirect('/dashboard')}/>
                </div>
            </div>
        </div>
    );
}
