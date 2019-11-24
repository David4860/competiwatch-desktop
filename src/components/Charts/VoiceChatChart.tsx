import React from "react";
import { Bar } from "react-chartjs-2";
import Color from "../../models/Color";
import ChartUtils from "../../models/ChartUtils";
import Match from "../../models/Match";

interface Props {
  matches: Match[];
  season: number;
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    yAxes: [{ ticks: { callback: ChartUtils.wholeTicks } }]
  }
};

const VoiceChatChart = ({ matches, season }: Props) => {
  const getWins = () => {
    let joinedVoiceCount = 0;
    let didNotJoinVoiceCount = 0;
    const wins = matches.filter(match => match.isWin());

    for (const match of wins) {
      if (match.joinedVoice) {
        joinedVoiceCount++;
      } else {
        didNotJoinVoiceCount++;
      }
    }

    return [joinedVoiceCount, didNotJoinVoiceCount];
  };

  const getLosses = () => {
    let joinedVoiceCount = 0;
    let didNotJoinVoiceCount = 0;
    const losses = matches.filter(match => match.isLoss());

    for (const match of losses) {
      if (match.joinedVoice) {
        joinedVoiceCount++;
      } else {
        didNotJoinVoiceCount++;
      }
    }

    return [joinedVoiceCount, didNotJoinVoiceCount];
  };

  const data = {
    labels: ["Joined Voice", "Did Not Join Voice"],
    datasets: [
      {
        backgroundColor: Color.transparentWin,
        borderColor: Color.win,
        borderWidth: 2,
        label: "Wins",
        data: getWins()
      },
      {
        backgroundColor: Color.transparentLoss,
        borderColor: Color.loss,
        borderWidth: 2,
        label: "Losses",
        data: getLosses()
      }
    ]
  };

  return (
    <div>
      <h3 className="h3 flex-justify-center d-flex flex-items-center mb-2">
        Voice Chat
        <span className="text-gray text-normal h4 d-inline-block ml-2">
          Season {season}
        </span>
      </h3>
      <div className="small-chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default VoiceChatChart;
