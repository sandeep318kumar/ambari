import { db } from "./db";

export const handleStatusCode = (status: number, responseMessage?: string) => {
  switch (status) {
    case 200:
      console.log("Status code 200: Success.");
      break;

    case 202:
      console.log("Status code 202: Success for creation.");
      break;

    case 400:
      console.log("Error code 400: Bad Request.");
      break;

    case 401:
      console.log("Error code 401: Unauthorized.");
      // Clear auth data
      db.cleanUp();
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = '/#/login';
      break;

    case 402:
      console.log("Error code 402: Payment Required.");
      break;

    case 403:
      console.log("Error code 403: Forbidden.");
      if (responseMessage === "User is disabled") {
        localStorage.setItem('loginMessage', JSON.stringify({
          type: 'alert alert-danger',
          message: 'Your account has been disabled. Please contact your administrator.'
        }));
      } else {
        localStorage.setItem('loginMessage', JSON.stringify({
          type: 'alert alert-danger',
          message: responseMessage || 'Access forbidden. Please check your credentials.'
        }));
      }
      // Clear auth data
      db.cleanUp();
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = '/#/login';
      break;

    case 404:
      console.log("Error code 404: URI not found.");
      break;

    case 500:
      console.log("Error code 500: Internal Error on server side.");
      localStorage.setItem('loginMessage', JSON.stringify({
        type: 'alert alert-danger',
        message: responseMessage || 'Unable to connect to Ambari Server'
      }));
      break;

    case 501:
      console.log("Error code 501: Not implemented yet.");
      break;

    case 502:
      console.log("Error code 502: Services temporarily overloaded.");
      break;

    case 503:
      console.log("Error code 503: Gateway timeout.");
      break;

    default:
      console.log(`Error code ${status}: Unable to connect to Ambari Server`);
      localStorage.setItem('loginMessage', JSON.stringify({
        type: 'alert alert-danger',
        message: 'Unable to connect to Ambari Server'
      }));
      break;
  }
}; 