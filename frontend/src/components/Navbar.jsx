import { useState } from "react";

export default function Navbar() {
    return (
        <div className="navbar absolute">
            <div className="">
                <div className="bg-navbar w-screen h-[65px]">
                    <div className="flex justify-between items-center">
                        <img width="121" src="/logo.png" />
                        <div className="flex gap-4 pr-8">
                            <div>link 1</div>
                            <div>link 2</div>
                            <div>link 3</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
