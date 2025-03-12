import { useCallback, useEffect, useState } from "react";
import { Button, message } from "antd";
import { updateWorkspace } from "@/lib/workspace";
import { deleteField } from "firebase/firestore";
import { useParams, useRevalidator } from "react-router-dom";
import { useWorkspaceLoaderData } from "@/hooks/use-data";
import {
  Marker,
  APIProvider,
  ControlPosition,
  InfoWindow,
  Map,
  useMarkerRef,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { CustomMapControl } from "@/components/google-maps/map-control";
import MapHandler from "@/components/google-maps/map-handler";
import "@/components/google-maps/styles.css";

const usePlacesService = () => {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (!placesLibrary || !map) return;
    setPlacesService(new placesLibrary.PlacesService(map));
  }, [placesLibrary, map]);

  return placesService;
};

export function GoogleSettings() {
  const { workspaceId } = useParams();
  const { workspace } = useWorkspaceLoaderData();

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useMarkerRef();
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const revalidator = useRevalidator();

  const onSubmit = useCallback(
    async (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      if (!workspaceId) {
        void message.error("工作空間 ID 不存在");
        return;
      }

      if (!selectedPlace) {
        void message.error("請選擇一個商家");
        return;
      }

      const placeId = selectedPlace.place_id;
      if (!placeId) {
        void message.error("請選擇一個商家");
        return;
      }

      try {
        await updateWorkspace(workspaceId, {
          googleConfig: {
            placeId,
            name: selectedPlace.name ?? "",
          },
        });
        revalidator.revalidate();
        void message.success("儲存成功");
      } catch (e) {
        void message.error("儲存失敗");
      }
    },
    [selectedPlace, revalidator, workspaceId],
  );

  const onReset = useCallback(
    async (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      if (!workspaceId) {
        void message.error("工作空間 ID 不存在");
        return;
      }

      try {
        await updateWorkspace(workspaceId, {
          googleConfig: deleteField(),
        });
        revalidator.revalidate();
        void message.success("重置成功");
      } catch (e) {
        void message.error("重置失敗");
      }
    },
    [workspaceId, revalidator],
  );

  const ConfigPlace = ({
    placeId,
    place,
    onPlaceCallBack,
  }: {
    placeId?: string;
    place: google.maps.places.PlaceResult | null;
    onPlaceCallBack?: (place: google.maps.places.PlaceResult | null) => void;
  }) => {
    const placesService = usePlacesService();

    useEffect(() => {
      if (!placesService || !placeId) return;

      if (place) {
        return;
      }

      const request = {
        placeId,
        fields: ["geometry", "name", "formatted_address", "place_id", "rating"],
      };

      placesService.getDetails(request, (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        onPlaceCallBack?.(place);
      });
    }, [placesService, placeId, onPlaceCallBack, place]);

    return <></>;
  };

  return (
    <>
      <div className="flex flex-col max-w-3xl">
        <div className="flex-1 flex flex-col justify-between">
          <div className="px-4 divide-y divide-gray-200 sm:px-6">
            <div className="space-y-6 pt-6 pb-5">
              <div className="font-semibold text-lg">選擇你的商家</div>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                  defaultZoom={16}
                  style={{ width: "720px", height: "480px" }}
                  defaultCenter={{
                    lat: 25.032498999999998,
                    lng: 121.56260650000002,
                  }}
                  gestureHandling={"greedy"}
                  disableDefaultUI={true}
                >
                  <Marker
                    ref={markerRef}
                    onClick={() => setInfowindowOpen(true)}
                    position={selectedPlace?.geometry?.location}
                    title={selectedPlace?.name}
                  />
                  {infowindowOpen && (
                    <InfoWindow
                      anchor={marker}
                      maxWidth={360}
                      onCloseClick={() => setInfowindowOpen(false)}
                    >
                      <div>
                        <strong>
                          {selectedPlace?.name} (評價 {selectedPlace?.rating})
                        </strong>
                        <div>{selectedPlace?.formatted_address}</div>
                      </div>
                    </InfoWindow>
                  )}
                  <ConfigPlace
                    placeId={workspace?.googleConfig?.placeId}
                    place={selectedPlace}
                    onPlaceCallBack={(place) => {
                      setSelectedPlace(place);
                      setInfowindowOpen(true);
                    }}
                  />
                </Map>
                <CustomMapControl
                  controlPosition={ControlPosition.TOP}
                  onPlaceSelect={(place) => {
                    setSelectedPlace(place);
                    setInfowindowOpen(true);
                  }}
                />
                <MapHandler place={selectedPlace} />
              </APIProvider>

              <div className="flex flex-col space-y-2 mt-4 mb-2 px-40">
                <Button
                  className="flex-1 ml-1"
                  type="primary"
                  onClick={onSubmit}
                >
                  儲存
                </Button>
                <Button className="flex-1 ml-1" onClick={onReset}>
                  重置
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
