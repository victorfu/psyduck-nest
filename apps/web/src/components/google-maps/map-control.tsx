import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { PlaceAutocompleteClassic } from "./autocomplete-classic";

interface CustomAutocompleteControlProps {
  controlPosition: ControlPosition;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export const CustomMapControl = ({
  controlPosition,
  onPlaceSelect,
}: CustomAutocompleteControlProps) => {
  return (
    <MapControl position={controlPosition}>
      <div className="autocomplete-control">
        <PlaceAutocompleteClassic onPlaceSelect={onPlaceSelect} />
      </div>
    </MapControl>
  );
};
