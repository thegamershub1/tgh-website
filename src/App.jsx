import { useState } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const App = () => {
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
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [utr, setUtr] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setBooking(prev => ({
      ...prev,
      [id]: value
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentStarted && !/^[0-9]{12}$/.test(utr)) {
     alert("Please enter a valid 12-digit UTR / Transaction ID.");
     return;
    }

    
    if (!booking.name || !booking.phone || !booking.setup || !booking.date || !booking.time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Using Formspree instead of Firebase
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
          utr
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
      }
    } catch (error) {
      console.error('Error:', error);
      setConfirmationMessage('Booking failed. Please try again or contact us directly.');
      setShowConfirmation(true);
    }
  };

  // Setups data
  const setups = [
    {
      id: 'ps5',
      name: 'PS5',
      description: '4K @ 120Hz | DualSense Controllers',
      features: ['2 units available', 'Supports 4 players', '100+ games'],
      image: 'images/ps5-setup.jpg'
    },
    {
      id: 'pc',
      name: 'ELITE GAMING PC',
      description: '240Hz | RTX 4060 | Ryzen 5 Processor',
      features: ['2 units available', 'Mechanical keyboards', 'Competitive-ready', 'With RTX 4060 GPU'],
      image: 'images/gaming-pc.jpg'
    },
    {
      id: 'wheel',
      name: 'RACING SIMULATOR',
      description: 'Logitech G29',
      features: ['Full racing seat', 'Force feedback', 'Gear supported'],
      image: 'images/steering wheel.jpg'
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
      content: 'mrzayed45@gmail.com'
    },
    {
      icon: 'clock',
      title: 'Opening Hours',
      content: 'Sat-Thu: 10AM - 10PM<br>Fri: 2PM - 10PM'
    },
     {
    icon: 'instagram', // Make sure you have an Instagram icon in your project
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

      {/* Mega Logo Header */}
      <div className="mega-logo">
        <h1 className="logo-text">THE GAMER'S HUB</h1>
        <p className="tagline">PLAY • COMPETE • LEVEL UP</p>
      </div>

      {/* Navigation */}
      <header>
        <div className="container">
          <nav className="nav">
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
                  <ul>
                    {setup.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
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
                  <option value="5">4 Hours</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea 
                  id="notes"
                  rows="3"
                  value={booking.notes || ''}
                  onChange={handleChange}
                  placeholder="Any game preference or requests..."
                ></textarea>
              </div>

              
{!paymentStarted ? (
  <button type="button" className="btn" onClick={() => setPaymentStarted(true)}>
    PROCEED TO PAYMENT
  </button>
) : (
  <>
   <div className="form-group">
  <p style={{ color: 'red', fontWeight: 'bold' }}>
    Pay at least ₹50 to confirm your booking
  </p>
  <label>Scan & Pay</label>
  <img src="images/qr.png" alt="UPI QR" style={{ maxWidth: '100%', marginBottom: '1rem' }} />
  <p style={{ color: '#0ff' }}><strong>UPI ID:</strong> Q541176484@ybl</p>
</div>

    <div className="form-group">
      <label htmlFor="utr">Enter UTR/Txn ID after payment</label>
      <input
        type="text"
        id="utr"
        value={utr}
        onChange={(e) => setUtr(e.target.value)}
        placeholder="Example: 123456789012"
        required
      />
    </div>
    <button type="submit" className="btn">CONFIRM BOOKING</button>
  </>
)}

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
        
        .nav {
          display: flex;
          justify-content: center;
          align-items: center;
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
          border-radius: 10px;
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
          border-radius: 10px;
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
        
        input, select {
          width: 100%;
          padding: 0.8rem;
          background: rgba(10, 10, 26, 0.7);
          border: 1px solid rgba(0, 245, 255, 0.3);
          border-radius: 5px;
          color: white;
          font-size: 1rem;
        }
        
        input:focus, select:focus {
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
          border-radius: 5px;
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
          border-radius: 10px;
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
          border-radius: 10px;
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
        }
      `}</style>
    </div>
  );
};

export default App;