
var FBListLayer = cc.Layer.extend({
	apiKey:"Your Api Key",
	secreteKey:"Your Secret Key",
	
	warpclient: null,
	
	fb:null,
	fbID:0,	
	label:null,
	fbFriendsList:null,
	msgLabel:null,
	
    ctor:function () {
        this._super();

		var size = cc.winSize;
		this.msgLabel = new cc.LabelTTF("Connecting to AppWarp...", "Arial", 20);
        this.msgLabel.x = size.width / 2;
        this.msgLabel.y = size.height / 2;
        this.addChild(this.msgLabel, 5);
		
		this.fb = plugin.FacebookAgent.getInstance();
		this.fbID = this.fb.getUserID();
		
		var that = this;
		
		AppWarp.WarpClient.initialize(this.apiKey, this.secreteKey);
		this.warpclient = AppWarp.WarpClient.getInstance();
		this.warpclient.setResponseListener(AppWarp.Events.onConnectDone, function(result, reason){
			cc.log("onConnectDone : "+result+" - Reason : "+reason);
			if(result == AppWarp.ResultCode.Success)
			{
				that.msgLabel.setString("Connected. Getting online friends ...");
				that.fb.api("/me/friends", plugin.FacebookAgent.HttpMethod.GET, function(code, response){
					that.fbFriendsList = response.data;
					that.warpclient.getOnlineUsers();
				});
			}
			else
				that.msgLabel.setString("Connection Error : "+result);
		});
		this.warpclient.setResponseListener(AppWarp.Events.onGetOnlineUsersDone, function(_users){
			var onlineUsers = "";
			for (var i = 0; i < _users.getUsernames().length; ++i) {
				var user = _users.getUsernames()[i];
				
				for(var j=0; j<that.fbFriendsList.length; ++j)
				{
					if(that.fbFriendsList[j].id == user)
					{
						onlineUsers = that.fbFriendsList[j].name + "\n" + onlineUsers;
					}
				}
			}
			that.msgLabel.setString("Online Friends : \n"+onlineUsers)
		});
		this.warpclient.connect(this.fbID);
		
        return true;
    }
});

var FBListScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new FBListLayer();
        this.addChild(layer);
    }
});

