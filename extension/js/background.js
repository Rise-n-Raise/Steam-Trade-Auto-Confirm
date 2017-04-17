localStorage.removeItem('scan');
localStorage.setItem('scan', 'false');
localStorage.removeItem('tabidremove');

var conferror = new Audio();
conferror.preload = 'auto';
conferror.src = 'js/sounds/notif.mp3';

var onstartMSG = new Audio();
onstartMSG.preload = 'auto';
onstartMSG.src = 'js/sounds/Isnt-it.mp3';

var g_devhash;
var g_steamId;
var g_timeforlongkey;
var g_longkey;
var g_identity_secret;

chrome.notifications.onClicked.addListener(function (notificationId)
{
	if(notificationId == "openNewsNow")
	{
		chrome.tabs.create({url: "http://extensions.risenraise.com/articles/get/1/"});
	}
	chrome.notifications.clear( notificationId, function () { });
});

circle();
function circle()
{
	var scan = localStorage.getItem('scan');
	var steamId = localStorage.getItem('steamId');
	var identitySecret = localStorage.getItem('identitySecret');
	if(scan == 'true' && steamId && identitySecret)
	{
		chrome.browserAction.setBadgeBackgroundColor({ color: '#B9FF00'});
		chrome.browserAction.setBadgeText({ text: "On"});
		
		var devhash = makeRandomString(40);
		g_devhash = devhash;
		g_steamId = steamId;
		var timeforlongkey = new Date().getTime() / 1000 | 0;
		g_timeforlongkey = timeforlongkey;
		var xhrDone = false;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://83.220.175.150:37999/createhashes/?t=" + timeforlongkey + "&s=" + identitySecret, true);
		xhr.send(null);
		xhr.timeout = 10000;
		xhr.ontimeout = function()
		{
			if(!xhrDone)
			{
				xhrDone = true;
				chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
				chrome.browserAction.setBadgeText({ text: "Error"});
				setTimeout(circle, 0);
			}
		}
		xhr.error = function()
		{
			if(!xhrDone)
			{
				xhrDone = true;
				chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
				chrome.browserAction.setBadgeText({ text: "Error"});
				setTimeout(circle, localStorage.getItem('rate'));
			}
		}
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4 && !xhrDone)
			{
				xhrDone = true;
				if(xhr.status == 200 && xhr.responseText)
				{
					var data = (xhr.responseText).split('-X-');
					var longkey = data[0].replace(/\+/gim, '%2B'); //.replace(/\%2B/gim, '+').replace(/\%2b/gim, '+');
					var conflongkey = data[1].replace(/\+/gim, '%2B'); //.replace(/\%2B/gim, '+').replace(/\%2b/gim, '+');
					g_longkey = longkey;
					g_identity_secret = identitySecret;
					var confpage = "https://steamcommunity.com/mobileconf/conf?p=" + devhash + "&a=" + steamId + "&k=" + conflongkey + "&t=" + timeforlongkey + "&m=android&tag=conf";
					var reqDone = false;
					var req = new XMLHttpRequest();
					req.open("GET", confpage, true);
					req.send(null);
					req.timeout = 20000;
					req.ontimeout = function()
					{
						if(!reqDone)
						{
							reqDone = true;
							chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
							chrome.browserAction.setBadgeText({ text: "Error"});
							setTimeout(circle, 0);
						}
					}
					req.error = function()
					{
						if(!reqDone)
						{
							reqDone = true;
							chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
							chrome.browserAction.setBadgeText({ text: "Error"});
							setTimeout(circle, localStorage.getItem('rate'));
						}
					}
					req.onreadystatechange = function()
					{
						if(req.readyState == 4 && !reqDone)
						{
							reqDone = true;
							if(req.status == 200 && req.responseText)
							{
								var data = req.responseText;
								var ohno = $('.mobileconf_done:eq(0)', data).text();
								var steamerror = $('.sectionText:eq(0)').text();
								var errorlen = ((data.replace('sectionText', '')).replace('502 Bad Gateway', '')).length;
								var usuallen = data.length;
								if((ohno == "") && (errorlen >= usuallen))
								{
									if(!(/(.*)(\-)(.)(\-)(.)(\-)(.*)/g.test($('#mobileconf_empty', data).text())))
									{
										chrome.runtime.sendMessage("msg:Bad IdentitySecret for this steamId!");
									}
									else
									{
										chrome.runtime.sendMessage("msg:Data loading failed!\nSimple Steam error or something wrong. May be it is not your steamId?");
									}
								}
								var confirmationKey = $('.mobileconf_list_entry:eq(0)', data).attr('data-key'); //get on the conf page
								if(confirmationKey)
								{
									chrome.tabs.create({ url : confpage, selected : false}, function(tab)
									{
										localStorage.setItem('tabidremove', tab.id);
									});
								}
								else
								{
									setTimeout(circle, localStorage.getItem('rate'));
								}
							}
							else if(req.status == 429)
							{
								chrome.runtime.sendMessage('msg:Error 429. Too many requests.');
								chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
								chrome.browserAction.setBadgeText({ text: "Error"});
								setTimeout(circle, 5000);
							}
							else
							{
								chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
								chrome.browserAction.setBadgeText({ text: "Error"});
								chrome.runtime.sendMessage('msg:Error ' + req.status + '.');
								setTimeout(circle, localStorage.getItem('rate'));
							}
						}
					}
				}
				else
				{
					chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
					chrome.browserAction.setBadgeText({ text: "Error"});
					setTimeout(circle, localStorage.getItem('rate'));
				}
			}
		}
	}
	else
	{
		localStorage.setItem('scan', 'false');
		chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000'});
		chrome.browserAction.setBadgeText({ text: "Off"});
		setTimeout(circle, 2000);
	}
}

chrome.tabs.onRemoved.addListener( function(tabId, removeInfo)
{
	var truetabid = localStorage.getItem('tabidremove');
	localStorage.removeItem('tabidremove');
	if (tabId == truetabid)
		setTimeout(circle, localStorage.getItem('rate'));
});

function makeRandomString(numb)
{
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for(var i = 0; i < numb; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

chrome.runtime.onMessage.addListener( function(response, sender, senDresponse)
{
	if(typeof response == 'string')
	{
		if(/^msg\:/.test(response))
		{
			var options =
			{
				type: "basic",
				title: "Steam Trade Auto Confirm",
				message: response.replace(/^msg\:/, ''),
				iconUrl: 'images/icon128.png'
			};
			chrome.notifications.clear( 'msg', function () { });
			chrome.notifications.create( 'msg', options, function (id) { });
		}
		else if(/^audioMsg\:/.test(response))
		{
			var options =
			{
				type: "basic",
				title: "Steam Trade Auto Confirm",
				message: response.replace(/^audioMsg\:/, ''),
				iconUrl: 'images/icon128.png'
			};
			conferror.play();
			chrome.notifications.clear( 'audioMsg', function () { });
			chrome.notifications.create( 'audioMsg', options, function (id) { });
		}
		else if(response == 'getFastKey')
		{
			var timeIs = new Date();
			timeIs = timeIs.getTime() / 1000 | 0;
			xhr = new XMLHttpRequest();
			xhr.open("GET", "http://83.220.175.150:37999/createhashes/?t=" + timeIs + "&s=" + localStorage.getItem('identitySecret'), true);
			xhr.send(null);
			xhr.onreadystatechange = function()
			{
				if (xhr.readyState == 4)
				{
					if(xhr.responseText)
					{
						var fastkey = ('' + xhr.responseText).replace(/(\-X\-)(.*)/g, '');
						chrome.tabs.sendMessage(sender.tab.id, {data: fastkey, timeIs : timeIs});
					}
					else
					{
						chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
						chrome.browserAction.setBadgeText({ text: "Error"});
						chrome.tabs.sendMessage(sender.tab.id, {data: "netError"});
					}
				}
			}
		}
		else if(response == 'getConfData')
		{
			chrome.tabs.sendMessage(sender.tab.id, 
			{
				devhash: g_devhash,
				steamId : g_steamId,
				timeforlongkey : g_timeforlongkey,
				longkey : g_longkey,
				identity_secret : g_identity_secret,
			});
		}
	}
});