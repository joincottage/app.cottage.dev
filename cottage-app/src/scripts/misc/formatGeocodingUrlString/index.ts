const formatGeocodingUrlString = (location: string) =>
  `https://maps.googleapis.com/maps/api/geocode/json?address=${location.replace(
    " ",
    "+"
  )}&key=AIzaSyBJF0A9_-IKFaxcgvwk03F8uG5qcsxQCGw`;

export default formatGeocodingUrlString;
