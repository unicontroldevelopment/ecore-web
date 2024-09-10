export const formatData = (date) => {
    let data = new Date();
  
    if (date.substring(3, 2) === "/") {
      data = new Date(
        date.substr(6, 4) +
          "-" +
          date.substr(3, 2) +
          "-" +
          date.substr(0, 2) +
          " " +
          date.substr(11, 2) +
          ":" +
          date.substr(14, 2)
      );
    } else {
      data = new Date(date);
    }
  
    const day = data.getDate();
    const month = data.getMonth() + 1;
    const year = data.getFullYear();
    const hour = data.getHours();
    const minute = String(data.getMinutes()).padStart(2, "0");
  
    return `${day}/${month}/${year} - ${hour}:${minute}`;
  };