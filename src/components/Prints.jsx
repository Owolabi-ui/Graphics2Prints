import React, { useEffect, useState } from 'react';
import ItemCard from './ItemCard';
import Footer from './Footer';
import Header from './Header';

const Prints = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]); // State for categories
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products'); // Adjust the API endpoint as needed
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/categories'); // Adjust the API endpoint for categories
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchItems();
        fetchCategories();
    }, []);

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });
    
    
    return (
        <div className="prints-page pt-20">
            <div className="header ">
                <Header />
                          </div>
                    <div className="search-bar flex flex-wrap justify-center mt-20 mb-5 w-full">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#73483D] transition duration-300 ml-7 mr-7"
                    />
                     <button className="bg-gradient-to-r from-[#000000] to-[#000000] text-white px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#73483D] hover:to-[#a45e4d] transition duration-300 ease-in-out transform hover:scale-110 mr-7">Search</button> {/* Search button */}
                     <div className="flex justify-center items-center w-full">
                     {filteredItems.length === 0 ? (
                     <p className='text-red-500 center'>Can't find what you're 
                     looking for?<br /><a className='text-black' href="https://wa.me/+2348166411702" target="_blank" rel="noopener noreferrer">
                            Contact Us
                        </a></p>
                     ) : null} </div>
                </div >

                <div className="mb-4 m-7">
                    <span className="font-bold">Filter by Category:</span>
                    <div className="flex flex-wrap space-x2 mt-2 w-full">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className="text-sm bg-gradient-to-r from-[#000000] to-[#000000] text-white px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#73483D] hover:to-[#a45e4d] transition duration-300 ease-in-out transform hover:scale-110 mr-2 px-2 py-1 rounded-md mt-2"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
           
               
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 mb-5 ml-7 mr-7">
                    {filteredItems.map((item) => (
                        <ItemCard
                            key={item.id}
                            image={item.image}
                            name={item.name}
                            description={item.description}
                            // Add other props as needed
                            onButtonClick={() => handleAddToCart(product.id)}
                            
                        />
                        
                    ))}
                </div>
           
            <Footer />
        </div>
    );
};

export default Prints;
