import React, { Component } from 'react'
import Header from './components/Header'
import Account from './models/Account'
import Season from './models/Season'
import Setting from './models/Setting'
import AppMenu from './models/AppMenu'
import CsvExporter from './models/CsvExporter'
import FileUtil from './models/FileUtil'
import AccountsPage from './components/AccountsPage'
import MatchesPage from './components/MatchesPage'
import HelpPage from './components/HelpPage'
import MatchCreatePage from './components/MatchCreatePage'
import SeasonsPage from './components/SeasonsPage'
import TrendsPage from './components/TrendsPage'
import AboutPage from './components/AboutPage'
import ImportPage from './components/ImportPage'
import MatchEditPage from './components/MatchEditPage'
import SettingsPage from './components/SettingsPage'
import LoadingPage from './components/LoadingPage'
import './primer.css'
import './ionicons.min.css'
import './App.css'
import { setTitle, showSaveDialog } from "./utils/ipcRenderer";

const latestKnownSeason = 19

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      latestRank: 2500,
      latestSeason: latestKnownSeason,
      scrollToMatch: false,
      theme: 'light'
    }
  }

  onSeasonDelete = deletedNumber => {
    this.setState(prevState => {
      const newState = {}

      if (prevState.latestSeason === deletedNumber) {
        newState.latestSeason = deletedNumber - 1
      }

      if (prevState.activeSeason === deletedNumber) {
        newState.activeSeason = deletedNumber - 1
      }

      return newState
    }, this.updateAppMenu)
  }

  refreshAccounts = () => {
    return new Promise((resolve, reject) => {
      Account.findAll().then(accounts => {
        this.setState(prevState => ({ accounts }), () => {
          this.updateAppMenu()
          resolve()
        })
      })
    })
  }

  refreshLatestSeason = () => {
    Season.latest().then(season => {
      let latestNumber = latestKnownSeason;
      if (season && season.number > latestNumber) {
        latestNumber = season.number;
      }
      this.changeActiveSeason(latestNumber);
    })
  }

  refreshSettings = () => {
    Setting.load().then(settings => {
      this.setState(prevState => {
        const newState = { settings }

        if (!prevState.activeAccountID && settings.defaultAccountID) {
          newState.activeAccountID = settings.defaultAccountID
          newState.activePage = 'matches'
        } else if (!newState.activePage) {
          newState.activePage = 'accounts'
        }

        return newState
      }, this.updateAppMenu)
    })
  }

  updateTheme = () => {
    const { settings } = this.state
    if (!settings) {
      return
    }

    let theme = 'light'
    if (settings.theme === 'dark') {
      theme = 'dark'
    } else if (settings.theme === 'auto' && this.isNighttime()) {
      theme = 'dark'
    }

    this.setState(prevState => ({ theme }))
  }

  componentDidMount() {
    this.refreshLatestSeason()
    this.refreshAccounts().then(() => {
      this.refreshSettings()
    })

    const millisecondsInHour = 3600000
    this.themeInterval = setInterval(() => this.updateTheme(), millisecondsInHour)
  }

  componentWillUnmount() {
    clearInterval(this.themeInterval)
  }

  exportSeasonTo = path => {
    const { activeAccountID, accounts, activeSeason } = this.state
    const account = accounts.filter(acct => acct._id === activeAccountID)[0]
    if (!account) {
      return
    }

    const exporter = new CsvExporter(path, activeSeason, account)
    exporter.export().then(() => {
      console.log(`exported ${account.battletag}'s season ${activeSeason}`, path)
    })
  }

  exportSeason = () => {
    const { accounts, activeAccountID, activeSeason } = this.state
    const account = accounts.filter(acct => acct._id === activeAccountID)[0]
    if (!account) {
      return
    }

    const defaultPath = FileUtil.defaultCsvExportFilename(account.battletag, activeSeason)
    const options = { defaultPath }


    showSaveDialog(options, path => {
      if (path && path.length > 0) {
        this.exportSeasonTo(path);
      }
    });
  }

  changeActivePage = (activePage, val1, val2) => {
    this.setState(prevState => {
      const newState = {
        activePage,
        scrollToMatch: false,
        activeMatchID: null,
        scrollToMatchID: null
      }

      if (activePage === 'log-match') {
        if (typeof val1 === 'number') {
          newState.latestRank = val1
        }

        if (typeof val2 === 'string') {
          newState.latestGroup = val2
        }
      }

      if (activePage === 'accounts') {
        newState.activeAccountID = null
        newState.latestRank = 2500
      }

      if (activePage === 'matches') {
        if (typeof val1 === 'boolean') {
          newState.scrollToMatch = val1
        }
        if (typeof val2 === 'string') {
          newState.scrollToMatchID = val2
        }
      }

      if (activePage === 'edit-match') {
        newState.activeMatchID = val1
      }

      return newState
    }, this.updateAppMenu)
  }

  updateAppMenu = () => {
    const { activeAccountID, activeSeason, latestSeason, accounts } = this.state
    if (!accounts) {
      return
    }

    this.updateAppTitle()
    this.updateTheme()

    new AppMenu({
      onPageChange: this.changeActivePage,
      onSeasonChange: this.changeActiveSeason,
      onAccountChange: this.changeActiveAccount,
      onExport: this.exportSeason,
      season: activeSeason,
      latestSeason,
      accountID: activeAccountID,
      accounts
    })
  }

  updateAppTitle = () => {
    const { activeAccountID, accounts, activeSeason, activePage } = this.state
    const haveActiveSeason = typeof activeSeason === 'number' && !isNaN(activeSeason)
    const isSeasonRelevant = ['matches', 'log-match', 'trends', 'edit-match', 'import'].indexOf(activePage) > -1
    const isAccountRelevant = ['matches', 'log-match', 'trends', 'edit-match', 'import'].indexOf(activePage) > -1
    let titleParts = []

    if (activePage === 'matches') {
      titleParts.push('Matches')
    } else if (activePage === 'log-match') {
      titleParts.push('Log a Match')
    } else if (activePage === 'trends') {
      titleParts.push('Trends')
    } else if (activePage === 'manage-seasons') {
      titleParts.push('Manage Seasons')
    } else if (activePage === 'edit-match') {
      titleParts.push('Edit Match')
    } else if (activePage === 'import') {
      titleParts.push('Import Matches')
    } else if (activePage === 'about') {
      titleParts.push('About')
    } else if (activePage === 'settings') {
      titleParts.push('Settings')
    } else if (activePage === 'accounts') {
      titleParts.push('Accounts')
    } else if (activePage === 'help') {
      titleParts.push('Help')
    }

    if (haveActiveSeason && isSeasonRelevant) {
      titleParts.push(`Season ${activeSeason}`)
    }

    if (activeAccountID && isAccountRelevant && accounts && accounts.length > 0) {
      const activeAccount = accounts.filter(account => account._id === activeAccountID)[0]

      if (activeAccount) {
        titleParts.push(activeAccount.battletag)
      }
    }

    setTitle(titleParts.join(' / '));
  }

  changeActiveSeason = activeSeason => {
    this.setState(prevState => {
      const newState = { activeSeason }

      if (prevState.activeMatchID) {
        newState.activeMatchID = null
      }

      if (prevState.activePage === 'edit-match' ||
          prevState.activePage === 'log-match') {
        newState.activePage = 'matches'
      }

      if (activeSeason > prevState.latestSeason) {
        newState.latestSeason = activeSeason
      }

      return newState
    }, this.updateAppMenu)
  }

  onMatchesImported = matches => {
    const { activeSeason, activeAccountID } = this.state
    console.log('imported', matches.length, 'match(es) into season', activeSeason, 'in account',
                activeAccountID)
    this.changeActivePage('matches')
  }

  changeActiveAccount = accountID => {
    this.setState(prevState => {
      const newState = { activeAccountID: accountID }

      if (prevState.activePage !== 'trends' && prevState.activePage !== 'matches') {
        newState.activePage = 'matches'
      }

      return newState
    }, this.updateAppMenu)
  }

  onSettingsSaved = settings => {
    this.setState(prevState => ({
      settings,
      activePage: 'matches',
      activeAccountID: settings.defaultAccountID
    }), this.updateAppMenu)
  }

  renderActivePage = () => {
    const { activePage, activeAccountID, latestRank, latestGroup,
            activeSeason, latestSeason, scrollToMatchID, theme,
            activeMatchID, accounts, settings, scrollToMatch } = this.state
    const haveActiveSeason = typeof activeSeason === 'number' && !isNaN(activeSeason)

    if (activePage === 'matches' && haveActiveSeason && activeAccountID) {
      return (
        <MatchesPage
          accountID={activeAccountID}
          season={activeSeason}
          onPageChange={this.changeActivePage}
          scrollToMatch={scrollToMatch}
          scrollToMatchID={scrollToMatchID}
          theme={theme}
        />
      )
    }

    if (activePage === 'log-match' && haveActiveSeason) {
      return (
        <MatchCreatePage
          accountID={activeAccountID}
          onPageChange={this.changeActivePage}
          onSeasonChange={this.changeActiveSeason}
          latestRank={latestRank}
          latestGroup={latestGroup}
          season={activeSeason}
          theme={theme}
          latestSeason={latestSeason}
        />
      )
    }

    if (activePage === 'manage-seasons') {
      return (
        <SeasonsPage
          latestSeason={latestSeason}
          firstNonDeletableSeason={latestKnownSeason}
          onCreate={this.changeActiveSeason}
          onDelete={this.onSeasonDelete}
          onPageChange={this.changeActivePage}
        />
      )
    }

    if (activePage === 'import' && haveActiveSeason && activeAccountID) {
      return (
        <ImportPage
          season={activeSeason}
          accountID={activeAccountID}
          onImport={this.onMatchesImported}
        />
      )
    }

    if (activePage === 'edit-match' && activeMatchID) {
      return (
        <MatchEditPage
          id={activeMatchID}
          season={activeSeason}
          accountID={activeAccountID}
          theme={theme}
          onPageChange={this.changeActivePage}
        />
      )
    }

    if (activePage === 'about') {
      return (
        <AboutPage
          onPageChange={this.changeActivePage}
        />
      )
    }

    if (activePage === 'help') {
      return (
        <HelpPage
          onPageChange={this.changeActivePage}
        />
      )
    }

    if (activePage === 'trends') {
      return (
        <TrendsPage
          accountID={activeAccountID}
          season={activeSeason}
          onPageChange={this.changeActivePage}
          theme={theme}
        />
      )
    }

    if (activePage === 'settings') {
      return (
        <SettingsPage
          onPageChange={this.changeActivePage}
          accounts={accounts}
          settings={settings}
          onSave={this.onSettingsSaved}
        />
      )
    }

    if (activePage === 'accounts' && haveActiveSeason) {
      return (
        <AccountsPage
          accounts={accounts}
          season={activeSeason}
          onCreate={this.refreshAccounts}
          onDelete={this.refreshAccounts}
          onAccountChange={this.changeActiveAccount}
          onAccountUpdate={this.refreshAccounts}
        />
      )
    }

    return <LoadingPage />
  }

  isNighttime = () => {
    const currentTime = new Date()
    const hours = currentTime.getHours()

    return hours >= 20 || hours <= 5
  }

  render() {
    const { activePage, activeAccountID, activeSeason, latestSeason,
            accounts, theme } = this.state
    const showHeader = activePage !== 'about' && activePage !== 'settings' &&
      activePage !== 'manage-seasons' && activePage !== 'help';

    return (
      <div className={`layout-container theme-${theme}`}>
        {showHeader && (
          <Header
            accounts={accounts}
            activePage={activePage}
            activeAccountID={activeAccountID}
            onPageChange={this.changeActivePage}
            activeSeason={activeSeason}
            latestSeason={latestSeason}
            onSeasonChange={this.changeActiveSeason}
            onAccountChange={this.changeActiveAccount}
            onExport={this.exportSeason}
          />
        )}
        {this.renderActivePage()}
      </div>
    )
  }
}

export default App
