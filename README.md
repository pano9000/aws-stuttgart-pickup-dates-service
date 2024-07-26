# Abfallwirtschaft Stuttgart (AWS) Pickup Dates Service (Work in Progress)

## What is this?
This Nuxt3 powered project aims to provide a web service that makes it easier to get information about the Pickup Dates of Stuttgart's municipal city cleaning company `Abfallwirtschaft Stuttgart (AWS)`.

To achieve this it queries the public API of the `Abfallwirtschaft Stuttgart (AWS)`, which is a bit limited in its features and stores/caches the data in a Redis DB.

It (will) consist of two parts:
* a REST-like API that allows to retrieve data about the pickups in different formats:
  * JSON for general usage (also powers the frontend of this app)
  * iCal for usage in Calendars and such
* a VueJS based frontend site
  * allowing to quickly get an overview

## Why?
The `Abfallwirtschaft Stuttgart (AWS)` API is a bit limited in what it provides:

It only allows for the streetname and no to be set and then dumps all of the pick ups (*twice*: once grouped by pickup type and a second time grouped by date, but unsorted) in its result.

This makes it a bit hard to use straight away, as data will need transformation every single time you fetch it.

Also, I wanted to test out Nuxt for a full-stack project 🙂