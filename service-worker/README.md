# What is Service worker ?

Service workers are scripts that are run by web browser in the background separate from the web page which allows use of features that don't need a web page or user interactions.
They don't have any direct relationship with the DOM allowing developers and engineers end-to-end control over the user's interactions with the app.
One overriding problem that web users have suffered with for years is loss of connectivity.
The best web app in the world will provide a terrible user experience if you can't download it. There have been various attempts to create technologies to solve this problem, and some of the issues have been solved. But the overriding problem is that there still isn't a good overall control mechanism for asset caching and custom network requests.
The previous attempt, AppCache, seemed to be a good idea because it allowed you to specify assets to cache really easily. However, it made many assumptions about what you were trying to do and then broke horribly when your app didn't follow those assumptions exactly.
Service workers should finally fix these issues. Service worker syntax is more complex than that of AppCache, but the trade-off is that you can use JavaScript to control your AppCache-implied behaviors with a fine degree of granularity, allowing you to handle this problem and many more. Using a Service worker you can easily set an app up to use cached assets first, thus providing a default experience even when offline, before then getting more data from the network
