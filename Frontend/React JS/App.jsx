import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Terms from './pages/Terms';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        {/* Redirect root to about for now if hitting info app root, but usually served properly */}
        <Route path="*" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
