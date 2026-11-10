# Product requirements · Myllypuro Campus Guide
## Idea summary
New students can read a classroom name yet struggle to match a floor map to the corridor in front of them. The Myllypuro guide lets them search one floor and follow a single arrow over the camera view from a known starting point. Practice mode lets them try the interaction before visiting campus.
## Four-quadrant brainstorm
| Area | Ideas |
| --- | --- |
| Features | Search room names in English or Finnish, preview the walk, follow a centered arrow, practice on a laptop. |
| Problem | A visitor can face the wrong direction, miss a bend or struggle to interpret the map at a junction. |
| Audience | New students, visiting students and first-time campus visitors. |
| Value | The camera shows the corridor ahead and the arrow points toward the next bend. |
## Workshop prototype
Use floor 1 and a shared origin beside the info stand. Offer the 51 destinations with a traced approach on the 2015 architectural drawing. Required features are search, a marked origin and heading, route preview, camera guidance, practice mode and arrival feedback. Optional future work includes additional starting points and positional recalibration.
## User flow and rules
1. Select the starting-point map and align the phone with the marked corridor direction.
2. Search for a destination or open the full list. Choose a result to inspect its route and estimated distance.
3. Start camera or practice walk. Inputs are the route coordinates, initial heading and subsequent movement. Output is one rotating arrow at screen center.
4. Advance at internal checkpoints and display a checkmark near the destination. Exit ends the camera session. Camera permission errors allow the user to retry or practice.
## Technical and design needs
Use a dark, phone-sized layout and high-contrast arrow. On iPhone, estimate heading and step movement from orientation and motion events with an assumed 0.65 m stride. Supported WebXR phones can use relative tracked movement. Route length and turn points come from the historical plan; the phone needs a known starting pose.
## Success tests
- Search for a cafeteria in the directory and find the two dining-area results. An unmatched query should expose a clear-search action.
- Choose Demo classroom. Verify that the origin shown on the route matches the starting-point map.
- In practice mode, rotate and walk to each successive checkpoint. The guide should show arrival only near the final point.
- On site, ask a first-time visitor to reach the selected destination using the arrow. Record actual door, distance and missed turns. Physical verification remains open.
