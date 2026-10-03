# Isolated field interface review

`field-review-route.txt` records the temporary fixture used to render the real Home component with Ava/Seiji, partial HP/MP and a fixed Subterrâneo Selado location. In that document only, `hydrate` installs fresh fixture data and `save` is disabled before the simulation starts. It neither reads nor writes the user's game save. Audio preferences still use the actual preference implementation.

The fixture was used for responsive UI and persistent mute review. It was removed from `app/` and its browser tab closed before production build. The user's separate game tab remained open and was not navigated or reloaded during this review.
