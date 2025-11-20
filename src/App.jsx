import { useState } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    setup: '',
    people: '',
    date: '',
    time: '',
    duration: '1',
    notes: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [selectedSetupDetails, setSelectedSetupDetails] = useState(null);
  const [showGamesModal, setShowGamesModal] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    if (id === 'setup') {
      const setupDetails = setups.find(setup => setup.id === value);
      setSelectedSetupDetails(setupDetails);
    }
    
    setBooking(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!booking.name || !booking.phone || !booking.setup || !booking.date || !booking.time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/movljvoz", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: booking.name,
          phone: booking.phone,
          setup: booking.setup,
          people: booking.setup === 'ps5' ? booking.people : 'N/A',
          date: booking.date,
          time: booking.time,
          duration: booking.duration,
          notes: booking.notes,
        })
      });

      if (response.ok) {
        setConfirmationMessage(`Thank you, ${booking.name}! We've received your ${booking.setup} booking for ${booking.date}. We'll reach you shortly.`);
        setShowConfirmation(true);

        setTimeout(() => {
          setShowConfirmation(false);
        }, 5000);

        setBooking({
          name: '',
          phone: '',
          setup: '',
          date: '',
          time: '',
          duration: '1',
          notes: '',
        });
        setSelectedSetupDetails(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setConfirmationMessage('Booking failed. Please try again or contact us directly.');
      setShowConfirmation(true);
    }
  };

  // Game lists for each setup
  const gameLists = {
    ps5: [
      { name: 'Black myth wukong', price: '₹100/hr', players: 'Single Player' },
      { name: 'Spider-Man 2', price: '₹100/hr', players: 'Single Player' },
      { name: 'God of War', price: '₹100/hr', players: 'Single Player' },
      { name: 'The Witcher 3', price: '₹100/hr', players: 'Single Player' },
      { name: 'FC25', price: '₹100-190-280-380/hr', players: 'Single/Multiplayer (1-4)' },
      { name: 'Mortal Kombat', price: '₹100-190/hr', players: 'single/Multiplayer' },
      { name: 'Grand Theft Auto V', price: '₹100/hr', players: 'Single Player' },
      { name: 'Tekken 8', price: '₹100-190/hr', players: 'Single/Multiplayer' },
      { name: 'It takes two', price: '₹100-190/hr', players: 'Single/Multiplayer' },
      { name: 'Asphalt Legend Unite', price: '₹100-190/hr', players: 'Single/Multiplayer' },
      { name: 'Dirt 5', price: '₹100-190-280-380/hr', players: 'Single/Multiplayer (1-4)' },
      { name: 'WWE 2K24', price: '₹100-190-280-380/hr', players: 'Single/Multiplayer (1-4)' },
      { name: 'F124', price: '₹100-190-280-380/hr', players: 'Single/Multiplayer (1-4)' } 
        ],
    pc: [
      { name: 'Valorant', price: '₹89/hr' },
      { name: 'Counter-Strike 2', price: '₹89/hr' },
      { name: 'Call of Duty: Black ops 6', price: '₹89/hr' },
      { name: 'Hogwart legacy', price: '₹89/hr' },
      { name: 'RDR 2', price: '₹89/hr' },
      { name: 'GTA V', price: '₹89/hr' },
      { name: 'Forza Horizon', price: '₹89/hr' },
      { name: 'Free Fire', price: '₹89/hr' },
      { name: 'BGMI', price: '₹89/hr' },
      { name: 'Minecraft', price: '₹89/hr' },
      { name: 'Poppy Playtime/Kamla', price: '₹89/hr' },
      { name: 'Chained together', price: '₹89/hr' },
    ],
    wheel: [
      { name: 'Forza Horizon 5', price: '₹150/hr' },
      { name: 'The Crew Motorfest', price: '₹150/hr' },
      { name: 'Need for Speed: Heat', price: '₹150/hr'},
      { name: 'My First Gran Turismo', price: '₹150/hr' },
      { name: 'Assetto Corsa', price: '₹150/hr' }
    ]
  };

  // Setups data with prices
  const setups = [
    {
      id: 'ps5',
      name: 'PS5',
      description: '4K @ 120Hz | DualSense Controllers',
      features: ['2 units available', 'Supports 4 players', 'Split-screen & Local Multiplayer'],
      image: 'images/ps5-setup.jpg',
      basePrice: '₹100/hr',
      multiplayer: 'Up to 4 players',
      games: gameLists.ps5
    },
    {
      id: 'pc',
      name: 'ELITE GAMING PC',
      description: '240Hz | RTX 4060 | Ryzen 5 Processor',
      features: ['2 units available', 'Mechanical keyboards', 'Competitive-ready', 'With RTX 4060 GPU'],
      image: 'images/gaming-pc.jpg',
      basePrice: '₹89/hr',
      multiplayer: 'Online multiplayer',
      games: gameLists.pc
    },
    {
      id: 'wheel',
      name: 'RACING SIMULATOR',
      description: 'Logitech G29',
      features: ['Full racing seat', 'Force feedback', 'Gear supported'],
      image: 'images/steering wheel.jpg',
      basePrice: '₹150/hr',
      multiplayer: 'Single player only',
      games: gameLists.wheel
    }
  ];

  // Gallery images
  const galleryImages = [
    'images/parlour-interior-1.jpg',
    'images/parlour-interior-2.jpg',
    'images/parlour-interior-3.jpg',
    'images/parlour-interior-4.jpg',
    'images/parlour-interior-5.jpg',
    'images/parlour-interior-6.jpg'
  ];

  // Contact information
  const contactInfo = [
    {
      icon: 'map-marker-alt',
      title: 'Our Location',
      content: 'BALIGADH GARDEN, OPP. MDDM COLLEGE,<br>MITHANPURA ROAD MUZAFFARPUR'
    },
    {
      icon: 'phone-alt',
      title: 'Phone Numbers',
      content: '+91 8434610086<br>+91 06214058918'
    },
    {
      icon: 'envelope',
      title: 'Email Address',
      content: 'thegamershubcontact@gmail.com'
    },
    {
      icon: 'clock',
      title: 'Opening Hours',
      content: 'Sat-Thu: 10AM - 10PM<br>Fri: 2PM - 10PM'
    },
    {
      icon: 'instagram',
      title: 'Instagram',
      content: '<a href="https://instagram.com/the.gamers.hub_" target="_blank" rel="noopener noreferrer">@the.gamers.hub_</a>'
    }
  ];

  return (
    <div className="app">
      {/* Confirmation Message */}
      {showConfirmation && (
        <div className="confirmation-banner">
          <p>{confirmationMessage}</p>
        </div>
      )}

      {/* Games Modal */}
      {showGamesModal && selectedSetupDetails && (
        <div className="modal-overlay" onClick={() => setShowGamesModal(false)}>
          <div className="games-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedSetupDetails.name} - Available Games</h3>
              <button 
                className="close-btn"
                onClick={() => setShowGamesModal(false)}
              >
                ×
              </button>
            </div>
            <div className="games-grid">
              {selectedSetupDetails.games.map((game, index) => (
                <div key={index} className="game-card">
                  <div className="game-info">
                    <h4>{game.name}</h4>
                    <span className="player-type">{game.players}</span>
                  </div>
                  <div className="game-price">{game.price}</div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <p className="base-price">Base Setup Price: <strong>{selectedSetupDetails.basePrice}</strong></p>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowGamesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mega Logo Header */}
      <div className="mega-logo">
        <h1 className="logo-text">THE GAMER'S HUB</h1>
        <p className="tagline">PLAY • COMPETE • LEVEL UP</p>
      </div>

      {/* Navigation */}
      <header>
        <div className="container">
          <nav className="nav">
            <div className="nav-logo">
              <img src="/images/tgh-logo.png" alt="THE GAMER'S HUB" className="nav-logo-img" />
            </div>
            <div className="nav-links">
              <a href="#home">Home</a>
              <a href="#setups">Setups</a>
              <a href="#gallery">Gallery</a>
              <a href="#book">Book Now</a>
              <a href="#contact">Contact</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <h1>LEVEL UP YOUR GAME</h1>
            <p>Experience next-gen gaming with our premium setups. Book your session now and join the ultimate gaming community!</p>
            <a href="#book" className="btn">BOOK NOW</a>
          </div>
        </div>
      </section>

      {/* Setups Section */}
      <section id="setups">
        <div className="container">
          <h2 className="section-title">OUR GAMING SETUPS</h2>
          <div className="setups">
            {setups.map((setup) => (
              <div className="setup-card" key={setup.id}>
                <div className="setup-img">
                  <img src={setup.image} alt={setup.name} />
                </div>
                <div className="setup-info">
                  <h3 className="setup-name">{setup.name}</h3>
                  <p>{setup.description}</p>
                  <div className="setup-meta">
                    <span className="price-tag">{setup.basePrice}</span>
                    <span className="player-info">{setup.multiplayer}</span>
                  </div>
                  <ul>
                    {setup.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <button 
                    className="btn-view-games"
                    onClick={() => {
                      setSelectedSetupDetails(setup);
                      setShowGamesModal(true);
                    }}
                  >
                    View Games & Prices
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery">
        <div className="container">
          <h2 className="section-title">OUR GAMING ZONE</h2>
          <div className="gallery">
            {galleryImages.map((image, index) => (
              <div className="gallery-item" key={index}>
                <img src={image} alt={`Gaming Area ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="book">
        <div className="container">
          <h2 className="section-title">BOOK YOUR SESSION</h2>
          <div className="booking-form">
            <form id="bookingForm" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={booking.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    value={booking.phone}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="setup">Choose Setup</label>
                <select 
                  id="setup" 
                  value={booking.setup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Setup</option>
                  <option value="ps5">PS5</option>
                  <option value="pc">Gaming PC</option>
                  <option value="wheel">Racing Simulator</option>
                </select>
              </div>

              {selectedSetupDetails && (
                <div className="setup-preview">
                  <div className="preview-header">
                    <h4>Selected: {selectedSetupDetails.name}</h4>
                    <span className="preview-price">{selectedSetupDetails.basePrice}</span>
                  </div>
                  <button 
                    type="button"
                    className="btn-view-games-small"
                    onClick={() => setShowGamesModal(true)}
                  >
                    View All Games
                  </button>
                </div>
              )}

              {booking.setup === 'ps5' && (
                <div className="form-group">
                  <label htmlFor="people">Number of People</label>
                  <select
                    id="people"
                    value={booking.people} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Booking Date</label>
                  <input 
                    type="date" 
                    id="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={booking.date}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Start Time</label>
                  <input 
                    type="time" 
                    id="time" 
                    value={booking.time}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration</label>
                <select 
                  id="duration" 
                  value={booking.duration}
                  onChange={handleChange}
                  required
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="4">4 Hours</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Game Preferences (optional)</label>
                <textarea 
                  id="notes"
                  rows="3"
                  value={booking.notes || ''}
                  onChange={handleChange}
                  placeholder="Mention your preferred games..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">CONFIRM BOOKING</button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="container">
          <h2 className="section-title">CONTACT US</h2>
          <div className="contact-container">
            {contactInfo.map((contact, index) => (
              <div className="contact-card" key={index}>
                <div className="contact-icon">
                  <i className={`fas fa-${contact.icon}`}></i>
                </div>
                <h3>{contact.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: contact.content }}></p>
              </div>
            ))}
          </div>
          
          {/* Google Maps Embed */}
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.6015865601057!2d85.3938988!3d26.1095261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed11db9170efbd%3A0x764068da12c6f294!2sTHE%20GAMER'S%20HUB!5e0!3m2!1sen!2sin!4v1721294300000!5m2!1sen!2sin" 
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy">
            </iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
  <div className="container">
    <div className="footer-content">

      {/* Brand Section */}
      <div className="footer-brand">
        <img src="/images/tgh-logo.png" alt="THE GAMER'S HUB" className="footer-logo" />
        <span className="footer-brand-name">THE GAMER'S HUB</span>
      </div>

      {/* Contact Info */}
      <div className="footer-contact-info">
        <span>📍 Muzaffarpur</span>
        <span>📞 +91 84346 10086</span>
        <span>✉️ thegamershubcontact@gmail.com</span>
      </div>

      {/* Social Icons */}
      <div className="footer-social">
        <a href="https://instagram.com/the.gamers.hub_" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-discord"></i>
        </a>
      </div>

    </div>

    {/* Legal */}
    <div className="footer-legal">
      <div className="footer-links">
      </div>
      <div className="footer-copyright">
        © 2025 THE GAMER'S HUB — All rights reserved.
      </div>
    </div>
  </div>
</footer>


      {/* Social Media Links */}
      <div className="social-links">
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-discord"></i></a>
      </div>

      {/* CSS Styles */}
      <style jsx global>{`
        /* === GLOBAL STYLES === */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        /* === CYBERPUNK GAMING THEME === */
        :root {
          --neon-blue: #00f5ff;
          --neon-pink: #ff00aa;
          --dark-bg: #0a0a1a;
          --card-bg: rgba(20, 20, 40, 0.8);
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
        }
        
        body {
          font-family: 'Rajdhani', sans-serif;
          background: var(--dark-bg);
          color: white;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(0, 245, 255, 0.1) 0%, transparent 20%),
            radial-gradient(circle at 90% 80%, rgba(255, 0, 170, 0.1) 0%, transparent 20%);
        }
        
        .app {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 100vh;
        }
        
        /* Navigation Logo */
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        
        .nav-logo {
          display: flex;
          align-items: center;
        }
        
        .nav-logo-img {
          height: 35px;
          width: auto;
        }
        
        /* Footer Styles */
        .footer {
          background: rgba(10, 10, 26, 0.95);
          border-top: 1px solid var(--glass-border);
          padding: 2rem 0 1rem;
          margin-top: auto;
          width: 100%;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .footer-logo {
          height: 25px;
          width: auto;
        }
        
        .footer-brand-name {
          font-family: 'Orbitron', sans-serif;
          color: var(--neon-blue);
          font-size: 0.9rem;
          font-weight: bold;
        }
        
        .footer-contact-info {
          display: flex;
          gap: 1.5rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          flex-wrap: wrap;
        }
        
        .footer-social {
          display: flex;
          gap: 1rem;
        }
        
        .footer-social a {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          transition: color 0.3s;
        }
        
        .footer-social a:hover {
          color: var(--neon-blue);
        }
        
        .footer-legal {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .footer-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .footer-links a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 0.75rem;
          transition: color 0.3s;
        }
        
        .footer-links a:hover {
          color: var(--neon-blue);
        }
        
        .footer-copyright {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.75rem;
        }
        
        /* Confirmation Banner */
        .confirmation-banner {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--neon-blue);
          color: var(--dark-bg);
          padding: 15px 30px;
          border-radius: 5px;
          z-index: 1000;
          box-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
          animation: fadeIn 0.5s;
          max-width: 90%;
          text-align: center;
          font-weight: bold;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; top: 0; }
          to { opacity: 1; top: 20px; }
        }
        
        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 10, 26, 0.9);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .games-modal {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 2rem;
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--glass-border);
        }
        
        .modal-header h3 {
          color: var(--neon-blue);
          font-family: 'Orbitron', sans-serif;
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.3s;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .game-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: transform 0.3s, border-color 0.3s;
        }
        
        .game-card:hover {
          transform: translateY(-2px);
          border-color: var(--neon-blue);
        }
        
        .game-info h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }
        
        .player-type {
          font-size: 0.8rem;
          color: var(--neon-pink);
          background: rgba(255, 0, 170, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
        }
        
        .game-price {
          color: var(--neon-blue);
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--glass-border);
        }
        
        .base-price {
          color: var(--neon-pink);
          font-size: 1.1rem;
          margin: 0;
        }
        
        /* Enhanced Setup Cards */
        .setup-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1rem 0;
        }
        
        .price-tag {
          background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
        }
        
        .player-info {
          color: var(--neon-pink);
          font-size: 0.9rem;
        }
        
        .btn-view-games {
          background: transparent;
          border: 2px solid var(--neon-blue);
          color: var(--neon-blue);
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          margin-top: 1rem;
        }
        
        .btn-view-games:hover {
          background: var(--neon-blue);
          color: var(--dark-bg);
          transform: translateY(-2px);
        }
        
        /* Enhanced Booking Form */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .setup-preview {
          background: rgba(0, 245, 255, 0.1);
          border: 1px solid var(--neon-blue);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .preview-header h4 {
          color: var(--neon-blue);
          margin: 0;
        }
        
        .preview-price {
          color: var(--neon-pink);
          font-weight: bold;
        }
        
        .btn-view-games-small {
          background: transparent;
          border: 1px solid var(--neon-blue);
          color: var(--neon-blue);
          padding: 0.4rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .btn-view-games-small:hover {
          background: var(--neon-blue);
          color: var(--dark-bg);
        }
        
        .btn-primary {
          background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
          width: 100%;
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }
        
        .btn-secondary {
          background: transparent;
          border: 2px solid var(--neon-pink);
          color: var(--neon-pink);
        }
        
        .btn-secondary:hover {
          background: var(--neon-pink);
          color: white;
        }
        
        /* Mega Logo */
        .mega-logo {
          text-align: center;
          padding: 2rem 0;
          background: linear-gradient(rgba(10, 10, 26, 0.9), rgba(10, 10, 26, 0.97));
          border-bottom: 2px solid var(--neon-blue);
          width: 100%;
        }
        
        .mega-logo .logo-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 4rem;
          background: linear-gradient(90deg, var(--neon-blue), var(--neon-pink));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
          letter-spacing: 2px;
          margin: 0;
        }
        
        .mega-logo .tagline {
          font-family: 'Orbitron', sans-serif;
          color: var(--neon-blue);
          letter-spacing: 3px;
          margin-top: 0.5rem;
        }
        
        header {
          background: rgba(10, 10, 26, 0.9);
          padding: 1rem;
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid var(--neon-blue);
          width: 100%;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          width: 100%;
        }
        
        .nav-links {
          display: flex;
          gap: 3rem;
        }
        
        .nav-links a {
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          position: relative;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--neon-blue);
          transition: width 0.3s;
        }
        
        .nav-links a:hover::after {
          width: 100%;
        }
        
        .hero {
          height: 100vh;
          display: flex;
          align-items: center;
          background: 
            linear-gradient(rgba(10, 10, 26, 0.7), rgba(10, 10, 26, 0.9)),
            url('images/main.png') center/cover no-repeat;
          width: 100%;
        }
        
        .hero-content {
          max-width: 600px;
          width: 100%;
        }
        
        h1 {
          font-family: 'Orbitron', sans-serif;
          font-size: 3.5rem;
          margin: 0;
          background: linear-gradient(90deg, var(--neon-blue), white);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .btn {
          display: inline-block;
          padding: 0.8rem 2rem;
          background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: bold;
          font-size: 1.1rem;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: transform 0.3s, box-shadow 0.3s;
          text-decoration: none;
        }
        
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 245, 255, 0.4);
        }
        
        section {
          padding: 5rem 0;
          width: 100%;
        }
        
        .section-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, var(--neon-blue), var(--neon-pink));
        }
        
        /* Setup Cards */
        .setups {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          width: 100%;
        }
        
        .setup-card {
          background: var(--card-bg);
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid rgba(0, 245, 255, 0.2);
          transition: transform 0.3s, box-shadow 0.3s;
          width: 100%;
        }
        
        .setup-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 245, 255, 0.2);
          border-color: var(--neon-blue);
        }
        
        .setup-img {
          height: 250px;
          overflow: hidden;
          width: 100%;
        }
        
        .setup-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        
        .setup-card:hover .setup-img img {
          transform: scale(1.1);
        }
        
        .setup-info {
          padding: 1.5rem;
        }
        
        .setup-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
          color: var(--neon-blue);
        }
        
        /* Booking Form */
        .booking-form {
          max-width: 600px;
          margin: 0 auto;
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 15px;
          border: 1px solid rgba(0, 245, 255, 0.3);
          width: 100%;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
          width: 100%;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        input, select, textarea {
          width: 100%;
          padding: 0.8rem;
          background: rgba(10, 10, 26, 0.7);
          border: 1px solid rgba(0, 245, 255, 0.3);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: var(--neon-blue);
          box-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
        }
        
        /* Gallery */
        .gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
          width: 100%;
        }
        
        .gallery-item {
          height: 250px;
          overflow: hidden;
          border-radius: 10px;
          position: relative;
          width: 100%;
        }
        
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        
        .gallery-item:hover img {
          transform: scale(1.1);
        }
        
        /* Contact Section */
        .contact-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
          width: 100%;
        }
        
        .contact-card {
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 15px;
          border: 1px solid rgba(0, 245, 255, 0.3);
          text-align: center;
          width: 100%;
        }
        
        .contact-icon {
          font-size: 2.5rem;
          color: var(--neon-blue);
          margin-bottom: 1rem;
        }
        
        .contact-card h3 {
          font-family: 'Orbitron', sans-serif;
          color: var(--neon-pink);
          margin-top: 0;
        }
        
        /* Map Container */
        .map-container {
          margin-top: 3rem;
          border-radius: 15px;
          overflow: hidden;
          border: 2px solid var(--neon-blue);
          width: 100%;
        }
        
        /* Social Media */
        .social-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin: 2rem 0;
          padding-bottom: 2rem;
          width: 100%;
        }
        
        .social-links a {
          color: white;
          font-size: 1.5rem;
          transition: color 0.3s;
        }
        
        .social-links a:hover {
          color: var(--neon-blue);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .mega-logo .logo-text {
            font-size: 2.5rem;
          }
          
          .nav {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-links {
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
          }
          
          h1 {
            font-size: 2.5rem;
          }
          
          .hero {
            height: 80vh;
          }
          
          .setup-img, .gallery-item {
            height: 200px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .games-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-footer {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .games-modal {
            padding: 1.5rem;
          }
          
          .footer-content {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }
          
          .footer-contact-info {
            justify-content: center;
          }
          
          .footer-legal {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .footer-links {
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .footer-contact-info {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .footer-contact-info span {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
