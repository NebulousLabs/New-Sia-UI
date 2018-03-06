import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'immutable'
import Modal from './warningmodal.js'
import Path from 'path'

const FilesList = ({ folders, folderPathToRemove, actions }) => {
	const addStorageLocation = () => actions.addFolderAskPathSize()
	const removeStorageLocation = (folder) => () => {
		actions.removeFolder(folder)
		actions.updateFolderToRemove()
	}

	const onResizeStorageLocationClick = (folder) => () => actions.resizeFolder(folder)
	const onRemoveStorageLocationClick = (folder) => () => actions.updateFolderToRemove(folder.get('path'))
	const hideRemoveStorageModal = () => actions.updateFolderToRemove()

	// sort folders by their name
	const sortedFolders = folders.sortBy((folder) => folder.get('path'))

	const FileList = sortedFolders.map((folder, key) => (
		<div className="property pure-g file-row" key={key}>
			<div className="pure-u-1-2">
				<div>{folder.get('path')}</div>
			</div>
			<div className="pure-u-1-8">
				<div>{Math.floor(folder.get('free')).toString()} GB</div>
			</div>
			<div className="pure-u-1-8">
				<div>{Math.floor(folder.get('size')).toString()} GB</div>
			</div>
			<div className="pure-u-1-8" onClick={onResizeStorageLocationClick(folder)}>
				<div><i className="fa fa-edit button" /></div>
			</div>
			<div className="pure-u-1-8" onClick={onRemoveStorageLocationClick(folder)}>
				<div><i className="fa fa-remove button" /></div>
			</div>
			<Modal
				title={`Remove "${ Path.basename(folder.get('path')) }"?`}
				message="No longer use this folder for storage? You may lose collateral if you do not have enough space to fill all contracts."
				actions={{ acceptModal: removeStorageLocation(folder), declineModal: hideRemoveStorageModal  }}
				open={
					folderPathToRemove && folderPathToRemove === folder.get('path')
				}
			/>
		</div>
	))

	return (
		<div className="files section">
			<div className="property row">
				<div className="title" />
				<div className="controls full">
					<div className="pure-u-1-2">
						<div className="button" id="edit" onClick={addStorageLocation}>
							<i className="fa fa-folder-open" />
							Add Storage Folder
						</div>
					</div>
					<div className="pure-u-1-8" style={{ 'textAlign': 'left' }}>Free</div>
					<div className="pure-u-1-8" style={{ 'textAlign': 'left' }}>Max</div>
				</div>
			</div>
			{FileList}
		</div>
	)
}

FilesList.propTypes = {
	folderPathToRemove: PropTypes.string,
	folders: PropTypes.instanceOf(List).isRequired,
}

export default FilesList
