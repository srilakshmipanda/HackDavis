# HackDavis

In light of recent events that took place in Davis, we realized that our community was in need of a way to communicate effectively with eachother in order to keep each other safe. In those hard times students were forced to rely on police radios and scanners for updates on the events happening around them. Social media simply wasn't enough to keep track of all the locations over Davis to stay away from and not everyone was properly alerted of the attacks and events taking place.

For this purpose, we have designed a web application called "SafeZone". This application integrates the Google Maps API to present a map of the suspicious activity happening around you by using geolocation to sense your current location. This project uses JavaScript in React and TypeScript.

On opening the application there is a view of points of suspicious activity that were dropped previously by other people in the community. This data is stored in Firestore in Firebase. After calculating distance and other metrics, the application provides a radius around your current location so you can see where you are in relation to the suspicious activity occurring. 

In order to add a point on the map, users simply have to search and select the location in the search bar and select a descriptor for the activity in the dropdown and click submit. They will see an icon pop up on the map at the selected address that is color coded based on its descriptor. An index for the colors and labels of descriptors is shown on the left hand sidebar.