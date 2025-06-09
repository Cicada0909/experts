const search = "/search";

const expert = "/expert/:id";
const expertDate = "/expert/:id/:date";

const expertRoutes = {
    expert: expert,
};

const searchRoutes = {
    search: search,
};

const categories = "/categories";
const category = ":subtitle";
const categoryExpert = ":subtitle/expert/:id";
const categoriesExpert = "expert/:id";

const categoriesRoutes = {
    categories: categories,
    category: category,
    categoryExpert: categoryExpert,
    categoriesExpert: categoriesExpert,
};

const favorites = "/favorites";
const favoritesExpert = "/favorites/expert/:id";

const favoritesRoutes = {
    favorites: favorites,
    favoritesExpert: favoritesExpert,
};

const profile = "/profile";
const register = "/profile/register"
const slots = "/profile/slots"

const profileRoutes = {
    profile: profile,
    register: register,
    slots: slots,
};

export const pageRoutes = {
    searchRoutes,
    categoriesRoutes,
    favoritesRoutes,
    profileRoutes,
    expertRoutes,
    register,
    expertDate,
};
