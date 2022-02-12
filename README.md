# Google maps

## How it works? 

#### The working principles are very simple:
- Server parses the data and caches it every time the data is being changed
- Sends the whole HTML as a static webpage

#### Advantages
The most obvious advatage is security. Client gets a simple static page. The changes are being made only on the server side.


#### Usage guide 
To start using this code, you will need to: 
- Create a Mongo database and get a connection link 
- Get your own google api key and turn on geocoding api
<br/>
The logic of the app is in index.js file, there you can edit output data like what exactly you want to display about the places. 
<br/>
<br/>
Preview of the map 
<br/>
https://practice-googlemaps-3plpvdlwj-niukanen1.vercel.app
