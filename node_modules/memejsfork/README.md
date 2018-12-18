# memejs
Get the best memes with ease!
This npm module is a fork of (this)[https://github.com/shadowolfyt/memejs] repository.

## Installation
```bash
npm install memejsfork --save
```

## Current Subreddits
```
crappydesign
dankmemes
me_irl
wholesomememes
blackmagicfuckery
OffensiveMemes
cringepics
Unexpected
memes
technicallythetruth
2meirl4meirl
ShittyLifeProTips
AnAttemptWasMade
facepalm
iamverysmart
quityourbullshit
```

## Usage
To get the full JSON output:
```js
const meme = require('memejsfork');

meme(function(data, err) {
  if (err) return console.error(err);
  console.log(data);
});
```
To get the meme title:
```js
const meme = require('memejsfork');

meme(function(data, err) {
  if (err) return console.error(err);
  console.log(data.title[0]);
});
```
To get the meme url:
```js
const meme = require('memejsfork');

meme(function(data, err) {
  if (err) return console.error(err);
  console.log(data.url[0]);
});
```
To get the author:
```js
const meme = require('memejsfork');

meme(function(data, err) {
  if (err) return console.error(err);
  console.log(data.author[0]);
});
```
to get the subreddit:
```js
const meme = require('memejsfork');

meme(function(data, err) {
  if (err) return console.error(err);
  console.log(data.subreddit[0]);
});
```
To get the time the meme was created:
```js
const meme = require('memejsfork');

meme(function(data, err) {
  if (err) return console.error(err);
  console.log(data.created[0]);
});
```
To get the UTC time the meme was created:
```js
const meme = require('memejsfork');

meme(function(data, err) {
  if (err) return console.error(err);
  console.log(data.created_utc[0]);
});
```
To filter subreddits:
```js
const meme = require('memejsfork`');

meme('crappydesign', function(data, err) {
  if (err) return console.error(err);
  console.log(data);
});
```
