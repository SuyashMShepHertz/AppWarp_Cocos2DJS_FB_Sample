
var HelloWorldLayer = cc.LayerColor.extend({
	fb:null,
    ctor:function () {
        this._super();

        var size = cc.winSize;
		
		var fbLoginBtn = new cc.MenuItemImage(
            res.SignInWithFB,
            res.SignInWithFB,
            function () {
                this.fb = plugin.FacebookAgent.getInstance();
				this.fb.login(["email","user_friends "], function(code, response){
					cc.director.runScene(new FBListScene());
				});
            }, this);
        fbLoginBtn.attr({
            x: size.width/2,
            y: size.height/2,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(fbLoginBtn);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);
		
		this.setColor(new cc.Color(255,255,255,255));
		
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

