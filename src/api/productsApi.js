const API_URL = 'http://127.0.0.1:8000/api';

// ================================
// AMBIL SEMUA PRODUK
// ================================
export async function fetchProducts() {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
        throw new Error('Gagal mengambil data produk');
    }

    const result = await response.json();

    return result.data;
}

// ================================
// TAMBAH PRODUK
// ================================
export async function createProduct(productData) {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            name: productData.name,
            category: productData.category,
            price: Number(productData.price),
            stock: Number(productData.stock),
            image: productData.img,
            description: productData.description,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || 'Gagal menambahkan produk'
        );
    }

    return result.data;
}

// ================================
// AMBIL DETAIL 1 PRODUK
// ================================
export async function fetchProductById(id) {
    const response = await fetch(`${API_URL}/products/${id}`);

    if (!response.ok) {
        throw new Error('Produk tidak ditemukan');
    }

    const result = await response.json();

    return result.data;
}

// ================================
// UPDATE PRODUK
// ================================
export async function updateProductApi(id, productData) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            name: productData.name,
            category: productData.category,
            price: Number(productData.price),
            stock: Number(productData.stock),
            image: productData.img,
            description: productData.description,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || 'Gagal memperbarui produk'
        );
    }

    return result.data;
}

// ================================
// HAPUS PRODUK
// ================================
export async function deleteProductApi(id) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || 'Gagal menghapus produk'
        );
    }

    return result;
}