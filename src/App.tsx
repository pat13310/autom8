import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/navbar';
import { Footer } from './components/layout/footer';
import { Home } from './pages/home';
import { Services } from './pages/services';
import { Solutions } from './pages/solutions';
import { Pricing } from './pages/pricing';
import { Contact } from './pages/contact';
import { Legal } from './pages/legal';
import { Privacy } from './pages/privacy';
import { Terms } from './pages/terms';
import { RGPD } from './pages/rgpd';
import { Demo } from './pages/demo';
import { Blog, BlogPost } from './pages/blog';
import { AdminBlog } from './pages/admin/blog';
import { AdminTestimonials } from './pages/admin/testimonials';
import { AdminLogin } from './pages/admin/login';
import { AdminRoute } from './components/auth/AdminRoute';
import { NotFound } from './pages/not-found';

// Configuration des flags pour React Router v7
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <Router {...routerOptions}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <div className="max-w-[2000px] mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/rgpd" element={<RGPD />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/blog"
                element={
                  <AdminRoute>
                    <AdminBlog />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/testimonials"
                element={
                  <AdminRoute>
                    <AdminTestimonials />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;