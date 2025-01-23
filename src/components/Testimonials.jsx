import React from 'react';

const Testimonials = ({ testimonials }) => {
    return (
        <div className="testimonials-container">
            <h2 className="testimonials-title">What Our Clients Say</h2>
            <div className="testimonials-list">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="testimonial-card">
                        <p className="testimonial-text">"{testimonial.text}"</p>
                        <p className="testimonial-author">- {testimonial.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;