Erik Deijl

#Beschrijving API

##Inleiding
Bij een product zoals Drivr gebeurt er natuurlijk erg veel aan de achterkant.
Het selecteren van de geschikte koerier, berichten verzenden en pakketen organiseren
is niet direct te zien voor een eindgebruiker. In dit document worden dit soort processen meer toegeligt.
Ook de endpoints (links die andere applicaties aanspreken) worden besproken met de functionaliteit die er aan
vast zit.

##Endpoints
Om ons systeem beschikbaar te maken voor andere applicaties is er een API gebouwt,
deze API maakt het gemakkelijk om met elke taal die over het internet kan communiceren
verbinding te maken met onze backend. Zo is de nood om zelf een applicatie te ontwikkelen
weggenomen. Hier zal beschreven worden wat elk endpoint kan en hoe het gebruikt moet worden.

Als eerste is de basislink naar de API [http://saddl-api.herokuapp.com](http://saddl-api.herokuapp.com).
Deze moet voor elk endpoint geplaatst worden om er requests op te kunnen doen.

Als eerste moet een gebruiker geauthenticeerd worden. Dit word gedaan op `/api/token`, Een applicatie
doet hier een POST request naartoe met in een json bestand het email adress van de gebruiker en zijn wachtwoord.
Dit komt er als volgt uit te zien

    POST /api/token
    {
      "email": "test@test.com",
      "password": "test"
    }

De applicatie krijgt vervolgens een object terug met daarin de access token die bij elke request meegegeven moet
worden zodat de API weet wie de request doet, en dus op de gebruiker gericht antwoord kan geven.

Er is ook een lijst met koeriers beschikbaar deze is te vinden op `/api/couriers` op dezelfde link is tevens een nieuwe 
courier in te voeren met een POST request.

De locatie van een koerier is bij te werken op `/api/courier/location` met een POST request met daarin de latitude en de longitude coördinaten.

Om van een gebruiker alle orders op te halen moet er een GET request gedaan worden op `/api/orders?access_token={access_token}` hierbij is het meegeven
van de access token die eerder opgehaald is via het token endpoint. Dit om er voor te zorgen dat niet iedereen andermans orders kan bekijken. Op dit adress kan 
ook een nieuwe order ingeschoten worden door in JSON een order mee te geven.
Als je alle orders op haalt krijg je niet alle details terug van de order. Dit vanwege beperkingen in het Mongoose framework voor MongoDB.
Om toch alle informatie over een order op te halen moet er een GET request gedaan worden op `/api/orders/:id` waarbij het id het order id is.

Het is niet mogelijk om alle users op te halen, dit vanwege privacy redenen en om het niet mogelijk te maken om snel veel gebruikers te verzamelen,
wel is het mogelijk om individueel gebruikersinformatie op te halen, dit moet gedaan worden op `/api/users/:id` hierbij word alleen de naam en de rol van de gebruiker weergeven.
Het is ook mogelijk om je eigen gegevens op te vragen, dit kan je doen op `/api/users/me?access_token={access_token}` hierbij is het weer verplicht om een access token mee te geven.
Nieuwe gebruikers aanmaken gebeurt ook op het `/api/users` endpoint, dit gebeurt met een POST request met daarin een email adress, het wachtwoord, en een bevestiging van dit wachtwoord.
Het wachtwoord weizigen is ook mogelijk, dit kan met een PUT request met daarin het oude wachtwoord en het nieuwe wachtwoord plus een bevestiging.

Om een overzicht te krijgen van de berichten die het systeem verzend kan er een GET request gedaan worden op `/api/message`, hierin word in één lijst alle messages weergeven.
Berichten van individuele couriers zijn ook te zien door op `/api/message/:courier` een request te doen met daarin het id van de courier.

##Koerier selectie
Om de juiste koerier te selecteren worden er een aantal checks gedaan op alle koeriers. Drivr selecteert namelijk een koerier op basis van specialiteit, beschikbaarheid, snelheid en capaciteit.
Als eerste worden alle koeriers er uit gefilterd die niet de juiste specialisatie hebben, hiermee word de lijst met beschikbare koerier direct een stuk korter. Vervolgens worden alle overgebleven koeriers gecheckt op beschikbaarheid,
zijn ze beschikbaar, dan word er gekeken of het pakketje nog in het vervoermiddel past. Dit gebeurt aan de hand van volume en gewicht. Als deze checks gedaan zijn blijft er maar een kort lijstje met koeriers over. Door de checks in deze volgorde te doen kan je heel snel
over een grote set koeriers filteren, gecombineerd met de verhoogde performance van het lezen uit MongoDB in tegenstelling tot een relationele database gebeurt het kiezen van een koerier dus razendsnel.
van de overgebleven koeriers worden de locaties doorgestuurd naar ESRI, hieruit krijgen wij voor elke koerier de reistijd terug, en kunnen wij gemakkelijk de snelste koerier kiezen.

###Foutafhandeling
Het kan natuurlijk voorkomen dat er op het moment geen koeriers beschikbaar zijn. Om dit af te vangen is er een task scheduler die elke 5 minuten checkt of er nog orders zijn die geen koerier toegewezen hebben, en loopt hiermee door het proces koerier toewijzing.

Als technology stack gebruiken wij Node.js, Node.js is redelijk gevoelig voor foutieve invoer, bijvoorbeeld JSON bestanden die niet juist geparsed worden. Node.js heeft de neiging om dan gelijk heel de applicatie in de ankers te gooien.
Dit is natuurlijk niet gewenst, om dit te voorkomen worden alle errors die gegenereerd worden doorgestuurd naar de logger en probeert de applicatie verder te gaan. Als het een error betreft die bij een gebruiker vandaan komt word de foutmelding
teruggestuurd naar de gebruiker. Is de error zo ernstig dat de applicatie zichzelf niet kan herstellen dan zal Heroku proberen de applicatie opnieuw te starten. Lukt het niet om de applicatie te starten zal de Administrator (In de context van het project is dit Erik Deijl) een mail
gestuurd worden met daarin de melding dat de applicatie gecrasht is.

