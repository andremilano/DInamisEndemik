import cloudinary from "../lib/cloudinary.js";

let hewan = [
    {
        id: 1,
        nama: "Harimau",
        asalBenua: "Asia",
        gambar: "https://andremilano.github.io/endemik/images/harimau.jpg"
    },
    {
        id: 2,
        nama: "Panda",
        asalBenua: "Asia",
        gambar: "https://andremilano.github.io/endemik/images/panda.jpg"
    }
];

let idTerakhir = 2;

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        const { asalBenua } = req.query;

        if (asalBenua) {
            const hasil = hewan.filter(h => h.asalBenua.toLowerCase() === asalBenua.toLowerCase());
            return res.status(200).json({ status: 'success', data: hasil });
        }

        return res.status(200).json({ status: 'success', data: hewan });
    }

    // if (method === 'POST') {
    //     const { nama, asalBenua, gambar } = req.body;

    //     if (!nama || !asalBenua || !gambar) {
    //         return res.status(400).json({ status: 'error', message: 'Semua field harus diisi' });
    //     }

    //     const newData = {
    //         id: ++idTerakhir,
    //         nama,
    //         asalBenua,
    //         gambar
    //     };

    //     hewan.push(newData);
    //     return res.status(201).json({ status: 'success', data: newData });
    // }

    if (method === 'POST') {
        const { nama, asalBenua, gambarBase64 } = req.body;

        if (!nama || !asalBenua || !gambar) {
            return res.status(400).json({ status: 'error', message: 'Semua field harus diisi' });
        }

        try {
            // Upload gambar ke Cloudinary
            const uploadRes = await cloudinary.uploader.upload(gambarBase64, {
                folder: "hewan" // opsional: simpan di folder bernama 'hewan'
            });

            const newData = {
                id: ++idTerakhir,
                nama,
                asalBenua,
                gambar: uploadRes.secure_url // simpan URL hasil upload
            };

            hewan.push(newData);

            return res.status(201).json({ status: 'success', data: newData });

        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Gagal upload gambar', error: error.message });
        }
    }

    if (method === 'PUT') {
        const { id, nama, asalBenua, gambar } = req.body;

        if (!id || !nama || !asalBenua || !gambar) {
            return res.status(400).json({ status: 'error', message: 'Semua field harus diisi' });
        }

        const index = hewan.findIndex(h => h.id === parseInt(id));
        if (index === -1) {
            return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
        }

        hewan[index] = { id: parseInt(id), nama, asalBenua, gambar };
        return res.status(200).json({ status: 'success', data: hewan[index] });
    }

    if (method === 'DELETE') {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ status: 'error', message: 'ID harus disertakan' });
        }

        const index = hewan.findIndex(h => h.id === parseInt(id));
        if (index === -1) {
            return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
        }

        const deleted = hewan.splice(index, 1);
        return res.status(200).json({ status: 'success', data: deleted[0] });
    }

    res.status(405).json({ status: 'error', message: 'Method not allowed' });


}

console.log('Cloudinary config:', {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET ? '***' : null
});  
