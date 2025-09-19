import React from 'react'

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
