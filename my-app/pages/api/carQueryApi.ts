const Car_API_BASE_URL = 'https://www.carqueryapi.com/api/0.3/';

// Function to handle JSONP requests
const jsonp = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${Math.random().toString(36).substr(2, 16)}`;
    const script = document.createElement('script');

    // Append the callback parameter to the URL as per CarQuery API documentation
    url += `&callback=${callbackName}`;

    // Define the callback function
    (window as any)[callbackName] = (data: any) => {
      resolve(data);
      document.body.removeChild(script);
      delete (window as any)[callbackName];
    };

    script.src = url;
    script.onerror = () => {
      reject(new Error('JSONP request failed'));
      document.body.removeChild(script);
      delete (window as any)[callbackName];
    };

    document.body.appendChild(script);
  });
};

export const fetchMakes = async (year: number): Promise<any> => {
  const response = await jsonp(`${Car_API_BASE_URL}?cmd=getMakes&year=${year}`);
  return response;
};

export const fetchModels = async (year: number, make: string): Promise<any> => {
  const response = await jsonp(`${Car_API_BASE_URL}?cmd=getModels&make=${encodeURIComponent(make)}&year=${year}`);
  return response;
};

export const fetchTrims = async (year: number, make: string, model: string): Promise<any> => {
  const response = await jsonp(`${Car_API_BASE_URL}?cmd=getTrims&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${year}`);
  return response;
};
