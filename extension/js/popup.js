function preLoader()
{
	var scan = localStorage.getItem('scan');
	if(localStorage.getItem('scan') == 'true')
		$('#buttononoff')[0].checked = true;
	else
	{
		$('#buttononoff')[0].checked = false;
		scan = 'false';
		localStorage.setItem('scan', scan);
	}
	
	var steamId = localStorage.getItem('steamId');
	if (steamId == undefined)
	{
		steamId = '';
		localStorage.setItem('steamId', steamId);
	}
	$('#steamId')[0].value = steamId;
	
	var identitySecret = localStorage.getItem('identitySecret');
	if(identitySecret == undefined)
	{
		identitySecret = '';
		localStorage.setItem('identitySecret', identitySecret);
	}
	$('#identitySecret')[0].value = decodeURIComponent(identitySecret);
	
	var check_rate = parseInt(localStorage.getItem('rate'));
	if(!isNaN(check_rate))
	{
		if(check_rate < 1000)
		{
			check_rate = 1000;
		}
		else if(check_rate > 60000)
		{
			check_rate = 60000;
		}
	}
	else
	{
		check_rate = 10000;
	}
	if(check_rate != localStorage.getItem('rate'))
		localStorage.setItem('rate', check_rate);
	$('#rate').val(check_rate);
}

function listeners()
{
	$('#buttononoff').change( function()
	{
		if(this.checked == true && $('#identitySecret')[0].value && $('#steamId')[0].value)
		{
			localStorage.setItem('scan', 'true');
			chrome.browserAction.setBadgeBackgroundColor({ color: '#B9FF00'});
			chrome.browserAction.setBadgeText({ text: "On"});
		}
		else
		{
			if(!$('#identitySecret')[0].value && !$('#steamId')[0].value)
				chrome.runtime.sendMessage('msg:No steamId and identitySecret.');
			else if(!$('#steamId')[0].value)
				chrome.runtime.sendMessage('msg:No steamId.');
			else if(!$('#identitySecret')[0].value)
				chrome.runtime.sendMessage('msg:No identitySecret.');
			this.checked = false;
			localStorage.setItem('scan', 'false');
			chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000'});
			chrome.browserAction.setBadgeText({ text: "Off"});
		}
	});
	
	$('#rate').change( function()
	{
		var set_rate = parseInt(this.value);
		if(!isNaN(set_rate))
		{
			if(set_rate < 1000)
			{
				set_rate = 1000;
			}
			else if(set_rate > 20000)
			{
				set_rate = 20000;
			}
		}
		else
		{
			set_rate = 5000;
		}
		localStorage.setItem('rate', set_rate);
		$('#rate').val(set_rate);
	});
	
	$('#steamId, #identitySecret').change( function()
	{
		var steamId = parseInt($('#steamId')[0].value);
		if (isNaN(steamId))
		{
			steamId = '';
			$('#steamId')[0].value = steamId;
		}
		localStorage.setItem('steamId', steamId);
		
		var identitySecret = $('#identitySecret')[0].value;
		localStorage.setItem('identitySecret', encodeURIComponent(identitySecret));
		if(!identitySecret || !steamId)
		{
			$('#buttononoff')[0].checked = false;
			localStorage.setItem('scan', 'false');
			chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000'});
			chrome.browserAction.setBadgeText({ text: "Off"});
		}
	});
}

$('document').ready( function()
{
	preLoader();
	listeners();
});