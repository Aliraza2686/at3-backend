const errorHandler = (err, req, res, next) => {
    console.error(err); // Optional: Log errors for debugging
  
    // Prepare the error messages
    const messages = Array.isArray(err.message) ? err.message : [err.message || 'An error occurred'];
  
    // Determine the appropriate status code based on the error type
    const statusCode = err.message && err.message.includes('Unauthorized') ? 401 : 410;
  
    res.status(statusCode).json({
      status: 'error',
      messages, // Send messages as an array
      details: err.details || null, // Optional additional error details
    });
  };
  

  const successHandler = (req, res, next) => {
    // This middleware will handle success responses.
    res.success = (messages, data = {}) => {
      // Ensure messages is an array
      const successMessages = Array.isArray(messages) ? messages : [messages];
      res.status(200).json({
        status: 'success',
        messages: successMessages, // Now sending messages as an array
        data: data, // Any additional data you want to send
      });
    };
    next();
  };
  


  module.exports = {errorHandler , successHandler};
  