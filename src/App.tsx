import { useEffect } from 'react'
import { About } from './components/About'
import { Beyond } from './components/Beyond'
import { Contact } from './components/Contact'
import { Cursor } from './components/Cursor'
import { Explore } from './components/Explore'
import { Hero } from './components/hero/Hero'
import { Journey } from './components/Journey'
import { Now } from './components/Now'
import { Work } from './components/work/Work'

export default function App() {
  // Sections render after load, so honour a #section deep link once they exist.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id && !id.startsWith('/')) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior }))
    }
  }, [])

  return (
    <>
      <a
        href="#about"
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-full bg-olive px-4 py-2 text-sm text-ivory focus:translate-y-0"
      >
        Skip to content
      </a>
      <Cursor />
      <main>
        <Hero />
        <About />
        <Now />
        <Work />
        <Journey />
        <Explore />
        <Beyond />
        <Contact />
      </main>
    </>
  )
}
