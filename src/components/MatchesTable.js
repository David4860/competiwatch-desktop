import React, { Component } from 'react'
import MatchTableRow from './MatchTableRow'
import Season from '../models/Season'

class MatchesTable extends Component {
  constructor(props) {
    super(props)
    this.matchRowsByID = {}
  }

  matchRankChangesByResult = () => {
    const results = ['win', 'loss']
    const rankChanges = { draw: [] }

    for (const result of results) {
      rankChanges[result] = []

      const matchesWithResult = this.props.matches.filter(match => match.result === result)
      const rankChangesForResult = matchesWithResult
        .map(match => match.rankChange)
        .filter(rankChange => typeof rankChange === 'number').sort()

      for (const rankChange of rankChangesForResult) {
        if (rankChanges[result].indexOf(rankChange) < 0) {
          rankChanges[result].push(rankChange)
        }
      }
    }

    return rankChanges
  }

  showThrowerLeaverColumn = () => {
    const matches = this.props.matches
      .filter(match => match.allyThrower || match.allyLeaver ||
                       match.enemyThrower || match.enemyLeaver)
    return matches.length > 0
  }

  showPlayOfTheGameColumn = () => {
    return this.props.matches.filter(match => match.playOfTheGame).length > 0
  }

  showJoinedVoiceColumn = () => {
    return this.props.matches.filter(match => match.joinedVoice).length > 0
  }

  showCommentColumn = () => {
    return this.props.matches
      .filter(match => match.comment && match.comment.trim().length > 0).length > 0
  }

  showDayTimeColumn = () => {
    return this.props.matches.filter(match => match.dayOfWeek && match.timeOfDay).length > 0
  }

  showHeroesColumn = () => {
    return this.props.matches.filter(match => match.heroList.length > 0).length > 0
  }

  showGroupColumn = () => {
    return this.props.matches
      .filter(match => match.groupList.length > 0 || match.groupSize > 1).length > 0
  }

  showRoleColumn = () => {
    const { matches, season } = this.props
    return season >= Season.roleQueueSeasonStart &&
      matches.filter(match => typeof match.role === 'string').length > 0
  }

  getLongestWinStreak = () => {
    const winStreaks = this.props.matches.filter(match => typeof match.winStreak === 'number')
      .map(match => match.winStreak)
    if (winStreaks.length < 1) {
      return 0
    }
    return Math.max(...winStreaks)
  }

  getLongestLossStreak = () => {
    const lossStreaks = this.props.matches.filter(match => typeof match.lossStreak === 'number')
      .map(match => match.lossStreak)
    if (lossStreaks.length < 1) {
      return 0
    }
    return Math.max(...lossStreaks)
  }

  componentDidMount() {
    const { scrollToMatch, scrollToMatchID } = this.props

    if (!scrollToMatch) {
      return
    }

    const scrollToComponent = require('react-scroll-to-component')

    if (scrollToMatchID) {
      scrollToComponent(this.matchRowsByID[scrollToMatchID])
    } else {
      scrollToComponent(this.lastMatchRow)
    }
  }

  render() {
    const { matches, onEdit, theme } = this.props
    const rankChanges = this.matchRankChangesByResult()
    const showThrowerLeaver = this.showThrowerLeaverColumn()
    const showPlayOfTheGame = this.showPlayOfTheGameColumn()
    const showJoinedVoice = this.showJoinedVoiceColumn()
    const showComment = this.showCommentColumn()
    const showDayTime = this.showDayTimeColumn()
    const showHeroes = this.showHeroesColumn()
    const showGroup = this.showGroupColumn()
    const showRole = this.showRoleColumn()
    const longestWinStreak = this.getLongestWinStreak()
    const longestLossStreak = this.getLongestLossStreak()

    return (
      <table className="width-full">
        <thead>
          <tr className="match-header-row">
            <th
              className="match-header hide-sm"
            >#</th>
            {showRole && (
              <th
                className="match-header hide-sm"
              >Role</th>
            )}
            <th
              className="match-header hide-sm"
            >Win/Loss</th>
            <th
              className="match-header no-wrap"
            >+/- SR</th>
            <th
              className="match-header"
            >Rank</th>
            <th
              className="match-header hide-sm no-wrap"
            >Streak</th>
            <th
              className="match-header"
            >Map</th>
            {showComment ? (
              <th
                className="match-header hide-sm"
              >Comment</th>
            ) : null}
            {showHeroes ? (
              <th
                className="match-header hide-sm"
              >Heroes</th>
            ) : null}
            {showDayTime ? (
              <th
                className="match-header hide-sm"
              >Day/Time</th>
            ) : null}
            {showGroup ? (
              <th
                className="match-header hide-sm"
              >Group</th>
            ) : null}
            {showThrowerLeaver ? (
              <th
                className="match-header hide-sm tooltipped tooltipped-n"
                aria-label="Throwers and leavers"
              >
                <span role="img" aria-label="Sad face">😢</span>
              </th>
            ) : null}
            {showPlayOfTheGame || showJoinedVoice ? (
              <th
                className="match-header hide-sm"
              >Other</th>
            ) : null}
            <th
              className="match-header options-header"
            ></th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, i) => {
            const isLast = i === matches.length - 1
            const matchRankChanges = rankChanges[match.result] || []

            return (
              <MatchTableRow
                key={match._id}
                match={match}
                index={i}
                theme={theme}
                ref={row => {
                  this.matchRowsByID[match._id] = row
                  if (isLast) {
                    this.lastMatchRow = row
                  }
                }}
                rankChanges={matchRankChanges}
                isLast={isLast}
                onEdit={onEdit}
                priorMatches={matches.slice(0, i)}
                showThrowerLeaver={showThrowerLeaver}
                showPlayOfTheGame={showPlayOfTheGame}
                showJoinedVoice={showJoinedVoice}
                showDayTime={showDayTime}
                showComment={showComment}
                showHeroes={showHeroes}
                showGroup={showGroup}
                showRole={showRole}
                longestWinStreak={longestWinStreak}
                longestLossStreak={longestLossStreak}
              />
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default MatchesTable
