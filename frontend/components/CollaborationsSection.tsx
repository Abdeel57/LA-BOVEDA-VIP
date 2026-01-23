import React from 'react';
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

  const primaryColor = appearance?.colors?.action || '#0ea5e9';
  const accentColor = appearance?.colors?.accent || '#ec4899';

  return (
    <section
      className="relative py-10 md:py-14 overflow-hidden"
      style={{ backgroundColor: appearance?.colors?.backgroundPrimary || '#111827' }}
    >
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
          initial={reduceAnimations ? {} : { opacity: 0, y: 18 }}
          whileInView={reduceAnimations ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduceAnimations ? {} : { duration: 0.45 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10 bg-white/15" />
            <span
              className="text-xs uppercase tracking-[0.35em]"
              style={{ color: preCalculatedTextColors.description }}
            >
              Invitados especiales
            </span>
            <div className="h-px w-10 bg-white/15" />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-3"
            style={{ color: preCalculatedTextColors.title }}
          >
            Colaboraciones
          </h2>

          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto" style={{ color: preCalculatedTextColors.description }}>
            Videos con artistas e invitados destacados. Mantiene una presentacion clara y profesional en todas las
            pantallas.
          </p>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible md:mx-0 md:px-0">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              initial={reduceAnimations ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              whileInView={reduceAnimations ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={reduceAnimations ? { duration: 0.25, delay: Math.min(index * 0.06, 0.25) } : { duration: 0.45, delay: Math.min(index * 0.08, 0.35) }}
              className="relative rounded-2xl overflow-hidden group border border-white/10 bg-black/30 backdrop-blur-md shadow-md transition-all duration-300 hover:border-white/20 hover:shadow-xl snap-start min-w-[82%] sm:min-w-[70%] md:min-w-0"
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


