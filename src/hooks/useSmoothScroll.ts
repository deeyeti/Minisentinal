// ============================================
// MiniSentinel — Smooth Scroll Hook (Lenis)
// ============================================

import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseSmoothScrollOptions {
    lerp?: number;
    duration?: number;
    smoothWheel?: boolean;
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
    const lenisRef = useRef<Lenis | null>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
        // Find the main content element as our scroll container
        const wrapper = document.querySelector('.main-content') as HTMLElement;

        if (!wrapper) {
            console.warn('useSmoothScroll: .main-content element not found');
            return;
        }

        // Initialize Lenis with wrapper
        const lenis = new Lenis({
            wrapper: wrapper,
            content: wrapper,
            lerp: options.lerp ?? 0.1,
            duration: options.duration ?? 1.2,
            smoothWheel: options.smoothWheel ?? true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on('scroll', (e: { progress: number }) => {
            setScrollProgress(e.progress);
            ScrollTrigger.update();
        });

        // Animation frame loop for Lenis
        function raf(time: number) {
            lenis.raf(time);
            rafIdRef.current = requestAnimationFrame(raf);
        }
        rafIdRef.current = requestAnimationFrame(raf);

        // Cleanup
        return () => {
            lenis.destroy();
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [options.lerp, options.duration, options.smoothWheel]);

    const scrollTo = (target: string | number | HTMLElement, options?: object) => {
        lenisRef.current?.scrollTo(target, options);
    };

    return {
        lenis: lenisRef.current,
        scrollTo,
        scrollProgress,
    };
}

export default useSmoothScroll;
