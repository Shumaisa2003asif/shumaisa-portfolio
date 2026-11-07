import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUp, Check, Copy, Mail } from 'lucide-react'
import { useRef, useState } from 'react'
import { profile } from '../data/content'
import { WordsPullUpMultiStyle } from './motion/WordsPullUpMultiStyle'

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-olive/25 px-4 text-[15px] text-olive transition-colors hover:border-olive"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      <span aria-live="polite">{copied ? 'Email copied' : 'Copy email'}</span>
    </button>
  )
}

export function Contact() {
  const reduce = useReducedMotion()
  const year = new Date().getFullYear()
  const photoRef = useRef<HTMLDivElement>(null)
  const photoIn = useInView(photoRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="contact" className="relative overflow-hidden bg-sand pt-28 md:pt-40">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply" />
      {/* slow-turning sun behind the portrait */}
      <motion.svg
        viewBox="0 0 200 200"
        aria-hidden
        className="pointer-events-none absolute -right-24 top-16 h-[420px] w-[420px] text-terracotta/60 md:right-[4%] md:top-24 md:h-[560px] md:w-[560px]"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2
          return (
            <path
              key={i}
              d={`M${100 + Math.cos(a) * 62} ${100 + Math.sin(a) * 62} L${100 + Math.cos(a) * (i % 2 ? 80 : 92)} ${100 + Math.sin(a) * (i % 2 ? 80 : 92)}`}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )
        })}
        <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </motion.svg>

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-12 gap-x-6 gap-y-16 px-5 md:px-10">
        <div className="col-span-12 lg:col-span-7">
          <WordsPullUpMultiStyle
            className="font-serif text-[12.5vw] leading-[0.92] tracking-[-0.01em] text-olive sm:text-[10vw] lg:text-[6.4rem]"
            segments={[{ text: 'Have an interesting idea?' }, { text: 'Let’s bring it to life.', className: 'italic' }]}
          />
          <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-olive/85">
            A product to build, a brand to grow, a collaboration, or just a good question. My inbox is open.
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="group mt-10 inline-block break-words font-serif text-[6.3vw] leading-tight text-olive underline decoration-olive/25 decoration-2 underline-offset-[10px] transition-colors hover:decoration-olive sm:text-4xl md:text-5xl"
          >
            {profile.email}
          </a>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent('Hello Shumaisa')}`}
              className="group inline-flex items-center gap-2 rounded-full bg-olive py-1.5 pl-5 pr-1.5 text-[15px] font-medium text-ivory transition-[gap] duration-300 hover:gap-3"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Email me
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ivory transition-transform duration-300 group-hover:scale-110">
                <ArrowRight className="h-4 w-4 text-olive" aria-hidden />
              </span>
            </a>
            <CopyEmail />
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-1 rounded-full border border-olive/25 px-4 text-[15px] text-olive transition-colors hover:border-olive"
            >
              LinkedIn
              <ArrowRight className="h-4 w-4 -rotate-45" aria-hidden />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-1 rounded-full border border-olive/25 px-4 text-[15px] text-olive transition-colors hover:border-olive"
            >
              GitHub
              <ArrowRight className="h-4 w-4 -rotate-45" aria-hidden />
            </a>
          </div>
        </div>

        <div className="relative col-span-12 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-9">
          {/* trigger on the wrapper: a fully clipped element never counts as "in view" */}
          <div ref={photoRef} className="relative">
            <motion.div
              initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0% round 1.5rem)' }}
              animate={photoIn ? { clipPath: 'inset(0% 0% 0% 0% round 1.5rem)' } : undefined}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* The portrait is shown exactly as supplied: no crop, filter or retouching. */}
              <img
                src={profile.photo}
                alt="Shumaisa Asif"
                width={1122}
                height={1402}
                decoding="async"
                className="block h-auto w-full rounded-3xl"
              />
            </motion.div>
          </div>
          <p className="absolute -left-4 -top-14 flex items-end gap-1 font-hand text-3xl text-clay sm:-left-16 lg:-left-24">
            say salaam!
            <svg viewBox="0 0 70 50" className="h-10 w-14" aria-hidden>
              <path d="M4 10 C30 4 54 14 60 40 M60 40 L50 32 M60 40 L64 28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </p>
        </div>
      </div>

      <footer className="relative mx-auto mt-28 flex max-w-[1320px] flex-col gap-4 border-t border-olive/20 px-5 py-8 text-sm text-olive/75 md:mt-40 md:flex-row md:items-center md:justify-between md:px-10">
        <p>© {year} {profile.name}. Designed and built in {profile.location.split(',')[0]}.</p>
        <a href="#top" className="inline-flex items-center gap-2 self-start text-olive hover:underline md:self-auto">
          Back to top
          <ArrowUp className="h-4 w-4" aria-hidden />
        </a>
      </footer>
    </section>
  )
}
