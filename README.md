# Hangout app

## Project n°2 with Ironhack

This app allows you to share places you like to hangout in, be it for a picnic, to see a public representation, or just to grab a drink with friends ! Find places near you using geolocation !

You can comment places, add them to your favorites and even post places of your own. Geolocation is automatically included when you enter a valid address.

## [To see the postman documentation, click this link !](https://documenter.getpostman.com/view/21217013/UzBiPU7C#auth-info-f484d417-df75-4b4e-b14e-6f0f1073aed0)

## Description of your models

We have four models in our app

Comment Model :
The comment model has one to many connection with the user model & one to one connection with the place model.

Favourite Model :
The favourite model has connection with the user & place model.

Place Model:
This model has a connection with the user model and have fields like : name,address, geometry & typology

User Model :
This model has fields like : name , password , email & role

## Note##

We have used the stack like Nodejs, Express, MongoDB , heroku & mongodb atlas
