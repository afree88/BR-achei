const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const catalog = require("./catalog.json");

const builder = new addonBuilder({
    id: "org.achei.catalog",
    version: "1.0.0",
    name: "BR Achei - Recomendações",
    description: "Catálogo com as recomendações do BR Achei - Os melhores BR filmes, sereis, BR Series e desenhos brasileiros",
    logo: "https://i.imgur.com/gDysxlK.png",
    resources: ["catalog", "meta"],
    types: ["movie", "series"],
    catalogs: [
        {
            type: "movie",
            id: "BR Filmes",
            name: "BR Filmes",
            extra: [
                { name: "search", isRequired: false },
                {
                    name: "genre",
                    isRequired: false,
                    options: [
                        "Mazzaropi",
                        "Abraccine: 100 Melhores Animações Nacionais", "Abraccine: 100 Melhores Curtas Nacionais", "Abraccine: 100 Melhores Documentários", "Abraccine: 100 Melhores BR Filmes Nacionais", "Animação", "Aventura", "Ação", "Biografia", "Comédia", "Curta-Metragem", "Documentário", "Drama", "Esporte", "Esportes", "Família", "Fantasia", "Faroeste", "Ficção científica", "Guerra", "História", "Mazzaropi", "Mistério", "Musical", "Novelas BR", "Policial", "Romance", "Suspense", "Terror"

                    ]
                }
            ]
        },
        {
            type: "series",
            id: "BR Series",
            name: "BR Series",
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
    if (type === "movie" && id === "BR Filmes") {
        results = results.filter(i => i.type === "movie");
    } else if (type === "series" && id === "BR Series") {
        results = results.filter(i => i.type === "series");
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
    const movie = catalog.find(m => m.id === id);
    return Promise.resolve({ meta: movie || null });
});

serveHTTP(builder.getInterface(), { port: 7000 });
