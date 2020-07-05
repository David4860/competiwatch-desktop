import React from "react";
import Account from "../models/Account";
import SeasonForm from "./SeasonForm";
import AddAccountForm from "./AddAccountForm";
import AccountsList from "./AccountsList";
import LayoutChildrenContainer from "./LayoutChildrenContainer";

interface Props {
  onAccountChange: (id: string) => void;
  onAccountUpdate: () => void;
  onCreate?: () => void;
  onSeasonCreate: (season: number) => void;
  accounts: Account[];
  season: number;
  latestSeason: number;
}

const AccountsPage = ({
  onAccountChange,
  onAccountUpdate,
  season,
  accounts,
  onCreate,
  onSeasonCreate,
  latestSeason
}: Props) => (
  <LayoutChildrenContainer>
    {accounts.length < 1 && (
      <div className="Box mb-4 p-3 col-lg-6">
        <h2 className="Subhead-heading mb-2">
          <span role="img" className="mr-2 d-inline-block" aria-label="Tada">
            🎉
          </span>
          Welcome to Competiwatch!
        </h2>
        <div className="f4">
          Thanks for using the app! To get started, add a Battle.net account
          below and log some games.
        </div>
      </div>
    )}
    <div className="clearfix">
      {accounts.length > 0 && (
        <div className="float-left col-lg-7 col-md-12 col-sm-12 mb-4">
          <div className="mr-4 pr-4">
            <h2 className="h2 text-normal mb-2 d-flex flex-items-center">
              Battle.net accounts{" "}
              <span className="Counter ml-2 h4 px-2">{accounts.length}</span>
            </h2>
            <p>Choose an account to view and log competitive matches.</p>
            <AccountsList
              season={season}
              accounts={accounts}
              onAccountChange={onAccountChange}
              onAccountUpdate={onAccountUpdate}
            />
          </div>
        </div>
      )}
      <div className="float-left col-lg-5 col-md-12 col-sm-12 mb-4">
        <AddAccountForm
          accounts={accounts}
          onAccountUpdate={onAccountUpdate}
          onCreate={onCreate}
        />

        <SeasonForm
          latestSeason={latestSeason}
          onCreate={onSeasonCreate}
        />
      </div>
    </div>
  </LayoutChildrenContainer>
);

export default AccountsPage;
