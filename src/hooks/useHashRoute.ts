import { useEffect, useState } from 'react'

const read = () => {
  const m = window.location.hash.match(/^#\/work\/([\w-]+)/)
  return m ? m[1] : null
}

let openedFromPage = false

/** Case studies live at #/work/<slug> so they can be shared, and the back button closes them. */
export function useCaseStudyRoute() {
  const [slug, setSlug] = useState<string | null>(read)

  useEffect(() => {
    const onHash = () => setSlug(read())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const open = (s: string) => {
    openedFromPage = true
    window.location.hash = `/work/${s}`
  }

  /** Switch case study in place, so Back still returns to the page. */
  const navigate = (s: string) => {
    window.location.replace(`#/work/${s}`)
  }

  const close = () => {
    if (openedFromPage) {
      openedFromPage = false
      window.history.back()
    } else {
      window.history.replaceState(null, '', `${window.location.pathname}#work`)
      setSlug(null)
    }
  }

  return { slug, open, navigate, close }
}
