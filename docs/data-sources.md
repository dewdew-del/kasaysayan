# Data sources

## Coastline: `data/ph-coast.json`

- **Source:** Natural Earth, *Admin 0 – Countries*, 1:10m scale (`ne_10m_admin_0_countries`), version 5.1.1
- **Download:** https://www.naturalearthdata.com/downloads/10m-cultural-vectors/
- **License:** Public domain. Natural Earth says its data "is in the public domain" and can be used freely without permission. Credit is welcome but not required: "Made with Natural Earth."
- **How it was made** (run 2026-11-06):

  ```bash
  npx mapshaper ne_10m_admin_0_countries.shp \
    -filter 'ADM0_A3=="PHL"' -explode \
    -filter-slivers min-area=20km2 -filter 'this.area > 20e6' \
    -simplify 12% keep-shapes -filter-fields \
    -o format=geojson geojson-type=FeatureCollection precision=0.001 data/ph-coast.json
  ```

- **Result:** 80 island polygons, 1,222 points, about 27 KB. Bounds: lng 116.96–126.61, lat 4.72–20.82.
- Small islands under 20 km² are left out, so the map stays readable.
