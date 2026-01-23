import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Video } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useOptimizedAnimations } from '../utils/deviceDetection';

type CollaborationVideo =
  | {
      id: string;
      name: string;
      subtitle?: string;
      kind: 'youtube';
      embedUrl: string; // e.g. https://www.youtube-nocookie.com/embed/<id>
    }
  | {
      id: string;
      name: string;
      subtitle?: string;
      kind: 'mp4';
      src: string;
      poster?: string;
    };

const DEFAULT_COLLABS: CollaborationVideo[] = [
  {
    id: 'collab-1',
    name: 'Famoso Invitado',
    subtitle: 'Colaboración especial',
    kind: 'youtube',
    // Reemplaza por tu video real (YouTube embed)
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'collab-2',
    name: 'Influencer VIP',
    subtitle: 'Reacción al sorteo',
    kind: 'youtube',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'collab-3',
    name: 'Artista Invitado',
    subtitle: 'Anuncio de colaboración',
    kind: 'youtube',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
];

export default function CollaborationsSection({
  items = DEFAULT_COLLABS,
}: {
  items?: CollaborationVideo[];
}) {
  const reduceAnimations = useOptimizedAnimations();
  const { appearance, preCalculatedTextColors } = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const primaryColor = appearance?.colors?.action || '#0ea5e9';
  const accentColor = appearance?.colors?.accent || '#ec4899';
  const backgroundPrimary = appearance?.colors?.backgroundPrimary || '#111827';
  const vipGold = '#D4AF37';
  const vipGoldSoft = '#F7E7A1';

  useEffect(() => {
    const runId = 'collab-title-opacity-pre';
    const titleEl = titleRef.current;
    const sectionEl = sectionRef.current;
    const heroEl = document.querySelector('[data-hero-section="raffle"]') as HTMLElement | null;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aeea22a6-c52e-44b8-9389-1bf744a99e95', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId,
        hypothesisId: 'H1',
        location: 'CollaborationsSection.tsx:74',
        message: 'collab-section-theme-values',
        data: {
          reduceAnimations,
          primaryColor,
          accentColor,
          backgroundPrimary,
          titleColorTheme: preCalculatedTextColors?.title,
          descriptionColorTheme: preCalculatedTextColors?.description,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!titleEl || !sectionEl) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/aeea22a6-c52e-44b8-9389-1bf744a99e95', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId,
          hypothesisId: 'H2',
          location: 'CollaborationsSection.tsx:95',
          message: 'missing-refs',
          data: {
            hasTitle: Boolean(titleEl),
            hasSection: Boolean(sectionEl),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return;
    }

    const titleStyle = window.getComputedStyle(titleEl);
    const parentStyle = titleEl.parentElement ? window.getComputedStyle(titleEl.parentElement) : null;
    const titleRect = titleEl.getBoundingClientRect();
    const sectionRect = sectionEl.getBoundingClientRect();
    const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aeea22a6-c52e-44b8-9389-1bf744a99e95', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId,
        hypothesisId: 'H1',
        location: 'CollaborationsSection.tsx:120',
        message: 'title-computed-style',
        data: {
          color: titleStyle.color,
          opacity: titleStyle.opacity,
          filter: titleStyle.filter,
          textShadow: titleStyle.textShadow,
          parentOpacity: parentStyle?.opacity || null,
          parentFilter: parentStyle?.filter || null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aeea22a6-c52e-44b8-9389-1bf744a99e95', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId,
        hypothesisId: 'H4',
        location: 'CollaborationsSection.tsx:138',
        message: 'hero-vs-collab-layout',
        data: {
          hasHero: Boolean(heroEl),
          heroRect: heroRect
            ? {
                top: Math.round(heroRect.top),
                height: Math.round(heroRect.height),
                bottom: Math.round(heroRect.bottom),
              }
            : null,
          collabTop: Math.round(sectionRect.top),
          collabHeight: Math.round(sectionRect.height),
          gapToHero: heroRect ? Math.round(sectionRect.top - heroRect.bottom) : null,
          overlapsHero: heroRect ? sectionRect.top < heroRect.bottom : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const centerX = Math.max(0, Math.round(titleRect.left + titleRect.width / 2));
    const centerY = Math.max(0, Math.round(titleRect.top + titleRect.height / 2));
    const topEl = document.elementFromPoint(centerX, centerY);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aeea22a6-c52e-44b8-9389-1bf744a99e95', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId,
        hypothesisId: 'H2',
        location: 'CollaborationsSection.tsx:146',
        message: 'element-from-point',
        data: {
          centerX,
          centerY,
          topTag: topEl?.tagName || null,
          topId: topEl?.id || null,
          topClass: topEl ? (topEl as HTMLElement).className : null,
          isTitleOnTop: topEl === titleEl,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aeea22a6-c52e-44b8-9389-1bf744a99e95', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId,
        hypothesisId: 'H3',
        location: 'CollaborationsSection.tsx:171',
        message: 'layout-rects',
        data: {
          titleRect: {
            top: Math.round(titleRect.top),
            left: Math.round(titleRect.left),
            width: Math.round(titleRect.width),
            height: Math.round(titleRect.height),
          },
          sectionRect: {
            top: Math.round(sectionRect.top),
            left: Math.round(sectionRect.left),
            width: Math.round(sectionRect.width),
            height: Math.round(sectionRect.height),
          },
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [
    reduceAnimations,
    primaryColor,
    accentColor,
    backgroundPrimary,
    preCalculatedTextColors?.title,
    preCalculatedTextColors?.description,
  ]);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const heroEl = document.querySelector('[data-hero-section="raffle"]') as HTMLElement | null;
          const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;
          const collabRect = sectionEl.getBoundingClientRect();
          const sectionStyle = window.getComputedStyle(sectionEl);

          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/aeea22a6-c52e-44b8-9389-1bf744a99e95', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: 'debug-session',
              runId: 'collab-inview',
              hypothesisId: 'H4',
              location: 'CollaborationsSection.tsx:200',
              message: 'collab-inview-layout',
              data: {
                hasHero: Boolean(heroEl),
                heroBottom: heroRect ? Math.round(heroRect.bottom) : null,
                collabTop: Math.round(collabRect.top),
                gap: heroRect ? Math.round(collabRect.top - heroRect.bottom) : null,
                overlaps: heroRect ? collabRect.top < heroRect.bottom : null,
                marginTop: sectionStyle.marginTop,
                paddingTop: sectionStyle.paddingTop,
                viewport: { width: window.innerWidth, height: window.innerHeight },
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
          // #endregion
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-collab-section="true"
      className="relative pt-8 pb-10 md:py-14 overflow-hidden mt-0"
      style={{ backgroundColor: backgroundPrimary }}
    >
      {/* Transicion suave con el hero */}
      <div
        className="absolute inset-x-0 -top-6 h-6"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${backgroundPrimary} 100%)` }}
      />

      {/* Fondo sutil */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${accentColor}18 0%, transparent 55%), radial-gradient(circle at 80% 40%, ${primaryColor}20 0%, transparent 60%)`,
          filter: 'blur(50px)',
        }}
      />

      {!reduceAnimations && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-action/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-28 -right-28 w-[32rem] h-[32rem] bg-accent/25 rounded-full blur-3xl" />
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          initial={reduceAnimations ? false : { y: 18 }}
          animate={{ y: 0 }}
          transition={reduceAnimations ? { duration: 0 } : { duration: 0.45 }}
          style={{ opacity: 1 }}
          onAnimationComplete={() => {
            const titleEl = titleRef.current;
            const parentStyle = titleEl?.parentElement ? window.getComputedStyle(titleEl.parentElement) : null;
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/aeea22a6-c52e-44b8-9389-1bf744a99e95', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId: 'debug-session',
                runId: 'collab-title-opacity-post',
                hypothesisId: 'H1',
                location: 'CollaborationsSection.tsx:109',
                message: 'title-animation-complete',
                data: {
                  parentOpacity: parentStyle?.opacity || null,
                  parentFilter: parentStyle?.filter || null,
                },
                timestamp: Date.now(),
              }),
            }).catch(() => {});
            // #endregion
          }}
          className="text-center mb-5 md:mb-10"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <span
              className="px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.35em] border"
              style={{
                color: vipGoldSoft,
                borderColor: `${vipGold}55`,
                background: 'rgba(0,0,0,0.25)',
              }}
            >
              Edicion VIP
            </span>
          </div>

          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 uppercase tracking-[0.12em] leading-tight"
            style={{ color: '#ffffff' }}
          >
            COLABORACIONES
          </h2>

          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto" style={{ color: preCalculatedTextColors.description }}>
            Coleccion de videos con invitados destacados y alianzas exclusivas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              initial={reduceAnimations ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              whileInView={reduceAnimations ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={reduceAnimations ? { duration: 0.25, delay: Math.min(index * 0.06, 0.25) } : { duration: 0.45, delay: Math.min(index * 0.08, 0.35) }}
              className="relative rounded-2xl overflow-hidden group border border-white/10 bg-black/30 backdrop-blur-md shadow-md transition-all duration-300 hover:border-white/20 hover:shadow-lg"
            >
              <div
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)` }}
              />

              <div className="relative z-10 p-3 sm:p-4">
                <div className="relative rounded-xl overflow-hidden bg-black/50 border border-white/10">
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className="absolute inset-0"
                      style={{ background: `radial-gradient(circle at 50% 50%, ${primaryColor}20 0%, transparent 60%)` }}
                    />
                  </div>

                  <div className="aspect-video w-full">
                    {item.kind === 'youtube' ? (
                      <iframe
                        src={item.embedUrl}
                        title={`Colaboración - ${item.name}`}
                        loading="lazy"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                        poster={item.poster}
                        src={item.src}
                      />
                    )}
                  </div>

                  {/* Badge */}
                  <div className="absolute left-3 top-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur border border-white/10">
                    <Play className="w-4 h-4 text-white" />
                    <span className="text-xs font-semibold text-white">VIDEO</span>
                  </div>
                </div>

                <div className="pt-3 px-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold" style={{ color: preCalculatedTextColors.title }}>
                        {item.name}
                      </h3>
                      {item.subtitle && (
                        <p className="text-sm mt-1" style={{ color: preCalculatedTextColors.description }}>
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <div
                      className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/5"
                    >
                      <Video className="w-5 h-5 text-white/90" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}


