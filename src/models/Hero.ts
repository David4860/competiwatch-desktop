export type HeroDetailedRole =
  | "DPS"
  | "Flanker"
  | "Hitscan"
  | "Defense"
  | "Off-tank"
  | "Main Tank"
  | "Main Healer"
  | "Off-healer";

export type HeroRole = "Damage" | "Tank" | "Support";

type HeroDetailedRoleToHeroes = {
  [role in HeroDetailedRole]: Hero[];
};

type HeroRoleToHeroes = {
  [role in HeroRole]: Hero[];
};

type HeroToNumber = {
  [hero in Hero]?: number;
};

export type Hero =
  | "Ana"
  | "Ashe"
  | "Baptiste"
  | "Bastion"
  | "Brigitte"
  | "D.Va"
  | "Doomfist"
  | "Genji"
  | "Hanzo"
  | "Junkrat"
  | "Lúcio"
  | "McCree"
  | "Mei"
  | "Mercy"
  | "Moira"
  | "Orisa"
  | "Pharah"
  | "Reaper"
  | "Reinhardt"
  | "Roadhog"
  | "Sigma"
  | "Soldier: 76"
  | "Sombra"
  | "Symmetra"
  | "Torbjörn"
  | "Tracer"
  | "Widowmaker"
  | "Winston"
  | "Wrecking Ball"
  | "Zarya"
  | "Zenyatta";

export const HeroDetailedRoles: HeroDetailedRole[] = [
  "DPS",
  "Flanker",
  "Hitscan",
  "Defense",
  "Off-tank",
  "Main Tank",
  "Main Healer",
  "Off-healer"
];

export const Heroes: Hero[] = [
  "Ana",
  "Ashe",
  "Baptiste",
  "Bastion",
  "Brigitte",
  "D.Va",
  "Doomfist",
  "Genji",
  "Hanzo",
  "Junkrat",
  "Lúcio",
  "McCree",
  "Mei",
  "Mercy",
  "Moira",
  "Orisa",
  "Pharah",
  "Reaper",
  "Reinhardt",
  "Roadhog",
  "Sigma",
  "Soldier: 76",
  "Sombra",
  "Symmetra",
  "Torbjörn",
  "Tracer",
  "Widowmaker",
  "Winston",
  "Wrecking Ball",
  "Zarya",
  "Zenyatta"
];

export const HeroesByType: HeroDetailedRoleToHeroes = {
  DPS: ["Pharah", "Reaper", "Doomfist", "Junkrat"],
  Flanker: ["Genji", "Sombra", "Tracer"],
  Hitscan: ["Ashe", "McCree", "Soldier: 76", "Widowmaker"],
  "Main Tank": ["Orisa", "Reinhardt", "Sigma", "Winston"],
  "Off-tank": ["D.Va", "Roadhog", "Wrecking Ball", "Zarya"],
  Defense: ["Bastion", "Hanzo", "Mei", "Symmetra", "Torbjörn"],
  "Main Healer": ["Ana", "Baptiste", "Mercy", "Moira"],
  "Off-healer": ["Brigitte", "Lúcio", "Zenyatta"]
};

export const HeroesByRole: HeroRoleToHeroes = {
  Tank: [
    "D.Va",
    "Orisa",
    "Reinhardt",
    "Roadhog",
    "Sigma",
    "Winston",
    "Wrecking Ball",
    "Zarya"
  ],
  Damage: [
    "Pharah",
    "Reaper",
    "Doomfist",
    "Junkrat",
    "Genji",
    "Sombra",
    "Tracer",
    "Ashe",
    "McCree",
    "Soldier: 76",
    "Widowmaker",
    "Bastion",
    "Hanzo",
    "Mei",
    "Symmetra",
    "Torbjörn"
  ],
  Support: [
    "Ana",
    "Baptiste",
    "Brigitte",
    "Lúcio",
    "Mercy",
    "Moira",
    "Zenyatta"
  ]
};

export const HeroFirstSeasons: HeroToNumber = {
  Moira: 7,
  Brigitte: 10,
  Orisa: 4,
  Doomfist: 5,
  Sombra: 2,
  "Wrecking Ball": 11,
  Ashe: 13,
  Baptiste: 15,
  Sigma: 18
};
