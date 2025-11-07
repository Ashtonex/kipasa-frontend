// src/pages/Store.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../utils/appwrite';


const categories = [
  'Tactical Wear', 'Biker Wear', 'Outdoors', 'Games', 'Perfumes', 'Ornaments',
  'Bags & Wallets', 'Jewelry', 'General Gifts', 'Dog Accessories',
  'Headgear', 'Zimbo Wear', 'Lingerie'
];

export default function Store() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const all = await getAllProducts();
      setProducts(all);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search')?.toLowerCase() || '';
    const category = params.get('category') || '';
    const sort = params.get('sort') || '';

    let result = [...products];

    if (query) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(query)
      );
    }

    if (category) {
      result = result.filter(p =>
        p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (sort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    setFiltered(result);
  }, [location.search, products]);

  const setCategory = (cat) => {
    const params = new URLSearchParams(location.search);
    params.set('category', cat);
    navigate(`/store?${params.toString()}`);
  };

  const setSort = (e) => {
    const params = new URLSearchParams(location.search);
    params.set('sort', e.target.value);
    navigate(`/store?${params.toString()}`);
  };

  return (
    <div className="store">
      <h2>Store</h2>

      <div className="filters">
        <div className="category-buttons">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div className="sort-dropdown">
          <label>Sort by price:</label>
          <select onChange={setSort} defaultValue="">
            <option value="">None</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid">
        {filtered.map((product) => (
          <ProductCard key={product.$id} product={product} />
        ))}
      </div>
    </div>
  );
}