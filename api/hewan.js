import formidable from "formidable";
import fs from "fs";
import cloudinary from "../lib/cloudinary.js";

export const config = {
    api: {
        bodyParser: false, // penting! agar Next.js tidak memproses body
    }
};

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

    if (method === "GET") {
        const { asalBenua } = req.query;
        if (asalBenua) {
            const hasil = hewan.filter(h => h.asalBenua.toLowerCase() === asalBenua.toLowerCase());
            return res.status(200).json({ status: 'success', data: hasil });
        }
        return res.status(200).json({ status: 'success', data: hewan });
    }

    if (method === "POST" || method === "PUT") {
        const form = new formidable.IncomingForm({ keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Form parsing error' });
            }

            const { nama, asalBenua, id } = fields;
            const gambar = files.gambar;

            if (!nama || !asalBenua || !gambar) {
                return res.status(400).json({ status: 'error', message: 'Semua field harus diisi' });
            }

            try {
                const uploadRes = await cloudinary.uploader.upload(gambar.filepath, {
                    folder: "hewan"
                });

                if (method === "POST") {
                    const newData = {
                        id: ++idTerakhir,
                        nama,
                        asalBenua,
                        gambar: uploadRes.secure_url
                    };

                    hewan.push(newData);
                    return res.status(201).json({ status: 'success', data: newData });

                } else if (method === "PUT") {
                    const index = hewan.findIndex(h => h.id === parseInt(id));
                    if (index === -1) {
                        return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
                    }

                    hewan[index] = {
                        id: parseInt(id),
                        nama,
                        asalBenua,
                        gambar: uploadRes.secure_url
                    };

                    return res.status(200).json({ status: 'success', data: hewan[index] });
                }

            } catch (uploadErr) {
                return res.status(500).json({ status: 'error', message: 'Gagal upload gambar', error: uploadErr.message });
            }
        });

        return; // supaya tidak lanjut ke bawah
    }

    if (method === "DELETE") {
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
