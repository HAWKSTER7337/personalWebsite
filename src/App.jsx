import './App.css'
import { useEffect, useState, useCallback } from 'react'

function App() {
  const [sortingAlgorithm, setSortingAlgorithm] = useState('merge')
  const [isSorting, setIsSorting] = useState(false)

  // Sorting algorithms implementation
  const letters = document.querySelectorAll('.name-letter')
  const correctOrder = [
    'A',
    'l',
    'e',
    'x',
    ' ',
    'H',
    'a',
    'w',
    'k',
    'i',
    'n',
    's',
  ]

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const updateVisualPositions = async (currentOrder) => {
    letters.forEach((letter) => {
      const letterValue = letter.dataset.letter
      const currentPosition = currentOrder.indexOf(letterValue)
      if (currentPosition !== -1) {
        letter.style.order = currentPosition
      }
    })
  }

  const highlightLetters = (letter1, letter2) => {
    letters.forEach((letter) => {
      letter.classList.remove('comparing')
      if (
        letter.dataset.letter === letter1 ||
        letter.dataset.letter === letter2
      ) {
        letter.classList.add('comparing')
      }
    })
  }

  const clearHighlights = () => {
    letters.forEach((letter) => {
      letter.classList.remove('comparing', 'sorting')
    })
  }

  // Merge Sort (O(n log n))
  const mergeSort = async (arr) => {
    if (arr.length <= 1) return arr

    const mid = Math.floor(arr.length / 2)
    const left = arr.slice(0, mid)
    const right = arr.slice(mid)

    const sortedLeft = await mergeSort(left)
    const sortedRight = await mergeSort(right)

    return await merge(sortedLeft, sortedRight)
  }

  const merge = async (left, right) => {
    const result = []
    let leftIndex = 0
    let rightIndex = 0

    while (leftIndex < left.length && rightIndex < right.length) {
      const leftLetter = left[leftIndex]
      const rightLetter = right[rightIndex]

      highlightLetters(leftLetter, rightLetter)
      await new Promise((resolve) => setTimeout(resolve, 200))

      const leftCorrectPos = correctOrder.indexOf(leftLetter)
      const rightCorrectPos = correctOrder.indexOf(rightLetter)

      if (leftCorrectPos <= rightCorrectPos) {
        result.push(leftLetter)
        leftIndex++
      } else {
        result.push(rightLetter)
        rightIndex++
      }

      await updateVisualPositions(result)
      await new Promise((resolve) => setTimeout(resolve, 100))
      clearHighlights()
    }

    while (leftIndex < left.length) {
      result.push(left[leftIndex])
      leftIndex++
      await updateVisualPositions(result)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    while (rightIndex < right.length) {
      result.push(right[rightIndex])
      rightIndex++
      await updateVisualPositions(result)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return result
  }

  // Bubble Sort (O(n²))
  const bubbleSort = async (arr) => {
    const n = arr.length
    const sorted = [...arr]

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const leftLetter = sorted[j]
        const rightLetter = sorted[j + 1]

        highlightLetters(leftLetter, rightLetter)
        await new Promise((resolve) => setTimeout(resolve, 300))

        const leftCorrectPos = correctOrder.indexOf(leftLetter)
        const rightCorrectPos = correctOrder.indexOf(rightLetter)

        if (leftCorrectPos > rightCorrectPos) {
          // Swap
          ;[sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]]
        }

        await updateVisualPositions(sorted)
        await new Promise((resolve) => setTimeout(resolve, 200))
        clearHighlights()
      }
    }

    return sorted
  }

  // Selection Sort (O(n²)) - I'll use this instead of binary search as it's a proper sorting algorithm
  const selectionSort = async (arr) => {
    const sorted = [...arr]

    for (let i = 0; i < sorted.length; i++) {
      let minIndex = i

      for (let j = i + 1; j < sorted.length; j++) {
        const currentLetter = sorted[j]
        const minLetter = sorted[minIndex]

        highlightLetters(currentLetter, minLetter)
        await new Promise((resolve) => setTimeout(resolve, 200))

        const currentCorrectPos = correctOrder.indexOf(currentLetter)
        const minCorrectPos = correctOrder.indexOf(minLetter)

        if (currentCorrectPos < minCorrectPos) {
          minIndex = j
        }

        await updateVisualPositions(sorted)
        await new Promise((resolve) => setTimeout(resolve, 100))
        clearHighlights()
      }

      if (minIndex !== i) {
        ;[sorted[i], sorted[minIndex]] = [sorted[minIndex], sorted[i]]
        await updateVisualPositions(sorted)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
    }

    return sorted
  }

  const startSorting = async () => {
    if (isSorting) return

    setIsSorting(true)
    clearHighlights()

    // Initial shuffle
    const shuffledOrder = shuffleArray(correctOrder)
    await updateVisualPositions(shuffledOrder)
    await new Promise((resolve) => setTimeout(resolve, 500))

    switch (sortingAlgorithm) {
      case 'merge':
        await mergeSort(shuffledOrder)
        break
      case 'bubble':
        await bubbleSort(shuffledOrder)
        break
      case 'selection':
        await selectionSort(shuffledOrder)
        break
      default:
        await mergeSort(shuffledOrder)
    }

    // Celebration effect
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('sorting')
        setTimeout(() => {
          letter.classList.remove('sorting')
        }, 500)
      }, index * 100)
    })

    setIsSorting(false)
  }

  useEffect(() => {
    // Auto-start with merge sort (fastest) on page load
    const autoStart = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (!isSorting) {
        startSorting()
      }
    }
    autoStart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="code-rain"></div>
          <div className="michigan-shape"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">MSU Spartan</span>
            <span className="badge-location">Shelby Township, MI</span>
          </div>
          <h1 className="hero-title">
            <div className="name-container">
              <span className="name-letter" data-letter="A">
                A
              </span>
              <span className="name-letter" data-letter="l">
                l
              </span>
              <span className="name-letter" data-letter="e">
                e
              </span>
              <span className="name-letter" data-letter="x">
                x
              </span>
              <span className="name-letter" data-letter=" ">
                {' '}
              </span>
              <span className="name-letter" data-letter="H">
                H
              </span>
              <span className="name-letter" data-letter="a">
                a
              </span>
              <span className="name-letter" data-letter="w">
                w
              </span>
              <span className="name-letter" data-letter="k">
                k
              </span>
              <span className="name-letter" data-letter="i">
                i
              </span>
              <span className="name-letter" data-letter="n">
                n
              </span>
              <span className="name-letter" data-letter="s">
                s
              </span>
            </div>
            <span className="title">Junior Software Developer</span>
          </h1>
          <div className="hero-subtitle">
            <span className="typing-animation">Building what interests me</span>
          </div>
          <div className="hero-tags">
            <span className="hero-tag">Architecture</span>
            <span className="hero-tag">DevOps</span>
            <span className="hero-tag">Automation</span>
          </div>

          <div className="sorting-controls">
            <h3>Choose Sorting Algorithm:</h3>
            <div className="algorithm-buttons">
              <button
                className={`algorithm-btn ${sortingAlgorithm === 'merge' ? 'active' : ''}`}
                onClick={() => setSortingAlgorithm('merge')}
                disabled={isSorting}
              >
                Merge Sort (O(n log n))
              </button>
              <button
                className={`algorithm-btn ${sortingAlgorithm === 'bubble' ? 'active' : ''}`}
                onClick={() => setSortingAlgorithm('bubble')}
                disabled={isSorting}
              >
                Bubble Sort (O(n²))
              </button>
              <button
                className={`algorithm-btn ${sortingAlgorithm === 'selection' ? 'active' : ''}`}
                onClick={() => setSortingAlgorithm('selection')}
                disabled={isSorting}
              >
                Selection Sort (O(n²))
              </button>
            </div>
            <button
              className="start-sort-btn"
              onClick={() => startSorting()}
              disabled={isSorting}
            >
              {isSorting ? 'Sorting...' : 'Start Sort'}
            </button>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="about-header">
            <h2 className="section-title">My Story</h2>
            <div className="story-timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>GameShark Discovery</h4>
                  <p>First taste of code modification</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>MSU Spartan</h4>
                  <p>Computer Science Education</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Full-Stack Developer</h4>
                  <p>Building real-world applications</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-content">
            <div className="story-card">
              <div className="story-icon"></div>
              <div className="story-text">
                <h3>From GameShark to Code</h3>
                <p>
                  I&apos;m a proud MSU Spartan, born and raised in Shelby
                  Township, Michigan. My passion for programming started early,
                  sparked by discovering a GameShark for the Game Boy SP. I was
                  fascinated by how altering a game&apos;s code could completely
                  change how it behaved, and that curiosity quickly grew into a
                  love for software development.
                </p>
              </div>
            </div>

            <div className="story-card">
              <div className="story-icon"></div>
              <div className="story-text">
                <h3>Architecture & Systems</h3>
                <p>
                  Today, I enjoy building systems of all kinds, but I&apos;m
                  especially drawn to the architecture side of things like
                  planning for scalability, maintainability, and long-term
                  success. I also have a strong interest in creating smooth,
                  efficient workflows.
                </p>
              </div>
            </div>

            <div className="story-card">
              <div className="story-icon"></div>
              <div className="story-text">
                <h3>DevOps & Automation</h3>
                <p>
                  Whether it&apos;s using Dev Containers, automation tools, or
                  setting up consistent development environments, I love finding
                  ways to reduce friction and save time down the road. For me,
                  good tooling is just as important as good code.
                </p>
              </div>
            </div>
          </div>

          <div className="skills-section">
            <h3 className="skills-title">My Tech Arsenal</h3>
            <div className="skills-categories">
              <div className="skill-category">
                <h4>Frontend</h4>
                <div className="skills-grid">
                  <span className="skill-tag">JavaScript</span>
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">Angular</span>
                  <span className="skill-tag">TypeScript</span>
                </div>
              </div>
              <div className="skill-category">
                <h4>Backend</h4>
                <div className="skills-grid">
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag">.NET</span>
                  <span className="skill-tag">ASP.NET</span>
                </div>
              </div>
              <div className="skill-category">
                <h4>Mobile & Cloud</h4>
                <div className="skills-grid">
                  <span className="skill-tag">.NET MAUI</span>
                  <span className="skill-tag">Docker</span>
                  <span className="skill-tag">AWS</span>
                  <span className="skill-tag">Azure</span>
                </div>
              </div>
              <div className="skill-category">
                <h4>Data & Tools</h4>
                <div className="skills-grid">
                  <span className="skill-tag">SQL</span>
                  <span className="skill-tag">REST</span>
                  <span className="skill-tag">Git</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects">
        <div className="container">
          <div className="projects-header">
            <h2 className="section-title">Featured Projects</h2>
            <p className="projects-subtitle">Real applications, real impact</p>
          </div>
          <div className="projects-showcase">
            <div className="project-card featured">
              <div className="project-header">
                <div className="project-status">
                  <span className="status-dot"></span>
                  <span className="status-text">Live</span>
                </div>
                <div className="project-location">
                  <span className="location-icon"></span>
                  <span>East Lansing, MI</span>
                </div>
              </div>
              <div className="project-image">
                <div className="project-visual">
                  <div className="lottery-animation">
                    <div className="lottery-ball">3</div>
                    <div className="lottery-ball">4</div>
                    <div className="lottery-ball">7</div>
                    <div className="lottery-ball">9</div>
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">Project Daisy</h3>
                <p className="project-description">
                  A full simulation of the daily 3 and 4 lottery system. This
                  full-stack application runs on iOS and Android, providing a
                  complete lottery experience for users. Currently live and
                  serving customers in East Lansing.
                </p>
                <div className="project-highlights">
                  <div className="highlight">
                    <span className="highlight-icon"></span>
                    <span>Cross-platform mobile app</span>
                  </div>
                  <div className="highlight">
                    <span className="highlight-icon"></span>
                    <span>Live production system</span>
                  </div>
                  <div className="highlight">
                    <span className="highlight-icon"></span>
                    <span>Real-time lottery simulation</span>
                  </div>
                </div>
                <div className="project-tech">
                  <span className="tech-tag">.NET MAUI</span>
                  <span className="tech-tag">PostgreSQL</span>
                  <span className="tech-tag">ASP.NET</span>
                  <span className="tech-tag">Selenium</span>
                </div>
                <div className="project-links">
                  <a href="#" className="project-link primary">
                    <span>View Project</span>
                    <span className="link-arrow">→</span>
                  </a>
                  <a href="#" className="project-link secondary">
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            <div className="project-placeholder-card">
              <div className="placeholder-content">
                <div className="placeholder-icon"></div>
                <h3>More Projects Coming Soon</h3>
                <p>
                  I&apos;m always working on new projects. Check back soon to
                  see what I&apos;m building next!
                </p>
                <div className="placeholder-tags">
                  <span className="placeholder-tag">In Development</span>
                  <span className="placeholder-tag">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <div className="contact-background">
          <div className="contact-pattern"></div>
        </div>
        <div className="container">
          <div className="contact-content">
            <div className="contact-header">
              <h2 className="section-title">
                Let&apos;s Build Something Amazing
              </h2>
              <p className="contact-text">
                I&apos;m always excited to be apart of the next big thing.
                Whether you&apos;re looking for a developer, have a cool project
                idea, or just want to chat about tech - let&apos;s connect!
              </p>
            </div>

            <div className="contact-methods">
              <div className="contact-card">
                <div className="contact-icon"></div>
                <h3>Email Me</h3>
                <p>For business inquiries and collaborations</p>
                <a href="mailto:ahawk2255@gmail.com" className="contact-link">
                  ahawk2255@gmail.com
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon"></div>
                <h3>LinkedIn</h3>
                <p>Professional networking and opportunities</p>
                <a
                  href="https://www.linkedin.com/in/alex-hawkins-500156222/"
                  className="contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Connect with me
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon"></div>
                <h3>GitHub</h3>
                <p>Check out my code and projects</p>
                <a
                  href="https://github.com/HAWKSTER7337"
                  className="contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View my work
                </a>
              </div>
            </div>

            <div className="contact-footer">
              <p className="contact-location">
                <span className="location-icon"></span>
                Based in Shelby Township, Michigan
              </p>
              <p className="contact-availability">
                <span className="availability-dot"></span>
                Available for new opportunities
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
