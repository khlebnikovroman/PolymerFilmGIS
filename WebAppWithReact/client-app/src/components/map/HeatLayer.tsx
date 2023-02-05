import {addressPoints} from "./exampleData";
import {HeatmapLayer} from "react-leaflet-heatmap-layer-v3/lib";
import React from "react";

type HeatLayerProps = {}

export const HeatLayer: React.FC = () => {
    return (
        <>
            <HeatmapLayer
                fitBoundsOnLoad
                fitBoundsOnUpdate
                points={addressPoints}
                // @ts-ignore
                longitudeExtractor={m => m[1]}
                // @ts-ignore
                latitudeExtractor={m => m[0]}
                radius={3}
                blur={1}
                // @ts-ignore
                intensityExtractor={m => parseFloat(m[2])}/>

        </>
    )
}