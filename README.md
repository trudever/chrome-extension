# noted

noted_api is available at https://github.com/KushagraAgarwal525/noted_api

## Problem statement

If you've ever done any research, studied for a test or looked for the next best gadget to buy, you've probably scoured the internet, different websites, highlighting and copying over important information from each website you visit. Taking notes while doing textbook research is pretty commonplace, but there exists no good way for people to take, highlight and save notes while visiting webpages. It's pretty ironic when you think about it.

## Proposed solution and prototype

To solve the problem, comes noted. A chrome web extension with the ability for users to register, login, take notes and highlights specific to each site, share them with specific usernames and conveniently summarise all of it site wise in a user-friendly manner.

### Core features

- Take notes and highlights specific to each site.
- Share notes for specific sites with other specified usernames.
- Login and register to the chrome extension to make sure the important stuff is never lost!

### TODO

- Bring the unreleased higlight feature to completion.
- Add the ability to summarise notes and highlights.
- Add the option to search through notes of all sites.
- Remember login credentials for the chrome extension.
- Fix security bugs.

### What was done

A RESTful [API](https://github.com/KushagraAgarwal525/noted_api) was created using Express.js, Node.js, and MongoDB as the database. The API serves as a universal front to serve and update data to and from the users. The API stores the user passwords using a one-way hash which provides security. Mongoose data models were used for the MongoDB database which stores all data related to users and notes. The starter template code from https://github.com/raman-at-pieces/youtube-bookmarker-starter-code was used a base for the chrome extension. The background.js file used chrome.tabs to send messages when events of interest occured which were listened to and acted upon by the contentScripts.js file. The chrome extension in all, uses the fetch API to connect to the Express server which queries the database. The codebase also has a utils.js file containing utility functions which are exported from the file for reusability. 

### Challenges faced

- Attempt to create the extension using Next.js dropped due to uneasy development experience.
- Devising a solution to make sure users never lose the important stuff.
- Finding a way to store highlights.
- Remembering logged in users.

### Skills we acquired during the course of the challenge

- Working with the Chrome API
  - contentScripts
  - background.js
  - manifest.json
  - contextMenus
- Testing the chrome extension locally in developer mode.
- Converting ISO string timestamp to more user-friendly format using toLocaleString with options.
 



