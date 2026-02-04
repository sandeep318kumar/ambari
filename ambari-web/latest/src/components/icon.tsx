import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClockRotateLeft,
  faCog,
  faDownload,
  faMedkit,
  faPlay,
  faRemove,
  faRepeat,
  faStop,
} from "@fortawesome/free-solid-svg-icons";

export const getIcon = (iconName: string, className: string) => {
  className = "mx-2 " + className;

  switch (iconName) {
    case "play":
      return <FontAwesomeIcon icon={faPlay} className={className} />;
    case "stop":
      return <FontAwesomeIcon icon={faStop} className={className} />;
    case "repeat":
      return <FontAwesomeIcon icon={faRepeat} className={className} />;
    case "cog":
      return <FontAwesomeIcon icon={faCog} className={className} />;
    case "medkit":
      return <FontAwesomeIcon icon={faMedkit} className={className} />;
    case "remove":
      return <FontAwesomeIcon icon={faRemove} className={className} />;
    case "check":
      return <FontAwesomeIcon icon={faCheck} className={className} />;
    case "download":
      return <FontAwesomeIcon icon={faDownload} className={className} />;
    case "clockRotateLeft":
      return <FontAwesomeIcon icon={faClockRotateLeft} className={className} />;
    default:
      return null;
  }
};
