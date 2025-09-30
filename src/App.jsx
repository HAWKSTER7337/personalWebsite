import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [sortingAlgorithm, setSortingAlgorithm] = useState('merge')
  const [isSorting, setIsSorting] = useState(false)
  const [ticketNumbers, setTicketNumbers] = useState(['1', '4', '5'])
  const [isWinning, setIsWinning] = useState(false)

  // Lottery animation logic
  useEffect(() => {
    const lotteryNumbers = [
      ['1', '4', '5'], // 145 - no match
      ['9', '8', '7'], // 987 - no match
      ['8', '4', '5'], // 845 - match!
    ]

    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % lotteryNumbers.length
      setTicketNumbers(lotteryNumbers[currentIndex])
      setIsWinning(currentIndex === 2) // 845 is at index 2
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval)
  }, [])

  // Sorting algorithms implementation
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
    const currentLetters = document.querySelectorAll('.name-letter')
    currentLetters.forEach((letter) => {
      const letterValue = letter.dataset.letter
      const currentPosition = currentOrder.indexOf(letterValue)
      if (currentPosition !== -1) {
        letter.style.order = currentPosition
      }
    })
  }

  const highlightLetters = (letter1, letter2) => {
    const currentLetters = document.querySelectorAll('.name-letter')
    currentLetters.forEach((letter) => {
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
    const currentLetters = document.querySelectorAll('.name-letter')
    currentLetters.forEach((letter) => {
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

  // Quick Sort (O(n log n) average, O(n²) worst case)
  const quickSort = async (arr, low = 0, high = arr.length - 1) => {
    if (low < high) {
      const pivotIndex = await partition(arr, low, high)
      await quickSort(arr, low, pivotIndex - 1)
      await quickSort(arr, pivotIndex + 1, high)
    }
    return arr
  }

  const partition = async (arr, low, high) => {
    const pivot = arr[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      const currentLetter = arr[j]
      const pivotLetter = pivot

      highlightLetters(currentLetter, pivotLetter)
      await new Promise((resolve) => setTimeout(resolve, 250))

      const currentCorrectPos = correctOrder.indexOf(currentLetter)
      const pivotCorrectPos = correctOrder.indexOf(pivotLetter)

      if (currentCorrectPos <= pivotCorrectPos) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        await updateVisualPositions(arr)
        await new Promise((resolve) => setTimeout(resolve, 150))
      }

      clearHighlights()
    }

    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    await updateVisualPositions(arr)
    await new Promise((resolve) => setTimeout(resolve, 200))

    return i + 1
  }

  // Bogo Sort (O(n!) - extremely inefficient but fun!)
  const bogoSort = async (arr) => {
    const sorted = [...arr]
    let attempts = 0
    const magicAttempts = 10 // Always succeed after 10 attempts for demo purposes

    // Note: isSorted function is kept for potential future use
    // const isSorted = (array) => {
    //   for (let i = 0; i < array.length - 1; i++) {
    //     const currentPos = correctOrder.indexOf(array[i])
    //     const nextPos = correctOrder.indexOf(array[i + 1])
    //     if (currentPos > nextPos) {
    //       return false
    //     }
    //   }
    //   return true
    // }

    const shuffle = (array) => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    // Calculate the actual odds for 12 letters (including space)
    const factorial = (n) => {
      if (n <= 1) return 1
      return n * factorial(n - 1)
    }
    const totalPermutations = factorial(12) // 12! = 479,001,600

    while (attempts < magicAttempts) {
      attempts++

      // Show the current attempt
      const shuffled = shuffle(sorted)

      // Highlight all letters during shuffle
      const currentLetters = document.querySelectorAll('.name-letter')
      currentLetters.forEach((letter) => {
        letter.classList.add('comparing')
      })

      await new Promise((resolve) => setTimeout(resolve, 100))

      // Update positions
      for (let i = 0; i < shuffled.length; i++) {
        sorted[i] = shuffled[i]
      }

      await updateVisualPositions(sorted)
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Clear highlights
      clearHighlights()

      // Add some excitement with random highlighting
      if (attempts % 3 === 0) {
        const randomLetters = sorted.slice(0, 3)
        randomLetters.forEach((letter, index) => {
          setTimeout(() => {
            const letterElement = Array.from(currentLetters).find(
              (l) => l.dataset.letter === letter
            )
            if (letterElement) {
              letterElement.classList.add('sorting')
              setTimeout(() => {
                letterElement.classList.remove('sorting')
              }, 300)
            }
          }, index * 100)
        })
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    // After 10 attempts, "magically" sort it correctly
    for (let i = 0; i < correctOrder.length; i++) {
      sorted[i] = correctOrder[i]
    }
    await updateVisualPositions(sorted)

    // Show the odds message
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create and show the odds message
    const oddsMessage = document.createElement('div')
    oddsMessage.className = 'odds-message'
    oddsMessage.innerHTML = `
      <p>Wow! Sorted on the 10th try — odds of that are 1 in ${totalPermutations.toLocaleString()}.</p>
      <p>Technically, that makes it the fastest sort we've seen so far.</p>
      <p>Which means it's ready for production. Obviously.</p>

    `

    const heroContent = document.querySelector('.hero-content')
    heroContent.appendChild(oddsMessage)

    // Remove the message after 5 seconds
    setTimeout(() => {
      if (oddsMessage.parentNode) {
        oddsMessage.parentNode.removeChild(oddsMessage)
      }
    }, 5000)

    return sorted
  }

  const startSorting = async () => {
    if (isSorting) return

    // Get fresh reference to letters in case DOM has changed
    const currentLetters = document.querySelectorAll('.name-letter')
    if (currentLetters.length === 0) {
      console.log('No letter elements found, cannot start sorting')
      return
    }

    setIsSorting(true)
    clearHighlights()

    // Always start with a fresh shuffle for manual sorting
    const shuffledOrder = shuffleArray(correctOrder)
    await updateVisualPositions(shuffledOrder)
    await new Promise((resolve) => setTimeout(resolve, 500))

    await performSorting(shuffledOrder, currentLetters)
    setIsSorting(false)
  }

  const performSorting = async (orderToSort, letters) => {
    switch (sortingAlgorithm) {
      case 'merge':
        await mergeSort(orderToSort)
        break
      case 'bubble':
        await bubbleSort(orderToSort)
        break
      case 'selection':
        await selectionSort(orderToSort)
        break
      case 'quick':
        await quickSort(orderToSort)
        break
      case 'bogo':
        await bogoSort(orderToSort)
        break
      default:
        await mergeSort(orderToSort)
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
  }

  useEffect(() => {
    // Auto-start with merge sort (fastest) on page load
    const autoStart = async () => {
      // Wait for DOM to be ready and give extra time for elements to render
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if elements exist before trying to sort
      const letters = document.querySelectorAll('.name-letter')
      if (letters.length > 0 && !isSorting) {
        console.log('Auto-starting merge sort...')

        // First, shuffle the letters to show unsorted state
        const shuffledOrder = shuffleArray(correctOrder)
        await updateVisualPositions(shuffledOrder)

        // Wait a moment to show the unsorted state
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Then start the sorting animation (use current shuffled state)
        const currentLetters = document.querySelectorAll('.name-letter')
        setIsSorting(true)
        clearHighlights()
        await performSorting(shuffledOrder, currentLetters)
        setIsSorting(false)
      } else {
        console.log('Elements not ready or already sorting, retrying...')
        // Retry after another delay
        setTimeout(() => {
          if (!isSorting) {
            startSorting()
          }
        }, 1000)
      }
    }
    autoStart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="code-rain">
            <div className="binary-stream-1"></div>
            <div className="binary-stream-2"></div>
            <div className="binary-stream-3"></div>
          </div>
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
              <button
                className={`algorithm-btn ${sortingAlgorithm === 'quick' ? 'active' : ''}`}
                onClick={() => setSortingAlgorithm('quick')}
                disabled={isSorting}
              >
                Quick Sort (O(n log n))
              </button>
              <button
                className={`algorithm-btn ${sortingAlgorithm === 'bogo' ? 'active' : ''}`}
                onClick={() => setSortingAlgorithm('bogo')}
                disabled={isSorting}
                data-algorithm="bogo"
              >
                Bogo Sort (O(n!))
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
                    <div className="winning-section">
                      <div className="winning-label">Winning</div>
                      <div className="winning-numbers">
                        <div className="lottery-ball winning-ball">8</div>
                        <div className="lottery-ball winning-ball">4</div>
                        <div className="lottery-ball winning-ball">5</div>
                      </div>
                    </div>
                    <div className="vs-divider">VS</div>
                    <div className="ticket-section">
                      <div className="ticket-label">Your Ticket</div>
                      <div className="ticket-numbers">
                        <div
                          className={`lottery-ball ticket-ball ${isWinning ? 'winning' : ''}`}
                        >
                          {ticketNumbers[0]}
                        </div>
                        <div
                          className={`lottery-ball ticket-ball ${isWinning ? 'winning' : ''}`}
                        >
                          {ticketNumbers[1]}
                        </div>
                        <div
                          className={`lottery-ball ticket-ball ${isWinning ? 'winning' : ''}`}
                        >
                          {ticketNumbers[2]}
                        </div>
                      </div>
                    </div>
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
                  <a
                    href="https://github.com/HAWKSTER7337/ProjectDaisyUI"
                    className="project-link primary"
                  >
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
