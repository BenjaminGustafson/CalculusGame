# Calculus Game

A puzzle game that teaches calculus.

![Image showing gameplay](images/quadDemo.png)

## Main.js

The main app runs from here.

The game runs as a static webpage.
Graphics are drawn to a single canvas using the Canvas API. 
The canvas is fixed to a 16:9 ratio.

We keep a gameState object that contains a list of GameObjects and stored information.
In the main loop we update each GameObject.

## Scene

A scene is a level or a menu.
The Scenes.js file handles loading of scenes.
Scene data is organized by planet.
E.g. Linear.js contains all of the levels for Linear Planet.

## Game Objects

Every object drawn to the screen (e.g. buttons, sliders, sprites, text) is a GameObject.


## util

The util folder contains utilities like functions for drawing and color palette.

## Assets

Stored in images and audio folder.
The dialogue folder contains text data for dialogue. 