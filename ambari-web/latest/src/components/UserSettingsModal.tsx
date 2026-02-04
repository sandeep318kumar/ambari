import { useState, useEffect, useCallback, useContext } from "react";
import { Form, Alert } from "react-bootstrap";
import Modal from "./Modal";
import { getUserTimezone } from "../Utils/Utility";
import { getTimezones } from "../Utils/timezone";
import ClusterApi from "../api/clusterApi";
import useAuth from "../hooks/useAuth";
import { AppContext } from "../store/context";

type UserSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type TimezoneOption = {
  label: string;
  value: string;
};

const UserSettingsModal = ({ isOpen, onClose }: UserSettingsModalProps) => {
  // Get background preferences from AppContext to ensure synchronization
  const { userBgPreferences, setUserBgPreferences } = useContext(AppContext);
  
  // State for settings
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [initialTimezone, setInitialTimezone] = useState("");
  const [timezonesList, setTimezonesList] = useState<TimezoneOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, user } = useAuth();
  const loginName = user?.user_name;
  
  // Use AppContext state for background preferences (inverted logic)
  const isNotShowBgChecked = userBgPreferences;

  // Helper function to generate setting keys
  const getSettingKey = useCallback((setting: string, loginName: string): string => {
    const prefix = 'admin-settings-';
    return `${prefix}${setting}-${loginName}`;
  }, []);

  // Helper function to get a setting value with default
  const getSettingValue = useCallback((userPrefs: any, key: string, defaultValue: any): any => {
    return userPrefs[key] ? JSON.parse(userPrefs[key]) : defaultValue;
  }, []);

  // Helper function to save a setting
  const saveSetting = useCallback(async (key: string, value: any): Promise<void> => {
    await ClusterApi.postPersistData({ [key]: JSON.stringify(value) });
  }, []);

  // Helper function to ensure setting exists with default value
  const ensureSettingExists = useCallback(async (userPrefs: any, key: string, defaultValue: any): Promise<void> => {
    if (userPrefs[key] === undefined) {
      await saveSetting(key, defaultValue);
    }
  }, [saveSetting]);


  // Load user settings from server
  const loadUserSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (loginName) {
        const userPrefs = await ClusterApi.getPersistData() || {};

        // Background preferences are now managed by AppContext, so we don't need to load them here
        // The AppContext already loads and manages the background preferences

        // Load timezone setting
        const timezoneKey = getSettingKey('timezone', loginName);
        const timezoneValue = getSettingValue(userPrefs, timezoneKey, getUserTimezone());
        setSelectedTimezone(timezoneValue);
        setInitialTimezone(timezoneValue);

        // Ensure timezone default value exists
        await ensureSettingExists(userPrefs, timezoneKey, getUserTimezone());
      } else {
        const defaultTimezone = getUserTimezone();
        setSelectedTimezone(defaultTimezone);
        setInitialTimezone(defaultTimezone);
      }
    } catch (error) {
      console.error("Error loading user settings:", error);
      setError("Failed to load user settings");
      const defaultTimezone = getUserTimezone();
      setSelectedTimezone(defaultTimezone);
      setInitialTimezone(defaultTimezone);
    } finally {
      setLoading(false);
    }
  }, [loginName, getSettingKey, getSettingValue, ensureSettingExists]);


  // Load settings on mount
  useEffect(() => {
    setTimezonesList(getTimezones());
    loadUserSettings();
  }, [loadUserSettings]);

  // Check if page needs refresh after saving
  const needsPageRefresh = useCallback(() => {
    return initialTimezone !== selectedTimezone;
  }, [initialTimezone, selectedTimezone]);

  // Save settings to server
  const handleSave = useCallback(async () => {
    try {
      if (loginName) {
        // Background preferences are handled by AppContext, no need to save them here
        // The AppContext setUserBgPreferences function handles the persistence

        // Save timezone setting
        const timezoneKey = getSettingKey('timezone', loginName);
        await saveSetting(timezoneKey, selectedTimezone);

        if (needsPageRefresh()) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error saving user settings:", error);
      setError("Failed to save user settings");
    }

    onClose();
  }, [loginName, selectedTimezone, onClose, needsPageRefresh, getSettingKey, saveSetting]);


  // Modal body content
  const modalBody = (
    <div className="p-3">
      {loading ? (
        <div className="text-center">Loading settings...</div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {/* General Settings Section */}
          <div className="mb-4">
            <h4>General</h4>
            <hr className="mt-2 mb-3" />
            <div className="mb-3">
              <Form.Check
                type="checkbox"
                id="notShowBgOperationsPopup"
                label="Do not show the Background Operations dialog when starting an operation"
                checked={isNotShowBgChecked}
                onChange={(e) => setUserBgPreferences(e.target.checked)}
              />
            </div>
          </div>

          {/* Locale Settings Section */}
          <div className="mb-4">
            <h4>Locale</h4>
            <hr className="mt-2 mb-3" />
            <Form.Group className="mb-3">
              <Form.Label>Timezone</Form.Label>
              <Form.Select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="form-control"
              >
                {timezonesList.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
          {isAdmin() ? (
            <Alert variant="info">This user is an Ambari Admin and has all privileges.</Alert>
          ) : (
            <Alert variant="info">No privileges.</Alert>
          )}
        </>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="User Settings"
      modalBody={modalBody}
      successCallback={handleSave}
      options={{
        modalSize: "modal-lg",
        okButtonText: "SAVE",
        cancelButtonText: "CANCEL",
        okButtonVariant: "success"
      }}
    />
  );
};

export default UserSettingsModal;
