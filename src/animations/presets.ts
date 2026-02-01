// ============================================
// MiniSentinel — Animation Presets
// ============================================

import gsap from 'gsap';

// Common easing functions
export const EASING = {
    smooth: 'power2.out',
    snappy: 'power3.out',
    bounce: 'back.out(1.4)',
    elastic: 'elastic.out(1, 0.3)',
    linear: 'none',
};

// Duration presets
export const DURATION = {
    fast: 0.3,
    normal: 0.5,
    slow: 0.8,
    verySlow: 1.2,
};

// Animation presets
export const presets = {
    fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1, duration: DURATION.normal, ease: EASING.smooth },
    },

    fadeInUp: {
        from: { opacity: 0, y: 30 },
        to: { opacity: 1, y: 0, duration: DURATION.slow, ease: EASING.snappy },
    },

    fadeInDown: {
        from: { opacity: 0, y: -30 },
        to: { opacity: 1, y: 0, duration: DURATION.slow, ease: EASING.snappy },
    },

    fadeInLeft: {
        from: { opacity: 0, x: -30 },
        to: { opacity: 1, x: 0, duration: DURATION.slow, ease: EASING.snappy },
    },

    fadeInRight: {
        from: { opacity: 0, x: 30 },
        to: { opacity: 1, x: 0, duration: DURATION.slow, ease: EASING.snappy },
    },

    scaleIn: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1, duration: DURATION.normal, ease: EASING.bounce },
    },

    slideUp: {
        from: { y: '100%' },
        to: { y: 0, duration: DURATION.slow, ease: EASING.smooth },
    },

    glowPulse: {
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    },
};

// Utility function to animate element with preset
export function animate(
    element: gsap.TweenTarget,
    presetName: keyof typeof presets,
    options?: gsap.TweenVars
) {
    const preset = presets[presetName];

    if ('from' in preset && 'to' in preset) {
        return gsap.fromTo(element, preset.from, { ...preset.to, ...options });
    }

    return gsap.to(element, { ...preset, ...options });
}

// Stagger animation utility
export function staggerAnimate(
    elements: gsap.TweenTarget,
    presetName: keyof typeof presets,
    stagger: number = 0.1,
    options?: gsap.TweenVars
) {
    const preset = presets[presetName];

    if ('from' in preset && 'to' in preset) {
        return gsap.fromTo(elements, preset.from, { ...preset.to, stagger, ...options });
    }

    return gsap.to(elements, { ...preset, stagger, ...options });
}

// Timeline builder
export function createRevealTimeline(container: Element) {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
        },
    });

    return tl;
}

export default presets;
