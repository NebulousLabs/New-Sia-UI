import PropTypes from 'prop-types'
import React from 'react'

// -- helper functions --

// currentEstimatedHeight returns the estimated block height for the current time.
const currentEstimatedHeight = () => {
	const knownBlockHeight = 100e3
	const knownBlockTime = new Date(1492126189*1000) // timestamp for block 100000
	const blockTime = 9 //minutes
	const diffMinutes = Math.abs(new Date() - knownBlockTime) / 1000 / 60

	const estimatedHeight = knownBlockHeight + (diffMinutes / blockTime)

	return Math.floor(estimatedHeight + 0.5) // round to the nearest block
}

// estimatedProgress returns the estimated sync progress given the current
// blockheight, as a number from 0 -> 99.9
const estimatedProgress = (currentHeight) =>
	Math.min(currentHeight / currentEstimatedHeight() * 100, 99.9)

// -- components --

const StatusBar = ({synced, blockheight, peers}) => {

	const progress = estimatedProgress(blockheight)

	const redColor = '#E0000B'
	const greenColor = '#00CBA0'
	const yellowColor = '#E7D414'

	const syncStyle = {
		color: redColor,
	}

	let status
	if (!synced && peers === 0) {
		syncStyle.color = redColor
		status = 'Not Syncing'
	} else if (!synced && peers > 0) {
		syncStyle.color = yellowColor
		status = 'Syncing'
	} else if (synced && peers === 0) {
		syncStyle.color = redColor
		status = 'Not Syncing: No Peers'
	} else if (synced) {
		syncStyle.color = greenColor
		status = 'Synchronized'
	}

	let syncStatus = (
		<div className="status-bar-blockheight">Block Height: {blockheight}</div>
	)

	if (!synced && progress < 99.9) {
		syncStatus = (
			<div>
				{Math.floor(progress * 10) / 10}%
			</div>
		)
	}

	return (
		<div className="status-bar">
			<div style={syncStyle}>
				<i className="fa fa-refresh" />
				{status}
			</div>
			{syncStatus}
		</div>
	)
}

StatusBar.propTypes = {
	synced: PropTypes.bool.isRequired,
	blockheight: PropTypes.number.isRequired,
	peers: PropTypes.number.isRequired,
}

export default StatusBar

