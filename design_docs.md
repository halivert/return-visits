# Return visits

As Jehovah's witnesses we want to track who we visit and when to make the return
visits. People information is sensible data, so it shouldn't leave the device
where it was saved at least in network events like cloud backups.

## Use cases

### The publisher wants to see the information of the people

Filter and sort the information.
Filter by some fields like, colony.
See the nearest people with device location.

### The publisher wants to update the information of the people

When she updates the information a new entry should be added, to let she know
that something changed, it must be slightly different to common entries.

## The publisher wants to add another person with same location

When there's another person who answers the door, we want to save as a new
person record, but with the same location.

### The publisher wants to add new interested people

Write is not as common as reading, so the primary focus is on read the
information, filtering it, sorting it, etc.

### The publisher wants to add entries to return visits

When the publisher visits someone, she wants to see previous information and add
details if needed.

### The publisher wants to remove return visits entries

If something goes wrong she wants to remove some entry.

### The publisher wants to have backups

To migrate the information to another device or if something goes wrong, she
wants to create a backup (preferably encrypted to prevent data stealing), and
then able to import it in the same application but in different device.

## Tech

We have selected Vue framework with vite-pwa to provide offline experience, and
pwa capabilities like read location, and save to persistent db, (import and
export data).

The design system is using tailwindcss, with 5 custom colors obtained from
[coolors.co](https://coolors.co/7fb069-fffbbd-e6aa68-ca3c25-1d1a05), generated
with uicolors.app.

### Location

We need to interact with some location API as google maps to provide better
experience when sorting people by location.

### Storage

We need to use pinia in order to manage the global state in app.

IndexedDB is going to serve us as database.
The structure of the objects in the database should have the following
structure:

```
Person
{
	id: number
	name: string
	location: GeolocationPosition
	description: string
	returnDay: number
	colony: string
}

ReturnVisit
{
	person_id: number
	date: date
	topic: string
	notes: string
}
```

#### People object

keyPath: id, autoincrementing

returnDay is the day of the week where you should return to visit the person.

#### Return Visits object

keyPath: [person_id, date]
