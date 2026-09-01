const API_URL = 'http://127.0.0.1:8000/api';

// ================================
// AMBIL SEMUA PESANAN
// ================================
export async function fetchOrders() {
    const response = await fetch(`${API_URL}/orders`);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || 'Gagal mengambil data pesanan'
        );
    }

    return result.data;
}


// ================================
// BUAT PESANAN BARU
// ================================
export async function createOrder(orderData) {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },

        body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
        console.error(result);

        throw new Error(
            result.message || 'Gagal membuat pesanan'
        );
    }

    return result.data;
}


// ================================
// AMBIL DETAIL PESANAN
// ================================
export async function fetchOrderById(id) {
    const response = await fetch(
        `${API_URL}/orders/${id}`
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || 'Pesanan tidak ditemukan'
        );
    }

    return result.data;
}


// ================================
// UPDATE PESANAN
// ================================
export async function updateOrder(id, orderData) {
    const response = await fetch(
        `${API_URL}/orders/${id}`,
        {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },

            body: JSON.stringify(orderData),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || 'Gagal memperbarui pesanan'
        );
    }

    return result.data;
}