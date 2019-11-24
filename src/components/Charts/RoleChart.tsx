import React from 'react'
import { Radar } from 'react-chartjs-2'
import Color from '../../models/Color'
import Match from '../../models/Match'
import { HeroesByType, HeroDetailedRoles, Hero, HeroDetailedRole } from '../../models/Hero'

const roleFor = (hero: Hero): HeroDetailedRole | undefined => {
  if (HeroesByType.DPS.includes(hero)) {
    return 'DPS'
  }
  if (HeroesByType['Main Healer'].includes(hero)) {
    return 'Main Healer'
  }
  if (HeroesByType['Off-healer'].includes(hero)) {
    return 'Off-healer'
  }
  if (HeroesByType.Flanker.includes(hero)) {
    return 'Flanker'
  }
  if (HeroesByType.Defense.includes(hero)) {
    return 'Defense'
  }
  if (HeroesByType.Hitscan.includes(hero)) {
    return 'Hitscan'
  }
  if (HeroesByType['Main Tank'].includes(hero)) {
    return 'Main Tank'
  }
  if (HeroesByType['Off-tank'].includes(hero)) {
    return 'Off-tank'
  }
}

interface Props {
  matches: Match[];
  season: number;
  theme: string;
}

type Counts = {
  [role: string]: number;
}

const getCountsByRole = (filteredMatches: Match[]) => {
  const countsByRole: Counts = {}

  for (const match of filteredMatches) {
    for (const hero of match.heroList) {
      const detailedRole = roleFor(hero);
      if (detailedRole) {
        countsByRole[detailedRole] = (countsByRole[detailedRole] || 0) + 1;
      }
    }
  }

  return Object.values(countsByRole)
};

const borderWidth = 2
const pointRadius = 3
const pointHoverRadius = 6
const pointBorderWidth = 2
const lineTension = 0.1;

const RoleChart = ({ matches, season, theme }: Props) => {
  const winCounts = getCountsByRole(matches.filter(match => match.isWin()))
  const lossCounts = getCountsByRole(matches.filter(match => match.isLoss()))
  let maxCount = Math.max(...winCounts.concat(lossCounts))
  maxCount = maxCount + Math.floor(maxCount * 0.1)
  const isDarkTheme = theme === 'dark'
  const options = {
    responsive: true, maintainAspectRatio: false,
    legend: { position: 'left' },
    scale: {
      ticks: {
        showLabelBackdrop: false,
        beginAtZero: true,
        maxTicksLimit: 3,
        min: 0,
        max: maxCount,
        display: false
      },
      gridLines: false,
      angleLines: {
        display: true,
        lineWidth: 0.5,
        color: isDarkTheme ? Color.darkThemeLine : Color.lightThemeLine
      },
      pointLabels: { fontSize: 14 }
    }
  }
  const pointBackgroundColor = isDarkTheme ? 'rgba(36, 41, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)'
  const data = {
    labels: HeroDetailedRoles,
    datasets: [
      {
        label: '# Wins',
        backgroundColor: Color.veryTransparentWin,
        pointBackgroundColor,
        pointBorderColor: Color.win,
        pointHoverBorderColor: Color.winBorder,
        pointHoverBackgroundColor: Color.win,
        borderColor: Color.win,
        borderWidth,
        pointRadius,
        pointHoverRadius,
        pointBorderWidth,
        lineTension,
        data: winCounts
      },
      {
        label: '# Losses',
        backgroundColor: Color.veryTransparentLoss,
        pointBackgroundColor,
        pointBorderColor: Color.loss,
        pointHoverBorderColor: Color.lossBorder,
        pointHoverBackgroundColor: Color.loss,
        borderColor: Color.loss,
        borderWidth,
        pointRadius,
        pointHoverRadius,
        pointBorderWidth,
        lineTension,
        data: lossCounts
      }
    ]
  }

  return (
    <div>
      <h3 className="h3 flex-justify-center d-flex flex-items-center mb-2">
        Wins/Losses by Role
        <span className="text-gray text-normal h4 d-inline-block ml-2">Season {season}</span>
      </h3>
      <div className="tall-chart-container">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default RoleChart;
