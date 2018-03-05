import PropTypes from 'prop-types'
import React from 'react'
import BigNumber from 'bignumber.js'

const SendPrompt = ({currencytype, sendAddress, sendAmount, feeEstimate, sendError, actions}) => {
	const handleSendAddressChange = (e) => actions.setSendAddress(e.target.value)
	const handleSendAmountChange = (e) => actions.setSendAmount(e.target.value)
	const handleSendClick = () => {
		try {
			new BigNumber(sendAmount)
			actions.setSendError('')
			actions.sendCurrency(sendAddress, sendAmount, currencytype)
		} catch (e) {
			actions.setSendError('could not parse send amount')
		}
	}
	const handleCancelClick = () => actions.closeSendPrompt()
	return (
		<div className="dialog sendprompt">
			<div className="dialog__title" />
			<div className="dialog__content">
				<div className="sendamount">
					<h3>Send Amount {currencytype === 'siacoins' ? '(SC)' : '(SF)'} </h3>
					<input className="input" onChange={handleSendAmountChange} value={sendAmount} />
				</div>
				<div className="sendaddress">
					<h3> To Address </h3>
					<input className="input" onChange={handleSendAddressChange} value={sendAddress} />
				</div>
				<div className="fee-estimation">
					Estimated fee: {feeEstimate}
				</div>
			</div>
			<span className="send-error">{sendError}</span>
			<div className="dialog__actions send-prompt-buttons">
				<button className="send-siacoin-button button" onClick={handleSendClick}>Send</button>
				<button className="cancel-send-button button" onClick={handleCancelClick}>Cancel</button>
			</div>
		</div>
	)
}
SendPrompt.propTypes = {
	sendAddress: PropTypes.string.isRequired,
	sendError: PropTypes.string.isRequired,
	sendAmount: PropTypes.string.isRequired,
	currencytype: PropTypes.string.isRequired,
	feeEstimate: PropTypes.string.isRequired,
}

export default SendPrompt
