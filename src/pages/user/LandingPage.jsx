import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, formatPrice } from "../../data/products";
import { fetchProducts } from "../../api/productsApi";
import "./LandingPage.css";

function LandingPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();

                setProducts(
                    data.map((product) => ({
                        ...product,
                        img: product.image,
                        desc: product.description
                            ? product.description.slice(0, 55) + "..."
                            : "Perlengkapan outdoor berkualitas.",
                        badge: product.category
                            ? product.category.toUpperCase()
                            : "PRODUK",
                        price: Number(product.price),
                        stock: Number(product.stock),
                    }))
                );
            } catch (error) {
                console.error("Gagal mengambil produk:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchCategory =
                activeCategory === "Semua" ||
                product.category === activeCategory;

            const matchSearch =
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.desc.toLowerCase().includes(search.toLowerCase());

            return matchCategory && matchSearch;
        });
    }, [products, search, activeCategory]);

    return (
        <div className="landing-page">
            <main>
                <section className="landing-products" id="produk">
                    <div className="landing-products-heading">
                        <div>
                            <p className="landing-eyebrow">
                                PERLENGKAPAN OUTDOOR
                            </p>

                            <h1>
                                Temukan perlengkapan
                                <br />
                                untuk petualanganmu.
                            </h1>
                        </div>

                        <p className="landing-products-intro">
                            Lihat pilihan peralatan yang tersedia sebelum melakukan
                            pemesanan.
                        </p>
                    </div>

                    <div className="landing-search-wrapper">
                        <span>⌕</span>

                        <input
                            type="search"
                            placeholder="Cari perlengkapan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="landing-categories">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                className={`landing-category ${activeCategory === category ? "active" : ""
                                    }`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="landing-product-message">
                            Memuat perlengkapan...
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="landing-product-grid">
                            {filteredProducts.map((product) => (
                                <div
                                    className="landing-product-card"
                                    key={product.id}
                                >
                                    <div className="landing-product-image-wrap">
                                        <img
                                            src={product.img}
                                            alt={product.name}
                                            className="landing-product-image"
                                        />

                                        <span className="landing-product-badge">
                                            {product.badge}
                                        </span>
                                    </div>

                                    <div className="landing-product-body">
                                        <h3>{product.name}</h3>

                                        <p className="landing-product-desc">
                                            {product.desc}
                                        </p>

                                        <p className="landing-product-stock">
                                            Stok tersedia:{" "}
                                            <strong>{product.stock}</strong>
                                        </p>

                                        <div className="landing-product-bottom">
                                            <div>
                                                <span className="landing-product-price">
                                                    {formatPrice(product.price)}
                                                </span>

                                                <span className="landing-product-unit">
                                                    / hari
                                                </span>
                                            </div>

                                            {product.stock > 0 ? (
                                                <Link
                                                    to="/login"
                                                    className="landing-product-btn"
                                                >
                                                    Pesan
                                                </Link>
                                            ) : (
                                                <span className="landing-product-empty">
                                                    Habis
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="landing-product-message">
                            Produk tidak ditemukan.
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default LandingPage;