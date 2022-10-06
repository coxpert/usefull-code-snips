/**
 *  yarn add react-geocode
 *  yarn add @types/react-geocode -D
 */

import Geocode from "react-geocode";

export interface LocationType {
  address: string;
  city: string;
  state: string;
  location: {
    lat: string;
    lng: string;
  };
}

export function getCurrentLocation(
  locale: string = "fr",
  callback: (location: LocationType) => void
) {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("google api key must be defined on .env");
  }
  Geocode.setApiKey(apiKey!);
  Geocode.setRegion(locale);
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude.toString();
    const lng = position.coords.longitude.toString();
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const res = response.results[0];
        const locality = res.address_components.find((item: any) =>
          item.types.includes("locality")
        );
        // eslint-disable-next-line camelcase
        const administrate_level_1 = res.address_components.find((item: any) =>
          item.types.includes("administrative_area_level_1")
        );
        const city: string = locality ? locality.long_name : "";
        // eslint-disable-next-line camelcase
        const state: string = administrate_level_1
          ? administrate_level_1.long_name
          : "";
        const location = {
          address: res.formatted_address!,
          city,
          state,
          location: {
            lat,
            lng,
          },
        };
        callback(location);
      },
      (error) => {
        console.error(error);
      }
    );
  });
}
