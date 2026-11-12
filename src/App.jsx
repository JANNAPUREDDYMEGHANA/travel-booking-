import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useParams
} from "react-router-dom";
import "./App.css";

const initialPlaces = [
  { id: 1, name: "Goa", country: "India", price: 4500, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700" },
  { id: 2, name: "Manali", country: "India", price: 6500, image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700" },
  { id: 3, name: "Jaipur", country: "India", price: 3500, image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=700" },
  { id: 4, name: "Kerala", country: "India", price: 5500, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700" },
  { id: 5, name: "Taj Mahal", country: "Agra, India", price: 3000, image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=700" },
  { id: 6, name: "Kashmir", country: "India", price: 8500, image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=700" }
];

function getPlaces() {
  return JSON.parse(localStorage.getItem("places") || "null") || initialPlaces;
}

function getUser() {
  return JSON.parse(localStorage.getItem("loggedInUser") || "null");
}

function Protected({ role, children }) {
  const user = getUser();

  if (!user || user.role !== role) {
    return <Navigate to={role === "admin" ? "/admin-login" : "/user-login"} />;
  }

  return children;
}

function Navbar() {
  const user = getUser();

  function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">TravelGo</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/destinations">Destinations</Link>
        {user?.role === "user" && <Link to="/my-bookings">My Bookings</Link>}
        {user?.role === "admin" && <Link to="/admin-dashboard">Admin</Link>}
        {!user && <Link to="/user-login">User Login</Link>}
        {!user && <Link to="/admin-login">Admin Login</Link>}
        {!user && <Link to="/signup">Sign Up</Link>}
        {user && <button className="logout-btn" onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
}

function Home() {
  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <p className="tagline">EXPLORE THE WORLD</p>
          <h1>Your Journey Begins Here</h1>
          <p>Discover beautiful destinations and book your next adventure.</p>
          <Link to="/destinations" className="primary-btn">Explore Destinations</Link>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose TravelGo?</h2>
        <div className="feature-grid">
          <div className="feature-card">🌍<h3>Best Destinations</h3><p>Explore amazing places.</p></div>
          <div className="feature-card">🎫<h3>Easy Booking</h3><p>Book your trips easily.</p></div>
          <div className="feature-card">💰<h3>Affordable Prices</h3><p>Enjoy budget-friendly trips.</p></div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer>
      <h3>TravelGo</h3>
      <p>Explore more. Travel more. Make memories.</p>
      <p>© 2026 TravelGo. All rights reserved.</p>
    </footer>
  );
}

function Destinations() {
  const [places] = useState(getPlaces);
  const [search, setSearch] = useState("");

  const filtered = places.filter(place =>
    place.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Explore Destinations</h1>
        <p>Choose your favourite destination and plan your trip.</p>
        <input
          className="search-input"
          placeholder="Search destinations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="destination-grid">
          {filtered.map(place => (
            <div className="destination-card" key={place.id}>
              <img src={place.image} alt={place.name} />
              <div className="card-content">
                <h2>{place.name}</h2>
                <p>{place.country}</p>
                <h3>₹{place.price} / person</h3>
                <Link className="primary-btn" to={`/book/${place.id}`}>
                  Book Now
                </Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p>No destinations found.</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Signup() {
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    const form = e.target;
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.some(u => u.email === form.email.value)) {
      alert("Email already registered.");
      return;
    }

    users.push({
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      role: "user"
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created successfully!");
    navigate("/user-login");
  }

  return (
    <AuthPage title="Create User Account">
      <form onSubmit={submit}>
        <input name="name" placeholder="Full Name" required />
        <input name="email" type="email" placeholder="Email Address" required />
        <input name="password" type="password" placeholder="Password" required minLength="4" />
        <button className="primary-btn">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/user-login">Login</Link></p>
    </AuthPage>
  );
}

function UserLogin() {
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    const form = e.target;
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const found = users.find(
      u => u.email === form.email.value &&
           u.password === form.password.value
    );

    if (!found) {
      alert("Invalid login. Please check your details or sign up.");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(found));
    navigate("/user-dashboard");
  }

  return (
    <AuthPage title="User Login">
      <form onSubmit={submit}>
        <input name="email" type="email" placeholder="Email Address" required />
        <input name="password" type="password" placeholder="Password" required />
        <button className="primary-btn">Login as User</button>
      </form>
      <p>New user? <Link to="/signup">Create Account</Link></p>
    </AuthPage>
  );
}

function AdminLogin() {
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    const form = e.target;

    if (
      form.email.value === "admin@travelgo.com" &&
      form.password.value === "Admin123"
    ) {
      localStorage.setItem("loggedInUser", JSON.stringify({
        name: "Admin",
        email: "admin@travelgo.com",
        role: "admin"
      }));
      navigate("/admin-dashboard");
    } else {
      alert("Invalid admin email or password.");
    }
  }

  return (
    <AuthPage title="Admin Login">
      <form onSubmit={submit}>
        <input name="email" type="email" placeholder="Admin Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button className="primary-btn">Login as Admin</button>
      </form>
      <div className="demo-details">
        Demo email: admin@travelgo.com<br />
        Demo password: Admin123
      </div>
    </AuthPage>
  );
}

function AuthPage({ title, children }) {
  return (
    <>
      <Navbar />
      <main className="auth-background">
        <section className="auth-card">
          <h1>{title}</h1>
          {children}
          <Link to="/">← Back to Home</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

function UserDashboard() {
  const user = getUser();
  const places = getPlaces();

  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Welcome, {user.name}!</h1>
        <p>Choose a destination to book your next trip.</p>
        <div className="destination-grid">
          {places.map(place => (
            <div className="destination-card" key={place.id}>
              <img src={place.image} alt={place.name} />
              <div className="card-content">
                <h2>{place.name}</h2>
                <p>₹{place.price} per person</p>
                <Link className="primary-btn" to={`/book/${place.id}`}>Book Trip</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const place = getPlaces().find(p => p.id === Number(id));
  const user = getUser();

  if (!place) return <Navigate to="/destinations" />;

  function submit(e) {
    e.preventDefault();
    const form = e.target;
    const count = Number(form.travellers.value);

    const booking = {
      id: Date.now(),
      user: user.email,
      customerName: user.name,
      destination: place.name,
      date: form.date.value,
      travellers: count,
      total: place.price * count,
      status: "Confirmed"
    };

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert("Your booking has been saved!");
    navigate("/my-bookings");
  }

  return (
    <>
      <Navbar />
      <main className="auth-background">
        <section className="auth-card booking-card">
          <h1>Book Your Trip</h1>
          <h2>{place.name}</h2>
          <p>Price: ₹{place.price} per person</p>
          <form onSubmit={submit}>
            <label>Travel Date</label>
            <input name="date" type="date" min={new Date().toISOString().split("T")[0]} required />
            <label>Number of Travellers</label>
            <input name="travellers" type="number" min="1" max="20" defaultValue="1" required />
            <button className="primary-btn">Confirm Booking</button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}

function MyBookings() {
  const user = getUser();
  const [bookings, setBookings] = useState(() =>
    JSON.parse(localStorage.getItem("bookings") || "[]")
      .filter(b => b.user === user.email)
  );

  function cancelBooking(id) {
    const all = JSON.parse(localStorage.getItem("bookings") || "[]")
      .filter(b => b.id !== id);

    localStorage.setItem("bookings", JSON.stringify(all));
    setBookings(all.filter(b => b.user === user.email));
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <h1>My Bookings</h1>
        {bookings.length === 0 ? <p>You have no bookings yet.</p> :
          bookings.map(b => (
            <div className="booking-row" key={b.id}>
              <div>
                <h3>{b.destination}</h3>
                <p>Date: {b.date}</p>
                <p>Travellers: {b.travellers}</p>
                <p>Total: ₹{b.total}</p>
                <p>Status: {b.status}</p>
              </div>
              <button className="danger-btn" onClick={() => cancelBooking(b.id)}>
                Cancel Booking
              </button>
            </div>
          ))
        }
      </main>
      <Footer />
    </>
  );
}

function AdminDashboard() {
  const [places, setPlaces] = useState(getPlaces);
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

  function addPlace(e) {
    e.preventDefault();
    const form = e.target;

    const updated = [...places, {
      id: Date.now(),
      name: form.name.value,
      country: form.country.value,
      price: Number(form.price.value),
      image: form.image.value || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700"
    }];

    setPlaces(updated);
    localStorage.setItem("places", JSON.stringify(updated));
    form.reset();
    alert("Destination added!");
  }

  function deletePlace(id) {
    const updated = places.filter(p => p.id !== id);
    setPlaces(updated);
    localStorage.setItem("places", JSON.stringify(updated));
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Admin Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card"><h2>{places.length}</h2><p>Destinations</p></div>
          <div className="stat-card"><h2>{bookings.length}</h2><p>Total Bookings</p></div>
        </div>

        <h2>Add New Destination</h2>
        <form className="admin-form" onSubmit={addPlace}>
          <input name="name" placeholder="Destination Name" required />
          <input name="country" placeholder="Location" required />
          <input name="price" type="number" min="1" placeholder="Price" required />
          <input name="image" type="url" placeholder="Image URL (optional)" />
          <button className="primary-btn">Add Destination</button>
        </form>

        <h2>Manage Destinations</h2>
        {places.map(p => (
          <div className="booking-row" key={p.id}>
            <strong>{p.name} — ₹{p.price}</strong>
            <button className="danger-btn" onClick={() => deletePlace(p.id)}>Delete</button>
          </div>
        ))}

        <h2>All Customer Bookings</h2>
        {bookings.length === 0 ? <p>No bookings yet.</p> :
          bookings.map(b => (
            <div className="booking-row" key={b.id}>
              <div>
                <strong>{b.destination}</strong>
                <p>Customer: {b.customerName} ({b.user})</p>
                <p>Date: {b.date} | Travellers: {b.travellers}</p>
                <p>Total: ₹{b.total} | {b.status}</p>
              </div>
            </div>
          ))
        }
      </main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      <Route path="/user-dashboard" element={
        <Protected role="user"><UserDashboard /></Protected>
      } />

      <Route path="/admin-dashboard" element={
        <Protected role="admin"><AdminDashboard /></Protected>
      } />

      <Route path="/book/:id" element={
        <Protected role="user"><BookingPage /></Protected>
      } />

      <Route path="/my-bookings" element={
        <Protected role="user"><MyBookings /></Protected>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}