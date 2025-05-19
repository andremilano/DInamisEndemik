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
    const { asalBenua } = req.query;

    if (asalBenua) {
        const hasilFilter = hewan.filter(h =>
            h.asalBenua.toLowerCase() === asalBenua.toLowerCase()
        );
        res.status(200).json({ status: 'success', data: hasilFilter });
    } else {
        res.status(200).json({ status: 'success', data: hewan });
    }
}
