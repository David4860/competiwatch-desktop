import React from "react";
import HeroUtil from "../models/HeroUtil";

const knownHeroes = [
  "ana",
  "ashe",
  "baptiste",
  "bastion",
  "brigitte",
  "doomfist",
  "dva",
  "genji",
  "hanzo",
  "junkrat",
  "lucio",
  "mccree",
  "mei",
  "mercy",
  "moira",
  "orisa",
  "pharah",
  "reaper",
  "reinhardt",
  "roadhog",
  "sigma",
  "soldier76",
  "sombra",
  "symmetra",
  "torbjorn",
  "tracer",
  "widowmaker",
  "winston",
  "wrecking-ball",
  "zarya",
  "zenyatta"
];

interface Props {
  hero: string;
  className?: string;
  size?: number;
}

const HeroImage = (props: Props) => {
  const { hero, className, size } = props;
  const slug = HeroUtil.slugify(hero);
  if (knownHeroes.indexOf(slug) < 0) {
    return <span>{hero}</span>;
  }

  const src = require(`../images/heroes/${slug}.png`);

  return (
    <img
      src={src}
      alt={hero}
      className={className}
      width={size || 20}
      height={size || 20}
    />
  );
};

export default HeroImage;
