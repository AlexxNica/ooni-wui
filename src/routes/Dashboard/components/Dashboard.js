import React from 'react'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'

import Deck from '../../../components/Deck'
import DeckRunner from './DeckRunner'

import OONILogoImage from '../assets/ooni-logo.svg'
import './Dashboard.scss'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import {
  formatName,
  formatTime,
  formatResult,
  rowClassNameFormat
} from '../../../util/table'

export const Dashboard = ({
  softwareVersion,
  running,
  quotaWarning,
  countryCode,
  asn,
  decks,
  deckIcons,
  recentResults,

  onDeckToggled,
  onDeckRun,
  onDeckRunClose,

  onDeckStart,

  onTestRun,
  onTestRunClose,

  onTestStart,

  runOpen,
  activeDeck,
  activeNettest,
  nettests,
  loadingDecks,
  loadingDecksFailed,
  loadingRecentResults,
  loadingRecentResultsFailed
}) => (
  <div>

    <div className='row text-xs-center'>
      <h1>
        <FormattedMessage
          id='dashboard.title'
          defaultMessage='ooniprobe Dashboard'
        />
      </h1>
      <div className='status'>
        ooniprobe {softwareVersion} { '| ' }
        {running === true &&
        <span className='status-running'>
          <FormattedMessage
            id='dashboard.status.running'
            defaultMessage='running {iconRunning}'
            values={{
              iconRunning: <i className='fa fa-check-circle-o' />
            }}
          />
        </span>
        }
        {running === false &&
        <span className='status-not-running'>
          <FormattedMessage
            id='dashboard.status.notRunning'
            defaultMessage='not running {iconNotRunning}'
            values={{
              iconNotRunning: <i className='fa fa-close' />
            }}
          />
        </span>
        }
        { ' | ' }
        <FormattedMessage
          id='dashboard.status.location'
          defaultMessage='Location: {countryCode} {asNumber}'
          values={{
            countryCode: countryCode,
            asNumber: <span dir='ltr'>({asn})</span>
          }}
        />
      </div>
    </div>

    <div className='row decks'>
      { loadingDecksFailed &&
        <div className='text-xs-center' style={{ marginTop: '2rem' }}>
          <p className='text-danger'>
            <FormattedMessage
              id='dashboard.failedToLoadDecks'
              defaultMessage='{iconFailure} failed to load decks'
              values={{
                iconFailure: <i className='fa fa-exclamation-circle' />
              }}
            />
          </p>
          <p>
            <FormattedMessage
              id='dashboard.failedToLoadDecks.message'
              defaultMessage='Try clicking on the reload {iconReload} button in the upper right corner'
              values={{
                iconReload: <strong><i className='fa fa-refresh' /></strong>
              }}
            />
          </p>
        </div>
      }
      { loadingDecks && !loadingDecksFailed &&
        <div className='text-xs-center' style={{ marginTop: '2rem' }}>
          <FormattedMessage
            id='dashboard.loadingDecks'
            defaultMessage='{iconSpinner} loading decks'
            values={{
              iconSpinner: <i className='fa fa-spinner fa-pulse fa-3x fa-fw' />
            }}
          />
        </div>
      }
      { !loadingDecks && !loadingDecksFailed &&
        decks.map((deck) => {
          return <Deck
            key={deck.id}
            deck={deck}
            directorStarted={running}
            onDeckToggled={onDeckToggled}
            onDeckRun={onDeckRun}
            fullControls />
        })
      }
    </div>

    <DeckRunner
      onDeckStart={() => onDeckStart(activeDeck.id)}
      onDeckClose={onDeckRunClose}
      onTestStart={onTestStart}
      onTestRun={onTestRun}
      onTestRunClose={onTestRunClose}
      isOpen={runOpen}
      activeNettest={activeNettest}
      nettests={nettests}
      deck={activeDeck} />

    {loadingRecentResults && !loadingRecentResultsFailed &&
    <div className='text-xs-center' style={{ marginTop: '2rem' }}>
      <FormattedMessage
        id='dashboard.loadingRecentResults'
        defaultMessage='{iconSpinner} loading recent results'
        values={{
          iconSpinner: <i className='fa fa-spinner fa-pulse fa-3x fa-fw' />
        }}
      />
    </div>
    }

    {loadingRecentResultsFailed && !loadingRecentResults &&
    <div className='text-xs-center' style={{ marginTop: '2rem' }}>
      <p className='text-danger'>
        <FormattedMessage
          id='dashboard.loadingRecentResults.failed'
          defaultMessage='{iconFailure} failed to load recent results'
          values={{
            iconFailure: <i className='fa fa-exclamation-circle' />
          }}
        />
      </p>
      <p>
        <FormattedMessage
          id='dashboard.loadingRecentResults.failed.message'
          defaultMessage='Try clicking on the reload {iconReload} button in the upper right corner'
          values={{
            iconReload: <strong><i className='fa fa-refresh' /></strong>
          }}
        />
      </p>
    </div>
    }

    {!loadingRecentResults && !loadingRecentResultsFailed && recentResults.length === 0 &&
    <div className='row recent-results'>
      <div className='col-md-3 offset-md-3'>
        <img src={OONILogoImage} width='200px' height='200px' className='ooni-logo' />
      </div>
      <div className='col-md-3'>
        <h2>
          <FormattedMessage
            id='dashboard.recentResults.zeroState'
            defaultMessage='Your recent test results will appear here once the tests have finished running! As you run more tests, you can view past results in the "Measurements" page.'
          />
        </h2>
      </div>
    </div>
    }

    {!loadingRecentResults && !loadingRecentResultsFailed && recentResults.length > 0 &&
    <div className='row recent-results text-xs-center'>
      <h2>
        <FormattedMessage
          id='dashboard.recentResults.title'
          defaultMessage='Last {numberResultCount} tests'
          values={{
            numberResultCount: recentResults.length
          }}
        />
      </h2>
      {/* This is for small viewports */}
      <div className='hidden-sm-up'>
        <BootstrapTable
          bordered={false}
          headerStyle={{ 'display': 'none' }}
          tableStyle={{ border: 'none' }}
          containerStyle={{ border: 'none' }}
          bodyStyle={{ border: 'none' }}
          trClassName={rowClassNameFormat}
          data={recentResults}>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn width='40' dataAlign='center' dataField='test_name'
            dataFormat={formatName(deckIcons, false)} />
          <TableHeaderColumn dataAlign='center' dataField='test_start_time' dataFormat={formatTime('calendar')} />
          <TableHeaderColumn width='100' dataAlign='center' dataField='asn' />
          <TableHeaderColumn width='60' dataAlign='center' dataField='country_code' />
          <TableHeaderColumn width='40' dataAlign='center' dataField='result' dataFormat={formatResult} />
        </BootstrapTable>
      </div>
      {/* This is for bigger viewports */}
      <div className='hidden-xs-down'>
        <BootstrapTable
          bordered={false}
          headerStyle={{ 'display': 'none' }}
          tableStyle={{ border: 'none' }}
          containerStyle={{ border: 'none' }}
          bodyStyle={{ border: 'none' }}
          trClassName={rowClassNameFormat}
          data={recentResults}>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataAlign='center' dataField='test_name' dataFormat={formatName(deckIcons)} />
          <TableHeaderColumn dataAlign='center' dataField='test_start_time' dataFormat={formatTime()} />
          <TableHeaderColumn width='100' dataAlign='center' dataField='asn' />
          <TableHeaderColumn width='60' dataAlign='center' dataField='country_code' />
          <TableHeaderColumn width='40' dataAlign='center' dataField='result' dataFormat={formatResult} />
        </BootstrapTable>
      </div>
      <Link to='/measurements' className='btn btn-primary'>
        <FormattedMessage
          id='dashboard.recentResults.viewButton'
          defaultMessage='View your measurements'
        />
      </Link>
    </div>
    }

  </div>
)

Dashboard.propTypes = {
  softwareVersion: React.PropTypes.string,
  running: React.PropTypes.bool,
  quotaWarning: React.PropTypes.bool,
  countryCode: React.PropTypes.string,
  asn: React.PropTypes.string,
  decks: React.PropTypes.array,
  deckIcons: React.PropTypes.object,
  recentResults: React.PropTypes.array,

  loadingRecentResults: React.PropTypes.bool,
  loadingRecentResultsFailed: React.PropTypes.bool,

  onDeckStart: React.PropTypes.func,
  onDeckToggled: React.PropTypes.func,
  onDeckRun: React.PropTypes.func,
  onDeckRunClose: React.PropTypes.func,

  onTestStart: React.PropTypes.func,
  onTestRun: React.PropTypes.func,
  onTestRunClose: React.PropTypes.func,

  nettests: React.PropTypes.object,
  runOpen: React.PropTypes.bool,
  activeDeck: React.PropTypes.object,
  activeNettest: React.PropTypes.object,
  loadingDecks: React.PropTypes.bool,
  loadingDecksFailed: React.PropTypes.bool
}

export default Dashboard
