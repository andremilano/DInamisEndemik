const hewan = [
    {
        nama: "Harimau",
        asalBenua: "Asia",
        gambar: "https://andremilano.github.io/endemik/images/harimau.jpg"
    },
    {
        nama: "Panda",
        asalBenua: "Asia",
        gambar: "https://andremilano.github.io/endemik/images/panda.jpg"
    },
    {
        nama: "Kanguru",
        asalBenua: "Australia",
        gambar: "https://andremilano.github.io/endemik/images/kanguru.jpg"
    },
    {
        nama: "Gajah",
        asalBenua: "Afrika",
        gambar: "https://andremilano.github.io/endemik/images/gajah.jpg"
    },
    {
        nama: "Singa",
        asalBenua: "Afrika",
        gambar: "https://andremilano.github.io/endemik/images/singa.jpg"
    },
    {
        nama: "Beruang Kutub",
        asalBenua: "Arktik",
        gambar: "https://andremilano.github.io/endemik/images/beruang.jpg"
    },
    {
        nama: "Rusa Kutub",
        asalBenua: "Arktik",
        gambar: "https://andremilano.github.io/endemik/images/rusa.jpg"
    }
];

export default function handler(req, res) {
    if (req.method === 'GET') {
        const { asalBenua } = req.query;
        if (asalBenua) {
            const hasil = hewan.filter(h => h.asalBenua.toLowerCase() === asalBenua.toLowerCase());
            return res.status(200).json({ status: 'success', data: hasil });
        }
        return res.status(200).json({ status: 'success', data: hewan });
    }

    if (req.method === 'POST') {
        const { nama, asalBenua, gambar } = req.body;

        if (!nama || !asalBenua || !gambar) {
            return res.status(400).json({ status: 'error', message: 'Semua field harus diisi' });
        }

        const baru = { nama, asalBenua, gambar };
        hewan.push(baru);

        return res.status(201).json({ status: 'success', data: baru });
    }

    res.status(405).json({ status: 'error', message: 'Method not allowed' });
}
