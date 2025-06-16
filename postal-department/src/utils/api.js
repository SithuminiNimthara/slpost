import axios from "axios";
import moment from "moment";
import eventMapping from "./eventMapping";

export const fetchItemDetails = async (barcode, setItemDetails, setError) => {
  try {
    const response = await axios.post(
      "https://ec.slpost.gov.lk/slpmail/forwardTrack.php",
      { barcode: barcode.trim().toUpperCase() }, // <-- FIXED KEY HERE
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("Full API Response:", JSON.stringify(response.data, null, 2));

    const trackEvents = response.data?.TrackEvents || [];

    if (trackEvents.length === 0) {
      setItemDetails([]);
      setError("No tracking events found for this barcode.");
      return;
    }

    const formattedData = trackEvents.map((event) => ({
      Eventid: eventMapping[event.Event] || 0,
      EventName: event.Event,
      Tdatetime: moment(event.Date).format("YYYY-MM-DD HH:mm:ss"),
      location_name: event.Office || "Unknown",
    }));

    setItemDetails(formattedData);
    setError("");
  } catch (error) {
    console.error("API Error:", error);
    setError(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to fetch tracking data"
    );
    setItemDetails([]);
  }
};
