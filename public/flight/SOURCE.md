# Earth imagery used by the cockpit flight

The Earth globe is rendered in the browser from two locally stored NASA image composites:

- `earth-blue-marble-clouds.jpg` — NASA Goddard Space Flight Center / Blue Marble, land, ocean, ice and clouds: https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57735/land_ocean_ice_cloud_2048.jpg
- `earth-night-lights.jpg` — NASA Earth Observatory, Earth at Night: https://eoimages.gsfc.nasa.gov/images/imagerecords/55000/55167/earth_lights_lrg.jpg

The source images are equirectangular maps. The portfolio renders them onto a shaded sphere at runtime, then reuses that rendering in both the entry flight and the main hero. The user's supplied globe pictures are visual references and are not embedded in the site.

`galaxy-v2.png` is an original transparent galaxy sprite generated with the built-in image generation tool for this portfolio. The user's Milky Way image was a visual reference; it was not copied into the site. Prompt: “An isolated, richly detailed tilted spiral galaxy for a spaceship cockpit animation, luminous white-gold core, cobalt blue, indigo, violet, and restrained rose nebula bands, fine star clusters, dark dust lanes, transparent background, no text or spacecraft.”

The Solar System flythrough is drawn with Canvas at runtime: a moving orbital plane, Sun, asteroid belt, and shaded planets including Jupiter and ringed Saturn. The user's Solar System image guided the composition; the image itself is not embedded in the site.

The Product Universe planets are original procedural Canvas surfaces based on each product's theme color. They are visual metaphors for the projects, not maps of real celestial bodies.
