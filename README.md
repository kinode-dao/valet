# Valet
Manage your [Kinode](https://github.com/kinode-dao/kinode) nodes via the web.

## Features
- [ ] Sign in with X (fka Twitter)
- [ ] Choose a node name
- [ ] View node status

```
A) You'll need to create a route that, when appended with a JWT will ingest that JWT for subsequent use a bearer token for the current user.  So for example, let's say you made a route handling /app/process-jwt?token=ey94j49f03df.ey3099ur4thiswholethingisthejwt94389340.ey3839823 such that then if the user clicked a Retrieve My User Details button, making a request to the hosting backend at api.staging.kinode.net/get-user-info-x, you'd include a header 'Authorization: bearer ey94j49f03df.ey3099ur4thiswholethingisthejwt94389340.ey3839823'.
and
B) When the user clicks Sign On With X, you'll make a POST to api.staging.kinode.net/x/get-redirect-url with a payload of {"finalRedirectUrl": "https://thisismykinodeurl.kinode.net/app/process-jwt?token="} (That's assuming the example route above in A.  Make it whatever you want it to be!  Whatever you put in there, the user will eventually find themselves at the very end of the process at that page with their fresh JWT appended to the end of it.)  We'll respond with json like {"url": "https://api.twitter.com/oauth/authenticate?oauth_token=someoauthtoken"}, and you should 302 the user to that address.
Johnathan — Today at 2:53 PM
The actors will be "the user" (and the user's browser), "the frontend app you're making", "the hosting backend", and "X" (which won't directly be involved in the endpoints you hit but will nonetheless be involved in the flow).
1) The user will be using your frontend, and decides to engage with your "Sign In With X" button/link/whatever.  They click and wait for your app to send them a response.
2) You POST a request to the hosting backend at /x/get-redirect-url with payload to specify the "finalRedirectUrl", which will be the page you want the user to arrive at once their userToken is generated (the exact same sort of JWT that the backend supplies after a standard login).  This is the endpoint mentioned in A above.
3) The hosting backend gets this post, talks to X, saves the finalRedirectUrl and some info X sent us to a database table, and responds to your app with some json like {"redirect_url":"https://api.twitter.com/oauth/authenticate?oauth_token=837263something238742398"}.
4) Your app can now finally respond to the user with a 302 to the redirect URL.  The user's browser will then make a request to X.
5) Depending on whether or not the user is already logged in and/or has authorized the hosting backend to access their X info, by the time logging in / authorizing has taken place, X will respond to the user's browser with a redirect back to the hosting backend, passing some tokens that we need for OAuth.
6) The hosting backend will process that info, get all the info it needs about the X user (and will not need to talk to X after that), and either retrieve an existing user or create a new one and create a user JWT to "log in" that user.  And the hosting backend will respond to the user's browser with a redirect to the finalRedirectUrl with the JWT appended as a querystring param.
7) That finalRedirectUrl should be your frontend, and it should store that appended JWT in a cookie or local storage or whatever.
8) At that point, your app running on someone's kinode can make any manner of authenticated requests to the hosting backend by including the JWT as a bearer token in the authorization header.  Ultimately, this will be used to the launch a free kinode for the user (if they don't already have a free one), but for now, just call the /get-user-info-x endpoint that will return a json payload with the hosting userId, the X userId, and the X screen name.  That way you can have something to call and display so it's easy to verify to you and the user that the whole OAuth process worked.
Johnathan — Today at 3:00 PM
Step 6 is the end of anything OAuth-releated, and all subsequent stuff is just normal user management, same as someone who logged in with email/password, including refreshing their token.  Only after they log out / time out and want to log back in again will OAuth be engaged again from Step 1.
That should do the trick.  You'll never need to interact with X directly, although in step 4 you'll be 302ing your user to an X address (because that'll be where I tell you you should 302 them to in step 3).
```