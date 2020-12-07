<!-- README HEADER -->
<br />
<p align="center">
  <a href="https://good-laughs.herokuapp.com/images/logo.png" width="190" height="100">
    <img src="https://good-laughs.herokuapp.com/images/logo.png" alt="Logo" width="190" height="100">
  </a>
  
  <h3 align="center">GoodLaughs</h3>

  <p align="center">
    Developers: Dan Chin, Ty Newman, Derek Nungesser, and Chris Read
    <br />
    <a href="https://github.com/Ty-Newman/GoodLaughs/wiki"><strong>Explore the docs... »</strong></a>
    <br />
    <br />
    ·
    <a href="https://good-laughs.herokuapp.com/">View Demo</a>
    ·
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#overview">Overview</a>
      <ul>
        <li><a href="#technologies-used">Technologies Used</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
      <ul>
        <li><a href="#laughBox">LaughBox</a></li>
        <li><a href="#feature-two">Feature 2</a></li>
      </ul>
    <li><a href="#challenges">Challenges</a></li>
    <li><a href="#code-snippets">Code Snippets</a></li>
  </ol>
</details>



<!-- Overview -->
## Overview

Everybody needs a good laugh from time to time. That's where GoodLaughs can help.

Here's why:
* GoodLaughs is a way for users to share, create, and review laughs
* A laugh can be as simple as a knock-knock joke or a long and humorous story
* Users can save their laughs forever with a LaughBox - create your own and put laughs into it so you'll never forget where a specific laugh is

In the future, we want our users to be able to use GoodLaughs as a social media platform. The ability to search laughs, have a custom profile, and add friends are all features we would have liked to implement.

### Technologies Used

Below are a few examples of technologies we used in order to complete our project.

* [Heroku](https://www.heroku.com/)
* [PugJS](https://pugjs.org/api/getting-started.html)
* [Express](http://expressjs.com/)

<!-- Features -->
## Features

Below are two key features to our app that we feel are worth sharing about here.

### LaughBox

The LaughBox allows users to save specific laughs to one or more laughboxes in order to easily find laughs. Users are able to create a custom laughbox and save laughs to it. Many laughs can be stored in a laughbox. The intention of this feature is for users to keep their laughs organized by dad-jokes, raunchy humor, or any category a user can think of.

### Laughs

Laughs are displayed the main page of the application if a user is logged in. The sleek design gives the application more of a social media feel. Users are able to read the laugh, rate (laugh), super-rate (bow), and review the laugh all in one block.


<!-- CHALLENGES -->
## Challenges

This app was created for the first group project as part of the AppAcademy curriculum. Being that it was meant to be a learning experience, all of the developers learned a lot. Below are a few challenges that were necessary to overcome in order to complete the app in the timeframe given.

1. It was challenging trying to coordinate multiple working parts from each developer into one working application. In order to overcome this, we utilized the scrum board feature on GitHub. It was extremely helpful in us staying organized, knowing who is working on what, and how much progress is being made overall.

2. Because we had very recently learned OAuth, it was extremely difficult to get working properly. However, each member of the development team put in the work to figure it out and everyone learned a lot more about how it works and how to get it to work for our application.

3. The final product was destined to have grand plans. However, being it's the first team project, the scope of what could be accomplished was limited given the time frame of one week. Being able to come together as a team was crucial in being able to complete the planned key features for the application. Some of the developers are more skilled with frontend and others are more skilled with backend. Because of that, it was a great learning experience because developers could help each other on certain tasks.

<!-- CODE-SNIPPETS -->
## Code-Snippets

Below are a few code snippets that the deveopers feel demonstrate strong skills and knowledge of what has been learned up to this point.


1. The 5 star rating
```
  div(class="rate")
            input(type="radio" id="star5" name="rate" value="5")
            label(for="star5" title="text") 5 stars
            input(type="radio" id="star4" name="rate" value="4")
            label(for="star4" title="text") 4 stars
            input(type="radio" id="star3" name="rate" value="3")
            label(for="star3" title="text") 3 stars
            input(type="radio" id="star2" name="rate" value="2")
            label(for="star2" title="text") 2 stars
            input(type="radio" id="star1" name="rate" value="1")
            label(for="star1" title="text") 1 star
          div
```

2. Bows logic
```
const bowsBoolean = (bows === 'on') ? true : false;
```

3. Custom CSS for buttons
```
.flex-outer li a{
    padding: 6px 8px;
    border: none;
    background: #333;
    color: #f2f2f2;
    text-transform: uppercase;
    letter-spacing: .09em;
    border-radius: 2px;
    text-decoration: none;
  }
```
