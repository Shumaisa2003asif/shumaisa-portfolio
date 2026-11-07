import { motion } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { projects, type Project } from '../../data/content'
import { Preview } from './previews/Previews'

const EASE = [0.16, 1, 0.3, 1] as const

const MAPALZ_GALLERY = [
  { src: '/images/mapalz-wholesaler.webp', caption: 'Wholesale hub: buyers, orders, payouts and stock in one view.' },
  { src: '/images/mapalz-seller.webp', caption: 'Seller dashboard with inventory synced to Shopify, eBay and Wix.' },
  { src: '/images/mapalz-customer.webp', caption: 'The customer storefront, shared by every seller on the platform.' },
]

export function CaseStudy({
  project,
  onClose,
  onNavigate,
}: {
  project: Project
  onClose: () => void
  onNavigate: (slug: string) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const index = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
      previous?.focus({ preventScroll: true })
    }
  }, [onClose])

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 })
  }, [project.slug])

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`cs-${project.slug}`}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-ivory"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="bg-noise pointer-events-none fixed inset-0 opacity-[0.12] mix-blend-multiply" />
      <div className="sticky top-0 z-10 flex justify-end p-4 md:p-6">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full bg-olive py-2 pl-4 pr-2 text-sm text-ivory shadow-lg"
        >
          Back to work
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ivory">
            <X className="h-4 w-4 text-olive" aria-hidden />
          </span>
        </button>
      </div>

      <article className="relative mx-auto -mt-16 max-w-[1200px] px-5 pb-24 md:px-10">
        <motion.header
          className="max-w-[900px] pt-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        >
          <p className="flex gap-6 font-mono text-xs text-olive/70">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </p>
          <h2 id={`cs-${project.slug}`} className="mt-4 font-serif text-[14vw] leading-[0.9] text-olive md:text-[7rem]">
            {project.name}
          </h2>
          <p className="text-pretty mt-6 max-w-[60ch] text-lg leading-relaxed text-olive/85 md:text-xl">{project.description}</p>
        </motion.header>

        <motion.div
          layoutId={`preview-${project.slug}`}
          className="relative mt-12 aspect-[4/3] w-full overflow-hidden rounded-[2rem] md:aspect-[16/8]"
          style={{ background: project.tone }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="bg-noise pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply" />
          <Preview project={project} hover />
        </motion.div>

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-12 md:mt-24">
          <aside className="col-span-12 space-y-8 md:col-span-4">
            <div>
              <p className="font-hand text-2xl text-clay">my part</p>
              <p className="mt-1 leading-relaxed text-olive/85">{project.contribution}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-olive/60">built with</p>
              <ul className="mt-2 space-y-1 text-olive">
                {project.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            {project.link && (
              <a
                href={project.link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-olive underline decoration-olive/30 underline-offset-4 hover:decoration-olive"
              >
                {project.link.label}
                <ArrowRight className="h-4 w-4 -rotate-45" aria-hidden />
              </a>
            )}
          </aside>
          <div className="col-span-12 space-y-14 md:col-span-7 md:col-start-6">
            {project.caseStudy.map((block) => (
              <section key={block.heading}>
                <h3 className="font-serif text-3xl text-olive md:text-4xl">{block.heading}</h3>
                <p className="text-pretty mt-4 max-w-[62ch] text-lg leading-[1.7] text-olive/85">{block.body}</p>
              </section>
            ))}
          </div>
        </div>

        {project.slug === 'mapalz' && (
          <div className="mt-24 space-y-16">
            {MAPALZ_GALLERY.map((g, i) => (
              <figure key={g.src} className={`md:w-[78%] ${i % 2 ? 'md:ml-auto' : ''}`}>
                <img src={g.src} alt={g.caption} loading="lazy" className="w-full rounded-2xl shadow-[0_30px_60px_-30px_rgba(52,68,56,0.5)] ring-1 ring-black/5" />
                <figcaption className="mt-3 text-[15px] text-olive/70">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}

        <footer className="mt-28 border-t border-olive/15 pt-10">
          <p className="font-mono text-xs text-olive/60">next project</p>
          <button
            type="button"
            onClick={() => onNavigate(next.slug)}
            className="group mt-3 flex items-center gap-4 text-left font-serif text-5xl text-olive md:text-7xl"
          >
            {next.name}
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-olive transition-transform duration-300 group-hover:translate-x-2 md:h-16 md:w-16">
              <ArrowRight className="h-5 w-5 text-ivory md:h-6 md:w-6" aria-hidden />
            </span>
          </button>
        </footer>
      </article>
    </motion.div>
  )
}
