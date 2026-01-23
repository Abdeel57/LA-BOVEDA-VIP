import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, BadgeCheck } from 'lucide-react';
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

  const primaryColor = appearance?.colors?.action || '#0ea5e9';
  const accentColor = appearance?.colors?.accent || '#ec4899';

  return (
    <section
      className="relative py-10 md:py-14 overflow-hidden"
      style={{ backgroundColor: appearance?.colors?.backgroundPrimary || '#111827' }}
    >
      {/* Fondo creativo */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${accentColor}20 0%, transparent 55%), radial-gradient(circle at 80% 40%, ${primaryColor}25 0%, transparent 60%), radial-gradient(circle at 50% 90%, ${accentColor}15 0%, transparent 55%)`,
          filter: 'blur(40px)',
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
          initial={reduceAnimations ? {} : { opacity: 0, y: 18 }}
          whileInView={reduceAnimations ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduceAnimations ? {} : { duration: 0.45 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div
              className="p-3 rounded-2xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
              }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="p-3 rounded-2xl shadow-lg bg-white/10 backdrop-blur">
              <BadgeCheck className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-3"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 55%, ${primaryColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
            }}
          >
            Colaboraciones
          </h2>

          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: preCalculatedTextColors.description }}>
            Mira los videos con nuestros invitados especiales. Reemplaza los videos de ejemplo por tus colaboraciones
            reales cuando quieras.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              initial={reduceAnimations ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              whileInView={reduceAnimations ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={reduceAnimations ? { duration: 0.25, delay: Math.min(index * 0.06, 0.25) } : { duration: 0.45, delay: Math.min(index * 0.08, 0.35) }}
              className="relative rounded-3xl overflow-hidden group"
            >
              {/* Borde gradiente */}
              <div
                className="absolute inset-0 p-[1px] rounded-3xl"
                style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${primaryColor} 50%, ${accentColor} 100%)` }}
              >
                <div className="w-full h-full rounded-3xl bg-black/30 backdrop-blur" />
              </div>

              <div className="relative z-10 p-4">
                <div className="relative rounded-2xl overflow-hidden bg-black/50">
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

                <div className="pt-4 px-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black" style={{ color: preCalculatedTextColors.title }}>
                        {item.name}
                      </h3>
                      {item.subtitle && (
                        <p className="text-sm mt-1" style={{ color: preCalculatedTextColors.description }}>
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <div
                      className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)` }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
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


