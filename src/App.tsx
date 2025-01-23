import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Prints from './components/Prints';

import { motion } from 'framer-motion';

const App: React.FC = () => {
    return (
        <Router>         
                   
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
                        <Route path="/prints" 
                        element={ <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                > <Prints /> </motion.div> 
                                } 
                                />
                    </Routes>
                    
                
             
        </Router>
    );
};

export default App;