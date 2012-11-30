
/*
 * GET home page.
 */
var qqConnect = require('qq-connect'),
	oauth = qqConnect.oauth,
	qzone = qqConnect.qzone;
var index = function(req, res, next){
  	//res.redirect(oauth.qq_login(req, res));
  	oauth.qq_login(req, res);
  	//res.end('<a href="http://account.alloyteam.com/signin?gourl=http://nodejs.alloyteam.com/try/login">Alloy帐号登录</a>');
};
var accessToken = function(req, res, next) {
	oauth.qq_callback(req, function(result) {
		var access_token = result.access_token;
		req.session.access_token = access_token;
		oauth.get_openid(access_token, function(result) {
			var openid = result.openid;
			console.log(access_token, openid);
			req.session.openid = openid;
			qzone.get_user_info({access_token: access_token, openid: openid}, function(result) {
				res.json({result: result});
			}, function(err) {
				next(err);
			});
		}, function(err) {
			next(err);
		});
	}, function(err) {
		next(err);
	});
};
var tryLogin = function(req, res, next) {
	res.end('success');
};
var tryAddShare = function(req, res, next) {
	var params = {
		access_token: req.session.access_token || '',
		openid: req.session.openid || '',
		title: '测试SDK',
		url: 'http://www.alloyteam.com/2012/11/the-css3-ui-lib-library-introduction',
		site: 'AlloyTeam团队博客',
		fromurl: 'http://www.alloyteam.com'
	};
	qzone.add_share(params, function(result) {
		console.log(result);
		res.end('success');
	}, function(err) {
		next(err);
	});
};
exports.route = function(app) {
	app.get('/', index);
	app.get('/try/login', accessToken);
	app.get('/try/add_share', tryAddShare);
};