export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">KIPASA</div>
          <p className="footer-tagline">
            Elevating your style with premium collections. 
            Discover the essence of sophistication and quality craftsmanship.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Instagram">
              📷
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              📘
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              🐦
            </a>
            <a href="#" className="social-link" aria-label="Pinterest">
              📌
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><a href="/store">All Products</a></li>
            <li><a href="/store?category=tactical">Tactical Wear</a></li>
            <li><a href="/store?category=jewelry">Jewelry</a></li>
            <li><a href="/store?category=perfumes">Perfumes</a></li>
            <li><a href="/store?category=zimbo">Zimbo Wear</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/shipping">Shipping Info</a></li>
            <li><a href="/returns">Returns</a></li>
            <li><a href="/size-guide">Size Guide</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>
          <ul className="contact-info">
            <li>support@kipasa.com</li>
            <li>+1 (555) 123-4567</li>
            <li>Mon-Fri: 9AM-6PM EST</li>
          </ul>
          
          <div className="newsletter">
            <h5>Stay Updated</h5>
            <div className="newsletter-input">
              <input type="email" placeholder="Your email" />
              <button>Join</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-credit">
          © 2025 Kipasa. Crafted with passion by{' '}
          <a href="https://fectere.com" target="_blank" rel="noopener noreferrer">
            Fectere
          </a>
        </div>
        <div className="footer-legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );
}