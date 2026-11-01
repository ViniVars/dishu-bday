import { useEffect, useRef, useState } from 'react';
import './App.css';

const starterPhotos = [
  {
    // src: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=85',
    // alt: 'A beautiful birthday cake with candles',
    caption: 'The beginning of something beautiful',
    date: 'CHAPTER 01 · ALWAYS SPECIAL',
    title: 'My Best Enemy Was Born ✨',
    story: 'The day you arrived and started stealing Mom’s love, officially turning me into a jealous little criminal. My villain origin story, basically. 😭😭',
  },
  {
    // src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85',
    // alt: 'Colorful birthday decorations',
    caption: 'The magic behind us growing up',
    date: 'CHAPTER 02 · LITTLE MOMENTS',
    title: 'Crime 1.....n',
    story: 'Was committing crimes just to get rid of this little F-ing brat. What the actual F was I thinking? 🥹💀',
  },
  {
    // src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85',
    // alt: 'Friends celebrating together',
    caption: 'Can\'t you just be a NPC for god\'s sake??',
    date: 'CHAPTER 03 · MY PEOPLE - YOUR PEOPLE (WTFF.....)',
    title: 'Go Get your own friends BITCHHH.',
    story: 'Started with Mom’s love, then hijacked my friends too… Bro, get your OWN F-ing friends for a changeuhhhh!! 😂😭',
  },
  {
    // src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85',
    // alt: 'A beautifully decorated celebration table',
    caption: 'Enduku ivvani manaki?',
    date: 'CHAPTER 04 · CHARACTER DEVELOPMENT ARC',
    title: 'My Side Character',
    story: 'Somewhere along the way, you went from being that annoying little brat to becoming MY PEOPLE. WHY? HOW? WHEN? ENDUKU ASALU? WHO APPROVED THIS CHARACTER DEVELOPMENT? 😭😂',
  },
  {
    // src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=85',
    // alt: 'Friends enjoying a celebration',
    caption: 'Invasion continues...',
    date: 'CHAPTER 05 · PRIVACY INVASION',
    title: 'My Go-To.',
    story: 'And suddenly, this so-called "Bitch" knows EVERYTHING about my life and has somehow become a permanent consultant in all my life decisions. Thankfully.❤️❤️'
  },
  {
    src: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1000&q=85',
    alt: 'Friends making happy memories',
    caption: 'And this is only the beginning',
    date: 'CHAPTER 06 · THE ENTREPRENEUR',
    title: 'Your best chapter is next',
    story: 'Whatever life throws at you, just remember you\'ve always got me… preferably as your unpaid employee when your startup takes off. 😂 Keep being unapologetically YOU. This is just the beginning, and the best is yet to come. ❤️❤️❤️',
  },
];

const melody = [
  523.25, 659.25, 783.99, 659.25,
  587.33, 698.46, 783.99, 698.46,
  523.25, 659.25, 783.99, 1046.5,
  783.99, 698.46, 659.25, 523.25,
];

const noteLength = 0.28;

function App() {
  const [photos, setPhotos] = useState(starterPhotos);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [musicError, setMusicError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const audioContextRef = useRef(null);
  const musicTimerRef = useRef(null);
  const confettiTimerRef = useRef(null);
  const photoUrlsRef = useRef([]);

  useEffect(() => {
    return () => {
      window.clearTimeout(musicTimerRef.current);
      window.clearTimeout(confettiTimerRef.current);

      photoUrlsRef.current.forEach((url) =>
        URL.revokeObjectURL(url)
      );

      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
  const handleButtonClick = (event) => {
    if (!(event.target instanceof Element)) return;

    const heart = document.createElement("span");
    heart.className = "tap-heart";

    heart.style.left = `${event.clientX}px`;
    heart.style.top = `${event.clientY}px`;

    document.body.appendChild(heart);

    heart.addEventListener(
      "animationend",
      () => heart.remove(),
      { once: true }
    );
  };

  document.addEventListener("click", handleButtonClick);

  return () => {
    document.removeEventListener("click", handleButtonClick);
  };
}, []);

  const scheduleMelody = (context) => {
    const firstNote = context.currentTime + 0.05;

    melody.forEach((frequency, index) => {
      const start = firstNote + index * noteLength;
      const oscillator = context.createOscillator();
      const volume = context.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;

      volume.gain.setValueAtTime(0.0001, start);
      volume.gain.exponentialRampToValueAtTime(
        0.11,
        start + 0.025
      );
      volume.gain.exponentialRampToValueAtTime(
        0.0001,
        start + noteLength * 0.88
      );

      oscillator.connect(volume);
      volume.connect(context.destination);

      oscillator.start(start);
      oscillator.stop(start + noteLength);
    });

    musicTimerRef.current = window.setTimeout(
      () => scheduleMelody(context),
      melody.length * noteLength * 1000
    );
  };

  const toggleMusic = async () => {
    if (isPlaying) {
      window.clearTimeout(musicTimerRef.current);
      musicTimerRef.current = null;

      await audioContextRef.current?.close();
      audioContextRef.current = null;

      setIsPlaying(false);
      return;
    }

    if (!window.AudioContext) {
      setMusicError('Your browser does not support background music.');
      return;
    }

    let context;

    try {
      context = new window.AudioContext();
      audioContextRef.current = context;

      await context.resume();
      scheduleMelody(context);

      setMusicError('');
      setIsPlaying(true);
    } catch (error) {
      if (context) {
        void context.close();
      }

      audioContextRef.current = null;
      setMusicError('The birthday tune could not start. Please try again.');
      console.error(error);
    }
  };

  const addPhotos = (event) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) =>
      file.type.startsWith('image/')
    );

    setUploadError(
      imageFiles.length !== files.length
        ? 'Only image files can be added.'
        : ''
    );

    const newPhotos = imageFiles.map((file) => {
      const src = URL.createObjectURL(file);
      photoUrlsRef.current.push(src);

      return {
        src,
        alt: file.name,
        caption: 'A favorite moment',
        date: 'A NEW MEMORY',
        title: 'Another beautiful memory ♡',
        story: 'A little moment worth keeping forever. Add your own story to make this memory even more special.',
      };
    });

    setPhotos((current) => [...current, ...newPhotos]);
    event.target.value = '';
  };

  const celebrate = () => {
    setIsCelebrating(true);

    window.clearTimeout(confettiTimerRef.current);

    confettiTimerRef.current = window.setTimeout(
      () => setIsCelebrating(false),
      3200
    );
  };

  return (
    <main>
      {isCelebrating && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 32 }, (_, index) => (
            <span
              className="confetti-piece"
              key={index}
              style={{
                '--confetti-x': `${(index * 37) % 100}%`,
                '--confetti-delay': `${(index % 9) * 0.12}s`,
                '--confetti-rotation': `${index * 47}deg`,
              }}
            />
          ))}
        </div>
      )}

      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-mark">✳</span>
          <span>A LITTLE LOVE LETTER</span>
        </a>

        <nav className="topbar-nav">
          <a href="#memories">YOUR JOURNEY</a>

          <button
            className="music-button"
            onClick={toggleMusic}
            type="button"
          >
            <span
              className={`sound-bars${isPlaying ? ' sound-bars--playing' : ''}`}
            >
              <i /><i /><i /><i />
            </span>
            {isPlaying ? 'PAUSE THE MUSIC' : 'A LITTLE BIRTHDAY TUNE'}
          </button>

          {musicError && (
            <span className="music-error" role="status">
              {musicError}
            </span>
          )}
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> UNFORTUNATELY, MADE WITH LOVE <span />
          </p>

          <h1>
            To my favourite
            <br />
            2<sup>nd</sup> Sibling,
            <br />
            <em>Always Second.</em> 🙂‍↔️
          </h1>

          <p className="hero-description">
            A collection of our questionable decisions, unnecessary
            drama, stolen snacks, endless arguments and memories
            I wouldn't trade for anything. Unfortunately, you're
            stuck with me. ❤️
          </p>

          <div className="hero-actions">
            <button
              className="celebrate-button"
              onClick={celebrate}
              type="button"
            >
              Fine, let's celebrate <span>♡</span>
            </button>

            <a className="scroll-link" href="#memories">
              <span className="scroll-arrow">↓</span>
              WITNESS OUR CRIMINAL HISTORY
            </a>
          </div>

          <div className="hero-note">
            <span className="note-star">✿</span>
            <span>
              To my unpaid therapist, personal stalker,
              <br />
              and favourite human (don't let it get to your head).
            </span>
          </div>
        </div>


        <div className="hero-art">
          <div className="hero-image-wrap">
            <img
              className="hero-image"
              src={`/images/memoryLane-1.jpeg`}
              alt="A joyful birthday celebration"
            />

            <div className="image-label">
              <span>MADE FOR YOUR SPECIAL DAY</span>
              <span>♡</span>
            </div>
          </div>

          <div className="orbit-note">
            <span>KEEP</span>
            <strong>ON</strong>
            <span>SHINING</span>
            <i>✿</i>
          </div>

          <span className="hero-sparkle hero-sparkle--one">✳</span>
          <span className="hero-sparkle hero-sparkle--two">✦</span>
        </div>
      </section>

      <section className="memories-section" id="memories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span /> EVERY MEMORY HAS A STORY <span />
            </p>

            <h2>
              Your story - My Prespective 😼,
              <br />
              <em>chapter by chapter.</em>
            </h2>
          </div>

          <div className="gallery-intro">
            <p>
              From the little beginnings to the beautiful person
              you've become. Here's a journey through moments
              that deserve to last forever.
            </p>

          </div>
        </div>

        <div className="timeline">
          <div className="timeline-line" aria-hidden="true" />

          {photos.map((photo, index) => (
            <article
              className={`timeline-item ${
                index % 2 === 0 ? 'timeline-left' : 'timeline-right'
              }`}
              key={`${photo.src}-${index}`}
            >
              <div className="timeline-marker">
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>

              <div className="timeline-content">
                <div className="timeline-image">
                  <img
                    src={`/images/memoryLane-${index+1}.jpeg`}
                    alt={photo.alt}
                    loading="lazy"
                  />
                  {/* <span className="image-heart">♡</span> */}
                </div>

                <div className="timeline-story">
                  <span className="timeline-date">{photo.date}</span>

                  <h3>{photo.title}</h3>

                  <p>{photo.story}</p>

                  <span className="timeline-caption">
                    <span>♡
                    &nbsp;{photo.caption} 
                    </span>
                      
                  </span>
                </div>
              </div>
            </article>
          ))}

          <div className="timeline-ending">
            <span>♡</span>
            <p>AND THE STORY CONTINUES...</p>
            <h3>The best is yet to come.</h3>
          </div>
        </div>
      </section>

      <section className="sister-note">
        <span className="note-flower">✿</span>
          <p className="eyebrow">A RARE MOMENT OF APPRECIATION </p> <h2>🙄</h2>

          <h2>
            No matter how old we get,
            <br />
            you'll always be that filthy little <em>brat.</em>
          </h2>

          <p>
            As much as I hate to admit it, life would've been
            ridiculously boring without you. Thanks for the chaos,
            the un-needed / un-asked opinions, the endless drama and for
            somehow becoming one of my favourite humans.
            Don't get too emotional, though. Here's to more memories
            and a lifetime of annoyingly supporting each other. ❤️

            Next life antu unte...appudu ayna 1st SEM lo anni Exams pass avu.
          </p>

        <span className="note-signature">With all my jealous love, always ♡</span>
      </section>

      <footer className="footer">
        <span className="footer-heart">♥</span>
        <a href="#home">BACK TO THE TOP ↑</a>
      </footer>
    </main>
  );
}

export default App;