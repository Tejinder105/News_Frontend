export const navItems = [
    { name: "Home", path: "/" },
    { name: "Ratia", path: "/category/ratia" },
    {
        name: "Fatehabad",
        path: "/category/fatehabad",
        children: [
            { name: "Fatehabad", path: "/category/fatehabad" },
            { name: "Hisar", path: "/category/hisar" },
            { name: "Tohana", path: "/category/tohana" },
        ]
    },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
];