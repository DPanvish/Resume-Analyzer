import React, {useLayoutEffect, useRef} from 'react'
import {gsap} from "gsap";

/* CSS only animated background
const AnimatedBackground = () => {
    return (
        <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(124,58,237,0.25)_0%,rgba(34,211,238,0.15)_35%,transparent_70%)]" />

            <div
                className="absolute inset-0 opacity-[0.04] mix-blend-soft-light"
                style{{
                backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\' opacity=\\'0.6\\'/></svg>')"
                }}
            />

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(80%_80%_at_50%_50%,transparent_60%,rgba(0,0,0,0.35)_100%)]"/>
        </div>
    )
}
export default AnimatedBackground
*/


/* GSAP driven animated background */

const AnimatedBackground = () => {
    const scope = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if(!scope.current){
            return;
        }

        const ctx = gsap.context(() => {
            gsap.to("#blob1", {
                duration: 18,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                x: 60,
                y: -40,
                scale: 1.1
            });

            gsap.to("blob2", {
                duration: 22,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                x: -40,
                y: 50,
                scale: 0.95
            })
        })
    }, []);

    return (
        <div ref={scope} aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
            <svg className="absolute w-[120vmax] h-[120vmax] -left-[10vmax] -top-[20vmax] opacity-30 blur-3xl" viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8A2BE2"/>
                        <stop offset="100%" stopColor="#00D1FF"/>
                    </linearGradient>
                    <linearGradient id="g2" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22D3EE"/>
                        <stop offset="100%" stopColor="#7C3AED"/>
                    </linearGradient>
                </defs>
                <g id="blob1">
                    <path fill="url(#g1)" d="M45,-63.8C59.5,-53.6,72.7,-40.4,77.7,-24.5C82.7,-8.5,79.4,10.1,71.5,27C63.7,43.9,51.3,59.1,36.4,66.5C21.5,73.9,4.1,73.5,-12.7,72.1C-29.5,70.7,-45.7,68.3,-58.7,59.6C-71.8,50.9,-81.8,35.9,-83.9,19.1C-86,2.4,-80.2,-16.1,-70.4,-31.5C-60.6,-46.9,-46.9,-59.3,-31.3,-69.7C-15.6,-80,1.9,-88.1,17.8,-85C33.7,-82,48,-67.9,45,-63.8Z" transform="translate(100 100)"/>
                </g>
                <g id="blob2">
                    <path fill="url(#g2)" d="M39.7,-56C49.9,-48.3,56.1,-37.5,63.5,-25.6C70.9,-13.7,79.4,-0.6,78.1,11.9C76.8,24.4,65.9,36.2,54.2,47.6C42.6,58.9,30.1,69.8,15.3,73.6C0.5,77.3,-16.6,73.8,-32.9,67.5C-49.1,61.2,-64.5,52.1,-72.5,38.6C-80.6,25.1,-81.3,7.1,-77.7,-8.6C-74,-24.3,-66.1,-38.6,-55.1,-48.5C-44.1,-58.4,-30,-63,-17.1,-63.5C-4.2,-64,7.5,-60,19.4,-57.5C31.2,-55,43.9,-53.7,39.7,-56Z" transform="translate(100 100)"/>
                </g>
            </svg>
            <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_30%,transparent_50%,rgba(0,0,0,0.5)_100%)]" />
        </div>
    )
}
export default AnimatedBackground
