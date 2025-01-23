import React from 'react';
import { Layout } from './components/Layout';
import { ThemeProvider } from './components/ThemeProvider';
import LandingPage from './components/LandingPage';
import { motion } from 'framer-motion';
import Prints from './components/Prints';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Ensure Header is imported
import Footer from './components/Footer'; // Ensure Footer is imported

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Layout>
          <Header />
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <LandingPage />
                </motion.div>
              } 
            />
            <Route path="/prints" element={ <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                > <Prints /> </motion.div> 
                                } />
          </Routes>
          <Footer />
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

export default App;