import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { roles } from '../data/content'

/** The three roles, side by side, with each organisation's own mark. */
export function Now() {
  return (
    <section aria-labelledby="now-heading" className="relative bg-ivory pb-10 md:pb-16">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <h2 id="now-heading" className="font-hand text-3xl text-clay">where you&rsquo;ll find me these days</h2>
        <ul className="mt-6 grid border-y border-olive/15 md:grid-cols-3">
          {roles.map((r, i) => (
            <motion.li
              key={r.org}
              className={`flex flex-col py-8 md:px-8 md:py-10 ${i > 0 ? 'border-t border-olive/15 md:border-l md:border-t-0' : 'md:pl-0'}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
            >
              <div className="flex h-12 items-center">
                <img src={r.logo} alt={`${r.org} logo`} className="h-full w-auto max-w-[150px] object-contain object-left" loading="lazy" />
              </div>
              <p className="mt-6 font-serif text-3xl leading-tight text-olive">{r.title}</p>
              <p className="mt-1 text-[15px] text-olive/70">
                {r.org}, {r.period.toLowerCase()}
              </p>
              <p className="text-pretty mt-4 flex-1 text-[16px] leading-relaxed text-olive/80">{r.summary}</p>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1 self-start text-[15px] text-olive underline decoration-olive/30 underline-offset-4 hover:decoration-olive"
              >
                {r.url.replace('https://', '')}
                <ArrowRight className="h-4 w-4 -rotate-45" aria-hidden />
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
