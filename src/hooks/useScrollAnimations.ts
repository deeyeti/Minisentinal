// ============================================
// MiniSentinel — Scroll Animation Hooks
// ============================================

import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Fade in from bottom animation
export function useFadeInUp<T extends HTMLElement>(
    options: {
        delay?: number;
        duration?: number;
        y?: number;
        start?: string;
        markers?: boolean;
    } = {}
): RefObject<T> {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        gsap.fromTo(
            element,
            {
                opacity: 0,
                y: options.y ?? 50,
            },
            {
                opacity: 1,
                y: 0,
                duration: options.duration ?? 0.8,
                delay: options.delay ?? 0,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: options.start ?? 'top 85%',
                    toggleActions: 'play none none reverse',
                    markers: options.markers ?? false,
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [options.delay, options.duration, options.y, options.start, options.markers]);

    return ref;
}

// Stagger children animation
export function useStaggerReveal<T extends HTMLElement>(
    options: {
        stagger?: number;
        delay?: number;
        duration?: number;
        start?: string;
    } = {}
): RefObject<T> {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current) return;

        const parent = ref.current;
        const children = parent.children;

        gsap.fromTo(
            children,
            {
                opacity: 0,
                y: 30,
            },
            {
                opacity: 1,
                y: 0,
                duration: options.duration ?? 0.6,
                delay: options.delay ?? 0,
                stagger: options.stagger ?? 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: parent,
                    start: options.start ?? 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [options.stagger, options.delay, options.duration, options.start]);

    return ref;
}

// Counter animation for stats
export function useCountUp(
    endValue: number,
    options: {
        duration?: number;
        start?: string;
        prefix?: string;
        suffix?: string;
    } = {}
): RefObject<HTMLElement> {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;
        const obj = { value: 0 };

        gsap.to(obj, {
            value: endValue,
            duration: options.duration ?? 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: element,
                start: options.start ?? 'top 85%',
                toggleActions: 'play none none none',
            },
            onUpdate: () => {
                element.textContent = `${options.prefix ?? ''}${Math.floor(obj.value).toLocaleString()}${options.suffix ?? ''}`;
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [endValue, options.duration, options.start, options.prefix, options.suffix]);

    return ref;
}

// Parallax effect
export function useParallax<T extends HTMLElement>(
    speed: number = 0.5,
    options: {
        start?: string;
        end?: string;
    } = {}
): RefObject<T> {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        gsap.to(element, {
            y: () => speed * 100,
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: options.start ?? 'top bottom',
                end: options.end ?? 'bottom top',
                scrub: true,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [speed, options.start, options.end]);

    return ref;
}

// Glow pulse animation (non-scroll based)
export function useGlowPulse<T extends HTMLElement>(
    color: string = 'rgba(0, 255, 255, 0.5)'
): RefObject<T> {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        gsap.to(element, {
            boxShadow: `0 0 30px ${color}`,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        return () => {
            gsap.killTweensOf(element);
        };
    }, [color]);

    return ref;
}
