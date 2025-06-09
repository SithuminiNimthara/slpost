import axios from "axios";
import moment from "moment";

export const fetchItemDetails = async (barcode, setItemDetails, setError) => {
  try {
    const response = await axios.get(
      `https://ec.slpost.gov.lk/slpmail/forwardTrack.php?barcode=${encodeURIComponent(
        barcode
      )}`
    );

    // Adjust response parsing as needed based on the actual API response structure
    if (response.data.error) {
      setItemDetails([]);
      setError(response.data.error);
    } else {
      // If response.data is an array of events
      const formattedData = response.data.map((item) => ({
        ...item,
        Tdatetime: moment(item.Tdatetime).format("YYYY-MM-DD HH:mm:ss"),
      }));
      setItemDetails(formattedData);
      setError("");
    }
  } catch (error) {
    setError("Error fetching data");
    setItemDetails([]);
  }
};
