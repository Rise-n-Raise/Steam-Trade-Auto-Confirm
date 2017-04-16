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
var g_steamID;
var g_timeforlongkey;
var g_longkey;
var g_identity_secret;

chrome.notifications.onClicked.addListener(function (notificationId) {
	if(notificationId == "openNewsNow")
	{
		chrome.tabs.create({url: "http://extensions.risenraise.com/articles/get/1/"});
	}
	chrome.notifications.clear( notificationId, function () { });
});

/*setTimeout(newsNow, 30000);
function newsNow()
{
	var options = {
	type: "basic",
	title: "News:",
	message: "For inviting friends Get +3 days subscription for free!\nFor more information, click here",
	iconUrl: 'images/icon128.png'
	};
	chrome.notifications.create( "openNewsNow", options, function (id) { });
}*/

//setTimeout(connection, 500);
tradeauth();
function tradeauth()
{
	var scan = localStorage.getItem('scan');
	var steamID = localStorage.getItem('steamid');
	if ((steamID == undefined) || (steamID == ""))
	{
		scan = 'false';
	}
	var identitySecret = localStorage.getItem('IdentitySectet');
	if ((identitySecret == undefined) || (identitySecret == ""))
	{
		scan = 'false';
	}
	localStorage.setItem('scan', scan);
	if ((scan == 'true') && (localStorage.getItem('sub') == 'true'))
	{
		chrome.browserAction.setBadgeBackgroundColor({ color: '#B9FF00'});
		chrome.browserAction.setBadgeText({ text: "On"});
		var devhash = makeid();
		function makeid()
		{
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for(var i = 0; i < 40; i++ )
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			return text;
		}
		g_devhash = devhash;
		g_steamID = steamID;
		var timeforlongkey = new Date();
		timeforlongkey = timeforlongkey.getTime() / 1000 | 0;
		g_timeforlongkey = timeforlongkey;
		xhr = new XMLHttpRequest();
		xhr.open("GET", "http://83.220.175.150:37999/createhashes/?t=" + timeforlongkey + "&s=" + identitySecret, true);
		xhr.send(null);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4)
			{
				if(xhr.status == 200 && xhr.responseText)
				{
					var conflongkey = ('' + xhr.responseText).split('-X-');
					var longkey = conflongkey[0].replace(/\+/gim, '%2B'); //.replace(/\%2B/gim, '+').replace(/\%2b/gim, '+');
					conflongkey = conflongkey[1].replace(/\+/gim, '%2B'); //.replace(/\%2B/gim, '+').replace(/\%2b/gim, '+');
					g_longkey = longkey;
					g_identity_secret = identitySecret;
					var confpage = "https://steamcommunity.com/mobileconf/conf?p=" + devhash + "&a=" + steamID + "&k=" + conflongkey + "&t=" + timeforlongkey + "&m=android&tag=conf";
					xhr = new XMLHttpRequest();
					xhr.open("GET", confpage, true);
					xhr.send(null);
					xhr.onreadystatechange = function()
					{
						if (xhr.readyState == 4)
						{
							if(xhr.status == 200 && xhr.responseText)
							{
								var data = xhr.responseText;
								var ohno = $('.mobileconf_done:eq(0)', data).text();
								var steamerror = $('.sectionText:eq(0)').text();
								var errorlen = ((data.replace('sectionText', '')).replace('502 Bad Gateway', '')).length;
								var usuallen = data.length;
								if ((ohno == "") && (errorlen >= usuallen))
								{
									if(!(/(.*)(\-)(.)(\-)(.)(\-)(.*)/g.test($('#mobileconf_empty', data).text())))
									{
										var options = {
											type: "basic",
											title: "Error",
											message: "Bad IdentitySecret for this SteamID!\n",
											iconUrl: 'images/icon128.png'
										};
										conferror.play();
										chrome.notifications.clear( 'dataError', function () { });
										chrome.notifications.create( 'dataError', options, function (id) { });
									}
									else
									{
										var options = {
											type: "basic",
											title: "Ops!",
											message: "Data loading failed!\nSimple Steam error or something wrong. May be it is not your steamID?",
											iconUrl: 'images/icon128.png'
										};
										//conferror.play();
										chrome.notifications.clear( 'dataError', function () { });
										chrome.notifications.create( 'dataError', options, function (id) { });
									}
								}
								var confirmationKey = $('.mobileconf_list_entry:eq(0)', data).attr('data-key'); //get on the conf page
								if ((confirmationKey != "") && (confirmationKey != undefined))
								{
									chrome.tabs.create({ url : confpage, selected : false}, function(tab)
									{
										localStorage.removeItem('tabidremove');
										localStorage.setItem('tabidremove', tab.id);
									});
								}
								else
								{
									setTimeout(tradeauth, localStorage.getItem('rate'));
								}
							}
							else if(xhr.status == 429)
							{
								chrome.runtime.sendMessage('msg:Error 429. Too many requests.');
								setTimeout(tradeauth, 5000);
							}
							else
							{
								/*chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
								chrome.browserAction.setBadgeText({ text: "Error"});*/
								chrome.runtime.sendMessage('msg:Error ' + xhr.status + '.');
								setTimeout(tradeauth, localStorage.getItem('rate'));
							}
						}
					}
				}
				else
				{
					chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
					chrome.browserAction.setBadgeText({ text: "Error"});
					setTimeout(tradeauth, localStorage.getItem('rate'));
				}
			}
		}
	}
	else //if((scan == 'false') || (localStorage.getItem('sub') != 'true'))
	{
		chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000'});
		chrome.browserAction.setBadgeText({ text: "Off"});
		setTimeout(tradeauth, 2000);
	}
}

/*function connection()
{
	var ifscan = localStorage.getItem('scan');
	var extensionID1 = "imbneijeenaegfmglkkigjdeelcnopbi"; //for PUBLISHED MarketDota2 and Csgo.tm Trade Helper
	//var extensionID2 = "pjkbgaempebkiffpdfjoapdkojdmimki"; //for USERSCRIPT MarketDota2 and Csgo.tm Trade Helper
	if(ifscan == 'true')
	{
		chrome.runtime.sendMessage(extensionID1, {data: 'connectionTrue'});
		//chrome.runtime.sendMessage(extensionID2, {data: 'connectionTrue'});
	}
	if(ifscan == 'false')
	{
		chrome.runtime.sendMessage(extensionID1, {data: 'connectionFalse'});
		//chrome.runtime.sendMessage(extensionID2, {data: 'connectionFalse'});
	}
	setTimeout(connection, 2000);
}*/

chrome.tabs.onRemoved.addListener( function(tabId, removeInfo)
{
	var truetabid = localStorage.getItem('tabidremove');
	if (tabId == truetabid) setTimeout(tradeauth, localStorage.getItem('rate'));
});

localStorage.removeItem('subloadin');
localStorage.removeItem('accountMail');
localStorage.removeItem('days');
localStorage.removeItem('sub');
chrome.storage.sync.set({'tradeConfirmer': 'false'});
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
			setTimeout(tradeauth, 15000);
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
			setTimeout(tradeauth, 15000);
		}
		else if(response == 'getFastKey')
		{
			var telltoTab = localStorage.getItem('tabidremove');
			telltoTab = parseInt(telltoTab);
			var timeIs = new Date();
			timeIs = timeIs.getTime() / 1000 | 0;
			xhr = new XMLHttpRequest();
			xhr.open("GET", "http://83.220.175.150:37999/createhashes/?t=" + timeIs + "&s=" + localStorage.getItem('IdentitySectet'), true);
			xhr.send(null);
			xhr.onreadystatechange = function()
			{
				if (xhr.readyState == 4)
				{
					if(xhr.responseText)
					{
						var fastkey = ('' + xhr.responseText).replace(/(\-X\-)(.*)/g, '');
						chrome.tabs.sendMessage(telltoTab, {data: fastkey, timeIs : timeIs});
					}
					else
					{
						chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
						chrome.browserAction.setBadgeText({ text: "Error"});
						chrome.tabs.sendMessage(telltoTab, {data: "netError"});
					}
				}
			}
		}
		else if(response == 'getConfData')
		{
			chrome.tabs.sendMessage(sender.tab.id, 
			{
				devhash: g_devhash,
				steamID : g_steamID,
				timeforlongkey : g_timeforlongkey,
				longkey : g_longkey,
				identity_secret : g_identity_secret,
			});
		}
		else if(response == 'subscription')
		{
			localStorage.removeItem('subloadin');
			localStorage.removeItem('accountMail');
			localStorage.removeItem('days');
			localStorage.removeItem('sub');
			localStorage.setItem('subloadin', 'ongoing');
			var subcheck = new XMLHttpRequest();
			subcheck.open("GET", "http://extensions.risenraise.com/profile/", true);
			subcheck.send(null);
			subcheck.onreadystatechange = function()
			{
				if(subcheck.readyState == 4)
				{
					if(subcheck.responseText && subcheck.status == 200)
					{
						var data = subcheck.responseText;
						var email = $('#email', data).text();
						if(email != '')
						{
							var subDays = $('span[name="Steam Trade Auto Confirm"]', data).text();
							if(subDays == '')
							{
								subDays = $('span[name="Opskins Trade Helper"]', data).text();
							}
							if((subDays != undefined) && (subDays != '') && (parseInt(subDays) >= 0))
							{
								if(subDays == '0') subDays = 1;
								var subscription = 'true';
								chrome.storage.sync.set({'tradeConfirmer': subscription});
								setTimeout(SubscriptionCirckle, 1800000);
							}
							else
							{
								var subscription = 'false';
								subDays = '0';
							}
							localStorage.setItem('accountMail', email);
							localStorage.setItem('days', subDays);
							localStorage.setItem('sub', subscription);
						}
						else
						{
							var subscription = 'false';
							var subDays = '0';
							localStorage.setItem('accountMail', email);
							localStorage.setItem('sub', subscription);
							localStorage.setItem('days', subDays);
						}
						localStorage.removeItem('subloadin');
					}
					else
					{
						localStorage.removeItem('subloadin');
					}
				}
			}
		}
	}
});

function SubscriptionCirckle()
{
	localStorage.removeItem('subloadin');
	localStorage.removeItem('accountMail');
	localStorage.removeItem('days');
	localStorage.removeItem('sub');
	var subcheck = new XMLHttpRequest();
	subcheck.open("GET", "http://extensions.risenraise.com/profile/", true);
	subcheck.send(null);
	subcheck.onreadystatechange = function()
	{
		if(subcheck.readyState == 4)
		{
			if(subcheck.responseText && subcheck.status == 200)
			{
				localStorage.removeItem('subloadin');
				var data = subcheck.responseText;
				var email = $('#email', data).text();
				if(email != '')
				{
					var subDays = $('span[name="Steam Trade Auto Confirm"]', data).text();
					if(subDays == '')
					{
						subDays = $('span[name="Opskins Trade Helper"]', data).text();
					}
					if((subDays != undefined) && (subDays != '') && (parseInt(subDays) >= 0))
					{
						if(subDays == '0') subDays = 1;
						var subscription = 'true';
					}
					else
					{
						var subscription = 'false';
						subDays = '0';
					}
					localStorage.setItem('accountMail', email);
					localStorage.setItem('days', subDays);
					localStorage.setItem('sub', subscription);
					chrome.storage.sync.set({'tradeConfirmer': subscription});
				}
				else
				{
					var subscription = 'false';
					var subDays = '0';
					localStorage.setItem('accountMail', email);
					localStorage.setItem('sub', subscription);
					localStorage.setItem('days', subDays);
					chrome.storage.sync.set({'tradeConfirmer': subscription});
				}
				setTimeout(SubscriptionCirckle, 1800000);
			}
			else
			{
				localStorage.removeItem('subloadin');
				setTimeout(SubscriptionCirckle, 120000);
			}
		}
	}
}