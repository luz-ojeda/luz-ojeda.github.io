export const languages = {
    en: "English",
    es: "Español",
};

export const defaultLang = "en";

export const ui = {
    en: {
        "nav.blog": "blog",
        "nav.microblog": "microblog",
        "nav.reading": "reading",
        "nav.pictures": "pictures",
        "nav.likes": "likes",
        "nav.now": "now",
        "nav.projects": "projects",
        "nav.resume": "resume",
        "nav.about": "about",
        "by": "by",
        "currently reading": "currently reading",
        "read": "read",
        "repository": "repository",
        "open navbar": "open navbar",
        "page not found": "page not found",
        "highlight": "highlight",
        "table of contents": "table of contents"
    },
    es: {
        "nav.blog": "blog",
        "nav.microblog": "microblog",
        "nav.reading": "leyendo",
        "nav.pictures": "fotos",
        "nav.likes": "me gusta",
        "nav.now": "ahora",
        "nav.projects": "proyectos",
        "nav.resume": "cv",
        "nav.about": "sobre mí",
        "by": "de",
        "currently reading": "leyendo",
        "read": "leído",
        "repository": "repositorio",
        "open navbar": "abrir menú de navegación",
        "page not found": "página no encontrada",
        "highlight": "cita",
        "table of contents": "índice"
    },
} as const;

export const showDefaultLang = false;

export const routes: { [key: string]: { [key: string]: string } } = {
    es: {
        about: "sobre",
        likes: "me-gusta",
        blog: "blog",
        microblog: "microblog",
        reading: "leyendo",
        pictures: "fotos",
        now: "ahora",
        projects: "proyectos",
        resume: "cv",
    },
    en: {
        about: "about",
        likes: "likes",
        blog: "blog",
        microblog: "microblog",
        reading: "reading",
        pictures: "pictures",
        now: "now",
        projects: "projects",
        resume: "resume",
    },
};