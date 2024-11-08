export const getBackendUrl = () => {
    const currentUrl = window.location.href;
  
    if (currentUrl.includes('dev.socialhear.com')) {
      return 'https://dev-backend.socialhear.com'; // Dev backend
    } else if (currentUrl.includes('socialhear.com')) {
      return 'https://backend.socialhear.com'; // Prod backend
    } 
  };
  