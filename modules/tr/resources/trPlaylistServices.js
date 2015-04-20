mw.PluginManager.add( 'trPlaylistServices', mw.KBasePlugin.extend({

	defaultConfig: {
		'maxResults' : 50
	},

	setup: function() {
		this.setBindings();
	},
	setBindings : function(){
		var _this = this;
		this.bind('trLoadNewPlaylist', $.proxy(function(e,params){
			_this.loadPlaylist(0,params);
		}));

		this.bind('playerReady', $.proxy(function(){
			if(_this.getConfig("loadedOnce")){
				return;
			}
			setTimeout(function(){
				_this.setConfig("loadedOnce",true);
				_this.loadPlaylist(1);
			},151)
		},this));
		this.bind('trLoadPlaylistBySearch', $.proxy(function(e,search){
			this.loadRelatedPlaylist(search)
		},this));

	},
	loadRelatedPlaylist : function (search){
		var ks= "";
		var _this = this;
		var params = {
			"playlistParams" : {
				"service":"playlist" ,
				"action":"executefromfilters" ,
				'ks' : ks,
				'filters:item0:freeText' : search ,
				'filters:item0:idNotIn' : _this.embedPlayer.evaluate('{mediaProxy.entry.id}') , 	// don't fetch current entry
				"totalResults" : _this.getConfig("maxResults")
			},
			'autoInsert' : false,
			'playlistName' : "new name"
		}
		debugger;
		this.embedPlayer.sendNotification('loadExternalPlaylist', params );

	},


	loadPlaylist: function(myTestCase , params){
		var _this = this;
		//var ks= _this.getKalturaClient().ks;
		var ks= "";

		if(params){
			params.playlistParams.ks = ks;
			_this.embedPlayer.sendNotification('loadExternalPlaylist', params );
			return;
		}


		switch(myTestCase) {
			case 1:
				var params = {
					"playlistParams" : {
						"service":"playlist" ,
						"action":"executefromfilters" ,
						'ks' : ks,
						'filters:item0:freeText' : "ted" , 	// search term here
						'filters:item0:idNotIn' : _this.embedPlayer.evaluate('{mediaProxy.entry.id}') , 	// don't fetch current entry
						"totalResults" : _this.getConfig("maxResults")
					},
					'autoInsert' : false,
					'playlistName' : "new name"
				}

			break;
			case 2:

				var params = {
					'playlistParams': {
						'service': 'playlist',
						'action': 'execute',
						'ks': ks,
						'id': '_KDP_CTXPL',
						'filter:objectType': 'KalturaMediaEntryFilterForPlaylist',
						'filter:mediaTypeEqual': '1',
						'filter:idNotIn': _this.embedPlayer.evaluate('{mediaProxy.entry.id}'), 	// dont fetch current entry
						'playlistContext:objectType': 'KalturaEntryContext',
						'playlistContext:entryId': _this.embedPlayer.evaluate('{mediaProxy.entry.id}'),
						'totalResults': 50
					},
					'autoInsert': false, //if this is set to true the player will load and switch the current video to the new playlist
					//'initItemEntryId' : '1_cvsg4ghm', // player start playing a specific entry if exist
					'playlistName': 'new playlist' // override the displayed playlist name
					}
			break;
			case 3:

				var params = {
					"playlistParams" : {
						"service": "playlist",
						"action": "executefromfilters",
						'ks': ks,
						'filters:item0:tagsMultiLikeAnd': "timers", 	// search term here
						'filters:item0:idNotIn': "0_0g8l44yy", 	// dont fetch current entry
						"totalResults": _this.getConfig("maxResults")
					},
					'autoInsert' : false, //if this is set to true the player will load and switch the current video to the new playlist
					'playlistName' : 'new playlist' // override the displayed playlist name
				}

			break;
		}
		_this.embedPlayer.sendNotification('loadExternalPlaylist', params );
	}


}));