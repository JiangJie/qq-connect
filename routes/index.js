
/*
 * GET home page.
 */
var qqConnect = require('qq-connect'),
	oauth = qqConnect.oauth,
	qzone = qqConnect.qzone;
var index = function(req, res){
  	//res.redirect(oauth.qq_login(req, res));
  	oauth.qq_login(req, res);
};
var accessToken = function(req, res) {
	oauth.qq_callback(req, function(result) {
		var access_token = result.access_token;
		oauth.get_openid(access_token, function(result) {
			var openid = result.openid;
			var params = {
				access_token: access_token,
				openid: openid,
				title: '测试SDK',
				url: 'http://www.alloyteam.com/2012/11/the-css3-ui-lib-library-introduction',
				site: 'AlloyTeam团队博客',
				fromurl: 'http://www.alloyteam.com'
			};
			qzone.add_share(params, function(result) {
				console.log(result);
			}, function(err) {
				console.log(err);
			});
			qzone.get_user_info({access_token: access_token, openid: openid}, function(result) {
				res.json({result: result});
			});
		});
	});
};
exports.route = function(app) {
	app.get('/', index);
	app.get('/try', accessToken);
};