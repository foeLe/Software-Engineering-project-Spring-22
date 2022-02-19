//Name: Callum Bruton (CB) / Evan Foley (EF)
//Description: This JavaScript (JS) file entire goal is to handle the displaying of the logo on first load.
//Date: 02-16-2022

function waitTime() //This is the waiting function that will have sit on the current page for three seconds.
{
	setTimeout(nextPage, 3000);
}

function nextPage() //This will be called once the timer is done and sends us to the player-add screen.
{
    //document.getElementById('logo').remove(); //I was thinking that instead of removing the logo we should just jump directly to the next page.
    document.location.href="playerEntry.html"; 
}
