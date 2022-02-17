//Name: Callum Bruton (CB) / Evan Foley (EF)
//Description: This JavaScript (JS) file entire goal is to handle the displaying of the logo on first load.
//Date: 02-16-2022

function waitTime() //This is the waiting function that will have sit on the current page for three seconds.
{
    console.log("Hello I have loaded!");
	setTimeout(nextPage(), 3000);
}

function nextPage() //This will be called once the timer is done and sends us to the player-add screen.
{
    console.log("Hello next page has been called but I have no page to load.");
    document.getElementById('logo').remove();
}
