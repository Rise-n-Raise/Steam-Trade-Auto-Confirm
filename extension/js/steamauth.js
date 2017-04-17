try
{
	var devhash;
	var steamId;
	var timeforlongkey;
	var longkey;
	var identity_secret;
	$('document').ready(function()
	{
		if((("" + document.location).indexOf("mobileconf")) > (-1))
		{
			function getConfData(response, sender, sendResponse)
			{
				devhash = response.devhash;
				steamId = response.steamId;
				timeforlongkey = response.timeforlongkey;
				longkey = response.longkey;
				identity_secret = response.identity_secret;
				chrome.runtime.onMessage.removeListener(getConfData);
				startrequest();
			}
			chrome.runtime.onMessage.addListener(getConfData);
			chrome.runtime.sendMessage('getConfData');
		}
	});
	function startrequest()
	{
		var i = 0;
		var listsize = $('.mobileconf_list_entry').size();
		opCircle(i, listsize, devhash, steamId, timeforlongkey, longkey, identity_secret);
		function opCircle(i, listsize, devhash, steamId, timeforlongkey, longkey, identity_secret)
		{
			if(i < listsize)
			{
				var confirmationKey = $('.mobileconf_list_entry:eq(' + i + ')').attr('data-key');
				var confirmationID = $('.mobileconf_list_entry:eq(' + i + ')').attr('data-confid');
				if ((confirmationKey != undefined) && (confirmationID != undefined))
				{
					var link = "https://steamcommunity.com/mobileconf/ajaxop?op=allow&p=" + devhash + "&a=" + steamId + "&k=" + longkey + "&t=" + timeforlongkey + "&m=android&tag=allow&cid=" + confirmationID + "&ck=" + confirmationKey;
					var randtime = Math.floor((Math.random() * 1000) + 1000);
					i++;
					if(i == 1)
					{
						xhr = new XMLHttpRequest();
						xhr.open("GET", link, true);
						xhr.send(null);
						xhr.onreadystatechange = function()
						{
							if (xhr.readyState == 4)
							{
								if(xhr.responseText)
								{
									if(!(i < listsize)) window.close();
										setTimeout(opCircle, randtime, i, listsize, devhash, steamId, timeforlongkey, longkey, identity_secret);
								}
								else
								{
									chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
									chrome.browserAction.setBadgeText({ text: "Error"});
									window.close();
								}
							}
						}
					}
					else
					{
						function kostilyaka(response, sender, sendResponse)
						{
							var sendedHash = response.data;
							if (sendedHash == "netError")
							{
								window.close();
							}
							var link = "https://steamcommunity.com/mobileconf/ajaxop?op=allow&p=" + devhash + "&a=" + steamId + "&k=" + sendedHash + "&t=" + response.timeIs + "&m=android&tag=allow&cid=" + confirmationID + "&ck=" + confirmationKey;
							xhr = new XMLHttpRequest();
							xhr.open("GET", link, true);
							xhr.send(null);
							xhr.onreadystatechange = function()
							{
								if (xhr.readyState == 4)
								{
									if(xhr.responseText)
									{
										if(!(i < listsize)) window.close();
										setTimeout(opCircle, randtime, i, listsize, devhash, steamId, timeforlongkey, longkey, identity_secret);
									}
									else
									{
										chrome.browserAction.setBadgeBackgroundColor({ color: '#602B6D'});
										chrome.browserAction.setBadgeText({ text: "Error"});
										window.close();
									}
								}
							}
							chrome.runtime.onMessage.removeListener(kostilyaka);
						}
						chrome.runtime.onMessage.addListener(kostilyaka);
						chrome.runtime.sendMessage('getFastKey');
					}
				}
			}
			else
			{
				window.close();
			}
		}
	}
}
catch(err)
{
	alert();
	window.close();
}