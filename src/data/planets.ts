export interface PlanetData {
  name: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  color: string;
  size: number; // visual size in px
  orbitRadius: number; // visual orbit radius in px
  description: string;
}

export const planets: PlanetData[] = [
  {
    name: "Mercury",
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    color: "#b5b5b5",
    size: 8,
    orbitRadius: 70,
    description: "The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature variations."
  },
  {
    name: "Venus",
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    color: "#e8cda0",
    size: 12,
    orbitRadius: 100,
    description: "The hottest planet due to its thick CO₂ atmosphere. It rotates backwards compared to most planets."
  },
  {
    name: "Earth",
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    color: "#4da6ff",
    size: 13,
    orbitRadius: 135,
    description: "Our home planet — the only known world with liquid water on its surface and life."
  },
  {
    name: "Mars",
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    color: "#e07040",
    size: 10,
    orbitRadius: 175,
    description: "The Red Planet, home to the tallest volcano (Olympus Mons) and the deepest canyon in the Solar System."
  },
  {
    name: "Jupiter",
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    color: "#d4a574",
    size: 28,
    orbitRadius: 230,
    description: "The largest planet, a gas giant with a Great Red Spot storm that has raged for centuries."
  },
  {
    name: "Saturn",
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    color: "#f0d890",
    size: 24,
    orbitRadius: 290,
    description: "Famous for its stunning ring system made of ice and rock particles. It could float in water!"
  },
  {
    name: "Uranus",
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    color: "#7de8e8",
    size: 18,
    orbitRadius: 345,
    description: "An ice giant that rotates on its side. It has a faint ring system and 27 known moons."
  },
  {
    name: "Neptune",
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    color: "#4466ff",
    size: 17,
    orbitRadius: 395,
    description: "The windiest planet with speeds up to 2,100 km/h. It has a vivid blue color from methane."
  }
];
