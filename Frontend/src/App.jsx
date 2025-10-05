import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios'; 

const API_URL = 'http://localhost:5173'; 

const COLOR_MAP = {
  yellow: { name: "Yellow Gold", hex: "#E6CA97" }, 
  white: { name: "White Gold", hex: "#D9D9D9" }, 
  rose: { name: "Rose Gold", hex: "#E1A4A9" }, 
};

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const carouselRef = useRef(null); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URL);
        setProducts(response.data);
      } catch (err) {
        console.error("API'den veri çekilemedi:", err);
        setError("Ürünler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 
  
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300; 
      const currentScroll = carouselRef.current.scrollLeft;

      carouselRef.current.scroll({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <div style={{padding: '20px'}}>Ürünler yükleniyor...</div>;
  if (error) return <div style={{padding: '20px', color: 'red'}}>{error}</div>;

  return (
    <div className="product-listing">
      <h1>Product List</h1>
      
      <div className="carousel-wrapper"> 
        <button className="carousel-arrow left" onClick={() => scrollCarousel('left')}>
          &#10094; 
        </button>

        <div className="product-carousel-container" ref={carouselRef}> 
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>
        
        <button className="carousel-arrow right" onClick={() => scrollCarousel('right')}>
          &#10095; 
        </button>
      </div> 
    </div>
  );
}

// Kart yapısı
const ProductCard = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState('yellow');
  const scoreOutOfFive = (product.popularityScore * 5).toFixed(1);
  const currentImage = product.images[selectedColor];

  return (
    <div className="product-card">
      <img 
        src={currentImage} 
        alt={product.name} 
        className="product-image"
      />
      
      <div className="product-details">
        <h2 className="product-name">{product.name}</h2>
        <p className="price">${product.price.toFixed(2)} USD</p> 
        
        
        <div className="color-picker-group">
          {Object.keys(product.images).map(colorKey => (
            <div
              key={colorKey}
              className={`color-dot ${selectedColor === colorKey ? 'selected' : ''}`}
              style={{ backgroundColor: COLOR_MAP[colorKey].hex }}
              onClick={() => setSelectedColor(colorKey)} 
              title={COLOR_MAP[colorKey].name}
            ></div>
          ))}
        </div>
        
        <p className="current-color-label">
          {COLOR_MAP[selectedColor].name}
        </p>
        
       
        <div className="popularity-score">
          
          <span 
            className="stars" 
            style={{ "--rating": scoreOutOfFive }}
          ></span>
          <span className="rating-value">{scoreOutOfFive}/5</span>
        </div>
      </div>
    </div>
  );
};

export default App;
