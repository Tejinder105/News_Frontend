export const navItems = [
    { name: "Home", path: "/" },
    { name: "Ratia", path: "/location/ratia" },
    {
        name: "Fatehabad",
        path: "/location/fatehabad",
        children: [
            { name: "Fatehabad", path: "/location/fatehabad" },
            { name: "Hisar", path: "/location/hisar" },
            { name: "Tohana", path: "/location/tohana" },
        ]
    },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
];