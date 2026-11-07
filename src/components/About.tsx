import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/content'
import { ScrollRevealText } from './motion/ScrollRevealText'
import { WordsPullUp } from './motion/WordsPullUp'
import { WordsPullUpMultiStyle } from './motion/WordsPullUpMultiStyle'

const BIO =
  'I study computer science and spend most days somewhere between a design file and a terminal: sketching how something should feel, then building it until it does. I like products that are honest about what they do, interfaces that never make people think twice, and small teams that ship. Lately that means AI tools that save people real time, commerce platforms for businesses that have outgrown their spreadsheets, and telling the story of all of it well enough that people want to try it.'

export function About() {
  const reduce = useReducedMotion()
  return (
    <section id="about" className="relative overflow-hidden bg-ivory pb-28 pt-24 md:pb-40 md:pt-36">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply" />
      <div className="relative mx-auto grid max-w-[1320px] grid-cols-12 gap-x-6 gap-y-14 px-5 md:px-10">
        <div className="col-span-12 lg:col-span-9">
          <WordsPullUp
            text="A little about the mind behind the pixels."
            className="text-balance font-serif text-[13vw] leading-[0.92] tracking-[-0.02em] text-olive sm:text-[10vw] lg:text-[6.6rem]"
          />
        </div>
        <motion.p
          className="relative col-span-12 -mt-6 flex items-start gap-2 font-hand text-2xl text-clay lg:col-span-3 lg:mt-8 lg:-rotate-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <svg viewBox="0 0 60 60" className="mt-1 h-10 w-10 shrink-0 -scale-x-100 lg:scale-x-100" aria-hidden>
            <motion.path
              d="M8 52 C10 30 22 14 44 10 M44 10 L34 6 M44 10 L38 19"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.1 }}
            />
          </svg>
          that&rsquo;s me up there, on the cliff with the laptop
        </motion.p>

        {/* collage column */}
        <div className="relative col-span-12 min-h-[340px] md:col-span-5 lg:col-span-4">
          <motion.div
            aria-hidden
            className="absolute -left-10 top-6 h-64 w-64 bg-sage/35 md:h-80 md:w-80"
            style={{ borderRadius: '58% 42% 63% 37% / 45% 55% 45% 55%' }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
          <div
            aria-hidden
            className="absolute bottom-0 right-4 h-28 w-28 bg-lavender/50"
            style={{ borderRadius: '40% 60% 55% 45% / 55% 40% 60% 45%' }}
          />
          <figure className="relative z-10 ml-4 mt-12 w-[min(100%,320px)] rotate-[-2.5deg] bg-[#FBF8F1] p-6 pb-7 shadow-[0_18px_40px_-24px_rgba(52,68,56,0.55)] md:ml-8">
            <span
              aria-hidden
              className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2 bg-lavender/70"
            />
            <figcaption className="font-hand text-2xl text-clay">field notes</figcaption>
            <dl className="mt-4 space-y-3 text-[15px] leading-snug">
              <div>
                <dt className="font-mono text-[11px] text-olive/60">based in</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] text-olive/60">studying</dt>
                <dd>BS Computer Science, COMSATS University Islamabad, 2023 to 2027</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] text-olive/60">right now</dt>
                <dd>System Developer at TAMx, CMO at SaleForgers, founding member of Mapalz</dd>
              </div>
            </dl>
          </figure>
          {/* pressed leaf, a nod to the plant disease project */}
          <svg viewBox="0 0 120 160" className="absolute -bottom-10 left-[56%] h-36 w-28 rotate-[24deg] md:left-[62%]" aria-hidden>
            <path d="M60 154 C58 120 60 80 62 8" stroke="#56684F" strokeWidth="2" fill="none" />
            <path d="M62 14 C96 34 108 80 64 140 C22 96 26 40 62 14 Z" fill="#7F927A" opacity="0.85" />
            <path d="M62 30 L80 50 M61 56 L86 76 M60 82 L82 102 M61 44 L42 62 M60 72 L38 90 M60 100 L44 116" stroke="#56684F" strokeWidth="1.4" fill="none" opacity="0.7" />
          </svg>
        </div>

        {/* story column */}
        <div className="col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6">
          <WordsPullUpMultiStyle
            as="p"
            className="text-[2rem] leading-[1.02] text-olive sm:text-4xl md:text-[2.6rem] lg:text-5xl"
            segments={[
              { text: 'I’m Shumaisa,', className: 'font-medium tracking-[-0.03em]' },
              { text: 'a computer scientist who cares about the story as much as the system.', className: 'font-serif italic' },
              { text: 'I build at TAMx, lead marketing at SaleForgers and help grow Mapalz.', className: 'font-medium tracking-[-0.03em]' },
            ]}
          />
          <ScrollRevealText text={BIO} className="text-pretty mt-10 max-w-[62ch] text-lg leading-[1.6] text-olive md:mt-14 md:text-xl" />
          <p className="mt-8 font-hand text-2xl text-moss">
            currently learning how brands and code can speak the same language
          </p>
        </div>
      </div>
    </section>
  )
}
