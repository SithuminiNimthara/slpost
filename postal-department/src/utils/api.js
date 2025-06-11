import axios from "axios";
import moment from "moment";

export const fetchItemDetails = async (barcode, setItemDetails, setError) => {
  try {
    const response = await axios.post(
      "https://ec.slpost.gov.lk/slpmail/forwardTrack.php",
      {
        tracking_number: barcode,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Raw Response:", response.data); // Log response for debugging

    const trackEvents = response.data?.TrackEvents;

    if (!trackEvents || trackEvents.length === 0) {
      setItemDetails([]);
      setError("No tracking data found.");
      return;
    }

    const formattedData = trackEvents.map((event) => ({
      Eventid: event?.StatusDescription || "Unknown",
      Tdatetime: moment(event?.Date).format("YYYY-MM-DD HH:mm:ss"),
      location_name: event?.Details || "Unknown",
    }));

    setItemDetails(formattedData);
    setError("");
  } catch (error) {
    console.error("API fetch error:", error.response?.data || error.message);
    setError("Error fetching data. Please try again later.");
    setItemDetails([]);
  }
};
