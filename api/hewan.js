import formidable from "formidable";
import cloudinary from "../lib/cloudinary.js";

export const config = {
    api: {
        bodyParser: false,
    },
};

let hewan = [
    {
        id: 1,
        nama: "Harimau",
        asalBenua: "Asia",
        gambar: "https://andremilano.github.io/endemik/images/harimau.jpg",
    },
    {
        id: 2,
        nama: "Panda",
        asalBenua: "Asia",
        gambar: "https://andremilano.github.io/endemik/images/panda.jpg",
    },
];

let idTerakhir = 2;

function parseForm(req) {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm({
            keepExtensions: true,
            multiples: false,
            maxFileSize: 10 * 1024 * 1024, // optional: 10MB
        });

        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
}

export default async function handler(req, res) {
    const { method } = req;

    if (method === "GET") {
        const { asalBenua } = req.query;
        if (asalBenua) {
            const hasil = hewan.filter(h => h.asalBenua.toLowerCase() === asalBenua.toLowerCase());
            return res.status(200).json({ status: "success", data: hasil });
        }
        return res.status(200).json({ status: "success", data: hewan });
    }

    if (method === "POST" || method === "PUT") {
        try {
            const { fields, files } = await parseForm(req);
            const { nama, asalBenua, id } = fields;
            const gambar = files.gambar;

            if (!nama || !asalBenua || !gambar || !gambar.filepath) {
                return res.status(400).json({ status: "error", message: "Semua field harus diisi dan gambar valid" });
            }

            const uploadRes = await cloudinary.uploader.upload(gambar.filepath, {
                upload_preset: "my_preset",
                folder: "hewan",
            });

            if (method === "POST") {
                const newData = {
                    id: ++idTerakhir,
                    nama,
                    asalBenua,
                    gambar: uploadRes.secure_url,
                };
                hewan.push(newData);
                return res.status(201).json({ status: "success", data: newData });
            }

            if (method === "PUT") {
                const index = hewan.findIndex(h => h.id === parseInt(id));
                if (index === -1) {
                    return res.status(404).json({ status: "error", message: "Data tidak ditemukan" });
                }

                hewan[index] = {
                    id: parseInt(id),
                    nama,
                    asalBenua,
                    gambar: uploadRes.secure_url,
                };
                return res.status(200).json({ status: "success", data: hewan[index] });
            }
        } catch (error) {
            console.error("Upload/Parsing error:", error);
            return res.status(500).json({ status: "error", message: "Internal server error", error: error.message });
        }
    }

    if (method === "DELETE") {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ status: "error", message: "ID harus disertakan" });
        }

        const index = hewan.findIndex(h => h.id === parseInt(id));
        if (index === -1) {
            return res.status(404).json({ status: "error", message: "Data tidak ditemukan" });
        }

        const deleted = hewan.splice(index, 1);
        return res.status(200).json({ status: "success", data: deleted[0] });
    }

    res.status(405).json({ status: "error", message: "Method not allowed" });
}
