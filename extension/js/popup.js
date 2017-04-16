$('document').ready( function()
{
	var scan = localStorage.getItem('scan');
	if (scan == undefined )
	{
		localStorage.removeItem('scan');
		scan = 'false';
		localStorage.setItem('scan', scan);
	}
	var steamid = localStorage.getItem('steamid');
	if ((steamid == undefined) || (steamid == ""))
	{
		localStorage.removeItem('steamid');
		steamid = '';
		localStorage.setItem('steamid', steamid);
	}
	var IdentitySectet = localStorage.getItem('IdentitySectet');
	if ((IdentitySectet == undefined) || (IdentitySectet == ""))
	{
		localStorage.removeItem('IdentitySectet');
		IdentitySectet = '';
		localStorage.setItem('IdentitySectet', IdentitySectet);
	}
	if (localStorage.getItem('scan') == 'true') document.getElementsByTagName('input')[0].checked = true;
	document.getElementsByTagName('input')[2].value = localStorage.getItem('steamid');
	document.getElementsByTagName('input')[3].value = decodeURIComponent(localStorage.getItem('IdentitySectet'));
	
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
	$('#rate').change( function()
	{
		var set_rate = parseInt($(this).val());
		if(!isNaN(set_rate))
		{
			if(set_rate < 1000)
			{
				set_rate = 1000;
			}
			else if(set_rate > 60000)
			{
				set_rate = 60000;
			}
		}
		else
		{
			set_rate = 10000;
		}
		localStorage.setItem('rate', set_rate);
		$('#rate').val(set_rate);
	});
	
	document.addEventListener("change", function(e)
	{
		localStorage.removeItem('scan');
		if((document.getElementsByTagName('input')[0].checked == true) && (localStorage.getItem('sub') == 'true'))
		{
			localStorage.setItem('scan', 'true');
		}
		else
		{
			document.getElementsByTagName('input')[0].checked == false;
			localStorage.setItem('scan', 'false');
		}
		var checker = parseInt(document.getElementsByTagName('input')[2].value);
		if (isNaN (checker))
		{
			document.getElementsByTagName('input')[2].value = "";
		}
		localStorage.removeItem('steamid');
		localStorage.setItem('steamid', document.getElementsByTagName('input')[2].value);
		localStorage.removeItem('IdentitySectet');
		localStorage.setItem('IdentitySectet', encodeURIComponent(document.getElementsByTagName('input')[3].value));
		if((document.getElementsByTagName('input')[3].value == "") || (document.getElementsByTagName('input')[2].value == ""))
		{
			localStorage.removeItem('scan');
			localStorage.setItem('scan', 'false');
			document.getElementsByTagName('input')[0].checked = false;
		}
		if (document.getElementsByTagName('input')[0].checked == true)
		{
			chrome.browserAction.setBadgeBackgroundColor({ color: '#B9FF00'});
			chrome.browserAction.setBadgeText({ text: "On"});
		}
	});
	$('#buttononoff').click( function()
	{
		if((document.getElementsByTagName('input')[0].checked == false) || (localStorage.getItem('sub') != 'true'))
		{
			document.getElementsByTagName('input')[0].checked = false;
			chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000'});
			chrome.browserAction.setBadgeText({ text: "Off"});
		}
	});
	if(localStorage.getItem('sub') != "true")
	{
		if(localStorage.getItem('subloadin') == 'ongoing')
		{
			document.getElementById('subBut').disabled = true;
			$('#subBut').text('Checking.');
			setTimeout(waiter, 750);
		}
		$('#subBut').click( function()
		{
			if(localStorage.getItem('subloadin') != 'ongoing')
			{
				document.getElementById('subBut').disabled = true;
				$('#subBut').text('Checking.');
				setTimeout(waiter, 750);
				chrome.runtime.sendMessage("subscription");
			}
		});
	}
	else
	{
		waiter();
	}
});

function waiter()
{
	var subka = localStorage.getItem('subloadin');
	if(subka == 'ongoing')
	{
		if($('#subBut').text() == 'Checking...')
			$('#subBut').text('Checking.');
		else
			$('#subBut').text($('#subBut').text() + '.');
		setTimeout(waiter, 750);
	}
	else
	{
		var oneTime = 0;
		onLoaded();
		function onLoaded()
		{
			if((localStorage.getItem('accountMail') == undefined) || (localStorage.getItem('accountMail') == ''))
			{
				$('.subscription').html('<a target="_blank" href="http://extensions.risenraise.com/accounts/login/" ><span align="center"><font size="4" align="center">login</font></span></a>');
				oneTime++;
				if(oneTime < 20) setTimeout(onLoaded, 200);
			}
			else
			{
				$('.subscription').html('<a target="_blank" href="http://extensions.risenraise.com/profile/" ><div align="center"><span style="font-size: 12pt;" align="center">' + localStorage.getItem('accountMail') + '</span></a><span> days: ' + localStorage.getItem('days') + '</span></div></a>');
			}
		}
	}
}