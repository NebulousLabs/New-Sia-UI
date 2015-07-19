// pluginManager.js manages all plugin logic for the UI
'use strict';
var SiaPlugin = require('./js/plugin');

// pluginManager can be called with a config object to initialize plugins
var Plugins = (function() {
	var home;
	var plugPath;
	var current;
	var plugins = [];
	var siadAddress;

	// setConfig() sets the member variables based on the passed config
	// Callback, if there is one, returns no arguments
	// TODO: delete all plugins when a new path is set?
	function setConfig(config, callback) {
		home = config.homePlugin;
		plugPath = config.pluginsPath;
		siadAddress = config.siadAddress;
		callback();
	}

	// setHome detects the home Plugin or otherwise the alphabetically first
	// plugin and sets its button to be first as well as it to be the first
	// view
	function setHome(pluginNames) {
		// Detect if home plugin is installed
		var homeIndex = pluginNames.indexOf(home);
		if (homeIndex !== -1 && pluginNames[0] !== home) {
			// Swap it to be first
			pluginNames[homeIndex] = pluginNames[0];
			pluginNames[0] = home;
			return;
		}
		// No home plugin installed
		home = pluginNames[0];
	}

	// addListeners(plugin) handles listening for plugin messages 
	function addListeners(plugin) {
		// Only show the default plugin view
		if (plugin.name === home) {
			plugin.on('did-finish-load', plugin.show);
			current = plugin;
		} else {
			plugin.on('did-finish-load', plugin.hide);
		}

		// Add standard transition upon button click
		// TODO: Add smoother transitions
		plugin.transition(function() {
			if (current === plugin) {
				return;
			}
			current.hide();
			plugin.show();
			current = plugin;
		});
		
		// Handle any ipc messages from the plugin
		plugin.on('ipc-message', function(event) {
			switch(event.channel) {
				case 'api-call':
					// TODO: Possibly have plugins send the address of a
					// variable they wanted updated with the call so that the
					// the general-UI can update the value upon result?
					Daemon.call(event.args[0], function(err, callResult) {
						if (err) {
							console.error(err);
							return;
						} 
						plugin.sendIPC('api-result', event.args[0], callResult);
					});
					break;
				case 'devtools':
					plugin.toggleDevTools();
					break;
				default:
					console.log('Unknown ipc message: ' + event.channel);
			}
		});

		// Display any console logs from the plugin
		plugin.on('console-message', function(event) {
			console.log(plugin.name + ' plugin logged> ', event.message);
		});	
	}

	// addPlugin() constructs the plugins and adds them
	function addPlugin(name) {
		// Make the plugin, giving its button a standard transition
		var plugin = new SiaPlugin(plugPath, name);

		// addListeners deals with any webview related async tasks
		addListeners(plugin);

		// Store the plugin
		plugins.push(plugin);
	}

	// initPlugins() initializes the plugins to the UI
	function initPlugins() {
		Fs.readdir(plugPath, function (err, pluginNames) {
			if (err) {
				console.log(err);
			}

			// Determine default plugin
			setHome(pluginNames);
			
			// Initialize each plugin according to config
			pluginNames.forEach(addPlugin);
		});
	}

	// init() sets config and initializes the plugins
	function init(config) {
		// TODO: This is hardcoded. daemonManager could be a plugin, siad
		// be a plugin itself, or even have a new class of initialized
		// components called dependencies.
		setConfig(config, initPlugins);
	}

	// expose 'public' elements and functions
	return {
		setConfig: setConfig,
		init: init
	};
}());
