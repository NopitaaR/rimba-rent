const API_URL = 'http://127.0.0.1:8000/api';


// ==========================================
// AMBIL SEMUA PESANAN
// ==========================================
export async function fetchOrders() {
    const response = await fetch(
        `${API_URL}/orders`
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            'Gagal mengambil data pesanan'
        );
    }

    return result.data;
}


// ==========================================
// BUAT PESANAN + BUKTI PEMBAYARAN
// ==========================================
export async function createOrder(orderData) {

    const formData = new FormData();


    formData.append(
        'user_id',
        orderData.user_id
    );

    formData.append(
        'start_date',
        orderData.start_date
    );

    formData.append(
        'end_date',
        orderData.end_date
    );

    formData.append(
        'duration_days',
        orderData.duration_days
    );


    // ======================================
    // ITEMS
    // ======================================

    orderData.items.forEach((item, index) => {

        formData.append(
            `items[${index}][product_id]`,
            item.product_id
        );

        formData.append(
            `items[${index}][quantity]`,
            item.quantity
        );

    });


    // ======================================
    // BUKTI PEMBAYARAN
    // ======================================

    if (orderData.payment_proof) {

        formData.append(
            'payment_proof',
            orderData.payment_proof
        );

    }


    const response = await fetch(
        `${API_URL}/orders`,
        {
            method: 'POST',

            headers: {
                Accept: 'application/json',
            },

            body: formData,
        }
    );


    const result = await response.json();


    if (!response.ok) {

        console.error(
            'Order API Error:',
            result
        );

        throw new Error(
            result.message ||
            'Gagal membuat pesanan'
        );
    }


    return result.data;
}


// ==========================================
// DETAIL PESANAN
// ==========================================
export async function fetchOrderById(id) {

    const response = await fetch(
        `${API_URL}/orders/${id}`
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            'Pesanan tidak ditemukan'
        );
    }

    return result.data;
}


// ==========================================
// UPDATE PESANAN
// ==========================================
export async function updateOrder(
    id,
    orderData
) {

    const response = await fetch(
        `${API_URL}/orders/${id}`,
        {
            method: 'PUT',

            headers: {
                'Content-Type':
                    'application/json',

                Accept:
                    'application/json',
            },

            body: JSON.stringify(
                orderData
            ),
        }
    );


    const result =
        await response.json();


    if (!response.ok) {
        throw new Error(
            result.message ||
            'Gagal memperbarui pesanan'
        );
    }


    return result.data;
}

// ==========================================
// VERIFIKASI PEMBAYARAN
// ==========================================
export async function verifyPayment(orderId) {
    const response = await fetch(
        `${API_URL}/orders/${orderId}/verify-payment`,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            'Gagal memverifikasi pembayaran'
        );
    }

    return result.data;
}


// ==========================================
// TOLAK PEMBAYARAN
// ==========================================
export async function rejectPayment(orderId) {
    const response = await fetch(
        `${API_URL}/orders/${orderId}/reject-payment`,
        {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            'Gagal menolak pembayaran'
        );
    }

    return result.data;
}