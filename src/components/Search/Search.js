import React from 'react';
import GoogleMapLoader from "react-google-maps-loader"
import GooglePlacesSuggest from "react-google-places-suggest"

export default (props) => (
  <GoogleMapLoader
    params={{
      key: props.googlePlacesApiKey,
      libraries: "places,geocode"
    }}
    render={googleMaps =>
      googleMaps && (
        <GooglePlacesSuggest
          googleMaps={googleMaps}
          autocompletionRequest={{
            input: props.search
          }}
          onSelectSuggest={props.selectSuggest}
          textNoResults="No results"
          customRender={prediction => (
            <div className="customWrapper">
              {prediction
                ? prediction.description
                : "No results"}
            </div>
          )}
        >
          <input
            type="text"
            value={props.value}
            placeholder="Search a location"
            onChange={props.inputChange}
          />
        </GooglePlacesSuggest>
      )
    }
  />
);