import axios from "axios";
import moment from "moment";

export const fetchItemDetails = async (barcode, setItemDetails, setError) => {
  try {
    const response = await axios.get(
      `http://192.168.1.40:5000/track-item?barcode=${barcode}`
    );

    if (response.data.error) {
      setItemDetails([]);
      setError(response.data.error);
    } else {
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
