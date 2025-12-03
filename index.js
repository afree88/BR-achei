const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const catalog = require("./catalog.json");

const builder = new addonBuilder({
    id: "org.achei.catalog",
    version: "1.0.0",
    name: "BR Achei - Recomendações",
    description: "Catálogo com as recomendações do BR Achei - Os melhores filmes, sereis, Series e desenhos brasileiros",
    logo: "https://i.imgur.com/gDysxlK.png",
    resources: ["catalog", "meta"],
    types: ["BR Filmes", "BR Series"],
    catalogs: [
        {
            type: "BR Filmes",
            id: "Filmes",
            name: "Filmes",
            extra: [
                { name: "search", isRequired: false },
                {
                    name: "genre",
                    isRequired: false,
                    options: [
                        "Mazzaropi",
                        "Abraccine: 100 Melhores Animações Nacionais", "Abraccine: 100 Melhores Curtas Nacionais", "Abraccine: 100 Melhores Documentários", "Abraccine: 100 Melhores Filmes Nacionais", "Animação", "Aventura", "Ação", "Biografia", "Comédia", "Curta-Metragem", "Documentário", "Drama", "Esporte", "Esportes", "Família", "Fantasia", "Faroeste", "Ficção científica", "Guerra", "História", "Mazzaropi", "Mistério", "Musical", "Novelas BR", "Policial", "Romance", "Suspense", "Terror"

                    ]
                }
            ]
        },
        {
            type: "BR Series",
            id: "Series",
            name: "Series",
            extra: [
                { name: "search", isRequired: false },
                {
                    name: "genre",
                    isRequired: false,
                    options: [
                        "Abraccine: 100 Melhores Animações Nacionais", "Animação", "Aventura", "Ação", "Comédia", "Curta-Metragem", "Drama", "Família", "Fantasia", "Faroeste", "Ficção científica", "Guerra", "História", "Mazzaropi", "Mistério", "Musical", "Novelas BR", "Policial", "Romance", "Suspense", "Terror"


                    ]
                }
            ]
        }
    ]
});

builder.defineCatalogHandler(({ type, id, extra }) => {
    console.log("request for catalog: " + type + " " + id);
    let results = catalog;

    // Filter by type and id logic (simplified to just filter by type for now as base)
    if (type === "BR Filmes" && id === "Filmes") {
        results = results.filter(i => i.type === "BR Filmes");
    } else if (type === "BR Series" && id === "Series") {
        results = results.filter(i => i.type === "BR Series");
    } else {
        return Promise.resolve({ metas: [] });
    }

    // Filter by genre if present
    if (extra && extra.genre) {
        results = results.filter(item => item.genres && item.genres.includes(extra.genre));
    }

    // Filter by search if present
    if (extra && extra.search) {
        results = results.filter(item => item.name.toLowerCase().includes(extra.search.toLowerCase()));
    }

    return Promise.resolve({ metas: results });
});

builder.defineMetaHandler(({ type, id }) => {
    console.log("request for meta: " + type + " " + id);
    const Filmes = catalog.find(m => m.id === id);
    return Promise.resolve({ meta: Filmes || null });
});

serveHTTP(builder.getInterface(), { port: 7000 });
