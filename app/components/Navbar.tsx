import React, {useLayoutEffect, useRef} from 'react'
import {Link} from 'react-router'
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

const Navbar = () => {
    const ref = useRef<HTMLDivElement>(null);

    gsap.registerPlugin(ScrollTrigger);

    useLayoutEffect(() => {
        if(!ref.current){
            return;
        }

        const ctx = gsap.context(() => {
            gsap.from(ref.current, {
                y: -20,
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.inOut",
            });

            ScrollTrigger.create({
                trigger: ref.current,
                start: "top top",
                end: "+=100",
                scrub: 1,
                toggleClass: {
                    targets: ref.current,
                    className: "navbar-split"
                },
            })
        }, ref);

        return () => ctx.revert();
    }, []);
    return (
        <nav ref={ref} className="navbar shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMLYZER</p>
            </Link>

            <Link to="/upload" className="primary-button w-fit">
                Upload Resume
            </Link>
        </nav>
    )
}
export default Navbar
