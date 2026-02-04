//@ts-nocheck
import routesList from "./RoutesList";
import { Routes as ReactRoutes, Route } from "react-router-dom";
export default function Routes() {
  return (
    <ReactRoutes>
      {routesList.map(
        (
          { path, Element }: { path?: string; Element: React.FC },
          key: number
        ) => 
          path ? (
            <Route path={path} key={key}></Route>
          ) : null
      )}
    </ReactRoutes>
  );
}
