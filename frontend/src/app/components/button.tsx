'use client';

import React from 'react';

type ButtonProps = {
    lbl: string;
    click: () => void;
}

const Button: React.FC<ButtonProps> = ({lbl, click}) => {
    return (
        <button
            onClick={click}
            className="px-6 py-3 bg-[#9CB89D]-400 text-black rounded-sm hover:bg-[#9CB89D] transition"
        >
            {lbl}
        </button>
    )
}

export default Button;